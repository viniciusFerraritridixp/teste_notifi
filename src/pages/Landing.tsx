import { Coffee, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import KeyButton from "@/components/ui/3d-button";
import { useNavigate } from "react-router-dom";
import logoTridi from '@/assets/logo_tridi-removebg-preview.png';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

function LogoFromDB() {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('empresas')
          .select('logo_url')
          .limit(1)
          .single();
        if (!mounted) return;
        if (!error && data && data.logo_url) setLogo(data.logo_url as string);
      } catch (_) {
        // ignore, fallback will be used
      }
    };
    load();
    return () => { mounted = false; };
  }, []);
  return (
    <>
      <style>{`
        @keyframes logoShake {
          0% { transform: translateY(0) rotate(0deg); }
          20% { transform: translateY(-6px) rotate(-3deg); }
          40% { transform: translateY(0) rotate(0deg); }
          60% { transform: translateY(-6px) rotate(3deg); }
          80% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .logo-shake {
          animation: logoShake 1.6s ease-in-out infinite;
        }
      `}</style>
  <img src={logo ?? logoTridi} alt="Empresa" className="w-80 h-80 rounded-full object-cover border-2 border-white logo-shake shadow-2xl shadow-black/50" />
    </>
  );
}

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-900 flex flex-col items-center justify-center px-6 text-white">
      {/* Logo */}
      <div className="mb-8">
          <div className="text-center">
            {/* Company logo from DB (fallback to local asset) */}
            <LogoFromDB />
          </div>
      </div>

      {/* Welcome Text */}
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-3xl sm:text-4xl font-medium leading-relaxed">
          Bem vindo!! Clique abaixo para<br />
          acessar nosso catálogo
        </h1>
      </div>

      {/* Arrow Icons */}
      <div className="mb-8 flex flex-col items-center">
        <ChevronDown size={46} className="animate-bounce" />
        <ChevronDown size={46} className="animate-bounce" />
      </div>

      {/* Access Button */}
      <KeyButton
        label="Acessar catálogo"
        onClick={() => navigate('/choose-place')}
        ariaLabel="Acessar catálogo"
        sizeWidth={420}
        sizeHeight={100}
	      paddingVar={4}
        outerRadius={16}
        innerRadius={12}
        fontSize={34}
        fontWeight={500}
        outerGradient="linear-gradient(0deg, #ffa247 0%, #b84f03 100%)"
        innerGradient="linear-gradient(180deg, #ffa247 0%, #b84f03 100%)"
        shadow="0px 4px 16px 2px rgba(0,0,0,0.30)"
        textColor="#fff"
      />

      {/* Footer Logo */}
      <div className="absolute bottom-8 right-8">
        <img src={logoTridi} alt="Tridi" className="w-28 opacity-90" />
      </div>
    </div>
  );
};

export default Landing;