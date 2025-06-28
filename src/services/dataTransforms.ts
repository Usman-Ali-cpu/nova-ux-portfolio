
import { XanoEvent, XanoUser, XanoRegistration } from './api/types';
import { RunEvent, RunRegistration } from '@/types';
import { User } from '@/contexts/auth/types'; // Use correct User type

// Transform Xano event to our RunEvent type
export const transformXanoEvent = (xanoEvent: XanoEvent): RunEvent => {
  console.log('=== TRANSFORM XANO EVENT ===');
  console.log('Input xanoEvent:', xanoEvent);
  console.log('WhatsApp link in xanoEvent:', xanoEvent.whatsappGroupLink);
  
  // Extract date and time from event_start timestamp
  const eventDate = new Date(xanoEvent.event_start);
  const dateString = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeString = eventDate.toTimeString().slice(0, 5); // HH:MM

  console.log('Transformed date:', dateString, 'time:', timeString);
  console.log('WhatsApp link being set:', xanoEvent.whatsappGroupLink || undefined);

  const transformed: RunEvent = {
    id: xanoEvent.id.toString(),
    title: xanoEvent.title || 'Untitled Run',
    hostId: xanoEvent.business_id?.toString() || '1',
    hostName: xanoEvent.business_name || 'Unknown Business',
    date: dateString,
    time: timeString,
    location: xanoEvent.event_address?.split(',')[0] || 'Location TBD',
    address: xanoEvent.event_address || 'Address TBD',
    distance: parseFloat(xanoEvent.distance?.toString() || '5'),
    pace: xanoEvent.pace_seconds_per_km ? xanoEvent.pace_seconds_per_km / 60 : 6,
    paceCategory: determinePaceCategory(xanoEvent.pace_seconds_per_km ? xanoEvent.pace_seconds_per_km / 60 : 6),
    description: xanoEvent.description || 'No description provided',
    maxParticipants: xanoEvent.max_participants,
    currentParticipants: 0,
    latitude: extractLatitudeFromGeoPoint(xanoEvent.event_location),
    longitude: extractLongitudeFromGeoPoint(xanoEvent.event_location),
    whatsappGroupLink: xanoEvent.whatsappGroupLink || undefined, // Ensure WhatsApp link is preserved
    hostContactInfo: {
      businessName: xanoEvent.business_name,
      phone: xanoEvent.business_phone,
    }
  };

  console.log('Final transformed event:', transformed);
  console.log('Final WhatsApp link:', transformed.whatsappGroupLink);
  
  return transformed;
};

// Transform our RunEvent to Xano format for API calls
export const transformToXanoEvent = (
  runEvent: Partial<RunEvent>,
  businessId: number,
  latitude?: number,
  longitude?: number,
  businessName?: string
): Omit<XanoEvent, 'id' | 'created_at'> => {
  console.log('=== TRANSFORM TO XANO EVENT ===');
  console.log('Input runEvent:', runEvent);
  console.log('WhatsApp link in runEvent:', runEvent.whatsappGroupLink);
  
  // Combine date and time into a timestamp
  let eventTimestamp: number;
  
  if (runEvent.date && runEvent.time) {
    const dateTimeString = `${runEvent.date}T${runEvent.time}:00`;
    const eventDate = new Date(dateTimeString);
    eventTimestamp = eventDate.getTime();
    console.log('Combined date/time:', dateTimeString, '-> timestamp:', eventTimestamp);
  } else {
    eventTimestamp = Date.now();
    console.log('Using current timestamp:', eventTimestamp);
  }

  const xanoEvent = {
    title: runEvent.title || 'Untitled Run',
    description: runEvent.description || '',
    event_start: eventTimestamp,
    pace_seconds_per_km: runEvent.pace ? Math.round(runEvent.pace * 60) : 360,
    distance: runEvent.distance || 5,
    max_participants: runEvent.maxParticipants,
    business_id: businessId,
    business_name: businessName || runEvent.hostName || 'Unknown Business',
    event_location: latitude && longitude ? `POINT(${longitude} ${latitude})` : null,
    event_address: runEvent.address || runEvent.location || '',
    business_phone: runEvent.hostContactInfo?.phone || '',
    whatsappGroupLink: runEvent.whatsappGroupLink || '', // Ensure WhatsApp link is included
  };

  console.log('Final Xano event data:', xanoEvent);
  console.log('WhatsApp link being sent to API:', xanoEvent.whatsappGroupLink);
  
  return xanoEvent;
};

// Helper function to determine pace category
const determinePaceCategory = (pace: number): 'beginner' | 'intermediate' | 'advanced' => {
  if (pace >= 8) return 'beginner';
  if (pace >= 6) return 'intermediate';
  return 'advanced';
};

// Helper functions to extract coordinates from geo_point
const extractLatitudeFromGeoPoint = (geoPoint: string | object | null): number | undefined => {
  if (!geoPoint) return undefined;
  
  // Handle object format (newer API response)
  if (typeof geoPoint === 'object' && geoPoint !== null) {
    const pointData = geoPoint as any;
    if (pointData.data && typeof pointData.data.lat === 'number') {
      return pointData.data.lat;
    }
  }
  
  // Handle string format ("POINT(lng lat)")
  if (typeof geoPoint === 'string') {
    const match = geoPoint.match(/POINT\(([^)]+)\)/);
    if (match) {
      const [lng, lat] = match[1].split(' ').map(Number);
      return lat;
    }
  }
  
  return undefined;
};

const extractLongitudeFromGeoPoint = (geoPoint: string | object | null): number | undefined => {
  if (!geoPoint) return undefined;
  
  // Handle object format (newer API response)
  if (typeof geoPoint === 'object' && geoPoint !== null) {
    const pointData = geoPoint as any;
    if (pointData.data && typeof pointData.data.lng === 'number') {
      return pointData.data.lng;
    }
  }
  
  // Handle string format ("POINT(lng lat)")
  if (typeof geoPoint === 'string') {
    const match = geoPoint.match(/POINT\(([^)]+)\)/);
    if (match) {
      const [lng, lat] = match[1].split(' ').map(Number);
      return lng;
    }
  }
  
  return undefined;
};

// Transform Xano user to our User type
export const transformXanoUser = (xanoUser: XanoUser): User => {
  return {
    id: xanoUser.id.toString(),
    name: xanoUser.name || '',
    email: xanoUser.email || '',
    role: (xanoUser.role as 'runner' | 'business') || 'runner',
    businessDetails: xanoUser.role === 'business' ? {
      businessName: xanoUser.business_name || '',
      businessLocation: xanoUser.business_location || '',
      businessPhone: xanoUser.business_phone || '',
      description: '', // Add if available in schema
      socialLinks: {
        website: xanoUser.website || '',
        instagram: xanoUser.instagram || '',
        facebook: xanoUser.facebook || '',
        twitter: xanoUser.twitter || '',
        linkedin: xanoUser.linkedin || '',
      }
    } : undefined
  };
};

// Transform Xano registration to our RunRegistration type
export const transformXanoRegistration = (xanoReg: XanoRegistration): RunRegistration => {
  return {
    id: xanoReg.id.toString(),
    runId: xanoReg.events_id.toString(),
    userId: xanoReg.runner_id.toString(),
    userName: xanoReg.user?.name || `User ${xanoReg.runner_id}`,
    userEmail: xanoReg.user?.email || '',
    userPace: 6, // Default pace, could be enhanced with actual user pace
    registeredAt: xanoReg.created_at.toString(),
    status: 'confirmed' as const
  };
};
