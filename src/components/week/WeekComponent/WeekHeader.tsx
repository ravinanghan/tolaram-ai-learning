import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import PageHeader from '@/components/common/PageHeader';
import AudioPlayer from '@/components/common/AudioPlayer';
import ProgressBar from '@/components/ProgressBar';

interface WeekHeaderProps {
    weekNumber: number;
    title: string;
    description: string;
    currentStep: number;
    totalSteps: number;
    progress: number; // 0-100
    onBack?: (() => void) | undefined;
}

const WeekHeader: React.FC<WeekHeaderProps> = ({
    weekNumber,
    title,
    description,
    progress,
    onBack
}) => {
    const navigate = useNavigate();

    const handleBack = (e?: React.MouseEvent) => {
        // Prevent default if event is provided (for links)
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log('WeekHeader: handleBack called', { onBack: !!onBack });
        if (onBack) {
            console.log('WeekHeader: Executing onBack callback');
            onBack();
        } else {
            console.log('WeekHeader: No onBack provided, navigating to dashboard');
            navigate('/dashboard');
        }
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 mb-6"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-4"
                >
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="flex items-center gap-2 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                </motion.div>

                {/* Week Info */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex-1"
                    >
                        <PageHeader
                            title={`Week ${weekNumber}: ${title}`}
                            description={description}
                        />
                        {/* Audio Overview - Only show for weeks that have audio */}
                        {weekNumber <= 6 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mb-4"
                            >
                                <AudioPlayer
                                    src={`/assets/week${weekNumber}AudioOverview.mp3`}
                                    title={`Week ${weekNumber} Audio Overview`}
                                    className="max-w-md"
                                />
                            </motion.div>
                        )}
                        <ProgressBar progress={progress} showLabel className="mb-2" />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="text-xs text-gray-500 dark:text-gray-400"
                        >
                            {progress >= 100 ? 'Week completed! 🎉' : `${progress}% complete • Keep going!`}
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
};

export default WeekHeader;