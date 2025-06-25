
// Email configuration - Update these values as needed
const SENDER_EMAIL = 'doe.john@codefulcrum.com';
const SENDER_NAME = 'RunConnect Team';
const SENDGRID_API_KEY = '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';

import { BaseApiService, AUTH_BASE_URL } from './baseApi';

class EmailVerificationApiService extends BaseApiService {
  async sendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    console.log('EmailVerificationApiService.sendVerificationEmail: Sending verification email to:', email);
    
    try {
      // First, generate activation token via Xano
      const tokenResponse = await this.request<{ activation_token: string }>('/auth/generate-activation-token', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }, AUTH_BASE_URL);
      
      const activationToken = tokenResponse.activation_token;
      console.log('Generated activation token:', activationToken);
      
      // Create verification link
      const verificationLink = `${window.location.origin}/verify-email?token=${activationToken}`;
      
      // Send email via SendGrid API directly
      const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: email }]
            }
          ],
          from: {
            email: SENDER_EMAIL,
            name: SENDER_NAME
          },
          subject: 'Verify Your Email - RunConnect',
          content: [
            {
              type: 'text/html',
              value: `
                <h2>Welcome to RunConnect!</h2>
                <p>Thank you for signing up. Please click the link below to verify your email address:</p>
                <p><a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
                <p>Or copy and paste this link in your browser:</p>
                <p>${verificationLink}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account, please ignore this email.</p>
              `
            }
          ]
        })
      });

      if (!sendGridResponse.ok) {
        const errorText = await sendGridResponse.text();
        console.error('SendGrid API error:', errorText);
        throw new Error('Failed to send verification email');
      }

      console.log('Verification email sent successfully via SendGrid');
      return { success: true, message: 'Verification email sent successfully' };
      
    } catch (error) {
      console.error('EmailVerificationApiService.sendVerificationEmail error:', error);
      throw error;
    }
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
    
    // Reuse the same logic as sendVerificationEmail
    return this.sendVerificationEmail(email);
  }
}

export const emailVerificationApi = new EmailVerificationApiService();
