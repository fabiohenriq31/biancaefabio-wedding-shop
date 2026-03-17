import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Calendar, Heart, Package } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { getOrdersByUser } from '../services/orderService';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        navigate('/shopping/login');
        return;
      }

      try {
        setLoading(true);
        const data = await getOrdersByUser(user.id);
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/shopping');
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR')
    : 'Agora';

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[var(--wedding-offwhite)] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[var(--wedding-text)]">
            Meu perfil
          </h1>
          <p className="text-[var(--wedding-text-light)]">
            Gerencie suas informações e veja seus presentes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[var(--wedding-gold)] text-white flex items-center justify-center mx-auto mb-4 text-3xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <h2 className="text-2xl mb-1 text-[var(--wedding-text)]">
                  {user.name}
                </h2>
                <p className="text-sm text-[var(--wedding-text-light)] mb-6">
                  {user.email}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-[var(--wedding-text-light)]">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--wedding-text-light)]">
                    <Calendar className="w-4 h-4" />
                    <span>Membro desde {memberSince}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--wedding-text-light)]">
                    <Package className="w-4 h-4" />
                    <span>
                      {orders.length} {orders.length === 1 ? 'presente enviado' : 'presentes enviados'}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Sair da conta
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl mb-6 text-[var(--wedding-text)]">
                Histórico de presentes
              </h2>

              {loading ? (
                <p className="text-[var(--wedding-text-light)]">
                  Carregando presentes...
                </p>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const orderId = order._id || order.id;
                    const orderTotal = order.totalAmount ?? order.total ?? 0;

                    return (
                      <div
                        key={orderId}
                        className="border border-[var(--wedding-beige)] rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm text-[var(--wedding-text-light)] mb-1">
                              Pedido #{orderId}
                            </p>
                            <p className="text-xs text-[var(--wedding-text-light)]">
                              {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>

                          <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'default'}>
                            {order.paymentStatus === 'paid' ? 'Pago' : 'Aguardando pagamento'}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-3">
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

                        {order.giftMessage && (
                          <div className="bg-[var(--wedding-beige)] rounded p-3 mb-3">
                            <div className="flex items-start gap-2">
                              <Heart className="w-4 h-4 text-[var(--wedding-gold)] flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-[var(--wedding-text-light)] italic">
                                "{order.giftMessage}"
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-[var(--wedding-beige)]">
                          <span className="text-sm text-[var(--wedding-text-light)]">
                            Total do pedido
                          </span>
                          <span className="text-lg text-[var(--wedding-text)]">
                            R$ {orderTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<Heart className="w-12 h-12" />}
                  title="Nenhum presente enviado ainda"
                  description="Que tal escolher um presente especial para os noivos?"
                  action={
                    <Button onClick={() => navigate('/shopping/products')}>
                      Ver presentes
                    </Button>
                  }
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}