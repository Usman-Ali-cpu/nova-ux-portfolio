
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { RunEvent } from '@/types';

interface RunHeroSectionProps {
  run: RunEvent;
}

const RunHeroSection: React.FC<RunHeroSectionProps> = ({ run }) => {
  // Get the display name for the host
  const getHostDisplayName = () => {
    if (run.hostContactInfo?.businessName) {
      return run.hostContactInfo.businessName;
    }
    if (run.hostName && run.hostName !== 'Business Host') {
      return run.hostName;
    }
    return 'Business Host';
  };

  // Construct Supabase image URL based on event ID
  const getImageUrl = () => {
    console.log('RunHeroSection - Getting image URL for run:', {
      id: run.id,
      imageUrl: run.imageUrl
    });
    if (run.imageUrl && run.imageUrl !== '') {
      console.log('RunHeroSection - Using provided imageUrl:', run.imageUrl);
      return run.imageUrl;
    }

    // For Xano events (numeric IDs), try to construct Supabase URL
    if (!isNaN(parseInt(run.id))) {
      const constructedUrl = `https://fvapuajektabkszgdpic.supabase.co/storage/v1/object/public/event-images/events/event-${run.id}.jpg`;
      console.log('RunHeroSection - Constructed Supabase URL:', constructedUrl);
      return constructedUrl;
    }

    // Default fallback
    console.log('RunHeroSection - Using fallback image');
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.log('RunHeroSection - Image failed to load:', {
      originalSrc: target.src,
      eventId: run.id,
      error: e
    });

    // Use a reliable running image from Unsplash
    target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80';
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.log('RunHeroSection - Image loaded successfully:', {
      src: target.src,
      eventId: run.id
    });
  };

  return (
    <AspectRatio ratio={3 / 4} className="relative rounded-lg overflow-hidden">
      <img 
        src={getImageUrl()} 
        alt={run.title} 
        className="w-full h-full object-cover" 
        onError={handleImageError} 
        onLoad={handleImageLoad} 
        loading="eager" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 px-[24px]">
        <Badge className={
          run.paceCategory === 'beginner' ? 'badge-beginner mb-2 self-start' : 
          run.paceCategory === 'intermediate' ? 'badge-intermediate mb-2 self-start' : 
          'badge-advanced mb-2 self-start'
        }>
          {run.paceCategory}
        </Badge>
        <h1 className="text-2xl md:text-3xl font-bold text-white">{run.title}</h1>
        <p className="text-white/80">Hosted by {getHostDisplayName()}</p>
      </div>
    </AspectRatio>
  );
};

export default RunHeroSection;
