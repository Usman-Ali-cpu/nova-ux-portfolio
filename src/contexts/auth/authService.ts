
import { toast } from 'sonner';
import { User, UserRole } from './types';
import { authApi, usersApi } from '@/services/api';
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
      throw new Error('Invalid credentials');
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
      businessPhone?: string; // New field for business contact phone
      latitude?: number;
      longitude?: number;
    }
  ): Promise<User> => {
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
      
      // Store auth token for future requests
      if (response.authToken) {
        localStorage.setItem('xanoAuthToken', response.authToken);
        console.log('Step 2 SUCCESS: Stored auth token:', response.authToken);
      } else {
        console.warn('Step 2 WARNING: No auth token in signup response');
      }
      
      // Now fetch user data using the auth token
      console.log('Step 3: Fetching user data with auth token...');
      const userData = await usersApi.getCurrentUser();
      console.log('Step 3 SUCCESS: Fetched user data:', userData);
      
      const user = transformXanoUser(userData);
      console.log('Step 4 SUCCESS: Transformed user:', user);
      console.log('=== SIGNUP PROCESS COMPLETED SUCCESSFULLY ===');
      return user;
      
    } catch (error) {
      console.error('=== SIGNUP PROCESS FAILED ===');
      console.error('authService.signup error:', error);
      console.error('Error details:', {
        type: typeof error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Clear any stale tokens
      localStorage.removeItem('xanoAuthToken');
      
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
  }
};
