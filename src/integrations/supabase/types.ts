export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ass_produtos_pedidos: {
        Row: {
          categoria_id: number | null
          created_at: string
          id: number
          ingredientes_id: number | null
          nome_ingrediente: string | null
          produto_id: number | null
          produtos_pedidos_id: number | null
          random_id: number | null
        }
        Insert: {
          categoria_id?: number | null
          created_at?: string
          id?: number
          ingredientes_id?: number | null
          nome_ingrediente?: string | null
          produto_id?: number | null
          produtos_pedidos_id?: number | null
          random_id?: number | null
        }
        Update: {
          categoria_id?: number | null
          created_at?: string
          id?: number
          ingredientes_id?: number | null
          nome_ingrediente?: string | null
          produto_id?: number | null
          produtos_pedidos_id?: number | null
          random_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ass_produtos_pedidos_ingredientes_id_fkey"
            columns: ["ingredientes_id"]
            isOneToOne: false
            referencedRelation: "ingredientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ass_produtos_pedidos_ingredientes_id_fkey"
            columns: ["ingredientes_id"]
            isOneToOne: false
            referencedRelation: "ingredientes_produtos_pedidos"
            referencedColumns: ["ingrediente_id"]
          },
          {
            foreignKeyName: "ass_produtos_pedidos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ass_produtos_pedidos_produtos_pedidos_id_fkey"
            columns: ["produtos_pedidos_id"]
            isOneToOne: false
            referencedRelation: "produtos_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_prod: {
        Row: {
          created_at: string
          id: number
          imagem_url: string | null
          nome: string | null
          ordem: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          imagem_url?: string | null
          nome?: string | null
          ordem?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          imagem_url?: string | null
          nome?: string | null
          ordem?: number | null
        }
        Relationships: []
      }
      codigos_empresa: {
        Row: {
          codigo: string
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          codigo: string
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "codigos_empresa_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      comandas: {
        Row: {
          codigo_comanda: string | null
          created_at: string
          empresa_id: number | null
          id: number
          numero_comanda: string | null
          ordem: number | null
          uso: boolean
        }
        Insert: {
          codigo_comanda?: string | null
          created_at?: string
          empresa_id?: number | null
          id?: number
          numero_comanda?: string | null
          ordem?: number | null
          uso?: boolean
        }
        Update: {
          codigo_comanda?: string | null
          created_at?: string
          empresa_id?: number | null
          id?: number
          numero_comanda?: string | null
          ordem?: number | null
          uso?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "comandas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "cores_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "comandas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      cores: {
        Row: {
          angulo_gradiente1: number | null
          angulo_gradiente2: number | null
          cor_shadow_texto: string | null
          cor_texto_botao: string | null
          cor1: string | null
          cor2: string | null
          cor3: string | null
          cor4: string | null
          created_at: string
          id: number
          nome: string | null
          shadow_categorias: string | null
          visivel: boolean
        }
        Insert: {
          angulo_gradiente1?: number | null
          angulo_gradiente2?: number | null
          cor_shadow_texto?: string | null
          cor_texto_botao?: string | null
          cor1?: string | null
          cor2?: string | null
          cor3?: string | null
          cor4?: string | null
          created_at?: string
          id?: number
          nome?: string | null
          shadow_categorias?: string | null
          visivel?: boolean
        }
        Update: {
          angulo_gradiente1?: number | null
          angulo_gradiente2?: number | null
          cor_shadow_texto?: string | null
          cor_texto_botao?: string | null
          cor1?: string | null
          cor2?: string | null
          cor3?: string | null
          cor4?: string | null
          created_at?: string
          id?: number
          nome?: string | null
          shadow_categorias?: string | null
          visivel?: boolean
        }
        Relationships: []
      }
      empresas: {
        Row: {
          cep: string | null
          cidade: string | null
          cores_id: number | null
          created_at: string
          empresa_id: number
          endereco: string | null
          logo_url: string | null
          nome: string | null
          telefone: string | null
          uf: string | null
          user_id: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cores_id?: number | null
          created_at?: string
          empresa_id?: number
          endereco?: string | null
          logo_url?: string | null
          nome?: string | null
          telefone?: string | null
          uf?: string | null
          user_id?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cores_id?: number | null
          created_at?: string
          empresa_id?: number
          endereco?: string | null
          logo_url?: string | null
          nome?: string | null
          telefone?: string | null
          uf?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      estados: {
        Row: {
          created_at: string
          id: number
          nome: string | null
          sigla: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nome?: string | null
          sigla?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nome?: string | null
          sigla?: string | null
        }
        Relationships: []
      }
      imagens_empresa: {
        Row: {
          created_at: string
          empresa_id: number | null
          id: number
          img_url: string | null
          logomarca: boolean | null
        }
        Insert: {
          created_at?: string
          empresa_id?: number | null
          id?: number
          img_url?: string | null
          logomarca?: boolean | null
        }
        Update: {
          created_at?: string
          empresa_id?: number | null
          id?: number
          img_url?: string | null
          logomarca?: boolean | null
        }
        Relationships: []
      }
      ingredientes: {
        Row: {
          created_at: string
          empresa_id: number | null
          id: number
          nome: string | null
          sku: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string
          empresa_id?: number | null
          id?: number
          nome?: string | null
          sku?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string
          empresa_id?: number | null
          id?: number
          nome?: string | null
          sku?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "cores_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "ingredientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      login_automatico: {
        Row: {
          codigo: string
          created_at: string
          id: number
          session_json_string: string | null
        }
        Insert: {
          codigo?: string
          created_at?: string
          id?: number
          session_json_string?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string
          id?: number
          session_json_string?: string | null
        }
        Relationships: []
      }
      mesas: {
        Row: {
          created_at: string
          empresa_id: number | null
          id: number
          mesa_nome: string | null
          mesa_uid: string | null
          ocupada: boolean
        }
        Insert: {
          created_at?: string
          empresa_id?: number | null
          id?: number
          mesa_nome?: string | null
          mesa_uid?: string | null
          ocupada?: boolean
        }
        Update: {
          created_at?: string
          empresa_id?: number | null
          id?: number
          mesa_nome?: string | null
          mesa_uid?: string | null
          ocupada?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "mesas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "cores_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "mesas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      pedidos: {
        Row: {
          comanda: string | null
          comanda_copy: string | null
          comanda_id: number | null
          created_at: string
          empresa_id: number | null
          mesa_copy: string | null
          mesa_id: number | null
          mesa_nome: string | null
          nome_cliente: string | null
          pedido_id: number
          status_pedido: number | null
          tipo_pedido: number | null
          valor_pedido: number | null
        }
        Insert: {
          comanda?: string | null
          comanda_copy?: string | null
          comanda_id?: number | null
          created_at?: string
          empresa_id?: number | null
          mesa_copy?: string | null
          mesa_id?: number | null
          mesa_nome?: string | null
          nome_cliente?: string | null
          pedido_id?: number
          status_pedido?: number | null
          tipo_pedido?: number | null
          valor_pedido?: number | null
        }
        Update: {
          comanda?: string | null
          comanda_copy?: string | null
          comanda_id?: number | null
          created_at?: string
          empresa_id?: number | null
          mesa_copy?: string | null
          mesa_id?: number | null
          mesa_nome?: string | null
          nome_cliente?: string | null
          pedido_id?: number
          status_pedido?: number | null
          tipo_pedido?: number | null
          valor_pedido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_comanda_id_fkey"
            columns: ["comanda_id"]
            isOneToOne: false
            referencedRelation: "comandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "cores_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "pedidos_mesa_id_fkey"
            columns: ["mesa_id"]
            isOneToOne: false
            referencedRelation: "mesas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_status_pedido_fkey"
            columns: ["status_pedido"]
            isOneToOne: false
            referencedRelation: "status_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      prod_associados: {
        Row: {
          adicional: boolean
          categoria_id: number | null
          created_at: string
          id: number
          ing_id: number | null
          prod_id: number | null
          random_id: number | null
        }
        Insert: {
          adicional?: boolean
          categoria_id?: number | null
          created_at?: string
          id?: number
          ing_id?: number | null
          prod_id?: number | null
          random_id?: number | null
        }
        Update: {
          adicional?: boolean
          categoria_id?: number | null
          created_at?: string
          id?: number
          ing_id?: number | null
          prod_id?: number | null
          random_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prod_associados_ing_id_fkey"
            columns: ["ing_id"]
            isOneToOne: false
            referencedRelation: "ingredientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_associados_ing_id_fkey"
            columns: ["ing_id"]
            isOneToOne: false
            referencedRelation: "ingredientes_produtos_pedidos"
            referencedColumns: ["ingrediente_id"]
          },
          {
            foreignKeyName: "prod_associados_prod_id_fkey"
            columns: ["prod_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria_id: number | null
          codigo_barras: string | null
          created_at: string
          descricao: string | null
          empresa_id: number | null
          id: number
          img_url: string | null
          nome: string | null
          qtd: number | null
          qtd_compras: number
          sku: string | null
          sub_cat_id: number | null
          tipo_prod_cat: number | null
          valor: number | null
          visivel: boolean | null
        }
        Insert: {
          categoria_id?: number | null
          codigo_barras?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: number | null
          id?: number
          img_url?: string | null
          nome?: string | null
          qtd?: number | null
          qtd_compras?: number
          sku?: string | null
          sub_cat_id?: number | null
          tipo_prod_cat?: number | null
          valor?: number | null
          visivel?: boolean | null
        }
        Update: {
          categoria_id?: number | null
          codigo_barras?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: number | null
          id?: number
          img_url?: string | null
          nome?: string | null
          qtd?: number | null
          qtd_compras?: number
          sku?: string | null
          sub_cat_id?: number | null
          tipo_prod_cat?: number | null
          valor?: number | null
          visivel?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "cores_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "produtos_sub_cat_id_fkey"
            columns: ["sub_cat_id"]
            isOneToOne: false
            referencedRelation: "sub_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos_pedidos: {
        Row: {
          categoria_id: number | null
          cod_sku: string | null
          created_at: string
          descricao: string | null
          empresa_id: number | null
          id: number
          img_url: string | null
          lista_ids: number[] | null
          pedido_id: number
          produto_id: number | null
          produto_nome: string | null
          quantidade: number | null
          status_produto: number | null
          valor_total: number | null
          valor_unit: number | null
        }
        Insert: {
          categoria_id?: number | null
          cod_sku?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: number | null
          id?: number
          img_url?: string | null
          lista_ids?: number[] | null
          pedido_id: number
          produto_id?: number | null
          produto_nome?: string | null
          quantidade?: number | null
          status_produto?: number | null
          valor_total?: number | null
          valor_unit?: number | null
        }
        Update: {
          categoria_id?: number | null
          cod_sku?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: number | null
          id?: number
          img_url?: string | null
          lista_ids?: number[] | null
          pedido_id?: number
          produto_id?: number | null
          produto_nome?: string | null
          quantidade?: number | null
          status_produto?: number | null
          valor_total?: number | null
          valor_unit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "cores_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "produtos_pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "produtos_pedidos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["pedido_id"]
          },
          {
            foreignKeyName: "produtos_pedidos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "view_pedidos_completos"
            referencedColumns: ["pedido_id"]
          },
          {
            foreignKeyName: "produtos_pedidos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "vw_produtos_pedidos_lista"
            referencedColumns: ["pedido_id"]
          },
          {
            foreignKeyName: "produtos_pedidos_status_produto_fkey"
            columns: ["status_produto"]
            isOneToOne: false
            referencedRelation: "status_itens_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      status_itens_pedidos: {
        Row: {
          created_at: string
          id: number
          nome: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nome?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nome?: string | null
        }
        Relationships: []
      }
      status_pedidos: {
        Row: {
          cor: string | null
          created_at: string
          id: number
          status: string | null
        }
        Insert: {
          cor?: string | null
          created_at?: string
          id?: number
          status?: string | null
        }
        Update: {
          cor?: string | null
          created_at?: string
          id?: number
          status?: string | null
        }
        Relationships: []
      }
      sub_categorias: {
        Row: {
          cat_id: number | null
          created_at: string
          id: number
          img_url: string | null
          nome: string | null
          visivel: boolean
        }
        Insert: {
          cat_id?: number | null
          created_at?: string
          id?: number
          img_url?: string | null
          nome?: string | null
          visivel?: boolean
        }
        Update: {
          cat_id?: number | null
          created_at?: string
          id?: number
          img_url?: string | null
          nome?: string | null
          visivel?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "sub_categorias_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "categorias_prod"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          atividade: boolean
          cargo_id: number | null
          codigo_totem: string | null
          created_at: string
          email: string | null
          empresa_id: number | null
          logo_url: string | null
          nome: string | null
          user_id: string
        }
        Insert: {
          atividade?: boolean
          cargo_id?: number | null
          codigo_totem?: string | null
          created_at?: string
          email?: string | null
          empresa_id?: number | null
          logo_url?: string | null
          nome?: string | null
          user_id?: string
        }
        Update: {
          atividade?: boolean
          cargo_id?: number | null
          codigo_totem?: string | null
          created_at?: string
          email?: string | null
          empresa_id?: number | null
          logo_url?: string | null
          nome?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "cores_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
    }
    Views: {
      cores_empresa: {
        Row: {
          angulo_gradiente1: number | null
          angulo_gradiente2: number | null
          cor_shadow_texto: string | null
          cor_texto_botao: string | null
          cor1: string | null
          cor2: string | null
          cor3: string | null
          cor4: string | null
          cores_id: number | null
          created_at: string | null
          empresa_id: number | null
          logo_url: string | null
          nome: string | null
          shadow_categorias: string | null
          user_id: string | null
        }
        Relationships: []
      }
      fotos_empresa: {
        Row: {
          empresa_id: number | null
          img_url: string | null
        }
        Insert: {
          empresa_id?: number | null
          img_url?: string | null
        }
        Update: {
          empresa_id?: number | null
          img_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "cores_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      ingredientes_produtos: {
        Row: {
          adicional: boolean | null
          categoria_id: number | null
          ing_id: number | null
          ing_nome: string | null
          ing_valor: number | null
          prod_id: number | null
          prod_nome: string | null
          random_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prod_associados_ing_id_fkey"
            columns: ["ing_id"]
            isOneToOne: false
            referencedRelation: "ingredientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_associados_ing_id_fkey"
            columns: ["ing_id"]
            isOneToOne: false
            referencedRelation: "ingredientes_produtos_pedidos"
            referencedColumns: ["ingrediente_id"]
          },
          {
            foreignKeyName: "prod_associados_prod_id_fkey"
            columns: ["prod_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredientes_produtos_pedidos: {
        Row: {
          ass_id: number | null
          categoria_id: number | null
          data_criacao: string | null
          ingrediente_id: number | null
          ingredientes_id: number | null
          nome_ingrediente: string | null
          produto_id: number | null
          produtos_pedidos_id: number | null
          random_id: number | null
          sku: string | null
          valor: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ass_produtos_pedidos_ingredientes_id_fkey"
            columns: ["ingredientes_id"]
            isOneToOne: false
            referencedRelation: "ingredientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ass_produtos_pedidos_ingredientes_id_fkey"
            columns: ["ingredientes_id"]
            isOneToOne: false
            referencedRelation: "ingredientes_produtos_pedidos"
            referencedColumns: ["ingrediente_id"]
          },
          {
            foreignKeyName: "ass_produtos_pedidos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ass_produtos_pedidos_produtos_pedidos_id_fkey"
            columns: ["produtos_pedidos_id"]
            isOneToOne: false
            referencedRelation: "produtos_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      view_pedidos_completos: {
        Row: {
          comanda_id: number | null
          data_pedido: string | null
          empresa_id: number | null
          identificacao: string | null
          mesa_id: number | null
          mesa_nome: string | null
          nomes_produtos: string[] | null
          novo_item: boolean | null
          numero_comanda: string | null
          pedido_id: number | null
          status_pedido: number | null
          tipo_pedido: number | null
          valor_pedido: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_comanda_id_fkey"
            columns: ["comanda_id"]
            isOneToOne: false
            referencedRelation: "comandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "cores_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "pedidos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "pedidos_mesa_id_fkey"
            columns: ["mesa_id"]
            isOneToOne: false
            referencedRelation: "mesas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_status_pedido_fkey"
            columns: ["status_pedido"]
            isOneToOne: false
            referencedRelation: "status_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_produtos_pedidos_lista: {
        Row: {
          nomes_produtos: string[] | null
          novo_item: boolean | null
          pedido_id: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      count_cron: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      deletar_tokens_login_antigos: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      permissao_usuario: {
        Args: { cargo: number; id_empresa: number }
        Returns: boolean
      }
      total_comandas: {
        Args: { search: string }
        Returns: number
      }
      total_ingredientes: {
        Args: { search: string }
        Returns: number
      }
      total_pedidos: {
        Args: { filtro_status: number; pedido_tipo: number; search: string }
        Returns: number
      }
      total_produtos: {
        Args: { search: string }
        Returns: number
      }
      verificar_pedido_existente_comanda: {
        Args: { comanda_ocupada: boolean; id_comanda: number }
        Returns: number
      }
      verificar_pedido_existente_mesa: {
        Args: { id_mesa: number; mesa_ocupada: boolean }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
