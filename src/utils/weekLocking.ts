import React from 'react';

// Week locking utility with countdown functionality

export interface WeekLockInfo {
  weekId: number;
  isLocked: boolean;
  unlockDate: Date;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  countdownText: string;
}

// Base date - adjust this to your desired start date
const WEEK_1_LAUNCH_DATE = new Date('2025-01-01T00:00:00Z');

// Week unlock schedule (in days from Week 1 launch)
const WEEK_UNLOCK_SCHEDULE: Record<number, number> = {
  1: 0,   // Week 1: Available immediately
  2: 6,   // Week 2: Unlocks in 6 days
  3: 13,  // Week 3: Unlocks in 13 days (example)
  4: 20,  // Week 4: Unlocks in 20 days
  5: 27,  // Week 5: Unlocks in 27 days
  6: 34,  // Week 6: Unlocks in 34 days
};

/**
 * Gets the unlock date for a specific week
 */
export const getWeekUnlockDate = (weekId: number): Date => {
  const daysOffset = WEEK_UNLOCK_SCHEDULE[weekId] || 0;
  const unlockDate = new Date(WEEK_1_LAUNCH_DATE);
  unlockDate.setDate(unlockDate.getDate() + daysOffset);
  return unlockDate;
};

/**
 * Calculates time remaining until a week unlocks
 */
export const getTimeRemaining = (targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
} => {
  const now = new Date();
  const totalMs = targetDate.getTime() - now.getTime();
  
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }
  
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, totalMs };
};

/**
 * Formats countdown text for display
 */
export const formatCountdownText = (days: number, hours: number, minutes: number): string => {
  if (days > 0) {
    if (days === 1) {
      return `Unlocks in ${days} day`;
    }
    return `Unlocks in ${days} days`;
  }
  
  if (hours > 0) {
    return `Unlocks in ${hours}h ${minutes}m`;
  }
  
  return `Unlocks in ${minutes} minutes`;
};

/**
 * Checks if a week is currently locked based on time
 */
export const isWeekTimeLocked = (weekId: number): boolean => {
  // Week 1 is always unlocked
  if (weekId === 1) return false;
  
  const unlockDate = getWeekUnlockDate(weekId);
  const now = new Date();
  return now < unlockDate;
};

/**
 * Gets comprehensive lock information for a week
 */
export const getWeekLockInfo = (weekId: number): WeekLockInfo => {
  const unlockDate = getWeekUnlockDate(weekId);
  const timeRemaining = getTimeRemaining(unlockDate);
  const isLocked = isWeekTimeLocked(weekId);
  
  return {
    weekId,
    isLocked,
    unlockDate,
    daysRemaining: timeRemaining.days,
    hoursRemaining: timeRemaining.hours,
    minutesRemaining: timeRemaining.minutes,
    countdownText: formatCountdownText(timeRemaining.days, timeRemaining.hours, timeRemaining.minutes)
  };
};

/**
 * Gets lock information for all weeks
 */
export const getAllWeeksLockInfo = (): WeekLockInfo[] => {
  return Object.keys(WEEK_UNLOCK_SCHEDULE).map(weekId => 
    getWeekLockInfo(parseInt(weekId))
  );
};

/**
 * Hook to get real-time countdown updates
 */
export const useWeekCountdown = (weekId: number) => {
  const [lockInfo, setLockInfo] = React.useState<WeekLockInfo>(() => getWeekLockInfo(weekId));
  
  React.useEffect(() => {
    // Update immediately
    setLockInfo(getWeekLockInfo(weekId));
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      const newLockInfo = getWeekLockInfo(weekId);
      setLockInfo(newLockInfo);
      
      // Clear interval if week is unlocked
      if (!newLockInfo.isLocked) {
        clearInterval(interval);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [weekId]);
  
  return lockInfo;
};

