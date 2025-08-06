
import React from 'react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  children: React.ReactNode;
  isEdited?: boolean;
  className?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({ 
  children, 
  isEdited = false, 
  className = "" 
}) => {
  return (
    <div className={cn(
      "transition-all duration-200",
      isEdited && "bg-blue-50 border-l-2 border-blue-400 pl-2 -ml-2",
      className
    )}>
      {children}
    </div>
  );
};
