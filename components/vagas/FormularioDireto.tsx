'use client';

// ==============================================================================
// Component: components/vagas/FormularioDireto.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Formulário direto e profissional para envio de currículo ao RH da RF
// ==============================================================================

import React, { useState, useTransition } from 'react';
import { submitCandidatura } from '@/app/actions/candidatura';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Loader2,
  Send,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
} from 'lucide-react';

const AREAS_INTERESSE = [
  'Comercial / Vendas Externas',
  'Logística / Armazém (Centro Logístico BR-101)',
  'Frota / Motoristas e Entregas',
  'Administrativo e Financeiro',
  'Outras Áreas',
];

export function FormularioDireto() {
  const [isPending, startTransition] = useTransition();

  // Estados dos campos
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('Rio de Janeiro');
  const [areaInteresse, setAreaInteresse] = useState(AREAS_INTERESSE[0]);
  const [mensagem, setMensagem] = useState('');
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [curriculoErro, setCurriculoErro] = useState<string | null>(null);
  const [aceiteLgpd, setAceiteLgpd] = useState(false);

  // Estados de resposta do envio
  const [feedbackErro, setFeedbackErro] = useState<string | null>(null);
  const [sucessoEnviado, setSucessoEnviado] = useState(false);

  // Formatação automática do WhatsApp (21) 9XXXX-XXXX
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    }
    setWhatsapp(v);
  };

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

    if (file.size > 5 * 1024 * 1024) {
      setCurriculoErro('O arquivo selecionado é maior que o limite de 5 MB.');
      setCurriculo(null);
      e.target.value = '';
      return;
    }

    setCurriculo(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackErro(null);

    if (!aceiteLgpd) {
      setFeedbackErro('É necessário concordar com os termos de privacidade (LGPD) para prosseguir.');
      return;
    }

    if (!nome.trim() || !whatsapp.trim() || !bairro.trim() || !cidade.trim() || !areaInteresse) {
      setFeedbackErro('Por favor, preencha todos os campos obrigatórios marcados com asterisco (*).');
      return;
    }

    if (!curriculo) {
      setFeedbackErro('Por favor, anexe seu currículo em formato PDF para que o RH possa analisar seu perfil.');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('vaga_id', '');
      formData.append('nome', nome.trim());
      formData.append('whatsapp', whatsapp.trim());
      formData.append('email', email.trim());
      formData.append('bairro', bairro.trim());
      formData.append('cidade', cidade.trim());
      formData.append('area_interesse', areaInteresse);
      formData.append('pergunta_aberta', mensagem.trim() || `Área de interesse: ${areaInteresse}`);
      formData.append('aceite_lgpd', 'true');
      formData.append('respostas_triagem', JSON.stringify({ area_interesse: areaInteresse }));
      formData.append('curriculo', curriculo);

      try {
        const response = await submitCandidatura(formData);
        if (response.success) {
          setSucessoEnviado(true);
        } else {
          setFeedbackErro(response.error || 'Ocorreu um erro ao enviar seu currículo. Tente novamente.');
        }
      } catch (err) {
        console.error('Erro ao enviar candidatura:', err);
        setFeedbackErro('Falha de conexão com o servidor. Verifique sua rede e tente novamente.');
      }
    });
  };

  if (sucessoEnviado) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-sm text-center max-w-xl mx-auto my-8">
        <div className="w-16 h-16 bg-[#0F382A]/10 text-[#0F382A] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          Currículo Recebido com Sucesso
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Seus dados e currículo foram encaminhados diretamente para a equipe de Recursos Humanos da{' '}
          <strong className="text-gray-900">RF Distribuidora</strong> para a área de{' '}
          <span className="text-[#0F382A] font-semibold">{areaInteresse}</span>.
        </p>
        <p className="text-xs text-gray-500 mb-8">
          Entraremos em contato via WhatsApp caso seu perfil seja selecionado para uma oportunidade.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://rfdis.com.br"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#0F382A] hover:bg-[#154d3a] text-white text-xs font-semibold transition-colors"
          >
            Voltar ao site institucional
          </a>
          <button
            type="button"
            onClick={() => {
              setSucessoEnviado(false);
              setNome('');
              setWhatsapp('');
              setEmail('');
              setBairro('');
              setCurriculo(null);
              setMensagem('');
              setAceiteLgpd(false);
            }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
          >
            Enviar outro currículo
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Barra de Título do Formulário */}
      <div className="bg-[#0F382A] px-6 sm:px-8 py-6 text-white border-b-2 border-[#CBA358]">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#CBA358] uppercase block mb-1">
          Recursos Humanos &bull; RF Distribuidora
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Trabalhe Conosco
        </h1>
        <p className="text-xs text-gray-300 mt-1 max-w-xl">
          Preencha os campos abaixo e anexe seu currículo para participar dos processos seletivos da empresa.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {feedbackErro && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <div className="leading-relaxed">{feedbackErro}</div>
          </div>
        )}

        {/* 1. Nome Completo */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F382A] focus:border-[#0F382A] transition-all"
            />
          </div>
        </div>

        {/* 2. Contatos: WhatsApp e E-mail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              WhatsApp / Telefone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={handleWhatsappChange}
                placeholder="(21) 98765-4321"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F382A] focus:border-[#0F382A] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              E-mail <span className="text-gray-400 font-normal lowercase">(opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F382A] focus:border-[#0F382A] transition-all"
              />
            </div>
          </div>
        </div>

        {/* 3. Localização: Bairro e Cidade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Bairro onde reside <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Campo Grande, Barra, Alcântara..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F382A] focus:border-[#0F382A] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Cidade / Município <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: Rio de Janeiro, Niterói, Itaboraí..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F382A] focus:border-[#0F382A] transition-all"
            />
          </div>
        </div>

        {/* 4. Área de Interesse (Dropdown) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Área de Interesse <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <select
              value={areaInteresse}
              onChange={(e) => setAreaInteresse(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F382A] focus:border-[#0F382A] transition-all"
            >
              {AREAS_INTERESSE.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Anexo do Currículo (PDF até 5MB) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Anexar Currículo (PDF) <span className="text-red-500">*</span>
          </label>

          <label
            htmlFor="curriculo-upload"
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              curriculo
                ? 'border-[#0F382A] bg-[#0F382A]/5'
                : 'border-gray-300 hover:border-[#0F382A] bg-gray-50 hover:bg-white'
            }`}
          >
            <input
              id="curriculo-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {curriculo ? (
              <div className="flex items-center gap-3 text-sm text-[#0F382A] font-semibold">
                <FileCheck className="w-6 h-6 text-[#0F382A]" />
                <span className="truncate max-w-xs">{curriculo.name}</span>
                <span className="text-xs text-gray-500 font-normal">
                  ({(curriculo.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <span className="text-xs text-[#0F382A] underline ml-2">Alterar</span>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <UploadCloud className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-sm font-semibold text-gray-700">
                  Clique para selecionar seu currículo em PDF
                </p>
                <p className="text-xs text-gray-500">
                  Tamanho máximo permitido: 5 MB
                </p>
              </div>
            )}
          </label>

          {curriculoErro && (
            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {curriculoErro}
            </p>
          )}
        </div>

        {/* 6. Breve Resumo / Observações (Opcional) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Resumo Profissional / Observações <span className="text-gray-400 font-normal lowercase">(opcional)</span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Descreva brevemente suas principais experiências profissionais ou disponibilidade de horário..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F382A] focus:border-[#0F382A] transition-all"
            />
          </div>
        </div>

        {/* 7. Consentimento LGPD */}
        <div className="pt-2 border-t border-gray-100">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={aceiteLgpd}
              onChange={(e) => setAceiteLgpd(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#0F382A] border-gray-300 rounded focus:ring-[#0F382A]"
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              Autorizo o armazenamento dos meus dados e currículo pela <strong>RF Distribuidora</strong> exclusivamente
              para participação em processos seletivos e contato da equipe de RH, em conformidade com a Lei Geral de
              Proteção de Dados (LGPD).
            </span>
          </label>
        </div>

        {/* 8. Botão de Envio */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-[#0F382A] hover:bg-[#154d3a] disabled:bg-gray-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm hover:shadow"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando currículo com segurança...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar Currículo para o RH</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
