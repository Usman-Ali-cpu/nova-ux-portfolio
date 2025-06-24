
import React, { useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import BusinessWelcomeHeader from '@/components/business/BusinessWelcomeHeader';
import CreateRunCTA from '@/components/business/CreateRunCTA';
import RecentSignupsWidget from '@/components/business/RecentSignupsWidget';
import PromotionReminder from '@/components/business/PromotionReminder';
import RunManagementTabs from '@/components/business/RunManagementTabs';
import BusinessMetricsDashboard from '@/components/business/BusinessMetricsDashboard';
import { useBusinessData } from '@/hooks/useBusinessData';
import { useBusinessMetrics } from '@/hooks/useBusinessMetrics';

const BusinessHomePage = () => {
  const { user } = useAuth();
  const { 
    isLoading, 
    upcomingRuns, 
    pastRuns, 
    runParticipants, 
    totalParticipants, 
    recentParticipants, 
    getTotalRunCount 
  } = useBusinessData();
  
  // Memoize business runs to prevent unnecessary recalculations
  const businessRuns = useMemo(() => [...upcomingRuns, ...pastRuns], [upcomingRuns, pastRuns]);
  
  // Memoize metrics calculation
  const businessMetrics = useBusinessMetrics(businessRuns, runParticipants, totalParticipants);
  
  // Handle export participants
  const handleExportParticipants = (runId: string) => {
    // In a real app, this would generate and download a CSV
    console.log('Exporting participants for run:', runId);
    alert('CSV download started (simulated)');
  };

  // Get business name - only if user is business role and businessDetails exist
  const businessName = user?.role === 'business' && user?.businessDetails?.businessName 
    ? user.businessDetails.businessName 
    : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="app-container">
          {/* Header / Welcome */}
          <BusinessWelcomeHeader 
            businessName={businessName}
            totalRuns={getTotalRunCount()}
            totalParticipants={totalParticipants}
          />
          
          {/* Run Management Tabs - at the top */}
          <RunManagementTabs 
            isLoading={isLoading}
            upcomingRuns={upcomingRuns}
            pastRuns={pastRuns}
            runParticipants={runParticipants}
            onExportParticipants={handleExportParticipants}
          />

          {/* Promotion Reminder - right below the RunManagementTabs */}
          <PromotionReminder />
          
          {/* Recent Participant Snapshot - now right after Promotion Reminder */}
          <div className="my-8">
            <RecentSignupsWidget 
              isLoading={isLoading} 
              recentParticipants={recentParticipants}
            />
          </div>

          {/* Business Metrics Dashboard */}
          <BusinessMetricsDashboard
            totalUniqueRunners={businessMetrics.totalUniqueRunners}
            repeatRunnersPercentage={businessMetrics.repeatRunnersPercentage}
            averageRunnersPerEvent={businessMetrics.averageRunnersPerEvent}
            communityReturnRate={businessMetrics.communityReturnRate}
            newSignupsOverTime={businessMetrics.newSignupsOverTime}
          />

          {/* Add more vertical space before the CreateRunCTA */}
          <div className="mt-16">
            {/* Create a Run CTA - moved further down with additional spacing */}
            <CreateRunCTA />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BusinessHomePage;
