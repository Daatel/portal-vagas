'use client';

// ==============================================================================
// Component: components/admin/GeradorAnuncios.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Gerador semi-automatizado de textos para classificados (RioVagas/Catho) e redes sociais
// ==============================================================================

import React, { useState } from 'react';
import type { Vaga } from '@/lib/supabase/types';
import { Copy, Check, Share2, FileText, MessageSquare } from 'lucide-react';

interface GeradorAnunciosProps {
  vaga: Vaga;
}

export function GeradorAnuncios({ vaga }: GeradorAnunciosProps) {
  const [copiadoTipo, setCopiadoTipo] = useState<'riovagas' | 'whatsapp' | null>(null);

  const linkVaga = `https://vagas.rfdis.com.br/vagas/${vaga.slug}`;

  // Formato estruturado padrão para classificados formais (RioVagas, Catho, InfoJobs)
  const textoRioVagas = `EMPRESA: RF Distribuidora de Produtos Alimentícios Ltda
CARGO: ${vaga.titulo}
LOCAL DE TRABALHO: ${vaga.unidade}
REGIME DE CONTRATAÇÃO: ${vaga.tipo_contrato} - Presencial

DESCRIÇÃO DAS ATIVIDADES:
${vaga.descricao}

REQUISITOS E QUALIFICAÇÕES:
${vaga.requisitos}

BENEFÍCIOS OFERECIDOS:
${vaga.beneficios || 'Benefícios compatíveis com o mercado de distribuição alimentar.'}

COMO SE CANDIDATAR:
Os interessados devem cadastrar seu currículo exclusivamente pelo link oficial da RF Distribuidora:
${linkVaga}
(Processo seletivo 100% online e gratuito - em conformidade com a LGPD)`;

  // Formato enxuto otimizado para disparo em grupos de WhatsApp, status e stories
  const textoWhatsApp = `📢 *VAGA NA RF DISTRIBUIDORA!* 🚚
🎯 *Cargo:* ${vaga.titulo}
📍 *Local:* ${vaga.unidade} (${vaga.tipo_contrato})
🚀 Venha fazer parte da nossa equipe!
👉 *Candidaturas pelo link:* ${linkVaga}`;

  const copiarParaClipboard = async (texto: string, tipo: 'riovagas' | 'whatsapp') => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiadoTipo(tipo);
      setTimeout(() => setCopiadoTipo(null), 2500);
    } catch (err) {
      console.error('Falha ao copiar para área de transferência:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-rf-green" />
          Gerador de Anúncios Externos
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Copie formatos prontos para divulgar em portais gratuitos e redes sociais com link direto para o funil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bloco RioVagas / Catho */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rf-green" />
                RioVagas / Catho / Classificados
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                Texto Completo
              </span>
            </div>

            <pre className="text-[11px] text-gray-600 bg-white p-3 rounded-lg border border-gray-200 h-44 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
              {textoRioVagas}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => copiarParaClipboard(textoRioVagas, 'riovagas')}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                copiadoTipo === 'riovagas'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rf-green text-white hover:bg-rf-green-light shadow-sm'
              }`}
            >
              {copiadoTipo === 'riovagas' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado para Área de Transferência!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar para RioVagas / Catho</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bloco WhatsApp / Redes Sociais */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                WhatsApp / Redes Sociais
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                Curto ({textoWhatsApp.length} chars)
              </span>
            </div>

            <pre className="text-[11px] text-gray-600 bg-white p-3 rounded-lg border border-gray-200 h-44 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
              {textoWhatsApp}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => copiarParaClipboard(textoWhatsApp, 'whatsapp')}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                copiadoTipo === 'whatsapp'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rf-green text-white hover:bg-rf-green-light shadow-sm'
              }`}
            >
              {copiadoTipo === 'whatsapp' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Chamada para WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
