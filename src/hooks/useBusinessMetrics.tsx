
import { useState, useEffect } from 'react';
import { RunEvent, RunRegistration } from '@/types';
import { format, subMonths } from 'date-fns';

export const useBusinessMetrics = (
  businessRuns: RunEvent[], 
  participants: { [runId: string]: RunRegistration[] },
  totalParticipants: number
) => {
  const [totalUniqueRunners, setTotalUniqueRunners] = useState(0);
  const [repeatRunnersPercentage, setRepeatRunnersPercentage] = useState(0);
  const [averageRunnersPerEvent, setAverageRunnersPerEvent] = useState(0);
  const [communityReturnRate, setCommunityReturnRate] = useState(0);
  const [newSignupsOverTime, setNewSignupsOverTime] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    calculateBusinessMetrics();
  }, [businessRuns, participants, totalParticipants]);

  // Calculate business metrics from real data
  const calculateBusinessMetrics = () => {
    // 1. Total unique runners (count distinct user IDs)
    const allParticipantIds = new Set<string>();
    
    Object.values(participants).forEach(runParticipants => {
      runParticipants.forEach(participant => {
        allParticipantIds.add(participant.userId);
      });
    });
    
    const uniqueRunnersCount = allParticipantIds.size;
    setTotalUniqueRunners(uniqueRunnersCount);
    
    // 2. Repeat runners percentage (runners who attended more than one event)
    const userRunCounts = new Map<string, number>();
    
    Object.values(participants).forEach(runParticipants => {
      runParticipants.forEach(participant => {
        const currentCount = userRunCounts.get(participant.userId) || 0;
        userRunCounts.set(participant.userId, currentCount + 1);
      });
    });
    
    const repeatRunners = Array.from(userRunCounts.values()).filter(count => count > 1).length;
    const repeatPercentage = uniqueRunnersCount > 0 
      ? Math.round((repeatRunners / uniqueRunnersCount) * 100) 
      : 0;
    
    setRepeatRunnersPercentage(repeatPercentage);
    
    // 3. Average runners per event
    const totalEvents = businessRuns.length;
    const avgPerEvent = totalEvents > 0 
      ? Math.round(totalParticipants / totalEvents) 
      : 0;
    
    setAverageRunnersPerEvent(avgPerEvent);

    // 4. Community return rate - calculate percentage of first-time runners who came back
    // Get all unique runners
    const runnersFirstEventMap = new Map<string, Date>();
    const runnersWithMultipleEvents = new Set<string>();
    
    // Process all registrations chronologically to track first events and returns
    const allRegistrations = Object.values(participants).flat().sort(
      (a, b) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
    );
    
    allRegistrations.forEach(reg => {
      const runnerId = reg.userId;
      const regDate = new Date(reg.registeredAt);
      
      if (!runnersFirstEventMap.has(runnerId)) {
        // First time we're seeing this runner
        runnersFirstEventMap.set(runnerId, regDate);
      } else {
        // This runner has been to multiple events
        runnersWithMultipleEvents.add(runnerId);
      }
    });
    
    // Calculate return rate
    const totalFirstTimeRunners = runnersFirstEventMap.size;
    const returnedRunners = runnersWithMultipleEvents.size;
    const returnRate = totalFirstTimeRunners > 0 
      ? Math.round((returnedRunners / totalFirstTimeRunners) * 100) 
      : 0;
    
    setCommunityReturnRate(returnRate);
    
    // 5. New signups over time - registrations by month
    // Create array of last 6 months
    const signupsByMonth = new Map<string, number>();
    const today = new Date();
    
    // Initialize with last 6 months (including current)
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      const monthKey = format(monthDate, 'MMM');
      signupsByMonth.set(monthKey, 0);
    }
    
    // Count registrations by month
    allRegistrations.forEach(registration => {
      const regDate = new Date(registration.registeredAt);
      // Only count if within last 6 months
      if (regDate >= subMonths(today, 6)) {
        const monthKey = format(regDate, 'MMM');
        const currentCount = signupsByMonth.get(monthKey) || 0;
        signupsByMonth.set(monthKey, currentCount + 1);
      }
    });
    
    // Convert to chart format
    const signupsData = Array.from(signupsByMonth).map(([name, value]) => ({
      name,
      value
    }));
    
    setNewSignupsOverTime(signupsData);
  };

  return {
    totalUniqueRunners,
    repeatRunnersPercentage,
    averageRunnersPerEvent,
    communityReturnRate,
    newSignupsOverTime
  };
};
