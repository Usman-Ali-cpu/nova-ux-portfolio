
import { BaseApiService, AUTH_BASE_URL } from './baseApi';

interface LoginResponse {
  authToken: string;
}

class AuthApiService extends BaseApiService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, AUTH_BASE_URL);
    
    console.log('Raw login response from Xano:', response);
    
    // The login endpoint only returns an authToken
    if (!response.authToken) {
      throw new Error('Invalid login response - no authentication token returned');
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
  ): Promise<{ authToken: string; email: string }> {
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

    const response = await this.request<{ authToken: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    }, AUTH_BASE_URL);

    console.log('Raw signup response from Xano:', response);
    
    // The auth/signup endpoint only returns an authToken
    if (!response.authToken) {
      console.error('Signup failed - no auth token returned:', response);
      throw new Error('Signup failed - no authentication token returned from server');
    }
    
    // Return the token and email for verification process
    return {
      authToken: response.authToken,
      email: email
    };
  }
}

export const authApi = new AuthApiService();
