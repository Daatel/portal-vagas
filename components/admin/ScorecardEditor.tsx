'use client';

// ==============================================================================
// Component: components/admin/ScorecardEditor.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Editor de avaliação do candidato (notas 1 a 5) e anotações confidenciais do RH
// ==============================================================================

import React, { useState, useTransition } from 'react';
import { salvarScorecard, salvarObservacoes } from '@/app/actions/scorecard';
import { Star, Save, CheckCircle2, Loader2, MessageSquare, Award } from 'lucide-react';

interface ScorecardEditorProps {
  candidatoId: string;
  initialNotas: {
    tecnica: number | null;
    logistica: number | null;
    comunicacao: number | null;
  };
  initialObservacoes: string | null;
}

export function ScorecardEditor({
  candidatoId,
  initialNotas,
  initialObservacoes,
}: ScorecardEditorProps) {
  const [isPending, startTransition] = useTransition();

  const [notaTecnica, setNotaTecnica] = useState<number>(initialNotas.tecnica || 3);
  const [notaLogistica, setNotaLogistica] = useState<number>(initialNotas.logistica || 3);
  const [notaComunicacao, setNotaComunicacao] = useState<number>(initialNotas.comunicacao || 3);
  const [observacoes, setObservacoes] = useState<string>(initialObservacoes || '');

  const [feedback, setFeedback] = useState<string | null>(null);

  const mediaGeral = ((notaTecnica + notaLogistica + notaComunicacao) / 3).toFixed(1);

  const handleSalvarScorecard = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await salvarScorecard(candidatoId, {
        tecnica: notaTecnica,
        logistica: notaLogistica,
        comunicacao: notaComunicacao,
      });

      if (res.success) {
        setFeedback('Avaliação de notas salva com sucesso!');
        setTimeout(() => setFeedback(null), 3000);
      } else {
        alert(`Erro ao salvar scorecard: ${res.error}`);
      }
    });
  };

  const handleSalvarObservacoes = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await salvarObservacoes(candidatoId, observacoes);

      if (res.success) {
        setFeedback('Anotações da entrevista salvas!');
        setTimeout(() => setFeedback(null), 3000);
      } else {
        alert(`Erro ao salvar observações: ${res.error}`);
      }
    });
  };

  const renderStarPicker = (
    label: string,
    descricao: string,
    valor: number,
    onChange: (val: number) => void
  ) => {
    return (
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-gray-800">{label}</span>
          <span className="text-xs font-extrabold text-rf-vermelho">{valor} / 5</span>
        </div>
        <p className="text-[11px] text-gray-400 mb-3">{descricao}</p>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`w-9 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                star <= valor
                  ? 'bg-amber-400 text-gray-900 shadow-xs scale-105'
                  : 'bg-white text-gray-400 border border-gray-200 hover:border-amber-300'
              }`}
            >
              {star}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
      {/* Topo do Scorecard com Média */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-rf-cinza flex items-center gap-2">
            <Award className="w-5 h-5 text-rf-vermelho" />
            Scorecard & Avaliação de RH
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Pontue o candidato e registre as anotações sigilosas da entrevista.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Média Geral
          </span>
          <span className="text-2xl font-black text-rf-cinza flex items-center gap-1">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            {mediaGeral}
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 3 Pilares de Avaliação (1-5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderStarPicker(
          'Aderência Técnica',
          'Experiência prévia em atacado/varejo e rotinas operacionais.',
          notaTecnica,
          setNotaTecnica
        )}
        {renderStarPicker(
          'Logística & Deslocamento',
          'Facilidade de acesso ao CD/sede e disponibilidade de itinerário.',
          notaLogistica,
          setNotaLogistica
        )}
        {renderStarPicker(
          'Comunicação & Perfil',
          'Clareza verbal, postura profissional e alinhamento cultural.',
          notaComunicacao,
          setNotaComunicacao
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSalvarScorecard}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rf-cinza text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Salvar Notas do Scorecard</span>
        </button>
      </div>

      {/* Anotações Confidenciais da Entrevista */}
      <div className="pt-4 border-t border-gray-100">
        <label className="block text-xs font-bold text-rf-cinza mb-1 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-rf-vermelho" />
          Observações e Parecer da Entrevista
        </label>
        <p className="text-[11px] text-gray-400 mb-2">
          Visível exclusivamente para os recrutadores e gestores autorizados da RF Distribuidora.
        </p>

        <textarea
          rows={4}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Registre pontos fortes, pretensão salarial declarada, impressões comportamentais ou motivos de descarte..."
          className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho leading-relaxed mb-3"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSalvarObservacoes}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rf-vermelho text-white rounded-lg text-xs font-semibold hover:bg-rf-vermelho-escuro transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Salvar Parecer do RH</span>
          </button>
        </div>
      </div>
    </div>
  );
}
