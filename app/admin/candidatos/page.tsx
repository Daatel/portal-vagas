// ==============================================================================
// Page: app/admin/candidatos/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Visualização e triagem de candidatos em funil Kanban interativo
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/server';
import type { CandidatoComVaga, Vaga } from '@/lib/supabase/types';
import { KanbanFunil } from '@/components/admin/KanbanFunil';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Funil de Candidatos (Kanban) | Painel RH',
};

async function getDadosFunil(): Promise<{
  candidatos: CandidatoComVaga[];
  vagas: Pick<Vaga, 'id' | 'titulo'>[];
}> {
  try {
    const supabase = createAdminClient();

    // Busca de candidatos com junção no título da vaga
    const { data: candidatosData, error: candError } = await supabase
      .from('candidatos')
      .select('*, vagas(titulo)')
      .order('created_at', { ascending: false });

    if (candError) {
      console.error('Erro ao buscar candidatos para o funil:', candError.message);
    }

    // Busca de vagas para o seletor de filtros
    const { data: vagasData } = await supabase
      .from('vagas')
      .select('id, titulo')
      .order('titulo', { ascending: true });

    return {
      candidatos: (candidatosData as unknown as CandidatoComVaga[]) || [],
      vagas: (vagasData as Pick<Vaga, 'id' | 'titulo'>[]) || [],
    };
  } catch (err) {
    console.warn('Banco Supabase em modo simulação:', err);
    return { candidatos: [], vagas: [] };
  }
}

export default async function AdminCandidatosPage() {
  const { candidatos, vagas } = await getDadosFunil();

  return (
    <main className="max-w-[1700px] mx-auto px-4 py-8">
      {/* Topo da Página */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-rf-cinza tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-rf-vermelho" />
            Funil de Candidatos (Mini-ATS)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Arraste os candidatos entre as etapas ou utilize as ações rápidas para gerenciar o processo seletivo.
          </p>
        </div>
      </div>

      {/* Quadro Kanban */}
      <KanbanFunil candidatosIniciais={candidatos} vagasDisponiveis={vagas} />
    </main>
  );
}
