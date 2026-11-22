'use client';

// ==============================================================================
// Component: components/admin/PainelRetencao.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Painel interativo de gestão da política de retenção e expurgo LGPD
// ==============================================================================

import React, { useState, useTransition } from 'react';
import { expurgarCandidatosAntigos, type EstatisticasRetencao } from '@/app/actions/expurgo';
import {
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Calendar,
  Database,
  Lock,
} from 'lucide-react';

interface PainelRetencaoProps {
  estatisticasIniciais: EstatisticasRetencao;
}

export function PainelRetencao({ estatisticasIniciais }: PainelRetencaoProps) {
  const [isPending, startTransition] = useTransition();
  const [stats, setStats] = useState<EstatisticasRetencao>(estatisticasIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const handleExecutarExpurgo = () => {
    setModalAberto(false);
    startTransition(async () => {
      const res = await expurgarCandidatosAntigos();
      if (res.success) {
        setMensagemSucesso(
          `${res.expurgados} ${
            res.expurgados === 1 ? 'currículo expurgado' : 'currículos expurgados'
          } com sucesso do banco e do storage em conformidade com a LGPD.`
        );
        setStats((prev) => ({
          ...prev,
          totalCandidatos: Math.max(0, prev.totalCandidatos - res.expurgados),
          candidatosAntigos: 0,
        }));
      } else {
        alert(`Erro ao executar expurgo: ${res.error}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {mensagemSucesso && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Cards de Métricas de Retenção */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Total de Candidatos
            </span>
            <span className="text-2xl font-extrabold text-gray-900">
              {stats.totalCandidatos}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              Base acumulada geral
            </span>
          </div>
          <Database className="w-8 h-8 text-gray-200" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
              Candidatos +12 Meses
            </span>
            <span className="text-2xl font-extrabold text-amber-700">
              {stats.candidatosAntigos}
            </span>
            <span className="text-[10px] text-amber-600 font-medium block mt-0.5">
              Elegíveis para expurgo LGPD
            </span>
          </div>
          <Calendar className="w-8 h-8 text-amber-100" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
              Limite de Retenção
            </span>
            <span className="text-sm font-bold text-gray-700 block mt-1">
              Anteriores a {stats.dataLimite}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              Regra padrão: 365 dias
            </span>
          </div>
          <Lock className="w-8 h-8 text-emerald-100" />
        </div>
      </div>

      {/* Ação de Expurgo */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rf-green" />
              Executar Expurgo de Currículos Antigos
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xl leading-relaxed">
              Em cumprimento ao princípio da necessidade e minimização de dados da Lei Geral de Proteção de Dados (LGPD), esta rotina exclui definitivamente registros e PDFs com mais de 12 meses de cadastro.
            </p>
          </div>

          <button
            type="button"
            disabled={stats.candidatosAntigos === 0 || isPending}
            onClick={() => setModalAberto(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Expurgando Dados...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Expurgar ({stats.candidatosAntigos})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de Confirmação Segura */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-bold text-gray-900">
                Confirmar Expurgo Definitivo?
              </h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Você está prestes a excluir permanentemente <strong>{stats.candidatosAntigos} currículo(s)</strong> e seus respectivos arquivos PDF do banco de dados e do armazenamento do Supabase. Esta ação é irreversível.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecutarExpurgo}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Sim, Confirmar e Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
