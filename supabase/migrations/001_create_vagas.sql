-- ==============================================================================
-- Migration: 001_create_vagas.sql
-- Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
-- Descrição: Criação da tabela de vagas, índices, triggers e políticas RLS
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Criação da tabela vagas
CREATE TABLE IF NOT EXISTS public.vagas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    departamento VARCHAR(50) NOT NULL CHECK (departamento IN ('Comercial', 'Logistica', 'Administrativo', 'Frota')),
    unidade VARCHAR(100) NOT NULL CHECK (unidade IN ('Centro Logistico BR-101', 'Escritorio Barra da Tijuca', 'Externo/Rota')),
    tipo_contrato VARCHAR(20) NOT NULL CHECK (tipo_contrato IN ('CLT', 'PJ', 'Temporario')),
    descricao TEXT NOT NULL,
    requisitos TEXT NOT NULL,
    beneficios TEXT,
    perguntas_triagem JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'Rascunho' CHECK (status IN ('Rascunho', 'Ativa', 'Pausada', 'Encerrada')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_vagas_slug ON public.vagas(slug);
CREATE INDEX IF NOT EXISTS idx_vagas_status ON public.vagas(status);
CREATE INDEX IF NOT EXISTS idx_vagas_departamento ON public.vagas(departamento);

-- 3. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_vagas_updated_at ON public.vagas;
CREATE TRIGGER trigger_vagas_updated_at
    BEFORE UPDATE ON public.vagas
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Habilitação de RLS (Row Level Security)
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Segurança (RLS)
-- SELECT: Público geral lê vagas ativas; usuários autenticados (RH) lêem todas
DROP POLICY IF EXISTS "Vagas ativas são públicas" ON public.vagas;
CREATE POLICY "Vagas ativas são públicas"
    ON public.vagas
    FOR SELECT
    TO public
    USING (status = 'Ativa' OR auth.role() = 'authenticated');

-- INSERT: Apenas usuários autenticados
DROP POLICY IF EXISTS "Apenas usuários autenticados podem inserir vagas" ON public.vagas;
CREATE POLICY "Apenas usuários autenticados podem inserir vagas"
    ON public.vagas
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- UPDATE: Apenas usuários autenticados
DROP POLICY IF EXISTS "Apenas usuários autenticados podem atualizar vagas" ON public.vagas;
CREATE POLICY "Apenas usuários autenticados podem atualizar vagas"
    ON public.vagas
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- DELETE: Apenas usuários autenticados
DROP POLICY IF EXISTS "Apenas usuários autenticados podem deletar vagas" ON public.vagas;
CREATE POLICY "Apenas usuários autenticados podem deletar vagas"
    ON public.vagas
    FOR DELETE
    TO authenticated
    USING (true);
