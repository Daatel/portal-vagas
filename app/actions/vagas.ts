'use server';

// ==============================================================================
// Server Actions: app/actions/vagas.ts
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Operações de CRUD para vagas (inserção, edição, alteração de status e exclusão)
// ==============================================================================

import { createAdminClient } from '@/lib/supabase/server';
import type {
  StatusVaga,
  DepartamentoVaga,
  UnidadeVaga,
  TipoContratoVaga,
  PerguntaTriagem,
} from '@/lib/supabase/types';
import { slugify } from '@/lib/utils/slug';
import { revalidatePath } from 'next/cache';

export interface UpsertVagaResponse {
  success: boolean;
  error?: string;
  vagaId?: string;
  slug?: string;
}

export async function upsertVaga(formData: FormData): Promise<UpsertVagaResponse> {
  try {
    const id = (formData.get('id') as string)?.trim() || null;
    const titulo = (formData.get('titulo') as string)?.trim();
    const departamento = formData.get('departamento') as DepartamentoVaga;
    const unidade = formData.get('unidade') as UnidadeVaga;
    const tipoContrato = formData.get('tipo_contrato') as TipoContratoVaga;
    const descricao = (formData.get('descricao') as string)?.trim();
    const requisitos = (formData.get('requisitos') as string)?.trim();
    const beneficios = (formData.get('beneficios') as string)?.trim() || null;
    const status = (formData.get('status') as StatusVaga) || 'Rascunho';

    if (!titulo || !departamento || !unidade || !tipoContrato || !descricao || !requisitos) {
      return {
        success: false,
        error: 'Preencha todos os campos obrigatórios da vaga.',
      };
    }

    // Processamento das perguntas de triagem (JSONB)
    const perguntasRaw = formData.get('perguntas_triagem') as string | null;
    let perguntasTriagem: PerguntaTriagem[] = [];
    if (perguntasRaw) {
      try {
        perguntasTriagem = JSON.parse(perguntasRaw);
      } catch (e) {
        console.warn('Erro ao decodificar perguntas_triagem:', e);
      }
    }

    const supabase = createAdminClient();

    // Se for criação de nova vaga, gera o slug único
    let slug = (formData.get('slug') as string)?.trim();
    if (!slug) {
      const baseSlug = slugify(titulo);
      slug = baseSlug;

      // Verifica se o slug já existe
      const { data: existente } = await supabase
        .from('vagas')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existente && existente.id !== id) {
        slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }
    }

    let finalId = id;

    if (id) {
      // Atualização de vaga existente
      const { error: updateError } = await supabase
        .from('vagas')
        .update({
          titulo,
          slug,
          departamento,
          unidade,
          tipo_contrato: tipoContrato,
          descricao,
          requisitos,
          beneficios,
          perguntas_triagem: perguntasTriagem,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) {
        console.error('Erro ao atualizar vaga no Supabase:', updateError);
        return { success: false, error: updateError.message };
      }
    } else {
      // Criação de nova vaga
      const { data: inserted, error: insertError } = await supabase
        .from('vagas')
        .insert({
          titulo,
          slug,
          departamento,
          unidade,
          tipo_contrato: tipoContrato,
          descricao,
          requisitos,
          beneficios,
          perguntas_triagem: perguntasTriagem,
          status,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Erro ao inserir vaga no Supabase:', insertError);
        return { success: false, error: insertError.message };
      }

      finalId = inserted?.id || null;
    }

    revalidatePath('/admin/vagas');
    revalidatePath('/vagas');
    if (slug) revalidatePath(`/vagas/${slug}`);

    return {
      success: true,
      vagaId: finalId || undefined,
      slug,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno ao salvar vaga.';
    console.error('Exceção em upsertVaga:', msg);
    return { success: false, error: msg };
  }
}

export async function alterarStatusVaga(
  vagaId: string,
  novoStatus: StatusVaga
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('vagas')
      .update({ status: novoStatus, updated_at: new Date().toISOString() })
      .eq('id', vagaId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/vagas');
    revalidatePath('/vagas');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao alterar status.';
    return { success: false, error: msg };
  }
}
