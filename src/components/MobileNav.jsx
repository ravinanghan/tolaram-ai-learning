import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { useProgress } from '../context/ProgressContext';
import Button from './Button';
import RadialProgress from './RadialProgress';
import { Menu, X, Moon, Sun, LogOut, BookOpen, CheckCircle, Lock, Play } from 'lucide-react';
import modulesData from '../data/modules.json';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isModuleUnlocked, isModuleCompleted, getOverallProgress } = useProgress();
  
  const modules = modulesData.modules;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="lg:hidden p-2"
        aria-label="Toggle mobile menu"
      >
        <Menu className="w-6 h-6" />
      </Button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <img src="./src/assets/logo.png" alt="Tolaram Logo" className="h-8" />
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">
                      {user?.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMenu}
                    className="p-2"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Progress Section */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
                    Overall Progress
                  </h3>
                  <div className="flex justify-center">
                    <RadialProgress 
                      progress={getOverallProgress()} 
                      size={80} 
                      strokeWidth={4}
                    />
                  </div>
                </div>

                {/* Modules List */}
                <div className="flex-1 overflow-y-auto p-6">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
                    Modules
                  </h3>
                  <div className="space-y-3">
                    {modules.map((module, index) => {
                      const isUnlocked = isModuleUnlocked(module.id);
                      const isCompleted = isModuleCompleted(module.id);
                      
                      return (
                        <motion.div
                          key={module.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                            isCompleted
                              ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                              : isUnlocked
                              ? 'border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20'
                              : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                          }`}
                        >
                          <div className="flex-shrink-0 mr-3">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : isUnlocked ? (
                              <Play className="w-5 h-5 text-primary-600" />
                            ) : (
                              <Lock className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-semibold ${
                              isCompleted
                                ? 'text-green-800 dark:text-green-200'
                                : isUnlocked
                                ? 'text-primary-800 dark:text-primary-200'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              Week {module.id}
                            </div>
                            <div className={`text-xs truncate ${
                              isCompleted
                                ? 'text-green-600 dark:text-green-300'
                                : isUnlocked
                                ? 'text-primary-600 dark:text-primary-300'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {module.title}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="w-full justify-start"
                    icon={theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  >
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start hover:dark:text-white"
                    icon={<LogOut className="w-4 h-4" />}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
