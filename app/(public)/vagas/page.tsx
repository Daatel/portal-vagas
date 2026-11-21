// ==============================================================================
// Page: app/(public)/vagas/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Mural público de vagas abertas com busca e filtro por departamento
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import type { Vaga, DepartamentoVaga } from '@/lib/supabase/types';
import { ListaVagas } from '@/components/vagas/ListaVagas';
import Link from 'next/link';
import { Building2, Users, Award, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Vagas e Oportunidades | RF Distribuidora',
  description:
    'Encontre oportunidades de carreira na RF Distribuidora. Vagas em vendas, logística, frota e administração no Rio de Janeiro.',
  openGraph: {
    title: 'Trabalhe Conosco | RF Distribuidora',
    description:
      'Faça parte do time da maior distribuidora de alimentos e bens de consumo do Estado do Rio de Janeiro.',
    url: 'https://vagas.rfdis.com.br/vagas',
    siteName: 'RF Distribuidora - Portal de Vagas',
    type: 'website',
  },
};

interface VagasPageProps {
  searchParams: {
    departamento?: string;
  };
}

async function getVagasAtivas(departamento?: string): Promise<Vaga[]> {
  try {
    const supabase = createServerClient();
    let query = supabase
      .from('vagas')
      .select('*')
      .eq('status', 'Ativa')
      .order('created_at', { ascending: false });

    if (departamento && departamento.trim()) {
      query = query.eq('departamento', departamento as DepartamentoVaga);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Erro ao buscar vagas ativas:', error.message);
      return [];
    }
    return (data as Vaga[]) || [];
  } catch (err) {
    console.warn('Aviso: Conexão com Supabase indisponível no momento:', err);
    return [];
  }
}

export default async function VagasPage({ searchParams }: VagasPageProps) {
  const vagas = await getVagasAtivas(searchParams.departamento);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        {/* Header / Navbar Pública */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/vagas" className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-rf-cinza">
                RF <span className="text-rf-vermelho">DISTRIBUIDORA</span>
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-500 ml-2">
                Carreiras
              </span>
            </Link>

            <nav className="flex items-center gap-4 text-xs md:text-sm font-medium">
              <Link
                href="/banco-de-talentos"
                className="text-gray-600 hover:text-rf-vermelho transition-colors"
              >
                Banco de Talentos
              </Link>
              <Link
                href="/admin/login"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Acesso RH
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="bg-rf-cinza text-white py-14 px-4 border-b-4 border-rf-vermelho">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-rf-vermelho bg-white/10 px-3 py-1 rounded-full mb-4">
              Faça Parte da Nossa Equipe
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Construa o Futuro da Distribuição no Rio de Janeiro
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Descubra oportunidades em nosso Centro Logístico, rotas de entrega e operações comerciais. Junte-se a uma empresa sólida em constante expansão.
            </p>

            {/* Diferenciais da Empresa */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-left">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Building2 className="w-4 h-4 text-rf-vermelho shrink-0" />
                <span>Estrutura Própria</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Users className="w-4 h-4 text-rf-vermelho shrink-0" />
                <span>Cultura Colaborativa</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Award className="w-4 h-4 text-rf-vermelho shrink-0" />
                <span>Oportunidade Real</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <ShieldCheck className="w-4 h-4 text-rf-vermelho shrink-0" />
                <span>Processo 100% LGPD</span>
              </div>
            </div>
          </div>
        </section>

        {/* Listagem Interativa */}
        <ListaVagas vagas={vagas} />
      </div>

      {/* Rodapé Corporativo */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} RF Distribuidora de Produtos Alimentícios Ltda. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-gray-400">
            <Link href="https://rfdis.com.br" target="_blank" className="hover:text-rf-cinza transition-colors">
              rfdis.com.br
            </Link>
            <span>•</span>
            <Link href="/banco-de-talentos" className="hover:text-rf-cinza transition-colors">
              Envie seu Currículo
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
