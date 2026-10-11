import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'business' | 'admin';
  avatar?: string;
  loyaltyPoints: number;
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

// Demo users for development
const DEMO_USERS: (User & { password: string })[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    password: 'demo123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=33',
    loyaltyPoints: 1250,
    memberSince: '2024-03',
  },
  {
    id: 'b1',
    name: 'Pellazgo Studio',
    email: 'business@pellazgo.com',
    password: 'business123',
    role: 'business',
    avatar: 'https://i.pravatar.cc/150?img=15',
    loyaltyPoints: 0,
    memberSince: '2023-01',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('pellazgo_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800)); // simulate API
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...u } = found;
      setUser(u);
      localStorage.setItem('pellazgo_user', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: 'user',
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      loyaltyPoints: 0,
      memberSince: new Date().toISOString().substring(0, 7),
    };
    setUser(newUser);
    localStorage.setItem('pellazgo_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pellazgo_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
