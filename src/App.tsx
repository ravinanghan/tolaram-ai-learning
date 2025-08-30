import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { NavigationProvider } from '@/context/NavigationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';
import Loading from '@/components/Loading';


// Lazy load pages for better performance
const Login = lazy(() => import('@/pages/auth/Login'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Timeline = lazy(() => import('@/pages/timeline/Timeline'));
const Landing = lazy(() => import('@/pages/Landing'));
const ModuleDiagnostic = lazy(() => import('@/components/ModuleDiagnostic'));

// Week routing component
const WeekRouter = lazy(() => import('@/components/weeks/WeekRouter'));

// Enhanced loading component for route transitions
const RouteLoadingFallback: React.FC<{ text?: string }> = ({ text = "Loading page..." }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <Loading fullScreen text={text} />
  </div>
);

// Navigation wrapper that provides navigation context to all child components
const NavigationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <NavigationProvider navigate={handleNavigation} currentPath={location.pathname}>
      {children}
    </NavigationProvider>
  );
};

// Route wrapper with error boundary
const RouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteErrorBoundary>
    <Suspense fallback={<RouteLoadingFallback />}>
      {children}
    </Suspense>
  </RouteErrorBoundary>
);

const App: React.FC = () => {


  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProgressProvider>
          <Router>
            <NavigationWrapper>
              <Routes>
              <Route 
                path="/" 
                element={
                  <RouteWrapper>
                    <Landing />
                  </RouteWrapper>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <RouteWrapper>
                    <Login />
                  </RouteWrapper>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <RouteWrapper>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </RouteWrapper>
                } 
              />
              <Route 
                path="/ai-timeline" 
                element={
                  <RouteWrapper>
                    <ProtectedRoute>
                      <Timeline />
                    </ProtectedRoute>
                  </RouteWrapper>
                } 
              />
              {/* Dynamic week routes */}
              <Route 
                path="/week/:weekId" 
                element={
                  <RouteWrapper>
                    <ProtectedRoute>
                      <WeekRouter />
                    </ProtectedRoute>
                  </RouteWrapper>
                } 
              />
              <Route 
                path="/debug" 
                element={
                  <RouteWrapper>
                    <ModuleDiagnostic />
                  </RouteWrapper>
                } 
              />
              {/* Catch-all route for 404 */}
              <Route 
                path="*" 
                element={
                  <RouteWrapper>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Page not found</p>
                        <button 
                          onClick={() => window.location.href = '/dashboard'}
                          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    </div>
                  </RouteWrapper>
                } 
              />
              </Routes>
            </NavigationWrapper>
          </Router>
        </ProgressProvider>
      </AuthProvider>

    </ErrorBoundary>
  );
};

export default App;