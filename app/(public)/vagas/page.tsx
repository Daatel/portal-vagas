// ==============================================================================
// Page: app/(public)/vagas/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Página principal simplificada — Formulário direto Trabalhe Conosco
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
    <main className="min-h-screen bg-gray-50 flex flex-col justify-between selection:bg-[#CBA358] selection:text-[#0A261C]">
      <div>
        {/* Header Oficial da RF Distribuidora */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
          <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
            {/* Logo e Identificação */}
            <a
              href="https://rfdis.com.br"
              className="flex items-center gap-3 group"
              title="Voltar ao site institucional rfdis.com.br"
            >
              <div className="w-10 h-10 rounded bg-[#0F382A] text-[#CBA358] flex items-center justify-center font-extrabold text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
                RF
              </div>
              <div className="flex flex-col">
                <span className="text-[19px] font-bold text-[#0F382A] tracking-tight leading-none">
                  RF Distribuidora
                </span>
                <span className="text-[10px] font-bold text-[#CBA358] tracking-[0.22em] uppercase mt-1">
                  DISTRIBUIÇÃO & REPRESENTAÇÃO
                </span>
              </div>
            </a>

            {/* Links Auxiliares */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <a
                href="https://rfdis.com.br"
                className="hidden sm:inline-flex items-center gap-1.5 text-gray-600 hover:text-[#0F382A] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>rfdis.com.br</span>
              </a>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors py-1.5 px-2.5 rounded-lg border border-transparent hover:border-gray-200"
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
      <footer className="border-t border-gray-200 bg-white py-6 px-4 text-xs text-gray-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} RF Comércio de Produtos Alimentícios Ltda. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.daatel.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-gray-400 hover:text-[#0F382A] transition-colors"
            >
              Powered by <span className="font-semibold text-gray-600">www.daatel.com.br</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
