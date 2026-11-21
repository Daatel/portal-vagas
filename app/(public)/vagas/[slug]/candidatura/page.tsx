// ==============================================================================
// Page: app/(public)/vagas/[slug]/candidatura/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Página pública de envio de candidatura para a vaga selecionada
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import type { Vaga, PerguntaTriagem } from '@/lib/supabase/types';
import { FormularioCandidatura } from '@/components/vagas/FormularioCandidatura';
import { ArrowLeft, MapPin } from 'lucide-react';

interface CandidaturaPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

async function getVagaPorSlug(slug: string): Promise<Vaga | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('vagas')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'Ativa')
      .single();

    if (error || !data) {
      return null;
    }
    return data as Vaga;
  } catch (err) {
    console.warn('Erro ao consultar vaga para candidatura:', err);
    return null;
  }
}

export async function generateMetadata({ params }: CandidaturaPageProps): Promise<Metadata> {
  const vaga = await getVagaPorSlug(params.slug);

  if (!vaga) {
    return {
      title: 'Candidatura | RF Distribuidora',
    };
  }

  return {
    title: `Candidatar-se: ${vaga.titulo} | RF Distribuidora`,
    description: `Envie seu currículo para a vaga de ${vaga.titulo} na RF Distribuidora. Processo simplificado e seguro.`,
  };
}

export default async function CandidaturaPage({ params }: CandidaturaPageProps) {
  const vaga = await getVagaPorSlug(params.slug);

  if (!vaga) {
    notFound();
  }

  const perguntasTriagem = (vaga.perguntas_triagem as PerguntaTriagem[]) || [];

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Header com Navegação */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/vagas" className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-rf-cinza">
              RF <span className="text-rf-vermelho">DISTRIBUIDORA</span>
            </span>
          </Link>
          <Link
            href={`/vagas/${vaga.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-rf-vermelho transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para detalhes da vaga
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-8">
        {/* Card do Resumo da Vaga Aplicada */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-rf-vermelho">
            Formulário de Inscrição
          </span>
          <h1 className="text-2xl font-bold text-rf-cinza mt-1 mb-2">
            {vaga.titulo}
          </h1>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rf-vermelho" />
              <span>{vaga.unidade}</span>
            </div>
            <span>•</span>
            <span>Departamento: {vaga.departamento}</span>
            <span>•</span>
            <span>Regime: {vaga.tipo_contrato}</span>
          </div>
        </div>

        {/* Formulário Inteligente de Candidatura */}
        <FormularioCandidatura vagaId={vaga.id} perguntas={perguntasTriagem} />
      </div>
    </main>
  );
}
