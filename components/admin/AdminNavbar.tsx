'use client';

// ==============================================================================
// Component: components/admin/AdminNavbar.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Barra superior de navegação administrativa com logout
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Briefcase, Users, Settings, LogOut, ExternalLink } from 'lucide-react';

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Não renderiza a barra administrativa dentro da tela de login
  if (pathname === '/admin/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Erro ao sair:', err);
      router.push('/admin/login');
    }
  };

  const navLinks = [
    { label: 'Painel Geral', href: '/admin', exact: true },
    { label: 'Gestão de Vagas', href: '/admin/vagas', icon: Briefcase },
    { label: 'Funil de Candidatos', href: '/admin/candidatos', icon: Users },
    { label: 'Configurações & LGPD', href: '/admin/configuracoes', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Identidade Oficial */}
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img
              src="/rf-monogram.png"
              alt="RF Distribuidora"
              className="h-8 w-auto object-contain"
            />
            <span className="font-extrabold text-base tracking-tight text-rf-green">
              RF Distribuidora
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-rf-green border border-emerald-100">
              Admin ATS
            </span>
          </Link>

          {/* Links de Navegação */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-rf-green font-bold border border-emerald-100'
                      : 'text-gray-600 hover:text-rf-green hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Ações Laterais */}
        <div className="flex items-center gap-3">
          <Link
            href="/vagas"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-rf-green px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span>Ver Portal Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
