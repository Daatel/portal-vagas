'use server';

// ==============================================================================
// Server Action: app/actions/scorecard.ts
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Persistência de notas do Scorecard (1-5) e observações de entrevistas do RH
// ==============================================================================

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function salvarScorecard(
  id: string,
  notas: { tecnica: number; logistica: number; comunicacao: number }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('candidatos')
      .update({
        nota_tecnica: notas.tecnica,
        nota_logistica: notas.logistica,
        nota_comunicacao: notas.comunicacao,
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao salvar scorecard:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath(`/admin/candidatos/${id}`);
    revalidatePath('/admin/candidatos');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao salvar notas.';
    return { success: false, error: msg };
  }
}

export async function salvarObservacoes(
  id: string,
  texto: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('candidatos')
      .update({
        observacoes_rh: texto,
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao salvar observações de RH:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath(`/admin/candidatos/${id}`);
    revalidatePath('/admin/candidatos');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao salvar anotações.';
    return { success: false, error: msg };
  }
}
