import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCaseNotes } from '@/contexts/CaseNotesContext';

interface SaveWithNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  title: string;
  description: string;
  saveButtonText: string;
}

export const SaveWithNotesDialog: React.FC<SaveWithNotesDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  title,
  description,
  saveButtonText
}) => {
  const [notes, setNotes] = useState('');
  const { addCaseNote } = useCaseNotes();

  const handleSave = () => {
    if (notes.trim()) {
      addCaseNote({
        author: 'Current User',
        content: notes.trim(),
        type: 'user'
      });
    }
    onSave();
    setNotes('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="case-notes">
              Case Notes (Optional)
            </Label>
            <Textarea
              id="case-notes"
              placeholder="Add any notes about the changes made..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {saveButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};