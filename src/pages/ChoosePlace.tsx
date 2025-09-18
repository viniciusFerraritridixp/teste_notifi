import React from 'react';
import Header from '@/components/Header';
import { ArrowRight, ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import KeyButton from "@/components/ui/3d-button";
import { useNavigate } from 'react-router-dom';
import comerAquiImg from '@/assets/comerAqui.png';
import levarImg from '@/assets/levar.png';

export default function ChoosePlace() {
  const navigate = useNavigate();
  return (
  <div className="h-screen bg-white text-black overflow-hidden" style={{ background: "linear-gradient(130deg, #7c3c23 0%, #4f2517 100%)" }}>
      <Header />

      <main className="container mx-auto px-6 py-12 bg-white h-full">
        <section className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">ONDE PREFERE COMER?</h1>
          <p className="text-sm text-gray-500 mb-10">Você pode se sentar à mesa ou então consumir no seu lar, qual seria a melhor opção para você?</p>
        </section>

        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center">
            {/* Card 1 */}
            <KeyButton
        label={
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
          {/* Imagem fixa no topo */}
          <div className="flex items-center justify-center">
                        <img
                        src={levarImg}
                        alt="Levar para casa"
                        className="w-[210px] h-[210px] object-cover rounded-md"
                        />
          </div>

          {/* Conteúdo abaixo da imagem - truncado para não expandir o card */}
                    <div className="text-center px-2 mt-1 w-full overflow-hidden flex items-center justify-center flex-col gap-3">
                        <div className="text-lg font-bold uppercase text-white">Prefiro levar para casa</div>
                        <div className="text-white/90 flex items-center justify-center">
                          <ArrowLeftCircle size={28} />
                        </div>
                    </div>
          </div>
        }
                onClick={() => navigate('/cardapio')}
                ariaLabel={`LEVAR`}
                sizeWidth={280}
                sizeHeight={420}
                paddingVar={6}
                outerRadius={16}
                innerRadius={12}
                fontSize={18}
                fontWeight={500}
                outerGradient="linear-gradient(150deg, #7c3c23 0%, #4f2517 100%)"
                innerGradient="linear-gradient(300deg, #7c3c23 0%, #4f2517 100%)"
                shadow="0px 4px 16px 2px rgba(0,0,0,0.30)"
                textColor="#fff"
                />

            {/* Card 2 */}
            <KeyButton
        label={
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
          {/* Imagem fixa no topo */}
          <div className="flex items-center justify-center">
                        <img
                        src={comerAquiImg}
                        alt="Comer aqui"
                        className="w-[210px] h-[210px] object-cover rounded-md"
                        />
          </div>

          {/* Conteúdo abaixo da imagem - truncado para não expandir o card */}
                    <div className="text-center px-2 mt-1 w-full overflow-hidden flex items-center justify-center flex-col gap-3">
                        <div className="text-lg font-bold uppercase text-white">Vou comer <span className="font-extrabold">aqui</span></div>
                        <div className="text-white/90 flex items-center justify-center">
                          <ArrowRightCircle size={28} />
                        </div>
                    </div>
          </div>
        }
                onClick={() => navigate('/cardapio')}
                ariaLabel={`AQUI`}
                sizeWidth={280}
                sizeHeight={420}
                paddingVar={6}
                outerRadius={16}
                innerRadius={12}
                fontSize={18}
                fontWeight={500}
                outerGradient="linear-gradient(150deg, #7c3c23 0%, #4f2517 100%)"
                innerGradient="linear-gradient(300deg, #7c3c23 0%, #4f2517 100%)"
                shadow="0px 4px 16px 2px rgba(0,0,0,0.30)"
                textColor="#fff"
                />
          </div>
        </section>
      </main>
    </div>
  );
}
