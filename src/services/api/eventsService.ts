import { BaseApiService, EVENTS_BASE_URL } from './baseApi';
import { XanoEvent } from './types';
import { RunEvent } from '@/types';
import { transformToXanoEvent } from '../dataTransforms';
import { fileUploadApi } from './fileUploadService';

class EventsApiService extends BaseApiService {
  async getEvents(): Promise<XanoEvent[]> {
    return this.request<XanoEvent[]>('/events');
  }

  async getEvent(eventId: number): Promise<XanoEvent> {
    return this.request<XanoEvent>(`/events/${eventId}`);
  }

  async createEvent(eventData: Omit<XanoEvent, 'id' | 'created_at'>): Promise<XanoEvent> {
    return this.request<XanoEvent>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async createEventWithImage(
    runEvent: Partial<RunEvent>,
    businessId: number,
    latitude?: number,
    longitude?: number,
    imageFile?: File,
    businessName?: string
  ): Promise<XanoEvent> {
    console.log('=== EVENTS API SERVICE ===');
    console.log('API Service received runEvent.date:', runEvent.date);
    console.log('API Service received runEvent.time:', runEvent.time);
    console.log('API Service received businessName parameter:', businessName);
    console.log('API Service received runEvent.hostName:', runEvent.hostName);
    
    // CRITICAL FIX: Use the businessName parameter if provided, otherwise use runEvent.hostName
    const finalBusinessName = businessName || runEvent.hostName;
    console.log('API Service final business name to send:', finalBusinessName);
    
    console.log('Creating event with image:', { runEvent, businessId, latitude, longitude, hasImage: !!imageFile, finalBusinessName });
    
    // Transform run event to Xano format, now using the correct business name
    const xanoEventData = transformToXanoEvent(runEvent, businessId, latitude, longitude, finalBusinessName);
    
    console.log('=== AFTER TRANSFORM TO XANO ===');
    console.log('xanoEventData.event_start:', xanoEventData.event_start);
    console.log('xanoEventData.business_name:', xanoEventData.business_name);
    console.log('DEBUGGING: Timestamp we are sending to Xano:', xanoEventData.event_start);
    console.log('DEBUGGING: What time does this timestamp represent?');
    console.log('- UTC time:', new Date(xanoEventData.event_start).toISOString());
    console.log('- Madrid time:', new Date(xanoEventData.event_start).toLocaleString("es-ES", {timeZone: "Europe/Madrid"}));
    console.log('- Browser local time:', new Date(xanoEventData.event_start).toString());
    console.log('Creating event in Xano:', xanoEventData);
    
    // Let's also check what the exact JSON payload looks like
    const jsonPayload = JSON.stringify(xanoEventData);
    console.log('EXACT JSON PAYLOAD BEING SENT:', jsonPayload);
    console.log('TIMESTAMP IN JSON:', JSON.parse(jsonPayload).event_start);
    console.log('BUSINESS_NAME IN JSON:', JSON.parse(jsonPayload).business_name);
    
    try {
      // Create event in Xano first
      const createdEvent = await this.request<XanoEvent>('/events', {
        method: 'POST',
        body: jsonPayload,
      });

      console.log('=== XANO RESPONSE ANALYSIS ===');
      console.log('Event created successfully in Xano:', createdEvent);
      console.log('SENT timestamp:', xanoEventData.event_start);
      console.log('RECEIVED timestamp:', createdEvent.event_start);
      console.log('SENT business_name:', xanoEventData.business_name);
      console.log('RECEIVED business_name:', createdEvent.business_name);
      console.log('TIMESTAMP COMPARISON:');
      console.log('- Sent represents:', new Date(xanoEventData.event_start).toLocaleString("es-ES", {timeZone: "Europe/Madrid"}));
      console.log('- Received represents:', new Date(createdEvent.event_start).toLocaleString("es-ES", {timeZone: "Europe/Madrid"}));
      console.log('- Difference in hours:', (xanoEventData.event_start - createdEvent.event_start) / (1000 * 60 * 60));
      
      // Let's also check if the issue is in the response parsing
      console.log('DEBUGGING RESPONSE DETAILS:');
      console.log('- Type of received timestamp:', typeof createdEvent.event_start);
      console.log('- Raw response timestamp value:', createdEvent.event_start);
      console.log('- Is it a number?', Number.isInteger(createdEvent.event_start));
      
      // Upload image to Supabase with event ID as filename if provided
      if (imageFile) {
        try {
          console.log('Uploading image file to Supabase with event ID:', createdEvent.id);
          
          // Generate filename using event ID
          const fileExt = imageFile.name.split('.').pop() || 'jpg';
          const fileName = `event-${createdEvent.id}.${fileExt}`;
          const filePath = `events/${fileName}`;
          
          // Upload with specific filename
          const supabaseUrl = 'https://fvapuajektabkszgdpic.supabase.co';
          const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YXB1YWpla3RhYmtzemdkcGljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODUxMTA3NywiZXhwIjoyMDY0MDg3MDc3fQ.6RTKRPX6gZ4dLI1g_NYaeBTwIK9aGkQhjjTuFy4eyqs';
          const bucketName = 'event-images';
          
          const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`;
          
          const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': imageFile.type,
            },
            body: imageFile,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Supabase upload error ${response.status}:`, errorText);
          } else {
            console.log('Image uploaded successfully to Supabase with filename:', fileName);
          }
        } catch (uploadError) {
          console.error('Supabase image upload failed:', uploadError);
        }
      }
      
      return createdEvent;
    } catch (createError) {
      console.error('Event creation failed:', createError);
      console.log('Event data that failed:', xanoEventData);
      throw createError;
    }
  }

  async createEventWithBusinessInfo(
    runEvent: Partial<RunEvent>,
    businessId: number,
    latitude?: number,
    longitude?: number,
    imageFile?: File,
    businessName?: string,
    businessLatitude?: number,
    businessLongitude?: number
  ): Promise<XanoEvent> {
    console.log('=== EVENTS API SERVICE WITH BUSINESS INFO ===');
    console.log('Business info received:', { businessName, businessLatitude, businessLongitude });
    console.log('----------whatsappGroupLink:', runEvent.whatsappGroupLink);
    
    // Transform run event to Xano format with business info
    const xanoEventData = transformToXanoEvent(runEvent, businessId, latitude, longitude, businessName);
    
    // Add business location as geo_point if coordinates are available
    if (businessLatitude && businessLongitude) {
      (xanoEventData as any).business_location = `POINT(${businessLongitude} ${businessLatitude})`;
      console.log('Added business_location as geo_point:', `POINT(${businessLongitude} ${businessLatitude})`);
    }
    
    console.log('Final Xano event data with business info:', xanoEventData);
    
    try {
      // Create event in Xano first
      const createdEvent = await this.request<XanoEvent>('/events', {
        method: 'POST',
        body: JSON.stringify(xanoEventData),
      });

      console.log('Event created successfully with business info:', createdEvent);
      
      // Upload image to Supabase with event ID as filename if provided
      if (imageFile) {
        try {
          console.log('Uploading image file to Supabase with event ID:', createdEvent.id);
          
          // Generate filename using event ID
          const fileExt = imageFile.name.split('.').pop() || 'jpg';
          const fileName = `event-${createdEvent.id}.${fileExt}`;
          const filePath = `events/${fileName}`;
          
          // Upload with specific filename
          const supabaseUrl = 'https://fvapuajektabkszgdpic.supabase.co';
          const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YXB1YWpla3RhYmtzemdkcGljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODUxMTA3NywiZXhwIjoyMDY0MDg3MDc3fQ.6RTKRPX6gZ4dLI1g_NYaeBTwIK9aGkQhjjTuFy4eyqs';
          const bucketName = 'event-images';
          
          const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`;
          
          const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': imageFile.type,
            },
            body: imageFile,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Supabase upload error ${response.status}:`, errorText);
          } else {
            console.log('Image uploaded successfully to Supabase with filename:', fileName);
          }
        } catch (uploadError) {
          console.error('Supabase image upload failed:', uploadError);
        }
      }
      
      return createdEvent;
    } catch (createError) {
      console.error('Event creation with business info failed:', createError);
      throw createError;
    }
  }

  async updateEvent(eventId: number, eventData: Partial<XanoEvent>): Promise<XanoEvent> {
    return this.request<XanoEvent>(`/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(eventId: number): Promise<void> {
    return this.request<void>(`/events/${eventId}`, {
      method: 'DELETE',
    });
  }
}

export const eventsApi = new EventsApiService();
