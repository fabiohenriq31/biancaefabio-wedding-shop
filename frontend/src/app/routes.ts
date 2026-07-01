import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { ProfilePage } from './pages/ProfilePage';
import { SocialPage } from './pages/SocialPage';
import { AdminProtectedPage } from './components/AdminProtectedPage';
import { AccountProtectedPage } from './components/AccountProtectedPage';
import { SocialShell } from './components/social/SocialShell';
import { ChatPage } from './pages/social/ChatPage';
import { GuestsPage } from './pages/social/GuestsPage';
import { NotificationsPage } from './pages/social/NotificationsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDaySchedulePage } from './pages/admin/AdminDaySchedulePage';
import { AdminGuestPhotosPage } from './pages/admin/AdminGuestPhotosPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminGuestsPage } from './pages/admin/AdminGuestsPage';
import { AdminFinancePage } from './pages/admin/AdminFinancePage';
import { AdminSuppliersPage } from './pages/admin/AdminSuppliersPage';
import { AdminSocialPostsPage } from './pages/admin/AdminSocialPostsPage';

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
        Component: AccountProtectedPage,
        children: [
          {
            path: 'social',
            Component: SocialShell,
            children: [
              { index: true, Component: SocialPage },
              { path: 'notifications', Component: NotificationsPage },
              { path: 'chat', Component: ChatPage },
              { path: 'guests', Component: GuestsPage },
            ],
          },
        ],
      },
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
      { path: 'organizacao-do-dia', Component: AdminDaySchedulePage },
      { path: 'financeiro', Component: AdminFinancePage },
      { path: 'fornecedores', Component: AdminSuppliersPage },
      { path: 'fotos', Component: AdminGuestPhotosPage },
      { path: 'social', Component: AdminSocialPostsPage },
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
