
import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { runEventsService } from '@/services/runEventsService';
import { formatDate } from '@/utils/helpers';
import { RunEvent } from '@/types';

const WeeklyRunsCarousel: React.FC = () => {
  // Use the same query key and settings as RunsPage to share cache
  const { data: allRuns = [], isLoading } = useQuery<RunEvent[]>({
    queryKey: ['runs'], // Same key as RunsPage
    queryFn: runEventsService.getAllEvents,
    staleTime: 10 * 60 * 1000, // 10 minutes - same as RunsPage
    gcTime: 30 * 60 * 1000, // 30 minutes - same as RunsPage
    retry: (failureCount, error) => {
      // Don't retry on rate limit errors
      if (error && error.toString().includes('429')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 5000,
  });

  // Memoize upcoming runs calculation
  const upcomingRuns = useMemo(() => {
    return allRuns
      .filter(run => new Date(run.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6); // Limit to 6 runs for grid display
  }, [allRuns]);

  // Memoize image URL function
  const getImageUrl = useCallback((run: RunEvent) => {
    if (run.imageUrl && run.imageUrl.trim() !== '' && run.imageUrl.startsWith('http')) {
      return run.imageUrl;
    }
    
    const numericId = parseInt(run.id);
    if (!isNaN(numericId)) {
      return `https://fvapuajektabkszgdpic.supabase.co/storage/v1/object/public/event-images/events/event-${run.id}.jpg`;
    }
    
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const fallbackUrl = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    if (target.src !== fallbackUrl) {
      target.src = fallbackUrl;
    }
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (upcomingRuns.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No upcoming runs</h3>
          <p className="text-muted-foreground mb-4">
            Check back later for new running events.
          </p>
          <Link to="/runs">
            <Button>Find Runs</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {upcomingRuns.map((run) => (
        <Link key={run.id} to={`/runs/${run.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 h-full">
            <div className="aspect-[4/3] relative">
              <img
                src={getImageUrl(run)}
                alt={run.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/60 to-transparent">
                <Badge
                  className={
                    run.paceCategory === 'beginner' 
                      ? 'badge-beginner' 
                      : run.paceCategory === 'intermediate' 
                      ? 'badge-intermediate' 
                      : 'badge-advanced'
                  }
                >
                  {run.paceCategory}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{run.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(run.date)} at {run.time}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{run.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {run.distance} km
                </span>
                <Button size="sm" variant="outline" className="hover:bg-gray-100 hover:text-pacers-blue">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default WeeklyRunsCarousel;
