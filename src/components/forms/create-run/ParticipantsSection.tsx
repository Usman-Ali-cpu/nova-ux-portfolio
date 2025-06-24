
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./FormSchema";

interface ParticipantsSectionProps {
  form: UseFormReturn<FormValues>;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({ form }) => {
  const watchUnlimitedSpots = form.watch("unlimitedSpots");
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="unlimitedSpots"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Unlimited spots</FormLabel>
              <FormDescription>
                Check this if there is no limit to the number of participants
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      {!watchUnlimitedSpots && (
        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Participants</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1}
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value) || 20)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ParticipantsSection;
