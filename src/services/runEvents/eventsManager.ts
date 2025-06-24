
import { RunEvent } from '@/types';
import { eventsApi } from '@/services/api';
import { transformXanoEvent } from '../dataTransforms';

export class EventsManager {
  async updateEvent(eventId: string, runEvent: Partial<RunEvent>): Promise<RunEvent> {
    try {
      console.log('EventsManager: Updating event in Xano:', eventId, runEvent);
      const updatedEvent = await eventsApi.updateEvent(parseInt(eventId), runEvent as any);
      
      const transformedEvent = transformXanoEvent(updatedEvent);
      console.log('EventsManager: Updated event:', transformedEvent);
      return transformedEvent;
    } catch (error) {
      console.error('EventsManager: Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      console.log('EventsManager: Deleting event from Xano:', eventId);
      await eventsApi.deleteEvent(parseInt(eventId));
      console.log('EventsManager: Event deleted successfully');
    } catch (error) {
      console.error('EventsManager: Error deleting event:', error);
      throw error;
    }
  }
}

export const eventsManager = new EventsManager();
