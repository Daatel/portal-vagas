// ==============================================================================
// Page: app/admin/vagas/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Listagem e gestão central de todas as vagas cadastradas no sistema
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import type { Vaga } from '@/lib/supabase/types';
import { TabelaVagas } from '@/components/admin/TabelaVagas';
import { Plus, Briefcase, CheckCircle, PauseCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gestão de Vagas | Painel RH',
};

async function getTodasVagas(): Promise<Vaga[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('vagas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar todas as vagas:', error.message);
      return [];
    }
    return (data as Vaga[]) || [];
  } catch (err) {
    console.warn('Banco Supabase em modo simulação:', err);
    return [];
  }
}

export default async function AdminVagasPage() {
  const vagas = await getTodasVagas();

  const totalAtivas = vagas.filter((v) => v.status === 'Ativa').length;
  const totalPausadas = vagas.filter((v) => v.status === 'Pausada').length;
  const totalRascunhos = vagas.filter((v) => v.status === 'Rascunho').length;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Topo da Página */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-rf-cinza tracking-tight">
            Gestão de Vagas
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Crie, publique e acompanhe as vagas em aberto para a RF Distribuidora.
          </p>
        </div>

        <Link
          href="/admin/vagas/nova"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rf-vermelho text-white rounded-lg text-xs font-bold hover:bg-rf-vermelho-escuro transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Publicar Nova Vaga
        </Link>
      </div>

      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Total de Vagas
            </span>
            <span className="text-2xl font-bold text-rf-cinza">{vagas.length}</span>
          </div>
          <Briefcase className="w-8 h-8 text-gray-200" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
              Ativas no Site
            </span>
            <span className="text-2xl font-bold text-emerald-700">{totalAtivas}</span>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-100" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
              Pausadas
            </span>
            <span className="text-2xl font-bold text-amber-700">{totalPausadas}</span>
          </div>
          <PauseCircle className="w-8 h-8 text-amber-100" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Rascunhos
            </span>
            <span className="text-2xl font-bold text-gray-600">{totalRascunhos}</span>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-500">
            Edição
          </span>
        </div>
      </div>

      {/* Tabela Interativa */}
      <TabelaVagas vagasIniciais={vagas} />
    </main>
  );
}
