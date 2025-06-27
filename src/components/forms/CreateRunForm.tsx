import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from 'sonner';
import { useGeocoding } from "@/hooks/useGeocoding";
import { useAuth } from "@/contexts/AuthContext";
import { runEventsService } from "@/services/runEventsService";
import { RunEvent } from "@/types";

// Import form sections
import { formSchema, FormValues } from './create-run/FormSchema';
import BasicInfoSection from './create-run/BasicInfoSection';
import ImageUploadSection from './create-run/ImageUploadSection';
import LocationSection from './create-run/LocationSection';
import RunDetailsSection from './create-run/RunDetailsSection';
import DescriptionSection from './create-run/DescriptionSection';
import ParticipantsSection from './create-run/ParticipantsSection';
import TagsSection from './create-run/TagsSection';
import WhatsAppSection from './create-run/WhatsAppSection';

interface CreateRunFormProps {
  onRunCreated?: () => void;
}

const CreateRunForm: React.FC<CreateRunFormProps> = ({ onRunCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const { geocodeAddress, latitude, longitude } = useGeocoding();
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      location: "",
      address: "",
      distance: 5,
      pace: 6,
      description: "",
      maxParticipants: 20,
      tags: "",
      imageUrl: "",
      unlimitedSpots: false,
      whatsappGroupLink: "",
    },
  });

  // Update coordinates when address changes
  const address = form.watch("address");
  useEffect(() => {
    if (address && address.length > 5) {
      const timer = setTimeout(() => {
        console.log('Geocoding address:', address);
        geocodeAddress(address);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [address, geocodeAddress]);

  // Log coordinates when they change
  useEffect(() => {
    if (latitude && longitude) {
      console.log('Geocoded coordinates received:', { latitude, longitude });
    }
  }, [latitude, longitude]);

  // Helper function to determine pace category
  const getPaceCategory = (pace: number): 'beginner' | 'intermediate' | 'advanced' => {
    if (pace >= 8) return 'beginner';
    if (pace >= 6) return 'intermediate';
    return 'advanced';
  };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Raw form values:', values);
      console.log('User business details:', user?.businessDetails);
      console.log('Geocoded coordinates:', { latitude, longitude });
      
      if (!latitude || !longitude) {
        console.warn('No coordinates available - geocoding may not have completed');
        toast.error('Please wait for the address to be geocoded or enter a more specific address.');
        setIsSubmitting(false);
        return;
      }
      
      // Create new run object - business info will be handled by the API
      const newRun: Partial<RunEvent> = {
        title: values.title,
        hostId: user?.id || '',
        hostName: user?.businessDetails?.businessName || user?.name || 'Business Host',
        date: values.date,
        time: values.time,
        location: values.location,
        address: values.address,
        distance: values.distance,
        pace: values.pace,
        paceCategory: getPaceCategory(values.pace),
        description: values.description,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        maxParticipants: values.unlimitedSpots ? undefined : values.maxParticipants,
        currentParticipants: 0,
        latitude,
        longitude,
        whatsappGroupLink: values.whatsappGroupLink || undefined,
        hostContactInfo: {
          email: user?.email,
          businessName: user?.businessDetails?.businessName,
          businessLocation: values.address,
          phone: user?.businessDetails?.businessPhone,
        }
      };

      console.log('=== NEW RUN OBJECT DEBUG ===');
      console.log('newRun with business info and coordinates:', newRun);
      
      // Save to Xano API - business info will come from the user table
      const businessId = parseInt(user?.id || '1');
      const createdRun = await runEventsService.createEventWithBusinessInfo(
        newRun, 
        businessId, 
        latitude, 
        longitude, 
        selectedImageFile || undefined,
        user?.businessDetails?.businessName,
        latitude, // Use same coordinates as the event location
        longitude
      );
      
      console.log('Run created successfully:', createdRun);
      
      toast.success('Run created successfully!');
      
      // Reset form
      form.reset();
      setImagePreview(null);
      setSelectedImageFile(null);
      
      if (onRunCreated) {
        onRunCreated();
      }
    } catch (error) {
      console.error('Error creating run:', error);
      toast.error('Failed to create run. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection form={form} />
        <ImageUploadSection 
          form={form} 
          imagePreview={imagePreview} 
          setImagePreview={setImagePreview}
          setSelectedImageFile={setSelectedImageFile}
        />
        <LocationSection form={form} />
        <RunDetailsSection form={form} />
        <DescriptionSection form={form} />
        <ParticipantsSection form={form} />
        <WhatsAppSection form={form} />
        <TagsSection form={form} />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Run'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateRunForm;
