import { useState, useEffect, type FC } from 'react';
import { useWeekStep, useQuizSync } from '@/hooks/useWeekStep';
import Quiz from '../Quiz';
import { BookOpen } from 'lucide-react';

interface Step3Props {
  onQuizStateChange?: () => void;
}

const Step3: FC<Step3Props> = ({ onQuizStateChange }) => {
  useWeekStep(1, 3);
  const { notifyQuizChange } = useQuizSync(1, 3, onQuizStateChange);
  const [forecastTrained, setForecastTrained] = useState(false);
  const [anomalyActive, setAnomalyActive] = useState(false);
  const [pricingActive, setPricingActive] = useState(false);
  const [readmore, setReadmore] = useState(false);
  
  // Enhanced simulation states
  // Access marking handled by hook

  const [forecastData, setForecastData] = useState<{x: number, y: number}[]>([]);
  const [currentPrice, setCurrentPrice] = useState(50.00);
  const [revenue, setRevenue] = useState(0);
  const [pricingStatus, setPricingStatus] = useState('');
  
  // Simulation effects
  useEffect(() => {
    if (forecastTrained) {
      // Generate sample forecast data
      const data = [];
      for (let i = 0; i < 12; i++) {
        data.push({ x: i, y: 100 + Math.random() * 50 + i * 5 });
      }
      setForecastData(data);
    }
  }, [forecastTrained]);
  
  useEffect(() => {
    let interval: number | undefined;
    if (anomalyActive) {
      interval = window.setInterval(() => {
        // Simulate anomaly visualization only; state is derived visually
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [anomalyActive]);
  
  useEffect(() => {
    let interval: number | undefined;
    if (pricingActive) {
      interval = window.setInterval(() => {
        const newPrice = 45 + Math.random() * 15; // Price between $45-$60
        const newRevenue = Math.floor(newPrice * (120 - newPrice) * (80 + Math.random() * 40));
        setCurrentPrice(newPrice);
        setRevenue(newRevenue);
        setPricingStatus('Testing price optimization...');
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pricingActive]);

  const quizData = {
    question: "You have a dataset of customer purchases with labels indicating which customers churned (left) and which stayed. What type of machine learning would you use to predict future customer churn?",
    type: "multiple" as const,
    options: [
      {
        text: "Supervised Learning",
        explanation: "Correct! Since you have labeled historical data (churned vs. stayed), supervised learning is perfect for predicting future churn."
      },
      {
        text: "Unsupervised Learning",
        explanation: "Unsupervised learning is used when you don't have labels. Since you have churn labels, supervised learning is the right choice."
      },
      {
        text: "Reinforcement Learning",
        explanation: "Reinforcement learning is for trial-and-error scenarios where an agent learns through rewards. This scenario has labeled data, so supervised learning is appropriate."
      },
      {
        text: "None of these approaches would work",
        explanation: "Actually, this is a classic supervised learning problem since you have labeled training data."
      }
    ],
    correct: 0,
    correctExplanation: "Perfect! Supervised learning uses labeled historical data to make predictions about future events - exactly what's needed for churn prediction.",
    incorrectExplanation: "Think about the key factor: you have labeled data (churned vs. stayed). This is the defining characteristic of supervised learning."
  };

  const handleQuizAnswer = (_correct: boolean) => {
    notifyQuizChange();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
      <section className="my-8 transition-colors duration-300">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          How Machines Learn: The Three Paradigms
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 text-center max-w-3xl mx-auto">
          Machine learning algorithms can be grouped into three primary categories, or paradigms, based on how they learn from data. The choice of which paradigm to use is dictated by the nature of the business problem and, most importantly, the type of data available. This establishes a direct link: the data you have determines the type of AI you can build.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* --- Supervised Learning --- */}
          <div className="paradigm-card p-8 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 flex flex-col">
            <h3 className="text-2xl font-bold text-blue-500 dark:text-blue-400 mb-4">
              Supervised Learning
            </h3>
            <p className="mb-6 flex-grow text-gray-700 dark:text-gray-300">
              Learning with an "answer key." The AI is trained on labeled
              historical data to predict future outcomes.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
              <p className="font-semibold mb-2 text-gray-900 dark:text-white">
                Simulation: Strategic Forecaster
              </p>
              <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
                Use historical data to predict future sales.
              </p>
              <div className="h-40 relative mb-4 bg-gray-200 dark:bg-gray-700/50 rounded-md">
                {!forecastTrained ? (
                  <svg className="w-full h-full" viewBox="0 0 300 120">
                    {/* Empty chart waiting for training */}
                    <defs>
                      <pattern id="grid-light" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D1D5DB" strokeWidth="0.5"/>
                      </pattern>
                      <pattern id="grid-dark" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-light)" className="dark:hidden"/>
                    <rect width="100%" height="100%" fill="url(#grid-dark)" className="hidden dark:block"/>
                  </svg>
                ) : (
                  <svg className="w-full h-full" viewBox="0 0 300 120">
                    {/* Background grid */}
                    <defs>
                      <pattern id="grid-light-active" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D1D5DB" strokeWidth="0.5"/>
                      </pattern>
                      <pattern id="grid-dark-active" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-light-active)" className="dark:hidden"/>
                    <rect width="100%" height="100%" fill="url(#grid-dark-active)" className="hidden dark:block"/>
                    
                    {/* Data points */}
                    {forecastData.map((point, i) => (
                      <circle
                        key={i}
                        cx={30 + i * 25}
                        cy={100 - point.y * 0.5}
                        r="3"
                        fill="#60A5FA"
                        className="opacity-90"
                      />
                    ))}
                    
                    {/* Trend line */}
                    <path
                      d={`M ${forecastData.map((point, i) => `${30 + i * 25},${100 - point.y * 0.5}`).join(' L ')}`}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="opacity-80"
                    />
                    
                    {/* Trend line extension (forecast) */}
                    {forecastData.length > 0 && (() => {
                      const lastPoint = forecastData[forecastData.length - 1];
                      if (!lastPoint) return null;
                      return (
                        <path
                          d={`M ${30 + (forecastData.length - 1) * 25},${100 - lastPoint.y * 0.5} L 280,${100 - (lastPoint.y + 20) * 0.5}`}
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="2"
                          strokeDasharray="8,4"
                          className="opacity-70"
                        />
                      );
                    })()}
                  </svg>
                )}
              </div>
              <button
                onClick={() => setForecastTrained(true)}
                className={`w-full px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                  forecastTrained 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {forecastTrained ? "Model Trained ✓" : "Train Forecasting Model"}
              </button>
            </div>
          </div>

          {/* --- Unsupervised Learning --- */}
          <div className="paradigm-card p-8 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 flex flex-col">
            <h3 className="text-2xl font-bold text-purple-500 dark:text-purple-400 mb-4">
              Unsupervised Learning
            </h3>
            <p className="mb-6 flex-grow text-gray-700 dark:text-gray-300">
              Learning without a teacher. The AI finds hidden patterns in unlabeled
              data, like identifying anomalies.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
              <p className="font-semibold mb-2 text-gray-900 dark:text-white">
                Simulation: Anomaly Detector
              </p>
              <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
                Find the fraudulent transaction.
              </p>
              <div className="h-40 relative mb-4 bg-gray-200 dark:bg-gray-700/50 rounded-md overflow-hidden">
                {!anomalyActive ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({length: 16}).map((_, i) => (
                        <div 
                          key={i}
                          className="w-3 h-3 bg-green-400 rounded-full opacity-60"
                          style={{
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full p-2">
                    {/* Animated dots representing transactions */}
                    <div className="grid grid-cols-5 gap-2 h-full">
                      {Array.from({length: 20}).map((_, i) => {
                        const isAnomaly = Math.random() < 0.15; // 15% chance for demo
                        return (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full transition-all duration-1000 ${
                              isAnomaly 
                                ? 'bg-red-500 shadow-red-500/50 shadow-lg animate-pulse' 
                                : 'bg-green-400'
                            }`}
                            style={{
                              animationDelay: `${i * 0.2}s`,
                              opacity: anomalyActive ? (i < 15 ? 1 : 0.3) : 0
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setAnomalyActive(true)}
                className={`w-full px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                  anomalyActive
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {anomalyActive ? "Monitoring..." : "Activate Anomaly Detection"}
              </button>
            </div>
          </div>

          {/* --- Reinforcement Learning --- */}
          <div className="paradigm-card p-8 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 flex flex-col">
            <h3 className="text-2xl font-bold text-amber-500 dark:text-amber-400 mb-4">
              Reinforcement Learning
            </h3>
            <p className="mb-6 flex-grow text-gray-700 dark:text-gray-300">
              Learning through trial and error. An "agent" takes actions to
              maximize a cumulative reward.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
              <p className="font-semibold mb-2 text-gray-900 dark:text-white">
                Simulation: Dynamic Pricing Engine
              </p>
              <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
                AI will test prices to maximize revenue.
              </p>
              <div className="h-40 mb-4 flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-700/50 rounded-md">
                <div className="text-center">
                  <p className="text-lg text-gray-900 dark:text-white mb-1">
                    Price: <span className="font-bold text-gray-900 dark:text-white">
                      ${pricingActive ? currentPrice.toFixed(2) : '50.00'}
                    </span>
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white mb-2">
                    Revenue: <span className="font-bold text-green-500 dark:text-green-400">
                      ${pricingActive ? revenue.toLocaleString() : '0'}
                    </span>
                  </p>
                  {pricingActive && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 h-4 mt-2">
                      {pricingStatus}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPricingActive(true)}
                className={`w-full px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                  pricingActive
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {pricingActive ? "AI Pricing Active" : "Deploy AI Pricing Agent"}
              </button>
            </div>
          </div>
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
              {/* Supervised Learning Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                <h4 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Supervised Learning
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  This is the <strong>most common and straightforward paradigm</strong>, analogous to a student learning with a teacher or an "answer key". The algorithm is trained on a dataset where the data is already labeled with the correct output.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  <strong>Example:</strong> To train a model to identify spam, it would be fed thousands of emails, each pre-labeled as either "spam" or "not spam." The model's job is to learn the relationship between the input (the email content) and the output (the label).
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The <strong>vast majority of practical business AI applications</strong> today, such as fraud detection, sales forecasting, and medical diagnosis, are forms of narrow AI using supervised learning. This is because many business processes naturally generate labeled historical data.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Supervised learning tasks are typically divided into two types:</h5>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Classification:</strong> The goal is to predict a discrete category. Examples include classifying an email as spam or not, or diagnosing a tumor as malignant or benign.</li>
                    <li><strong>Regression:</strong> The goal is to predict a continuous numerical value. Examples include forecasting future sales, predicting the price of a house, or estimating a customer's lifetime value.</li>
                  </ul>
                </div>
              </div>

              {/* Unsupervised Learning Section */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
                <h4 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Unsupervised Learning
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  In this paradigm, the algorithm <strong>learns without a teacher</strong>. It is given a dataset with unlabeled data and must discover hidden patterns, structures, or groupings on its own.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  This is akin to being given a box of mixed Lego bricks and asked to sort them into piles based on color and shape <strong>without being told what "red" or "square" is</strong>.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Unsupervised learning is powerful for <strong>exploratory data analysis</strong> and is used for business applications like customer segmentation, product recommendation systems, and anomaly detection.
                </p>
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                  <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">The main types of unsupervised tasks are:</h5>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Clustering:</strong> The goal is to group similar data points together into clusters.</li>
                    <li><strong>Association:</strong> The goal is to discover "rules" that describe large portions of the data, such as the classic market-basket analysis finding that "customers who buy diapers also tend to buy beer".</li>
                  </ul>
                </div>
              </div>

              {/* Reinforcement Learning Section */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6 border border-amber-200 dark:border-amber-700">
                <h4 className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Reinforcement Learning
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  This paradigm is about <strong>learning through trial and error</strong>, much like training a pet. An AI "agent" is placed in an "environment" (e.g., a game or a real-world simulation) and learns to make decisions by taking actions.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  For each action, it receives feedback in the form of a <strong>reward</strong> (for a good action) or a <strong>penalty</strong> (for a bad one). The agent's goal is to learn a strategy, or "policy," that maximizes its total cumulative reward over time.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  This approach is particularly well-suited for problems that involve <strong>sequential decision-making in a dynamic environment</strong>.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                  <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Business applications include:</h5>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Training robots to perform complex tasks</li>
                    <li>• Playing strategic games (like Go, famously mastered by DeepMind's AlphaGo)</li>
                    <li>• Optimizing supply chain logistics in real-time</li>
                    <li>• Implementing dynamic pricing strategies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Quiz
        quiz={quizData}
        moduleId={1}
        stepId={3}
        onAnswer={handleQuizAnswer}
        showExplanations={true}
        showResetButton={true}
      />
    </div>
  );
};

export default Step3;
