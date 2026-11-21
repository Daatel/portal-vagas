'use client';

// ==============================================================================
// Component: components/vagas/FormularioCandidatura.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Formulário inteligente de candidatura com triagem, validação de PDF e LGPD
// ==============================================================================

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import type { PerguntaTriagem } from '@/lib/supabase/types';
import { submitCandidatura } from '@/app/actions/candidatura';
import { TurnstileWidget } from '@/components/vagas/TurnstileWidget';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Loader2,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
} from 'lucide-react';

interface FormularioCandidaturaProps {
  vagaId: string | null;
  perguntas: PerguntaTriagem[];
}

export function FormularioCandidatura({ vagaId, perguntas }: FormularioCandidaturaProps) {
  const [isPending, startTransition] = useTransition();

  // Estados dos campos
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('Rio de Janeiro');
  const [perguntaAberta, setPerguntaAberta] = useState('');
  const [respostasTriagem, setRespostasTriagem] = useState<Record<string, string>>({});
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [curriculoErro, setCurriculoErro] = useState<string | null>(null);
  const [aceiteLgpd, setAceiteLgpd] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Estados de resposta do envio
  const [feedbackErro, setFeedbackErro] = useState<string | null>(null);
  const [sucessoCandidatoId, setSucessoCandidatoId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurriculoErro(null);
    const file = e.target.files?.[0];
    if (!file) {
      setCurriculo(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setCurriculoErro('Apenas arquivos em formato PDF são permitidos.');
      setCurriculo(null);
      e.target.value = '';
      return;
    }

    // 5 MB em bytes
    if (file.size > 5 * 1024 * 1024) {
      setCurriculoErro('O arquivo selecionado é maior que o limite de 5 MB.');
      setCurriculo(null);
      e.target.value = '';
      return;
    }

    setCurriculo(file);
  };

  const handleRespostaChange = (perguntaId: string, valor: string) => {
    setRespostasTriagem((prev) => ({
      ...prev,
      [perguntaId]: valor,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackErro(null);

    if (!aceiteLgpd) {
      setFeedbackErro('É necessário concordar com os termos de privacidade (LGPD) para prosseguir.');
      return;
    }

    if (!nome.trim() || !whatsapp.trim() || !bairro.trim() || !cidade.trim() || !perguntaAberta.trim()) {
      setFeedbackErro('Por favor, preencha todos os campos obrigatórios marcados com asterisco.');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      if (vagaId) formData.append('vaga_id', vagaId);
      formData.append('nome', nome.trim());
      formData.append('whatsapp', whatsapp.trim());
      if (email.trim()) formData.append('email', email.trim());
      formData.append('bairro', bairro.trim());
      formData.append('cidade', cidade.trim());
      formData.append('pergunta_aberta', perguntaAberta.trim());
      formData.append('respostas_triagem', JSON.stringify(respostasTriagem));
      formData.append('aceite_lgpd', aceiteLgpd ? 'true' : 'false');
      if (turnstileToken) {
        formData.append('turnstile_token', turnstileToken);
      }

      if (curriculo) {
        formData.append('curriculo', curriculo);
      }

      const res = await submitCandidatura(formData);

      if (res.success) {
        setSucessoCandidatoId(res.candidatoId || 'CONFIRMADO');
      } else {
        setFeedbackErro(res.error || 'Não foi possível enviar a candidatura. Verifique seus dados.');
      }
    });
  };

  // Tela de Sucesso
  if (sucessoCandidatoId) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-rf-cinza mb-3">
          Candidatura Recebida com Sucesso!
        </h2>
        <p className="text-sm text-gray-600 max-w-lg mx-auto mb-6 leading-relaxed">
          Seus dados e currículo foram enviados diretamente para a equipe de Recursos Humanos da <strong>RF Distribuidora</strong>. Fique atento ao seu WhatsApp, pois faremos contato por lá para os próximos passos da seleção.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-md mx-auto mb-8 text-xs text-gray-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Protocolo seguro: <strong>{sucessoCandidatoId}</strong></span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/vagas"
            className="w-full sm:w-auto px-6 py-3 bg-rf-cinza text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2"
          >
            Ver outras vagas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-sm space-y-8">
      {/* Banner de Erro Geral */}
      {feedbackErro && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{feedbackErro}</span>
        </div>
      )}

      {/* 1. Dados Pessoais */}
      <div>
        <h3 className="text-base font-bold text-rf-cinza mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <User className="w-4 h-4 text-rf-vermelho" />
          1. Dados Pessoais de Contato
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              WhatsApp com DDD *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(21) 99999-9999"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              E-mail de Contato
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Bairro de Residência *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Manilha, Alcântara, Barra..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Cidade / Município *
            </label>
            <input
              type="text"
              required
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: Itaboraí, São Gonçalo, Rio de Janeiro..."
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
            />
          </div>
        </div>
      </div>

      {/* 2. Perguntas Dinâmicas de Triagem (caso a vaga possua) */}
      {perguntas && perguntas.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-rf-cinza mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
            <CheckCircle2 className="w-4 h-4 text-rf-vermelho" />
            2. Perguntas de Triagem para a Vaga
          </h3>

          <div className="space-y-4">
            {perguntas.map((p, idx) => (
              <div
                key={p.id || idx}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-800">
                    {p.texto}
                  </span>
                  {p.eliminatoria && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-rf-vermelho">
                      Obrigatório
                    </span>
                  )}
                </div>

                {p.tipo === 'sim_nao' ? (
                  <div className="flex items-center gap-6 mt-2">
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name={`triagem_${p.id}`}
                        value="Sim"
                        required
                        checked={respostasTriagem[p.id] === 'Sim'}
                        onChange={() => handleRespostaChange(p.id, 'Sim')}
                        className="text-rf-vermelho focus:ring-rf-vermelho"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name={`triagem_${p.id}`}
                        value="Não"
                        required
                        checked={respostasTriagem[p.id] === 'Não'}
                        onChange={() => handleRespostaChange(p.id, 'Não')}
                        className="text-rf-vermelho focus:ring-rf-vermelho"
                      />
                      Não
                    </label>
                  </div>
                ) : (
                  <input
                    type="text"
                    required
                    value={respostasTriagem[p.id] || ''}
                    onChange={(e) => handleRespostaChange(p.id, e.target.value)}
                    placeholder="Sua resposta..."
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Pergunta Aberta */}
      <div>
        <h3 className="text-base font-bold text-rf-cinza mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <MessageSquare className="w-4 h-4 text-rf-vermelho" />
          {perguntas && perguntas.length > 0 ? '3.' : '2.'} Apresentação Profissional
        </h3>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Por que você deseja fazer parte do time da RF Distribuidora e qual seu principal diferencial? *
          </label>
          <textarea
            required
            rows={3}
            value={perguntaAberta}
            onChange={(e) => setPerguntaAberta(e.target.value)}
            placeholder="Conte brevemente sobre sua trajetória recente, experiências práticas e disponibilidade..."
            className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-vermelho/20 focus:border-rf-vermelho leading-relaxed"
          />
        </div>
      </div>

      {/* 4. Upload de Currículo em PDF */}
      <div>
        <h3 className="text-base font-bold text-rf-cinza mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <UploadCloud className="w-4 h-4 text-rf-vermelho" />
          {perguntas && perguntas.length > 0 ? '4.' : '3.'} Anexar Currículo (PDF)
        </h3>

        <div className="border-2 border-dashed border-gray-200 hover:border-rf-vermelho/50 rounded-xl p-6 text-center transition-all bg-gray-50/50">
          <input
            type="file"
            id="curriculo-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {curriculo ? (
            <div className="flex flex-col items-center">
              <FileCheck className="w-10 h-10 text-emerald-600 mb-2" />
              <span className="text-sm font-semibold text-rf-cinza">
                {curriculo.name}
              </span>
              <span className="text-xs text-gray-400 mb-3">
                ({(curriculo.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
              <label
                htmlFor="curriculo-upload"
                className="text-xs text-rf-vermelho hover:underline font-semibold cursor-pointer"
              >
                Trocar arquivo
              </label>
            </div>
          ) : (
            <label htmlFor="curriculo-upload" className="cursor-pointer block">
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-semibold text-rf-cinza block">
                Clique para selecionar seu currículo em PDF
              </span>
              <span className="text-xs text-gray-400 mt-1 block">
                Formato aceito: .PDF (tamanho máximo de 5 MB)
              </span>
            </label>
          )}
        </div>

        {curriculoErro && (
          <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {curriculoErro}
          </p>
        )}
      </div>

      {/* 5. Consentimento LGPD */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            required
            checked={aceiteLgpd}
            onChange={(e) => setAceiteLgpd(e.target.checked)}
            className="w-4 h-4 text-rf-vermelho rounded border-gray-300 focus:ring-rf-vermelho mt-0.5"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            Autorizo a <strong>RF Distribuidora de Produtos Alimentícios Ltda</strong> a armazenar e processar meus dados pessoais e currículo estritamente para fins de processos seletivos e recrutamento, em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
          </span>
        </label>
      </div>

      {/* 6. Proteção Anti-Spam Turnstile */}
      <TurnstileWidget onSuccess={(token) => setTurnstileToken(token)} />

      {/* Botão de Envio */}
      <div className="pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-rf-vermelho text-white rounded-xl text-sm font-bold hover:bg-rf-vermelho-escuro shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enviando candidatura com segurança...</span>
            </>
          ) : (
            <>
              <span>Concluir e Enviar Candidatura</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
