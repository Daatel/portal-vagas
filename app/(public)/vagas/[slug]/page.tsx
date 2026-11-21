// ==============================================================================
// Page: app/(public)/vagas/[slug]/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Detalhe completo da vaga com SEO dinâmico e Schema JSON-LD JobPosting
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/client';
import type { Vaga } from '@/lib/supabase/types';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Gift,
  ArrowLeft,
  ArrowRight,
  Share2,
  Building2,
  Calendar,
} from 'lucide-react';

interface VagaDetailPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

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
    console.warn('Erro ao consultar vaga por slug:', err);
    return null;
  }
}

export async function generateMetadata({ params }: VagaDetailPageProps): Promise<Metadata> {
  const vaga = await getVagaPorSlug(params.slug);

  if (!vaga) {
    return {
      title: 'Vaga não encontrada | RF Distribuidora',
      description: 'A vaga solicitada não existe ou foi encerrada.',
    };
  }

  const shortDesc = vaga.requisitos
    ? vaga.requisitos.substring(0, 155).replace(/\n/g, ' ') + '...'
    : `Oportunidade para ${vaga.titulo} na RF Distribuidora.`;

  return {
    title: `${vaga.titulo} | RF Distribuidora Carreiras`,
    description: shortDesc,
    openGraph: {
      title: `${vaga.titulo} - RF Distribuidora`,
      description: shortDesc,
      url: `https://vagas.rfdis.com.br/vagas/${vaga.slug}`,
      siteName: 'RF Distribuidora',
      type: 'article',
    },
  };
}

export default async function VagaDetailPage({ params }: VagaDetailPageProps) {
  const vaga = await getVagaPorSlug(params.slug);

  if (!vaga) {
    notFound();
  }

  // Schema JSON-LD JobPosting para indexação no Google Empregos (Google Jobs)
  const jobPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: vaga.titulo,
    description: `${vaga.descricao}\n\nRequisitos:\n${vaga.requisitos}${
      vaga.beneficios ? `\n\nBenefícios:\n${vaga.beneficios}` : ''
    }`,
    datePosted: vaga.created_at,
    validThrough: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType:
      vaga.tipo_contrato === 'CLT'
        ? 'FULL_TIME'
        : vaga.tipo_contrato === 'Temporario'
        ? 'TEMPORARY'
        : 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'RF Distribuidora de Produtos Alimentícios Ltda',
      sameAs: 'https://rfdis.com.br',
      logo: 'https://rfdis.com.br/logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: vaga.unidade.includes('Barra') ? 'Rio de Janeiro' : 'Itaboraí',
        addressRegion: 'RJ',
        addressCountry: 'BR',
      },
    },
  };

  const requisitosLista = vaga.requisitos
    .split('\n')
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  const beneficiosLista = vaga.beneficios
    ? vaga.beneficios
        .split('\n')
        .map((b) => b.trim())
        .filter((b) => b.length > 0)
    : [];

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Injeção estruturada Schema.org para o Google Empregos */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />

      {/* Header com Navegação */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/vagas" className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-rf-cinza">
              RF <span className="text-rf-vermelho">DISTRIBUIDORA</span>
            </span>
          </Link>
          <Link
            href="/vagas"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-rf-vermelho transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para o mural de vagas
          </Link>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/vagas" className="hover:text-rf-cinza transition-colors">
            Início
          </Link>
          <span>/</span>
          <Link
            href={`/vagas?departamento=${vaga.departamento}`}
            className="hover:text-rf-cinza transition-colors"
          >
            {vaga.departamento}
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{vaga.titulo}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal: Detalhes da Vaga */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header da Vaga */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-rf-vermelho border border-red-100">
                  {vaga.departamento}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Regime {vaga.tipo_contrato}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-rf-cinza mb-4 tracking-tight">
                {vaga.titulo}
              </h1>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rf-vermelho" />
                  <span>{vaga.unidade}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Presencial / Escala da Unidade</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Vaga aberta recentemente</span>
                </div>
              </div>
            </div>

            {/* Descrição das Atividades */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-rf-cinza mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-rf-vermelho" />
                Descrição das Atividades
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {vaga.descricao}
              </div>
            </div>

            {/* Requisitos e Qualificações */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-rf-cinza mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rf-vermelho" />
                Requisitos e Qualificações
              </h2>
              <ul className="space-y-2.5">
                {requisitosLista.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rf-vermelho mt-2 shrink-0" />
                    <span>{req.replace(/^[•\-\*]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefícios */}
            {beneficiosLista.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-rf-cinza mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-rf-vermelho" />
                  Benefícios e Vantagens
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {beneficiosLista.map((ben, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{ben.replace(/^[•\-\*]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Coluna Lateral: CTA Card de Candidatura */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-rf-cinza mb-2">
                Pronto para dar o próximo passo?
              </h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                O processo é 100% online, direto com a equipe de RH da RF Distribuidora e leva menos de 3 minutos.
              </p>

              <Link
                href={`/vagas/${vaga.slug}/candidatura`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-rf-vermelho text-white font-semibold rounded-lg hover:bg-rf-vermelho-escuro shadow-md hover:shadow-lg transition-all text-sm mb-4"
              >
                Candidatar-se para esta vaga
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>Unidade: <strong>{vaga.unidade}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Contrato: <strong>{vaga.tipo_contrato}</strong></span>
                </div>
              </div>

              {/* Botão de Compartilhamento */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Confira esta vaga de ${vaga.titulo} na RF Distribuidora: https://vagas.rfdis.com.br/vagas/${vaga.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Indicar vaga via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
