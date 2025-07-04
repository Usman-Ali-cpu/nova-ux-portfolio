
import { toast } from 'sonner';
import { User, UserRole } from './types';
import { authApi, usersApi } from '@/services/api';
import { verificationApi } from '@/services/api/verificationService';
import { transformXanoUser } from '@/services/dataTransforms';

export const authService = {
  // Login with email and password
  login: async (email: string, password: string): Promise<User> => {
    try {
      console.log('=== LOGIN PROCESS STARTED ===');
      console.log('authService.login called with:', email);
      
      console.log('Step 1: Calling authApi.login...');
      const response = await authApi.login(email, password);
      console.log('Step 1 SUCCESS: authApi.login response:', response);
      
      // Store auth token for future requests
      localStorage.setItem('xanoAuthToken', response.authToken);
      console.log('Step 2 SUCCESS: Stored auth token');
      
      // Now fetch user data using the auth token
      console.log('Step 3: Fetching user data with auth token...');
      const userData = await usersApi.getCurrentUser();
      console.log('Step 3 SUCCESS: Raw user data from API:', userData);
      
      // Check if user email is verified (is_active must be true)
      if (userData.is_active === false) {
        console.log('Step 4: User email not verified (is_active = false)');
        localStorage.removeItem('xanoAuthToken');
        throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
      }
      
      console.log('Step 4: User is verified, transforming user data...');
      const user = transformXanoUser(userData);
      console.log('Step 4 SUCCESS: Transformed user:', user);
      console.log('=== LOGIN PROCESS COMPLETED SUCCESSFULLY ===');
      
      return user;
    } catch (error) {
      console.error('=== LOGIN PROCESS FAILED ===');
      console.error('authService.login error:', error);
      localStorage.removeItem('xanoAuthToken');
      throw new Error(error instanceof Error ? error.message : 'Invalid credentials');
    }
  },

  // Sign up with email and other details
  signup: async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    businessDetails?: {
      businessName: string;
      businessLocation: string;
      businessPhone?: string;
      latitude?: number;
      longitude?: number;
    }
  ): Promise<{ requiresVerification: boolean; email: string }> => {
    console.log('=== SIGNUP PROCESS STARTED ===');
    console.log('authService.signup called with:', { name, email, role, businessDetails });
    
    try {
      console.log('Step 1: Calling authApi.signup...');
      const response = await authApi.signup(email, password, name, role, businessDetails);
      console.log('Step 1 SUCCESS: authApi.signup response:', response);
      
      // Ensure we have a valid user ID from the response
      if (!response.user?.id) {
        throw new Error('Failed to create user - no user ID returned');
      }
      
      const userId = response.user.id;
      console.log('Step 2: Using user ID:', userId);
      
      // Send verification email (this will also generate token and set is_active = false)
      console.log('Step 3: Sending verification email...');
      await verificationApi.sendVerificationEmail(email, userId);
      console.log('Step 3 SUCCESS: Verification email sent');
      
      console.log('=== SIGNUP PROCESS COMPLETED - VERIFICATION REQUIRED ===');
      return { requiresVerification: true, email };
      
    } catch (error) {
      console.error('=== SIGNUP PROCESS FAILED ===');
      console.error('authService.signup error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('409') || errorMessage.includes('already exists') || errorMessage.includes('email already')) {
          throw new Error('Email already exists. Please try logging in instead.');
        } else if (errorMessage.includes('400') || errorMessage.includes('bad request')) {
          throw new Error('Invalid signup data. Please check your information.');
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
          throw new Error('Network error. Please check your connection and try again.');
        } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
          throw new Error('Authentication error. Please try again.');
        } else {
          throw new Error(`Signup failed: ${error.message}`);
        }
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  },

  // Verify email with token
  verifyEmail: async (token: string): Promise<User> => {
    console.log('=== EMAIL VERIFICATION PROCESS STARTED ===');
    console.log('authService.verifyEmail called with token:', token);
    
    try {
      console.log('Step 1: Validating verification token...');
      
      // Validate the token and update user status in Xano
      const verificationResult = await verificationApi.verifyUserWithToken(token);
      console.log('Step 1 SUCCESS: Token verification result:', verificationResult);
      
      if (!verificationResult.success || !verificationResult.user) {
        throw new Error(verificationResult.message || 'Invalid verification token');
      }
      
      const userId = verificationResult.user.id;
      console.log('Step 2: Fetching updated user data for user ID:', userId);
      
      // Fetch the updated user data
      const updatedUser = await usersApi.getUser(userId);
      console.log('Step 2 SUCCESS: User data fetched');
      
      const user = transformXanoUser(updatedUser);
      console.log('=== EMAIL VERIFICATION PROCESS COMPLETED ===');
      return user;
      
    } catch (error) {
      console.error('=== EMAIL VERIFICATION PROCESS FAILED ===');
      console.error('authService.verifyEmail error:', error);
      throw new Error(error instanceof Error ? error.message : 'Email verification failed');
    }
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<void> => {
    console.log('=== RESEND VERIFICATION PROCESS STARTED ===');
    console.log('authService.resendVerification called with email:', email);
    
    try {
      // For resend, we need the user ID - this is a limitation of current setup
      // In a real implementation, you'd have an endpoint to resend by email
      throw new Error('Resend verification is not fully implemented. Please contact support.');
    } catch (error) {
      console.error('=== RESEND VERIFICATION PROCESS FAILED ===');
      console.error('authService.resendVerification error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to resend verification email');
    }
  }
};
