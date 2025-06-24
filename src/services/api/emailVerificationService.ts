
import { BaseApiService, AUTH_BASE_URL } from './baseApi';

class EmailVerificationApiService extends BaseApiService {
  async sendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    console.log('EmailVerificationApiService.sendVerificationEmail: Sending verification email to:', email);
    
    const response = await this.request<{ success: boolean; message: string }>('/auth/send-verification', {
      method: 'POST',
      body: JSON.stringify({ 
        email,
        sendgrid_api_key: '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'
      }),
    }, AUTH_BASE_URL);
    
    console.log('EmailVerificationApiService.sendVerificationEmail: Response received:', response);
    return response;
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    console.log('EmailVerificationApiService.verifyEmail: Verifying token:', token);
    
    const response = await this.request<{ success: boolean; message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ activation_token: token }),
    }, AUTH_BASE_URL);
    
    console.log('EmailVerificationApiService.verifyEmail: Response received:', response);
    return response;
  }

  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    console.log('EmailVerificationApiService.resendVerificationEmail: Resending verification email to:', email);
    
    const response = await this.request<{ success: boolean; message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ 
        email,
        sendgrid_api_key: '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'
      }),
    }, AUTH_BASE_URL);
    
    console.log('EmailVerificationApiService.resendVerificationEmail: Response received:', response);
    return response;
  }
}

export const emailVerificationApi = new EmailVerificationApiService();
