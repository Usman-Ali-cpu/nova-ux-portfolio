
import { BaseApiService, EVENTS_BASE_URL } from './baseApi';
import { XanoBusinessPost } from './types';

class BusinessPostsApiService extends BaseApiService {
  async getBusinessPosts(businessId: number): Promise<XanoBusinessPost[]> {
    console.log('BusinessPostsApiService.getBusinessPosts: Fetching posts for business ID:', businessId);
    try {
      const response = await this.request<XanoBusinessPost[]>(`/business-posts?business_id=${businessId}`, {
        method: 'GET',
      });
      console.log('BusinessPostsApiService.getBusinessPosts: Response received:', response);
      return response;
    } catch (error) {
      console.log('BusinessPostsApiService.getBusinessPosts: Error fetching posts, returning empty array:', error);
      return [];
    }
  }

  async createBusinessPost(postData: Omit<XanoBusinessPost, 'id' | 'created_at' | 'business_name'>): Promise<XanoBusinessPost> {
    console.log('BusinessPostsApiService.createBusinessPost: Creating post:', postData);
    const response = await this.request<XanoBusinessPost>('/business-posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
    console.log('BusinessPostsApiService.createBusinessPost: Response received:', response);
    return response;
  }

  async updateBusinessPost(postId: number, postData: Partial<XanoBusinessPost>): Promise<XanoBusinessPost> {
    console.log('BusinessPostsApiService.updateBusinessPost: Updating post ID:', postId, 'with data:', postData);
    const response = await this.request<XanoBusinessPost>(`/business-posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(postData),
    });
    console.log('BusinessPostsApiService.updateBusinessPost: Response received:', response);
    return response;
  }

  async deleteBusinessPost(postId: number): Promise<void> {
    console.log('BusinessPostsApiService.deleteBusinessPost: Deleting post ID:', postId);
    await this.request<void>(`/business-posts/${postId}`, {
      method: 'DELETE',
    });
    console.log('BusinessPostsApiService.deleteBusinessPost: Post deleted successfully');
  }
}

export const businessPostsApi = new BusinessPostsApiService();
