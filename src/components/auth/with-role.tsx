"use client";

import { useEffect, useState } from "react";
import { useAuth } from '@/providers/auth-provider';
import { Loader2 } from 'lucide-react';
import Page404 from "../error-pages/404";

/**
 * Higher-order component that restricts access to components based on user role
 * @param WrappedComponent The component to wrap with role-based authentication
 * @param requiredRole The role name required to access the component
 * @returns A new component that renders the wrapped component or NotFound based on user role
 */
const withRole = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole: string
) => {
  const RoleRestrictedComponent = (props: P) => {
    const { user, isAuthenticated, login } = useAuth();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const checkUserRole = async () => {
        const isAuthenticatedRes = await isAuthenticated();
        if (isAuthenticatedRes) {
          await login();
        }
        setLoading(false);
      }

      if (!user) {
        checkUserRole();
      } else {
        setLoading(false);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    // Show loading state
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen w-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    
    // Check if user exists and has the required role
    if (user && user!.id && user.role.name === requiredRole) {
      return <WrappedComponent {...props} />;
    }
    
    // Otherwise show 404/unauthorized component
    return <Page404 />;
  };

  return RoleRestrictedComponent;
};

export default withRole;