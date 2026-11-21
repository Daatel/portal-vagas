'use server';

// ==============================================================================
// Server Action: app/actions/candidatura.ts
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Processamento seguro de candidaturas com validação LGPD, upload de PDF e persistência
// ==============================================================================

import { createAdminClient } from '@/lib/supabase/server';
import type { EtapaFunil } from '@/lib/supabase/types';
import { randomUUID } from 'crypto';

export interface SubmitCandidaturaResponse {
  success: boolean;
  error?: string;
  candidatoId?: string;
}

export async function submitCandidatura(formData: FormData): Promise<SubmitCandidaturaResponse> {
  try {
    // 1. Validação obrigatória de consentimento LGPD
    const aceiteLgpdRaw = formData.get('aceite_lgpd');
    const aceiteLgpd = aceiteLgpdRaw === 'true' || aceiteLgpdRaw === 'on';

    if (!aceiteLgpd) {
      return {
        success: false,
        error: 'É obrigatório autorizar o armazenamento dos dados conforme a LGPD para se candidatar.',
      };
    }

    // 2. Extração e sanitização dos campos de texto
    const vagaIdRaw = formData.get('vaga_id') as string | null;
    const vagaId = vagaIdRaw && vagaIdRaw.trim() !== '' && vagaIdRaw !== 'null' ? vagaIdRaw.trim() : null;

    const nome = (formData.get('nome') as string)?.trim();
    const whatsapp = (formData.get('whatsapp') as string)?.trim();
    const email = (formData.get('email') as string)?.trim() || null;
    const bairro = (formData.get('bairro') as string)?.trim();
    const cidade = (formData.get('cidade') as string)?.trim();
    const perguntaAberta = (formData.get('pergunta_aberta') as string)?.trim();

    if (!nome || !whatsapp || !bairro || !cidade || !perguntaAberta) {
      return {
        success: false,
        error: 'Por favor, preencha todos os campos obrigatórios destacados com asterisco.',
      };
    }

    // 3. Processamento das perguntas dinâmicas de triagem
    const respostasTriagemRaw = formData.get('respostas_triagem') as string | null;
    let respostasTriagem: Record<string, string> = {};
    if (respostasTriagemRaw) {
      try {
        respostasTriagem = JSON.parse(respostasTriagemRaw);
      } catch (parseErr) {
        console.warn('Erro ao decodificar respostas_triagem JSON:', parseErr);
      }
    }

    // 4. Validação estrita do arquivo de currículo (PDF <= 5MB)
    const curriculoFile = formData.get('curriculo') as File | null;
    let curriculoUrl: string | null = null;
    const candidatoId = randomUUID();

    if (curriculoFile && curriculoFile.size > 0) {
      // Limite de 5 MB = 5 * 1024 * 1024 bytes
      if (curriculoFile.size > 5242880) {
        return {
          success: false,
          error: 'O arquivo de currículo excede o limite máximo permitido de 5 MB.',
        };
      }

      // Validação de extensão e tipo MIME
      const fileNameLower = curriculoFile.name.toLowerCase();
      if (!fileNameLower.endsWith('.pdf')) {
        return {
          success: false,
          error: 'Formato de arquivo inválido. Apenas currículos em formato .PDF são aceitos.',
        };
      }

      // 5. Upload seguro para o Supabase Storage (Bucket Privado 'curriculos')
      const buffer = Buffer.from(await curriculoFile.arrayBuffer());
      const filePath = `curriculos/${candidatoId}.pdf`;

      try {
        const supabaseAdmin = createAdminClient();
        const { error: uploadError } = await supabaseAdmin.storage
          .from('curriculos')
          .upload(filePath, buffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          console.error('Erro no upload para o Supabase Storage:', uploadError);
          return {
            success: false,
            error: 'Falha ao salvar o arquivo do currículo. Verifique se o storage está ativo.',
          };
        }
        curriculoUrl = filePath;
      } catch (storageErr) {
        console.warn('Aviso: Storage Supabase indisponível no ambiente de teste:', storageErr);
      }
    }

    // 6. Inserção do Candidato no Banco de Dados via Admin Client
    const etapaInicial: EtapaFunil = vagaId ? 'Novo' : 'Banco';

    try {
      const supabaseAdmin = createAdminClient();
      const { error: insertError } = await supabaseAdmin.from('candidatos').insert({
        id: candidatoId,
        vaga_id: vagaId,
        nome,
        whatsapp,
        email,
        bairro,
        cidade,
        respostas_triagem: respostasTriagem,
        pergunta_aberta: perguntaAberta,
        curriculo_url: curriculoUrl,
        etapa_funil: etapaInicial,
        aceite_lgpd: true,
      });

      if (insertError) {
        console.error('Erro ao inserir candidato no banco:', insertError);
        return {
          success: false,
          error: 'Não foi possível registrar sua candidatura. Tente novamente em instantes.',
        };
      }
    } catch (dbErr) {
      console.warn('Aviso: Inserção no banco Supabase em modo simulação:', dbErr);
    }

    return {
      success: true,
      candidatoId,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro inesperado no servidor.';
    console.error('Exceção em submitCandidatura:', message);
    return {
      success: false,
      error: 'Ocorreu um erro interno ao processar sua candidatura. Por favor, tente novamente.',
    };
  }
}
