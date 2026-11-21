// ==============================================================================
// Page: app/admin/vagas/[action]/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Criação ou edição de vaga no painel administrativo
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import type { Vaga } from '@/lib/supabase/types';
import { FormularioVaga } from '@/components/admin/FormularioVaga';

interface AdminVagaActionPageProps {
  params: {
    action: string; // 'nova' ou ID da vaga
  };
}

export const dynamic = 'force-dynamic';

async function getVagaPorId(id: string): Promise<Vaga | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('vagas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as Vaga;
  } catch (err) {
    console.warn('Erro ao consultar vaga para edição:', err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: AdminVagaActionPageProps): Promise<Metadata> {
  const isNova = params.action === 'nova';
  return {
    title: isNova ? 'Cadastrar Nova Vaga | Painel RH' : 'Editar Vaga | Painel RH',
  };
}

export default async function AdminVagaActionPage({
  params,
}: AdminVagaActionPageProps) {
  const isNova = params.action === 'nova';
  let vagaExistente: Vaga | null = null;

  if (!isNova) {
    vagaExistente = await getVagaPorId(params.action);
    if (!vagaExistente) {
      notFound();
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-rf-cinza tracking-tight">
          {isNova ? 'Cadastrar Nova Oportunidade' : `Editar Vaga: ${vagaExistente?.titulo}`}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {isNova
            ? 'Defina o cargo, detalhes contratuais e perguntas de triagem da nova vaga.'
            : 'Atualize os requisitos, status ou critérios de seleção desta vaga.'}
        </p>
      </div>

      <FormularioVaga vagaExistente={vagaExistente} />
    </main>
  );
}
