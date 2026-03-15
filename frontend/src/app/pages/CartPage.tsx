import { useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export function CartPage() {
  const navigate = useNavigate();
  const { cartItems, cartCount, cartSubtotal, updateQuantity, removeFromCart } = useCart();
  const { isLoggedIn } = useAuth();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/shopping/login');
      return;
    }
    navigate('/shopping/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-[var(--wedding-offwhite)] flex items-center justify-center">
        <EmptyState
          icon={<ShoppingBag className="w-16 h-16" />}
          title="Seu carrinho está vazio"
          description="Adicione presentes especiais para os noivos"
          action={
            <Button onClick={() => navigate('/shopping/products')}>
              Ver presentes
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[var(--wedding-offwhite)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/shopping/products')}
            className="flex items-center gap-2 text-[var(--wedding-text-light)] hover:text-[var(--wedding-text)] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continuar comprando
          </button>
          <h1 className="text-4xl mb-2 text-[var(--wedding-text)]">
            Seu carrinho
          </h1>
          <p className="text-[var(--wedding-text-light)]">
            {cartCount} {cartCount === 1 ? 'item' : 'itens'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.cartItemId} className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg mb-1 text-[var(--wedding-text)] truncate">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-[var(--wedding-text-light)] mb-3">
                      R$ {item.productPrice.toFixed(2)} cada
                    </p>

                    <div className="flex items-center gap-3">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1.5 hover:bg-[var(--wedding-beige)] rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-[var(--wedding-text)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1.5 hover:bg-[var(--wedding-beige)] rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="text-right">
                    <p className="text-lg text-[var(--wedding-text)]">
                      R$ {item.lineTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-2xl mb-6 text-[var(--wedding-text)]">
                Resumo
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[var(--wedding-text-light)]">
                  <span>Subtotal</span>
                  <span>R$ {cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--wedding-text-light)]">
                  <span>Taxas</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="pt-3 border-t border-[var(--wedding-beige)]">
                  <div className="flex justify-between text-lg">
                    <span className="text-[var(--wedding-text)]">Total</span>
                    <span className="text-[var(--wedding-text)]">
                      R$ {cartSubtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mb-3"
                onClick={handleCheckout}
              >
                Ir para pagamento
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/shopping/products')}
              >
                Continuar comprando
              </Button>

              <div className="mt-6 p-4 bg-[var(--wedding-beige)] rounded-lg">
                <p className="text-xs text-[var(--wedding-text-light)] text-center">
                  Seus presentes ajudarão os noivos a viver momentos especiais
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
