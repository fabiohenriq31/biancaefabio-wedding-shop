import { AdminGuard } from '../components/AdminGuard';
import { AdminLayout } from './admin/AdminLayout';

export function AdminProtectedPage() {
  return (
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  );
}
