
import { BaseApiService, AUTH_BASE_URL, EVENTS_BASE_URL } from './baseApi';
import { XanoUser } from './types';

class UsersApiService extends BaseApiService {
  async getCurrentUser(): Promise<XanoUser> {
    console.log('UsersApiService.getCurrentUser: Fetching current user data...');
    const response = await this.request<XanoUser>('/auth/me', {
      method: 'GET',
    }, AUTH_BASE_URL);
    
    console.log('UsersApiService.getCurrentUser: Response received:', response);
    return response;
  }

  async getUser(userId: number): Promise<XanoUser> {
    console.log('UsersApiService.getUser: Fetching user data for ID:', userId);
    
    try {
      const response = await this.request<XanoUser>(`/user/${userId}`, {
        method: 'GET',
      }, EVENTS_BASE_URL);
      
      console.log('UsersApiService.getUser: Success with response:', response);
      return response;
    } catch (error) {
      console.error('UsersApiService.getUser: Failed for user ID:', userId, error);
      // Return fallback with required properties
      return {
        id: userId,
        created_at: Date.now(),
        name: `User ${userId}`,
        email: '',
        role: 'runner'
      };
    }
  }

  async updateUser(userId: number, userData: Partial<XanoUser>): Promise<XanoUser> {
    console.log('UsersApiService.updateUser: Updating user data for ID:', userId, 'Data:', userData);
    return this.request<XanoUser>(`/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }, EVENTS_BASE_URL);
  }

  async getUserByVerificationToken(token: string): Promise<XanoUser | null> {
    console.log('UsersApiService.getUserByVerificationToken: Looking up user by token');
    try {
      // Get all users and find the one with matching verification token
      // Note: This is not ideal for production, but works for the current setup
      const response = await this.request<XanoUser[]>('/user', {
        method: 'GET',
      }, EVENTS_BASE_URL);
      
      const user = response.find(u => u.verification_token === token);
      console.log('UsersApiService.getUserByVerificationToken: Found user:', user?.id || 'none');
      return user || null;
    } catch (error) {
      console.error('UsersApiService.getUserByVerificationToken: Error:', error);
      return null;
    }
  }
}

export const usersApi = new UsersApiService();
