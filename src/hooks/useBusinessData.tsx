
import { useState, useEffect, useCallback, useMemo } from 'react';
import { RunEvent, RunRegistration } from '@/types';
import { isDatePast } from '@/utils/helpers';
import { useAuth } from '@/contexts/AuthContext';
import { runEventsService } from '@/services/runEventsService';
import { registrationService } from '@/services/registrationService';

export const useBusinessData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingRuns, setUpcomingRuns] = useState<RunEvent[]>([]);
  const [pastRuns, setPastRuns] = useState<RunEvent[]>([]);
  const [runParticipants, setRunParticipants] = useState<{ [runId: string]: RunRegistration[] }>({});
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [recentParticipants, setRecentParticipants] = useState<RunRegistration[]>([]);
  
  const { user } = useAuth();
  
  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchBusinessData = useCallback(async () => {
    if (!user || !user?.id || user.id.startsWith('temp-')) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Fetching business data for user:', user.id);
      
      let businessRuns: RunEvent[] = [];
      
      // Fetch business events from API
      if (user?.role === 'business') {
        try {
          console.log('Fetching business events for business ID:', user.id);
          const apiRuns = await runEventsService.getBusinessEvents(user.id);
          console.log('Fetched business events from API:', apiRuns);
          businessRuns = [...apiRuns];
        } catch (error) {
          console.error('Error fetching business events from API:', error);
          businessRuns = [];
        }
      }
      
      console.log('All business runs:', businessRuns);
      
      // Fetch registration data for each run with delay to avoid rate limiting
      const participants: { [runId: string]: RunRegistration[] } = {};
      let allParticipants: RunRegistration[] = [];
      
      // Process runs with delay to avoid rate limiting
      for (let i = 0; i < businessRuns.length; i++) {
        const run = businessRuns[i];
        try {
          console.log('Fetching registrations for run:', run.id);
          
          // Add delay between requests to avoid rate limiting
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          const runRegistrations = await registrationService.getEventRegistrations(run.id);
          console.log('Registrations for run', run.id, ':', runRegistrations);
          
          // Create clean copies to avoid circular references
          const cleanRegistrations = runRegistrations.map(reg => ({
            id: reg.id,
            runId: reg.runId,
            userId: reg.userId,
            userName: reg.userName,
            userEmail: reg.userEmail,
            userPace: reg.userPace,
            registeredAt: reg.registeredAt,
            status: reg.status
          }));
          
          participants[run.id] = cleanRegistrations;
          allParticipants = [...allParticipants, ...cleanRegistrations];
          
          // Update the run object with accurate participant count
          run.currentParticipants = cleanRegistrations.length;
        } catch (error) {
          console.error('Error fetching registrations for run', run.id, ':', error);
          participants[run.id] = [];
          run.currentParticipants = 0;
        }
      }
      
      // Split into upcoming and past runs AFTER getting participant counts
      const upcoming = businessRuns.filter(run => !isDatePast(run.date));
      const past = businessRuns.filter(run => isDatePast(run.date));
      
      // Sort upcoming runs by date (earliest first)
      upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Sort past runs by date (most recent first)
      past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Get recent participants (last 5, sorted by registration date)
      const recentSignups = allParticipants
        .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
        .slice(0, 5)
        .map(participant => ({
          id: participant.id,
          runId: participant.runId,
          userId: participant.userId,
          userName: participant.userName,
          userEmail: participant.userEmail,
          userPace: participant.userPace,
          registeredAt: participant.registeredAt,
          status: participant.status
        }));
      
      setUpcomingRuns(upcoming);
      setPastRuns(past);
      setRunParticipants(participants);
      setTotalParticipants(allParticipants.length);
      setRecentParticipants(recentSignups);
      
      console.log('Final business data set successfully');
      
    } catch (error) {
      console.error('Error fetching business data:', error);
      // Reset to empty state on error
      setUpcomingRuns([]);
      setPastRuns([]);
      setRunParticipants({});
      setTotalParticipants(0);
      setRecentParticipants([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.role]); // Only depend on user id and role

  // Fetch data when user changes
  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]);

  // Memoize the total run count to prevent unnecessary recalculations
  const getTotalRunCount = useMemo(() => {
    return upcomingRuns.length + pastRuns.length;
  }, [upcomingRuns.length, pastRuns.length]);
  
  return {
    isLoading,
    upcomingRuns,
    pastRuns,
    runParticipants,
    totalParticipants,
    recentParticipants,
    getTotalRunCount: () => getTotalRunCount
  };
};
