"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserModel } from '@/lib/api/models';
import { getMe, logout as useLogout } from '@/lib/api/generated/auth/auth';

type User = UserModel | null | false;

type AuthContextType = {
  user: User;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: () => Promise<User | boolean>;
  hasRole: (role: string | undefined) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();

  const login = async () => {
    if ( !user )
      await getMe().then(setUser).catch(() => setUser(false));
  };

  const isAuthenticated = async () => {
    return await getMe().then().catch(() => false);
  };

  const logout = () => {
    setUser(false);
    useLogout();
    router.push('/login');
  };

  const hasRole = (role: string | undefined) => {
    // if ( !role ) return true;
    // if ( !user ) return false;
    // return user.role?.name === role;
    return true;
  }

  // const hasPermission = (permission: string | undefined) => {
  //   if ( !user ) return false;
  //   return user.permissions.includes(permission);
  // }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
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