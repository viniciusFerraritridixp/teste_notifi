import React, { useMemo } from "react";
import { ArrowUp } from "lucide-react";

type PedidoBarProps = {
  total?: number | string;
  cor1?: string; // cor principal (aba)
  cor3?: string; // linha fina
  onCancel?: () => void;
  onContinue?: () => void;
  onOpen?: () => void;
  className?: string;
};

function formatCurrency(v: number | string | undefined) {
  if (v == null) return "R$ 0,00";
  const num = typeof v === "number" ? v : parseFloat(String(v).replace(',', '.'));
  if (Number.isNaN(num)) return String(v);
  return `R$ ${num.toFixed(2).replace('.', ',')}`;
}

function PedidoBar({
  total = 0,
  cor1 = "#111111",
  cor3 = "#6b7280",
  onCancel,
  onContinue,
  onOpen,
  className = "",
}: PedidoBarProps) {
  const style = useMemo(() => ({
    "--cor1": cor1,
    "--cor3": cor3,
  } as React.CSSProperties), [cor1, cor3]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 flex flex-col items-center ${className}`}
      style={style}
      aria-label="Barra de pedido"
    >
      <div
        className="w-[180px] h-[42px] rounded-t-[12px] bg-[#4f2517] flex items-center justify-center gap-1.5 text-white select-none cursor-pointer"
        onClick={() => onOpen && onOpen()}
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
            {/* CANCELAR */}
            <div className="pl-1.5">
              <div className="rounded-[8px] p-[3px]" style={{ background: "linear-gradient(0deg, #9F9F9F 30%, #CECECE 100%)" }}>
                <button
                  type="button"
                  onClick={onCancel}
                  aria-label="Cancelar"
                  className="w-[200px] h-[46px] rounded-[6px] flex items-center justify-center bg-transparent text-white font-semibold text-[18px] leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  style={{ background: "linear-gradient(180deg, #292929 20%, #3E3E3E 100%)" }}
                >
                  CANCELAR
                </button>
              </div>
            </div>

            {/* TOTAL */}
            <div className="rounded-[24px] bg-[#636363] p-[2px]">
              <div className="h-[46px] min-w-[120px] rounded-[24px] bg-white flex items-center justify-center px-3">
                <span className="text-[20px] font-bold text-black leading-none">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* CONTINUAR */}
            <div className="pr-1.5">
              <div className="rounded-[8px] p-[3px] shadow-md" style={{ background: "linear-gradient(0deg, #B0B0B0 20%, #D6D6D6 60%, #FFFFFF 100%)" }}>
                <button
                  type="button"
                  onClick={onContinue}
                  aria-label="Continuar"
                  className="w-[200px] h-[46px] rounded-[6px] flex items-center justify-center text-black font-semibold text-[18px] leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
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
  );
}

export default React.memo(PedidoBar);
