import React from "react";
import { ArrowUp, ArrowDown, Minus, Plus } from "lucide-react";
import { useCart, CartItem } from '@/lib/cart';
import { useNavigate } from 'react-router-dom';

const formatPrice = (v: number) => v.toFixed(2).replace('.', ',');

function formatItemList(list?: Array<string | { id?: number | null; nome?: string; categoria?: string; categoriaId?: number; valor?: number }>) {
  if (!list || list.length === 0) return '';
  return list
    .map((it) => {
      if (!it) return '';
      if (typeof it === 'string') return it;
      // show only the human-friendly name in the compact cart UI
      if (it.nome) return String(it.nome);
      // fallback to id or empty string
      if (it.id != null) return `id:${it.id}`;
      return '';
    })
    .filter(Boolean)
    .join(', ');
}

export default function CartUnified(): JSX.Element {
  const { items = [], removeItem, updateQuantity, clearCart } = useCart();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const total = items.reduce((s, it) => s + (Number(it.totalPrice) || 0) * (it.quantity || 1), 0);

  function formatCurrency(v: number | string | undefined) {
    if (v == null) return "R$ 0,00";
    const num = typeof v === "number" ? v : parseFloat(String(v).replace(',', '.'));
    if (Number.isNaN(num)) return String(v);
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  }

  // CSS variables for the cart panel (typed to satisfy TS)
  // Close panel automatically when cart becomes empty while open
  React.useEffect(() => {
    if (open && (!items || items.length === 0)) setOpen(false);
  }, [items, open]);

  // CSS variables for the cart panel (typed to satisfy TS)
  const cssVars = ({ '--cor1': '#111111', '--corLinha': '#FB8C19' } as unknown) as React.CSSProperties;

  // If cart is empty, do not render this component
  if (!items || items.length === 0) return null;

  return (
    <>
      {/* PedidoBar (compact) */}
      <div 
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col items-center`}
        aria-label="Barra de pedido"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50
        }}
      >
        <div
          className="w-[180px] h-[42px] rounded-t-[12px] bg-[#4f2517] flex items-center justify-center gap-1.5 text-white select-none cursor-pointer"
          onClick={() => setOpen(true)}
          role="button"
          aria-label="Abrir carrinho"
          tabIndex={0}
        >
          <ArrowUp size={26} className="opacity-95" aria-hidden />
          <span className="font-semibold text-[18px] tracking-tight">SEU PEDIDO</span>
        </div>

        <div className="w-full h-1 bg-[#ffa247]" />

        <div
          className="w-full"
          style={{
            boxShadow: "0px -0.3px 4px 1px rgba(0,0,0,0.54)",
            background: "linear-gradient(0deg, #000 30%, #353535 100%)",
          }}
        >
          <div className="px-1.5 py-1.5">
            <div className="w-full h-[60px] rounded-[10px] flex items-center justify-between">
              <div className="pl-1.5">
                <div className="rounded-[8px] p-[3px]" style={{ background: "linear-gradient(0deg, #9F9F9F 30%, #CECECE 100%)" }}>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Cancelar"
                    className="w-[120px] h-[46px] rounded-[6px] flex items-center justify-center bg-transparent text-white font-semibold text-[16px] leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    style={{ background: "linear-gradient(180deg, #292929 20%, #3E3E3E 100%)" }}
                  >
                    CANCELAR
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#636363] p-[2px]">
                <div className="h-[46px] min-w-[120px] rounded-[24px] bg-white flex items-center justify-center px-3">
                  <span className="text-[20px] font-bold text-black leading-none">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="pr-1.5">
                <div className="rounded-[8px] p-[3px] shadow-md" style={{ background: "linear-gradient(0deg, #B0B0B0 20%, #D6D6D6 60%, #FFFFFF 100%)" }}>
                  <button
                    type="button"
                    onClick={() => { /* implementar continuar */ }}
                    aria-label="Continuar"
                    className="w-[120px] h-[46px] rounded-[6px] flex items-center justify-center text-black font-semibold text-[16px] leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                    style={{ background: "linear-gradient(180deg, #C1C1C1 20%, #E3E3E3 60%, #FFFFFF 100%)" }}
                  >
                    CONTINUAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Painel do carrinho (slide-up) */}
      {open && (
        <div
          aria-hidden={!open}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-end transition-all duration-300 pointer-events-auto`}
          style={{
            ...cssVars,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50
          }}
        >
          {/* spacer */}
          <div className="w-full" style={{ height: 320 }} />

          {/* aba superior que fecha */}
          <div
            className="pointer-events-auto w-[180px] h-[42px] rounded-t-[12px] bg-[var(--cor1)] text-white flex items-center justify-center gap-1.5 select-none cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => setOpen(false)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(false); }}
            aria-label="Fechar carrinho"
          >
            <ArrowDown size={26} className="opacity-95" />
            <span className="font-semibold text-[18px] tracking-tight">SEU PEDIDO</span>
          </div>

          <div className="pointer-events-auto w-full h-1" style={{ background: 'var(--corLinha)' }} />

          <div className={`pointer-events-auto w-full flex flex-col max-h-[60vh] transform transition-transform duration-300 translate-y-0 opacity-100`} style={{ boxShadow: '0px -0.3px 4px 1px rgba(0,0,0,0.54)', background: 'linear-gradient(0deg, #000 30%, #353535 100%)', transitionProperty: 'transform, opacity' }}>
            <div className="w-full h-[66px] flex items-center justify-between">
              <div className="pl-6 text-white font-semibold text-[30px] leading-none">SEU PEDIDO</div>

              <div className="pr-3">
                <div className="rounded-[24px] bg-[#636363] p-[2px]">
                  <div className="h-[46px] min-w-[120px] rounded-[24px] bg-white flex items-center justify-center px-3">
                    <span className="text-[24px] font-bold text-black leading-none">R$ {formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

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

            <div className="w-full px-1.5 py-1.5">
              <div className="w-full h-[60px] rounded-[10px] grid grid-cols-2 gap-5">
                <div className="rounded-[8px] p-[3px]" style={{ background: 'linear-gradient(0deg, #9F9F9F 30%, #CECECE 100%)' }}>
                  <div className="h-[46px] w-full rounded-[6px] flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #292929 20%, #3E3E3E 100%)' }} role="button" tabIndex={0} onClick={() => setOpen(false)}>
                    <span className="text-white text-[18px] font-semibold leading-none">VOLTAR</span>
                  </div>
                </div>

                <div className="rounded-[8px] p-[3px] shadow-md" style={{ background: 'linear-gradient(0deg, #B0B0B0 20%, #D6D6D6 60%, #FFFFFF 100%)' }}>
                  <div
                    className="h-[46px] w-full rounded-[6px] flex items-center justify-center"
                    style={{ background: 'linear-gradient(180deg, #C1C1C1 20%, #E3E3E3 60%, #FFFFFF 100%)' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      // navegar para a página de bipar comanda
                      setOpen(false);
                      navigate('/bipar-comanda');
                    }}
                  >
                    <span className="text-black text-[18px] font-semibold leading-none">FINALIZAR PEDIDO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------- Item do carrinho ---------------------------- */
function CarrinhoItem({ item, onRemove, onDecrement, onIncrement }: { item: CartItem; onRemove?: () => void; onDecrement?: () => void; onIncrement?: () => void }) {
  const totalItem = Number(item.totalPrice || 0);

  return (
    <div className="px-6">
      <div className="w-full h-[160px] flex">
        <div className="w-[110px] flex flex-col justify-between">
          <div className="mb-1">
            <div className="rounded-[8px] overflow-hidden w-[110px] h-[110px] bg-white/5">
              <img src={item.product?.image || 'https://upload.wikimedia.org/wikipedia/commons/6/65/Imagem_n%C3%A3o_dispon%C3%ADvel.svg'} alt={item.product?.name || 'Produto'} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="rounded-[8px] p-[3px]" style={{ background: 'linear-gradient(0deg, #B0B0B0 20%, #D6D6D6 60%, #FFFFFF 100%)' }}>
            <div className="h-[38px] rounded-[6px] flex items-center justify-between" style={{ background: 'linear-gradient(180deg, #C1C1C1 20%, #E3E3E3 60%, #FFFFFF 100%)' }}>
              <button onClick={onDecrement} className="flex-1 h-full rounded-l-[6px] flex items-center justify-center" aria-label="Diminuir">
                <Minus size={22} className="text-black" />
              </button>

              <div className="px-2 text-[18px] font-medium select-none">{item.quantity}</div>

              <button onClick={onIncrement} className="flex-1 h-full rounded-r-[6px] flex items-center justify-center" aria-label="Aumentar">
                <Plus size={28} className="text-black" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 pl-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-white font-bold text-[26px] leading-tight truncate">{item.product?.name}</div>

            <div className="text-[14px] leading-tight">
              <span className="font-medium text-emerald-400">Adicionais: </span>
              <span className="text-white/90">{formatItemList(item.additionals) || '—'}</span>
            </div>

            <div className="text-[14px] leading-tight">
              <span className="font-medium text-red-400">Remover: </span>
              <span className="text-white/90">{formatItemList(item.removedIngredients) || '—'}</span>
            </div>

            <div className="text-[14px] leading-tight">
              <span className="font-medium text-yellow-400">Acompanhamento: </span>
              <span className="text-white/90">{formatItemList(item.accompaniments) || '—'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-white font-semibold text-[20px]">R$ {formatPrice(totalItem)}</div>
            <button onClick={onRemove} className="text-[#FFAE58] text-[16px] font-semibold pr-1.5" aria-label="Remover">Remover</button>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/90 opacity-90 mt-2" />
    </div>
  );
}
