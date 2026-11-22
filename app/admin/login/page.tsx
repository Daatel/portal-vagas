'use client';

// ==============================================================================
// Page: app/admin/login/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Tela de autenticação exclusiva para a equipe de Recursos Humanos
// ==============================================================================

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import { Lock, Mail, AlertCircle, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erroMsg, setErroMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg(null);

    if (!email.trim() || !password.trim()) {
      setErroMsg('Por favor, informe seu e-mail corporativo e sua senha.');
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          setErroMsg('E-mail corporativo ou senha incorretos.');
          return;
        }

        router.push('/admin');
        router.refresh();
      } catch (err: unknown) {
        console.error('Erro de autenticação:', err);
        setErroMsg('Falha ao autenticar no servidor. Verifique sua conexão e tente novamente.');
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col justify-between p-4">
      <div className="pt-4 max-w-sm mx-auto w-full">
        <Link
          href="/vagas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rf-green transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para o mural público
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto my-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10">
          {/* Logo Corporativo Oficial */}
          <div className="text-center mb-8">
            <img
              src="/rf-monogram.png"
              alt="RF Distribuidora"
              className="h-12 w-auto mx-auto mb-3 object-contain"
            />
            <h1 className="text-xl font-bold text-rf-green tracking-tight">
              RF Distribuidora
            </h1>
            <span className="text-[10px] font-bold text-rf-gold tracking-[0.22em] uppercase block mt-0.5">
              DISTRIBUIÇÃO & REPRESENTAÇÃO
            </span>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-emerald-50 text-rf-green text-xs font-semibold border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-rf-green" />
              Painel ATS & Gestão de Vagas
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Acesso exclusivo à equipe de RH e Recrutamento
            </p>
          </div>

          {/* Mensagem de Erro */}
          {erroMsg && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{erroMsg}</span>
            </div>
          )}

          {/* Formulário de Login */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="comercial05@rfdis.com.br"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-gold/40 focus:border-rf-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rf-gold/40 focus:border-rf-green"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-rf-green text-white font-semibold rounded-xl text-sm hover:bg-rf-green-light transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar no Painel</span>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="pb-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} RF Distribuidora • Acesso Auditado
      </div>
    </main>
  );
}
