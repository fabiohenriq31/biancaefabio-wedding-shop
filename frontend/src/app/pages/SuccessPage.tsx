import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { CheckCircle, Clock3, Home, ShoppingBag, Heart, XCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getOrderById } from '../services/orderService';
import { syncMercadoPagoOrderStatus } from '../services/paymentService';
import type { Order } from '../types';

const LAST_ORDER_STORAGE_KEY = 'wedding_last_order_id';

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | any | null>(location.state?.order || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const paymentId = searchParams.get('payment_id');
  const externalReference =
    searchParams.get('external_reference') ||
    searchParams.get('collection_id') ||
    sessionStorage.getItem(LAST_ORDER_STORAGE_KEY);

  useEffect(() => {
    if (!user) {
      navigate('/shopping/login');
      return;
    }

    async function loadOrder() {
      try {
        setLoading(true);

        if (paymentId || externalReference) {
          const synced = await syncMercadoPagoOrderStatus({
            paymentId,
            externalReference,
          });

          if (synced?.order) {
            setOrder(synced.order);
            clearCart();
            sessionStorage.removeItem(LAST_ORDER_STORAGE_KEY);
            return;
          }
        }

        if (externalReference) {
          const loadedOrder = await getOrderById(externalReference);
          setOrder(loadedOrder);
          clearCart();
          sessionStorage.removeItem(LAST_ORDER_STORAGE_KEY);
          return;
        }

        if (location.state?.order) {
          setOrder(location.state.order);
          clearCart();
          return;
        }

        navigate('/shopping/profile');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pedido.');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [user, paymentId, externalReference, location.state, navigate, clearCart]);

  const statusView = useMemo(() => {
    if (!order) {
      return {
        title: 'Pedido localizado',
        subtitle: 'Estamos buscando o status mais recente do seu pagamento.',
        icon: Clock3,
        iconClass: 'text-amber-600',
        wrapperClass: 'bg-amber-100',
      };
    }

    if (order.paymentStatus === 'paid') {
      return {
        title: 'Pagamento confirmado',
        subtitle: 'Seu presente foi recebido com muito carinho.',
        icon: CheckCircle,
        iconClass: 'text-green-600',
        wrapperClass: 'bg-green-100',
      };
    }

    if (order.paymentStatus === 'failed' || order.paymentStatus === 'refunded') {
      return {
        title: 'Pagamento nao concluido',
        subtitle: 'Seu pedido foi registrado, mas o pagamento nao foi confirmado.',
        icon: XCircle,
        iconClass: 'text-red-600',
        wrapperClass: 'bg-red-100',
      };
    }

    return {
      title: 'Pagamento em analise',
      subtitle: 'Seu pedido foi registrado e estamos aguardando a confirmacao do Mercado Pago.',
      icon: Clock3,
      iconClass: 'text-amber-600',
      wrapperClass: 'bg-amber-100',
    };
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-gradient-to-b from-[var(--wedding-beige)] to-[var(--wedding-offwhite)] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <p className="text-[var(--wedding-text-light)]">Carregando status do pagamento...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-gradient-to-b from-[var(--wedding-beige)] to-[var(--wedding-offwhite)] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <p className="text-red-700">{error}</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const StatusIcon = statusView.icon;
  const orderId = order._id || order.id;
  const orderTotal = order.totalAmount ?? order.total ?? 0;

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-b from-[var(--wedding-beige)] to-[var(--wedding-offwhite)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${statusView.wrapperClass}`}>
            <StatusIcon className={`w-12 h-12 ${statusView.iconClass}`} />
          </div>
          <h1 className="text-5xl mb-4 text-[var(--wedding-text)]">
            {statusView.title}
          </h1>
          <p className="text-xl text-[var(--wedding-text-light)]">
            {statusView.subtitle}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-[var(--wedding-text)]">
                Resumo do presente
              </h3>
              <span className="rounded-full bg-[var(--wedding-beige)] px-3 py-1 text-sm text-[var(--wedding-text)]">
                {order.paymentStatus === 'paid'
                  ? 'Pago'
                  : order.paymentStatus === 'failed'
                    ? 'Nao pago'
                    : order.paymentStatus === 'refunded'
                      ? 'Estornado'
                      : 'Aguardando'}
              </span>
            </div>

            <div className="space-y-2">
              {(order.items || []).map((item: any, index: number) => {
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
                      {money(itemTotal)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-lg mt-4 pt-4 border-t border-[var(--wedding-beige)]">
              <span className="text-[var(--wedding-text)]">Total</span>
              <span className="text-[var(--wedding-text)]">
                {money(orderTotal)}
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
            <p>Status atual do pedido para</p>
            <p className="text-[var(--wedding-text)]">{order.customerEmail}</p>
          </div>
        </Card>

        <div className="bg-gradient-to-r from-[var(--wedding-beige)] to-[var(--wedding-nude)] rounded-lg p-8 mb-8 text-center">
          <h2 className="text-2xl mb-3 text-[var(--wedding-text)]">
            Bianca & Fabio agradecem
          </h2>
          <p className="text-[var(--wedding-text-light)] max-w-2xl mx-auto">
            Seu carinho e generosidade fazem parte dessa historia. Assim que o pagamento for confirmado, o pedido tambem aparece atualizado no seu perfil e no admin.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/shopping/profile')}
          >
            <ShoppingBag className="w-5 h-5" />
            Ver meus pedidos
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
