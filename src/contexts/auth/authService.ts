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
      console.log('Step 3 SUCCESS: User role from API:', userData.role);
      
      // Check if user email is verified
      if (userData.is_active === false) {
        console.log('Step 4: User email not verified');
        localStorage.removeItem('xanoAuthToken');
        throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
      }
      
      console.log('Step 4: Transforming user data...');
      const user = transformXanoUser(userData);
      console.log('Step 4 SUCCESS: Transformed user:', user);
      console.log('Step 4 SUCCESS: Final user role:', user.role);
      console.log('=== LOGIN PROCESS COMPLETED SUCCESSFULLY ===');
      
      return user;
    } catch (error) {
      console.error('=== LOGIN PROCESS FAILED ===');
      console.error('authService.login error:', error);
      // Clear any stale tokens
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
      console.log('Data being sent to authApi.signup:', {
        email,
        password: '***',
        name,
        role,
        businessDetails
      });
      
      const response = await authApi.signup(email, password, name, role, businessDetails);
      console.log('Step 1 SUCCESS: authApi.signup response:', response);
      
      // Extract user ID from response (assuming it's returned)
      let userId: string | number = response.user?.id || email;
      
      // Send verification email using our custom service
      console.log('Step 2: Sending verification email...');
      await verificationApi.sendVerificationEmail(email, userId);
      console.log('Step 2 SUCCESS: Verification email sent');
      
      console.log('=== SIGNUP PROCESS COMPLETED - VERIFICATION REQUIRED ===');
      return { requiresVerification: true, email };
      
    } catch (error) {
      console.error('=== SIGNUP PROCESS FAILED ===');
      console.error('authService.signup error:', error);
      console.error('Error details:', {
        type: typeof error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Provide more specific error messages based on the error
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('409') || errorMessage.includes('already exists') || errorMessage.includes('email already')) {
          console.error('SIGNUP ERROR: Email already exists');
          throw new Error('Email already exists. Please try logging in instead.');
        } else if (errorMessage.includes('400') || errorMessage.includes('bad request')) {
          console.error('SIGNUP ERROR: Invalid data');
          throw new Error('Invalid signup data. Please check your information.');
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
          console.error('SIGNUP ERROR: Network issue');
          throw new Error('Network error. Please check your connection and try again.');
        } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
          console.error('SIGNUP ERROR: Authentication issue');
          throw new Error('Authentication error. Please try again.');
        } else {
          console.error('SIGNUP ERROR: Generic error with message:', error.message);
          throw new Error(`Signup failed: ${error.message}`);
        }
      } else {
        console.error('SIGNUP ERROR: Non-Error object thrown:', error);
        throw new Error('Registration failed. Please try again.');
      }
    }
  },

  // Verify email with token using custom verification
  verifyEmail: async (token: string): Promise<User> => {
    console.log('=== EMAIL VERIFICATION PROCESS STARTED ===');
    console.log('authService.verifyEmail called with token:', token);
    
    try {
      console.log('Step 1: Calling verificationApi.verifyUserWithToken...');
      const response = await verificationApi.verifyUserWithToken(token);
      console.log('Step 1 SUCCESS: Email verification response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Email verification failed');
      }
      
      // If verification includes user data, transform and return it
      if (response.user) {
        const user = transformXanoUser(response.user);
        console.log('=== EMAIL VERIFICATION PROCESS COMPLETED ===');
        return user;
      }
      
      throw new Error('Verification successful but user data not returned');
      
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
      // For resend, we need to get the user ID first
      // This might require an API call to get user by email
      // For now, using email as fallback
      const response = await verificationApi.sendVerificationEmail(email, email);
      console.log('Resend verification response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to resend verification email');
      }
      
      console.log('=== RESEND VERIFICATION PROCESS COMPLETED ===');
    } catch (error) {
      console.error('=== RESEND VERIFICATION PROCESS FAILED ===');
      console.error('authService.resendVerification error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to resend verification email');
    }
  }
};
