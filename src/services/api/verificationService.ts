
import { BaseApiService, AUTH_BASE_URL } from './baseApi';

// Email configuration
const SENDER_EMAIL = 'doe.john@codefulcrum.com';
const SENDER_NAME = 'RunConnect Team';
const SENDGRID_API_KEY = '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';

class VerificationApiService extends BaseApiService {
  // Generate verification token and store in user record
  async generateVerificationToken(userId: string | number): Promise<{ token: string; success: boolean }> {
    console.log('VerificationApiService.generateVerificationToken: Generating token for user:', userId);
    
    try {
      const response = await this.request<{ token: string; success: boolean }>('/auth/generate-verification-token', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
      }, AUTH_BASE_URL);
      
      console.log('VerificationApiService.generateVerificationToken: Response received:', response);
      return response;
    } catch (error) {
      console.error('VerificationApiService.generateVerificationToken error:', error);
      throw error;
    }
  }

  // Verify user with token
  async verifyUserWithToken(token: string): Promise<{ success: boolean; message: string; user?: any }> {
    console.log('VerificationApiService.verifyUserWithToken: Verifying token:', token);
    
    try {
      const response = await this.request<{ success: boolean; message: string; user?: any }>('/auth/verify-user-token', {
        method: 'POST',
        body: JSON.stringify({ verification_token: token }),
      }, AUTH_BASE_URL);
      
      console.log('VerificationApiService.verifyUserWithToken: Response received:', response);
      return response;
    } catch (error) {
      console.error('VerificationApiService.verifyUserWithToken error:', error);
      throw error;
    }
  }

  // Send verification email using SendGrid
  async sendVerificationEmail(email: string, userId: string | number): Promise<{ success: boolean; message: string }> {
    console.log('VerificationApiService.sendVerificationEmail: Sending verification email to:', email);
    
    try {
      // First, generate the verification token
      const tokenResponse = await this.generateVerificationToken(userId);
      
      if (!tokenResponse.success) {
        throw new Error('Failed to generate verification token');
      }
      
      const verificationToken = tokenResponse.token;
      console.log('Generated verification token:', verificationToken);
      
      // Create verification link
      const verificationLink = `${window.location.origin}/verify-email?token=${verificationToken}`;
      
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
      console.error('VerificationApiService.sendVerificationEmail error:', error);
      throw error;
    }
  }
}

export const verificationApi = new VerificationApiService();
