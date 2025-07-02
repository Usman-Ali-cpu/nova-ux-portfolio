
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, MapPin, Calendar, Users, Globe, Linkedin, Instagram, Facebook, Twitter } from 'lucide-react';
import BusinessFeed from '@/components/business/BusinessFeed';
import BusinessEventHistory from '@/components/business/BusinessEventHistory';
import BusinessUpcomingEvents from '@/components/business/BusinessUpcomingEvents';
import { usersApi } from '@/services/api';
import { transformXanoUser } from '@/services/dataTransforms';
import { User as AuthUser } from '@/contexts/auth/types';
import { toast } from 'sonner';
import { formatLocationForDisplay, formatLocationSync } from '@/utils/locationHelpers';

const PublicBusinessProfilePage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationName, setLocationName] = useState<string>('');

  useEffect(() => {
    if (businessId) {
      fetchBusinessProfile();
    }
  }, [businessId]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchLocationName = async () => {
      if (!business?.businessDetails?.businessLocation) {
        if (isMounted) setLocationName('Location not specified');
        return;
      }
      
      // Set initial value synchronously
      const syncLocation = formatLocationSync(business.businessDetails.businessLocation);
      if (isMounted) setLocationName(syncLocation);
      
      // Try to get a better human-readable address asynchronously
      try {
        const asyncLocation = await formatLocationForDisplay(business.businessDetails.businessLocation);
        if (isMounted && asyncLocation !== syncLocation) {
          setLocationName(asyncLocation);
        }
      } catch (error) {
        console.error('Failed to load location:', error);
        // Keep the sync location if async fails
      }
    };
    
    fetchLocationName();
    
    return () => {
      isMounted = false;
    };
  }, [business?.businessDetails?.businessLocation]);

  const fetchBusinessProfile = async () => {
    try {
      setIsLoading(true);
      const xanoUser = await usersApi.getUser(Number(businessId));
      const businessUser = transformXanoUser(xanoUser);
      setBusiness(businessUser);
    } catch (error) {
      console.error('Error fetching business profile:', error);
      toast.error('Failed to load business profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'website': return Globe;
      case 'linkedin': return Linkedin;
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      default: return Globe;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="app-container">
            <div className="space-y-4">
              <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="app-container">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
              <p className="text-gray-600">The business profile you're looking for doesn't exist.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="app-container">
          {/* Business Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {business?.businessDetails?.businessName || business?.name}
                  </h1>
                  {locationName && (
                    <p className="text-gray-600 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      {locationName}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Community Host
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Run Organizer
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About This Business</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">
                  {business?.businessDetails?.description || 
                    (business?.businessDetails?.businessName ? 
                      `Welcome to ${business.businessDetails.businessName}! We're passionate about building community through running and bringing people together for healthy, active lifestyles.` :
                      'We\'re passionate about building community through running and bringing people together for healthy, active lifestyles.'
                    )
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-1">
                    <p className="text-gray-600">{business?.email}</p>
                    {business?.businessDetails?.businessPhone && (
                      <p className="text-gray-600">{business.businessDetails.businessPhone}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-600">
                    {locationName || 'Location not specified'}
                  </p>
                </div>
              </div>

              {business?.businessDetails?.socialLinks && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Social Media</h4>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(business.businessDetails.socialLinks).map(([platform, url]) => {
                      if (!url) return null;
                      const IconComponent = getSocialIcon(platform);
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                        >
                          <IconComponent className="w-4 h-4" />
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Content Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="feed">Updates & Feed</TabsTrigger>
              <TabsTrigger value="events">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <BusinessUpcomingEvents businessId={business?.id} />
            </TabsContent>

            <TabsContent value="feed">
              <BusinessFeed businessId={business?.id} />
            </TabsContent>

            <TabsContent value="events">
              <BusinessEventHistory businessId={business?.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicBusinessProfilePage;
