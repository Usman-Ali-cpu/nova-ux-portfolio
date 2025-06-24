
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
              {user.businessDetails?.businessLocation && (
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {user.businessDetails.businessLocation}
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
