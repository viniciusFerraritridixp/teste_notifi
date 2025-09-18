import React, { useState } from 'react';
import Header from '@/components/Header';
import { AlertCircle, List, Clock, Coffee, X, Check } from 'lucide-react';

type Order = {
  id: string;
  identification?: string | null;
  items: string;
  value: number;
  status: 'pendente' | 'em_preparo' | 'pronto' | 'cancelado' | 'concluido';
};

const sampleOrders: Order[] = [
  {
    id: '1',
    identification: null,
    items: 'CREPIOCA DE PEITO DE PERU E QUEIJO BRANCO, QUICHE DE CAMARÃO',
    value: 39.0,
    status: 'pendente',
  },
];

function formatCurrency(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`;
}

export default function TotemOrders(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [filter, setFilter] = useState<'todos' | 'no_local' | 'retirada'>('todos');
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'todos' | 'pendente' | 'em_preparo' | 'pronto' | 'cancelado' | 'concluido'>('todos');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = orders.filter(o => {
    if (query && !(`${o.items}`.toLowerCase().includes(query.toLowerCase()))) return false;
    // status tab filtering
    if (activeTab !== 'todos' && o.status !== activeTab) return false;
    // location filter is mocked — in real app you'd check a field on order
    return true;
  });

  const accept = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'em_preparo' } : o));
  };

  const cancel = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelado' } : o));
  };

  // Modal state for changing status
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOrderId, setModalOrderId] = useState<string | null>(null);
  const [modalSelectedStatus, setModalSelectedStatus] = useState<Order['status'] | null>(null);

  const openStatusModal = (id: string) => {
    const ord = orders.find(o => o.id === id);
    setModalOrderId(id);
    setModalSelectedStatus(ord ? ord.status : 'pendente');
    setModalOpen(true);
  };

  const closeStatusModal = () => {
    setModalOrderId(null);
    setModalSelectedStatus(null);
    setModalOpen(false);
  };

  const updateStatusForModal = () => {
    if (!modalOrderId || !modalSelectedStatus) return closeStatusModal();
    setOrders(prev => prev.map(o => o.id === modalOrderId ? { ...o, status: modalSelectedStatus } : o));
    closeStatusModal();
  };

  const getStatusIcon = (status: Order['status']) => {
    const common = { className: 'w-5 h-5' };
    switch (status) {
      case 'pendente':
        return <AlertCircle size={18} className="text-red-600" />;
      case 'em_preparo':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-amber-600">
            <path d="M7 2v7" />
            <path d="M10 2v7" />
            <path d="M13 2v7" />
            <path d="M6 11c1.5 1 4 2 4 6v5" />
            <path d="M18 3l3 3" />
            <path d="M15 6l6 6" />
          </svg>
        );
      case 'pronto':
        return <Coffee size={18} className="text-sky-600" />;
      case 'cancelado':
        return <X size={18} className="text-gray-600" />;
      case 'concluido':
        return <Check size={18} className="text-green-600" />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full" style={{ backgroundColor: '#F1F4F8' }}>
      <div className="w-full h-[90px] flex items-center justify-center" style={{ background: 'linear-gradient(150deg, #7c3c23 0%, #4f2517 100%)' }}>
        <Header />
      </div>

    <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
  <div className="max-w-[1400px] mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GERENCIAMENTO DE PEDIDOS</h1>
            <div className="text-sm text-gray-600 mt-1">{orders.length} pedidos</div>
          </div>

          <div>
            {/* desktop-only new order button */}
            <button
              type="button"
              className="hidden sm:inline-flex items-center justify-center border-2 border-amber-800 text-amber-800 px-4 py-3 rounded-lg font-semibold bg-white hover:bg-amber-50"
            >
              + NOVO PEDIDO
            </button>
          </div>
        </div>

        {/* status tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto flex-wrap">
          {[
            { key: 'todos', label: 'TODOS', icon: <List size={16} /> },
            { key: 'pendente', label: 'PENDENTE', icon: <Clock size={16} /> },
            { key: 'em_preparo', label: 'EM PREPARO', icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 2v7" />
                <path d="M10 2v7" />
                <path d="M13 2v7" />
                <path d="M6 11c1.5 1 4 2 4 6v5" />
                <path d="M18 3l3 3" />
                <path d="M15 6l6 6" />
              </svg>
            ) },
            { key: 'pronto', label: 'PRONTO', icon: <Coffee size={16} /> },
            { key: 'cancelado', label: 'CANCELADO', icon: <X size={16} /> },
            { key: 'concluido', label: 'CONCLUÍDO', icon: <Check size={16} /> },
          ].map((t, i) => {
            const isActive = (t.key as string) === activeTab;
            return (
              <button
                key={t.label}
                onClick={() => setActiveTab(t.key as any)}
                className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-colors border-2 whitespace-nowrap ${isActive ? 'border-amber-800 bg-white text-amber-800' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
              >
                <span className="text-current">{t.icon}</span>
                {/* label hidden on mobile, show on sm+ */}
                <span className="hidden sm:inline text-sm sm:text-base">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* search + right filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          {/* search + filter area: search bar stays full height and flexes, no vertical shifting */}
          <div className={`h-[44px] flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 transition-all duration-300 ease-in-out w-full flex-1`}>
            {/* search icon */}
            <svg className="w-5 h-5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>

            <input
              placeholder="Pesquisar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
            />

            {/* monitor/desktop filter button (visible sm+) */}
            <button
              type="button"
              onClick={() => setShowFilters(prev => !prev)}
              className="hidden sm:inline-flex w-9 h-9 flex items-center justify-center rounded-md bg-gray-50 border border-gray-200"
              aria-label="Filtros"
              aria-expanded={showFilters}
            >
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 3H2l8 9v7l4 2v-9l8-9z" />
              </svg>
            </button>

            {/* mobile-only filter button */}
            <button
              type="button"
              onClick={() => setShowFilters(prev => !prev)}
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-md bg-gray-50 border border-gray-200"
              aria-label="Filtros"
              aria-expanded={showFilters}
            >
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 5 21 5 14 12 14 19 10 16 10 12 3 5"></polygon>
              </svg>
            </button>
          </div>

            <div className={`relative transition-all duration-300 ease-in-out sm:ml-3 ${showFilters ? 'opacity-100 translate-y-0 max-h-[44px] pointer-events-auto w-auto sm:w-64 z-10' : 'opacity-0 translate-y-0 max-h-0 pointer-events-none w-0 sm:w-0'}`}>
              <div className="h-[44px] flex items-center bg-white border border-gray-200 rounded-lg px-2 w-full overflow-visible shadow-sm">
              <div className="flex items-center gap-2 h-full">
                <div className="inline-flex items-center rounded-full bg-white/60 p-1 gap-1 shadow-sm">
                  <button onClick={() => { setFilter('todos'); setShowFilters(false); }} className={`whitespace-nowrap px-3 sm:px-4 h-8 flex items-center justify-center rounded-full text-sm sm:text-base ${filter==='todos' ? 'bg-[#7c3c23] text-white' : 'text-gray-600 hover:bg-[#7c3c23] hover:text-white'}`}>Todos</button>
                  <button onClick={() => { setFilter('no_local'); setShowFilters(false); }} className={`whitespace-nowrap px-3 sm:px-4 h-8 flex items-center justify-center rounded-full text-sm sm:text-base ${filter==='no_local' ? 'bg-[#7c3c23] text-white' : 'text-gray-600 hover:bg-[#7c3c23] hover:text-white'}`}>No Local</button>
                  <button onClick={() => { setFilter('retirada'); setShowFilters(false); }} className={`whitespace-nowrap px-3 sm:px-4 h-8 flex items-center justify-center rounded-full text-sm sm:text-base ${filter==='retirada' ? 'bg-[#7c3c23] text-white' : 'text-gray-600 hover:bg-[#7c3c23] hover:text-white'}`}>Retirada</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* table header */}
        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-100">
          <div className="hidden sm:grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-gray-700 border-b">
            <div className="col-span-2">Identificação</div>
            <div className="col-span-6">Itens</div>
            <div className="col-span-1 text-right">Valor</div>
            <div className="col-span-3 text-right">Status</div>
          </div>

          <div className="divide-y">
            {filtered.map((o) => (
              <div key={o.id} className="p-3 sm:p-4 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 sm:text-sm">{o.identification ?? <span className="text-xs text-gray-400">sem identificação</span>}</div>
                    <div className="mt-1 text-sm sm:text-base text-gray-900 font-semibold truncate">{o.items}</div>
                  </div>

                  <div className="flex items-center gap-3 ml-2">
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-gray-800 font-medium">{formatCurrency(o.value)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => openStatusModal(o.id)} className="p-2 rounded-full border bg-white">
                        {getStatusIcon(o.status)}
                      </button>

                      {o.status === 'pendente' && (
                        <>
                          <button onClick={() => cancel(o.id)} aria-label="Cancelar" className="w-9 h-9 flex items-center justify-center rounded-full border border-red-400 text-red-600 bg-white hover:bg-red-50">
                            <X size={16} />
                          </button>

                          <button onClick={() => accept(o.id)} aria-label="Aceitar" className="w-9 h-9 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700">
                            <Check size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status change modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[720px] bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="relative">
                <div className="bg-gradient-to-r from-[#7c3c23] to-[#4f2517] p-4 text-white font-bold text-lg text-center">ALTERE O STATUS DO PEDIDO</div>
                <button onClick={closeStatusModal} aria-label="Fechar" className="absolute right-4 top-3 text-white text-xl">✕</button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-5 gap-4 mb-6">
                  {[
                    { key: 'pendente', label: 'PENDENTE', icon: <AlertCircle size={28} /> },
                    { key: 'em_preparo', label: 'EM PREPARO', icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2v7"/><path d="M10 2v7"/><path d="M13 2v7"/><path d="M6 11c1.5 1 4 2 4 6v5"/><path d="M18 3l3 3"/><path d="M15 6l6 6"/></svg>
                    ) },
                    { key: 'pronto', label: 'PRONTO', icon: <Coffee size={28} /> },
                    { key: 'cancelado', label: 'CANCELADO', icon: <X size={28} /> },
                    { key: 'concluido', label: 'CONCLUÍDO', icon: <Check size={28} /> },
                  ].map(s => {
                    const active = modalSelectedStatus === (s.key as Order['status']);
                    return (
                      <button
                        key={s.key}
                        onClick={() => setModalSelectedStatus(s.key as Order['status'])}
                        className={`p-4 rounded-lg border shadow-sm flex flex-col items-center justify-center gap-2 ${active ? 'border-amber-600 bg-white' : 'border-gray-100 bg-white/60 text-gray-400 opacity-70'} `}
                      >
                        <div className={`${active ? 'text-amber-700' : 'text-gray-400'}`}>{s.icon}</div>
                        <div className={`text-xs font-medium ${active ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button onClick={closeStatusModal} className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700">CANCELAR</button>
                  <button onClick={updateStatusForModal} className="flex-1 px-6 py-3 bg-amber-700 text-white rounded-md">ATUALIZAR STATUS</button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* floating add button for mobile */}
        <button
          aria-label="Novo pedido"
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-lg sm:hidden"
        >
          +
        </button>

      </main>
    </div>
  );
}
