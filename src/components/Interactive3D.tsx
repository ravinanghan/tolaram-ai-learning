import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface Interactive3DProps {
  src: string;
  title?: string;
  className?: string;
  loadingText?: string;
  enableText?: string;
  disableText?: string;
}

const Interactive3D: React.FC<Interactive3DProps> = ({
  src,
  title = "Interactive 3D Experience",
  className = "",
  loadingText = "Loading interactive experience...",
  enableText = "Explore in 3D",
  disableText = "Disable interaction"
}) => {
  const [interactive, setInteractive] = useState<boolean>(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);

  const handleInteractiveToggle = (): void => {
    setInteractive(!interactive);
  };

  const handleIframeLoad = (): void => {
    setIsIframeLoaded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className={`relative w-full h-[70vh] md:h-[75vh] max-h-[900px] rounded-xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800 ${className}`}
    >
      {/* Loading state */}
      {!isIframeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">{loadingText}</p>
          </div>
        </div>
      )}

      {/* 3D iframe */}
      <iframe
        title={title}
        src={src}
        frameBorder="0"
        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
          !interactive ? 'pointer-events-none' : ''
        } ${!isIframeLoaded ? 'opacity-0' : 'opacity-100'}`}
        allow="autoplay; fullscreen"
        onLoad={handleIframeLoad}
      />

      {/* Interaction overlay */}
      {!interactive && isIframeLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center px-4 pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInteractiveToggle}
              className="px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition shadow-lg flex items-center space-x-2 mx-auto"
            >
              <Eye className="w-5 h-5" />
              <span>{enableText}</span>
            </motion.button>
            <p className="mt-3 text-sm text-white/90">
              Tip: Page scrolling is enabled when not interacting
            </p>
          </div>
        </motion.div>
      )}

      {/* Disable interaction button */}
      {interactive && isIframeLoaded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4"
        >
          <button
            onClick={handleInteractiveToggle}
            className="px-3 py-2 text-sm rounded-md bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm flex items-center space-x-2 transition"
          >
            <EyeOff className="w-4 h-4" />
            <span>{disableText}</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Interactive3D;