import React, { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AffordabilityWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceed: (notes: string) => void;
}

export const AffordabilityWarningDialog: React.FC<AffordabilityWarningDialogProps> = ({
  open,
  onOpenChange,
  onProceed,
}) => {
  const [notes, setNotes] = useState('');

  const handleProceed = () => {
    if (notes.trim()) {
      onProceed(notes.trim());
      setNotes(''); // Clear notes after submission
    }
  };

  const handleCancel = () => {
    setNotes(''); // Clear notes on cancel
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Affordability Recalculation Required</AlertDialogTitle>
          <AlertDialogDescription>
            You have edited fields that alter the affordability result. A new affordability call will be made and the results will be displayed on the next page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="case-notes" className="text-sm font-medium">
              Case Notes (Required)
            </Label>
            <Textarea
              id="case-notes"
              placeholder="Add notes about the changes made that affect affordability..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleProceed}
            disabled={!notes.trim()}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue with Resubmission
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};