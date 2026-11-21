'use server';

// ==============================================================================
// Server Action: app/actions/candidatos.ts
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Operações de movimentação de candidatos no funil e gestão de recrutamento
// ==============================================================================

import { createAdminClient } from '@/lib/supabase/server';
import type { EtapaFunil } from '@/lib/supabase/types';
import { revalidatePath } from 'next/cache';

export async function moverEtapaFunil(
  candidatoId: string,
  novaEtapa: EtapaFunil
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('candidatos')
      .update({ etapa_funil: novaEtapa })
      .eq('id', candidatoId);

    if (error) {
      console.error('Erro ao mover candidato de etapa:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/candidatos');
    revalidatePath(`/admin/candidatos/${candidatoId}`);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao atualizar etapa do funil.';
    return { success: false, error: msg };
  }
}
