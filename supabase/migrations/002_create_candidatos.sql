-- ==============================================================================
-- Migration: 002_create_candidatos.sql
-- Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
-- Descrição: Criação da tabela de candidatos, funil, avaliações, RLS e Bucket
-- ==============================================================================

-- 1. Criação da tabela candidatos
CREATE TABLE IF NOT EXISTS public.candidatos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vaga_id UUID REFERENCES public.vagas(id) ON DELETE SET NULL, -- Nullable para Banco de Talentos
    nome VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    respostas_triagem JSONB NOT NULL DEFAULT '{}'::jsonb,
    pergunta_aberta TEXT NOT NULL,
    curriculo_url TEXT,
    etapa_funil VARCHAR(30) NOT NULL DEFAULT 'Novo' CHECK (
        etapa_funil IN ('Novo', 'Triado', 'Entrevista', 'Teste Pratico', 'Aprovado', 'Banco', 'Descartado')
    ),
    nota_tecnica SMALLINT CHECK (nota_tecnica BETWEEN 1 AND 5),
    nota_logistica SMALLINT CHECK (nota_logistica BETWEEN 1 AND 5),
    nota_comunicacao SMALLINT CHECK (nota_comunicacao BETWEEN 1 AND 5),
    observacoes_rh TEXT,
    aceite_lgpd BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Índices para buscas e ordenação no Kanban / Painel
CREATE INDEX IF NOT EXISTS idx_candidatos_vaga_id ON public.candidatos(vaga_id);
CREATE INDEX IF NOT EXISTS idx_candidatos_etapa_funil ON public.candidatos(etapa_funil);
CREATE INDEX IF NOT EXISTS idx_candidatos_created_at ON public.candidatos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidatos_bairro ON public.candidatos(bairro);

-- 3. Habilitação de RLS
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Segurança (RLS)
-- INSERT: Aberto ao público anônimo e autenticado, exigindo obrigatoriamente aceite_lgpd = true
DROP POLICY IF EXISTS "Candidatos podem se inscrever" ON public.candidatos;
CREATE POLICY "Candidatos podem se inscrever"
    ON public.candidatos
    FOR INSERT
    TO public
    WITH CHECK (aceite_lgpd = true);

-- SELECT: Apenas usuários autenticados (RH)
DROP POLICY IF EXISTS "Apenas RH autenticado visualiza candidatos" ON public.candidatos;
CREATE POLICY "Apenas RH autenticado visualiza candidatos"
    ON public.candidatos
    FOR SELECT
    TO authenticated
    USING (true);

-- UPDATE: Apenas usuários autenticados (RH para alterar notas, etapas e observações)
DROP POLICY IF EXISTS "Apenas RH autenticado altera candidatos" ON public.candidatos;
CREATE POLICY "Apenas RH autenticado altera candidatos"
    ON public.candidatos
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- DELETE: Apenas usuários autenticados (RH para expurgo de dados)
DROP POLICY IF EXISTS "Apenas RH autenticado deleta candidatos" ON public.candidatos;
CREATE POLICY "Apenas RH autenticado deleta candidatos"
    ON public.candidatos
    FOR DELETE
    TO authenticated
    USING (true);

-- 5. Configuração do Storage (Bucket Privado 'curriculos')
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'curriculos',
    'curriculos',
    false, -- Bucket estritamente PRIVADO (Conformidade LGPD)
    5242880, -- Limite de 5 MB por arquivo
    ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf']::text[];

-- Políticas do Storage no bucket 'curriculos'
-- Permite upload de PDF por qualquer pessoa que esteja se candidatando
DROP POLICY IF EXISTS "Upload público de currículos em PDF" ON storage.objects;
CREATE POLICY "Upload público de currículos em PDF"
    ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'curriculos');

-- Apenas usuários autenticados podem visualizar/baixar (leitura via Signed URL)
DROP POLICY IF EXISTS "Apenas RH autenticado visualiza currículos" ON storage.objects;
CREATE POLICY "Apenas RH autenticado visualiza currículos"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'curriculos');

-- Apenas usuários autenticados podem deletar currículos (expurgo LGPD)
DROP POLICY IF EXISTS "Apenas RH autenticado deleta currículos" ON storage.objects;
CREATE POLICY "Apenas RH autenticado deleta currículos"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'curriculos');
