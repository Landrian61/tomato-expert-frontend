import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, isOffline } = useAuth();

  // Development mode bypass for testing dashboard components
  const isDevelopment = import.meta.env.MODE === 'development';
  
  // Show loading state while checking authentication
  if (loading && !isDevelopment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login (except in development mode)
  if (!isAuthenticated && !isDevelopment) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes with offline banner if needed
  return (
    <>
      {isOffline && (
        <Alert variant="destructive" className="mb-4 border-amber-500 bg-amber-50">
          <WifiOff className="h-4 w-4 mr-2" />
          <AlertDescription>
            You're currently offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
