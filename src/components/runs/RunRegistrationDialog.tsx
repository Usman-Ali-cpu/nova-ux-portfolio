
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RunEvent } from '@/types';
import RunRegistrationForm from '@/components/forms/RunRegistrationForm';
import WhatsAppJoinModal from './WhatsAppJoinModal';

interface RunRegistrationDialogProps {
  run: RunEvent;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onRegistrationComplete: () => void;
}

const RunRegistrationDialog: React.FC<RunRegistrationDialogProps> = ({
  run,
  showDialog,
  setShowDialog,
  onRegistrationComplete
}) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowDialog(false);
    onRegistrationComplete();
    
    // Show WhatsApp modal if there's a group link
    if (run.whatsappGroupLink) {
      setShowWhatsAppModal(true);
    }
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register for {run.title}</DialogTitle>
          </DialogHeader>
          <RunRegistrationForm 
            runId={run.id} 
            onRegistrationComplete={handleRegistrationSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* WhatsApp Join Modal */}
      {run.whatsappGroupLink && (
        <WhatsAppJoinModal
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          whatsappLink={run.whatsappGroupLink}
          runTitle={run.title}
        />
      )}
    </>
  );
};

export default RunRegistrationDialog;
