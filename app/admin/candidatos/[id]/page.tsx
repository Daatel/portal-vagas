// ==============================================================================
// Page: app/admin/candidatos/[id]/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Ficha detalhada do candidato com PDF viewer seguro, scorecard e WhatsApp 1-clique
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import type { Vaga, PerguntaTriagem } from '@/lib/supabase/types';
import { ScorecardEditor } from '@/components/admin/ScorecardEditor';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  FileText,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface CandidatoDetailPageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ficha do Candidato | Painel RH RF Distribuidora',
  };
}

export default async function CandidatoDetailPage({ params }: CandidatoDetailPageProps) {
  const supabase = createAdminClient();

  // 1. Busca do candidato com junção na vaga
  const { data: candidato, error } = await supabase
    .from('candidatos')
    .select('*, vagas(id, titulo, departamento, unidade, tipo_contrato, perguntas_triagem)')
    .eq('id', params.id)
    .single();

  if (error || !candidato) {
    notFound();
  }

  // 2. Geração de Signed URL segura para o PDF (1 hora de validade LGPD)
  let signedPdfUrl: string | null = null;
  if (candidato.curriculo_url) {
    try {
      const { data: signedData } = await supabase.storage
        .from('curriculos')
        .createSignedUrl(candidato.curriculo_url, 3600);

      signedPdfUrl = signedData?.signedUrl || null;
    } catch (storageErr) {
      console.warn('Aviso: Não foi possível gerar Signed URL do storage:', storageErr);
    }
  }

  // 3. Montagem do link para contato 1-Clique via WhatsApp
  const whatsappClean = candidato.whatsapp.replace(/\D/g, '');
  const vagaTitulo = (candidato.vagas as unknown as Pick<Vaga, 'titulo'>)?.titulo || 'nosso Banco de Talentos';
  const templateMensagem = `Olá ${candidato.nome}, somos do setor de Recursos Humanos da RF Distribuidora. Analisamos seu currículo para a oportunidade de ${vagaTitulo} e gostaríamos de agendar uma conversa inicial. Você teria disponibilidade?`;
  const whatsappLink = `https://wa.me/55${whatsappClean}?text=${encodeURIComponent(templateMensagem)}`;

  // 4. Mapeamento das perguntas de triagem da vaga
  const perguntasDaVaga: PerguntaTriagem[] = Array.isArray(
    (candidato.vagas as unknown as { perguntas_triagem?: PerguntaTriagem[] })?.perguntas_triagem
  )
    ? (candidato.vagas as unknown as { perguntas_triagem: PerguntaTriagem[] }).perguntas_triagem
    : [];

  const respostasTriagem = (candidato.respostas_triagem as Record<string, string>) || {};

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Barra de Navegação e Atalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/admin/candidatos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rf-green transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para o Funil de Candidatos
        </Link>

        {/* Botão WhatsApp 1-Clique */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Iniciar Contato no WhatsApp</span>
        </a>
      </div>

      {/* Cartão de Identificação Principal */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                Etapa: {candidato.etapa_funil}
              </span>
              {vagaTitulo ? (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                  {vagaTitulo}
                </span>
              ) : null}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {candidato.nome}
            </h1>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-gray-400 block">
              Inscrição Realizada
            </span>
            <span className="text-xs font-medium text-gray-600">
              {new Date(candidato.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Grade de Contatos e Localização */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="flex items-center gap-2.5 text-gray-700">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">WhatsApp</span>
              <span className="font-semibold">{candidato.whatsapp}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <Mail className="w-4 h-4 text-rf-gold shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">E-mail</span>
              <span className="font-semibold truncate">{candidato.email || 'Não informado'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <MapPin className="w-4 h-4 text-rf-green shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Bairro e Cidade</span>
              <span className="font-semibold">{candidato.bairro}, {candidato.cidade}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">LGPD</span>
              <span className="font-semibold text-emerald-700">Aceite Registrado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Triagem e Visualizador de PDF */}
        <div className="lg:col-span-2 space-y-8">
          {/* Apresentação Pessoal / Pergunta Aberta */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rf-green" />
              Apresentação e Motivação do Candidato
            </h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed whitespace-pre-line italic">
              &quot;{candidato.pergunta_aberta}&quot;
            </div>
          </div>

          {/* Respostas de Triagem da Vaga */}
          {perguntasDaVaga.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Respostas das Perguntas de Triagem
              </h3>

              <div className="space-y-3">
                {perguntasDaVaga.map((p, idx) => {
                  const resposta = respostasTriagem[p.id] || 'Não respondeu';
                  return (
                    <div
                      key={p.id || idx}
                      className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                    >
                      <div className="text-xs">
                        <span className="font-semibold text-gray-800 block">
                          {p.texto}
                        </span>
                        {p.eliminatoria && (
                          <span className="text-[10px] text-rf-gold font-bold">
                            Critério Eliminatório
                          </span>
                        )}
                      </div>
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white border border-gray-200 text-gray-900">
                        {resposta}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Visualizador de Currículo em PDF (Viewer Embutido) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-rf-green" />
                Currículo em PDF
              </h3>
              {signedPdfUrl && (
                <a
                  href={signedPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-rf-green hover:text-rf-gold hover:underline font-semibold transition-colors"
                >
                  <span>Abrir em nova aba</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {signedPdfUrl ? (
              <div className="w-full h-[650px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                <iframe
                  src={signedPdfUrl}
                  title={`Currículo de ${candidato.nome}`}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="p-8 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-500">
                O candidato não anexou arquivo em PDF ou o arquivo está indisponível.
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Scorecard e Parecer de RH */}
        <div>
          <ScorecardEditor
            candidatoId={candidato.id}
            initialNotas={{
              tecnica: candidato.nota_tecnica,
              logistica: candidato.nota_logistica,
              comunicacao: candidato.nota_comunicacao,
            }}
            initialObservacoes={candidato.observacoes_rh}
          />
        </div>
      </div>
    </main>
  );
}
