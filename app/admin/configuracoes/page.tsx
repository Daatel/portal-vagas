// ==============================================================================
// Page: app/admin/configuracoes/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Configurações do portal, conformidade LGPD e política de retenção de currículos
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { getEstatisticasRetencao } from '@/app/actions/expurgo';
import { PainelRetencao } from '@/components/admin/PainelRetencao';
import { Settings, Globe, ShieldCheck, HardDrive } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Configurações & LGPD | Painel RH',
};

export default async function AdminConfiguracoesPage() {
  const stats = await getEstatisticasRetencao();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Topo da Página */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-rf-cinza tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-rf-vermelho" />
            Configurações da Plataforma & LGPD
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Parâmetros de infraestrutura, conformidade com privacidade de dados e política de descarte de currículos.
          </p>
        </div>
      </div>

      {/* Cartões de Parâmetros de Infraestrutura */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-3">
          <Globe className="w-5 h-5 text-rf-vermelho shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rf-cinza block">Domínio & Produção</span>
            <span className="text-gray-500 block mt-0.5 font-mono text-[11px]">
              vagas.rfdis.com.br
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              • Hospedagem Vercel (Edge Network)
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-3">
          <HardDrive className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rf-cinza block">Armazenamento de PDFs</span>
            <span className="text-gray-500 block mt-0.5 font-mono text-[11px]">
              Bucket: curriculos (Privado)
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              • Acesso apenas via Signed URLs
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rf-cinza block">Proteção Anti-Spam</span>
            <span className="text-gray-500 block mt-0.5 font-mono text-[11px]">
              Cloudflare Turnstile
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              • Validação inteligente sem CAPTCHA
            </span>
          </div>
        </div>
      </div>

      {/* Painel Interativo de Retenção e Expurgo LGPD */}
      <PainelRetencao estatisticasIniciais={stats} />
    </main>
  );
}
