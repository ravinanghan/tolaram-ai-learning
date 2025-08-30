import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProgress } from '@/context/ProgressContext';
import { useNavigation } from '@/context/NavigationContext';
import { useParams } from 'react-router-dom';

const ModuleDiagnostic: React.FC = () => {
  const { weekId } = useParams<{ weekId: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { progress, isModuleUnlocked } = useProgress();
  const { currentPath } = useNavigation();
  
  const moduleId = parseInt(weekId || '1');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Module Loading Diagnostic</h1>
        
        <div className="grid gap-6">
          {/* Authentication Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Authentication</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Auth Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
              <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'Not logged in'}</p>
            </div>
          </div>

          {/* Route Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Route Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Week ID (from URL):</strong> {weekId}</p>
              <p><strong>Module ID (parsed):</strong> {moduleId}</p>
              <p><strong>Current Path:</strong> {currentPath}</p>
            </div>
          </div>

          {/* Progress Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Progress Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Current Module:</strong> {progress.currentModule}</p>
              <p><strong>Current Step:</strong> {progress.currentStep}</p>
              <p><strong>Completed Modules:</strong> {JSON.stringify(progress.completedModules)}</p>
              <p><strong>Module Progress:</strong> {JSON.stringify(progress.moduleProgress, null, 2)}</p>
              <p><strong>Is Module {moduleId} Unlocked:</strong> {isModuleUnlocked(moduleId) ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
              >
                Go to Login
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear Storage & Reload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDiagnostic;