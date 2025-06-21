"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserModel } from '@/lib/api/models';
import { getMe, logout as useLogout } from '@/lib/api/generated/auth/auth';

type User = UserModel | null | false;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  isSuperUser: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<User | boolean>;
  hasRole: (role: string | undefined) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const router = useRouter();

  const login = async () => {
    if ( !user )
      await getMe().then((user) => {
        setUser(user);
        setIsAuthenticated(true);
        setIsSuperUser(user.is_superuser || false);
      }).catch(() => {
        setUser(false);
        setIsAuthenticated(false);
        setIsSuperUser(false);
      });
  };

  const checkAuth = async () => {
    return await getMe().then((user) => {
      setUser(user);
      setIsAuthenticated(true);
      setIsSuperUser(user.is_superuser || false);
      return user;
    }).catch(() => {
      setUser(false);
      setIsAuthenticated(false);
      setIsSuperUser(false);
      return false;
    });
  };

  const logout = () => {
    setUser(false);
    setIsAuthenticated(false);
    setIsSuperUser(false);
    useLogout();
    router.push('/login');
  };

  const hasRole = (role: string | undefined) => {
    if ( !role ) return true;
    if ( !user ) return false;
    // For now, we only support 'super-admin' role check
    if ( role === 'super-admin' ) return user.is_superuser || false;
    return false;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isSuperUser, login, logout, checkAuth, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};