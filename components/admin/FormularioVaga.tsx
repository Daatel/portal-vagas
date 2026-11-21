'use client';

// ==============================================================================
// Component: components/admin/FormularioVaga.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Formulário de criação e edição de vaga com perguntas dinâmicas de triagem
// ==============================================================================

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type {
  Vaga,
  PerguntaTriagem,
  DepartamentoVaga,
  UnidadeVaga,
  TipoContratoVaga,
  StatusVaga,
} from '@/lib/supabase/types';
import { upsertVaga } from '@/app/actions/vagas';
import { slugify } from '@/lib/utils/slug';
import {
  Briefcase,
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface FormularioVagaProps {
  vagaExistente?: Vaga | null;
}

export function FormularioVaga({ vagaExistente }: FormularioVagaProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = Boolean(vagaExistente?.id);

  // Estados dos campos
  const [titulo, setTitulo] = useState(vagaExistente?.titulo || '');
  const [slug, setSlug] = useState(vagaExistente?.slug || '');
  const [departamento, setDepartamento] = useState<DepartamentoVaga>(
    vagaExistente?.departamento || 'Comercial'
  );
  const [unidade, setUnidade] = useState<UnidadeVaga>(
    vagaExistente?.unidade || 'Centro Logistico BR-101'
  );
  const [tipoContrato, setTipoContrato] = useState<TipoContratoVaga>(
    vagaExistente?.tipo_contrato || 'CLT'
  );
  const [descricao, setDescricao] = useState(vagaExistente?.descricao || '');
  const [requisitos, setRequisitos] = useState(vagaExistente?.requisitos || '');
  const [beneficios, setBeneficios] = useState(vagaExistente?.beneficios || '');
  const [status, setStatus] = useState<StatusVaga>(
    vagaExistente?.status || 'Ativa'
  );

  // Perguntas de Triagem (máximo 3)
  const initialPerguntas: PerguntaTriagem[] = Array.isArray(vagaExistente?.perguntas_triagem)
    ? (vagaExistente.perguntas_triagem as unknown as PerguntaTriagem[])
    : [];

  const [perguntas, setPerguntas] = useState<PerguntaTriagem[]>(initialPerguntas);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(
    null
  );

  const handleTituloChange = (novoTitulo: string) => {
    setTitulo(novoTitulo);
    if (!isEditing || !slug) {
      setSlug(slugify(novoTitulo));
    }
  };

  const handleAddPergunta = () => {
    if (perguntas.length >= 3) {
      alert('O limite máximo é de até 3 perguntas de triagem por vaga.');
      return;
    }
    const novaPergunta: PerguntaTriagem = {
      id: Math.random().toString(36).substring(2, 9),
      texto: '',
      tipo: 'sim_nao',
      eliminatoria: false,
    };
    setPerguntas([...perguntas, novaPergunta]);
  };

  const handleUpdatePergunta = (
    index: number,
    campo: keyof PerguntaTriagem,
    valor: string | boolean
  ) => {
    const updated = [...perguntas];
    updated[index] = { ...updated[index], [campo]: valor };
    setPerguntas(updated);
  };

  const handleRemovePergunta = (index: number) => {
    setPerguntas(perguntas.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const formData = new FormData();
      if (vagaExistente?.id) formData.append('id', vagaExistente.id);
      formData.append('titulo', titulo.trim());
      formData.append('slug', slug.trim());
      formData.append('departamento', departamento);
      formData.append('unidade', unidade);
      formData.append('tipo_contrato', tipoContrato);
      formData.append('descricao', descricao.trim());
      formData.append('requisitos', requisitos.trim());
      if (beneficios.trim()) formData.append('beneficios', beneficios.trim());
      formData.append('status', status);
      formData.append('perguntas_triagem', JSON.stringify(perguntas));

      const res = await upsertVaga(formData);

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: isEditing
            ? 'Vaga atualizada com sucesso!'
            : 'Nova vaga cadastrada com sucesso!',
        });
        setTimeout(() => {
          router.push('/admin/vagas');
          router.refresh();
        }, 1200);
      } else {
        setFeedback({
          type: 'error',
          msg: res.error || 'Erro ao salvar a vaga.',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Botão Voltar */}
      <div>
        <Link
          href="/admin/vagas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rf-vermelho transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para listagem de vagas
        </Link>
      </div>

      {/* Banner de Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* 1. Informações Básicas da Vaga */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-rf-cinza flex items-center gap-2 border-b border-gray-100 pb-3">
          <Briefcase className="w-4 h-4 text-rf-vermelho" />
          1. Informações Básicas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Título da Vaga / Cargo *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              placeholder="Ex: Vendedor Externo - Varejo Alimentar"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              URL Amigável (Slug) *
            </label>
            <div className="flex items-center">
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-200">
                /vagas/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="vendedor-externo-varejo"
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Status da Publicação *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusVaga)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho font-medium"
            >
              <option value="Ativa">Ativa (Visível no site)</option>
              <option value="Rascunho">Rascunho (Não visível)</option>
              <option value="Pausada">Pausada (Candidaturas suspensas)</option>
              <option value="Encerrada">Encerrada (Processo finalizado)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Departamento *
            </label>
            <select
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value as DepartamentoVaga)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
            >
              <option value="Comercial">Comercial / Vendas</option>
              <option value="Logistica">Logística / Armazenagem</option>
              <option value="Administrativo">Administrativo / Financeiro</option>
              <option value="Frota">Frota & Entregas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Unidade / Local de Trabalho *
            </label>
            <select
              value={unidade}
              onChange={(e) => setUnidade(e.target.value as UnidadeVaga)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
            >
              <option value="Centro Logistico BR-101">Centro Logístico BR-101 (Itaboraí)</option>
              <option value="Escritorio Barra da Tijuca">Escritório Barra da Tijuca</option>
              <option value="Externo/Rota">Externo / Rotas de Entrega RJ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tipo de Contrato *
            </label>
            <select
              value={tipoContrato}
              onChange={(e) => setTipoContrato(e.target.value as TipoContratoVaga)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
            >
              <option value="CLT">CLT (Efetivo)</option>
              <option value="PJ">Prestador PJ / Autônomo</option>
              <option value="Temporario">Temporário</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Descrição, Requisitos e Benefícios */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-rf-cinza flex items-center gap-2 border-b border-gray-100 pb-3">
          <FileText className="w-4 h-4 text-rf-vermelho" />
          2. Detalhamento da Oportunidade
        </h2>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Descrição das Atividades *
          </label>
          <textarea
            required
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva as responsabilidades da função no dia a dia da distribuidora..."
            className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Requisitos e Qualificações (um por linha) *
          </label>
          <textarea
            required
            rows={4}
            value={requisitos}
            onChange={(e) => setRequisitos(e.target.value)}
            placeholder="• Ensino Médio Completo&#10;• Experiência no segmento de distribuição alimentar&#10;• Residir com fácil acesso à BR-101"
            className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Benefícios e Vantagens (um por linha)
          </label>
          <textarea
            rows={3}
            value={beneficios}
            onChange={(e) => setBeneficios(e.target.value)}
            placeholder="• Vale Transporte&#10;• Vale Refeição&#10;• Seguro de Vida&#10;• Desconto em Produtos"
            className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho leading-relaxed"
          />
        </div>
      </div>

      {/* 3. Perguntas Dinâmicas de Triagem (Mini-ATS) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-rf-cinza flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rf-vermelho" />
              3. Perguntas de Triagem Automatizada
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure até 3 perguntas diretas para filtrar candidatos antes da leitura manual do PDF.
            </p>
          </div>

          {perguntas.length < 3 && (
            <button
              type="button"
              onClick={handleAddPergunta}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar Pergunta ({perguntas.length}/3)
            </button>
          )}
        </div>

        {perguntas.length === 0 ? (
          <div className="p-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-500">
            Nenhuma pergunta de triagem adicionada. Clique no botão acima caso deseje perguntas eliminatórias (ex: CNH, residência ou experiência).
          </div>
        ) : (
          <div className="space-y-4">
            {perguntas.map((pergunta, idx) => (
              <div
                key={pergunta.id || idx}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">
                    Pergunta #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePergunta(idx)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={pergunta.texto}
                    onChange={(e) => handleUpdatePergunta(idx, 'texto', e.target.value)}
                    placeholder="Ex: Possui CNH categoria D válida?"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-gray-600 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name={`tipo_${pergunta.id}`}
                        value="sim_nao"
                        checked={pergunta.tipo === 'sim_nao'}
                        onChange={() => handleUpdatePergunta(idx, 'tipo', 'sim_nao')}
                        className="text-rf-vermelho"
                      />
                      Opção Sim / Não
                    </label>
                    <label className="text-xs text-gray-600 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name={`tipo_${pergunta.id}`}
                        value="texto"
                        checked={pergunta.tipo === 'texto'}
                        onChange={() => handleUpdatePergunta(idx, 'tipo', 'texto')}
                        className="text-rf-vermelho"
                      />
                      Texto Livre
                    </label>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pergunta.eliminatoria}
                      onChange={(e) =>
                        handleUpdatePergunta(idx, 'eliminatoria', e.target.checked)
                      }
                      className="w-3.5 h-3.5 text-rf-vermelho rounded border-gray-300"
                    />
                    <span className="text-xs font-semibold text-gray-700">
                      Critério Eliminatório
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Barra Inferior de Ação */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/vagas"
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-rf-vermelho text-white rounded-lg text-xs font-bold hover:bg-rf-vermelho-escuro transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando Vaga...</span>
            </>
          ) : (
            <span>{isEditing ? 'Atualizar Vaga' : 'Publicar Vaga'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
