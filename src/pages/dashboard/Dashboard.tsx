import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/context/ProgressContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { ANIMATIONS } from '@/constants/design';
import modulesData from '@/data/modules.json';
import { Play, Download, Clock, CheckCircle, Lock, Check, Calendar } from 'lucide-react';
import { isWeekTimeLocked, getWeekLockInfo } from '@/utils/weekLocking';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import HeroAI from '@/components/HeroAI';
import PageHeader from '@/components/common/PageHeader';
import type { ModulesData, Module } from '@/types/global';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const {
        isModuleUnlocked,
        isModuleCompleted,
        getModuleProgress,
        hasInProgress,
        getCurrentPosition,
        getNextIncompleteStep
    } = useProgress();

    const typedModulesData = modulesData as ModulesData;
    const modules: Module[] = typedModulesData.modules;

    // Get current position for Resume Learning
    const currentPosition = getCurrentPosition();
    const hasActiveProgress = hasInProgress() && !isModuleCompleted(currentPosition.moduleId);

    const handleModuleClick = (moduleId: number): void => {
        // Allow navigation to time-locked weeks to show countdown
        const isTimeLocked = isWeekTimeLocked(moduleId);
        if (isModuleUnlocked(moduleId) || isTimeLocked) {
            navigate(`/week/${moduleId}`);
        }
    };

    const handleResumeClick = (): void => {
        const position = getCurrentPosition();
        navigate(`/week/${position.moduleId}`);
    };

    const handleDownloadBriefing = (moduleId: number): void => {
        if (moduleId === 1) {
            // Download Week 1 PDF briefing
            const link = document.createElement('a');
            link.href = '/assets/week1TheAILexicon.pdf';
            link.download = 'Week1-TheAILexicon-Briefing.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // For other weeks, show a coming soon message
            console.log(`Briefing for Week ${moduleId} will be available soon`);
        }
    };

    return (
        <DashboardLayout>
            <TooltipProvider>
            <motion.div
                key="dashboard-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <HeroAI />

                <motion.div
                    initial={ANIMATIONS.pageTransition.initial}
                    animate={ANIMATIONS.pageTransition.animate}
                    exit={ANIMATIONS.pageTransition.exit}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="mb-8"
                >
                    <PageHeader
                        title="Weekly Modules"
                        description="Progress through our carefully structured learning program at your own pace."
                    />
                </motion.div>

                {hasActiveProgress && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <Card
                            variant="primary"
                            className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                            Resume Learning
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Continue from Week {currentPosition.moduleId}, Step {currentPosition.stepId}
                                        </p>
                                        <div className="mt-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>Progress: {getModuleProgress(currentPosition.moduleId)}%</span>
                                                {(() => {
                                                    const nextStep = getNextIncompleteStep(currentPosition.moduleId);
                                                    return nextStep ? (
                                                        <span>• Next: Step {nextStep}</span>
                                                    ) : (
                                                        <span>• Ready to complete!</span>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div>
                                            <Button
                                                onClick={handleResumeClick}
                                                icon={<Play className="w-4 h-4" />}
                                                className="sm:w-auto"
                                            >
                                                Continue
                                            </Button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Resume from your last step
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Quick Navigation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <Card className="bg-white dark:bg-gray-800">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Navigation</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Jump to your main actions.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={() => handleModuleClick(1)}
                                    variant="gradient"
                                    icon={<Play className="w-4 h-4" />}
                                >
                                    Enter Week 1
                                </Button>
                                <Button
                                    onClick={handleResumeClick}
                                    variant="outline"
                                    disabled={!hasActiveProgress}
                                >
                                    {hasActiveProgress ? `Resume Week ${currentPosition.moduleId}, Step ${currentPosition.stepId}` : 'Resume (No active progress)'}
                                </Button>
                                <Button
                                    onClick={() => handleModuleClick(2)}
                                    variant="outline"
                                    disabled={!isModuleUnlocked(2) && !isWeekTimeLocked(2)}
                                >
                                    {isWeekTimeLocked(2) ? 'Preview Week 2 (Locked)' : 'Enter Week 2'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-1"
                    variants={ANIMATIONS.staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {modules.map((module) => {
                        const isUnlocked = isModuleUnlocked(module.id);
                        const isCompleted = isModuleCompleted(module.id);
                        const isTimeLocked = isWeekTimeLocked(module.id);
                        const lockInfo = isTimeLocked ? getWeekLockInfo(module.id) : null;
                        const moduleProgress = getModuleProgress(module.id);
                        
                        // Determine if module is clickable (unlocked or time-locked for countdown)
                        const isClickable = isUnlocked || isTimeLocked;
                        const showLockedPreview = isTimeLocked && !isUnlocked;

                        return (
                            <motion.div
                                key={module.id}
                                variants={ANIMATIONS.staggerItem}
                            >
                                <Card
                                    className={`relative overflow-hidden ${
                                        isTimeLocked 
                                            ? 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-700' 
                                            : !isUnlocked 
                                            ? 'opacity-60' 
                                            : ''
                                    }`}
                                    hover={isClickable}
                                    interactive={isClickable}
                                >
                                    {/* Status indicator */}
                                    <div className="absolute top-4 right-4">
                                        {isCompleted ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
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
                                            <div className="w-6 h-6 rounded-full bg-primary-500 animate-pulse" />
                                        ) : (
                                            <Lock className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <span className={`text-sm font-semibold ${
                                                isTimeLocked 
                                                    ? 'text-orange-600 dark:text-orange-400'
                                                    : 'text-primary-600 dark:text-primary-400'
                                            }`}>
                                                Week {module.id}
                                                {isTimeLocked && lockInfo && (
                                                    <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                                                        {lockInfo.countdownText}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                            {module.title}
                                        </h3>
                                        {moduleProgress > 0 && !isTimeLocked && (
                                            <ProgressBar progress={moduleProgress} className="mb-3" />
                                        )}
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        {isTimeLocked && lockInfo 
                                            ? `This module will unlock ${lockInfo.countdownText.toLowerCase()}. Get ready for advanced content!`
                                            : module.description
                                        }
                                    </p>

                                    {isTimeLocked && lockInfo && (
                                        <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
                                            <div className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-200">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    <strong>Unlocks on:</strong> {lockInfo.unlockDate.toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {isUnlocked && (

                                        <div className="mt-6 mb-6 pt-6 border-t border-gray-700">
                                            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                                                Key Learning Objectives:
                                            </h4>
                                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                                {module.keyLearning.map((item, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <Check className="w-4 h-4 mt-1 flex-shrink-0 text-green-600 dark:text-green-400" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                    )}
                                    <div className="flex flex-row justify-between gap-4">
                                        {showLockedPreview ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="w-full">
                                                        <Button
                                                            disabled={!isClickable}
                                                            variant="outline"
                                                            fullWidth
                                                            icon={<Clock className="w-4 h-4" />}
                                                        >
                                                            {`Preview Week ${module.id} (Locked)`}
                                                        </Button>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Week {module.id} is locked</DialogTitle>
                                                        <DialogDescription>
                                                            This week will unlock {lockInfo ? lockInfo.countdownText.toLowerCase() : 'soon'}. In the meantime, you can review the description and key objectives.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                                                        <p>{module.description}</p>
                                                        <div>
                                                            <div className="font-semibold mb-1">Objectives</div>
                                                            <ul className="list-disc pl-5 space-y-1">
                                                                {module.keyLearning.map((item, idx) => (
                                                                    <li key={idx}>{item}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="w-full">
                                                        <Button
                                                            onClick={() => handleModuleClick(module.id)}
                                                            disabled={!isClickable}
                                                            variant={isTimeLocked ? "outline" : "gradient"}
                                                            fullWidth
                                                            icon={isTimeLocked ? <Clock className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                        >
                                                            {isTimeLocked 
                                                                ? `Preview Week ${module.id} (Locked)`
                                                                : isCompleted 
                                                                ? `Review Week ${module.id}` 
                                                                : `Enter Week ${module.id}`
                                                            }
                                                        </Button>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {isTimeLocked ? 'See unlock date and overview' : isCompleted ? 'Revisit completed content' : 'Start this week'}
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        <Button
                                            variant="outline"
                                            disabled={!isUnlocked || isTimeLocked}
                                            fullWidth
                                            className={isUnlocked && !isTimeLocked ? 'hover:dark:text-white' : ''}
                                            icon={<Download className="w-4 h-4" />}
                                            onClick={() => handleDownloadBriefing(module.id)}
                                        >
                                            {module.id === 1 ? 'Download AI Lexicon PDF' : 'Download Briefing'}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
            </TooltipProvider>
        </DashboardLayout>
    );
};

export default Dashboard;