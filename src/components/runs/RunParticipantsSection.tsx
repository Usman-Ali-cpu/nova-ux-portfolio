
import React, { useState, useEffect } from 'react';
import { getRemainingSpots } from '@/utils/helpers';
import { RunEvent } from '@/types';
import { registrationService } from '@/services/registrationService';

interface RunParticipantsSectionProps {
  run: RunEvent;
  refreshKey?: number; // Add refresh key prop for parent-triggered updates
}

const RunParticipantsSection: React.FC<RunParticipantsSectionProps> = ({ run, refreshKey = 0 }) => {
  const [currentParticipants, setCurrentParticipants] = useState(run.currentParticipants || 0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current participant count
  useEffect(() => {
    const fetchParticipantCount = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching participant count for run:', run.id);
        const registrations = await registrationService.getEventRegistrations(run.id);
        console.log('Current registrations:', registrations);
        
        setCurrentParticipants(registrations.length);
      } catch (error) {
        console.error('Error fetching participant count:', error);
        // Keep the original count if API fails
        setCurrentParticipants(run.currentParticipants || 0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipantCount();
  }, [run.id, run.currentParticipants, refreshKey]); // Add refreshKey as dependency

  const remainingSpots = getRemainingSpots(run.maxParticipants, currentParticipants);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Participants</h2>
        <span className="text-sm text-muted-foreground">
          {isLoading ? 'Loading...' : `${currentParticipants} joined`}
          {!isLoading && remainingSpots !== null && ` · ${remainingSpots} spots left`}
        </span>
      </div>
    </div>
  );
};

export default RunParticipantsSection;
