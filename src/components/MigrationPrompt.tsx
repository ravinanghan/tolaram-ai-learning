import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import { DataMigration } from '@/utils/migration';

interface MigrationPromptProps {
  onMigrate: (localData: any) => Promise<void>;
  onSkip: () => void;
  onClose: () => void;
}

const MigrationPrompt: React.FC<MigrationPromptProps> = ({
  onMigrate,
  onSkip,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleMigrate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const localData = DataMigration.getLocalData();
      await onMigrate(localData);
      
      setSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        DataMigration.markMigrationCompleted();
        DataMigration.clearLocalData();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Migration error:', error);
      setError('Failed to migrate data. You can continue without migrating.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    DataMigration.markMigrationCompleted();
    onSkip();
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <Card className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Migration Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your progress has been successfully transferred to your account.
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-md w-full"
        >
          <Card className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Transfer Your Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We found existing progress on this device. Would you like to transfer it to your new account?
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleMigrate}
                loading={isLoading}
                disabled={isLoading}
                fullWidth
                icon={<Upload className="w-4 h-4" />}
              >
                Transfer Progress
              </Button>
              
              <Button
                onClick={handleSkip}
                variant="outline"
                disabled={isLoading}
                fullWidth
              >
                Start Fresh
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Your progress will be securely stored in your account and synced across all devices.
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MigrationPrompt;