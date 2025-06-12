import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos TypeScript baseados no banco de dados
export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ativo?: boolean;
  created_at?: string;
  slug?: string;
  imagem_url?: string;
  ordem?: number;
  updated_at?: string;
  status?: string;
}

export interface Subcategoria {
  id: number;
  nome: string;
  descricao?: string;
  categoria_id?: number;
  ativo?: boolean;
  created_at?: string;
  slug?: string;
  imagem_url?: string;
  ordem?: number;
  updated_at?: string;
  status?: string;
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  promocao_mes?: boolean;
  preco_promocao?: number;
  novidade?: boolean;
  descricao?: string;
  subcategoria_id?: number;
  tipo_tinta?: boolean;
  cor_rgb?: string;
  status?: string;
  ordem?: number;
  created_at?: string;
  updated_at?: string;
  imagem_principal?: string;
  imagem_2?: string;
  imagem_3?: string;
  imagem_4?: string;
  imagem_principal_index?: number;
  promocao_data_inicio?: string;
  promocao_data_fim?: string;
  promocao_duracao_dias?: number;
  promocao_status?: string;
  tipo_eletrico?: boolean;
  voltagem?: string;
}

export interface Loja {
  id: number;
  nome: string;
  endereco: string;
  horario_funcionamento: string;
  status?: string;
  ordem?: number;
  created_at?: string;
  updated_at?: string;
  telefones?: string[];
  imagem_principal?: string;
  imagem_2?: string;
  imagem_3?: string;
  imagem_4?: string;
  imagem_5?: string;
  imagem_6?: string;
  imagem_7?: string;
  imagem_8?: string;
  imagem_9?: string;
  imagem_10?: string;
  imagem_principal_index?: number;
}

export interface Banner {
  id: number;
  titulo: string;
  descricao?: string;
  imagem_url: string;
  ativo?: boolean;
  ordem?: number;
  link_destino?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Vendedor {
  id: number;
  nome: string;
  especialidade?: string;
  whatsapp: string;
  foto_url?: string;
  loja_id: number;
  ativo?: boolean;
  ordem?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RedeSocial {
  id: number;
  nome: string;
  link: string;
  icone: string;
  ativo?: boolean;
  ordem?: number;
  created_at?: string;
  updated_at?: string;
}
