import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CheckCircle, Home, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useCart } from '../contexts/CartContext';

export function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/shopping');
      return;
    }

  clearCart();
    }, [order, navigate, clearCart]);
    
  if (!order) return null;

  const orderId = order._id || order.id;
  const orderTotal = order.totalAmount ?? order.total ?? 0;

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-b from-[var(--wedding-beige)] to-[var(--wedding-offwhite)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-5xl mb-4 text-[var(--wedding-text)]">
            Obrigado!
          </h1>
          <p className="text-xl text-[var(--wedding-text-light)]">
            Seu presente foi recebido com muito amor
          </p>
        </div>

        <Card className="mb-8">
          <div className="text-center mb-6">
            <p className="text-[var(--wedding-text-light)] mb-2">
              Pedido
            </p>
            <p className="text-2xl text-[var(--wedding-text)]">
              #{orderId}
            </p>
          </div>

          <div className="border-t border-b border-[var(--wedding-beige)] py-6 mb-6">
            <h3 className="text-lg mb-4 text-[var(--wedding-text)]">
              Resumo do presente
            </h3>

            <div className="space-y-2">
              {order.items.map((item: any, index: number) => {
                const itemTotal =
                  item.lineTotal ??
                  item.totalPrice ??
                  (item.price ?? item.unitPrice ?? 0) * item.quantity;

                return (
                  <div
                    key={item._id || item.id || `${item.productId}-${index}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-[var(--wedding-text-light)]">
                      {item.quantity}x {item.productName}
                    </span>
                    <span className="text-[var(--wedding-text)]">
                      R$ {itemTotal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-lg mt-4 pt-4 border-t border-[var(--wedding-beige)]">
              <span className="text-[var(--wedding-text)]">Total</span>
              <span className="text-[var(--wedding-text)]">
                R$ {orderTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {order.giftMessage && (
            <div className="bg-[var(--wedding-beige)] rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <Heart className="w-5 h-5 text-[var(--wedding-gold)] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg mb-2 text-[var(--wedding-text)]">
                    Sua mensagem
                  </h3>
                  <p className="text-[var(--wedding-text-light)] italic">
                    "{order.giftMessage}"
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-[var(--wedding-text-light)]">
            <p>Um e-mail de confirmação foi enviado para</p>
            <p className="text-[var(--wedding-text)]">{order.customerEmail}</p>
          </div>
        </Card>

        <div className="bg-gradient-to-r from-[var(--wedding-beige)] to-[var(--wedding-nude)] rounded-lg p-8 mb-8 text-center">
          <h2 className="text-2xl mb-3 text-[var(--wedding-text)]">
            Bianca & Fábio agradecem
          </h2>
          <p className="text-[var(--wedding-text-light)] max-w-2xl mx-auto">
            Seu carinho e generosidade nos enchem de alegria. Este presente fará parte da nossa história e será lembrado com muito amor. Obrigado por celebrar esse momento especial conosco!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/shopping/products')}
          >
            <ShoppingBag className="w-5 h-5" />
            Escolher mais presentes
          </Button>

          <Button
            size="lg"
            onClick={() => {
              window.location.href = 'https://biancaefabio.com.br';
            }}
          >
            <Home className="w-5 h-5" />
            Ir para o site do casamento
          </Button>
        </div>
      </div>
    </div>
  );
}