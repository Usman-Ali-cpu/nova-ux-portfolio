
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ArrowRight, MapPin, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as AuthUser } from '@/contexts/auth/types';

interface BusinessProfileCardProps {
  user: AuthUser;
}

const BusinessProfileCard: React.FC<BusinessProfileCardProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate('/business/profile');
  };

  // Helper function to safely get business location string
  const getBusinessLocationString = async (location: string | { type: string; data: { lat: number; lng: number } }) => {
    // If it's already a string, return it directly
    if (typeof location === 'string') {
      return location;
    }

    // If it's an object with coordinates, try to get a human-readable address
    if (location?.type === 'point' && location.data) {
      const { lat, lng } = location.data;
      
      // First check if we have a Google Maps API key
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.warn('Google Maps API key not found. Using coordinates instead of address.');
        return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
      
      // Try to get a human-readable address using reverse geocoding
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error(`Geocoding request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return the formatted address if available
        if (data.results?.[0]?.formatted_address) {
          return data.results[0].formatted_address;
        }
        
        // If no formatted address, try to construct one from address components
        if (data.results?.[0]?.address_components) {
          const components = data.results[0].address_components;
          const street = components.find(c => c.types.includes('route'))?.long_name || '';
          const number = components.find(c => c.types.includes('street_number'))?.long_name || '';
          const city = components.find(c => 
            c.types.includes('locality') || 
            c.types.includes('postal_town')
          )?.long_name || '';
          
          if (street || city) {
            return [number, street, city].filter(Boolean).join(', ');
          }
        }
      } catch (error) {
        console.error('Error fetching location name:', error);
      }
      
      // Fallback to coordinates if everything else fails
      return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    
    return 'Location not specified';
  };

  const [locationName, setLocationName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchLocationName = async () => {
      if (!user?.businessDetails?.businessLocation) {
        if (isMounted) setLocationName('Location not specified');
        return;
      }
      
      try {
        const name = await getBusinessLocationString(user.businessDetails.businessLocation);
        if (isMounted) {
          setLocationName(name);
        }
      } catch (error) {
        console.error('Failed to load location:', error);
        if (isMounted) {
          setLocationName('Location not available');
        }
      }
    };
    
    fetchLocationName();
    
    return () => {
      isMounted = false;
    };
  }, [user?.businessDetails?.businessLocation]);

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.role}</p>
             
              <p className="text-sm text-gray-500 mt-1">Manage your business profile and updates</p>
            </div>
          </div>
          <Button 
            onClick={handleViewProfile}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            View Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessProfileCard;
