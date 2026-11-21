// ==============================================================================
// Page: app/(public)/banco-de-talentos/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Cadastro de currículo geral no Banco de Talentos da RF Distribuidora
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FormularioCandidatura } from '@/components/vagas/FormularioCandidatura';
import { ArrowLeft, Sparkles, Building2, Users2, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Banco de Talentos | RF Distribuidora',
  description:
    'Cadastre seu currículo no Banco de Talentos da RF Distribuidora. Nossos recrutadores consultam esta base com prioridade para novas oportunidades.',
  openGraph: {
    title: 'Banco de Talentos | RF Distribuidora Carreiras',
    description:
      'Mesmo sem uma vaga aberta específica para o seu perfil no momento, cadastre seu currículo e venha crescer com a gente.',
    url: 'https://vagas.rfdis.com.br/banco-de-talentos',
    siteName: 'RF Distribuidora',
    type: 'website',
  },
};

export default function BancoDeTalentosPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Header com Navegação */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
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
            Ver vagas abertas
          </Link>
        </div>
      </header>

      {/* Hero Motivacional do Banco de Talentos */}
      <section className="bg-rf-cinza text-white py-12 px-4 border-b-4 border-rf-vermelho">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rf-vermelho bg-white/10 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Oportunidades Futuras
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
            Faça Parte do Nosso Banco de Talentos
          </h1>
          <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Não encontrou uma vaga aberta com o seu perfil no momento? Deixe seu currículo e seus dados com a gente. Nossa equipe de RH consulta essa base antes de abrir seleções externas.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-white/10 text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <Users2 className="w-4 h-4 text-rf-vermelho" />
              <span>Prioridade em novas vagas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-rf-vermelho" />
              <span>Vendas, Logística e Escritório</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacidade 100% LGPD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo com Formulário Reutilizado */}
      <div className="max-w-3xl mx-auto px-4 -mt-6">
        <FormularioCandidatura vagaId={null} perguntas={[]} />
      </div>
    </main>
  );
}
