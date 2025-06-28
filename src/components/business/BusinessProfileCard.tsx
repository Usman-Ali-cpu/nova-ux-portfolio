
import React from 'react';
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
  const getBusinessLocationString = (): string => {
    if (!user.businessDetails?.businessLocation) return '';
    
    const location = user.businessDetails.businessLocation;
    
    // If it's already a string, return it
    if (typeof location === 'string') {
      return location;
    }
    
    // If it's an object with coordinates, return a formatted string
    if (typeof location === 'object' && location !== null && 'type' in location && 'data' in location) {
      const locationObj = location as { type: string; data: { lat: number; lng: number; } };
      if (locationObj.type === 'point' && locationObj.data) {
        const { lat, lng } = locationObj.data;
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    }
    
    return '';
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {user.businessDetails?.businessName || user.name}
              </h3>
              {getBusinessLocationString() && (
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {getBusinessLocationString()}
                </p>
              )}
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
