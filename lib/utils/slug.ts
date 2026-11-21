// ==============================================================================
// Utility: lib/utils/slug.ts
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Função utilitária para geração de URLs amigáveis (slugs)
// ==============================================================================

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
