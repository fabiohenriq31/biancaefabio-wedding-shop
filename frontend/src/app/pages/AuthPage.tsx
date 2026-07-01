import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle, loginWithPassword, registerWithPassword } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";

export function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/shopping/checkout';
  const isRegister = location.pathname.includes('/register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePasswordLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const data = isRegister
        ? await registerWithPassword(name, email, password)
        : await loginWithPassword(email, password);
      login(data);
      navigate(redirectTo);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Erro ao entrar.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-[var(--wedding-offwhite)] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--wedding-beige)] max-w-md w-full">
        <h1 className="text-3xl text-[var(--wedding-text)] mb-3">
          {isRegister ? 'Criar conta' : 'Entrar'}
        </h1>
        <p className="text-[var(--wedding-text-light)] mb-6">
          {isRegister ? 'Crie sua conta para participar do B&F Social' : 'Entre para continuar'}
        </p>

        <form onSubmit={handlePasswordLogin} className="space-y-4 mb-6">
          {isRegister && (
            <div>
              <label className="block text-sm text-[var(--wedding-text)] mb-2">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
                autoComplete="name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-[var(--wedding-text)] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--wedding-text)] mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[var(--wedding-text)] px-4 py-3 text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Aguarde...' : isRegister ? 'Criar conta com email' : 'Entrar com email'}
          </button>
        </form>

        <p className="mb-6 text-center text-sm text-[var(--wedding-text-light)]">
          {isRegister ? 'Ja tem conta?' : 'Ainda nao tem conta?'}{' '}
          <Link
            className="text-[var(--wedding-gold)]"
            to={`${isRegister ? '/shopping/login' : '/shopping/register'}?redirect=${encodeURIComponent(redirectTo)}`}
          >
            {isRegister ? 'Entrar' : 'Criar conta'}
          </Link>
        </p>

        <div className="flex items-center gap-3 mb-6">
          <span className="h-px flex-1 bg-[var(--wedding-beige)]" />
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--wedding-text-light)]">
            ou
          </span>
          <span className="h-px flex-1 bg-[var(--wedding-beige)]" />
        </div>

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              if (!credentialResponse.credential) return;

              const data = await loginWithGoogle(credentialResponse.credential);
              login(data);
              navigate(redirectTo);
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
