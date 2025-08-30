import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, PlayCircle, CheckCircle, Trophy, Star, Sparkles, Download, Users } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { useWeekStep } from '@/hooks/useWeekStep';

interface Step4Props {
  onQuizStateChange?: () => void;
}

export default function Step4({ onQuizStateChange }: Step4Props) {
  const navigate = useNavigate();
  const { updateStepState, completeStep, completeModule } = useProgress();
  useWeekStep(1, 4);
  const [videoWatched, setVideoWatched] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confetti, setConfetti] = useState<Array<{id: number, x: number, y: number, rotation: number}>>([]);
  const [isStepAttempted, setIsStepAttempted] = useState(false);
  
  const isFullyCompleted = videoWatched && pdfDownloaded;
  
  // Mark step as attempted when either video is watched or PDF is downloaded
  useEffect(() => {
    if ((videoWatched || pdfDownloaded) && !isStepAttempted) {
      setIsStepAttempted(true);
      updateStepState(1, 4, {
        videoWatched,
        pdfDownloaded,
        lastAccessed: Date.now()
      });

      // Notify parent component that step state has changed
      if (onQuizStateChange) {
        console.log('Step4: Calling onQuizStateChange callback');
        setTimeout(() => {
          onQuizStateChange();
        }, 100);
      }
    }
  }, [videoWatched, pdfDownloaded, isStepAttempted, updateStepState, onQuizStateChange]);
  
  // Trigger navigation update when step is fully completed
  useEffect(() => {
    if (isFullyCompleted) {
      // Mark step as completed
      updateStepState(1, 4, {
        completed: true,
        videoWatched,
        pdfDownloaded,
        lastAccessed: Date.now()
      });

      // Notify parent component that step state has changed
      if (onQuizStateChange) {
        console.log('Step4: Step fully completed, notifying parent');
        setTimeout(() => {
          onQuizStateChange();
        }, 100);
      }
    }
  }, [isFullyCompleted, onQuizStateChange, updateStepState, videoWatched, pdfDownloaded]);
  useEffect(() => {
    if (isFullyCompleted && !showCelebration) {
      setShowCelebration(true);
      
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360
      }));
      setConfetti(particles);
      
      // Clear confetti after animation
      setTimeout(() => {
        setConfetti([]);
      }, 3000);
    }
  }, [isFullyCompleted, showCelebration]);
  
  const handleVideoClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const watched = e.target.checked;
    setVideoWatched(watched);
    // Update step state when video is watched
    updateStepState(1, 4, {
      videoWatched: watched,
      lastAccessed: Date.now()
    });
  };
  
  const handlePdfDownload = () => {
    setPdfDownloaded(true);
    // Update step state when PDF is downloaded
    updateStepState(1, 4, {
      pdfDownloaded: true,
      lastAccessed: Date.now()
    });
  };

  const handleContinueToNextWeek = () => {
    if (!isFullyCompleted) return;
    // Ensure final step is marked complete and module completion recorded
    completeStep(1, 4);
    completeModule(1);
    // Navigate to Week 2 (now unlocked)
    navigate('/week/2');
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
      {/* Confetti Animation */}
      <AnimatePresence>
        {confetti.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {confetti.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
                initial={{ opacity: 1, scale: 0, rotate: particle.rotation }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  rotate: particle.rotation + 360,
                  y: 100
                }}
                transition={{ duration: 3, ease: "easeOut" }}
              >
                <div className="w-full h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
      

      
      {/* Activities Grid */}
      <div className="grid md:grid-cols-1 gap-8 max-w-6xl mx-auto mb-8">
        {/* Video Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full transition-colors duration-300 ${
              videoWatched 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              {videoWatched ? <CheckCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Watch: AI Lexicon Overview
            </h3>
            <div className="ml-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={videoWatched}
                  onChange={handleVideoClick}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Mark as watched
                </span>
              </label>
            </div>
          </div>
          
          <div className={`relative aspect-video rounded-lg overflow-hidden shadow-lg border-2 transition-colors duration-300 ${
            videoWatched ? 'border-green-300 dark:border-green-600' : 'border-gray-200 dark:border-gray-700'
          }`}>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/Yq0QkCxoTHM"
              title="AI Lexicon Overview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            
            {/* Completion Overlay */}
            {videoWatched && (
              <motion.div 
                className="absolute inset-0 bg-green-500/10 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-green-500 text-white p-3 rounded-full">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-start gap-2">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              videoWatched ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Watch this comprehensive overview to deepen your understanding of AI terminology and concepts.
              {videoWatched && (
                <span className="block text-green-600 dark:text-green-400 font-semibold mt-1">
                  ✓ Video completed!
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Download Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full transition-colors duration-300 ${
              pdfDownloaded 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            }`}>
              {pdfDownloaded ? <CheckCircle className="w-6 h-6" /> : <FileDown className="w-6 h-6" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Download Resources
            </h3>
          </div>
          
          <div className={`bg-gradient-to-br rounded-xl p-6 border-2 transition-all duration-300 ${
            pdfDownloaded
              ? 'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-600'
              : 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700'
          }`}>
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                The AI Lexicon (Week 1)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                A comprehensive guide covering all the AI terminology and concepts from this week's learning module.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  📄 PDF Format
                </span>
                <span className="flex items-center gap-1">
                  📊 15 pages
                </span>
                <span className="flex items-center gap-1">
                  🎯 Week 1 Content
                </span>
              </div>
            </div>
            
            <motion.a
              href="/assets/week1TheAILexicon.pdf"
              download="week1TheAILexicon.pdf"
              onClick={handlePdfDownload}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 w-full justify-center ${
                pdfDownloaded
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {pdfDownloaded ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Downloaded Successfully!
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download AI Lexicon PDF
                </>
              )}
            </motion.a>
          </div>
          
          <div className="flex items-start gap-2">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              pdfDownloaded ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>Tip:</strong> Keep this reference guide handy as you progress through the course.
              {pdfDownloaded && (
                <span className="block text-green-600 dark:text-green-400 font-semibold mt-1">
                  ✓ Resource downloaded!
                </span>
              )}
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Celebration Section */}
      <AnimatePresence>
        {isFullyCompleted && (
          <motion.div 
            className="text-center py-8 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xl font-bold">Congratulations!</span>
              <Trophy className="w-6 h-6" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              🎉 You've Completed Week 1! 🎉
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Fantastic work! You've successfully completed the AI Lexicon module and are now equipped with fundamental AI terminology and concepts. You're ready to advance to Week 2!
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="text-2xl mb-2">📚</div>
                <div className="font-semibold text-gray-900 dark:text-white">Knowledge Gained</div>
                <div className="text-gray-600 dark:text-gray-400">AI terminology & concepts</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-gray-900 dark:text-white">Activities Completed</div>
                <div className="text-gray-600 dark:text-gray-400">Video + Resource download</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="text-2xl mb-2">🚀</div>
                <div className="font-semibold text-gray-900 dark:text-white">Ready for</div>
                <div className="text-gray-600 dark:text-gray-400">Week 2 challenges</div>
              </div>
            </div>
            
            <motion.div 
              className="mt-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                delay: 1.2,
                duration: 0.8
              }}
            >
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={handleContinueToNextWeek}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Continue to Week 2 →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Interactive Notes Section */}
      {!isFullyCompleted && (
        <motion.div 
          className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-full">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Complete Your Week 1 Journey
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You're almost there! Complete both activities above to unlock your Week 1 completion certificate and advance to the next module.
              </p>
              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-sm ${
                  videoWatched ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {videoWatched ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-gray-400 rounded" />}
                  Watch the AI Lexicon overview video
                </div>
                <div className={`flex items-center gap-2 text-sm ${
                  pdfDownloaded ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {pdfDownloaded ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-gray-400 rounded" />}
                  Download the AI Lexicon reference guide
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
