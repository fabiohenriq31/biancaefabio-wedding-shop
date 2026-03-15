import type { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    slug: 'pizza-da-madrugada',
    name: 'Pizza da madrugada',
    shortDescription: 'Aquela pizza especial pós-festa',
    description: 'Porque toda história de amor precisa de uma pizza quentinha nas madrugadas especiais. Seu presente vai garantir aquele momento delicioso e descontraído que só a gente sabe apreciar.',
    price: 50,
    category: 'Gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    isFeatured: true,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 1
  },
  {
    id: '2',
    slug: 'cafe-da-manha-romantico',
    name: 'Café da manhã romântico',
    shortDescription: 'Início perfeito para o dia a dois',
    description: 'Um café da manhã caprichado para começar o dia com amor e carinho. Croissants frescos, frutas e aquele cafezinho especial que torna a manhã ainda mais doce.',
    price: 80,
    category: 'Gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    isFeatured: true,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 2
  },
  {
    id: '3',
    slug: 'garrafa-de-vinho-especial',
    name: 'Garrafa de vinho especial',
    shortDescription: 'Para brindar os momentos únicos',
    description: 'Um vinho selecionado para celebrar as conquistas, os finais de semana e os momentos que merecem ser brindados. Saúde ao amor!',
    price: 120,
    category: 'Gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    isFeatured: false,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 3
  },
  {
    id: '4',
    slug: 'jantar-romantico',
    name: 'Jantar romântico',
    shortDescription: 'Uma noite inesquecível a dois',
    description: 'Um jantar especial naquele restaurante dos sonhos, com velas, boa comida e muita conversa. O presente perfeito para criar memórias deliciosas.',
    price: 200,
    category: 'Momentos a Dois',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    isFeatured: true,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 4
  },
  {
    id: '5',
    slug: 'passeio-especial',
    name: 'Passeio especial',
    shortDescription: 'Aventuras e descobertas juntos',
    description: 'Um dia inteiro dedicado a explorar lugares novos, criar memórias e viver experiências únicas. Cada passeio é uma nova história para contar.',
    price: 250,
    category: 'Diversão',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    isFeatured: false,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 5
  },
  {
    id: '6',
    slug: 'ajuda-na-lua-de-mel',
    name: 'Ajuda na lua de mel',
    shortDescription: 'Contribua para a viagem dos sonhos',
    description: 'Cada contribuição nos aproxima da lua de mel perfeita. Seu carinho será transformado em momentos inesquecíveis de aventura e romance.',
    price: 300,
    category: 'Lua de Mel',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    isFeatured: true,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 6
  },
  {
    id: '7',
    slug: 'combustivel-da-viagem',
    name: 'Combustível da viagem',
    shortDescription: 'Ajude a gente a chegar longe',
    description: 'Porque toda grande viagem começa com o tanque cheio! Seu presente vai nos ajudar a percorrer estradas e criar memórias pelo caminho.',
    price: 100,
    category: 'Viagem',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    isFeatured: false,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 7
  },
  {
    id: '8',
    slug: 'sessao-cinema-dos-noivos',
    name: 'Sessão cinema dos noivos',
    shortDescription: 'Pipoca, filme e muito amor',
    description: 'Uma noite de cinema completa: ingressos, pipoca, refri e aquele filmão que a gente vai comentar por dias. Simples, gostoso e muito nosso.',
    price: 70,
    category: 'Diversão',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    isFeatured: false,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 8
  },
  {
    id: '9',
    slug: 'sobremesa-dos-noivos',
    name: 'Sobremesa dos noivos',
    shortDescription: 'O doce final perfeito',
    description: 'Porque toda boa refeição merece um final doce! Aquele doce especial que faz os olhos brilharem e o coração sorrir.',
    price: 45,
    category: 'Gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
    isFeatured: false,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 9
  },
  {
    id: '10',
    slug: 'brunch-de-domingo',
    name: 'Brunch de domingo',
    shortDescription: 'Domingo preguiçoso e delicioso',
    description: 'Aquele brunch caprichado de domingo, com tudo que a gente ama: pães frescos, geleias artesanais, sucos naturais e muita conversa boa.',
    price: 95,
    category: 'Gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80',
    isFeatured: false,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 10
  },
  {
    id: '11',
    slug: 'noite-de-jogos',
    name: 'Noite de jogos',
    shortDescription: 'Diversão garantida em casa',
    description: 'Uma noite dedicada a jogos de tabuleiro, risadas e competição saudável. Porque os melhores momentos são os mais simples.',
    price: 60,
    category: 'Diversão',
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80',
    isFeatured: false,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 11
  },
  {
    id: '12',
    slug: 'piquenique-no-parque',
    name: 'Piquenique no parque',
    shortDescription: 'Natureza, comida e amor',
    description: 'Uma tarde ao ar livre com cesta de piquenique, manta e boa companhia. Sol, natureza e momentos simples que ficam na memória.',
    price: 85,
    category: 'Momentos a Dois',
    imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
    isFeatured: false,
    isActive: true,
    stockType: 'symbolic',
    displayOrder: 12
  }
];

export const categories: string[] = [
  'Todos',
  'Lua de Mel',
  'Gastronomia',
  'Diversão',
  'Viagem',
  'Momentos a Dois',
  'Extras'
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'Todos') return products;
  return products.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured);
}
