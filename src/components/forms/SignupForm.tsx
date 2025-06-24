
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuth } from '@/contexts/AuthContext';
import { useGeocoding } from '@/hooks/useGeocoding';
import { toast } from 'sonner';

// Import refactored components
import { signupSchema, FormValues, SignupFormProps } from './signup/types';
import RoleSelector from './signup/RoleSelector';
import RunnerFields from './signup/RunnerFields';
import BusinessFields from './signup/BusinessFields';
import CommonFields from './signup/CommonFields';

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, suggestedRole }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { geocodeAddress, latitude, longitude, isLoading: isGeocoding } = useGeocoding();

  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: suggestedRole || "runner",
      ...(suggestedRole === "business" && { countryCode: "+34" })
    },
    mode: "onChange"
  });

  // Watch for role changes to dynamically update form fields
  const selectedRole = form.watch("role");
  const locationValue = form.watch("location");

  // Geocode the location when it changes (for business accounts)
  useEffect(() => {
    if (selectedRole === "business" && locationValue && locationValue.length > 5) {
      const timer = setTimeout(() => {
        geocodeAddress(locationValue);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [locationValue, selectedRole, geocodeAddress]);

  const handleSignup = async (values: FormValues) => {
    console.log('=== SIGNUP FORM SUBMISSION STARTED ===');
    console.log('SignupForm.handleSignup called with values:', values);
    
    // Log form validation state
    console.log('Form errors:', form.formState.errors);
    console.log('Form is valid:', form.formState.isValid);
    
    setIsLoading(true);
    try {
      if (values.role === "runner") {
        console.log('SignupForm: Signing up runner...');
        await signup(values.name, values.email, values.password, values.role);
        console.log('SignupForm: Runner signup successful');
      } else {
        console.log('SignupForm: Signing up business...');
        console.log('Business form values:', {
          personName: values.personName,
          businessName: values.businessName,
          location: values.location,
          countryCode: values.countryCode,
          businessPhone: values.businessPhone,
          email: values.email
        });
        
        // For business, combine country code with phone number
        const fullPhoneNumber = `${values.countryCode}${values.businessPhone}`;
        console.log('Full phone number:', fullPhoneNumber);
        
        const businessDetails = {
          businessName: values.businessName,
          businessLocation: values.location,
          businessPhone: fullPhoneNumber,
          ...(latitude && longitude && {
            latitude,
            longitude
          })
        };
        
        console.log('Business details being sent:', businessDetails);
        
        await signup(
          values.personName, 
          values.email, 
          values.password, 
          values.role,
          businessDetails
        );
        console.log('SignupForm: Business signup successful');
      }
      
      console.log('SignupForm: Calling onSuccess callback...');
      toast.success('Account created successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      console.log('=== SIGNUP FORM SUBMISSION COMPLETED ===');
    } catch (error) {
      console.error('=== SIGNUP FORM SUBMISSION FAILED ===');
      console.error('SignupForm.handleSignup error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Show specific error message to user
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
          <RoleSelector form={form} />
          
          {/* Conditional fields based on role */}
          {selectedRole === "runner" ? (
            <RunnerFields form={form} />
          ) : (
            <BusinessFields 
              form={form} 
              isGeocoding={isGeocoding} 
              latitude={latitude} 
              longitude={longitude} 
            />
          )}
          
          {/* Common fields for both roles */}
          <CommonFields form={form} />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
