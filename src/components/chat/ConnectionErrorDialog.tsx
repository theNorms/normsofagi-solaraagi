
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ConnectionErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRetry: () => void;
  onEnableOfflineMode: () => void;
}

const ConnectionErrorDialog: React.FC<ConnectionErrorDialogProps> = ({
  open,
  onOpenChange,
  onRetry,
  onEnableOfflineMode
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Connection Issues</AlertDialogTitle>
          <AlertDialogDescription>
            We're having trouble connecting to Solara's knowledge center. You have two options:
            
            <Alert className="mt-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <AlertTitle>What you can try:</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>• Check your internet connection</p>
                <p>• The Solara API might be temporarily unavailable</p>
                <p>• Enable offline mode to use enhanced local responses</p>
                <p>• Try again later when the service may be restored</p>
              </AlertDescription>
            </Alert>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onEnableOfflineMode}>
            Enable Offline Mode
          </AlertDialogCancel>
          <AlertDialogAction onClick={onRetry}>
            Try Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConnectionErrorDialog;
