import React, { useState } from 'react';
import { useEditMode } from '../contexts/EditModeContext';
import { useApplicantData } from '../contexts/ApplicantDataContext';
import { useAudit } from '../contexts/AuditContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { FieldComparisonModal } from './FieldComparisonModal';

export const EditableCreditInformationPage: React.FC = () => {
  const { isEditMode, hasUnsavedChanges, hasSavedChanges, toggleEditMode, setHasUnsavedChanges, saveChanges, exitEditMode, storeOriginalState, restoreAllOriginalState } = useEditMode();
  const { addAuditEntry, auditLog, currentSessionId, startAuditSession, endAuditSession, cancelAuditSession } = useAudit();
  const { getFormattedApplicantNames } = useApplicantData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [applicantJamesName, applicantJaneName] = getFormattedApplicantNames();
  
  const initialFormData = {
    creditScore: '1030',
    delphiScore: '-998',
    consumerIndebtednessIndex: '-1',
    
    // James Taylor
    jamesDebtManagementArrears: 'No',
    jamesCCJsDefaults: 'No',
    
    // Jane Taylor
    janeDebtManagementArrears: 'No',
    janeCCJsDefaults: 'No'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [comparisonModal, setComparisonModal] = useState({ open: false, fieldName: '' });

  // Store original state when entering edit mode
  React.useEffect(() => {
    if (isEditMode && !currentSessionId) {
      startAuditSession(); // Start tracking audit entries for this session
      Object.entries(formData).forEach(([key, value]) => {
        storeOriginalState(`formData.${key}`, value);
      });
    }
  }, [isEditMode, currentSessionId, storeOriginalState, startAuditSession]);

  // Listen for cancel events to restore original state
  React.useEffect(() => {
    const handleRestore = () => {
      const originalState = restoreAllOriginalState();
      const restoredFormData: any = {};
      
      Object.keys(initialFormData).forEach(key => {
        const originalValue = originalState[`formData.${key}`];
        if (originalValue !== undefined) {
          restoredFormData[key] = originalValue;
        } else {
          restoredFormData[key] = initialFormData[key as keyof typeof initialFormData];
        }
      });
      
      setFormData(restoredFormData);
      cancelAuditSession(); // Remove all audit entries from this session
    };

    // We need a way to detect when cancel is pressed
    // For now, we'll use a custom event listener
    window.addEventListener('editModeCancel', handleRestore);
    
    return () => {
      window.removeEventListener('editModeCancel', handleRestore);
    };
  }, [restoreAllOriginalState, cancelAuditSession]);

  const handleInputChange = (field: string, value: string, section: string = 'Credit Information') => {
    const oldValue = formData[field as keyof typeof formData];
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    console.log('Field changed:', { field, oldValue, value, section, currentSessionId });
    
    // Add audit entry for the change
    addAuditEntry(field, oldValue, value, section);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    saveChanges();
    endAuditSession(); // End the current audit session when saving
    toast({
      title: "Changes saved",
      description: "Your credit information has been updated.",
    });
  };

  const getButtonText = () => {
    if (!isEditMode) return "Edit";
    if (hasSavedChanges) return "Exit Edit Mode";
    return "Cancel Edit";
  };

  const getButtonVariant = () => {
    if (!isEditMode) return "default";
    if (hasSavedChanges) return "outline";
    return "destructive";
  };

  const handleMainButtonClick = () => {
    if (hasSavedChanges) {
      exitEditMode();
    } else {
      toggleEditMode();
    }
  };

  const handleAuditClick = () => {
    navigate('/audit-log');
  };

  const handleFieldComparisonClick = (fieldName: string) => {
    setComparisonModal({ open: true, fieldName });
  };

  const isFieldEdited = (fieldName: string) => {
    return auditLog.some(entry => entry.field === fieldName);
  };

  const renderField = (label: string, field: string, value: string, isEven: boolean, section: string = 'Credit Information', type: 'input' | 'select' = 'input', options?: string[]) => {
    const edited = isFieldEdited(field);

    if (isEditMode) {
      return (
        <div key={field} className={`flex w-full gap-4 items-center p-2 ${isEven ? 'bg-[#F7F8FA]' : ''}`}>
          <Label className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
            {label}
          </Label>
          {type === 'select' && options ? (
            <Select value={value} onValueChange={(newValue) => handleInputChange(field, newValue, section)}>
              <SelectTrigger className="flex-1 shrink basis-[0%]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value, section)}
              className="flex-1 shrink basis-[0%]"
            />
          )}
        </div>
      );
    }

    return (
      <div key={field} className={`flex w-full gap-4 text-base flex-wrap p-1 ${isEven ? 'bg-[#F7F8FA]' : ''}`}>
        <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
          {label}
        </div>
        <div className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2">
          {value}
          {edited && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => handleFieldComparisonClick(field)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Clock className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This field has been edited. Click to view audit log.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    );
  };

  const creditInfoFields = [
    { label: 'Credit score', field: 'creditScore', type: 'input' as const, options: undefined },
    { label: 'Delphi score', field: 'delphiScore', type: 'input' as const, options: undefined },
    { label: 'Consumer indebtedness index (SPI)', field: 'consumerIndebtednessIndex', type: 'input' as const, options: undefined }
  ];

  const jamesTaylorFields = [
    { label: 'In the last 12 months has the applicant entered into a debt management plan Had any secured or unsecured arrears', field: 'jamesDebtManagementArrears', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'In the last 3 years has this applicant had any of the following CCJs (Court of Decree in Scotland) Registered defaults', field: 'jamesCCJsDefaults', type: 'select' as const, options: ['Yes', 'No'] }
  ];

  const janeTaylorFields = [
    { label: 'In the last 12 months has the applicant entered into a debt management plan Had any secured or unsecured arrears', field: 'janeDebtManagementArrears', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'In the last 3 years has this applicant had any of the following CCJs (Court of Decree in Scotland) Registered defaults', field: 'janeCCJsDefaults', type: 'select' as const, options: ['Yes', 'No'] }
  ];

  return (
    <>
      <div className="p-8 max-md:px-5">
        <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] bg-white p-6 rounded">
          <div className="mb-8">
            <h1 className="text-[#165788] text-[22px] font-medium">
              Credit Information
            </h1>
          </div>
        
          <div className="space-y-6">
            {/* Credit Information Section */}
            <section className="w-full">
              <div className="w-full">
                {creditInfoFields.map((field, index) => 
                  renderField(
                    field.label, 
                    field.field, 
                    formData[field.field as keyof typeof formData], 
                    index % 2 === 0,
                    'Credit Information',
                    field.type,
                    field.options
                  )
                )}
              </div>
            </section>

            {/* James Taylor Section */}
            <section className="w-full">
              <h3 className="text-[#165788] text-lg font-medium mb-4">{applicantJamesName}</h3>
              <div className="w-full">
                {jamesTaylorFields.map((field, index) => 
                  renderField(
                    field.label, 
                    field.field, 
                    formData[field.field as keyof typeof formData], 
                    index % 2 === 0,
                    'James Taylor',
                    field.type,
                    field.options
                  )
                )}
              </div>
            </section>

            {/* Jane Taylor Section */}
            <section className="w-full">
              <h3 className="text-[#165788] text-lg font-medium mb-4">{applicantJaneName}</h3>
              <div className="w-full">
                {janeTaylorFields.map((field, index) => 
                  renderField(
                    field.label, 
                    field.field, 
                    formData[field.field as keyof typeof formData], 
                    index % 2 === 0,
                    'Jane Taylor',
                    field.type,
                    field.options
                  )
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <FieldComparisonModal
        open={comparisonModal.open}
        onOpenChange={(open) => setComparisonModal({ open, fieldName: '' })}
        fieldName={comparisonModal.fieldName}
        auditEntries={auditLog}
      />
    </>
  );
};