import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-[var(--wedding-offwhite)] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--wedding-beige)] max-w-md w-full">
        <h1 className="text-3xl text-[var(--wedding-text)] mb-3">
          Entrar
        </h1>
        <p className="text-[var(--wedding-text-light)] mb-6">
          Entre com sua conta Google para continuar
        </p>

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              if (!credentialResponse.credential) return;

              const data = await loginWithGoogle(credentialResponse.credential);
              login(data);
              navigate("/shopping/checkout");
            } catch (error) {
              console.error(error);

              if (error instanceof Error) {
                alert(error.message);
              } else {
                alert("Erro ao entrar com Google.");
              }
            }
          }}
          onError={() => {
            alert("Falha no login com Google.");
          }}
        />
      </div>
    </div>
  );
}