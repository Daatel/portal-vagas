# 📋 Histórico de Versões — Portal de Vagas & Mini-ATS (RF Distribuidora)

---

## v1.1 — 2026-11-21 (Sessão: Simplificação Direta do Trabalhe Conosco — Formulário Ágil de Candidatura)

### 🚀 Interface Pública (`app/(public)/vagas/page.tsx` & `components/vagas/FormularioDireto.tsx`)
- **Remoção de Banners Genéricos:** Eliminação completa dos textos de marketing e cartões vazios ("Cultura Colaborativa", "Oportunidade Real", etc.).
- **Formulário Direto de Alta Conversão:** Implementação de tela única limpa e corporativa com a paleta oficial da RF (`#0F382A` e `#CBA358`), otimizada para celular:
  - Nome Completo;
  - WhatsApp (com formatação automática de máscara);
  - E-mail (opcional);
  - Bairro e Cidade;
  - Área de Interesse (Dropdown com opções para Comercial, Logística, Frota, Administrativo);
  - Anexo de Currículo (PDF com validação de tipo e trava de 5 MB);
  - Consentimento LGPD transparente;
  - Feedback imediato de confirmação com protocolo.
- **Ajuste na Server Action (`app/actions/candidatura.ts`):** Tratamento dinâmico para gravação da área de interesse nas respostas de triagem e persistência no bucket privado do Supabase.

---

## v1.0 — 2026-11-21 (Sessão: Implementação Integral do Portal de Vagas, ATS e Configuração Cloud)

### 🗄️ Banco de Dados & Infraestrutura Cloud (`supabase/` & Configurações)
- **Provedor:** Supabase Cloud (PostgreSQL 17)
- **Projeto:** `portal-vagas-rf` (`nwstweiyyxlnaeicclwl`)
- **Project URL:** `https://nwstweiyyxlnaeicclwl.supabase.co`
- **Região:** South America (São Paulo / `sa-east-1`)
- **Database Password:** `Daatel#2026`
- **Anon Public Key:** `sb_publishable_rk8JbxDcQLKMUTuVMOjB5w_KPCyfXd2`
- **Tabelas e Objetos Provisionados:**
  - `public.vagas`: Tabela de vagas, filtros, status e triggers de atualização.
  - `public.candidatos`: Tabela de candidatos, funil ATS (7 estágios), notas de scorecard e consentimento LGPD.
  - `storage.buckets ('curriculos')`: Bucket privado configurado com limite de 5MB e restrito a PDFs.
  - `RLS (Row Level Security)`: Políticas de acesso público e autenticado ativadas e validadas.
- **Repositório Oficial:** `https://github.com/Daatel/portal-vagas.git`

### 🚀 Mural Público e Inscrição de Candidatos (`app/(public)/`)
- **Mural de Oportunidades:** Listagem dinâmica com filtros por departamento e busca textual em tempo real.
- **Página da Vaga & SEO:** Detalhes completos com marcação estruturada **JSON-LD `JobPosting`** (Google Jobs).
- **Formulário de Candidatura:** Upload seguro de PDF direto para o storage privado, perguntas eliminatórias dinâmicas e consentimento explícito LGPD.
- **Banco de Talentos:** Rota dedicada `/banco-de-talentos` para captação contínua de currículos.
- **Proteção Anti-Spam:** Widget Cloudflare Turnstile integrado para barrar bots.

### 🛡️ Painel Administrativo do RH & Mini-ATS (`app/admin/`)
- **Autenticação:** Middleware protegendo todas as rotas `/admin/*` via Supabase Auth SSR.
- **Gestão de Vagas:** CRUD completo com gerador de slugs, configuração de screening e alternância rápida de status.
- **Funil Kanban:** Pipeline visual em 7 etapas com Drag & Drop nativo HTML5 e contadores por estágio.
- **Ficha do Candidato & Scorecard:** Visualizador embutido de currículo (PDF) via Signed URL segura (1h), scorecard com notas 1 a 5 (Técnica, Logística, Comunicação) e botão 1-clique para contato direto via WhatsApp.
- **Gerador de Anúncios:** Copywriting automático para divulgação externa (RioVagas/Catho e formato curto para WhatsApp/Instagram).
- **Segurança & Expurgo LGPD:** Painel analítico de retenção com modal de expurgo atômico de candidatos com mais de 12 meses.
