import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EditableField } from './EditableField';
import { useAudit } from '../contexts/AuditContext';
import { useUnifiedData } from '../contexts/UnifiedDataContext';
import { isProtectedField } from '../utils/fieldMapping';

interface EnhancedReadOnlyFieldProps {
  field: string;
  value: string;
  label: string;
  className?: string;
  onDoubleClick?: (field: string) => void;
  onAuditClick?: (field: string) => void;
  showAuditIcon?: boolean;
}

export const EnhancedReadOnlyField: React.FC<EnhancedReadOnlyFieldProps> = ({
  field,
  value,
  label,
  className = "",
  onDoubleClick,
  onAuditClick,
  showAuditIcon = true,
}) => {
  const { auditLog } = useAudit();
  const { isFieldModified, getFieldLastModified, getFieldValue } = useUnifiedData();
  
  // Get value from unified context if available, fallback to prop value
  const displayValue = getFieldValue(field) || value;
  
  const isEdited = auditLog.some(entry => entry.field === field);
  const isModified = isFieldModified(field);
  const lastModified = getFieldLastModified(field);
  const isProtected = isProtectedField(field);
  
  const handleDoubleClick = () => {
    if (isProtected) {
      return; // Don't allow editing of protected fields
    }
    onDoubleClick?.(field);
  };

  const handleAuditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAuditClick?.(field);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "text-sm text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors",
          !isProtected && "cursor-pointer",
          isProtected && "cursor-not-allowed opacity-75",
          (isEdited || isModified) && "text-blue-600 font-medium",
          className
        )}
        onDoubleClick={handleDoubleClick}
        title={isProtected ? "This field is calculated automatically" : "Double-click to edit"}
      >
        {displayValue || '-'}
        {(isEdited || isModified) && showAuditIcon && (
          <span className="ml-2 inline-flex items-center">
            <Clock className="w-3 h-3 text-blue-500" />
          </span>
        )}
      </div>
    </TooltipProvider>
  );
};