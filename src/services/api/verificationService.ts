
import { BaseApiService, EVENTS_BASE_URL } from './baseApi';

// Email configuration
const SENDER_EMAIL = 'doe.john@codefulcrum.com';
const SENDER_NAME = 'RunConnect Team';
const SENDGRID_API_KEY = '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';
const TOKEN_EXPIRATION_HOURS = 24; // Token expires in 24 hours

// In-memory storage for verification tokens (replace with database in production)
interface VerificationTokenData {
  userId: string | number;
  email: string;
  expiresAt: Date;
  used: boolean;
}

const verificationTokenStore: Record<string, VerificationTokenData> = {};

class VerificationApiService extends BaseApiService {
  /**
   * Generate a secure random token
   */
  private generateToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Clean up expired tokens from the store
   */
  private cleanupExpiredTokens(): void {
    const now = new Date();
    Object.keys(verificationTokenStore).forEach(token => {
      if (verificationTokenStore[token].expiresAt < now) {
        delete verificationTokenStore[token];
      }
    });
  }

  /**
   * Generate verification token and store in memory
   */
  async generateVerificationToken(userId: string | number, email: string): Promise<{ token: string; success: boolean }> {
    console.log('VerificationApiService.generateVerificationToken: Generating token for user:', userId);
    
    try {
      // Clean up expired tokens first
      this.cleanupExpiredTokens();
      
      // Generate a new token
      const token = this.generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRATION_HOURS);
      
      // Store the token
      verificationTokenStore[token] = {
        userId,
        email,
        expiresAt,
        used: false
      };
      
      console.log('Generated verification token:', token);
      return { token, success: true };
      
    } catch (error) {
      console.error('VerificationApiService.generateVerificationToken error:', error);
      throw error;
    }
  }

  /**
   * Verify user with token
   */
  async verifyUserWithToken(token: string): Promise<{ success: boolean; message: string; user?: any }> {
    console.log('VerificationApiService.verifyUserWithToken: Verifying token:', token);
    
    try {
      const tokenData = verificationTokenStore[token];
      
      // Check if token exists
      if (!tokenData) {
        return { 
          success: false, 
          message: 'Invalid or expired verification token' 
        };
      }
      
      // Check if token is already used
      if (tokenData.used) {
        return { 
          success: false, 
          message: 'This verification link has already been used' 
        };
      }
      
      // Check if token is expired
      if (tokenData.expiresAt < new Date()) {
        delete verificationTokenStore[token];
        return { 
          success: false, 
          message: 'Verification link has expired' 
        };
      }
      
      // Mark token as used
      tokenData.used = true;
      
      // Return user data for updating in Xano
      return { 
        success: true, 
        message: 'Email verified successfully',
        user: {
          id: tokenData.userId,
          email: tokenData.email,
          verified: true
        }
      };
      
    } catch (error) {
      console.error('VerificationApiService.verifyUserWithToken error:', error);
      return { 
        success: false, 
        message: 'An error occurred while verifying your email' 
      };
    }
  }

  /**
   * Send verification email using SendGrid
   * @param email The email address to send the verification to
   * @param userId The user ID to associate with this verification
   * @returns Promise with success status and message
   */
  async sendVerificationEmail(email: string, userId: string | number): Promise<{ success: boolean; message: string }> {
    console.log('VerificationApiService.sendVerificationEmail: Sending verification email to:', email);
    
    try {
      // Generate the verification token
      const tokenResponse = await this.generateVerificationToken(userId, email);
      
      if (!tokenResponse.success) {
        throw new Error('Failed to generate verification token');
      }
      
      const verificationToken = tokenResponse.token;
      console.log('Generated verification token:', verificationToken);
      
      // Create verification link
      const verificationLink = `${window.location.origin}/verify-email?token=${verificationToken}`;
      
      // Send email via external service
      try {
        const tokenExpirationHours = TOKEN_EXPIRATION_HOURS;
        const response = await fetch('https://send-emails-beta.vercel.app/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            verificationLink,
            tokenExpirationHours,
          }),
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Email service error:', errorText);
          throw new Error('Failed to send verification email');
        }
    
        const data = await response.json();
        console.log(data.message); // "Email sent successfully"
        return data;
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }

      console.log('Verification email sent successfully');
      return { success: true, message: 'Verification email sent successfully' };
      
    } catch (error) {
      console.error('VerificationApiService.sendVerificationEmail error:', error);
      throw error;
    }
  }
}

export const verificationApi = new VerificationApiService();
