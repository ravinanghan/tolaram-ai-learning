import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/Button';
import MobileNav from '@/components/MobileNav';
import { Moon, Sun, LogOut, Menu } from 'lucide-react';
import logoImage from '@/assets/logo.png';

interface NavbarProps {
    onSidebarToggle?: () => void;
    sidebarOpen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle, sidebarOpen = false }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
            // Optional: Add success notification here
        } catch (error) {
            console.error('Logout failed:', error);
            // Optional: Add error notification here
        }
    };

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 px-4 sm:px-6 py-4 sticky top-0 z-50">
            <div className="flex items-center justify-between">
                {/* Left Section - Logo and Mobile Menu */}
                <div className="flex items-center space-x-4">
                    {/* Mobile Sidebar Toggle */}
                    {onSidebarToggle && (
                        <motion.button
                            onClick={onSidebarToggle}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            <motion.div
                                animate={{ rotate: sidebarOpen ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </motion.div>
                        </motion.button>
                    )}
                    
                    {/* Logo Section */}
                    <motion.img
                        src={logoImage}
                        alt="Tolaram Learning Logo"
                        className="h-10 object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    />
                </div>

                {/* Welcome Message */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex-1 text-center hidden lg:block"
                >
                    <motion.h1
                        className="text-lg font-semibold text-gray-800 dark:text-white"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        Welcome, {user?.name || 'Guest'}!
                    </motion.h1>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center space-x-2 sm:space-x-4"
                >
                    {/* Enhanced Theme Toggle */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleTheme}
                            className="p-2 hidden sm:flex relative overflow-hidden group"
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {/* Button background animation */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 rounded-md"
                                transition={{ duration: 0.3 }}
                            />
                            <motion.div
                                animate={{ rotate: theme === 'light' ? 0 : 180 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10"
                            >
                                {theme === 'light' ? (
                                    <Moon className="w-5 h-5" />
                                ) : (
                                    <Sun className="w-5 h-5" />
                                )}
                            </motion.div>
                        </Button>
                    </motion.div>

                    {/* Enhanced Logout Button */}
                    <motion.div
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden sm:flex items-center space-x-2 hover:dark:text-white relative overflow-hidden group border-2 hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300"
                        >
                            {/* Button background animation */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100"
                                transition={{ duration: 0.3 }}
                            />
                            <LogOut className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">
                                {user ? 'Logout' : 'Login'}
                            </span>
                        </Button>
                    </motion.div>

                    {/* Mobile Navigation */}
                    <MobileNav />
                </motion.div>
            </div>
        </nav>
    );
};

export default Navbar;