import { CalendarDays, Camera, ClipboardList, Gift, HandCoins, LayoutDashboard, MessageSquareText, Package, PiggyBank, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/convidados', label: 'Lista de convidados', icon: Users },
  { to: '/admin/organizacao-do-dia', label: 'Organizacao do dia', icon: CalendarDays },
  { to: '/admin/financeiro', label: 'Financeiro', icon: PiggyBank },
  { to: '/admin/fornecedores', label: 'Fornecedores', icon: HandCoins },
  { to: '/admin/fotos', label: 'Fotos dos convidados', icon: Camera },
  { to: '/admin/social', label: 'B&F Social', icon: MessageSquareText },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[var(--wedding-offwhite)]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-[var(--wedding-beige)] bg-white px-5 py-6 lg:block">
        <a href="/shopping" className="flex items-center gap-3 mb-10">
          <span className="h-11 w-11 rounded-lg bg-[var(--wedding-text)] text-white flex items-center justify-center">
            <Gift className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm text-[var(--wedding-text-light)]">Admin</span>
            <span className="block text-xl text-[var(--wedding-text)]">Bianca & Fabio</span>
          </span>
        </a>

        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? 'bg-[var(--wedding-text)] text-white'
                    : 'text-[var(--wedding-text-light)] hover:bg-[var(--wedding-beige)] hover:text-[var(--wedding-text)]'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-[var(--wedding-beige)] bg-white/90 backdrop-blur px-5 py-4 lg:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                    isActive ? 'bg-[var(--wedding-text)] text-white' : 'bg-[var(--wedding-beige)]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </header>

        <main className="px-5 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
