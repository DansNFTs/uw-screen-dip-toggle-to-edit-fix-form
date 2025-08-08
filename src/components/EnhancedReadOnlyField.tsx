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
  value?: string;
  label: string;
  className?: string;
  onDoubleClick?: (field: string) => void;
  onAuditClick?: (field: string) => void;
  showAuditIcon?: boolean;
}

export const EnhancedReadOnlyField: React.FC<EnhancedReadOnlyFieldProps> = ({
  field,
  value: propValue,
  label,
  className = "",
  onDoubleClick,
  onAuditClick,
  showAuditIcon = true,
}) => {
  const { auditLog } = useAudit();
  const { isFieldModified, getFieldLastModified, getFieldValue } = useUnifiedData();
  
  // Get value from unified context, fallback to prop value
  const value = getFieldValue(field) || propValue || '';
  
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
      <div className={cn("space-y-1", className)}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {(isEdited || isModified) && showAuditIcon && (
            <div className="flex items-center gap-1">
              {lastModified && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Modified</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Last modified: {formatTimestamp(lastModified)}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {onAuditClick && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleAuditClick}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      aria-label="View change history"
                    >
                      <Clock className="w-3 h-3 text-blue-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to view change history</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
          {isProtected && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Calculated</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This value is calculated automatically and cannot be edited</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        <EditableField 
          isEdited={isEdited || isModified}
          className={cn(
            isProtected && "bg-muted/50 border border-muted"
          )}
        >
          <div
            className={cn(
              "p-3 border border-gray-200 rounded-md bg-gray-50 text-sm",
              !isProtected && "cursor-pointer hover:bg-gray-100 transition-colors",
              isProtected && "bg-muted cursor-not-allowed opacity-75",
              (isEdited || isModified) && "bg-blue-50 border-blue-200"
            )}
            onDoubleClick={handleDoubleClick}
            title={isProtected ? "This field is calculated automatically" : "Double-click to edit"}
          >
            {value || '-'}
          </div>
        </EditableField>
      </div>
    </TooltipProvider>
  );
};