
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
  instagram?: string; // New field for business Instagram
  businessPhone?: string; // New field for business contact phone
  website?: string; // New field for business website
  facebook?: string; // New field for business Facebook
  twitter?: string; // New field for business Twitter
  linkedin?: string; // New field for business LinkedIn
  businessDescription?: string; // New field for business description
  role?: UserRole; // Optional field to update user role
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
      if (profileData.role) updateData.role = profileData.role === 'business' ? 'business' : 'runner';
      
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
        // Add business phone if provided
        if (profileData.businessPhone) {
          updateData.business_phone = profileData.businessPhone;
        }
        // Add business description if provided
        if (profileData.businessDescription) {
          updateData.business_description = profileData.businessDescription;
        }
        // Add social media links if provided
        if (profileData.instagram) {
          updateData.instagram = profileData.instagram;
        }
        if (profileData.website) {
          updateData.website = profileData.website;
        }
        if (profileData.facebook) {
          updateData.facebook = profileData.facebook;
        }
        if (profileData.twitter) {
          updateData.twitter = profileData.twitter;
        }
        if (profileData.linkedin) {
          updateData.linkedin = profileData.linkedin;
        }

      }
      console.log('Updating user profile with data:', updateData);
      
      const updatedUser = await usersApi.updateUser(userId, updateData);
      return transformXanoUser(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile');
    }
  }
};
