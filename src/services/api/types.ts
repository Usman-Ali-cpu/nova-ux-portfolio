export interface XanoUser {
  id: number;
  created_at: number;
  name: string;
  email: string;
  role: string;
  business_name?: string;
  business_location?: string | { type: string; data: { lng: number; lat: number; } };
  business_phone?: string;
  business_description?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  google_review?: string;
  is_active?: boolean;
  verification_token?: string | null;
  pace_seconds_per_km?: number;
  experience_level?: string;
  running_goals?: string;
}

export interface XanoEvent {
  id: number;
  created_at: number;
  title: string;
  description: string;
  event_start: number;
  pace_seconds_per_km: number;
  distance: number;
  max_participants?: number;
  business_id: number;
  business_name: string;
  event_location?: string | { type: string; data: { lng: number; lat: number; } };
  event_address: string;
  business_phone?: string;
  whatsappGroupLink?: string;
}

export interface XanoRegistration {
  id: number;
  created_at: number;
  runner_id: number;
  events_id: number;
  user?: {
    name?: string;
    email?: string;
  };
}

export interface UploadResult {
  id: number;
  name: string;
  url: string;
  thumbnail_url: string;
  filesize: number;
}

// Updated XanoAuthResponse to ensure user is included
export interface XanoAuthResponse {
  authToken: string;
  user: XanoUser; // Make user required since we need the ID
}

export interface XanoImage {
  access: string;
  path: string;
  name: string;
  type: string;
  size: number;
  mime: string;
  meta: {
    width: number;
    height: number;
  };
  url: string;
}

export interface XanoBusinessPostImage {
  id: number;
  created_at: number;
  business_posts_id: number;
  image: XanoImage | null;
  // Backward compatible fields
  url?: string;
  name?: string;
  business_post_id?: number;
  file?: string; // Base64 encoded image data (for uploads)
  thumbnail_url?: string;
  alt_text?: string;
  position?: number;
}

export interface XanoBusinessPost {
  id: number;
  created_at: string;
  business_id: number;
  title: string;
  content: string;
  business_name?: string;
  images?: XanoBusinessPostImage[];
}
