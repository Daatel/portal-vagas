'use client';

// ==============================================================================
// Component: components/vagas/ListaVagas.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Componente interativo de listagem, filtros por departamento e busca de vagas
// ==============================================================================

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Vaga } from '@/lib/supabase/types';
import { Briefcase, MapPin, ArrowRight, Search } from 'lucide-react';

interface ListaVagasProps {
  vagas: Vaga[];
}

const DEPARTAMENTOS: { label: string; value: string }[] = [
  { label: 'Todos os Setores', value: '' },
  { label: 'Comercial', value: 'Comercial' },
  { label: 'Logística', value: 'Logistica' },
  { label: 'Administrativo', value: 'Administrativo' },
  { label: 'Frota & Entregas', value: 'Frota' },
];

export function ListaVagas({ vagas }: ListaVagasProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentDepartamento = searchParams.get('departamento') || '';
  const [termoBusca, setTermoBusca] = useState('');

  const handleSelectDepartamento = (depto: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (depto) {
        params.set('departamento', depto);
      } else {
        params.delete('departamento');
      }
      router.push(`/vagas?${params.toString()}`);
    });
  };

  // Filtro client-side adicional pelo termo digitado na busca
  const vagasFiltradas = vagas.filter((vaga) => {
    if (!termoBusca.trim()) return true;
    const termo = termoBusca.toLowerCase();
    return (
      vaga.titulo.toLowerCase().includes(termo) ||
      vaga.unidade.toLowerCase().includes(termo) ||
      vaga.departamento.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Barra de Filtros e Busca */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar vagas por cargo ou região..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-gold/40 focus:border-rf-green transition-all"
            />
          </div>

          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider self-start md:self-auto">
            {vagasFiltradas.length} {vagasFiltradas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          </span>
        </div>

        {/* Abas de Departamentos */}
        <div className="flex flex-wrap gap-2">
          {DEPARTAMENTOS.map((dep) => {
            const isSelected = currentDepartamento === dep.value;
            return (
              <button
                key={dep.value}
                onClick={() => handleSelectDepartamento(dep.value)}
                disabled={isPending}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-rf-green text-white shadow-sm'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {dep.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Cards de Vagas */}
      {vagasFiltradas.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Nenhuma oportunidade aberta com estes filtros
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Não encontramos vagas ativas para a seleção atual. Você pode cadastrar seu currículo diretamente em nosso formulário direto.
          </p>
          <Link
            href="/vagas"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rf-green hover:bg-rf-green-light text-white rounded-lg text-sm font-medium transition-all"
          >
            Cadastrar Currículo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vagasFiltradas.map((vaga) => (
            <div
              key={vaga.id}
              className="group bg-white rounded-xl border border-gray-200 hover:border-rf-gold/50 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Badges de Topo */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-rf-green border border-emerald-100">
                    {vaga.departamento}
                  </span>
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                    {vaga.tipo_contrato}
                  </span>
                </div>

                {/* Título da Vaga */}
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-rf-green transition-colors mb-2 line-clamp-2">
                  {vaga.titulo}
                </h3>

                {/* Localização / Unidade */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{vaga.unidade}</span>
                </div>

                {/* Prévia da Descrição */}
                <p className="text-xs text-gray-600 line-clamp-3 mb-6">
                  {vaga.descricao}
                </p>
              </div>

              {/* Botão de Ação */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Publicado recentemente
                </span>
                <Link
                  href={`/vagas/${vaga.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rf-green hover:text-rf-gold group-hover:translate-x-1 transition-all"
                >
                  Ver Vaga e Candidatar
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
