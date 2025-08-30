import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import { ArrowUp, Sparkles, Users, Award, BookOpen } from 'lucide-react';

const Landing: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        setIsVisible(true);

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLoginClick = (): void => {
        navigate('/login');
    };

    const scrollToTop = (): void => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const features = [
        {
            icon: "6",
            title: "6 Structured Weeks",
            description: "Comprehensive curriculum designed to take you from beginner to AI-literate professional",
            iconBgColor: "bg-primary-100 dark:bg-primary-900",
            iconTextColor: "text-primary-600 dark:text-primary-400",
            hoverColor: "hover:bg-primary-50 dark:hover:bg-primary-800/50"
        },
        {
            icon: "24",
            title: "Interactive Lessons",
            description: "Engaging content with quizzes, practical exercises, and real-world applications",
            iconBgColor: "bg-secondary-100 dark:bg-secondary-900",
            iconTextColor: "text-secondary-600 dark:text-secondary-400",
            hoverColor: "hover:bg-secondary-50 dark:hover:bg-secondary-800/50"
        },
        {
            icon: "∞",
            title: "Unlimited Growth",
            description: "Continue your learning journey with lifetime access to updated content and resources",
            iconBgColor: "bg-green-100 dark:bg-green-900",
            iconTextColor: "text-green-600 dark:text-green-400",
            hoverColor: "hover:bg-green-50 dark:hover:bg-green-800/50"
        }
    ];

    const stats = [
        { icon: Users, label: "Active Learners", value: "2,500+", color: "text-blue-600 dark:text-blue-400" },
        { icon: Award, label: "Success Rate", value: "95%", color: "text-green-600 dark:text-green-400" },
        { icon: BookOpen, label: "Modules Completed", value: "15,000+", color: "text-purple-600 dark:text-purple-400" }
    ];

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 overflow-x-hidden relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    style={{ opacity }}
                    className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-primary-200/20 to-secondary-200/20 dark:from-primary-800/10 dark:to-secondary-800/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 right-10 w-96 h-96 bg-gradient-to-l from-green-200/15 to-blue-200/15 dark:from-green-800/8 dark:to-blue-800/8 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 0.8, 1.1, 1],
                        x: [0, 50, -30, 0]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.6, 1]
                    }}
                />

                {/* Floating sparkles */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${10 + (i * 12)}%`,
                            top: `${20 + (i * 8)}%`
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                            duration: 3 + (i * 0.5),
                            repeat: Infinity,
                            ease: [0.4, 0, 0.6, 1],
                            delay: i * 0.3
                        }}
                    >
                        <Sparkles className="w-4 h-4 text-primary-400/40 dark:text-primary-300/30" />
                    </motion.div>
                ))}
            </div>

            <Navbar />

            <main className="px-4 sm:px-6 relative z-10 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="pt-8"
                    >
                        <HeroSection onButtonClick={handleLoginClick} />
                    </motion.div>

                    {/* Enhanced Statistics Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8, ease: [0.4, 0, 0.6, 1] }}
                        className="mt-24 mb-24"
                    >
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.6, ease: [0.4, 0, 0.6, 1] }}
                        >
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                Join Our Growing Community
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Be part of a thriving ecosystem of learners and achievers
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {stats.map((stat, index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{
                                            delay: 1.0 + (index * 0.2),
                                            duration: 0.6,
                                            ease: [0.4, 0, 0.6, 1]
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                            y: -5,
                                            transition: { duration: 0.2 }
                                        }}
                                        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                    >
                                        <motion.div
                                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 mb-4 shadow-md group-hover:shadow-lg transition-all duration-300"
                                            whileHover={{ rotate: 10 }}
                                        >
                                            <IconComponent className={`w-8 h-8 ${stat.color}`} />
                                        </motion.div>
                                        <motion.h3
                                            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.2 + (index * 0.2) }}
                                        >
                                            {stat.value}
                                        </motion.h3>
                                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                                            {stat.label}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>

                    {/* Enhanced Features Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="mt-24 mb-24"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-primary-700 to-gray-800 dark:from-white dark:via-primary-300 dark:to-white bg-clip-text text-transparent mb-4">
                                Why Choose Our Platform?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Discover the features that make learning engaging and effective
                            </p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.6 + (index * 0.2), duration: 0.6 }}
                                    whileHover={{
                                        scale: 1.03,
                                        y: -8,
                                        transition: { duration: 0.3 }
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group cursor-pointer"
                                >
                                    <FeatureCard
                                        icon={feature.icon}
                                        title={feature.title}
                                        description={feature.description}
                                        iconBgColor={feature.iconBgColor}
                                        iconTextColor={feature.iconTextColor}
                                        className={`h-full transition-all duration-300 ${feature.hoverColor} group-hover:shadow-2xl group-hover:border-primary-200 dark:group-hover:border-primary-700`}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.section>

                    {/* Call to Action Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.8, ease: [0.4, 0, 0.6, 1] }}
                        className="mt-32 mb-32 text-center"
                    >
                        <motion.div
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-12 text-white relative overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-10">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-32 h-32 border border-white rounded-full"
                                        style={{
                                            left: `${10 + (i * 15)}%`,
                                            top: `${-10 + (i % 2) * 20}%`
                                        }}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.1, 0.3, 0.1]
                                        }}
                                        transition={{
                                            duration: 4 + (i * 0.5),
                                            repeat: Infinity,
                                            ease: [0.4, 0, 0.6, 1],
                                            delay: i * 0.5
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="relative z-10">
                                <motion.h3
                                    className="text-3xl font-bold mb-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.8 }}
                                >
                                    Ready to Transform Your Future?
                                </motion.h3>
                                <motion.p
                                    className="text-xl mb-8 opacity-90"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.0 }}
                                >
                                    Join thousands of learners who have already started their AI journey
                                </motion.p>
                                <motion.button
                                    onClick={handleLoginClick}
                                    className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 2.2 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Start Learning Today
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.section>

                    {/* Footer Section */}
                    <motion.footer
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.4, duration: 0.8 }}
                        className="mt-32 text-center"
                    >
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                © 2025 Tolaram Learning Platform. All rights reserved.
                            </p>
                        </div>
                    </motion.footer>
                </div>
            </main>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-200" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Landing;