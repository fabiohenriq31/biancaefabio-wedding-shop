import { useNavigate } from 'react-router';
import { Heart, ShoppingBag, Gift, MessageCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getFeaturedProducts } from '../data/products';
import { useState } from 'react';
import { Modal } from '../components/Modal';
import type { Product } from '../types';

export function LandingPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const featuredProducts = getFeaturedProducts().slice(0, 6);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleEntrar = () => {
    if (isLoggedIn) {
      navigate('/shopping/products');
    } else {
      navigate('/shopping/login');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[var(--wedding-beige)] to-[var(--wedding-offwhite)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl mb-6 text-[var(--wedding-text)]">
            Escolha um presente com carinho
          </h1>
          <p className="text-xl text-[var(--wedding-text-light)] mb-8 max-w-3xl mx-auto">
            Criamos uma seleção de presentes simbólicos e divertidos para fazer parte da nossa nova história.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleEntrar}
            >
              <Gift className="w-5 h-5" />
              Entrar para Presentear
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/shopping/products')}
            >
              Ver Presentes
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-[var(--wedding-text)]">
              Presentes em destaque
            </h2>
            <p className="text-[var(--wedding-text-light)] max-w-2xl mx-auto">
              Conheça alguns dos presentes mais especiais que você pode nos dar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/shopping/products')}
            >
              Ver todos os presentes
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[var(--wedding-beige)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-[var(--wedding-text)]">
              Como funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[var(--wedding-gold)]" />
              </div>
              <h3 className="text-xl mb-2 text-[var(--wedding-text)]">
                Entre na sua conta
              </h3>
              <p className="text-sm text-[var(--wedding-text-light)]">
                Faça login ou crie uma conta rapidamente
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-[var(--wedding-gold)]" />
              </div>
              <h3 className="text-xl mb-2 text-[var(--wedding-text)]">
                Escolha os presentes
              </h3>
              <p className="text-sm text-[var(--wedding-text-light)]">
                Navegue e selecione os presentes simbólicos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[var(--wedding-gold)]" />
              </div>
              <h3 className="text-xl mb-2 text-[var(--wedding-text)]">
                Deixe sua mensagem
              </h3>
              <p className="text-sm text-[var(--wedding-text-light)]">
                Escreva palavras carinhosas para os noivos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-[var(--wedding-gold)]" />
              </div>
              <h3 className="text-xl mb-2 text-[var(--wedding-text)]">
                Finalize o pagamento
              </h3>
              <p className="text-sm text-[var(--wedding-text-light)]">
                Complete com segurança via PIX ou cartão
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4 text-[var(--wedding-text)]">
            Deixe uma mensagem para os noivos
          </h2>
          <p className="text-lg text-[var(--wedding-text-light)] mb-8">
            Sua mensagem fará parte da nossa história e será guardada com muito carinho
          </p>
          <Button size="lg" onClick={handleEntrar}>
            Começar agora
          </Button>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          size="lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl mb-4 text-[var(--wedding-text)]">
                {selectedProduct.name}
              </h2>
              <p className="text-[var(--wedding-text-light)] mb-6">
                {selectedProduct.description}
              </p>
              <p className="text-3xl mb-6 text-[var(--wedding-text)]">
                R$ {selectedProduct.price.toFixed(2)}
              </p>
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
        </Modal>
      )}
    </div>
  );
}
