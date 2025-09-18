import omeletImg from '@/assets/omelet.jpg';
import paoComQueijoImg from '@/assets/pao-com-queijo.jpg';
import ovoMexidoImg from '@/assets/ovo-mexido.jpg';
import mistoQuenteImg from '@/assets/misto-quente.jpg';
import sandubaImg from '@/assets/sanduba.jpg';
import omeletQueijoImg from '@/assets/omelet-queijo.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  ingredients: string[];
  additionals?: string[];
}

export const menuData: Product[] = [
  {
    id: '1',
    name: 'OMELETE BÁSICO',
    price: 16.00,
    image: omeletImg,
    category: 'lanches',
    description: 'Omelete simples feito com ovos frescos, temperado com sal e pimenta.',
    ingredients: ['Ovos', 'Sal', 'Pimenta', 'Óleo']
  },
  {
    id: '2',
    name: 'PÃO COM QUEIJO',
    price: 15.00,
    image: paoComQueijoImg,
    category: 'lanches',
    description: 'Pão francês quentinho com queijo mussarela derretido.',
    ingredients: ['Pão francês', 'Queijo mussarela']
  },
  {
    id: '3',
    name: 'OVO MEXIDO',
    price: 15.00,
    image: ovoMexidoImg,
    category: 'lanches',
    description: 'Ovos mexidos cremosos temperados com ervas finas.',
    ingredients: ['Ovos', 'Manteiga', 'Sal', 'Cebolinha']
  },
  {
    id: '4',
    name: 'MISTO QUENTE',
    price: 13.00,
    image: mistoQuenteImg,
    category: 'lanches',
    description: 'Sanduíche grelhado com presunto e queijo.',
    ingredients: ['Pão de forma', 'Presunto', 'Queijo', 'Manteiga']
  },
  {
    id: '5',
    name: 'SANDUBA DE FRANGO',
    price: 20.00,
    image: sandubaImg,
    category: 'lanches',
    description: 'Frango frito empanado na farinha panko, tomate, alface, cebola roxa, mussarela, maionese e mostarda com mel.',
    ingredients: ['Tomate', 'Alface', 'Mostarda e mel', 'Cebola Roxa', 'Frango empanado', 'Mussarela', 'Pão']
  },
  {
    id: '6',
    name: 'OMELETE DE QUEIJO',
    price: 23.00,
    image: omeletQueijoImg,
    category: 'lanches',
    description: 'Omelete cremoso recheado com queijo mussarela.',
    ingredients: ['Ovos', 'Queijo mussarela', 'Sal', 'Pimenta', 'Óleo']
  },
  {
    id: '7',
    name: 'BRIGADEIRO',
    price: 8.00,
    image: omeletImg, // placeholder
    category: 'doces',
    description: 'Brigadeiro caseiro feito com chocolate e granulado.',
    ingredients: ['Leite condensado', 'Chocolate em pó', 'Manteiga', 'Granulado']
  },
  {
    id: '8',
    name: 'PUDIM CASEIRO',
    price: 12.00,
    image: paoComQueijoImg, // placeholder
    category: 'doces',
    description: 'Pudim caseiro cremoso com calda de caramelo.',
    ingredients: ['Leite', 'Ovos', 'Açúcar', 'Baunilha']
  },
  {
    id: '9',
    name: 'CAFÉ EXPRESSO',
    price: 6.00,
    image: ovoMexidoImg, // placeholder
    category: 'bebidas',
    description: 'Café expresso encorpado e aromático.',
    ingredients: ['Café em grãos']
  },
  {
    id: '10',
    name: 'SUCO NATURAL',
    price: 8.00,
    image: mistoQuenteImg, // placeholder
    category: 'bebidas',
    description: 'Suco natural da fruta feito na hora.',
    ingredients: ['Fruta natural', 'Gelo', 'Açúcar (opcional)']
  }
];