import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: Date;
  field: string;
  oldValue: string;
  newValue: string;
  section: string;
  user: string;
  sessionId?: string;
}

interface FieldComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldName: string;
  auditEntries: AuditEntry[];
}

export const FieldComparisonModal: React.FC<FieldComparisonModalProps> = ({
  open,
  onOpenChange,
  fieldName,
  auditEntries,
}) => {
  // Get the most recent change for this field
  const latestEntry = auditEntries
    .filter(entry => entry.field === fieldName)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

  if (!latestEntry) {
    return null;
  }

  const formatValue = (value: string) => {
    if (value === '' || value === null || value === undefined) {
      return <span className="text-muted-foreground italic">Empty</span>;
    }
    return value;
  };

  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Field Change History
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{formatFieldName(fieldName)}</h4>
            <Badge variant="outline" className="text-xs">
              Last edited: {latestEntry.timestamp.toLocaleString()}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Original Value:</span>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                {formatValue(latestEntry.oldValue)}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">New Value:</span>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                {formatValue(latestEntry.newValue)}
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Changed by: {latestEntry.user}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};