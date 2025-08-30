import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Card from './Card';
import { useProgress } from '../context/ProgressContext';
import { StepStateManager } from '../utils/stepStateManager';

interface QuizOption {
  text: string;
  explanation?: string;
}

interface QuizData {
  question: string;
  details?: string;
  type: 'multiple' | 'boolean';
  options?: string[] | QuizOption[];
  correct: number | boolean;
  explanation?: string;
  correctExplanation?: string;
  incorrectExplanation?: string;
}

interface QuizProps {
  quiz: QuizData;
  moduleId?: number;
  stepId?: number;
  onAnswer: (correct: boolean) => void;
  showExplanations?: boolean;
  customExplanations?: {
    correct?: string;
    incorrect?: string;
  };
  allowRetry?: boolean;
  onRetry?: () => void;
  autoAdvance?: boolean;
  onNext?: () => void;
  showResetButton?: boolean;
}

const Quiz: React.FC<QuizProps> = ({
  quiz,
  moduleId,
  stepId,
  onAnswer,
  showExplanations = true,
  customExplanations,
  allowRetry = true,
  onRetry,
  autoAdvance = false,
  onNext,
  showResetButton = true
}) => {
  const { getQuizAnswer, saveQuizAnswer, updateStepState, getStepState, clearQuizAnswer } = useProgress();
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(1);

  // Load saved quiz answer if available
  useEffect(() => {
    if (moduleId && stepId) {
      const savedAnswer = getQuizAnswer(moduleId, stepId);
      if (savedAnswer) {
        setSelectedAnswer(savedAnswer.selectedAnswer);
        setIsCorrect(savedAnswer.isCorrect);
        setShowResult(true);
        setAttempts(savedAnswer.attempts);
      }
    }
  }, [moduleId, stepId, getQuizAnswer]);

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    const correct = quiz.type === 'boolean'
      ? (answerIndex === 0 ? true : false) === quiz.correct
      : answerIndex === quiz.correct;

    setIsCorrect(correct);
    setShowResult(true);

    // Save quiz answer to progress context
    if (moduleId && stepId) {
      const quizAnswer = StepStateManager.createQuizAnswer(answerIndex, correct, attempts);
      saveQuizAnswer(moduleId, stepId, quizAnswer);
      
      // Always mark step as attempted (even if incorrect)
      // Mark as completed only if correct
      updateStepState(moduleId, stepId, { 
        completed: correct,
        lastAccessed: Date.now()
      });
    }

    // Call onAnswer callback once after all state updates are complete
    setTimeout(() => {
      onAnswer(correct);
    }, 100);
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setAttempts(prev => prev + 1);
    
    // Clear saved answer from progress context
    if (moduleId && stepId) {
      updateStepState(moduleId, stepId, { 
        completed: false 
      });
    }
    
    onRetry?.();
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setAttempts(1); // Reset attempts to 1
    
    // Clear saved answer from progress context if moduleId and stepId are provided
    if (moduleId && stepId) {
      clearQuizAnswer(moduleId, stepId);
    }
    
    // Notify parent that quiz state has changed (reset)
    onAnswer(false); // This will trigger re-evaluation of next button
  };

  const handleNext = () => {
    onNext?.();
  };

  const handleBooleanAnswer = (answer: boolean) => {
    handleAnswer(answer ? 0 : 1);
  };

  const getOptionText = (option: string | QuizOption): string => {
    return typeof option === 'string' ? option : option.text;
  };

  const getOptionExplanation = (option: string | QuizOption): string | undefined => {
    return typeof option === 'string' ? undefined : option.explanation;
  };

  const getExplanationText = (): string => {
    if (customExplanations) {
      return isCorrect ?
        (customExplanations.correct || 'Great job! You\'re ready for the next step.') :
        (customExplanations.incorrect || 'Don\'t worry, learning from mistakes is part of the process!');
    }

    if (quiz.correctExplanation && isCorrect) {
      return quiz.correctExplanation;
    }

    if (quiz.incorrectExplanation && !isCorrect) {
      return quiz.incorrectExplanation;
    }

    if (quiz.explanation) {
      return quiz.explanation;
    }

    return isCorrect ?
      'Great job! You\'re ready for the next step.' :
      'Don\'t worry, learning from mistakes is part of the process!';
  };

  return (
    <Card className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Quiz Question
      </h3>
      {quiz.details && (<div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm" style={{ whiteSpace: 'pre-line' }}>{quiz.details}</div>)}
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {quiz.question}
      </p>

      {quiz.type === 'multiple' ? (
        <div className="space-y-3">
          {quiz.options?.map((option, index) => {
            const optionText = getOptionText(option);
            const optionExplanation = getOptionExplanation(option);

            return (
              <div key={index}>
                <motion.button
                  whileHover={{ scale: showResult ? 1 : 1.02 }}
                  whileTap={{ scale: showResult ? 1 : 0.98 }}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${showResult
                    ? index === quiz.correct
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : selectedAnswer === index
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 text-sm font-bold ${showResult
                        ? index === quiz.correct
                          ? 'border-green-600 text-green-600 bg-green-50 dark:bg-green-900/30'
                          : selectedAnswer === index
                            ? 'border-red-600 text-red-600 bg-red-50 dark:bg-red-900/30'
                            : 'border-gray-400 text-gray-400 bg-gray-50 dark:bg-gray-800'
                        : 'border-gray-600 text-gray-600 dark:border-gray-300 dark:text-gray-300'
                        }`}>
                        <span className="leading-none text-center" style={{ transform: 'translateY(-1px)' }}>
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      {optionText}
                    </div>
                    {showResult && (
                      <div className="flex items-center space-x-2">
                        {index === quiz.correct && (
                          <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                            Correct Answer
                          </span>
                        )}
                        {selectedAnswer === index && index !== quiz.correct && (
                          <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                            Your Answer
                          </span>
                        )}
                        {index === quiz.correct && (
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {selectedAnswer === index && index !== quiz.correct && (
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </motion.button>

                {/* Option-specific explanation */}
                {showResult && showExplanations && optionExplanation && selectedAnswer === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 ml-11 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-200 text-sm"
                  >
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {optionExplanation}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex gap-4">
          <Button
            variant={showResult && quiz.correct === true ? 'primary' : 'outline'}
            onClick={() => handleBooleanAnswer(true)}
            disabled={showResult}
            className={`flex-1 relative ${showResult && selectedAnswer === 0 && !isCorrect
              ? 'bg-red-500 hover:bg-red-500 text-white border-red-500'
              : ''
              }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>True</span>
              {showResult && (
                <div className="flex items-center space-x-1">
                  {quiz.correct === true && (
                    <svg className="w-4 h-4 text-current" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {selectedAnswer === 0 && !isCorrect && (
                    <svg className="w-4 h-4 text-current" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>
          </Button>
          <Button
            variant={showResult && quiz.correct === false ? 'primary' : 'outline'}
            onClick={() => handleBooleanAnswer(false)}
            disabled={showResult}
            className={`flex-1 relative ${showResult && selectedAnswer === 1 && !isCorrect
              ? 'bg-red-500 hover:bg-red-500 text-white border-red-500'
              : ''
              }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>False</span>
              {showResult && (
                <div className="flex items-center space-x-1">
                  {quiz.correct === false && (
                    <svg className="w-4 h-4 text-current" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {selectedAnswer === 1 && !isCorrect && (
                    <svg className="w-4 h-4 text-current" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mt-6 p-4 rounded-lg ${isCorrect
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}>
                {isCorrect ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="font-semibold">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {showExplanations && (
              <div className="mt-2">
                <p className="mb-3">
                  {getExplanationText()}
                </p>
                {quiz.type === 'multiple' && selectedAnswer !== null && quiz.options && (
                  <div className="text-sm opacity-75">
                    <p>
                      <strong>Your answer:</strong> {String.fromCharCode(65 + selectedAnswer)} - {(() => {
                        const selectedOption = quiz.options[selectedAnswer];
                        return selectedOption ? getOptionText(selectedOption) : 'Unknown';
                      })()}
                    </p>
                    <p>
                      <strong>Correct answer:</strong> {String.fromCharCode(65 + (quiz.correct as number))} - {(() => {
                        const correctOption = quiz.options[quiz.correct as number];
                        return correctOption ? getOptionText(correctOption) : 'Unknown';
                      })()}
                    </p>
                  </div>
                )}
                {quiz.type === 'boolean' && selectedAnswer !== null && (
                  <div className="text-sm opacity-75">
                    <p>
                      <strong>Your answer:</strong> {selectedAnswer === 0 ? 'True' : 'False'}
                    </p>
                    <p>
                      <strong>Correct answer:</strong> {quiz.correct ? 'True' : 'False'}
                    </p>
                  </div>
                )}
              </div>
            )}
            {/* Controls */}
            {showResult && (
              <div className="mt-4 flex justify-center gap-3">
                {!isCorrect && (
                  <Button
                    variant="primary"
                    onClick={handleRetry}
                    className="px-4 py-2 text-sm"
                  >
                    Try Again (Attempt {attempts + 1})
                  </Button>
                )}
                {showResetButton && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="px-4 py-2 text-sm"
                  >
                    Reset Quiz
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default Quiz;