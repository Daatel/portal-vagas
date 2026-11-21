'use server';

// ==============================================================================
// Server Action: app/actions/expurgo.ts
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Gestão da política de retenção de dados e expurgo de currículos (LGPD)
// ==============================================================================

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface EstatisticasRetencao {
  totalCandidatos: number;
  candidatosAntigos: number;
  dataLimite: string;
}

export async function getEstatisticasRetencao(): Promise<EstatisticasRetencao> {
  const limite12Meses = new Date();
  limite12Meses.setFullYear(limite12Meses.getFullYear() - 1);
  const dataLimiteIso = limite12Meses.toISOString();

  try {
    const supabase = createAdminClient();

    // Contagem total de candidatos
    const { count: totalCount } = await supabase
      .from('candidatos')
      .select('id', { count: 'exact', head: true });

    // Contagem de candidatos com mais de 12 meses
    const { count: antigosCount } = await supabase
      .from('candidatos')
      .select('id', { count: 'exact', head: true })
      .lt('created_at', dataLimiteIso);

    return {
      totalCandidatos: totalCount || 0,
      candidatosAntigos: antigosCount || 0,
      dataLimite: limite12Meses.toLocaleDateString('pt-BR'),
    };
  } catch (err) {
    console.warn('Banco Supabase em modo simulação para estatísticas de retenção:', err);
    return {
      totalCandidatos: 0,
      candidatosAntigos: 0,
      dataLimite: limite12Meses.toLocaleDateString('pt-BR'),
    };
  }
}

export async function expurgarCandidatosAntigos(): Promise<{
  success: boolean;
  expurgados: number;
  error?: string;
}> {
  const limite12Meses = new Date();
  limite12Meses.setFullYear(limite12Meses.getFullYear() - 1);
  const dataLimiteIso = limite12Meses.toISOString();

  try {
    const supabase = createAdminClient();

    // 1. Busca todos os candidatos antigos que possuem arquivos para exclusão
    const { data: candidatosParaExpurgo, error: selectError } = await supabase
      .from('candidatos')
      .select('id, curriculo_url')
      .lt('created_at', dataLimiteIso);

    if (selectError) {
      console.error('Erro ao consultar candidatos para expurgo:', selectError.message);
      return { success: false, expurgados: 0, error: selectError.message };
    }

    if (!candidatosParaExpurgo || candidatosParaExpurgo.length === 0) {
      return { success: true, expurgados: 0 };
    }

    // 2. Remove os PDFs do Supabase Storage
    const pathsParaRemover = candidatosParaExpurgo
      .map((c) => c.curriculo_url)
      .filter((url): url is string => Boolean(url));

    if (pathsParaRemover.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('curriculos')
        .remove(pathsParaRemover);

      if (storageError) {
        console.warn('Aviso: Falha ao expurgar arquivos físicos do storage:', storageError.message);
      }
    }

    // 3. Deleta os registros da tabela candidatos
    const idsParaRemover = candidatosParaExpurgo.map((c) => c.id);
    const { error: deleteError } = await supabase
      .from('candidatos')
      .delete()
      .in('id', idsParaRemover);

    if (deleteError) {
      console.error('Erro ao deletar registros de candidatos no banco:', deleteError.message);
      return { success: false, expurgados: 0, error: deleteError.message };
    }

    revalidatePath('/admin/configuracoes');
    revalidatePath('/admin/candidatos');

    return {
      success: true,
      expurgados: idsParaRemover.length,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro durante o expurgo de dados.';
    return { success: false, expurgados: 0, error: msg };
  }
}
