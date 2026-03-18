import { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { useCart } from '../contexts/CartContext';
import { getProducts } from '../services/productService';
import type { Product } from '../types';

export function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch {
        setError('Não foi possível carregar os presentes.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category))
    );

    return ['Todos', ...uniqueCategories];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Todos' || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch && product.isActive;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-[var(--wedding-offwhite)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-[var(--wedding-text-light)]">Carregando presentes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-[var(--wedding-offwhite)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            icon={<ShoppingBag className="w-16 h-16" />}
            title="Não foi possível carregar os presentes"
            description={error}
            action={
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[var(--wedding-offwhite)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl mb-3 text-[var(--wedding-text)]">
            Escolha seus presentes
          </h1>
          <p className="text-lg text-[var(--wedding-text-light)]">
            Navegue por nossa seleção de presentes simbólicos e especiais
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--wedding-text-light)]" />
                <input
                  type="text"
                  placeholder="Buscar presentes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-[var(--wedding-beige)] text-[var(--wedding-text)] placeholder:text-[var(--wedding-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--wedding-gold)]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price-asc' | 'price-desc')}
                className="px-4 py-3 rounded-lg bg-white border border-[var(--wedding-beige)] text-[var(--wedding-text)] focus:outline-none focus:ring-2 focus:ring-[var(--wedding-gold)]"
              >
                <option value="name">Nome</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm transition-all
                  ${selectedCategory === category
                    ? 'bg-[var(--wedding-text)] text-white'
                    : 'bg-white text-[var(--wedding-text)] hover:bg-[var(--wedding-beige)]'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-[var(--wedding-text-light)]">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'presente encontrado' : 'presentes encontrados'}
          </p>
        </div>

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ShoppingBag className="w-16 h-16" />}
            title="Nenhum presente encontrado"
            description="Tente ajustar os filtros ou buscar por outro termo"
            action={
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                }}
              >
                Limpar filtros
              </Button>
            }
          />
        )}
      </div>

      {selectedProduct && (
          <Modal
      isOpen={!!selectedProduct}
      onClose={() => setSelectedProduct(null)}
      size="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {selectedProduct.imageUrl ? (
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/placeholder.jpg';
              }}
              className="w-full h-80 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-80 bg-[var(--wedding-beige)] rounded-lg flex items-center justify-center">
              <span className="text-[var(--wedding-text-light)]">
                Presente simbólico
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs bg-[var(--wedding-beige)] text-[var(--wedding-text)] mb-3">
              {selectedProduct.category}
            </span>
            <h2 className="text-3xl mb-3 text-[var(--wedding-text)]">
              {selectedProduct.name}
            </h2>
            <p className="text-[var(--wedding-text-light)] mb-6">
              {selectedProduct.description}
            </p>
          </div>

          <div className="border-t border-[var(--wedding-beige)] pt-6">
            <p className="text-3xl mb-6 text-[var(--wedding-text)]">
              R$ {selectedProduct.price.toFixed(2)}
            </p>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                Adicionar ao carrinho
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[var(--wedding-beige)] rounded-lg">
            <p className="text-sm text-[var(--wedding-text-light)] italic">
              "Seu presente nos ajudará a viver momentos especiais e criar memórias inesquecíveis juntos."
            </p>
          </div>
        </div>
      </div>
  </Modal>
      )}
    </div>
  );
}
