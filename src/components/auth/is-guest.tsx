"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { User } from '@/lib/api/models';

const isGuest = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const GuestComponent = (props: P) => {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    
    useEffect(() => {
      const checkUser = async () => {
        const isAuthenticatedRes: User = (await isAuthenticated() as User);
        if (isAuthenticatedRes) {
          router.push(isAuthenticatedRes.is_superuser ? "/dashboard" : "/");
        }
      }

      if ( !user )
        checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return !user ? <WrappedComponent {...props} /> : null;
  };

  return GuestComponent;
};

export default isGuest;