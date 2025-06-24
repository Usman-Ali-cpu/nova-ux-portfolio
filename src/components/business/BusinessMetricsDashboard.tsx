
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ChartLine, UserPlus } from 'lucide-react';

interface BusinessMetricsProps {
  totalUniqueRunners: number;
  repeatRunnersPercentage: number;
  averageRunnersPerEvent: number;
  communityReturnRate: number;
  newSignupsOverTime: {
    name: string;
    value: number;
  }[];
}

const BusinessMetricsDashboard: React.FC<BusinessMetricsProps> = ({
  totalUniqueRunners,
  repeatRunnersPercentage,
  averageRunnersPerEvent,
  newSignupsOverTime
}) => {
  // Calculate new runners this month (current month data from the array)
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const newRunnersThisMonth = newSignupsOverTime.find(item => item.name === currentMonth)?.value || 0;

  return (
    <div className="space-y-6 mt-6 mb-10">
      <h2 className="text-2xl font-semibold">Community Impact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Participants */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{totalUniqueRunners} runners reached</div>
            </div>
          </CardContent>
        </Card>
        
        {/* Repeat Runners */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Repeat Runners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {repeatRunnersPercentage}% <span className="text-base font-normal text-muted-foreground">have returned at least once</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Average Runners per Event */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average per Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ChartLine className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">Avg. {averageRunnersPerEvent} runners per event</div>
            </div>
          </CardContent>
        </Card>

        {/* New Runners This Month */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Runners This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserPlus className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{newRunnersThisMonth} new signups</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessMetricsDashboard;
