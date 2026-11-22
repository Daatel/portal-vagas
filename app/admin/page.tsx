// ==============================================================================
// Page: app/admin/page.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Visão geral e dashboard inicial do painel administrativo
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { Briefcase, Users, UserCheck, Shield, PlusCircle, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const cards = [
    {
      title: 'Gestão de Vagas',
      desc: 'Criar, editar, pausar ou encerrar vagas e configurar perguntas de triagem.',
      href: '/admin/vagas',
      icon: Briefcase,
      badge: 'Módulo Vagas',
    },
    {
      title: 'Funil de Candidatos (Kanban)',
      desc: 'Acompanhar candidatos pelas etapas: Novo, Triado, Entrevista, Aprovado.',
      href: '/admin/candidatos',
      icon: Users,
      badge: 'Mini-ATS',
    },
    {
      title: 'Banco de Talentos',
      desc: 'Visualizar currículos gerais enviados sem vaga específica vinculada.',
      href: '/admin/candidatos?etapa=Banco',
      icon: UserCheck,
      badge: 'Talentos',
    },
    {
      title: 'Segurança & LGPD',
      desc: 'Monitorar tempo de retenção e aplicar política de expurgo de currículos.',
      href: '/admin/configuracoes',
      icon: Shield,
      badge: 'Compliance',
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Topo do Dashboard */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Painel de Recrutamento & Seleção (ATS)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Central operacional de captação de talentos da RF Distribuidora.
          </p>
        </div>

        <Link
          href="/admin/vagas/nova"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rf-green text-white rounded-lg text-xs font-bold hover:bg-rf-green-light transition-all shadow-sm hover:shadow"
        >
          <PlusCircle className="w-4 h-4" />
          Publicar Nova Vaga
        </Link>
      </div>

      {/* Grid de Atalhos Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-white rounded-2xl border border-gray-200 hover:border-rf-gold/60 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-rf-green flex items-center justify-center">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-rf-green transition-colors mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-rf-green group-hover:text-rf-gold transition-colors">
                <span>Acessar</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
