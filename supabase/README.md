# Migrations do Supabase — Portal de Vagas & Mini-ATS (RF Distribuidora)

## Como Aplicar as Migrations no Supabase

1. Acesse o painel do seu projeto no [Supabase Dashboard](https://app.supabase.com).
2. Vá em **SQL Editor** > **New Query**.
3. Copie e execute o conteúdo de:
   - `001_create_vagas.sql` (Criação da tabela `vagas`, índices e RLS)
   - `002_create_candidatos.sql` (Criação da tabela `candidatos`, funil, scorecard, RLS e Bucket Privado de Storage `curriculos`)

## Queries de Teste (Sanity Check)

### Inserir vaga de teste
```sql
INSERT INTO public.vagas (
    titulo,
    slug,
    departamento,
    unidade,
    tipo_contrato,
    descricao,
    requisitos,
    beneficios,
    perguntas_triagem,
    status
) VALUES (
    'Auxiliar de Logística',
    'auxiliar-de-logistica',
    'Logistica',
    'Centro Logistico BR-101',
    'CLT',
    'Atuar no recebimento, separação e expedição de mercadorias no CD da RF Distribuidora.',
    'Ensino Médio completo. Residir próximo ou com fácil acesso à BR-101 (Itaboraí/São Gonçalo). Disponibilidade de horário.',
    'Vale Transporte, Vale Refeição, Seguro de Vida, Convênio Farmácia.',
    '[{"id": "c1", "texto": "Possui fácil acesso à BR-101 em Itaboraí?", "tipo": "sim_nao", "eliminatoria": true}, {"id": "c2", "texto": "Já trabalhou com separação de carga/distribuição?", "tipo": "sim_nao", "eliminatoria": false}]'::jsonb,
    'Ativa'
);
```

### Consultar como usuário anônimo (deve retornar apenas ativas)
```sql
SELECT id, titulo, slug, departamento, unidade, status FROM public.vagas WHERE status = 'Ativa';
```
