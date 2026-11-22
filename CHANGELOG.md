# 📋 Histórico de Versões — Portal de Vagas & Mini-ATS (RF Distribuidora)

---

## v1.3 — 2026-11-22 (Sessão: Purificação Total de Cores — Erradicação de Vermelho e Azul)

### 🎨 Padronização Visual Integral (100% Verde Floresta e Dourado)
- **Eliminação Definitiva de Vermelho e Azul:** Varredura em 100% dos arquivos do projeto, substituindo todas as ocorrências de botões, tags, links, bordas e ícones vermelhos e azuis pelas cores corporativas oficiais da RF Distribuidora:
  - **Verde Floresta Oficial (`#0F382A` / `#17523C`):** Aplicado a todos os botões de ação principal, ícones de cabeçalho, abas ativas, links e badges de status.
  - **Dourado Corporativo (`#CBA358` / `#B88F44`):** Aplicado a destaques, anéis de foco, subtítulos institucionais, frisos decorativos e marcadores.
- **Telas e Componentes Tratados:**
  - `app/(public)/banco-de-talentos/page.tsx`
  - `app/(public)/vagas/[slug]/page.tsx`
  - `app/(public)/vagas/[slug]/candidatura/page.tsx`
  - `app/admin/page.tsx`
  - `app/admin/vagas/page.tsx`
  - `app/admin/candidatos/page.tsx`
  - `app/admin/candidatos/[id]/page.tsx`
  - `app/admin/configuracoes/page.tsx`
  - `components/admin/AdminNavbar.tsx`
  - `components/admin/KanbanFunil.tsx`
  - `components/admin/FormularioVaga.tsx`
  - `components/admin/ScorecardEditor.tsx`
  - `components/admin/GeradorAnuncios.tsx`
  - `components/admin/TabelaVagas.tsx`
  - `components/admin/PainelRetencao.tsx`

---

## v1.2 — 2026-11-22 (Sessão: Alinhamento Fiel da Identidade Visual Oficial da RF Distribuidora)

### 🎨 Padronização de Marca e Identidade Visual (`public/`, `app/`, `components/`)
- **Ativos Oficiais:** Criação da pasta `public/` e importação dos arquivos oficiais do monograma em alta definição (`rf-monogram.png` e `rf-monogram-white.png`) e favicon oficial da empresa.
- **Header Oficial:** Substituição do bloco improvisado de texto em CSS pelo logotipo/monograma real com enquadramento proporcional, subtítulo institucional dourado `DISTRIBUIÇÃO & REPRESENTAÇÃO` e botão com link direto para o site oficial `https://rfdis.com.br`.
- **Rodapé Corporativo:** Implementação do rodapé em Verde Floresta Escuro (`#0A261C`) com linha divisória dourada (`#CBA358`/40), monograma branco/dourado e crédito institucional discreto `Powered by www.daatel.com.br`.
- **Eliminação de Cores Divergentes:** Substituição integral do padrão anterior com botões vermelhos (`#C0392B`) e blocos em azul escuro pela paleta corporativa oficial: Verde Floresta (`#0F382A`), Verde Médio (`#17523C`) e Dourado Corporativo (`#CBA358`).
- **Correção de Glitch no Dark Mode:** Removido o bloco de `@media (prefers-color-scheme: dark)` no `globals.css` que invertia o fundo para preto `#0a0a0a`; fixado no fundo clássico corporativo `#FBFBFA` (`rf-cream`).
- **Tipografia & Metadados:** Integração da fonte corporativa oficial **Inter** (Google Fonts via `next/font/google`), configuração de idioma `pt-BR` e título oficial da aba no navegador no `app/layout.tsx`.

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
