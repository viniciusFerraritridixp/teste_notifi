import React from "react";
import { ArrowDown, Minus, Plus } from "lucide-react";
import { useCart, CartItem } from '@/lib/cart';

const formatPrice = (v: number) => v.toFixed(2).replace('.', ',');

/**
 * BsCarrinho – Somente layout (sem lógicas)
 * -------------------------------------------------
 * • Conversão visual do BottomSheet do Flutter/FlutterFlow para React + Tailwind.
 * • Sem estados, sem eventos, sem navegação e sem áudio – apenas o design.
 * • Ajuste cores via CSS vars: --cor1 (aba/cabeçalho), --corLinha (linha 4px)
 *   Ex.: <div style={{"--cor1":"#111","--corLinha":"#FB8C19"}}><BsCarrinho/></div>
 */

type BsCarrinhoProps = {
  onClose?: () => void;
};

export default function BsCarrinho({ onClose }: BsCarrinhoProps) {
  const { items, removeItem, updateQuantity } = useCart();
  const total = (items || []).reduce((s, it) => s + (Number(it.totalPrice) || 0) * (it.quantity || 1), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end pointer-events-none"
      style={{
        // Defaults; podem ser sobrescritos por vars no wrapper
        "--cor1": "#111111",
        "--corLinha": "#FB8C19",
      } as React.CSSProperties}
    >
      {/* Spacer superior (equivale ao padding: 0, 400, 0, 0) */}
      <div className="w-full" style={{ height: 400 }} />

      {/* --- Aba superior "SEU PEDIDO" (fecha) --- */}
      <div
        className="pointer-events-auto w-[180px] h-[42px] rounded-t-[12px] bg-[var(--cor1)] text-white flex items-center justify-center gap-1.5 select-none cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => onClose && onClose()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (onClose) onClose();
          }
        }}
        aria-label="Fechar carrinho"
      >
        <ArrowDown size={26} className="opacity-95" />
        <span className="font-semibold text-[18px] tracking-tight">SEU PEDIDO</span>
      </div>

      {/* linha de 4px */}
      <div className="pointer-events-auto w-full h-1" style={{ background: "var(--corLinha)" }} />

      {/* Painel principal com gradiente e sombra superior */}
      <div
        className="pointer-events-auto w-full flex flex-col max-h-[60vh]"
        style={{
          boxShadow: "0px -0.3px 4px 1px rgba(0,0,0,0.54)",
          background: "linear-gradient(0deg, #000 30%, #353535 100%)",
        }}
      >
        {/* Header */}
        <div className="w-full h-[66px] flex items-center justify-between">
          <div className="pl-6 text-white font-semibold text-[30px] leading-none">SEU PEDIDO</div>

          {/* Pílula total */}
          <div className="pr-3">
            <div className="rounded-[24px] bg-[#636363] p-[2px]">
              <div className="h-[46px] min-w-[120px] rounded-[24px] bg-white flex items-center justify-center px-3">
                <span className="text-[24px] font-bold text-black leading-none">R$ {formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista scrollável (itens do carrinho) */}
        <div className="flex-1 pt-5 overflow-y-auto no-scrollbar">
          <div className="space-y-2 pb-4">
            {items.length === 0 ? (
              <div className="text-white/80 px-6">Seu carrinho está vazio</div>
            ) : (
              items.map((it) => (
                <CarrinhoItem
                  key={String(it.id)}
                  item={it}
                  onRemove={() => removeItem(it.id)}
                  onDecrement={() => updateQuantity(it.id, -1)}
                  onIncrement={() => updateQuantity(it.id, 1)}
                />
              ))
            )}
          </div>
        </div>

        {/* Barra de ações inferior */}
        <div className="w-full px-1.5 py-1.5">
          <div className="w-full h-[60px] rounded-[10px] grid grid-cols-2 gap-5">
            {/* VOLTAR */}
            <div
              className="rounded-[8px] p-[3px]"
              style={{ background: "linear-gradient(0deg, #9F9F9F 30%, #CECECE 100%)" }}
            >
              <div
                className="h-[46px] w-full rounded-[6px] flex items-center justify-center"
                style={{ background: "linear-gradient(180deg, #292929 20%, #3E3E3E 100%)" }}
                role="button"
                tabIndex={0}
                aria-label="Voltar"
              >
                <span className="text-white text-[18px] font-semibold leading-none">VOLTAR</span>
              </div>
            </div>

            {/* FINALIZAR PEDIDO */}
            <div
              className="rounded-[8px] p-[3px] shadow-md"
              style={{
                background: "linear-gradient(0deg, #B0B0B0 20%, #D6D6D6 60%, #FFFFFF 100%)",
              }}
            >
              <div
                className="h-[46px] w-full rounded-[6px] flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, #C1C1C1 20%, #E3E3E3 60%, #FFFFFF 100%)",
                }}
                role="button"
                tabIndex={0}
                aria-label="Finalizar pedido"
              >
                <span className="text-black text-[18px] font-semibold leading-none">
                  FINALIZAR PEDIDO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Item do carrinho ---------------------------- */
function CarrinhoItem({ item, onRemove, onDecrement, onIncrement }: { item: CartItem; onRemove?: () => void; onDecrement?: () => void; onIncrement?: () => void }) {
  const totalItem = Number(item.totalPrice || 0);

  return (
    <div className="px-6">
      <div className="w-full h-[160px] flex">
        {/* Coluna esquerda: imagem + controle de quantidade */}
        <div className="w-[110px] flex flex-col justify-between">
          <div className="mb-1">
            <div className="rounded-[8px] overflow-hidden w-[110px] h-[110px] bg-white/5">
              <img
                src={item.product?.image || 'https://upload.wikimedia.org/wikipedia/commons/6/65/Imagem_n%C3%A3o_dispon%C3%ADvel.svg'}
                alt={item.product?.name || 'Produto'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Controle de quantidade (apenas layout) */}
          <div
            className="rounded-[8px] p-[3px]"
            style={{
              background: "linear-gradient(0deg, #B0B0B0 20%, #D6D6D6 60%, #FFFFFF 100%)",
            }}
          >
            <div
              className="h-[38px] rounded-[6px] flex items-center justify-between"
              style={{
                background: "linear-gradient(180deg, #C1C1C1 20%, #E3E3E3 60%, #FFFFFF 100%)",
              }}
            >
              <button
                onClick={onDecrement}
                className="flex-1 h-full rounded-l-[6px] flex items-center justify-center"
                aria-label="Diminuir"
              >
                <Minus size={22} className="text-black" />
              </button>

              <div className="px-2 text-[18px] font-medium select-none">{item.quantity}</div>

              <button
                onClick={onIncrement}
                className="flex-1 h-full rounded-r-[6px] flex items-center justify-center"
                aria-label="Aumentar"
              >
                <Plus size={28} className="text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* Coluna direita: infos */}
        <div className="flex-1 pl-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-white font-bold text-[26px] leading-tight truncate">
              {item.product?.name}
            </div>

            {/* Adicionais */}
            <div className="text-[14px] leading-tight">
              <span className="font-medium text-emerald-400">Adicionais: </span>
              <span className="text-white/90">{(item.additionals || []).join(', ') || '—'}</span>
            </div>

            {/* Remover */}
            <div className="text-[14px] leading-tight">
              <span className="font-medium text-red-400">Remover: </span>
              <span className="text-white/90">{(item.removedIngredients || []).join(', ') || '—'}</span>
            </div>

            {/* acompanhamentos */}
            <div className="text-[14px] leading-tight">
              <span className="font-medium text-yellow-400">Acompanhamento: </span>
              <span className="text-white/90">{(item.accompaniments || []).join(', ') || '—'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-white font-semibold text-[20px]">R$ {formatPrice(totalItem)}</div>
            <button onClick={onRemove} className="text-[#FFAE58] text-[16px] font-semibold pr-1.5" aria-label="Remover">
              Remover
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-white/90 opacity-90 mt-2" />
    </div>
  );
}
