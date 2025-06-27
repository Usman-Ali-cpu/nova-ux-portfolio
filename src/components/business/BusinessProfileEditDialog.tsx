
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User as AuthUser } from '@/contexts/auth/types';
import { useAuth } from '@/contexts/AuthContext';
import { userProfileService } from '@/services/userProfileService';
import { toast } from 'sonner';

interface BusinessProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
}

const BusinessProfileEditDialog: React.FC<BusinessProfileEditDialogProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    businessName: user.businessDetails?.businessName || '',
    businessLocation: user.businessDetails?.businessLocation || '',
    businessPhone: user.businessDetails?.businessPhone || '',
    description: user.businessDetails?.description || '',
    website: user.businessDetails?.socialLinks?.website || '',
    linkedin: user.businessDetails?.socialLinks?.linkedin || '',
    instagram: user.businessDetails?.socialLinks?.instagram || '',
    facebook: user.businessDetails?.socialLinks?.facebook || '',
    twitter: user.businessDetails?.socialLinks?.twitter || '',
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const profileData = {
        name: formData.name,
        email: formData.email,
        businessDetails: {
          businessName: formData.businessName,
          businessLocation: formData.businessLocation,
        },
        businessPhone: formData.businessPhone,
        businessDescription: formData.description,
        website: formData.website,
        linkedin: formData.linkedin,
        instagram: formData.instagram,
        facebook: formData.facebook,
        twitter: formData.twitter,
      };

      console.log('Profile data to update:', profileData);

      const updatedUser = await userProfileService.updateProfile(user.id, profileData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Business Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Basic Information</h4>
            <div>
              <Label htmlFor="name">Contact Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="Your business name"
              />
            </div>

            <div>
              <Label htmlFor="businessLocation">Business Location</Label>
              <Input
                id="businessLocation"
                value={formData.businessLocation}
                onChange={(e) => handleChange('businessLocation', e.target.value)}
                placeholder="123 Main St, City, State"
              />
            </div>

            <div>
              <Label htmlFor="businessPhone">Phone Number</Label>
              <Input
                id="businessPhone"
                value={formData.businessPhone}
                onChange={(e) => handleChange('businessPhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Tell us about your business..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Social Media Links</h4>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yourbusiness"
              />
            </div>

            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                placeholder="https://facebook.com/yourbusiness"
              />
            </div>

            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
                placeholder="https://twitter.com/yourbusiness"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessProfileEditDialog;
