
import { XanoEvent, XanoUser } from '@/services/api/types';
import { RunEvent } from '@/types';
import { format } from 'date-fns';

// Transform Xano event to our RunEvent format
export const transformXanoEvent = (xanoEvent: XanoEvent): RunEvent => {
  console.log('=== TRANSFORMING XANO EVENT ===');
  console.log('Raw Xano event:', xanoEvent);
  
  // Parse the event date from timestamp
  const eventDate = new Date(xanoEvent.event_start);
  console.log('Parsed event date:', eventDate);
  
  // Format date and time
  const formattedDate = format(eventDate, 'yyyy-MM-dd');
  const formattedTime = format(eventDate, 'HH:mm');
  
  console.log('Formatted date:', formattedDate);
  console.log('Formatted time:', formattedTime);
  
  // Parse coordinates from POINT format if available
  let latitude: number | undefined;
  let longitude: number | undefined;
  
  if (xanoEvent.event_location && typeof xanoEvent.event_location === 'string') {
    // Handle POINT format: "POINT(longitude latitude)"
    const pointMatch = xanoEvent.event_location.match(/POINT\(([^)]+)\)/);
    if (pointMatch) {
      const coords = pointMatch[1].split(' ');
      if (coords.length === 2) {
        longitude = parseFloat(coords[0]);
        latitude = parseFloat(coords[1]);
        console.log('Parsed coordinates:', { latitude, longitude });
      }
    }
  }
  
  // Determine pace category based on pace
  const paceInMinutes = xanoEvent.pace_seconds_per_km / 60;
  let paceCategory: 'beginner' | 'intermediate' | 'advanced' = 'intermediate';
  
  if (paceInMinutes > 6.5) {
    paceCategory = 'beginner';
  } else if (paceInMinutes < 4.5) {
    paceCategory = 'advanced';
  }
  
  console.log('Pace category determined:', paceCategory);
  
  // Get business name - prioritize the populated business_name field
  const hostName = xanoEvent.business_name || 'Business Host';
  console.log('Host name determined:', hostName);
  
  // Build host contact info - now includes business_phone from API
  const hostContactInfo: any = {
    businessName: hostName
  };
  
  // Add business location if available
  if (xanoEvent.business_location) {
    hostContactInfo.businessLocation = xanoEvent.business_location;
  }
  
  // Add business phone if available from API response
  if (xanoEvent.business_phone) {
    hostContactInfo.phone = xanoEvent.business_phone;
  }
  
  console.log('Host contact info built:', hostContactInfo);
  
  // Determine location - prioritize location field, then event_address, then business_location
  const eventLocation = xanoEvent.location || xanoEvent.event_address || xanoEvent.business_location || 'Location TBD';
  console.log('Event location determined:', eventLocation);
  
  const transformedEvent: RunEvent = {
    id: xanoEvent.id.toString(),
    title: xanoEvent.title,
    hostId: xanoEvent.business_id.toString(),
    hostName: hostName,
    date: formattedDate,
    time: formattedTime,
    location: eventLocation,
    address: xanoEvent.event_address || '',
    distance: xanoEvent.distance,
    pace: paceInMinutes,
    paceCategory: paceCategory,
    description: xanoEvent.description,
    imageUrl: xanoEvent.event_image,
    latitude: latitude,
    longitude: longitude,
    hostContactInfo: hostContactInfo,
    maxParticipants: xanoEvent.max_participants,
    currentParticipants: 0 // This would need to be calculated from registrations
  };
  
  console.log('Final transformed event:', transformedEvent);
  return transformedEvent;
};

// Transform Xano user to our User format
export const transformXanoUser = (xanoUser: XanoUser) => {
  console.log('Transforming Xano user:', xanoUser);
  
  const transformedUser = {
    id: xanoUser.id.toString(),
    name: xanoUser.name,
    email: xanoUser.email,
    role: xanoUser.role as 'business' | 'runner',
    unreadMessages: 0, // Default to 0 since we removed messaging functionality
    businessDetails: xanoUser.role === 'business' ? {
      businessName: xanoUser.business_name || '',
      businessLocation: xanoUser.business_location || '',
      businessPhone: xanoUser.business_phone || '', // Include business phone
      latitude: xanoUser.business_latitude,
      longitude: xanoUser.business_longitude
    } : undefined
  };
  
  console.log('Transformed user:', transformedUser);
  return transformedUser;
};

// Transform our RunEvent to Xano event format
export const transformToXanoEvent = (
  runEvent: Partial<RunEvent>,
  businessId: number,
  latitude?: number,
  longitude?: number,
  businessName?: string
): Omit<XanoEvent, 'id' | 'created_at'> => {
  console.log('=== TRANSFORM TO XANO EVENT ===');
  console.log('Input runEvent.date:', runEvent.date);
  console.log('Input runEvent.time:', runEvent.time);
  console.log('Input businessName:', businessName);
  console.log('Input runEvent.location:', runEvent.location);
  
  // Combine date and time to create timestamp
  let eventTimestamp: number;
  
  if (runEvent.date && runEvent.time) {
    const dateTimeString = `${runEvent.date}T${runEvent.time}:00`;
    const eventDate = new Date(dateTimeString);
    eventTimestamp = eventDate.getTime();
    
    console.log('Combined date/time string:', dateTimeString);
    console.log('Created Date object:', eventDate);
    console.log('Generated timestamp:', eventTimestamp);
  } else {
    eventTimestamp = Date.now();
    console.log('Using current timestamp as fallback:', eventTimestamp);
  }
  
  // Create location POINT if coordinates are provided
  let eventLocation: string | undefined;
  if (latitude && longitude) {
    eventLocation = `POINT(${longitude} ${latitude})`;
    console.log('Created location POINT:', eventLocation);
  }
  
  // Convert pace from minutes per km to seconds per km
  const paceSecondsPerKm = runEvent.pace ? runEvent.pace * 60 : 300; // Default to 5 min/km
  
  const xanoEventData: Omit<XanoEvent, 'id' | 'created_at'> = {
    title: runEvent.title || '',
    description: runEvent.description || '',
    event_start: eventTimestamp,
    pace_seconds_per_km: paceSecondsPerKm,
    distance: runEvent.distance || 5,
    max_participants: runEvent.maxParticipants,
    event_location: eventLocation,
    event_address: runEvent.address || '',
    location: runEvent.location || '', // Include location name
    business_id: businessId,
    business_name: businessName || runEvent.hostName
  };
  
  console.log('Final Xano event data:', xanoEventData);
  return xanoEventData;
};
