
import React, { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { formatDate, formatPace, getRemainingSpots } from '@/utils/helpers';
import { RunEvent } from '@/types';

interface RunCardProps {
  run: RunEvent;
  className?: string;
}

const RunCard: React.FC<RunCardProps> = memo(({ run, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const remainingSpots = getRemainingSpots(run.maxParticipants, run.currentParticipants);
  
  // Memoize image URL calculation
  const imageUrl = React.useMemo(() => {
    if (imageError) {
      return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
    
    if (run.imageUrl && run.imageUrl.trim() !== '' && run.imageUrl.startsWith('http')) {
      return run.imageUrl;
    }
    
    const numericId = parseInt(run.id);
    if (!isNaN(numericId)) {
      return `https://fvapuajektabkszgdpic.supabase.co/storage/v1/object/public/event-images/events/event-${run.id}.jpg`;
    }
    
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  }, [run.imageUrl, run.id, imageError]);
  
  const handleImageError = useCallback(() => {
    if (!imageError) {
      setImageError(true);
      setImageLoading(false);
    }
  }, [imageError]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);
  
  return (
    <Link to={`/runs/${run.id}`}>
      <Card className={`overflow-hidden hover:card-shadow transition-shadow duration-300 h-full ${className}`}>
        <AspectRatio ratio={3/4} className="relative">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={run.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
            decoding="async"
            style={{ display: (imageLoading && !imageError) ? 'none' : 'block' }}
          />
          <div className="absolute top-0 left-0 w-full px-4 py-2 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex justify-between items-start">
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
              <Badge variant="outline" className="bg-white/80">
                {formatDate(run.date)}
              </Badge>
            </div>
          </div>
        </AspectRatio>
        
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-lg line-clamp-1">{run.title}</h3>
          
          <p className="text-sm text-muted-foreground line-clamp-1">
            Hosted by {run.hostName}
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
            <div>
              <p className="text-muted-foreground">Distance</p>
              <p className="font-medium">{run.distance} km</p>
            </div>
            <div>
              <p className="text-muted-foreground">Pace</p>
              <p className="font-medium">{formatPace(run.pace)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Time</p>
              <p className="font-medium">{run.time}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Spots Left</p>
              <p className="font-medium">
                {remainingSpots !== null ? remainingSpots : 'Unlimited'}
              </p>
            </div>
          </div>
          
          {run.tags && run.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {run.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
});

RunCard.displayName = 'RunCard';

export default RunCard;
