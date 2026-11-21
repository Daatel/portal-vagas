'use client';

// ==============================================================================
// Component: components/vagas/TurnstileWidget.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Widget de proteção anti-spam e validação de bot via Cloudflare Turnstile
// ==============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({ onSuccess, onError }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [verificado, setVerificado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // Se não houver chave cadastrada no .env, opera em modo simulado (desenvolvimento)
    if (!siteKey) {
      const timer = setTimeout(() => {
        setVerificado(true);
        setCarregando(false);
        onSuccess('simulated-turnstile-token-dev');
      }, 600);
      return () => clearTimeout(timer);
    }

    // Carrega script do Cloudflare Turnstile dinamicamente
    const scriptId = 'cf-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      if (window.turnstile && containerRef.current) {
        clearInterval(interval);
        try {
          window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              setVerificado(true);
              setCarregando(false);
              onSuccess(token);
            },
            'error-callback': () => {
              setCarregando(false);
              if (onError) onError();
            },
            theme: 'light',
          });
        } catch (e) {
          console.warn('Erro ao inicializar Cloudflare Turnstile:', e);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [siteKey, onSuccess, onError]);

  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span className="font-semibold text-gray-700">Proteção Anti-Spam Cloudflare</span>
      </div>

      <div ref={containerRef}>
        {carregando && !verificado && (
          <span className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Verificando segurança...
          </span>
        )}

        {verificado && (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verificado
          </span>
        )}
      </div>
    </div>
  );
}
