import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminProtectedPage } from './components/AdminProtectedPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminGuestPhotosPage } from './pages/admin/AdminGuestPhotosPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminGuestsPage } from './pages/admin/AdminGuestsPage';
import { AdminSuppliersPage } from './pages/admin/AdminSuppliersPage';

export const router = createBrowserRouter([
  {
    path: '/shopping',
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'login', Component: AuthPage },
      { path: 'register', Component: AuthPage },
      { path: 'products', Component: ProductsPage },
      { path: 'cart', Component: CartPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'success', Component: SuccessPage },
      { path: 'profile', Component: ProfilePage },
      { path: 'orders', Component: ProfilePage },
      {
        path: 'admin',
        loader: () => {
          window.location.href = '/admin';
          return null;
        },
      },
    ],
  },
  {
    path: '/admin',
    Component: AdminProtectedPage,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'produtos', Component: AdminProductsPage },
      { path: 'pedidos', Component: AdminOrdersPage },
      { path: 'convidados', Component: AdminGuestsPage },
      { path: 'fornecedores', Component: AdminSuppliersPage },
      { path: 'fotos', Component: AdminGuestPhotosPage },
    ],
  },
  {
    path: '/',
    loader: () => {
      window.location.href = '/shopping';
      return null;
    },
  },
]);
