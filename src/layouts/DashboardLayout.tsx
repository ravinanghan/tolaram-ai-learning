import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouteTransition } from '@/hooks/useRouteTransition';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Loading from '@/components/Loading';
import { ANIMATIONS } from '@/constants/design';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface LayoutState {
  sidebarOpen: boolean;
}

// Extracted Error Display Component
const ErrorDisplay: React.FC<{
  error: string;
  onDismiss: () => void;
}> = ({ error, onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md m-4"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">{error}</p>
      <button
        onClick={onDismiss}
        className="text-xs underline hover:no-underline ml-4"
      >
        Dismiss
      </button>
    </div>
  </motion.div>
);

// Extracted Loading Overlay Component
const LoadingOverlay: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm z-10 flex items-center justify-center"
  >
    <Loading text="Loading..." />
  </motion.div>
);

// Extracted Mobile Backdrop Component
const MobileBackdrop: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
    )}
  </AnimatePresence>
);

// Extracted Sidebar Container Component
const SidebarContainer: React.FC<{
  isMobile: boolean;
  isOpen: boolean;
  onNavigate: (path: string) => void;
  currentPath: string;
}> = ({ isMobile, isOpen, onNavigate, currentPath }) => (
  <motion.div
    initial={false}
    animate={{
      x: isMobile ? (isOpen ? 0 : -320) : 0,
      opacity: isMobile ? (isOpen ? 1 : 0) : 1
    }}
    transition={{
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
      opacity: { duration: isMobile ? 0.2 : 0 }
    }}
    className={`
      w-80 flex-shrink-0 z-50
      ${isMobile
        ? 'fixed left-0 top-[80px] h-[calc(100vh-80px)]'
        : 'hidden lg:block'
      }
    `}
  >
    <Sidebar onNavigate={onNavigate} currentPath={currentPath} />
  </motion.div>
);

// Extracted Main Content Component
const MainContent: React.FC<{
  children: React.ReactNode;
  currentPath: string;
  isTransitioning: boolean;
}> = ({ children, currentPath, isTransitioning }) => (
  <motion.div
    key={currentPath}
    initial={ANIMATIONS.pageTransition.initial}
    animate={ANIMATIONS.pageTransition.animate}
    exit={ANIMATIONS.pageTransition.exit}
    transition={{
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
      delay: isTransitioning ? 0.1 : 0
    }}
    className="p-4 sm:p-6 min-h-full"
  >
    <div className="max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${currentPath}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  </motion.div>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 1023px)');

  // Memoized callbacks to prevent infinite re-renders
  const handleRouteChange = useCallback((newPath: string, previousPath: string | null) => {
    console.log(`Route changed from ${previousPath} to ${newPath}`);
  }, []);

  const handleRouteError = useCallback((error: Error) => {
    console.error('Route transition error:', error);
  }, []);

  const {
    isTransitioning,
    error,
    navigate,
    clearError,
    currentPath
  } = useRouteTransition({
    transitionDelay: 150,
    onRouteChange: handleRouteChange,
    onError: handleRouteError
  });

  const [layoutState, setLayoutState] = useState<LayoutState>({
    sidebarOpen: false
  });

  // Handle sidebar toggle
  const toggleSidebar = useCallback(() => {
    setLayoutState(prev => ({
      ...prev,
      sidebarOpen: !prev.sidebarOpen
    }));
  }, []);

  // Handle navigation with error handling
  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    if (isMobile) {
      setLayoutState(prev => ({ ...prev, sidebarOpen: false }));
    }
  }, [navigate, isMobile]);

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    if (isMobile) {
      setLayoutState(prev => ({ ...prev, sidebarOpen: false }));
    }
  }, [currentPath, isMobile]);

  // Handle backdrop close
  const handleBackdropClose = useCallback(() => {
    setLayoutState(prev => ({ ...prev, sidebarOpen: false }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar onSidebarToggle={toggleSidebar} sidebarOpen={layoutState.sidebarOpen} />

      <div className="flex h-[calc(100vh-80px)] relative">
        {/* Mobile Sidebar Backdrop */}
        <MobileBackdrop
          isVisible={isMobile && layoutState.sidebarOpen}
          onClose={handleBackdropClose}
        />

        {/* Sidebar Container */}
        <SidebarContainer
          isMobile={isMobile}
          isOpen={layoutState.sidebarOpen}
          onNavigate={handleNavigation}
          currentPath={currentPath}
        />

        {/* Main Content Container */}
        <motion.main
          className="flex-1 overflow-y-auto relative"
          initial={false}
          animate={{
            opacity: isTransitioning ? 0.7 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Error State */}
          <AnimatePresence>
            {error && (
              <ErrorDisplay error={error} onDismiss={clearError} />
            )}
          </AnimatePresence>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isTransitioning && <LoadingOverlay />}
          </AnimatePresence>

          {/* Main Content */}
          <MainContent
            currentPath={currentPath}
            isTransitioning={isTransitioning}
          >
            {children}
          </MainContent>
        </motion.main>

      </div>
    </div>
  );
};

export default DashboardLayout;