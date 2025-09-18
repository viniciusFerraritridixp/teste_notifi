import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Categoria {
  id: number;
  nome: string | null;
  imagem_url: string | null;
}

interface MenuSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const MenuSidebar = ({ activeCategory, onCategoryChange }: MenuSidebarProps) => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch de categorias apenas na montagem
  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("categorias_prod")
        .select("id, nome, imagem_url")
        .order("ordem", { ascending: true });

      if (error) {
        console.error("Erro ao buscar categorias:", error);
      } else if (mounted && data) {
        setCategories(
          data.map((d) => ({
            id: d.id,
            nome: d.nome,
            imagem_url: d.imagem_url,
          }))
        );
      }

      if (mounted) setLoading(false);
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  // (removido) seleção automática: o componente pai agora controla activeCategory

  return (
  // usar h-full para ocupar a altura do container pai (main controlará o scroll)
  <div className="w-[160px] h-full overflow-auto sticky top-0">
      {loading && (
        <div className="p-4 text-sm text-muted-foreground">Carregando categorias...</div>
      )}

      {!loading && categories.length === 0 && (
        <div className="p-4 text-sm text-muted-foreground">Nenhuma categoria encontrada</div>
      )}

  {categories.map((category) => {
  const selectedId = activeCategory && String(activeCategory) !== '' ? String(activeCategory) : String(categories[0]?.id ?? '1');
    const isActive = String(category.id) === selectedId;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(String(category.id))}
            className={`w-full h-[240px] flex flex-col gap-2 justify-center items-center transition-all duration-200 overflow-hidden ${
              isActive
                ? "bg-menu-hover text-primary-foreground"
                : "text-muted-foreground hover:bg-menu-hover hover:text-primary-foreground"
            }`}
          >
            {category.imagem_url ? (
              // imagem vinda do campo imagem_url
              <img
                src={category.imagem_url}
                alt={category.nome ?? "categoria"}
                className="w-24 h-24 object-cover rounded-full"
              />
            ) : (
              // fallback simples quando não há imagem
              <div className="w-12 h-12 bg-muted-foreground/10 rounded-full flex items-center justify-center text-xs">
                {category.nome ? category.nome.charAt(0) : "?"}
              </div>
            )}

            <span className="font-medium text-center text-base">{category.nome}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MenuSidebar;