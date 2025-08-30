import React, { useEffect, useRef, useCallback, useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import type { FC } from 'react';
import Quiz from '../Quiz';
import { useProgress } from '../../context/ProgressContext';
import { useWeekStep, useQuizSync } from '@/hooks/useWeekStep';

interface NodeData {
  id: string;
  title: string;
  description: string;
  position: { top: string; left: string };
  color: string;
}

interface ScrollState {
  currentLayer: 'ai' | 'ml' | 'dl' | 'overview';
  progress: number;
  scale: number;
}

interface Step1Props {
  onQuizStateChange?: () => void;
}

const Step1: FC<Step1Props> = ({ onQuizStateChange }) => {
  const { updateStepState } = useProgress();
  useWeekStep(1, 1);
  const { notifyQuizChange } = useQuizSync(1, 1, onQuizStateChange);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({
    currentLayer: 'ai',
    progress: 0,
    scale: 1
  });
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [readmore, setReadmore] = useState(false);
  const [isStepAttempted, setIsStepAttempted] = useState(false);

  // Access marking handled by hook

  // Track scroll progress to mark step as attempted
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;

    if (scrollHeight <= 0) return;

    const progress = Math.min(scrollTop / scrollHeight, 1);
    
    // Mark step as attempted if user has scrolled more than 25% of the content
    if (progress > 0.25 && !isStepAttempted) {
      setIsStepAttempted(true);
      updateStepState(1, 1, {
        lastAccessed: Date.now()
      });
    }
    
    // Improved layer transitions with cleaner boundaries
    let currentLayer: ScrollState['currentLayer'];
    let scale = 1;

    if (progress < 0.2) {
      currentLayer = 'ai';
      scale = 1 + (progress / 0.2) * 0.3; // Gentle zoom to 1.3x
    } else if (progress < 0.45) {
      currentLayer = 'ml';
      const localProgress = (progress - 0.2) / 0.25;
      scale = 1.3 + localProgress * 0.4; // Zoom to 1.7x
    } else if (progress < 0.7) {
      currentLayer = 'dl';
      const localProgress = (progress - 0.45) / 0.25;
      scale = 1.7 + localProgress * 0.3; // Zoom to 2.0x
    } else {
      currentLayer = 'overview';
      const localProgress = (progress - 0.7) / 0.3;
      scale = 2.0 - localProgress * 1.0; // Zoom back to 1.0x
    }

    setScrollState({ currentLayer, progress, scale });
  }, [isStepAttempted, updateStepState]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use passive listener for better performance
    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const quizData = {
    question: "Which of the following scenarios is the best example of a Deep Learning system in action, and why?",
    type: "multiple" as const,
    options: [
      {
        text: "An automated email filter that blocks messages containing specific keywords like 'free prize' and 'click here'.",
        explanation: "A is an example of rule-based AI. It relies on explicit 'if-then' rules created by a programmer (if the email contains 'free prize,'' then block it). This is an early form of AI and doesn't involve learning from data"
      },
      {
        text: "A recommendation engine that suggests products on an e-commerce site based on a user's past purchases and browsing history.",
        explanation: "B is an example of Machine Learning. The system learns from large amounts of user data (past purchases, browsing history) to identify patterns and make future predictions. It's a subset of AI but doesn't necessarily use the complex, multi-layered neural networks characteristic of Deep Learning."
      },
      {
        text: "A facial recognition system that can accurately identify and tag a person in a photo, even when the lighting is poor or their face is partially obscured.",
        explanation: "C is a prime example of Deep Learning. Facial recognition tasks are highly complex, requiring the system to identify intricate features like edges, shapes, and textures, and then combine them to form a complete picture of a face. This is precisely what a deep neural network with many layers is designed to do. The ability to function in poor lighting or with partial occlusion demonstrates the system's capacity to learn hierarchical, complex representations from data, which is a hallmark of Deep Learning."
      },
    ],
    correct: 2,
    correctExplanation: "Excellent! Understanding this hierarchy is fundamental - it helps you see that Deep Learning breakthroughs are actually advances in the broader field of AI.",
    incorrectExplanation: "Remember the concentric circles: AI is the outer circle (broadest), ML is inside AI, and DL is inside ML (most specific)."
  };

  const handleQuizAnswer = (correct: boolean) => {
    // Quiz answer is now automatically saved by the Quiz component
    console.log('Step1 quiz answered:', correct ? 'correctly' : 'incorrectly');
    
    // Notify parent component that quiz state has changed
    notifyQuizChange();
  };

  // Detailed explanations for each layer
  const layerDetails = {
    ai: {
      title: "Artificial Intelligence (AI)",
      subtitle: "The Foundation of Intelligent Systems",
      description: "This is the outermost circle and the broadest concept. AI refers to the entire field of computer science dedicated to creating machines and systems that can perform tasks that typically require human intelligence. This includes a wide range of capabilities such as reasoning, problem-solving, perception, and learning. Importantly, AI is not a single technique; it can be implemented in various ways. Early AI systems, for instance, were often \"rule-based,\" where programmers manually coded a vast set of explicit if-then rules for the machine to follow, as was the case with the chess computer Deep Blue.",
      color: "blue",
      icon: "🧠",
      examples: [
        "Expert systems with rule-based logic",
        "Natural language processing applications",
        "Computer vision systems",
        "Robotics and autonomous systems",
        "Game-playing algorithms like Deep Blue"
      ]
    },
    ml: {
      title: "Machine Learning (ML)",
      subtitle: "Learning from Data",
      description: "This is a large and vital subset of AI. Instead of being explicitly programmed with rules, a machine learning system is \"trained\" by being shown large amounts of data. The algorithm learns the statistical patterns and relationships within that data and then uses that learned knowledge to make predictions or decisions about new, unseen data. This represents a fundamental shift from programming a computer on how to do something to enabling it to learn what to do from examples.",
      color: "teal",
      icon: "📊",
      examples: [
        "Email spam detection systems",
        "Recommendation algorithms (Netflix, Amazon)",
        "Fraud detection in banking",
        "Medical diagnosis assistance",
        "Stock market prediction models"
      ]
    },
    dl: {
      title: "Deep Learning (DL)",
      subtitle: "Neural Networks and Modern AI",
      description: "This is a further, highly specialized subset of Machine Learning. Deep learning is a technique that uses complex, multi-layered structures called artificial neural networks, which are inspired by the architecture of the human brain. The \"deep\" in deep learning refers to the many layers of neurons in these networks. This depth allows the model to learn patterns in a hierarchical way, identifying simple features in the early layers (like edges in an image) and combining them into more complex concepts in deeper layers (like faces or objects). Deep learning is the engine behind most of the recent breakthroughs in AI, including advanced image recognition and the large language models that power generative AI.",
      color: "amber",
      icon: "🔥",
      examples: [
        "GPT and large language models",
        "Image recognition (facial recognition)",
        "Self-driving car vision systems",
        "Voice assistants (Siri, Alexa)",
        "Medical image analysis (X-rays, MRIs)"
      ]
    }
  };

  // AI layer nodes
  const aiNodes: NodeData[] = [
    { id: 'robotics', title: 'Robotics', description: 'Autonomous machines', position: { top: '15%', left: '10%' }, color: 'text-green-300' },
    { id: 'nlp', title: 'NLP', description: 'Language understanding', position: { top: '20%', left: '85%' }, color: 'text-yellow-300' },
    { id: 'vision', title: 'Computer Vision', description: 'Visual interpretation', position: { top: '70%', left: '95%' }, color: 'text-red-300' },
    { id: 'expert', title: 'Expert Systems', description: 'Simulating judgment', position: { top: '80%', left: '10%' }, color: 'text-indigo-300' },
    { id: 'planning', title: 'Planning', description: 'Devising strategies', position: { top: '45%', left: '0%' }, color: 'text-purple-300' },
    { id: 'knowledge', title: 'Knowledge Rep.', description: 'Organizing knowledge', position: { top: '5%', left: '45%' }, color: 'text-pink-300' },
  ];

  // Machine Learning nodes
  const mlNodes: NodeData[] = [
    { id: 'supervised', title: 'Supervised', description: 'Labeled data', position: { top: '10%', left: '25%' }, color: 'text-cyan-300' },
    { id: 'unsupervised', title: 'Unsupervised', description: 'Unlabeled data', position: { top: '35%', left: '100%' }, color: 'text-cyan-300' },
    { id: 'reinforcement', title: 'Reinforcement', description: 'Trial & error', position: { top: '70%', left: '0%' }, color: 'text-cyan-300' },
  ];

  // Deep Learning nodes
  const dlNodes: NodeData[] = [
    { id: 'neural', title: 'Neural Networks', description: '', position: { top: '10%', left: '60%' }, color: 'text-orange-300' },
    { id: 'cnn', title: 'CNNs', description: '', position: { top: '35%', left: '85%' }, color: 'text-orange-300' },
    { id: 'rnn', title: 'RNNs', description: '', position: { top: '70%', left: '80%' }, color: 'text-orange-300' },
    { id: 'gan', title: 'GANs', description: '', position: { top: '65%', left: '0%' }, color: 'text-orange-300' },
    { id: 'transformer', title: 'Transformers', description: '', position: { top: '20%', left: '10%' }, color: 'text-orange-300' },
  ];

  return (
    <section className="relative bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="text-center mb-8 py-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent leading-relaxed">
          Deconstructing AI - The Core Hierarchy
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The relationship between AI, Machine Learning, and Deep Learning is best understood as a set of concentric circles, with each term representing a subset of the one before it
        </p>
      </div>

      {/* Interactive AI Hierarchy Visualization */}
      <div
        ref={containerRef}
        className="relative mx-auto max-w-6xl h-[600px] overflow-y-auto scroll-smooth bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 border border-gray-200 dark:border-gray-800 rounded-xl"
      >
        {/* Scrollable content with enough height for smooth transitions */}
        <div className="h-[2400px] relative">

          {/* Sticky visualization container */}
          <div className="sticky top-0 h-[600px] flex items-center justify-center overflow-hidden">

            {/* Main circle container with smooth scaling */}
            <div
              className="relative transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${scrollState.scale})`,
                transformOrigin: 'center center'
              }}
            >

              {/* Artificial Intelligence Circle */}
              <div
                className={`relative border-4 border-blue-500 dark:border-blue-400 rounded-full bg-blue-50/60 dark:bg-blue-950/60 backdrop-blur-sm shadow-2xl transition-all duration-500 ${scrollState.currentLayer === 'ai' ? 'ring-4 ring-blue-300 dark:ring-blue-600' : ''
                  }`}
                style={{
                  width: '500px',
                  height: '500px'
                }}
              >
                {/* AI Title */}
                <div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-30 ${scrollState.currentLayer === 'ai'
                    ? 'opacity-100 scale-100'
                    : scrollState.currentLayer === 'overview'
                      ? 'opacity-90 scale-100'
                      : 'opacity-0 scale-90'
                    }`}
                >
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100 text-center px-4 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border-2 border-blue-200 dark:border-blue-700 whitespace-nowrap">
                    Artificial Intelligence
                  </h1>
                </div>

                {/* AI Nodes */}
                {aiNodes.map((node, index) => (
                  <div
                    key={node.id}
                    className={`absolute text-center transition-all duration-500 group cursor-pointer z-20 ${scrollState.currentLayer === 'ai'
                      ? 'opacity-100 scale-100'
                      : scrollState.currentLayer === 'overview'
                        ? 'opacity-85 scale-100'
                        : 'opacity-10 scale-75'
                      }`}
                    style={{
                      top: node.position.top,
                      left: node.position.left,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-2 border border-gray-200 dark:border-gray-700 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 min-w-[90px] max-w-[120px]">
                      <h3 className={`${node.color} font-semibold text-xs sm:text-sm`}>{node.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-tight">{node.description}</p>
                    </div>
                  </div>
                ))}

                {/* Machine Learning Circle */}
                <div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-teal-500 dark:border-teal-400 rounded-full bg-teal-50/60 dark:bg-teal-950/60 backdrop-blur-sm shadow-xl transition-all duration-500 z-10 ${scrollState.currentLayer === 'ml' ? 'ring-4 ring-teal-300 dark:ring-teal-600' : ''
                    }`}
                  style={{
                    width: '340px',
                    height: '340px'
                  }}
                >
                  {/* ML Title */}
                  <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-25 ${scrollState.currentLayer === 'ml'
                      ? 'opacity-100 scale-100'
                      : scrollState.currentLayer === 'overview'
                        ? 'opacity-80 scale-95'
                        : 'opacity-0 scale-90'
                      }`}
                  >
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-teal-900 dark:text-teal-100 text-center px-4 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg border-2 border-teal-200 dark:border-teal-700 whitespace-nowrap">
                      Machine Learning
                    </h2>
                  </div>

                  {/* ML Nodes */}
                  {mlNodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={`absolute text-center transition-all duration-500 group cursor-pointer z-15 ${scrollState.currentLayer === 'ml'
                        ? 'opacity-100 scale-100'
                        : scrollState.currentLayer === 'overview'
                          ? 'opacity-75 scale-95'
                          : 'opacity-10 scale-75'
                        }`}
                      style={{
                        top: node.position.top,
                        left: node.position.left,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-2 border border-gray-200 dark:border-gray-700 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 min-w-[80px] max-w-[110px]">
                        <h3 className={`${node.color} font-semibold text-xs sm:text-sm`}>{node.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-tight">{node.description}</p>
                      </div>
                    </div>
                  ))}

                  {/* Deep Learning Circle */}
                  <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-amber-500 dark:border-amber-400 rounded-full bg-amber-50/60 dark:bg-amber-950/60 backdrop-blur-sm shadow-xl transition-all duration-500 z-10 ${scrollState.currentLayer === 'dl' ? 'ring-4 ring-amber-300 dark:ring-amber-600' : ''
                      }`}
                    style={{
                      width: '220px',
                      height: '220px'
                    }}
                  >
                    {/* DL Title */}
                    <div
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-20 ${scrollState.currentLayer === 'dl'
                        ? 'opacity-100 scale-100'
                        : scrollState.currentLayer === 'overview'
                          ? 'opacity-70 scale-90'
                          : 'opacity-0 scale-90'
                        }`}
                    >
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-amber-900 dark:text-amber-100 text-center px-3 py-2 bg-white/85 dark:bg-gray-900/85 backdrop-blur-sm rounded-lg shadow-md border border-amber-200 dark:border-amber-700 whitespace-nowrap">
                        Deep Learning
                      </h3>
                    </div>

                    {/* DL Nodes */}
                    {dlNodes.map((node, index) => (
                      <div
                        key={node.id}
                        className={`absolute text-center transition-all duration-500 group cursor-pointer z-10 ${scrollState.currentLayer === 'dl'
                          ? 'opacity-100 scale-100'
                          : scrollState.currentLayer === 'overview'
                            ? 'opacity-65 scale-90'
                            : 'opacity-10 scale-75'
                          }`}
                        style={{
                          top: node.position.top,
                          left: node.position.left,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-1.5 border border-gray-200 dark:border-gray-700 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 min-w-[60px] max-w-[80px]">
                          <h4 className={`${node.color} font-semibold text-xs`}>{node.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced end section with helpful information */}
      <div className="text-center max-w-2xl mx-auto mt-8">

        {/* Current layer indicator */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Focus:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${scrollState.currentLayer === 'ai' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
            scrollState.currentLayer === 'ml' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200' :
              scrollState.currentLayer === 'dl' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200' :
                'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
            }`}>
            {scrollState.currentLayer === 'ai' ? 'Artificial Intelligence' :
              scrollState.currentLayer === 'ml' ? 'Machine Learning' :
                scrollState.currentLayer === 'dl' ? 'Deep Learning' : 'Complete Overview'}
          </span>
        </div>

        {/* Read More Button */}
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


      {
        readmore && (
          <div id="read-more-section" className="bg-white dark:bg-gray-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Expandable Cards */}
              <div className="space-y-4">
                {Object.entries(layerDetails).map(([key, layer], index) => {
                  const isExpanded = expandedSection === key;
                  const colorClasses = {
                    blue: {
                      border: 'border-blue-500 dark:border-blue-400',
                      bg: 'bg-blue-50 dark:bg-blue-950/30',
                      text: 'text-blue-700 dark:text-blue-300',
                      button: 'bg-blue-500 hover:bg-blue-600'
                    },
                    teal: {
                      border: 'border-teal-500 dark:border-teal-400',
                      bg: 'bg-teal-50 dark:bg-teal-950/30',
                      text: 'text-teal-700 dark:text-teal-300',
                      button: 'bg-teal-500 hover:bg-teal-600'
                    },
                    amber: {
                      border: 'border-amber-500 dark:border-amber-400',
                      bg: 'bg-amber-50 dark:bg-amber-950/30',
                      text: 'text-amber-700 dark:text-amber-300',
                      button: 'bg-amber-500 hover:bg-amber-600'
                    }
                  };

                  const colors = colorClasses[layer.color as keyof typeof colorClasses];

                  return (
                    <div
                      key={key}
                      className={`bg-white dark:bg-gray-800 rounded-xl border-2 overflow-hidden transition-all duration-300 ${isExpanded ? `${colors.border} shadow-lg` : 'border-gray-200 dark:border-gray-700'
                        }`}
                    >
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : key)}
                        className={`w-full p-6 text-left transition-all duration-200 flex items-center justify-between group ${isExpanded ? colors.bg : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{layer.icon}</div>
                          <div className="flex-1">
                            <h4 className={`text-xl font-bold mb-1 ${colors.text}`}>
                              {layer.title}
                            </h4>
                            <p className={`text-sm ${colors.text} opacity-80`}>
                              {layer.subtitle}
                            </p>
                            {!isExpanded && (
                              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                Click to read more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={colors.text}>
                          <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          <div className="p-6 space-y-6">
                            {/* Detailed Description */}
                            <div>
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">What is {layer.title}?</h5>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                                {layer.description}
                              </p>
                            </div>

                            {/* Examples */}
                            <div>
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Real-World Examples:</h5>
                              <div className="grid md:grid-cols-2 gap-3">
                                {layer.examples.map((example, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                  >
                                    <div className={`w-2 h-2 rounded-full ${colors.button}`} />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{example}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Key Insight */}
                            <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
                              <h5 className={`font-semibold mb-2 ${colors.text}`}>💡 Key Insight</h5>
                              <p className={`text-sm ${colors.text} opacity-90`}>
                                {key === 'ai' && "AI is the foundation - it encompasses all methods to make machines intelligent, from simple rule-based systems to complex neural networks."}
                                {key === 'ml' && "Machine Learning revolutionized AI by enabling computers to learn from data rather than being explicitly programmed for every task."}
                                {key === 'dl' && "Deep Learning powers today's AI breakthroughs by using brain-inspired neural networks to understand complex patterns in data."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      }

      {/* Quiz Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Quiz
          quiz={quizData}
          moduleId={1}
          stepId={1}
          onAnswer={handleQuizAnswer}
          showExplanations={true}
          showResetButton={true}
        />
      </div>

    </section>
  );
};

export default Step1;