import React, { useRef, useEffect, useState } from 'react';
import Header from '@/components/Header';
import LottiePlayer from '@/components/LottiePlayer';
import totemBip from '@/assets/totemBipComanda.json';
import setaParabaixo from '@/assets/setaParabaixo.json';
import { useCart } from '@/lib/cart';
import { processComanda } from '@/lib/orderApi';

export default function BiparComanda(): JSX.Element {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { items, clearCart } = useCart();
  const processingRef = React.useRef(false);

  useEffect(() => {
    // manter foco no input invisível para capturar eventos de teclado/leitor
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (value: string) => {
    if (!value || value.trim() === '') return;
    if (processingRef.current) return; // already processing
    processingRef.current = true;
    setLoading(true);
    setMessage(null);
    try {
      const res = await processComanda(value.trim(), items);
      if (res.error) {
        setMessage('Erro: ' + res.error);
      } else {
        setMessage('Comanda vinculada ao pedido #' + String(res.pedidoId));
        // opcional: limpar carrinho após vincular
        clearCart();
      }
    } catch (err: unknown) {
      let msg = String(err);
      if (err && typeof err === 'object' && 'message' in err) {
        msg = (err as { message?: unknown }).message as string || String(err);
      }
      setMessage('Erro inesperado: ' + String(msg));
    } finally {
      setLoading(false);
      processingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-secondary-white">
      {/* Header expandido com gradiente do sistema */}
      <div className="w-full h-[90px] flex items-center justify-center" style={{ background: "linear-gradient(150deg, #7c3c23 0%, #4f2517 100%)" }}>
        <Header/>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto p-6 flex flex-col items-center justify-start">
        <h1 className="text-2xl font-semibold text-center mb-6 text-black">Aproxime a comanda do leitor para vinculá-la ao seu pedido</h1>

        {/* input invisível */}
        <input
          ref={hiddenInputRef}
          aria-hidden={false}
          className="opacity-0 absolute w-0 h-0 pointer-events-none"
          type="text"
          autoFocus
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value;
              (e.target as HTMLInputElement).value = '';
              await handleSubmit(val);
            }
          }}
        />

        {/* Lottie principal (totem) */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-[660px] h-[500px]">
            <LottiePlayer animationData={totemBip} loop={true} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        {/* Lottie secundária (vazia por enquanto) */}
        <div className="w-full flex justify-center mt-4">
          <div className="w-[300px] h-[300px]">
            <LottiePlayer animationData={setaParabaixo} loop={true} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        {loading && <div className="mt-4 text-sm">Processando...</div>}
        {message && <div className="mt-4 text-sm text-black">{message}</div>}
      </main>
    </div>
  );
}
