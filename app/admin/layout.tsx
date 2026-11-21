// ==============================================================================
// Layout: app/admin/layout.tsx
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Layout base compartilhado pelas telas administrativas
// ==============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { AdminNavbar } from '@/components/admin/AdminNavbar';

export const metadata: Metadata = {
  title: 'Painel RH & Recrutamento | RF Distribuidora',
  description: 'Gestão de vagas e funil de candidatos da RF Distribuidora.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <AdminNavbar />
        {children}
      </div>
      <footer className="bg-white border-t border-gray-200 py-4 px-4 text-center text-xs text-gray-400">
        Portal Interno de Recrutamento & Seleção • RF Distribuidora de Alimentos Ltda
      </footer>
    </div>
  );
}
