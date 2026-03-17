import { AdminGuard } from '../components/AdminGuard';
import { AdminPage } from '../pages/AdminPage';

export function AdminProtectedPage() {
  return (
    <AdminGuard>
      <AdminPage />
    </AdminGuard>
  );
}