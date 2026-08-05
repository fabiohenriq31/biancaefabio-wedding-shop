import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function AccountProtectedPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      const redirectTo = `${location.pathname}${location.search}${location.hash}`;
      navigate(`/shopping/login?redirect=${encodeURIComponent(redirectTo)}`);
    }
  }, [isLoggedIn, location.hash, location.pathname, location.search, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return <Outlet />;
}
