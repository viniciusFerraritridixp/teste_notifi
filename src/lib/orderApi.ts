import { supabase } from '@/integrations/supabase/client';
import type { CartItem } from '@/lib/cart';

type ProcessResult = {
  pedidoId: number | null;
  produtosPedidosIds: number[];
  error?: string;
};

/**
 * Processa uma comanda: chama a função PL/pgSQL verificar_pedido_existente_comanda_v2
 * e insere os produtos e seus ingredientes/associações.
 *
 * Assunções:
 * - A função RPC aceita um parâmetro chamado `comanda` (string) e retorna um bigint (pedido id).
 *   Se sua função usa outro nome de parâmetro, ajuste o objeto passado para rpc().
 * - Os arrays additionals / removedIngredients / accompaniments podem conter IDs numéricos
 *   (strings numéricas) ou nomes. Se for ID, será gravado em ingredientes_id.
 */
export async function processComanda(comanda: string, items: CartItem[]): Promise<ProcessResult> {
  const result: ProcessResult = { pedidoId: null, produtosPedidosIds: [] };

  try {
    // Tentar obter empresa_id do usuário logado (prioridade)
    let currentUserEmpresaId: number | null = null;
    try {
      const { data: userData } = await supabase.auth.getUser();
  const user = (userData as unknown as { user?: Record<string, unknown> })?.user ?? null;
      if (user) {
        const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
        const metaEmpresa = meta?.empresa_id ?? meta?.empresaId ?? null;
        currentUserEmpresaId = metaEmpresa != null ? (Number(metaEmpresa) || null) : null;
        // se não encontrou em metadata, buscar na tabela `usuarios` pelo user_id
        if (currentUserEmpresaId == null) {
          try {
            const { data: usuarioRow, error: usuarioErr } = await supabase
              .from('usuarios')
              .select('empresa_id')
              .eq('user_id', user.id)
              .single();
            if (!usuarioErr && usuarioRow && (usuarioRow as unknown as Record<string, unknown>).empresa_id != null) {
              currentUserEmpresaId = Number((usuarioRow as unknown as Record<string, unknown>).empresa_id) || null;
            }
          } catch (_) {
            // ignore
          }
        }
      }
    } catch (_) {
      // ignore errors when fetching user
    }
    // Chamar função RPC para obter/garantir pedido existente pela comanda
    // Tenta vários nomes de parâmetro para compatibilidade com diferentes assinaturas de RPC
    // Prioriza o nome sugerido pelo banco: p_codigo_comanda
    const rpcParamAttempts = [{ p_codigo_comanda: comanda }, { comanda }];
    let rpcData: unknown = null;
    const rpcErrors: string[] = [];
    for (const params of rpcParamAttempts) {
      const { data, error } = await supabase.rpc('verificar_pedido_existente_comanda_v2', params as Record<string, unknown>);
      if (!error) {
        rpcData = data;
        break;
      }
      rpcErrors.push(String(error?.message ?? error));
      // continue tentando com o próximo formato
    }
    if (rpcData == null) {
      throw new Error('RPC verificar_pedido_existente_comanda_v2 failed with provided params: ' + rpcErrors.join(' | '));
    }

    // rpcData pode ser um array ou um valor direto conforme a função; tentamos extrair número
    let pedidoId: number | null = null;
    if (rpcData == null) {
      throw new Error('RPC returned null for pedido id');
    }

    // rpcData might be { verificar_pedido_existente_comanda_v2: 123 } or directly 123
    if (typeof rpcData === 'object' && rpcData !== null) {
      // try common keys
      const vals = Object.values(rpcData).filter(v => typeof v === 'number' || typeof v === 'string');
      if (vals.length > 0) pedidoId = Number(vals[0]);
    } else {
      pedidoId = Number(rpcData);
    }

    if (!pedidoId || Number.isNaN(pedidoId)) throw new Error('Invalid pedido id from RPC: ' + String(rpcData));
    result.pedidoId = pedidoId;

    // Loop through cart items and insert into produtos_pedidos
    for (const it of items) {
      const produtoIdNum = it.product?.id ? (Number(it.product.id) || null) : null;
      // tentar extrair empresa_id do produto, se disponível. Pode vir como empresa_id, empresaId ou ownerEmpresa
      const empresaIdFromProduct = (it.product as Record<string, unknown> | undefined)?.empresa_id ??
        (it.product as Record<string, unknown> | undefined)?.empresaId ??
        (it.product as Record<string, unknown> | undefined)?.ownerEmpresa ?? null;
      const empresaIdNum = empresaIdFromProduct != null ? Number(empresaIdFromProduct) || null : null;
      const unitPrice = it.unitPrice ?? (typeof it.product?.price === 'number' ? it.product.price : null);
      const quantidade = it.quantity ?? 1;
      const valorTotal = (it.totalPrice ?? unitPrice ?? 0) * quantidade;

      const insertProd: Record<string, unknown> = {
        produto_id: produtoIdNum,
        produto_nome: it.product?.name ?? null,
        valor_unit: unitPrice,
        img_url: it.product?.image ?? null,
        descricao: it.product?.description ?? null,
        categoria_id: null,
        pedido_id: pedidoId,
        cod_sku: null,
        quantidade: quantidade,
        valor_total: valorTotal,
        lista_ids: null,
        // Priorizar empresa_id do usuário logado, senão usar o do produto
        empresa_id: currentUserEmpresaId ?? empresaIdNum,
      };

      const { data: insertedProd, error: insertProdErr } = await supabase
        .from('produtos_pedidos')
        .insert(insertProd)
        .select('id')
        .single();

      if (insertProdErr) throw insertProdErr;
      const produtoPedidoId = insertedProd?.id ? Number(insertedProd.id) : null;
      if (!produtoPedidoId) throw new Error('Failed to get produtoPedido id after insert');
      result.produtosPedidosIds.push(produtoPedidoId);

      // Now insert associations (additionals, removedIngredients, accompaniments)
  const assInserts: Array<Record<string, unknown>> = [];

      const pushAss = (val: unknown) => {
        // support legacy string/number values as well as new object shape { id, nome, categoriaId, categoria }
        if (val == null) return;
        // object shape
        if (typeof val === 'object' && !Array.isArray(val)) {
          const anyVal = val as Record<string, unknown>;
          const idRaw = anyVal['id'] ?? anyVal['ing_id'] ?? anyVal['ingredientes_id'];
          const nome = anyVal['nome'] ?? anyVal['ing_nome'] ?? anyVal['nome_ingrediente'] ?? null;
          const categoriaRaw = anyVal['categoriaId'] ?? anyVal['categoria_id'] ?? anyVal['categoria'] ?? null;
          const idNum = idRaw != null ? Number(idRaw) : null;
          const categoriaId = categoriaRaw != null ? (Number(categoriaRaw) || null) : null;

          if (idNum != null && !Number.isNaN(idNum)) {
            assInserts.push({ produtos_pedidos_id: produtoPedidoId, produto_id: produtoIdNum, ingredientes_id: idNum, categoria_id: categoriaId, nome_ingrediente: nome ?? null, random_id: null });
          } else {
            assInserts.push({ produtos_pedidos_id: produtoPedidoId, produto_id: produtoIdNum, ingredientes_id: null, categoria_id: categoriaId, nome_ingrediente: nome ? String(nome) : String(idRaw ?? ''), random_id: null });
          }
          return;
        }

        // primitive shape (string/number)
        const maybeNum = Number(val as unknown as string);
        if (!Number.isNaN(maybeNum) && String(val).trim() !== '') {
          assInserts.push({ produtos_pedidos_id: produtoPedidoId, produto_id: produtoIdNum, ingredientes_id: maybeNum, categoria_id: null, nome_ingrediente: null, random_id: null });
        } else {
          assInserts.push({ produtos_pedidos_id: produtoPedidoId, produto_id: produtoIdNum, ingredientes_id: null, categoria_id: null, nome_ingrediente: String(val), random_id: null });
        }
      };

      (it.additionals || []).forEach(pushAss);
      (it.removedIngredients || []).forEach(pushAss);
      (it.accompaniments || []).forEach(pushAss);

      if (assInserts.length > 0) {
        const { error: assErr } = await supabase.from('ass_produtos_pedidos').insert(assInserts);
        if (assErr) throw assErr;
      }
    }

    return result;
  } catch (err: unknown) {
    console.error('processComanda error', err);
    let msg = String(err);
    if (err && typeof err === 'object' && 'message' in err) {
      msg = (err as { message?: unknown }).message as string || String(err);
    }
    return { ...result, error: String(msg) };
  }
}

export default processComanda;
