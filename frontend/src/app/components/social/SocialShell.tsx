import { Bell, Home, MessageCircle, Search, User, Users } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

const items = [
  { label: 'Pagina inicial', icon: Home, to: '/shopping/social' },
  { label: 'Explorar', icon: Search, to: '/shopping/products' },
  { label: 'Notificacoes', icon: Bell, to: '/shopping/social/notifications' },
  { label: 'Bate-papo', icon: MessageCircle, to: '/shopping/social/chat' },
  { label: 'Convidados', icon: Users, to: '/shopping/social/guests' },
  { label: 'Perfil', icon: User, to: '/shopping/profile' },
];

export function SocialShell() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white lg:min-h-[calc(100vh-80px)] lg:bg-[#fbf9f7] lg:text-[var(--wedding-text)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[260px_minmax(0,640px)_320px]">
        <aside className="sticky top-20 hidden h-[calc(100vh-80px)] border-r border-[var(--wedding-beige)] bg-white/70 px-4 py-6 lg:block">
          <Link to="/shopping" className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wedding-text)] text-lg font-semibold text-white">
            B&F
          </Link>

          <nav className="space-y-2">
            {items.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                to={to}
                end={to === '/shopping/social'}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-full px-4 py-3 text-lg transition hover:bg-[var(--wedding-beige)] ${
                    isActive ? 'font-semibold text-[var(--wedding-text)]' : 'text-[var(--wedding-text)]'
                  }`
                }
              >
                <Icon className="h-6 w-6" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <a href="/shopping/social#bf-social-compose" className="mt-6 flex w-full items-center justify-center rounded-full bg-[var(--wedding-text)] px-5 py-3 font-semibold text-white transition hover:opacity-90">
            Postar
          </a>

          <Link to="/shopping/profile" className="absolute bottom-6 left-4 right-4 flex items-center gap-3 rounded-full p-3 hover:bg-[var(--wedding-beige)]">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-11 w-11 rounded-full object-cover" />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--wedding-gold)] text-white">{user?.name?.charAt(0).toUpperCase() || 'B'}</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{user?.name}</p>
              <p className="truncate text-sm text-[var(--wedding-text-light)]">{user?.email}</p>
            </div>
          </Link>
        </aside>

        <Outlet />
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-5 border-t border-white/10 bg-black text-white lg:hidden">
        {[
          { label: 'Inicio', icon: Home, to: '/shopping/social' },
          { label: 'Explorar', icon: Search, to: '/shopping/products' },
          { label: 'Convidados', icon: Users, to: '/shopping/social/guests' },
          { label: 'Avisos', icon: Bell, to: '/shopping/social/notifications' },
          { label: 'Chat', icon: MessageCircle, to: '/shopping/social/chat' },
        ].map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/shopping/social'}
            className={({ isActive }) =>
              `flex items-center justify-center ${isActive ? 'text-white' : 'text-white/60'}`
            }
            aria-label={label}
          >
            <Icon className="h-7 w-7" />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
