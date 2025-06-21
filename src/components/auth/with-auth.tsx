"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const { user, checkAuth, login } = useAuth();
    
    useEffect(() => {
      const checkUser = async () => {
        const isAuthenticatedRes = await checkAuth();
        if (!isAuthenticatedRes) {
          router.push('/login');
        } else {
          login();
        }
      }

      if ( !user )
        checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    // @ts-ignore
    return user?.id ? <WrappedComponent {...props} /> : null;
  };

  return AuthenticatedComponent;
};

export default withAuth;