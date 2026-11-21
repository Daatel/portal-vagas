// ==============================================================================
// Client: lib/supabase/browser.ts
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Cliente Supabase para Client Components (Browser/Navegador)
// ==============================================================================

import { createBrowserClient as createClientSSR } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Cliente Supabase para Client Components ('use client').
 * Opera no navegador do usuário com suporte a sessão automática via cookies.
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variáveis NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY ausentes.');
  }

  return createClientSSR<Database>(supabaseUrl, supabaseAnonKey);
}
