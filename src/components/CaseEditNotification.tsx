
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock } from 'lucide-react';
import { useEditMode } from '../contexts/EditModeContext';

export const CaseEditNotification: React.FC = () => {
  const { hasSavedChanges, hasUnsavedChanges } = useEditMode();

  // Only show if there are saved changes (edits have been made previously)
  // but no current unsaved changes (not currently being edited)
  if (!hasSavedChanges || hasUnsavedChanges) {
    return null;
  }

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Clock className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800 text-sm">
        This case has been edited. Review changes before proceeding with vetting.
      </AlertDescription>
    </Alert>
  );
};
