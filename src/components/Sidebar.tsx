import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import RadialProgress from './RadialProgress';
import { CheckCircle, Lock, Play, BookOpen, Home, Clock } from 'lucide-react';
import { isWeekTimeLocked, getWeekLockInfo } from '@/utils/weekLocking';
import modulesData from '../data/modules.json';
import type { Module } from '@/types/global';

interface SidebarProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

interface ModuleItemProps {
  module: Module;
  index: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
  onNavigate?: ((path: string) => void) | undefined;
}

const ModuleItem: React.FC<ModuleItemProps> = ({ 
  module, 
  index, 
  isUnlocked, 
  isCompleted, 
  isActive, 
  onNavigate 
}) => {
  const isTimeLocked = isWeekTimeLocked(module.id);
  const lockInfo = isTimeLocked ? getWeekLockInfo(module.id) : null;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isUnlocked && !isTimeLocked && onNavigate) {
      onNavigate(`/week/${module.id}`);
    } else if (isTimeLocked && onNavigate) {
      // Allow navigation to locked week to show countdown
      onNavigate(`/week/${module.id}`);
    }
  };

  const itemClasses = `
    flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
    ${isActive 
      ? 'border-primary-500 bg-primary-100 dark:border-primary-400 dark:bg-primary-900/30 shadow-lg' 
      : isCompleted
      ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600'
      : isTimeLocked
      ? 'border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600'
      : isUnlocked
      ? 'border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-600'
      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 cursor-not-allowed'
    }
    ${(isUnlocked && !isTimeLocked) || isTimeLocked ? 'transform hover:scale-[1.02] hover:shadow-md' : ''}
  `;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={itemClasses}
      onClick={handleClick}
      whileHover={(isUnlocked && !isTimeLocked) || isTimeLocked ? { y: -1 } : {}}
      whileTap={(isUnlocked && !isTimeLocked) || isTimeLocked ? { scale: 0.98 } : {}}
    >
      <div className="flex-shrink-0 mr-3">
        {isCompleted ? (
          <CheckCircle className="w-6 h-6 text-green-600" />
        ) : isTimeLocked ? (
          <div className="relative">
            <Clock className="w-6 h-6 text-orange-500" />
            {lockInfo && lockInfo.daysRemaining < 7 && (
              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {lockInfo.daysRemaining}
              </div>
            )}
          </div>
        ) : isUnlocked ? (
          <Play className={`w-6 h-6 ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-primary-600'}`} />
        ) : (
          <Lock className="w-6 h-6 text-gray-400" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold ${
          isActive
            ? 'text-primary-900 dark:text-primary-100'
            : isCompleted
            ? 'text-green-800 dark:text-green-200'
            : isTimeLocked
            ? 'text-orange-800 dark:text-orange-200'
            : isUnlocked
            ? 'text-primary-800 dark:text-primary-200'
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          Week {module.id}
        </div>
        <div className={`text-xs truncate ${
          isActive
            ? 'text-primary-700 dark:text-primary-300'
            : isCompleted
            ? 'text-green-600 dark:text-green-300'
            : isTimeLocked
            ? 'text-orange-600 dark:text-orange-300'
            : isUnlocked
            ? 'text-primary-600 dark:text-primary-300'
            : 'text-gray-400 dark:text-gray-500'
        }`}>
          {isTimeLocked && lockInfo ? lockInfo.countdownText : module.title}
        </div>
      </div>

      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-2 h-2 bg-primary-500 rounded-full ml-2"
        />
      )}
    </motion.div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPath = '' }) => {
  const { isModuleUnlocked, isModuleCompleted, getOverallProgress } = useProgress();
  
  const modules = modulesData.modules as Module[];

  // Determine active module from current path
  const activeModuleId = useMemo(() => {
    // Extract week ID from current path
    const weekMatch = currentPath.match(/\/week\/(\d+)/);
    return weekMatch && weekMatch[1] ? parseInt(weekMatch[1]) : null;
  }, [currentPath]);

  // Quick navigation items
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      isActive: currentPath === '/dashboard'
    },
    {
      label: 'AI Timeline',
      path: '/ai-timeline',
      icon: BookOpen,
      isActive: currentPath === '/ai-timeline'
    }
  ];

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-6">
        {/* Quick Navigation */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Quick Navigation
          </h3>
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                    ${item.isActive 
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${item.isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Program Timeline
          </h2>
          <RadialProgress 
            progress={getOverallProgress()} 
            size={100} 
            strokeWidth={6}
            className="mx-auto"
          />
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {Math.round(getOverallProgress())}% Complete
          </p>
        </div>

        {/* Modules List */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Weekly Modules
          </h3>
          <div className="space-y-3">
            {modules.map((module, index) => {
              const isUnlocked = isModuleUnlocked(module.id);
              const isCompleted = isModuleCompleted(module.id);
              const isActive = activeModuleId === module.id;
              
              return (
                <ModuleItem
                  key={module.id}
                  module={module}
                  index={index}
                  isUnlocked={isUnlocked}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        </div>

        {/* Learning Tip */}
        <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
            Learning Tip
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Consistent daily practice leads to long-term retention. Take your time with each module!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;