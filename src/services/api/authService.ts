
import { BaseApiService, AUTH_BASE_URL } from './baseApi';
import { XanoAuthResponse } from './types';

class AuthApiService extends BaseApiService {
  async login(email: string, password: string): Promise<XanoAuthResponse> {
    const response = await this.request<XanoAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, AUTH_BASE_URL);
    
    console.log('Raw login response from Xano:', response);
    
    // Ensure the response has the expected structure
    if (!response.user?.id) {
      throw new Error('Invalid login response - missing user data');
    }
    
    return response;
  }

  async signup(
    email: string, 
    password: string, 
    name: string, 
    role: 'business' | 'runner',
    businessDetails?: {
      businessName: string;
      businessLocation: string;
      businessPhone?: string;
      latitude?: number;
      longitude?: number;
    }
  ): Promise<XanoAuthResponse> {
    // Always include all fields that the API expects, but use empty values for runners
    const signupData: any = {
      email,
      password,
      name,
      role,
      phone: role === 'business' ? (businessDetails?.businessPhone || '') : '',
      business_name: role === 'business' ? (businessDetails?.businessName || '') : '',
      business_location: role === 'business' ? (
        businessDetails?.latitude && businessDetails?.longitude 
          ? `POINT(${businessDetails.longitude} ${businessDetails.latitude})`
          : businessDetails?.businessLocation || ''
      ) : '',
      // Set is_active to false by default - user must verify email first
      is_active: false
    };

    console.log('Final signup data being sent:', signupData);

    const response = await this.request<any>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    }, AUTH_BASE_URL);

    console.log('Raw signup response from Xano:', response);
    
    // The auth/signup endpoint might return a different structure
    // Let's handle both possible response formats
    if (response.user && response.user.id) {
      // Standard format with user object
      return {
        authToken: response.authToken || '',
        user: response.user
      };
    } else if (response.id) {
      // Direct user object format
      return {
        authToken: response.authToken || '',
        user: response
      };
    } else {
      console.error('Unexpected signup response format:', response);
      throw new Error('Signup failed - unexpected response format from server');
    }
  }
}

export const authApi = new AuthApiService();
