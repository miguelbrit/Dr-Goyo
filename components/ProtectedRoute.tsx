import React, { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  currentRole: string;
  onRedirect: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  currentRole,
  onRedirect
}) => {
  useEffect(() => {
    if (!allowedRoles.includes(currentRole)) {
      onRedirect();
    }
  }, [currentRole, allowedRoles, onRedirect]);

  if (!allowedRoles.includes(currentRole)) {
    return null; // Or a loading spinner while redirecting
  }

  return <>{children}</>;
};