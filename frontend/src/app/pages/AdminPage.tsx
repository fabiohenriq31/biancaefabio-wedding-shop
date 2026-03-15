import { useState, useEffect } from 'react';
import { Search, Download, Filter, Heart, Package, DollarSign, Users } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';

export function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Load all orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('wedding_orders') || '[]');
    setOrders(savedOrders);
  }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalItems = orders.reduce((sum, order) =>
    sum + order.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0), 0
  );

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[var(--wedding-offwhite)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[var(--wedding-text)]">
            Área Administrativa
          </h1>
          <p className="text-[var(--wedding-text-light)]">
            Gerencie os presentes recebidos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--wedding-beige)] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[var(--wedding-gold)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--wedding-text-light)]">Total de pedidos</p>
                <p className="text-2xl text-[var(--wedding-text)]">{totalOrders}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--wedding-beige)] rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[var(--wedding-gold)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--wedding-text-light)]">Valor total</p>
                <p className="text-2xl text-[var(--wedding-text)]">
                  R$ {totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--wedding-beige)] rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-[var(--wedding-gold)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--wedding-text-light)]">Itens presenteados</p>
                <p className="text-2xl text-[var(--wedding-text)]">{totalItems}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--wedding-beige)] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--wedding-gold)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--wedding-text-light)]">Convidados</p>
                <p className="text-2xl text-[var(--wedding-text)]">{totalOrders}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--wedding-text-light)]" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou pedido..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-[var(--wedding-beige)] border border-transparent text-[var(--wedding-text)] placeholder:text-[var(--wedding-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--wedding-gold)]"
              />
            </div>
          </div>
        </Card>

        {/* Orders table */}
        <Card padding="none">
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--wedding-beige)]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-[var(--wedding-text)]">
                      Pedido
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-[var(--wedding-text)]">
                      Convidado
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-[var(--wedding-text)]">
                      Itens
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-[var(--wedding-text)]">
                      Valor
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-[var(--wedding-text)]">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-[var(--wedding-text)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--wedding-beige)]">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[var(--wedding-beige)] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--wedding-text)]">
                          #{order.id}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--wedding-text)]">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-[var(--wedding-text-light)]">
                          {order.customerEmail}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[var(--wedding-text-light)]">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx}>
                              {item.quantity}x {item.productName}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--wedding-text)]">
                          R$ {order.total.toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--wedding-text-light)]">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="success">Confirmado</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                icon={<Package className="w-12 h-12" />}
                title="Nenhum pedido encontrado"
                description={searchQuery ? "Tente buscar com outros termos" : "Os pedidos aparecerão aqui quando os convidados fizerem suas compras"}
              />
            </div>
          )}
        </Card>

        {/* Messages section */}
        {orders.some(order => order.giftMessage) && (
          <div className="mt-8">
            <h2 className="text-2xl mb-4 text-[var(--wedding-text)]">
              Mensagens dos convidados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders
                .filter(order => order.giftMessage)
                .map((order) => (
                  <Card key={order.id}>
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-[var(--wedding-gold)] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-[var(--wedding-text)] mb-1">
                          {order.customerName}
                        </p>
                        <p className="text-sm text-[var(--wedding-text-light)] italic">
                          "{order.giftMessage}"
                        </p>
                        <p className="text-xs text-[var(--wedding-text-light)] mt-2">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
