import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Clock, Calendar, ArrowLeft, Star } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useWeekCountdown, getWeekLockInfo } from '@/utils/weekLocking';
import Button from '../Button';
import Card from '../Card';

interface WeekLockedComponentProps {
  weekId: number;
}

const WeekLockedComponent: React.FC<WeekLockedComponentProps> = ({ weekId }) => {
  const navigate = useNavigate();
  const lockInfo = useWeekCountdown(weekId);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button
              onClick={handleBackToDashboard}
              variant="ghost"
              icon={<ArrowLeft className="w-4 h-4" />}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Back to Dashboard
            </Button>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Lock className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {weekId}
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Week {weekId} is Locked
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              This module will be available soon! We're releasing content gradually to ensure the best learning experience.
            </p>
          </motion.div>

          {/* Countdown Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <div className="text-center p-8">
                <div className="flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-blue-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Countdown to Unlock
                  </h2>
                </div>

                {/* Countdown Display */}
                <div className="mb-6">
                  <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {lockInfo.daysRemaining}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-lg">
                    {lockInfo.daysRemaining === 1 ? 'Day' : 'Days'} Remaining
                  </div>
                </div>

                {/* Detailed Countdown */}
                {lockInfo.daysRemaining > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {lockInfo.daysRemaining}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Days
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {lockInfo.hoursRemaining}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Hours
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {lockInfo.minutesRemaining}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Minutes
                      </div>
                    </div>
                  </div>
                )}

                {/* Unlock Date */}
                <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Unlocks on:</strong> {formatDate(lockInfo.unlockDate)}
                  </span>
                </div>

                {/* Progress Indicator */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {lockInfo.countdownText}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Information Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            {/* What to Expect */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    What to Expect in Week {weekId}
                  </h3>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    New interactive learning modules
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Advanced concepts and practical exercises
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Comprehensive assessments and feedback
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Downloadable resources and guides
                  </li>
                </ul>
              </div>
            </Card>

            {/* Meanwhile */}
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Meanwhile, you can:
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Review previous week materials
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Practice with completed modules
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Explore the AI Timeline
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Prepare for upcoming content
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-4"
          >
            <Button
              onClick={handleBackToDashboard}
              variant="primary"
              size="lg"
              className="mr-4"
            >
              Return to Dashboard
            </Button>
            
            <Button
              onClick={() => navigate('/ai-timeline')}
              variant="outline"
              size="lg"
            >
              Explore AI Timeline
            </Button>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Content is released on schedule to ensure optimal learning progression. 
              <br />
              Thank you for your patience!
            </p>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WeekLockedComponent;