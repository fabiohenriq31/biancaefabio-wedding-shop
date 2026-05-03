import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

type AdminGuardProps = {
  children: React.ReactNode;
}

const ALLOWED_ADMIN_EMAILS = (
  import.meta.env.VITE_ADMIN_EMAILS ||
  'comerciallojao031@gmail.com,vazfbianca@gmail.com'
)
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean);

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const isAdmin = 
    !!user?.email &&
    (user.role === 'admin' || ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase()));

    useEffect(() => {
      if (!isLoggedIn){
        navigate(`/shopping/login?redirect=${encodeURIComponent('/admin')}`);
        return
      }

    }, [isLoggedIn, isAdmin, navigate]);
    
    if (!isLoggedIn) {
      return null!!
    }

    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[var(--wedding-offwhite)] flex items-center justify-center px-6">
          <div className="bg-white border border-[var(--wedding-beige)] p-8 rounded-xl max-w-md text-center">
            <h1 className="text-3xl text-[var(--wedding-text)] mb-3">Acesso negado</h1>
            <p className="text-[var(--wedding-text-light)]">
              Seu login está ativo, mas este usuário não tem permissão administrativa.
            </p>
          </div>
        </div>
      )
    }

    return <>{children}</>
}
