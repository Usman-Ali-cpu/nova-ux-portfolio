
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { RunEvent } from '@/types';

interface RunWhatsAppSectionProps {
  run: RunEvent;
}

const RunWhatsAppSection: React.FC<RunWhatsAppSectionProps> = ({ run }) => {
  if (!run.whatsappGroupLink) {
    return null;
  }

  const handleJoinGroup = () => {
    window.open(run.whatsappGroupLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          Join WhatsApp Group
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-muted-foreground">
            Stay connected with other participants and get updates about this run.
          </p>
          <Button 
            onClick={handleJoinGroup}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Join WhatsApp Group
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RunWhatsAppSection;
