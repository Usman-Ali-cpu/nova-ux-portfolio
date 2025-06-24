
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { RunEvent } from '@/types';

interface RunHostSectionProps {
  run: RunEvent;
}

const RunHostSection: React.FC<RunHostSectionProps> = ({ run }) => {
  // Get the display name for the host
  const getHostDisplayName = () => {
    if (run.hostContactInfo?.businessName) {
      return run.hostContactInfo.businessName;
    }
    if (run.hostName && run.hostName !== 'Business Host') {
      return run.hostName;
    }
    return 'Business Host';
  };

  // Create WhatsApp link from phone number
  const getWhatsAppLink = (phone: string) => {
    // Remove any non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    // Create WhatsApp URL with pre-filled message
    const message = encodeURIComponent(`Hi! I'm interested in joining the run: ${run.title}`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">About the host</h2>
      <div className="bg-gray-50 p-4 rounded-lg flex items-center">
        <div className="w-16 h-16 rounded-full bg-gray-300 mr-4 overflow-hidden">
          {/* This would be the host's image */}
          <div className="w-full h-full bg-pacers-blue flex items-center justify-center text-white font-bold text-xl">
            {getHostDisplayName().charAt(0)}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{getHostDisplayName()}</h3>
          <p className="text-sm text-muted-foreground">Verified Host</p>
          
          {/* Business contact information - only shown for business hosts */}
          {run.hostContactInfo && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-2">Contact Information:</h4>
              <div className="flex flex-col gap-2">
                {run.hostContactInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-pacers-blue" />
                    <a 
                      href={`mailto:${run.hostContactInfo.email}`} 
                      className="text-sm text-pacers-blue hover:underline"
                    >
                      {run.hostContactInfo.email}
                    </a>
                  </div>
                )}
                {run.hostContactInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <a 
                      href={getWhatsAppLink(run.hostContactInfo.phone)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline"
                    >
                      WhatsApp: {run.hostContactInfo.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunHostSection;
