
import { usersApi } from '@/services/api';
import { transformXanoUser } from './dataTransforms';
import { User, UserRole } from '@/contexts/auth/types';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  businessDetails?: {
    businessName: string;
    businessLocation: string;
    latitude?: number;
    longitude?: number;
  };
}

export const userProfileService = {
  // Get current user profile
  getCurrentProfile: async (): Promise<User> => {
    try {
      const xanoUser = await usersApi.getCurrentUser();
      return transformXanoUser(xanoUser);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch profile');
    }
  },

  // Update user profile
  updateProfile: async (userId: string, profileData: UpdateProfileData): Promise<User> => {
    try {
      const updateData: any = {};
      
      if (profileData.name) updateData.name = profileData.name;
      if (profileData.email) updateData.email = profileData.email;
      
      // Handle business details for business users
      if (profileData.businessDetails) {
        updateData.business_name = profileData.businessDetails.businessName;
        updateData.business_location = profileData.businessDetails.businessLocation;
        
        // Add latitude and longitude if provided
        if (profileData.businessDetails.latitude) {
          updateData.business_latitude = profileData.businessDetails.latitude;
        }
        if (profileData.businessDetails.longitude) {
          updateData.business_longitude = profileData.businessDetails.longitude;
        }
      }
      
      const updatedUser = await usersApi.updateUser(userId, updateData);
      return transformXanoUser(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile');
    }
  }
};
