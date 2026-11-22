'use client';

// ==============================================================================
// Component: components/admin/KanbanFunil.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Quadro visual Kanban com 7 etapas de recrutamento, drag & drop e filtros
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { CandidatoComVaga, EtapaFunil, Vaga } from '@/lib/supabase/types';
import { moverEtapaFunil } from '@/app/actions/candidatos';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  Search,
  Star,
  UserCheck,
} from 'lucide-react';

interface KanbanFunilProps {
  candidatosIniciais: CandidatoComVaga[];
  vagasDisponiveis: Pick<Vaga, 'id' | 'titulo'>[];
}

const ETAPAS: { key: EtapaFunil; label: string; corBadge: string; corBorda: string }[] = [
  { key: 'Novo', label: 'Novos', corBadge: 'bg-emerald-50 text-emerald-800', corBorda: 'border-emerald-600' },
  { key: 'Triado', label: 'Triados', corBadge: 'bg-amber-50 text-amber-800', corBorda: 'border-amber-500' },
  { key: 'Entrevista', label: 'Entrevista', corBadge: 'bg-yellow-50 text-yellow-800', corBorda: 'border-rf-gold' },
  { key: 'Teste Pratico', label: 'Teste Prático', corBadge: 'bg-teal-50 text-teal-800', corBorda: 'border-teal-500' },
  { key: 'Aprovado', label: 'Aprovados', corBadge: 'bg-emerald-100 text-emerald-900', corBorda: 'border-rf-green' },
  { key: 'Banco', label: 'Banco Geral', corBadge: 'bg-gray-100 text-gray-700', corBorda: 'border-gray-400' },
  { key: 'Descartado', label: 'Descartados', corBadge: 'bg-red-50 text-red-700', corBorda: 'border-red-400' },
];

export function KanbanFunil({ candidatosIniciais, vagasDisponiveis }: KanbanFunilProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [candidatos, setCandidatos] = useState<CandidatoComVaga[]>(candidatosIniciais);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Filtros locais
  const [termoBusca, setTermoBusca] = useState('');
  const [vagaFiltro, setVagaFiltro] = useState(searchParams.get('vaga_id') || '');
  const [bairroFiltro, setBairroFiltro] = useState(searchParams.get('bairro') || '');

  const handleMover = async (candidatoId: string, novaEtapa: EtapaFunil) => {
    setLoadingId(candidatoId);
    // Atualização otimista imediata na UI
    setCandidatos((prev) =>
      prev.map((c) => (c.id === candidatoId ? { ...c, etapa_funil: novaEtapa } : c))
    );

    const res = await moverEtapaFunil(candidatoId, novaEtapa);
    if (!res.success) {
      alert(`Erro ao mover candidato: ${res.error}`);
      router.refresh();
    }
    setLoadingId(null);
  };

  // Drag and Drop nativo HTML5
  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (etapaDestino: EtapaFunil) => {
    if (draggedId) {
      handleMover(draggedId, etapaDestino);
      setDraggedId(null);
    }
  };

  // Filtragem dos candidatos
  const candidatosFiltrados = candidatos.filter((c) => {
    if (vagaFiltro) {
      if (vagaFiltro === 'banco') {
        if (c.vaga_id !== null) return false;
      } else if (c.vaga_id !== vagaFiltro) {
        return false;
      }
    }

    if (bairroFiltro && !c.bairro.toLowerCase().includes(bairroFiltro.toLowerCase())) {
      return false;
    }

    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      const matchNome = c.nome.toLowerCase().includes(termo);
      const matchBairro = c.bairro.toLowerCase().includes(termo);
      const matchWhats = c.whatsapp.includes(termo);
      if (!matchNome && !matchBairro && !matchWhats) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Barra Superior de Filtros */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Seletor de Vaga */}
          <div className="w-full sm:w-64">
            <select
              value={vagaFiltro}
              onChange={(e) => setVagaFiltro(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-gold/40 focus:border-rf-green font-medium"
            >
              <option value="">Todas as Vagas & Talentos</option>
              <option value="banco">Apenas Banco de Talentos Geral</option>
              {vagasDisponiveis.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Bairro */}
          <div className="w-full sm:w-44">
            <input
              type="text"
              placeholder="Filtrar por bairro..."
              value={bairroFiltro}
              onChange={(e) => setBairroFiltro(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-gold/40 focus:border-rf-green"
            />
          </div>
        </div>

        {/* Busca por Nome */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou WhatsApp..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-gold/40 focus:border-rf-green"
          />
        </div>
      </div>

      {/* Grid de Colunas do Kanban com Rolagem Horizontal Suave */}
      <div className="flex gap-4 overflow-x-auto pb-6 select-none min-h-[600px] items-start">
        {ETAPAS.map((etapa, idx) => {
          const candidatosDaEtapa = candidatosFiltrados.filter(
            (c) => c.etapa_funil === etapa.key
          );

          return (
            <div
              key={etapa.key}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(etapa.key)}
              className="w-72 shrink-0 bg-gray-100/80 rounded-2xl border border-gray-200 flex flex-col max-h-[800px]"
            >
              {/* Header da Coluna */}
              <div
                className={`p-3.5 bg-white rounded-t-2xl border-b border-gray-200 border-t-4 ${etapa.corBorda} flex items-center justify-between shadow-xs`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-gray-900">
                    {etapa.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${etapa.corBadge}`}
                  >
                    {candidatosDaEtapa.length}
                  </span>
                </div>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {candidatosDaEtapa.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
                    Arraste candidatos aqui
                  </div>
                ) : (
                  candidatosDaEtapa.map((candidato) => (
                    <div
                      key={candidato.id}
                      draggable
                      onDragStart={() => handleDragStart(candidato.id)}
                      className={`bg-white rounded-xl border border-gray-200 p-4 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
                        loadingId === candidato.id ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {/* Topo do Card: Vaga Aplicada */}
                      <div className="mb-2">
                        {candidato.vagas?.titulo ? (
                          <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded block truncate">
                            {candidato.vagas.titulo}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-rf-green bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-rf-green" />
                            Banco de Talentos
                          </span>
                        )}
                      </div>

                      {/* Nome do Candidato */}
                      <h4 className="text-xs font-bold text-gray-900 mb-1 truncate">
                        {candidato.nome}
                      </h4>

                      {/* Informações de Localização e Contato */}
                      <div className="space-y-1 text-[11px] text-gray-500 mb-3">
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>
                            {candidato.bairro}, {candidato.cidade}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{candidato.whatsapp}</span>
                        </div>
                      </div>

                      {/* Indicador de Avaliação (caso já pontuado) */}
                      {(candidato.nota_tecnica || candidato.nota_logistica) && (
                        <div className="flex items-center gap-2 py-1.5 px-2 bg-amber-50 rounded-lg text-[10px] font-semibold text-amber-800 mb-3 border border-amber-100">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>
                            Méd: {(
                              ((candidato.nota_tecnica || 0) +
                                (candidato.nota_logistica || 0) +
                                (candidato.nota_comunicacao || 0)) /
                              3
                            ).toFixed(1)} / 5
                          </span>
                        </div>
                      )}

                      {/* Controles de Movimentação e Ficha */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        {/* Botão Voltar Etapa */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMover(candidato.id, ETAPAS[idx - 1].key)}
                          title="Recuar etapa"
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Link Ver Ficha */}
                        <Link
                          href={`/admin/candidatos/${candidato.id}`}
                          className="text-[11px] font-semibold text-rf-green hover:text-rf-gold hover:underline flex items-center gap-1 transition-colors"
                        >
                          <span>Ficha</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        {/* Botão Avançar Etapa */}
                        <button
                          type="button"
                          disabled={idx === ETAPAS.length - 1}
                          onClick={() => handleMover(candidato.id, ETAPAS[idx + 1].key)}
                          title="Avançar etapa"
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
