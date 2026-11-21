// ==============================================================================
// Client: lib/supabase/client.ts
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Inicialização tipada do Supabase para Browser, Server e Admin (Service Role)
// ==============================================================================

import { createBrowserClient as createClientSSR } from '@supabase/ssr';
import { createServerClient as createServerSSR, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from './types';

/**
 * Cliente Supabase para uso em Client Components (Browser).
 * Gerencia a sessão do usuário de forma automática no navegador.
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variáveis NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY ausentes.');
  }

  return createClientSSR<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route Handlers.
 * Acessa os cookies da requisição HTTP via next/headers de forma segura.
 */
export function createServerClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variáveis NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY ausentes.');
  }

  return createServerSSR<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // O método `setAll` foi chamado em um Server Component.
          // Ignorado caso o middleware já renove a sessão.
        }
      },
    },
  });
}

/**
 * Cliente Supabase Administrativo com privilégios de Service Role.
 * Usado exclusivamente no backend (Server Actions / Route Handlers) para operações restritas:
 * - Geração de Signed URLs para visualização segura de PDFs (LGPD)
 * - Expurgo e retenção de currículos antigos
 * - Uploads sem restrição de RLS
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Variável SUPABASE_SERVICE_ROLE_KEY ausente para o createAdminClient.');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
