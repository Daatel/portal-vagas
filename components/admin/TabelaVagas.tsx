'use client';

// ==============================================================================
// Component: components/admin/TabelaVagas.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Tabela interativa de gestão de vagas com troca rápida de status
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import type { Vaga, StatusVaga } from '@/lib/supabase/types';
import { alterarStatusVaga } from '@/app/actions/vagas';
import {
  Edit,
  ExternalLink,
  Play,
  Pause,
  XCircle,
  MapPin,
  Briefcase,
  Loader2,
} from 'lucide-react';

interface TabelaVagasProps {
  vagasIniciais: Vaga[];
}

export function TabelaVagas({ vagasIniciais }: TabelaVagasProps) {
  const [vagas, setVagas] = useState<Vaga[]>(vagasIniciais);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (vagaId: string, novoStatus: StatusVaga) => {
    setLoadingId(vagaId);
    const res = await alterarStatusVaga(vagaId, novoStatus);
    if (res.success) {
      setVagas((prev) =>
        prev.map((v) => (v.id === vagaId ? { ...v, status: novoStatus } : v))
      );
    } else {
      alert(`Erro ao alterar status: ${res.error}`);
    }
    setLoadingId(null);
  };

  const getStatusBadge = (status: StatusVaga) => {
    switch (status) {
      case 'Ativa':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ativa
          </span>
        );
      case 'Rascunho':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Rascunho
          </span>
        );
      case 'Pausada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            Pausada
          </span>
        );
      case 'Encerrada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            Encerrada
          </span>
        );
    }
  };

  if (vagas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-rf-cinza mb-1">
          Nenhuma vaga cadastrada ainda
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Comece publicando a primeira vaga para que candidatos possam visualizá-la e se inscrever.
        </p>
        <Link
          href="/admin/vagas/nova"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rf-vermelho text-white rounded-lg text-xs font-bold hover:bg-rf-vermelho-escuro transition-colors shadow-sm"
        >
          Cadastrar Primeira Vaga
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Vaga / Cargo</th>
              <th className="px-6 py-4">Departamento & Unidade</th>
              <th className="px-6 py-4">Contrato</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Criado em</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vagas.map((vaga) => (
              <tr key={vaga.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-sm text-rf-cinza">
                    {vaga.titulo}
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                    /vagas/{vaga.slug}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium text-gray-700">
                    {vaga.departamento}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                    <span>{vaga.unidade}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-600 font-medium">
                  {vaga.tipo_contrato}
                </td>

                <td className="px-6 py-4">
                  {loadingId === vaga.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  ) : (
                    getStatusBadge(vaga.status)
                  )}
                </td>

                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {new Date(vaga.created_at).toLocaleDateString('pt-BR')}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Botão Ver no Portal */}
                    <Link
                      href={`/vagas/${vaga.slug}`}
                      target="_blank"
                      title="Visualizar no Portal Público"
                      className="p-1.5 text-gray-400 hover:text-rf-cinza hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    {/* Botão Editar */}
                    <Link
                      href={`/admin/vagas/${vaga.id}`}
                      title="Editar Vaga"
                      className="p-1.5 text-gray-600 hover:text-rf-vermelho hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    {/* Ações de Status */}
                    {vaga.status !== 'Ativa' ? (
                      <button
                        onClick={() => handleStatusChange(vaga.id, 'Ativa')}
                        title="Publicar / Ativar Vaga"
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(vaga.id, 'Pausada')}
                        title="Pausar Vaga"
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    )}

                    {vaga.status !== 'Encerrada' && (
                      <button
                        onClick={() => handleStatusChange(vaga.id, 'Encerrada')}
                        title="Encerrar Vaga"
                        className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
