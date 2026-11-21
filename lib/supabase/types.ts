// ==============================================================================
// Types: lib/supabase/types.ts
// Projeto: Portal de Vagas & Mini-ATS — RF Distribuidora
// Descrição: Tipagem estática rigorosa do Supabase (Database, Tables, Enums e Models)
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DepartamentoVaga = 'Comercial' | 'Logistica' | 'Administrativo' | 'Frota';
export type UnidadeVaga = 'Centro Logistico BR-101' | 'Escritorio Barra da Tijuca' | 'Externo/Rota';
export type TipoContratoVaga = 'CLT' | 'PJ' | 'Temporario';
export type StatusVaga = 'Rascunho' | 'Ativa' | 'Pausada' | 'Encerrada';
export type EtapaFunil =
  | 'Novo'
  | 'Triado'
  | 'Entrevista'
  | 'Teste Pratico'
  | 'Aprovado'
  | 'Banco'
  | 'Descartado';

export interface PerguntaTriagem {
  id: string;
  texto: string;
  tipo: 'sim_nao' | 'texto';
  eliminatoria: boolean;
}

export type Database = {
  public: {
    Tables: {
      vagas: {
        Row: {
          id: string;
          titulo: string;
          slug: string;
          departamento: DepartamentoVaga;
          unidade: UnidadeVaga;
          tipo_contrato: TipoContratoVaga;
          descricao: string;
          requisitos: string;
          beneficios: string | null;
          perguntas_triagem: PerguntaTriagem[] | Json;
          status: StatusVaga;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          slug: string;
          departamento: DepartamentoVaga;
          unidade: UnidadeVaga;
          tipo_contrato: TipoContratoVaga;
          descricao: string;
          requisitos: string;
          beneficios?: string | null;
          perguntas_triagem?: PerguntaTriagem[] | Json;
          status?: StatusVaga;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          slug?: string;
          departamento?: DepartamentoVaga;
          unidade?: UnidadeVaga;
          tipo_contrato?: TipoContratoVaga;
          descricao?: string;
          requisitos?: string;
          beneficios?: string | null;
          perguntas_triagem?: PerguntaTriagem[] | Json;
          status?: StatusVaga;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      candidatos: {
        Row: {
          id: string;
          vaga_id: string | null;
          nome: string;
          whatsapp: string;
          email: string | null;
          bairro: string;
          cidade: string;
          respostas_triagem: Record<string, string> | Json;
          pergunta_aberta: string;
          curriculo_url: string | null;
          etapa_funil: EtapaFunil;
          nota_tecnica: number | null;
          nota_logistica: number | null;
          nota_comunicacao: number | null;
          observacoes_rh: string | null;
          aceite_lgpd: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          vaga_id?: string | null;
          nome: string;
          whatsapp: string;
          email?: string | null;
          bairro: string;
          cidade: string;
          respostas_triagem?: Record<string, string> | Json;
          pergunta_aberta: string;
          curriculo_url?: string | null;
          etapa_funil?: EtapaFunil;
          nota_tecnica?: number | null;
          nota_logistica?: number | null;
          nota_comunicacao?: number | null;
          observacoes_rh?: string | null;
          aceite_lgpd: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          vaga_id?: string | null;
          nome?: string;
          whatsapp?: string;
          email?: string | null;
          bairro?: string;
          cidade?: string;
          respostas_triagem?: Record<string, string> | Json;
          pergunta_aberta?: string;
          curriculo_url?: string | null;
          etapa_funil?: EtapaFunil;
          nota_tecnica?: number | null;
          nota_logistica?: number | null;
          nota_comunicacao?: number | null;
          observacoes_rh?: string | null;
          aceite_lgpd?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'candidatos_vaga_id_fkey';
            columns: ['vaga_id'];
            isOneToOne: false;
            referencedRelation: 'vagas';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      departamento_vaga: DepartamentoVaga;
      unidade_vaga: UnidadeVaga;
      tipo_contrato_vaga: TipoContratoVaga;
      status_vaga: StatusVaga;
      etapa_funil: EtapaFunil;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helpers de tipos solicitados pelo contrato de arquitetura
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Modelos de uso direto nas páginas e componentes
export type Vaga = Tables<'vagas'>;
export type Candidato = Tables<'candidatos'>;
export type CandidatoComVaga = Candidato & {
  vagas: Pick<Vaga, 'titulo'> | null;
};
