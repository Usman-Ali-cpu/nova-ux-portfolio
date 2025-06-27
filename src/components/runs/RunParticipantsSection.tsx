
import React, { useState, useEffect } from 'react';
import { getRemainingSpots } from '@/utils/helpers';
import { RunEvent } from '@/types';
import { registrationService } from '@/services/registrationService';

interface RunParticipantsSectionProps {
  run: RunEvent;
  refreshKey?: number;
}

const RunParticipantsSection: React.FC<RunParticipantsSectionProps> = ({ run, refreshKey = 0 }) => {
  const [currentParticipants, setCurrentParticipants] = useState(run.currentParticipants || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState([]);

  // Fetch current participant count and participant details
  useEffect(() => {
    const fetchParticipantData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching participant data for run:', run.id);
        const registrations = await registrationService.getEventRegistrations(run.id);
        console.log('Current registrations:', registrations);
        
        setCurrentParticipants(registrations.length);
        setParticipants(registrations);
      } catch (error) {
        console.error('Error fetching participant data:', error);
        setCurrentParticipants(run.currentParticipants || 0);
        setParticipants([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipantData();
  }, [run.id, run.currentParticipants, refreshKey]);

  const remainingSpots = getRemainingSpots(run.maxParticipants, currentParticipants);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Participants</h2>
          <span className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${currentParticipants} joined`}
            {!isLoading && remainingSpots !== null && ` · ${remainingSpots} spots left`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RunParticipantsSection;
