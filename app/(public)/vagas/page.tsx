// ==============================================================================
// Page: app/(public)/vagas/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Página principal com identidade visual oficial da RF Distribuidora
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FormularioDireto } from '@/components/vagas/FormularioDireto';
import { ArrowLeft, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Trabalhe Conosco | RF Distribuidora',
  description:
    'Envie seu currículo diretamente para a equipe de Recursos Humanos da RF Distribuidora de Alimentos.',
  openGraph: {
    title: 'Trabalhe Conosco | RF Distribuidora',
    description:
      'Envie seu currículo para a equipe de Recursos Humanos da RF Distribuidora.',
    url: 'https://vagas.rfdis.com.br',
    siteName: 'RF Distribuidora',
    type: 'website',
  },
};

export default function VagasPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] flex flex-col justify-between selection:bg-rf-gold selection:text-rf-green-dark">
      <div>
        {/* Header Oficial da RF Distribuidora */}
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-xs">
          <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
            {/* Logo e Identificação Oficial */}
            <a
              href="https://rfdis.com.br"
              className="flex items-center gap-3 group"
              title="Voltar ao site institucional rfdis.com.br"
            >
              <img
                src="/rf-monogram.png"
                alt="RF Distribuidora"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-[20px] font-bold text-rf-green tracking-tight leading-none group-hover:text-rf-green-light transition-colors">
                  RF Distribuidora
                </span>
                <span className="text-[10px] font-bold text-rf-gold tracking-[0.22em] uppercase mt-1">
                  DISTRIBUIÇÃO & REPRESENTAÇÃO
                </span>
              </div>
            </a>

            {/* Links Auxiliares */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
              <a
                href="https://rfdis.com.br"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-rf-green hover:text-rf-gold hover:bg-gray-50 border border-gray-200 transition-all shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao site</span>
              </a>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-gray-400 hover:text-rf-green transition-colors py-1.5 px-2.5 rounded-lg border border-transparent hover:border-gray-200"
                title="Acesso restrito para recrutadores do RH"
              >
                <Lock className="w-3 h-3" />
                <span>Acesso RH</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Área do Formulário */}
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <FormularioDireto />
        </div>
      </div>

      {/* Rodapé Oficial da RF Distribuidora */}
      <footer className="bg-[#0A261C] text-gray-300 py-10 px-4 mt-12 border-t border-[#CBA358]/40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img
              src="/rf-monogram-white.png"
              alt="RF Distribuidora"
              className="h-9 w-auto object-contain opacity-90"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-white tracking-tight leading-none">
                RF Distribuidora
              </span>
              <span className="text-[9px] font-bold text-rf-gold tracking-[0.2em] uppercase mt-1">
                DISTRIBUIÇÃO & REPRESENTAÇÃO
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} RF Comércio de Produtos Alimentícios Ltda. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-5 text-xs">
            <a
              href="https://rfdis.com.br"
              className="text-gray-300 hover:text-rf-gold transition-colors inline-flex items-center gap-1"
            >
              <span>Site Principal</span>
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="https://www.daatel.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-gray-400/80 hover:text-rf-gold transition-colors tracking-wide"
            >
              Powered by <span className="font-medium text-gray-300 hover:text-rf-gold">www.daatel.com.br</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

