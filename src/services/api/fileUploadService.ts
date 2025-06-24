
import { BaseApiService } from './baseApi';

class FileUploadApiService extends BaseApiService {
  private supabaseUrl = 'https://fvapuajektabkszgdpic.supabase.co';
  private supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YXB1YWpla3RhYmtzemdkcGljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODUxMTA3NywiZXhwIjoyMDY0MDg3MDc3fQ.6RTKRPX6gZ4dLI1g_NYaeBTwIK9aGkQhjjTuFy4eyqs';
  private bucketName = 'event-images';

  async uploadFile(file: File, fieldName: string = 'event_image'): Promise<{ path: string; url: string }> {
    console.log('Uploading file to Supabase:', { name: file.name, size: file.size, type: file.type });
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `events/${fileName}`;
    
    try {
      // Upload to Supabase Storage
      const uploadUrl = `${this.supabaseUrl}/storage/v1/object/${this.bucketName}/${filePath}`;
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseServiceKey}`,
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Supabase upload error ${response.status}:`, errorText);
        throw new Error(`File upload failed: ${response.status} - ${errorText}`);
      }

      // Get the public URL
      const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucketName}/${filePath}`;
      
      console.log('File uploaded successfully to Supabase:', { path: filePath, url: publicUrl });
      
      return {
        path: filePath,
        url: publicUrl
      };
    } catch (error) {
      console.error('Supabase upload failed:', error);
      throw error;
    }
  }
}

export const fileUploadApi = new FileUploadApiService();
