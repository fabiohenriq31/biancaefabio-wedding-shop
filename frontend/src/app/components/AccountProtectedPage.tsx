import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function AccountProtectedPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(`/shopping/login?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }, [isLoggedIn, location.pathname, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return <Outlet />;
}
