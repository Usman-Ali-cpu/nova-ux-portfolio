
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, MapPin, Calendar, Users, Edit } from 'lucide-react';
import BusinessProfileEditDialog from '@/components/business/BusinessProfileEditDialog';
import BusinessFeed from '@/components/business/BusinessFeed';
import BusinessEventHistory from '@/components/business/BusinessEventHistory';

const BusinessProfilePage = () => {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!user || user.role !== 'business') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Access denied. Business account required.</p>
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
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user.businessDetails?.businessName || user.name}
                    </h1>
                    {user.businessDetails?.businessLocation && (
                      <p className="text-gray-600 flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        {user.businessDetails.businessLocation}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Member since {new Date().getFullYear()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Community Builder
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsEditDialogOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content Tabs */}
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed">Updates & Feed</TabsTrigger>
              <TabsTrigger value="events">Event History</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="feed">
              <BusinessFeed businessId={user.id} />
            </TabsContent>

            <TabsContent value="events">
              <BusinessEventHistory businessId={user.id} />
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Our Business</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">
                      {user.businessDetails?.businessName ? 
                        `Welcome to ${user.businessDetails.businessName}! We're passionate about building community through running and bringing people together for healthy, active lifestyles.` :
                        'We\'re passionate about building community through running and bringing people together for healthy, active lifestyles.'
                      }
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                      <p className="text-gray-600">{user.email}</p>
                      {user.businessDetails?.businessPhone && (
                        <p className="text-gray-600">{user.businessDetails.businessPhone}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                      <p className="text-gray-600">
                        {user.businessDetails?.businessLocation || 'Location not specified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Dialog */}
      <BusinessProfileEditDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={user}
      />
    </div>
  );
};

export default BusinessProfilePage;
