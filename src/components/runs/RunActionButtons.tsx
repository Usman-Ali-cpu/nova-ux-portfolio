
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import RunRegistrationButton from './RunRegistrationButton';

interface RunActionButtonsProps {
  runId: string;
  isUserRegistered: boolean;
  isLoading?: boolean;
  onRegister: () => Promise<void>;
  onCancelRegistration: () => Promise<void>;
  onShowDialog: () => void;
}

const RunActionButtons: React.FC<RunActionButtonsProps> = ({
  runId,
  isUserRegistered,
  isLoading = false,
  onRegister,
  onCancelRegistration,
  onShowDialog,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-8 sticky bottom-6 flex justify-center">
      <div className="bg-white rounded-full shadow-lg flex">
        <RunRegistrationButton
          runId={runId}
          isUserRegistered={isUserRegistered}
          isLoading={isLoading}
          onRegister={onRegister}
          onCancelRegistration={onCancelRegistration}
          onShowDialog={onShowDialog}
        />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToTop}
          className="rounded-full ml-2"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RunActionButtons;
