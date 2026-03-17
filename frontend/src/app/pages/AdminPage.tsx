import { useEffect, useMemo, useState } from "react";
import { Package, Users, DollarSign, Heart, Search } from "lucide-react";

export function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("http://localhost:3001/orders");
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return orders.filter((order) => {
      const orderId = String(order._id || "").toLowerCase();
      const name = String(order.customerName || "").toLowerCase();
      const email = String(order.customerEmail || "").toLowerCase();

      return (
        orderId.includes(query) ||
        name.includes(query) ||
        email.includes(query)
      );
    });
  }, [orders, searchQuery]);

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (order.totalAmount ?? 0);
  }, 0);

  const totalItems = orders.reduce((sum, order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    return sum + items.reduce((s: number, i: any) => s + (i.quantity ?? 0), 0);
  }, 0);

  const uniqueGuests = new Set(
    orders.map((o) => o.customerEmail).filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen bg-[var(--wedding-offwhite)] py-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-[var(--wedding-text)]">
            Painel Administrativo
          </h1>

          <p className="text-[var(--wedding-text-light)] mt-2">
            Controle de presentes enviados pelos convidados
          </p>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--wedding-beige)]">
            <Package className="mb-2 text-[var(--wedding-gold)]" />
            <p className="text-sm text-[var(--wedding-text-light)]">
              Pedidos
            </p>
            <p className="text-3xl font-semibold text-[var(--wedding-text)]">
              {totalOrders}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--wedding-beige)]">
            <DollarSign className="mb-2 text-[var(--wedding-gold)]" />
            <p className="text-sm text-[var(--wedding-text-light)]">
              Valor total
            </p>
            <p className="text-3xl font-semibold text-[var(--wedding-text)]">
              R$ {totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--wedding-beige)]">
            <Heart className="mb-2 text-[var(--wedding-gold)]" />
            <p className="text-sm text-[var(--wedding-text-light)]">
              Itens presenteados
            </p>
            <p className="text-3xl font-semibold text-[var(--wedding-text)]">
              {totalItems}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--wedding-beige)]">
            <Users className="mb-2 text-[var(--wedding-gold)]" />
            <p className="text-sm text-[var(--wedding-text-light)]">
              Convidados
            </p>
            <p className="text-3xl font-semibold text-[var(--wedding-text)]">
              {uniqueGuests}
            </p>
          </div>

        </div>

        {/* SEARCH */}

        <div className="bg-white rounded-xl p-6 border border-[var(--wedding-beige)] mb-8">
          <div className="flex items-center gap-3">

            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar por nome, email ou pedido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none bg-transparent"
            />

          </div>
        </div>

        {/* ORDERS */}

        <div className="space-y-6">

          {loading && (
            <p className="text-[var(--wedding-text-light)]">
              Carregando pedidos...
            </p>
          )}

          {!loading && filteredOrders.length === 0 && (
            <p className="text-[var(--wedding-text-light)]">
              Nenhum pedido encontrado.
            </p>
          )}

          {filteredOrders.map((order) => {

            const items = Array.isArray(order.items) ? order.items : [];
            const orderTotal = order.totalAmount ?? 0;

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl border border-[var(--wedding-beige)] p-6 shadow-sm"
              >

                {/* HEADER */}

                <div className="flex justify-between mb-4">

                  <div>
                    <p className="text-sm text-[var(--wedding-text-light)]">
                      Pedido #{order._id}
                    </p>

                    <p className="text-lg font-medium text-[var(--wedding-text)]">
                      {order.customerName}
                    </p>

                    <p className="text-sm text-[var(--wedding-text-light)]">
                      {order.customerEmail}
                    </p>
                  </div>

                  <div className="text-sm bg-[var(--wedding-beige)] px-3 py-1 rounded-full h-fit">
                    {order.paymentStatus === "paid" ? "Pago" : "Aguardando"}
                  </div>

                </div>

                {/* ITEMS */}

                <div className="space-y-2 mb-4">

                  {items.map((item: any, i: number) => {

                    const total =
                      (item.price ?? item.unitPrice ?? 0) * item.quantity;

                    return (
                      <div key={i} className="flex justify-between text-sm">

                        <span className="text-[var(--wedding-text-light)]">
                          {item.quantity}x {item.productName}
                        </span>

                        <span className="text-[var(--wedding-text)]">
                          R$ {total.toFixed(2)}
                        </span>

                      </div>
                    );
                  })}
                </div>

                {/* MESSAGE */}

                {order.giftMessage && (
                  <div className="bg-[var(--wedding-beige)] p-3 rounded-lg text-sm italic mb-4">
                    "{order.giftMessage}"
                  </div>
                )}

                {/* TOTAL */}

                <div className="flex justify-between border-t pt-3">

                  <span className="text-[var(--wedding-text-light)]">
                    Total
                  </span>

                  <span className="font-semibold text-[var(--wedding-text)]">
                    R$ {orderTotal.toFixed(2)}
                  </span>

                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}