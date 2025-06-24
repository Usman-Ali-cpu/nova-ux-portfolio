
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import RunRegistrationForm from '@/components/forms/RunRegistrationForm';
import { RunEvent } from '@/types';
import { Button } from '@/components/ui/button';

interface RunRegistrationDialogProps {
  run: RunEvent;
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  onRegistrationComplete: () => void;
}

const RunRegistrationDialog: React.FC<RunRegistrationDialogProps> = ({
  run,
  showDialog,
  setShowDialog,
  onRegistrationComplete
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button className="hidden">Register</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for {run.title}</DialogTitle>
          <DialogDescription>
            Enter your details to sign up for this run.
          </DialogDescription>
        </DialogHeader>
        <RunRegistrationForm 
          runId={run.id} 
          onRegistrationComplete={onRegistrationComplete}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RunRegistrationDialog;
