import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import timelineData from '@/data/Timeline.json';
import { Clock, Calendar, TrendingUp, Database, Brain } from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineCategory {
  category: string;
  color: string;
  events: TimelineEvent[];
}

interface SelectedEvent extends TimelineEvent {
  color: string;
  category: string;
}

const colors = {
  blue: "border-blue-500 bg-blue-500",
  green: "border-green-500 bg-green-500", 
  yellow: "border-yellow-500 bg-yellow-500",
  mix: "border-purple-500 bg-purple-500",
} as const;

const categoryIcons = {
  "Algorithmic Advancements": Brain,
  "Explosion of Data": Database,
  "Exponential increases in computing power and storage": TrendingUp,
  "all mixed": Clock,
} as const;

const TimelinePage: React.FC = () => {
  const [selected, setSelected] = useState<SelectedEvent | null>(null);
  const [view, setView] = useState<'parallel' | 'merged'>('parallel');
  
  const typedTimelineData = timelineData as TimelineCategory[];

  // Split categories for parallel view
  const categories = {
    blue: typedTimelineData.find(c => c.category === "Algorithmic Advancements")?.events || [],
    green: typedTimelineData.find(c => c.category === "Explosion of Data")?.events || [],
    yellow: typedTimelineData.find(c => c.category.includes("Exponential"))?.events || [],
    mix: typedTimelineData.find(c => c.category === "all mixed")?.events || [],
  };

  // Get all events for merged view
  const getAllEvents = (): (TimelineEvent & { color: string; category: string })[] => {
    const allEvents: (TimelineEvent & { color: string; category: string })[] = [];
    
    typedTimelineData.forEach(categoryData => {
      const color = categoryData.color === 'mix' ? 'purple' : categoryData.color;
      categoryData.events.forEach(event => {
        allEvents.push({
          ...event,
          color,
          category: categoryData.category
        });
      });
    });
    
    return allEvents.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  };

  const handleEventClick = (event: TimelineEvent, color: string, category: string): void => {
    setSelected({ ...event, color, category });
  };

  const getCategoryIcon = (category: string): React.ReactNode => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  const renderParallelView = (): React.ReactNode => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {(["blue", "green", "yellow"] as const).map((color) => {
        const categoryData = typedTimelineData.find(c => c.color === color);
        return (
          <div key={color} className="relative flex flex-col items-center">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 mb-4 rounded-lg shadow-md w-full">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${colors[color]}`} />
                {categoryData && getCategoryIcon(categoryData.category)}
              </div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                {categoryData?.category || 'Unknown Category'}
              </h3>
            </div>
            
            <div className="relative flex flex-col items-center w-full">
              <div className="absolute top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600" />
              {categories[color].map((event, idx) => (
                <Tooltip key={`${color}-${idx}`}>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEventClick(event, color, categoryData?.category || '')}
                      className={`relative z-10 w-5 h-5 rounded-full ${colors[color]} my-6 shadow-lg hover:shadow-xl transition-all duration-200`}
                      title={event.title}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="font-semibold">{event.year}</p>
                    <p className="text-sm">{event.title}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMixedSection = (): React.ReactNode => (
    <div className="mt-16">
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className={`w-3 h-3 rounded-full ${colors.mix}`} />
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
          Combined Timeline Events
        </h3>
      </div>
      
      <div className="flex flex-col items-center relative">
        <div className="absolute top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600" />
        {categories.mix.map((event, idx) => (
          <Tooltip key={`mix-${idx}`}>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEventClick(event, 'mix', 'Combined Events')}
                className={`relative z-10 w-5 h-5 rounded-full ${colors.mix} my-6 shadow-lg hover:shadow-xl transition-all duration-200`}
              />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-semibold">{event.year}</p>
              <p className="text-sm">{event.title}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );

  const renderMergedView = (): React.ReactNode => {
    const allEvents = getAllEvents();
    
    return (
      <div className="flex flex-col items-center relative max-w-2xl mx-auto">
        <div className="absolute top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600" />
        {allEvents.map((event, idx) => (
          <Tooltip key={`merged-${idx}`}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative z-10 flex items-center w-full my-4"
              >
                <div className="flex items-center justify-center w-16">
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEventClick(event, event.color, event.category)}
                    className={`w-4 h-4 rounded-full border-2 border-${event.color}-500 bg-${event.color}-500 shadow-lg hover:shadow-xl transition-all duration-200`}
                  />
                </div>
                <div className="ml-4 flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{event.year}</span>
                    <span className={`text-xs px-2 py-1 rounded bg-${event.color}-100 dark:bg-${event.color}-900 text-${event.color}-800 dark:text-${event.color}-200`}>
                      {event.color}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{event.title}</p>
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="font-semibold">{event.category}</p>
              <p className="text-sm">{event.title}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="AI Development Timeline"
            description="Explore the key milestones that shaped artificial intelligence across algorithms, data, and computational power."
            icon={<Clock className="w-5 h-5 text-primary-600 dark:text-primary-300" />}
            actions={
              <div className="flex gap-2">
                <button
                  onClick={() => setView('parallel')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    view === 'parallel'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Parallel View
                </button>
                <button
                  onClick={() => setView('merged')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    view === 'merged'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Chronological View
                </button>
              </div>
            }
          />

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            {view === 'parallel' ? (
              <>
                {renderParallelView()}
                {renderMixedSection()}
              </>
            ) : (
              renderMergedView()
            )}
          </div>

          {/* Event Detail Modal */}
          <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-3">
                  <span
                    className={`inline-block w-4 h-4 rounded-full ${
                      selected ? colors[selected.color as keyof typeof colors] : ""
                    }`}
                  />
                  <span>{selected?.year} — {selected?.title}</span>
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{selected?.category}</span>
                </div>
              </DialogHeader>
              <DialogDescription className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {selected?.description}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </motion.div>
      </DashboardLayout>
    </TooltipProvider>
  );
};

export default TimelinePage;