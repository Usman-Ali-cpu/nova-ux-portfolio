export interface XanoUser {
  id: number;
  created_at: number;
  name: string;
  email: string;
  role: string;
  business_name?: string;
  business_location?: string;
  business_phone?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
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
  event_location?: string; // geo_point as string
  event_address: string;
  business_phone?: string;
  whatsappGroupLink?: string; // Ensure this field is properly typed
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
