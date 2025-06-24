
// Types for Xano responses
export interface XanoUser {
  id: number;
  email: string;
  name: string;
  role: 'business' | 'runner';
  business_name?: string;
  business_location?: string;
  business_latitude?: number;
  business_longitude?: number;
  business_phone?: string; // New field for business contact phone
  created_at?: string;
}

export interface XanoEvent {
  id: number;
  title: string;
  description: string;
  event_start: number; // Timestamp in milliseconds
  pace_seconds_per_km: number;
  distance: number;
  max_participants?: number;
  event_image?: string;
  event_location?: string; // POINT format for geographic data
  event_address?: string; // New field for text address
  location?: string; // Location name field
  business_id: number;
  business_name?: string; // Field that gets populated from database
  business_phone?: string; // Field that gets populated from database
  business_location?: string; // Field that gets populated from database
  created_at?: string;
}

export interface XanoRegistration {
  id: number;
  events_id: number; // Changed from event_id to events_id to match API
  runner_id: number;
  created_at?: string;
  // New nested user object structure
  user?: {
    name: string;
    email: string;
  };
  // Legacy fields for backwards compatibility
  runner_name?: string; // User name populated from registration endpoint
  runner_email?: string; // User email populated from registration endpoint
}

// Simplified to match actual Xano API response - only returns authToken
export interface XanoAuthResponse {
  authToken: string;
}
