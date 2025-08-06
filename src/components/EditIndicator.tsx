
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Edit, Save, AlertCircle } from 'lucide-react';
import { useEditMode } from '../contexts/EditModeContext';

interface EditIndicatorProps {
  className?: string;
  showText?: boolean;
}

export const EditIndicator: React.FC<EditIndicatorProps> = ({ 
  className = "", 
  showText = true 
}) => {
  const { isEditMode, hasUnsavedChanges, hasSavedChanges } = useEditMode();

  if (!isEditMode && !hasUnsavedChanges && !hasSavedChanges) {
    return null;
  }

  const getIndicatorProps = () => {
    if (hasUnsavedChanges) {
      return {
        variant: "destructive" as const,
        icon: AlertCircle,
        text: "Unsaved Changes",
        className: "animate-pulse"
      };
    }
    
    if (hasSavedChanges || isEditMode) {
      return {
        variant: "default" as const,
        icon: Save,
        text: "Recently Edited",
        className: ""
      };
    }

    return {
      variant: "outline" as const,
      icon: Edit,
      text: "Edit Mode",
      className: ""
    };
  };

  const { variant, icon: Icon, text, className: indicatorClassName } = getIndicatorProps();

  return (
    <Badge 
      variant={variant} 
      className={`flex items-center gap-1 ${indicatorClassName} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {showText && <span className="text-xs">{text}</span>}
    </Badge>
  );
};
