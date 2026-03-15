import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('wedding_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call backend
    const mockUser: User = {
      id: '1',
      name: 'Convidado',
      email,
      provider: 'email',
      createdAt: new Date()
    };
    setUser(mockUser);
    localStorage.setItem('wedding_user', JSON.stringify(mockUser));
  };

  const loginWithGoogle = async () => {
    // Mock Google login
    const mockUser: User = {
      id: '2',
      name: 'Convidado Google',
      email: 'convidado@gmail.com',
      provider: 'google',
      avatarUrl: 'https://ui-avatars.com/api/?name=Convidado+Google&background=d4af37&color=fff',
      createdAt: new Date()
    };
    setUser(mockUser);
    localStorage.setItem('wedding_user', JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration
    const mockUser: User = {
      id: '3',
      name,
      email,
      provider: 'email',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4af37&color=fff`,
      createdAt: new Date()
    };
    setUser(mockUser);
    localStorage.setItem('wedding_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wedding_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        loginWithGoogle,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
