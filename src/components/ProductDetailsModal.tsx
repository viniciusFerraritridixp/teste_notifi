import React, { useState } from 'react'; // importa React e o hook useState
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'; // importa componentes de diálogo reutilizáveis
import { Button } from '@/components/ui/button'; // importa componente de botão estilizado
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // importa componentes de abas
import KeyButton from "@/components/ui/3d-button"; // importa componente customizado 3d-button usado nos botões finais
import iconeRemovido from '@/assets/icons8-cancelar-240.png'
import { useNavigate } from "react-router-dom"; // importa hook de navegação (não utilizado no momento, mas disponível)
import { Checkbox } from '@/components/ui/checkbox'; // importa checkbox customizado
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; // importa cliente do Supabase para queries
import { useCart } from '@/lib/cart';
import { Product } from '@/data/menuData'; // importa tipo Product para tipagem das props

/*
  ProductDetailsModal
  - Modal que mostra detalhes de um produto, permite remover ingredientes,
    selecionar adicionais e acompanhamentos, calcula o total com extras
    e fornece ação para adicionar ao carrinho.
  - Mantive a lógica existente de fetch/seleção/totais e apenas reorganizei
    o JSX para o layout do `puTeste` (já aplicado).
  - Comentários explicam props, estados e handlers importantes.
*/

interface ProductDetailsModalProps {
  product: Product;
  children: React.ReactNode;
}

const ProductDetailsModal = ({ product, children }: ProductDetailsModalProps) => {
  // Estado do modal (aberto/fechado)
  const [open, setOpen] = useState(false); // controla se o Dialog está aberto
  // Aba ativa (controlada) — pode ser 'ingredients' | 'additionals' | 'accompaniments'
  const [activeTab, setActiveTab] = useState<string>('ingredients');
  // Lista de nomes de ingredientes que foram 'removidos' pelo usuário
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]); // armazena strings dos ingredientes removidos
  // IDs (string) dos adicionais selecionados
  const [selectedAdditionals, setSelectedAdditionals] = useState<string[]>([]); // armazena ids selecionados como strings
  // IDs (string) dos acompanhamentos selecionados
  const [selectedAccompaniments, setSelectedAccompaniments] = useState<string[]>([]); // armazena ids dos acompanhamentos selecionados
  // Dados trazidos do Supabase: ingredientes / adicionais / acompanhamentos
  const [fetchedIngredients, setFetchedIngredients] = useState<Array<{ ing_id?: number | null; ing_nome?: string | null; ing_valor?: number | null; categoria_id?: number | null }>>([]); // ingrediente: id/nome/valor/categoria
  const [fetchedAdditionals, setFetchedAdditionals] = useState<Array<{ ing_id?: number | null; ing_nome?: string | null; ing_valor?: number | null; categoria_id?: number | null }>>([]); // adicionais
  const [fetchedAccompaniments, setFetchedAccompaniments] = useState<Array<{ ing_id?: number | null; ing_nome?: string | null; ing_valor?: number | null; categoria_id?: number | null }>>([]); // acompanhamentos
  const { addItem } = useCart();

  /**
   * Marca/desmarca um ingrediente como removido.
   * Se já existe na lista `removedIngredients`, remove (reativa o ingrediente).
   * Caso contrário, adiciona (marca como removido).
   */
  const handleRemoveIngredient = (ingredient: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((p) => p !== ingredient) : [...prev, ingredient]
    ); // atualiza o estado alternando presença do nome
  };

  /**
   * Quando o usuário confirma adicionar ao carrinho.
   * Aqui construímos um payload com o produto, itens removidos e extras
   * e depois fechamos o modal. Não há integração com estado global/carrinho
   * nesta função — é ponto de extensão (TODO: conectar ao contexto/endpoint).
   */
  const handleAddToCart = () => {
    // adiciona o item ao carrinho via contexto local
    try {
      // helper to map categoria id to readable name
      const categoriaName = (categoriaId?: number | null) => (categoriaId === 1 ? 'ingrediente' : categoriaId === 2 ? 'adicional' : 'acompanhamento');

      // map removed ingredients (we stored names) back to id + categoria when possible
      const removedIngredientsDetails = removedIngredients.map((name) => {
        const found = fetchedIngredients.find((i) => (i.ing_nome ?? '') === name);
        const categoriaId = found?.categoria_id ?? 1;
        return {
          id: found?.ing_id ?? null,
          nome: name,
          categoriaId,
          categoria: categoriaName(categoriaId),
        };
      });

      const additionalsDetails = selectedAdditionals.map((idStr) => {
        const idNum = Number(idStr);
        const found = fetchedAdditionals.find((a) => Number(a.ing_id) === idNum);
        const categoriaId = found?.categoria_id ?? 2;
        return {
          id: found?.ing_id ?? idNum,
          nome: found?.ing_nome ?? idStr,
          valor: found?.ing_valor ?? 0,
          categoriaId,
          categoria: categoriaName(categoriaId),
        };
      });

      const accompanimentsDetails = selectedAccompaniments.map((idStr) => {
        const idNum = Number(idStr);
        const found = fetchedAccompaniments.find((a) => Number(a.ing_id) === idNum);
        const categoriaId = found?.categoria_id ?? 3;
        return {
          id: found?.ing_id ?? idNum,
          nome: found?.ing_nome ?? idStr,
          valor: found?.ing_valor ?? 0,
          categoriaId,
          categoria: categoriaName(categoriaId),
        };
      });

      const item = {
        id: `${product.id}-${Date.now()}`,
        product,
        removedIngredients: removedIngredientsDetails,
        additionals: additionalsDetails,
        accompaniments: accompanimentsDetails,
        unitPrice: Number(product.price ?? 0),
        totalPrice: Number(totalWithExtras),
        quantity: 1,
      };
      // debug: log para facilitar verificação no console do navegador
      console.log('add to cart item:', item);
      addItem(item);
  // limpar o estado do modal após adicionar ao carrinho
  setRemovedIngredients([]);
  setSelectedAdditionals([]);
  setSelectedAccompaniments([]);
  setActiveTab('ingredients');
    } catch (err) {
      console.warn('failed to add to cart', err);
    } finally {
      setOpen(false);
    }
  };

  // Formata número para moeda BR com vírgula
  const formatPrice = (v: number) => v.toFixed(2).replace('.', ','); // retorna string '0,00' -> '0,00'

  // Calcula o total dos adicionais selecionados
  const totalExtrasFromAdditionals = React.useMemo(() => {
    if (!fetchedAdditionals || fetchedAdditionals.length === 0) return 0; // sem adicionais, total 0
    return fetchedAdditionals.reduce((sum, add) => {
      const id = add.ing_id ?? -1; // id do adicional (fallback -1)
      if (selectedAdditionals.includes(String(id))) return sum + (add.ing_valor ?? 0); // soma se selecionado
      return sum; // caso contrário, não soma
    }, 0);
  }, [fetchedAdditionals, selectedAdditionals]);

  // Calcula o total dos acompanhamentos selecionados
  const totalExtrasFromAccompaniments = React.useMemo(() => {
    // Acompanhamentos não afetam o preço do produto neste fluxo — sempre retornamos 0.
    // Mantemos o estado de selecionados apenas para controle de UI (seleção exclusiva).
    return 0;
  }, []);

  // Total de todos os extras
  const totalExtras = React.useMemo(() => totalExtrasFromAdditionals + totalExtrasFromAccompaniments, [totalExtrasFromAdditionals, totalExtrasFromAccompaniments]); // soma finais

  // Total final (preço base do produto + extras)
  const totalWithExtras = React.useMemo(() => {
    const base = Number(product.price ?? 0); // converte preço base para number
    return base + totalExtras; // soma ao total de extras
  }, [product.price, totalExtras]);

  // Fecha o modal sem salvar alterações
  const handleCancel = () => {
    // limpa estados locais do modal
    setRemovedIngredients([]);
    setSelectedAdditionals([]);
    setSelectedAccompaniments([]);
    setActiveTab('ingredients');
    setOpen(false); // fecha o dialog
  };

  // Fetch: carrega ingredientes/adicionais/acompanhamentos do Supabase
  React.useEffect(() => {
    let mounted = true; // flag para evitar setState após unmount
    const load = async () => {
      if (!product?.id) return; // se não houver produto, sai
      // product.id can be string in UI model; convert to number if possible
      const prodIdNum = Number(product.id); // converte id para number
      if (Number.isNaN(prodIdNum)) return; // se não for número, não consulta

      const { data, error } = await supabase
        .from('ingredientes_produtos') // tabela/view com ingredientes relacionados
        .select('*') // seleciona todas as colunas
        .eq('prod_id', prodIdNum) // filtra pelo produto
        .order('prod_id', { ascending: true }); // ordena por campo prod_id

      if (!mounted) return; // evita atualizações após desmontar
      if (error) {
        // Em caso de erro na query, limpamos os arrays e logamos
        console.warn('failed to load ingredientes_produtos', error.message);
        setFetchedIngredients([]); // limpa ingredientes
        setFetchedAdditionals([]); // limpa adicionais
        return; // sai da função
      }

      const rows = (data ?? []) as unknown[]; // garante array mesmo se undefined
      const isRowWithCategoria = (v: unknown): v is Record<string, unknown> => {
        return typeof v === 'object' && v !== null && 'categoria_id' in (v as Record<string, unknown>); // typeguard para verificar estrutura
      };

      const ingredients = rows
        .filter((r): r is Record<string, unknown> => isRowWithCategoria(r) && (r.categoria_id as unknown) === 1) // filtra categoria 1
        .map((r) => {
          const x = r as Record<string, unknown>;
          return {
            ing_id: x['ing_id'] as number | null | undefined,
            ing_nome: x['ing_nome'] as string | null | undefined,
            ing_valor: x['ing_valor'] as number | null | undefined,
            categoria_id: x['categoria_id'] as number | null | undefined,
          };
        }); // transforma em objeto com campos esperados
      const additionals = rows
        .filter((r): r is Record<string, unknown> => isRowWithCategoria(r) && (r.categoria_id as unknown) === 2) // filtra categoria 2
        .map((r) => {
          const x = r as Record<string, unknown>;
          return {
            ing_id: x['ing_id'] as number | null | undefined,
            ing_nome: x['ing_nome'] as string | null | undefined,
            ing_valor: x['ing_valor'] as number | null | undefined,
            categoria_id: x['categoria_id'] as number | null | undefined,
          };
        }); // transforma adicionais

      const accompaniments = rows
        .filter((r): r is Record<string, unknown> => isRowWithCategoria(r) && (r.categoria_id as unknown) !== 1 && (r.categoria_id as unknown) !== 2) // resto das categorias
        .map((r) => {
          const x = r as Record<string, unknown>;
          return {
            ing_id: x['ing_id'] as number | null | undefined,
            ing_nome: x['ing_nome'] as string | null | undefined,
            ing_valor: x['ing_valor'] as number | null | undefined,
            categoria_id: x['categoria_id'] as number | null | undefined,
          };
        }); // transforma acompanhamentos

      // Atualiza estados com os resultados da query
      setFetchedIngredients(ingredients); // seta ingredientes
      setFetchedAdditionals(additionals); // seta adicionais
      setFetchedAccompaniments(accompaniments); // seta acompanhamentos
    };

    load(); // dispara o carregamento
    return () => { mounted = false; }; // cleanup para evitar setState após unmount
  }, [product?.id]); // reexecuta quando o produto mudar

  // Sincroniza a aba ativa quando os dados carregarem ou mudarem.
  React.useEffect(() => {
    // Se a aba atual não tiver itens, seleciona a primeira disponível.
    if (activeTab === 'ingredients' && fetchedIngredients.length === 0) {
      if (fetchedAdditionals.length > 0) setActiveTab('additionals');
      else if (fetchedAccompaniments.length > 0) setActiveTab('accompaniments');
    }
    if (activeTab === 'additionals' && fetchedAdditionals.length === 0) {
      if (fetchedIngredients.length > 0) setActiveTab('ingredients');
      else if (fetchedAccompaniments.length > 0) setActiveTab('accompaniments');
    }
    if (activeTab === 'accompaniments' && fetchedAccompaniments.length === 0) {
      if (fetchedIngredients.length > 0) setActiveTab('ingredients');
      else if (fetchedAdditionals.length > 0) setActiveTab('additionals');
    }
    // Se todas vazias, mantém 'ingredients' (padrão)
  }, [fetchedIngredients, fetchedAdditionals, fetchedAccompaniments, activeTab]);

  // calcula quantas abas estão visíveis para ajustar o layout do TabsList
  const tabsCount = [fetchedIngredients.length > 0, fetchedAdditionals.length > 0, fetchedAccompaniments.length > 0].filter(Boolean).length;
  const colsClass = tabsCount === 1 ? 'grid-cols-1' : tabsCount === 2 ? 'grid-cols-2' : 'grid-cols-3';
  const justify = tabsCount === 1 ? 'justify-center' : '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="bg-white p-2"
        style={{
          width: 'calc(100vw - 160px)',
          height: 'calc(100vh - 160px)',
          maxWidth: 630,
          maxHeight: 900,
        }}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-full max-w-[630px] max-h-[900px] rounded-[18px] bg-white text-zinc-900 shadow-xl overflow-hidden flex flex-col">
            {/* Imagem do produto */}
            <div className="p-[14px] pb-0 flex-1 min-h-[310px]">
              <div className="h-[310px] rounded-[12px] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>

            {/* Nome e descrição */}
            <div className="px-[14px] py-3">
              <div className="w-full px-3">
                <div className="text-center space-y-1.5">
                  <h2 className="text-[26px] font-medium leading-tight">{product.name}</h2>
                  <p className="text-[16px] text-zinc-600 leading-relaxed">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Caixa com abas e conteúdo */}
            <div className="px-[14px] pb-3">
              <div className="rounded-lg border-2 border-zinc-300 bg-white shadow-sm overflow-hidden">
                {/* Abas (usando UI Tabs mas estilizadas) */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className={`grid w-full ${colsClass} ${justify} text-black bg-white`}>
                    {fetchedIngredients.length > 0 && (
                      <TabsTrigger
                        value="ingredients"
                        className="data-[state=active]:bg-[#4F2517] data-[state=active]:text-white"
                      >
                        Ingredientes
                      </TabsTrigger>
                    )}
                    {fetchedAdditionals.length > 0 && (
                      <TabsTrigger
                        value="additionals"
                        className="data-[state=active]:bg-[#4F2517] data-[state=active]:text-white"
                      >
                        Adicionais
                      </TabsTrigger>
                    )}
                    {fetchedAccompaniments.length > 0 && (
                      <TabsTrigger
                        value="accompaniments"
                        className="data-[state=active]:bg-[#4F2517] data-[state=active]:text-white"
                      >
                        Acompanhamentos
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <div className="h-[2px] w-full bg-zinc-300" />

                  <TabsContent value="ingredients" className="mt-0">
                    <div className="h-[250px] overflow-auto p-1">
                      {fetchedIngredients.length > 0 ? (
                        fetchedIngredients.map((ingredient, index) => {
                          const name = ingredient.ing_nome ?? '';
                          return (
                            <div key={index}>
                              <div className="h-[54px] flex items-center justify-between px-1">
                                <span className={`text-[18px] font-medium ${removedIngredients.includes(name) ? 'line-through text-zinc-600' : ''}`}>
                                  {name}
                                </span>

                                <div className="flex items-center pr-5">
                                  <Button
                                    variant="transparente"
                                    size="sm"
                                    className="text-[#4F2517] flex items-center gap-2"
                                    onClick={() => handleRemoveIngredient(name)}
                                  >
                                    {removedIngredients.includes(name) ? (
                                      <>
                                        <img
                                          src={iconeRemovido}
                                          alt="Removido"
                                          className="w-10 h-10 object-contain"
                                          onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement;
                                            target.outerHTML = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' class='w-5 h-5 text-[#4F2517]'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'/></svg>`;
                                          }}
                                        />
                                      </>
                                    ) : (
                                      'Remover'
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div className="w-full h-[2px] bg-zinc-200" />
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">Sem ingredientes listados</div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="additionals" className="mt-0">
                    <div className="h-[250px] overflow-auto space-y-2 p-1.5">
                      {fetchedAdditionals.length > 0 ? (
                        fetchedAdditionals.map((add, i) => {
                          const id = add.ing_id ?? i;
                          const name = add.ing_nome ?? '';
                          const valor = add.ing_valor ?? 0;
                          const checked = selectedAdditionals.includes(String(id));
                          return (
                            <div key={i}>
                              <div className="h-[54px] flex items-center justify-between px-1">
                                <div className="leading-tight">
                                  <div className="text-[18px] font-medium">{name}</div>
                                  <div className="text-[14px] text-zinc-500">+R${(valor ?? 0).toFixed(2).replace('.', ',')}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    className="h-8 w-8 mr-4"
                                    checked={checked}
                                    onCheckedChange={(v) => {
                                      const isChecked = Boolean(v);
                                      setSelectedAdditionals((prev) =>
                                        isChecked ? [...prev, String(id)] : prev.filter((p) => p !== String(id))
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="w-full h-[2px] bg-zinc-200" />
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">Nenhum adicional disponível</div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="accompaniments" className="mt-0">
                    <div className="h-[250px] overflow-auto space-y-2 p-1.5">
                      {fetchedAccompaniments.length > 0 ? (
                        fetchedAccompaniments.map((add, i) => {
                          const id = add.ing_id ?? i;
                          const name = add.ing_nome ?? '';
                          const valor = add.ing_valor ?? 0;
                          const checked = selectedAccompaniments.includes(String(id));
                          return (
                            <div key={i}>
                              <div className="h-[54px] flex items-center justify-between px-1">
                                <div className="leading-tight">
                                  <div className="text-[18px] font-medium">{name}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    className="text-[#4F2517] flex items-center gap-2 mr-4 hover:underline"
                                    onClick={() => {
                                      // troca seleção exclusiva: se já está selecionado, limpa; senão seleciona apenas este
                                      setSelectedAccompaniments((prev) => (prev.includes(String(id)) ? [] : [String(id)]));
                                    }}
                                  >
                                    {selectedAccompaniments.includes(String(id)) ? (
                                      <>
                                        <Check className="h-4 w-4 text-[#4F2517]" />
                                        <span>Selecionado</span>
                                      </>
                                    ) : (
                                      <span>Selecionar este</span>
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div className="w-full h-[2px] bg-zinc-200" />
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">Nenhum acompanhamento disponível</div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="w-full h-[1.5px] bg-zinc-300" />

                {/* Barra de valor */}
                <div className="px-3 py-1">
                  <div className="flex items-end justify-between">
                    <span className="text-[24px] font-semibold">VALOR:</span>
                    <span className="text-[22px] font-semibold">R$ {formatPrice(totalWithExtras)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé com botões */}
            <div className="px-[14px] py-3">
              <div className="grid grid-cols-2 gap-[20px] items-center">
                  <KeyButton
                    label="Cancelar"
                    onClick={handleCancel}
                    ariaLabel="Cancelar"
                    sizeWidth={280}
                    sizeHeight={58}
                    paddingVar={5}
                    outerRadius={12}
                    innerRadius={10}
                    fontSize={20}
                    fontWeight={500}
                    outerGradient="linear-gradient(0deg, #C1C1C1 0%, #e3e3e3 50%, #ffffff 100%)"
                    innerGradient="linear-gradient(180deg, #C1C1C1 0%, #e3e3e3 50%, #ffffff 100%)"
                    shadow="0px 4px 16px 2px rgba(0,0,0,0.0)"
                    textColor="#000"
                  />
                <KeyButton
                    label="Adicionar ao carrinho"
                    onClick={handleAddToCart}
                    ariaLabel="Adicionar"
                    sizeWidth={280}
                    sizeHeight={58}
                    paddingVar={5}
                    outerRadius={12}
                    innerRadius={10}
                    fontSize={20}
                    fontWeight={500}
                    outerGradient="linear-gradient(0deg, #7C3C23 0%, #4F2517 100%)"
                    innerGradient="linear-gradient(180deg, #7C3C23 0%, #4F2517 100%)"
                    shadow="0px 4px 16px 2px rgba(0,0,0,0.0)"
                    textColor="#fff"
                  />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;