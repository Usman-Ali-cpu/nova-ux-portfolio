
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { RunEvent, RunRegistration } from '@/types';
import RunsListing from './RunsListing';

interface RunManagementTabsProps {
  isLoading: boolean;
  upcomingRuns: RunEvent[];
  pastRuns: RunEvent[];
  runParticipants: { [runId: string]: RunRegistration[] };
  onExportParticipants: (runId: string) => void;
}

const RunManagementTabs: React.FC<RunManagementTabsProps> = ({
  isLoading,
  upcomingRuns,
  pastRuns,
  runParticipants,
  onExportParticipants,
}) => {
  return (
    <Tabs defaultValue="upcoming" className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Runs</TabsTrigger>
          <TabsTrigger value="past">Past Runs</TabsTrigger>
        </TabsList>
        
        <Button variant="outline" asChild>
          <Link to="/runs">
            <ExternalLink className="mr-2 h-4 w-4" /> Browse Other Runs
          </Link>
        </Button>
      </div>
      
      {/* Upcoming Runs Tab */}
      <TabsContent value="upcoming">
        <RunsListing 
          runs={upcomingRuns}
          isLoading={isLoading}
          runParticipants={runParticipants}
          onExportParticipants={onExportParticipants}
        />
      </TabsContent>
      
      {/* Past Runs Tab */}
      <TabsContent value="past">
        <RunsListing 
          runs={pastRuns}
          isLoading={isLoading}
          runParticipants={runParticipants}
          onExportParticipants={onExportParticipants}
          isPastRuns={true}
        />
      </TabsContent>
    </Tabs>
  );
};

export default RunManagementTabs;
