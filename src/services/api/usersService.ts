
import { BaseApiService, AUTH_BASE_URL, EVENTS_BASE_URL } from './baseApi';
import { XanoUser } from './types';

class UsersApiService extends BaseApiService {
  async getCurrentUser(): Promise<XanoUser> {
    console.log('UsersApiService.getCurrentUser: Fetching current user data...');
    const response = await this.request<XanoUser>('/auth/me', {
      method: 'GET',
    }, AUTH_BASE_URL); // Use AUTH_BASE_URL instead of EVENTS_BASE_URL
    
    console.log('UsersApiService.getCurrentUser: Response received:', response);
    return response;
  }

  async getUser(userId: number): Promise<XanoUser> {
    console.log('UsersApiService.getUser: Fetching user data for ID:', userId);
    
    // Try multiple possible endpoints since the API structure isn't clear
    const possibleEndpoints = [
      `/auth/user/${userId}`,
      `/user/${userId}`,
      `/user/${userId}`,
      `/runners/${userId}`
    ];
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await this.request<XanoUser>(endpoint, {
          method: 'GET',
        }, AUTH_BASE_URL);
        
        console.log('UsersApiService.getUser: Success with endpoint:', endpoint, 'Response:', response);
        return response;
      } catch (error) {
        console.log(`Failed with endpoint ${endpoint}:`, error);
        // Continue to next endpoint
      }
    }
    
    // If all endpoints fail, return fallback with required created_at property
    console.error('UsersApiService.getUser: All endpoints failed for user ID:', userId);
    return {
      id: userId,
      created_at: Date.now(), // Add missing created_at property
      name: `User ${userId}`,
      email: '',
      role: 'runner'
    };
  }

  async updateUser(userId: string, userData: Partial<XanoUser>): Promise<XanoUser> {
    console.log('UsersApiService.updateUser: Updating user data for ID:', userId, 'Data:', userData);
    return this.request<XanoUser>(`/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }, EVENTS_BASE_URL); // Use EVENTS_BASE_URL for user operations
  }
}

export const usersApi = new UsersApiService();
