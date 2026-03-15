import { Link, useNavigate } from 'react-router';
import { ShoppingCart, User, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

export function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/shopping');
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[var(--wedding-beige)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/shopping" className="flex items-center">
            <h1 className="text-3xl text-[var(--wedding-text)]">
              Bianca & Fábio
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/shopping/products"
              className="text-[var(--wedding-text-light)] hover:text-[var(--wedding-text)] transition-colors"
            >
              Presentes
            </Link>
            <a
              href="https://biancaefabio.com.br"
              className="text-[var(--wedding-text-light)] hover:text-[var(--wedding-text)] transition-colors"
            >
              Voltar ao site
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={() => navigate('/shopping/cart')}
              className="relative p-2 hover:bg-[var(--wedding-beige)] rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-[var(--wedding-text)]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--wedding-gold)] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User menu */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-[var(--wedding-beige)] rounded-lg transition-colors"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--wedding-gold)] text-white flex items-center justify-center text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[var(--wedding-beige)] py-2 z-20">
                      <div className="px-4 py-2 border-b border-[var(--wedding-beige)]">
                        <p className="text-sm text-[var(--wedding-text)]">{user.name}</p>
                        <p className="text-xs text-[var(--wedding-text-light)]">{user.email}</p>
                      </div>
                      <Link
                        to="/shopping/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--wedding-beige)] text-[var(--wedding-text-light)] hover:text-[var(--wedding-text)]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Meu perfil
                      </Link>
                      <Link
                        to="/shopping/orders"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--wedding-beige)] text-[var(--wedding-text-light)] hover:text-[var(--wedding-text)]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="w-4 h-4" />
                        Meus presentes
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--wedding-beige)] text-[var(--wedding-text-light)] hover:text-[var(--wedding-text)]"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/shopping/login')}
                className="px-4 py-2 bg-[var(--wedding-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
