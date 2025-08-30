import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import AuthLayout from '@/layouts/AuthLayout';
import { ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import logoImage from '@/assets/logo.png';
// Interface for location state
interface LoginLocationState {
    from?: {
        pathname: string;
    };
}

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Type-safe location state access
    const locationState = location.state as LoginLocationState | null;
    const from = locationState?.from?.pathname || '/dashboard';

    const handleGoHome = (): void => {
        navigate('/');
    };

    const handleLogin = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            await login();
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
            setError('Failed to log in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <Card className="flex flex-col items-center justify-center h-full w-full text-center relative">
                    {/* Back to Home Button */}
                    <motion.button
                        onClick={handleGoHome}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group"
                        aria-label="Back to Home"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200" />
                    </motion.button>
                    {/* Logo section */}

                    <motion.img
                        src={logoImage}
                        alt="Tolaram Learning Logo"
                        className="h-14 object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Title and description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                             Learning Platform
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Your personalized learning journey starts here. Unlock your potential with our structured 6-week program.
                        </p>
                    </motion.div>

                    {/* Stats grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                    <span className="text-primary-600 dark:text-primary-400 font-bold">6</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Weeks</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                    <span className="text-secondary-600 dark:text-secondary-400 font-bold">24</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Lessons</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                    <span className="text-green-600 dark:text-green-400 font-bold">∞</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Growth</p>
                            </div>
                        </div>

                        {/* Error display */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2"
                            >
                                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                            </motion.div>
                        )}

                        {/* Login button */}
                        <Button
                            onClick={handleLogin}
                            size="lg"
                            className="w-full group"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            <span>{isLoading ? 'Starting...' : 'Start Your Journey'}</span>
                            {!isLoading && (
                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            )}
                        </Button>
                    </motion.div>

                    {/* Footer info */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 text-xs text-gray-500 dark:text-gray-400"
                    >
                        No account needed • Progress automatically saved • Free to use
                    </motion.p>
                </Card>
            </motion.div>
        </AuthLayout>
    );
};

export default Login;