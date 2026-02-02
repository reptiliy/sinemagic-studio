import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const location = useLocation();
  const [showDebug, setShowDebug] = React.useState(false);
  const [forceProceed, setForceProceed] = React.useState(false);

  React.useEffect(() => {
    // Show debug info after 3s
    const debugTimer = setTimeout(() => setShowDebug(true), 3000);
    // Force proceed after 5s if still loading
    const forceTimer = setTimeout(() => {
      console.warn("ProtectedRoute: Forcing proceed after timeout");
      setForceProceed(true);
    }, 5000);
    
    return () => {
      clearTimeout(debugTimer);
      clearTimeout(forceTimer);
    };
  }, []);

  // Use effective loading state
  const isLoading = authLoading && !forceProceed;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-purple mb-4"></div>
        {showDebug && (
          <div className="text-center animate-in fade-in">
            <p className="mb-4 text-gray-400">Загрузка данных пользователя...</p>
            <div className="text-xs text-gray-600 mb-4">
               Если это длится долго, мы попробуем продолжить автоматически.
            </div>
          </div>
        )}
      </div>
    );
  }

  // If forced proceed and no user, we will redirect below
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
