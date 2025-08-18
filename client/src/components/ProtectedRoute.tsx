import { useEffect } from "react";
import { useLocation } from "wouter";
import { authUtils } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      setLocation("/admin");
    }
  }, [setLocation]);

  // If not authenticated, don't render anything (redirect will happen)
  if (!authUtils.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};
