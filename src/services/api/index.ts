
// Export all types
export * from './types';

// Export all API services
export { authApi } from './authService';
export { usersApi } from './usersService';
export { eventsApi } from './eventsService';
export { registrationsApi } from './registrationsService';
export { fileUploadApi } from './fileUploadService';

// Import the services for the legacy compatibility object
import { authApi } from './authService';
import { usersApi } from './usersService';
import { eventsApi } from './eventsService';
import { registrationsApi } from './registrationsService';
import { fileUploadApi } from './fileUploadService';

// Legacy compatibility - unified API object
export const xanoApi = {
  // Auth methods
  login: authApi.login.bind(authApi),
  signup: authApi.signup.bind(authApi),
  
  // User methods
  getCurrentUser: usersApi.getCurrentUser.bind(usersApi),
  updateUser: usersApi.updateUser.bind(usersApi),
  
  // Events methods
  getEvents: eventsApi.getEvents.bind(eventsApi),
  getEvent: eventsApi.getEvent.bind(eventsApi),
  createEvent: eventsApi.createEvent.bind(eventsApi),
  updateEvent: eventsApi.updateEvent.bind(eventsApi),
  deleteEvent: eventsApi.deleteEvent.bind(eventsApi),
  
  // Registration methods - updated to use correct endpoints
  getAllRegistrations: registrationsApi.getAllRegistrations.bind(registrationsApi),
  getRegistration: registrationsApi.getRegistration.bind(registrationsApi),
  getEventRegistrations: registrationsApi.getEventRegistrations.bind(registrationsApi),
  registerForEvent: registrationsApi.registerForEvent.bind(registrationsApi),
  cancelRegistration: registrationsApi.cancelRegistration.bind(registrationsApi),
  getUserRegistrations: registrationsApi.getUserRegistrations.bind(registrationsApi),
  
  // File upload methods
  uploadFile: fileUploadApi.uploadFile.bind(fileUploadApi),
};
