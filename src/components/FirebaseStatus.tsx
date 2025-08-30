import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useProgress } from '@/context/ProgressContext';
import { Wifi, WifiOff, Cloud, CloudOff, User, Database } from 'lucide-react';

interface FirebaseStatusProps {
  className?: string;
  showDetails?: boolean;
}

const FirebaseStatus: React.FC<FirebaseStatusProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const { user, isAuthenticated } = useAuth();
  const firebaseProgress = (useProgress() as any);
  
  const isOnline = navigator.onLine;
  const lastSyncTime = firebaseProgress.lastSyncTime;

  const formatLastSync = (timestamp: number | null): string => {
    if (!timestamp) return 'Never';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Online Status */}
        <div className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`} />
        
        {/* Sync Status */}
        {isAuthenticated && (
          <div className={`w-2 h-2 rounded-full ${
            lastSyncTime ? 'bg-blue-500' : 'bg-yellow-500'
          }`} />
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}
    >
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Connection Status
      </h4>
      
      <div className="space-y-3">
        {/* Network Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Network
            </span>
          </div>
          <span className={`text-xs font-medium ${
            isOnline ? 'text-green-600' : 'text-red-600'
          }`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Authentication Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className={`w-4 h-4 ${
              isAuthenticated ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Authentication
            </span>
          </div>
          <span className={`text-xs font-medium ${
            isAuthenticated ? 'text-blue-600' : 'text-gray-400'
          }`}>
            {isAuthenticated ? 'Signed In' : 'Guest'}
          </span>
        </div>

        {/* Sync Status */}
        {isAuthenticated && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {lastSyncTime ? (
                <Cloud className="w-4 h-4 text-blue-600" />
              ) : (
                <CloudOff className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Last Sync
              </span>
            </div>
            <span className={`text-xs font-medium ${
              lastSyncTime ? 'text-blue-600' : 'text-yellow-600'
            }`}>
              {formatLastSync(lastSyncTime)}
            </span>
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <div>ID: {user.id.substring(0, 8)}...</div>
              <div>Email: {user.email}</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FirebaseStatus;