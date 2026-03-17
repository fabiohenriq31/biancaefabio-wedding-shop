import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, Smartphone, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../services/orderService';
import type { PaymentMethod } from '../types';
import { createCheckoutPro } from '../services/paymentService';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [processing, setProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const handleFinishOrder = async () => {
    if (!user?.id) {
      navigate('/shopping/login');
      return;
    }

    try {
      setProcessing(true);

      const payload = {
        userId: user.id,
        customerName,
        customerEmail,
        customerPhone,
        giftMessage,
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.productPrice,
          quantity: item.quantity,
        })),
      };

      console.log('PAYLOAD ORDER:', payload);

      const response = await createOrder(payload);
      console.log('RESPONSE ORDER:', response);

      const orderId = response.order._id || response.order.id;
      console.log('ORDER ID:', orderId);

      const payment = await createCheckoutPro(orderId);
      console.log('PAYMENT RESPONSE:', payment);

      window.location.href = payment.initPoint;
    } catch (error) {
      console.error('ERRO CHECKOUT:', error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Erro ao finalizar pedido.');
      }
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!processing && !orderCompleted && cartItems.length === 0) {
      navigate('/shopping/cart');
    }
  }, [cartItems.length, processing, orderCompleted, navigate]);

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[var(--wedding-offwhite)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[var(--wedding-text)]">
            Finalizar pedido
          </h1>
          <p className="text-[var(--wedding-text-light)]">
            Complete os dados para enviar seu presente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-2xl mb-6 text-[var(--wedding-text)]">
                Seus dados
              </h2>
              <div className="space-y-4">
                <Input
                  label="Nome completo"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
                <Input
                  label="Telefone (opcional)"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl mb-3 text-[var(--wedding-text)]">
                Mensagem para os noivos
              </h2>
              <p className="text-sm text-[var(--wedding-text-light)] mb-4">
                Deixe palavras carinhosas que farão parte da história de Bianca & Fábio
              </p>
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Escreva sua mensagem aqui..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-[var(--wedding-beige)] border border-transparent text-[var(--wedding-text)] placeholder:text-[var(--wedding-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--wedding-gold)] resize-none"
              />
            </Card>

            <Card>
              <h2 className="text-2xl mb-6 text-[var(--wedding-text)]">
                Forma de pagamento
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-[var(--wedding-gold)] bg-[var(--wedding-beige)]'
                      : 'border-[var(--wedding-beige)] hover:border-[var(--wedding-gray)]'
                  }`}
                >
                  <Smartphone className="w-6 h-6 text-[var(--wedding-text)]" />
                  <div className="text-left flex-1">
                    <p className="text-[var(--wedding-text)]">PIX</p>
                    <p className="text-sm text-[var(--wedding-text-light)]">
                      Pagamento instantâneo
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'pix'
                        ? 'border-[var(--wedding-gold)]'
                        : 'border-[var(--wedding-gray)]'
                    }`}
                  >
                    {paymentMethod === 'pix' && (
                      <div className="w-3 h-3 rounded-full bg-[var(--wedding-gold)]" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-[var(--wedding-gold)] bg-[var(--wedding-beige)]'
                      : 'border-[var(--wedding-beige)] hover:border-[var(--wedding-gray)]'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-[var(--wedding-text)]" />
                  <div className="text-left flex-1">
                    <p className="text-[var(--wedding-text)]">Cartão de crédito</p>
                    <p className="text-sm text-[var(--wedding-text-light)]">
                      Parcelamento disponível
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'credit_card'
                        ? 'border-[var(--wedding-gold)]'
                        : 'border-[var(--wedding-gray)]'
                    }`}
                  >
                    {paymentMethod === 'credit_card' && (
                      <div className="w-3 h-3 rounded-full bg-[var(--wedding-gold)]" />
                    )}
                  </div>
                </button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-2xl mb-6 text-[var(--wedding-text)]">
                Resumo do pedido
              </h2>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between text-sm">
                    <span className="text-[var(--wedding-text-light)]">
                      {item.quantity}x {item.productName}
                    </span>
                    <span className="text-[var(--wedding-text)]">
                      R$ {item.lineTotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[var(--wedding-beige)] mb-6">
                <div className="flex justify-between text-xl mb-1">
                  <span className="text-[var(--wedding-text)]">Total</span>
                  <span className="text-[var(--wedding-text)]">
                    R$ {cartSubtotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[var(--wedding-text-light)] text-right">
                  via {paymentMethod === 'pix' ? 'PIX' : 'Cartão de crédito'}
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleFinishOrder}
                disabled={processing || !customerName || !customerEmail}
              >
                <Heart className="w-5 h-5" />
                {processing ? 'Processando...' : 'Finalizar pedido'}
              </Button>

              <div className="mt-6 p-4 bg-[var(--wedding-beige)] rounded-lg">
                <p className="text-xs text-[var(--wedding-text-light)] text-center">
                  Seus dados estão seguros e a transação é totalmente protegida
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}