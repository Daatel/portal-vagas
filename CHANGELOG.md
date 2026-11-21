# 📋 Histórico de Versões — Portal de Vagas & Mini-ATS (RF Distribuidora)

---

## v1.0 — 2026-11-21 (Sessão: Implementação Integral do Portal de Vagas, ATS e Configuração Cloud)

### 🗄️ Banco de Dados & Infraestrutura Cloud (`supabase/` & Configurações)
- **Provedor:** Supabase Cloud (PostgreSQL 15+)
- **Projeto:** `portal-vagas-rf`
- **Região:** South America (São Paulo / `sa-east-1`)
- **Database Password:** `Daatel#2026`
- **Schemas e Migrations:**
  - `001_create_vagas.sql`: Tabela `vagas` com controle de status, campos de triagem e índices otimizados.
  - `002_create_candidatos.sql`: Tabela `candidatos` (funil ATS em 7 estágios, scorecard, consentimento LGPD), bucket privado de Storage `curriculos` (PDF ≤ 5MB) e políticas estritas de Row Level Security (RLS).
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
