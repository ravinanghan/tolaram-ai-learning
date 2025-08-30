import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import Quiz from '../Quiz';
import { BookOpen } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { useWeekStep, useQuizSync } from '@/hooks/useWeekStep';

const spectrumData = [
  {
    title: 'Artificial Narrow Intelligence (ANI)',
    color: 'green-400',
    textColor: 'text-green-400',
    status: 'Reality (All current AI)',
    description:
      'An expert in one specific task. Operates within a limited, predefined context.',
  },
  {
    title: 'Artificial General Intelligence (AGI)',
    color: 'yellow-400',
    textColor: 'text-yellow-400',
    status: 'Aspirational Goal',
    description:
      'A machine that can learn and apply intelligence to solve any intellectual task a human can.',
  },
  {
    title: 'Artificial Superintelligence (ASI)',
    color: 'red-400',
    textColor: 'text-red-400',
    status: 'Hypothetical',
    description:
      'An intellect that is vastly smarter than the best human brains in virtually every field.',
  },
];

interface Step2Props {
  onQuizStateChange?: () => void;
}

const Step2: FC<Step2Props> = ({ onQuizStateChange }) => {
  const { updateStepState } = useProgress();
  useWeekStep(1, 2);
  const { notifyQuizChange } = useQuizSync(1, 2, onQuizStateChange);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [readmore, setReadmore] = useState(false);
  const [isStepAttempted, setIsStepAttempted] = useState(false);

  // Mark step as attempted when component mounts handled by hook

  const quizData = {
    question: "Match the scenario number with the AI category (ANI, AGI, or ASI).",
    details: "A developer on the Addme AI Chatbot team wants to showcase the different types of AI. They create three hypothetical scenarios based on the project's evolution. Match each scenario to the correct type of AI:\n\n 1. The Addme AI Chatbot is an application that can only answer customer questions about the Addme product line with high proficiency. \n\n 2. A theoretical future version of the chatbot evolves to not only answer questions but also autonomously write new marketing campaigns, manage social media accounts, and design new digital products for the entire company. \n\n 3. A highly speculative scenario where the AI chatbot's capabilities expand to the point that it solves complex, unstructured global marketing challenges for all of Tolaram's brands, a task that would require decades for a team of human experts to accomplish.",
    type: "multiple" as const,
    options: [
      {
        text: "1=ANI, 2=AGI, 3=ASI",
        explanation: ""
      },
      {
        text: "1=AGI, 2=ASI, 3=ANI",
        explanation: ""
      },
      {
        text: "1=ASI, 2=ANI, 3=AGI",
        explanation: ""
      },
    ],
    correct: 0,
    correctExplanation: "Excellent! Understanding that we're currently in the ANI era is crucial for setting realistic expectations and strategies.",
    incorrectExplanation: "Remember: All current AI systems, no matter how impressive, are still narrow intelligence focused on specific tasks."
  };

  const handleQuizAnswer = (correct: boolean) => {
    setQuizCompleted(correct);
    
    // Mark step as attempted when quiz is answered
    if (!isStepAttempted) {
      setIsStepAttempted(true);
      updateStepState(1, 2, {
        lastAccessed: Date.now()
      });
    }

    // Notify parent component that quiz state has changed
    notifyQuizChange();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
      <section className="my-8">
        <h2 className="text-4xl font-bold mb-4 text-center">The Spectrum of Intelligence - ANI, AGI, and ASI</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 text-center max-w-3xl mx-auto">
          Not all AI is created equal. The field is broadly categorized based on the scope and generality of a system's intelligence. Understanding this spectrum is crucial for distinguishing between the technology that exists today and the concepts that remain in the realm of research and science fiction.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {spectrumData.map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700"
            >
              <h3 className={`text-2xl font-bold ${item.textColor}`}>{item.title}</h3>
              <p className="text-sm mt-2 mb-4">
                <strong>Status:</strong> {item.status}
              </p>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center max-w-2xl mx-auto mt-8">
          <button
            onClick={() => {
              setReadmore(!readmore)
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
          >
            <BookOpen className="w-5 h-5" />
            Read More Details
          </button>
        </div>
        {readmore && (
          <div id="read-more-section" className="mt-12 space-y-8">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              Detailed Explanations
            </h3>
            
            <div className="space-y-8">
              {/* ANI Section */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
                <h4 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Artificial Narrow Intelligence (ANI)
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  <strong>Also known as Weak AI</strong>, this is the only type of artificial intelligence that has been successfully realized to date. ANI systems are designed and trained to perform a single, specific task with a high degree of proficiency. They operate within a predefined, limited context and cannot perform functions outside of their designated domain.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  <strong>Examples of ANI are ubiquitous:</strong> the AI that recommends movies on Netflix, the voice assistant on a smartphone, the system that detects fraudulent credit card transactions, and the software that powers self-driving cars are all forms of ANI.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  While they may seem intelligent, their intelligence is narrow and specialized.
                </p>
              </div>

              {/* AGI Section */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
                <h4 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Artificial General Intelligence (AGI)
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  <strong>Also known as Strong AI</strong>, this is the theoretical and aspirational goal of much AI research. AGI refers to a machine with the ability to understand, learn, and apply its intelligence to solve any intellectual task that a human being can.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  A key characteristic of AGI would be its ability to <strong>generalize knowledge and transfer skills</strong> from one domain to another—for example, applying insights learned from studying medicine to solve a problem in finance.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  AGI would possess cognitive abilities, reasoning skills, and potentially self-awareness akin to a human's.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                  It is critical to emphasize that <strong>AGI does not yet exist</strong> and remains a long-term research objective.
                </p>
              </div>

              {/* ASI Section */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-6 border border-red-200 dark:border-red-700">
                <h4 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Artificial Superintelligence (ASI)
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  This is a <strong>hypothetical future stage</strong> of AI development where an AI's intelligence would far surpass that of the brightest human minds across virtually every field, including scientific creativity, general wisdom, and social skills.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The concept of ASI raises <strong>profound questions about the future of humanity</strong> and is a subject of intense debate among technologists and ethicists.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <Quiz
        quiz={quizData}
        moduleId={1}
        stepId={2}
        onAnswer={handleQuizAnswer}
        showExplanations={true}
        showResetButton={true}
      />
    </div>
  );
};

export default Step2;
