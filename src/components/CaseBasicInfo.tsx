
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useEditMode } from '../contexts/EditModeContext';

interface CaseBasicInfoProps {
  caseId: string;
  enquiryNo: string;
  applicationNo: string;
  showEditBadge?: boolean;
  isEditing?: boolean;
}

export const CaseBasicInfo: React.FC<CaseBasicInfoProps> = ({
  caseId,
  enquiryNo,
  applicationNo,
  showEditBadge = false,
  isEditing = false,
}) => {
  const { hasUnsavedChanges, hasSavedChanges, caseVersion } = useEditMode();

  const renderFieldRow = (label: string, value: string) => {
    return (
      <div className="flex min-w-[267px] w-full justify-between">
        <div className="text-black self-stretch gap-2.5 w-[170px] py-1 flex items-center">
          {label}
        </div>
        <div className="text-black self-stretch whitespace-nowrap flex-1 shrink basis-[0%] py-1">
          {value}
        </div>
      </div>
    );
  };

  // Show badge if there are unsaved changes, saved changes, versioned case, or if explicitly requested
  const shouldShowBadge = hasUnsavedChanges || hasSavedChanges || caseVersion > 0 || showEditBadge;

  return (
    <div className="flex w-full max-w-[267px] flex-col items-stretch text-black pb-1">
      <div className="flex items-center justify-between gap-2 pt-8 pb-2">
        <div className="flex flex-col">
          <h2 className="text-black text-lg font-medium">
            Dip referred
          </h2>
          {hasSavedChanges && !hasUnsavedChanges && (
            <p className="text-gray-500 text-sm mt-1">
              Last edited {new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          )}
        </div>
        {shouldShowBadge && (
          <Badge 
            variant={hasUnsavedChanges ? "destructive" : hasSavedChanges ? "warning" : caseVersion > 0 ? "default" : "default"}
            className="text-xs"
          >
            {hasUnsavedChanges ? "Editing" : hasSavedChanges ? "Draft" : caseVersion > 0 ? `V${caseVersion}` : "Edited"}
          </Badge>
        )}
      </div>
      <div className="flex w-full flex-col items-stretch text-sm font-normal justify-center">
        <div className="w-full">
          {renderFieldRow("Case ID", caseId)}
          {renderFieldRow("Enquiry no.", enquiryNo)}
          {renderFieldRow("application no.", applicationNo)}
        </div>
      </div>
    </div>
  );
};
