import { useEffect, useState, useMemo, useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight  } from 'lucide-react';
import Header from '@/components/Header';
import KeyButton from "@/components/ui/3d-button";
import MenuSidebar from '@/components/MenuSidebar';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import CartUnified from '@/components/CartUnified';
import { supabase } from '@/integrations/supabase/client';
import type { Product as UIProduct } from '@/data/menuData';

const Index = () => {
  // iniciar com '1' para garantir que a categoria com id=1 venha selecionada por padrão
  const [activeCategory, setActiveCategory] = useState<string>('1');
  const [categoryMap, setCategoryMap] = useState<Record<string, number | null>>({ all: null });
  
  type Product = {
    id: number;
    nome?: string | null;
    descricao?: string | null;
    img_url?: string | null;
    valor?: number | string | null;
    categoria_id?: number | null;
    sub_cat_id?: number | null;
    visivel?: boolean | null;
  };

  const [products, setProducts] = useState<Product[]>([]);
  
  // Produtos carregados sem filtro por subcategoria — usados apenas para calcular
  // quais subcategorias têm produtos (evita que a seleção de subcategoria oculte
  // as outras opções)
  const [productsAll, setProductsAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<Array<{id: number; nome: string; cat_id: number}>>([]);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const prevActiveRef = useRef<string | null>(null);

  // Carrega produtos do Supabase, reexecuta quando activeCategory ou categoryMap mudam
  useEffect(() => {
    // Carrega produtos usados para contagem/visibilidade de subcategorias.
    // Não inclui filtro por sub_cat_id para evitar que a seleção de uma
    // subcategoria esconda as outras.
    let isMountedAll = true;
    const loadAll = async () => {
      try {
        let mapId: number | null | undefined = undefined;
        if (/^\d+$/.test(String(activeCategory))) {
          mapId = Number(activeCategory);
        } else {
          mapId = categoryMap[activeCategory];
        }

        let queryAll = supabase
          .from('produtos')
          .select('*')
          .eq('visivel', true)
          .order('nome', { ascending: true });

        if (mapId != null) {
          queryAll = queryAll.eq('categoria_id', mapId);
        }

        const { data: dataAll, error: errorAll } = await queryAll;
        if (!isMountedAll) return;
        if (errorAll) {
          setProductsAll([]);
        } else {
          setProductsAll(dataAll ?? []);
        }
      } catch (e) {
        if (!isMountedAll) return;
        setProductsAll([]);
      }
    };

    loadAll();
    return () => { isMountedAll = false; };
  }, [activeCategory, categoryMap]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // activeCategory pode ser uma key textual (ex: 'lanches') ou um id em string (ex: '3')
        let mapId: number | null | undefined = undefined;

        // se activeCategory for um número em string, usamos esse id diretamente
        if (/^\d+$/.test(String(activeCategory))) {
          mapId = Number(activeCategory);
        } else {
          mapId = categoryMap[activeCategory];
        }

        let query = supabase
          .from('produtos')
          .select('*')
          .eq('visivel', true)
          .order('nome', { ascending: true });

        // se houver um id de categoria (não null), aplicamos filtro por categoria_id
        if (mapId != null) {
          query = query.eq('categoria_id', mapId);
        }

        // se houver subcategoria ativa (string não vazia e numérica), aplicamos filtro por sub_cat_id
        if (activeSubcategory && /^\d+$/.test(activeSubcategory)) {
          query = query.eq('sub_cat_id', Number(activeSubcategory));
        }

        const { data, error } = await query;

        if (!isMounted) return;
        if (error) {
          setError(error.message);
          setProducts([]);
        } else {
          setProducts(data ?? []);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const getMessage = (e: unknown) => {
          if (typeof e === 'string') return e;
          if (e && typeof e === 'object' && 'message' in e) {
            const m = (e as Record<string, unknown>).message;
            if (typeof m === 'string') return m;
          }
          return String(e);
        };

        setError(getMessage(err));
        setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, [activeCategory, categoryMap, activeSubcategory]);

  // Carrega categorias e constrói um mapa nome -> id (lowercase)
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from('categorias_prod')
        .select('*')
        .order('ordem', { ascending: true });

      if (!isMounted) return;
      if (error) {
        console.warn('failed to load categories', error.message);
        return;
      }

      const map: Record<string, number | null> = { all: null };
      (data ?? []).forEach((c: { id: number; nome?: string | null }) => {
        if (c && c.nome) {
          map[String(c.nome).toLowerCase()] = c.id;
        }
      });

      setCategoryMap(map);
    };

    loadCategories();
    return () => { isMounted = false; };
  }, []);

  // Depois de carregar o categoryMap, se activeCategory não foi definido,
  // seleciona a primeira categoria disponível para que venha visualmente ativa.
  useEffect(() => {
    if ((activeCategory === undefined || activeCategory === null || activeCategory === '') && Object.keys(categoryMap).length > 0) {
      // pegar a primeira entry que não seja 'all'
      const entries = Object.entries(categoryMap).filter(([k]) => k !== 'all');
      if (entries.length > 0) {
        const firstId = entries[0][1];
        if (firstId != null) setActiveCategory(String(firstId));
      }
    }
  }, [categoryMap, activeCategory]);

  // Quando a activeCategory mudar por interação do usuário, rolar o container de produtos para o topo.
  useEffect(() => {
    // ignorar a primeira renderização (inicialização)
    if (prevActiveRef.current !== null && prevActiveRef.current !== activeCategory) {
      if (mainRef.current) {
        try {
          mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          mainRef.current.scrollTop = 0;
        }
      }
    }
    prevActiveRef.current = activeCategory;
  }, [activeCategory]);

  // Carrega subcategorias baseadas na categoria selecionada
  useEffect(() => {
    let isMounted = true;
    const loadSubcategories = async () => {
      // Obter o cat_id da categoria selecionada
      let catId: number | null = null;
      if (/^\d+$/.test(String(activeCategory))) {
        catId = Number(activeCategory);
      } else {
        catId = categoryMap[activeCategory] || null;
      }

      if (!catId) {
        setSubcategories([]);
        return;
      }

      const { data, error } = await supabase
        .from('sub_categorias')
        .select('id, nome, cat_id')
        .eq('cat_id', catId)
        .order('nome', { ascending: true });

      if (!isMounted) return;
      if (error) {
        console.warn('failed to load subcategories', error.message);
        setSubcategories([]);
        return;
      }

      setSubcategories(data || []);
    };

    loadSubcategories();
    return () => { isMounted = false; };
  }, [activeCategory, categoryMap]);

  // Reset subcategoria quando mudar a categoria principal
  useEffect(() => {
    setActiveSubcategory('');
  }, [activeCategory]);

  const filteredProducts = products.filter(product => {
    // Como o filtro já é feito na query do servidor, só precisamos garantir
    // que o produto pertence à categoria se não há mapId definido
    const mapId = categoryMap[activeCategory];
    if (mapId == null) return true; // all
    
    return product.categoria_id === mapId;
  });
  
  // Paginação: 4 produtos por página
  const [page, setPage] = useState<number>(0);
  const [direction, setDirection] = useState<1 | -1 | 0>(0); // 1 avança, -1 volta, 0 reset
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginated = filteredProducts.slice(page * pageSize, page * pageSize + pageSize);

  // Resetar página quando categoria ou produtos mudarem
  useEffect(() => {
    // reset quando categoria, subcategoria ou número de produtos filtrados mudar
    setPage(0);
  }, [activeCategory, activeSubcategory, filteredProducts.length]);

  // Garantir que a página atual esteja dentro do intervalo válido sempre que pageCount mudar
  useEffect(() => {
    setPage(p => Math.min(p, Math.max(0, pageCount - 1)));
  }, [pageCount]);
  
  // Somente mostrar subcategorias que tenham ao menos um produto associado
  const visibleSubcategories = useMemo(() => {
    if (!subcategories || subcategories.length === 0) return [];
    if (!productsAll || productsAll.length === 0) return [];

    const presentIds = new Set<number>(productsAll.map(p => Number(p.sub_cat_id)).filter(id => !Number.isNaN(id)));
    return subcategories.filter(sc => presentIds.has(Number(sc.id)));
  }, [subcategories, productsAll]);

  // Se a subcategoria ativa não existir mais entre as visíveis, reset para 'todas'
  useEffect(() => {
    if (!activeSubcategory) return;
    if (!/^[0-9]+$/.test(activeSubcategory)) return;

    const id = Number(activeSubcategory);
    const stillVisible = visibleSubcategories.some(sc => sc.id === id);
    if (!stillVisible) setActiveSubcategory('');
  }, [activeSubcategory, visibleSubcategories]);
  
  // Selecionar automaticamente a primeira subcategoria visível se nenhuma estiver ativa
  useEffect(() => {
    if ((!activeSubcategory || activeSubcategory === '') && visibleSubcategories.length > 0) {
      setActiveSubcategory(String(visibleSubcategories[0].id));
    }
  }, [visibleSubcategories, activeSubcategory]);
  
  const truncate = (text?: string, max = 60) => {
    if (!text) return '';
    return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
  };

  const formatCurrency = (v: unknown) => {
    if (v == null) return '0,00';
    const num = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
    if (Number.isNaN(num)) return '0,00';
    return num.toFixed(2).replace('.', ',');
  };

  return (
  <div className="min-h-screen text-black flex flex-col relative" style={{ background: "linear-gradient(130deg, #7c3c23 0%, #4f2517 100%)" }}>
    <Header />
  <div className="flex-1 flex">
    <MenuSidebar 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
  <main ref={mainRef} className="relative flex-1 pl-8 pr-8 pt-3 pb-3 bg-white min-h-0">
          {/* Barra de subcategorias - só aparece se existirem subcategorias */}
          {visibleSubcategories.length > 0 && (
            <div className="mb-2">
              <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
                {visibleSubcategories.map((subcat) => (
                  <button
                    key={subcat.id}
                    onClick={() => setActiveSubcategory(prev => prev === String(subcat.id) ? '' : String(subcat.id))}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSubcategory === String(subcat.id)
                        ? 'bg-amber-800 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {subcat.nome}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Painel branco arredondado (container principal) */}
          <div className="h-full flex flex-col">
                {/* (os botões foram movidos para baixo) */}

                <div
                  key={page}
                  className={`grid grid-cols-1 mt-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 
                    ${direction === 1 ? 'animate-slide-forward' : direction === -1 ? 'animate-slide-backward' : 'animate-slide-reset'}`}
                >
                  {paginated.map((product) => {
                    const uiProduct: UIProduct = {
                      id: String(product.id),
                      name: product.nome ?? '',
                      price: typeof product.valor === 'number' ? product.valor : parseFloat(String(product.valor ?? 0)) || 0,
                      image: product.img_url ?? '/placeholder.svg',
                      category: '',
                      description: product.descricao ?? '',
                      ingredients: [],
                    };

                    return (
                      <ProductDetailsModal key={product.id} product={uiProduct}>
                        <KeyButton
                          label={
                            <div className="flex flex-col items-center w-full h-full">
                              <div className="w-full flex-shrink-0">
                                <img
                                  src={product.img_url ?? uiProduct.image}
                                  alt={uiProduct.name ?? ''}
                                  className="w-full h-[185px] object-cover rounded-md"
                                />
                              </div>
                              <div className="text-center px-2 mt-3 w-full overflow-hidden">
                                <div className="text-lg font-bold uppercase text-white">{truncate(uiProduct.name, 16)}</div>
                                {uiProduct.description && (
                                  <div className="text-sm text-white/90 mt-2" title={uiProduct.description}>
                                    {truncate(uiProduct.description, 26)}
                                  </div>
                                )}
                                <div className="text-xl font-extrabold text-white mt-4">R$ {formatCurrency(uiProduct.price)}</div>
                              </div>
                            </div>
                          }
                          ariaLabel={`Abrir detalhes de ${uiProduct.name}`}
                          sizeWidth={260}
                          sizeHeight={320}
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
                      </ProductDetailsModal>
                    );
                  })}
                </div>

                {/* Navegação inferior centralizada com indicador de página entre os botões */}
                <div className="flex items-center justify-center gap-4 mt-6 mb-24">
                  <button
                    onClick={() => setPage(p => {
                      setDirection(-1);
                      return Math.max(0, p - 1);
                    })}
                    disabled={page <= 0}
                    aria-label="Página anterior"
                    className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-colors bg-amber-800 text-white hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <ChevronLeft />
                  </button>

                  <div className="text-sm text-gray-700 px-3 py-1 rounded-md select-none">
                    Página {page + 1} de {pageCount}
                  </div>

                  <button
                    onClick={() => setPage(p => {
                      setDirection(1);
                      return Math.min(pageCount - 1, p + 1);
                    })}
                    disabled={page >= pageCount - 1}
                    aria-label="Próxima página"
                    className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-colors bg-amber-800 text-white hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <ChevronRight />
                  </button>
                </div>

              </div>
  </main>
      </div>
    <CartUnified />
    </div>
  );
};

export default Index;
