import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

type AdminGuardProps = {
  children: React.ReactNode;
}

const ALLOWED_ADMIN_EMAILS = [
  'comerciallojao031@gmail.com',
  'vazfbianca@gmail.com',
];

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const isAdmin = 
    !!user?.email &&
    ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase());

    useEffect(() => {
      if (!isLoggedIn){
        navigate('/shopping/login');
        return
      }

      if(!isAdmin) {
        navigate('/shopping');
      }
    }, [isLoggedIn, isAdmin, navigate]);
    
    if (!isLoggedIn || !isAdmin) {
      return null!!
    }

    return <>{children}</>
}