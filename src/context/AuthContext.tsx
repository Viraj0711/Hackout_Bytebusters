import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'analyst' | 'operator';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, role?: User['role']) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize with demo user or check localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('demo_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, _password?: string) => {
    try {
      // Demo authentication - just create a user based on email
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        email: email,
        full_name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: email.toLowerCase().includes('admin') ? 'admin' : 'analyst',
        created_at: new Date().toISOString(),
      };

      setUser(demoUser);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, _password: string, role: User['role'] = 'analyst') => {
    try {
      // Demo sign up - just create a user based on email and role
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        email: email,
        full_name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: role,
        created_at: new Date().toISOString(),
      };

      setUser(demoUser);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('demo_user');
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}