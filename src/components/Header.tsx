import { useEffect, useState } from "react";
import { ArrowLeft, ArrowBigLeft  } from 'lucide-react';
import KeyButton from "@/components/ui/3d-button";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const loadLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('empresas')
          .select('logo_url')
          .limit(1)
          .single();

        if (!mounted) return;
        if (error) {
          console.warn('failed to load logo', error.message);
          setLogoUrl(null);
        } else if (data && data.logo_url) {
          setLogoUrl(data.logo_url);
        } else {
          setLogoUrl(null);
        }
      } catch (err) {
        if (!mounted) return;
        setLogoUrl(null);
      }
    };

    loadLogo();
    return () => { mounted = false; };
  }, []);

  return (
    <header className="w-full bg-transparent border-b h-[90px] border-border">
      <div className="w-full max-w-[1280px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* esquerda: botão voltar */}
          <div className="flex-1 flex items-center">
        <KeyButton
          label={ <ArrowLeft size={24} /> }
          onClick={() => navigate(-1)}
                    ariaLabel="Voltar"
                    sizeWidth={50}
                    sizeHeight={50}
                    paddingVar={3}
                    outerRadius={24}
                    innerRadius={24}
                    fontSize={22}
                    fontWeight={400}
                    outerGradient="linear-gradient(0deg, #C1C1C1 20%, #ffffff 100%)"
                    innerGradient="linear-gradient(180deg, #C1C1C1 20%, #ffffff 100%)"
                    shadow="0px 4px 16px 2px rgba(0,0,0,0.30)"
                    textColor="#4f2517"
                  />
          </div>

          {/* meio: logo */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-xs flex items-center justify-center gap-2">
              <div className="flex-1 h-[1px] bg-white" />
              <div className="mx-4 flex-shrink-0">
                <img src={logoUrl ?? '/placeholder.svg'} alt="logo" className="w-16 h-16 object-cover rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 h-[1px] bg-white" />
            </div>
          </div>

          {/* direita: vazio (placeholder) e link Entrar */}
          <div className="flex-1 flex items-center justify-end">
            <div className="mr-3" />
            <a href="/login" className="text-sm font-medium text-primary-foreground bg-primary/10 px-3 py-2 rounded">Entrar</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;