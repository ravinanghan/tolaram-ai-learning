import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import AuthLayout from '@/layouts/AuthLayout';
import { ArrowRight, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import logoImage from '@/assets/logo.png';

// Interface for location state
interface LoginLocationState {
    from?: {
        pathname: string;
    };
}

const Login: React.FC = () => {
    const { login, register, error: authError, clearError } = useAuth() as any;
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });

    // Type-safe location state access
    const locationState = location.state as LoginLocationState | null;
    const from = locationState?.from?.pathname || '/dashboard';

    const handleGoHome = (): void => {
        navigate('/');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors when user starts typing
        if (localError) setLocalError(null);
        if (authError) clearError();
    };

    const validateForm = (): boolean => {
        if (!formData.email || !formData.password) {
            setLocalError('Please fill in all required fields');
            return false;
        }

        if (isRegisterMode) {
            if (!formData.name) {
                setLocalError('Please enter your name');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setLocalError('Passwords do not match');
                return false;
            }
            if (formData.password.length < 6) {
                setLocalError('Password must be at least 6 characters long');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setIsLoading(true);
            setLocalError(null);
            clearError();

            if (isRegisterMode) {
                await register({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name
                });
            } else {
                await login({
                    email: formData.email,
                    password: formData.password
                });
            }

            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
            // Error is handled by the auth context
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setFormData({
            email: '',
            password: '',
            name: '',
            confirmPassword: ''
        });
        setLocalError(null);
        clearError();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const currentError = localError || authError;
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
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            {isRegisterMode 
                                ? 'Join thousands of learners on their AI journey'
                                : 'Continue your personalized learning journey'
                            }
                        </p>
                    </motion.div>

                    {/* Login/Register Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name field (register only) */}
                            {isRegisterMode && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            )}

                            {/* Email field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            {/* Password field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password field (register only) */}
                            {isRegisterMode && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            )}

                        {/* Error display */}
                        {currentError && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2"
                            >
                                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <span className="text-sm text-red-600 dark:text-red-400">{currentError}</span>
                            </motion.div>
                        )}

                        {/* Submit button */}
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full group"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            <span>
                                {isLoading 
                                    ? (isRegisterMode ? 'Creating Account...' : 'Signing In...') 
                                    : (isRegisterMode ? 'Create Account' : 'Sign In')
                                }
                            </span>
                            {!isLoading && (
                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            )}
                        </Button>
                        </form>

                        {/* Toggle between login/register */}
                        <div className="text-center">
                            <button
                                onClick={toggleMode}
                                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                            >
                                {isRegisterMode 
                                    ? 'Already have an account? Sign in' 
                                    : "Don't have an account? Create one"
                                }
                            </button>
                        </div>
                    </motion.div>

                    {/* Footer info */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 text-xs text-gray-500 dark:text-gray-400"
                    >
                        Progress automatically saved • Secure authentication • Free to use
                    </motion.p>
                </Card>
            </motion.div>
        </AuthLayout>
    );
};

export default Login;