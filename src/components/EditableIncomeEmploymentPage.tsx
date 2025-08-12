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
import { useUnifiedData } from '../contexts/UnifiedDataContext';
import { useFormSync } from '../hooks/useFormSync';


export const EditableIncomeEmploymentPage: React.FC = () => {
  const { isEditingEnabled, isEditMode, hasUnsavedChanges, hasSavedChanges, toggleEditMode, setHasUnsavedChanges, saveChanges, exitEditMode, storeOriginalState, restoreAllOriginalState } = useEditMode();
  const { addAuditEntry, auditLog, currentSessionId, startAuditSession, endAuditSession, cancelAuditSession } = useAudit();
  const { getFormattedApplicantNames } = useApplicantData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [applicantJamesName, applicantJaneName] = getFormattedApplicantNames();
  
  const initialFormData = {
    // James Taylor employment data
    jamesEmploymentStatus: 'Employed',
    jamesGrossBasicIncome: '£52,000',
    jamesEmploymentTenure: 'Permanent',
    jamesEmploymentStartDate: '01/04/2016',
    jamesTimeInEmployment: '9 years and 3 months',
    jamesJobTitle: 'Accountant',
    jamesEmployerName: 'ABC Accountant',
    jamesExpectedRetirementAge: '70',
    jamesAgeAtEndOfTerm: '61 years',
    jamesProbationaryPeriod: 'No',
    jamesRedundancyPeriod: 'No',
    jamesFutureChanges: 'No',
    jamesMonthlyPreTaxSalary: '£0.00',
    
    // Jane Taylor employment data
    janeEmploymentStatus: 'Employed',
    janeGrossBasicIncome: '£50,000',
    janeEmploymentTenure: 'Permanent',
    janeEmploymentStartDate: '01/09/2019',
    janeTimeInEmployment: '5 years and 10 months',
    janeJobTitle: 'Manager',
    janeEmployerName: 'NHS',
    janeExpectedRetirementAge: '70',
    janeAgeAtEndOfTerm: '60 years',
    janeProbationaryPeriod: 'No',
    janeRedundancyPeriod: 'No',
    janeFutureChanges: 'No',
    janeMonthlyPreTaxSalary: '£60.00'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [comparisonModal, setComparisonModal] = useState({ open: false, fieldName: '' });
  
  // Enable form sync for real-time updates to unified data
  const { syncField } = useFormSync({ 
    formData, 
    enabled: isEditMode 
  });

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

// Form sync is now handled by useFormSync hook

  const handleInputChange = (field: string, value: string, section: string = 'Employment') => {
    const oldValue = formData[field as keyof typeof formData];
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Sync individual field to unified data
    syncField(field, value);
    
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
      description: "Your employment and income information has been updated.",
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

  const handleFieldDoubleClick = (field: string) => {
    console.log('Double clicked field:', field);
    // Check if editing is enabled
    if (!isEditingEnabled) {
      toast({
        title: "Enable editing first",
        description: "Please enable editing mode to modify fields.",
      });
      return;
    }
    
    // Navigate to unified data capture form - determine applicant number based on field prefix
    const applicantNumber = field.startsWith('james') ? 1 : 2;
    const currentPath = window.location.pathname;
    navigate(`/data-capture/applicants/${applicantNumber}?field=${field}&from=${encodeURIComponent(currentPath)}`);
  };

  const renderField = (label: string, field: string, value: string, isEven: boolean, section: string = 'Employment', type: 'input' | 'select' = 'input', options?: string[]) => {
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

    const fieldClasses = `flex w-full gap-4 text-base flex-wrap p-1 ${isEditingEnabled ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed opacity-60'} ${isEven ? 'bg-[#F7F8FA]' : ''}`;

    return (
      <div 
        key={field} 
        className={fieldClasses}
        onDoubleClick={() => isEditingEnabled && handleFieldDoubleClick(field)}
        title={isEditingEnabled ? "Double-click to edit this field" : "Enable editing to modify this field"}
      >
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

  const jamesEmploymentFields = [
    { label: 'Employment status', field: 'jamesEmploymentStatus', type: 'select' as const, options: ['Employed', 'Self-employed', 'Retired', 'Unemployed'] },
    { label: 'Gross basic income', field: 'jamesGrossBasicIncome' },
    { label: 'Employment tenure', field: 'jamesEmploymentTenure', type: 'select' as const, options: ['Permanent', 'Fixed term', 'Temporary', 'Probationary'] },
    { label: 'Employment start date', field: 'jamesEmploymentStartDate' },
    { label: 'Time in employment', field: 'jamesTimeInEmployment' },
    { label: 'Job title', field: 'jamesJobTitle' },
    { label: 'Employer name', field: 'jamesEmployerName' },
    { label: 'Expected retirement age', field: 'jamesExpectedRetirementAge' },
    { label: 'Age at end of term', field: 'jamesAgeAtEndOfTerm' },
    { label: 'Is the applicant currently in a probationary period', field: 'jamesProbationaryPeriod', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Is the applicant currently under a redundancy period', field: 'jamesRedundancyPeriod', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Any future changes to income/expenditure', field: 'jamesFutureChanges', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Monthly pre-tax salary sacrifices', field: 'jamesMonthlyPreTaxSalary' },
  ];

  const janeEmploymentFields = [
    { label: 'Employment status', field: 'janeEmploymentStatus', type: 'select' as const, options: ['Employed', 'Self-employed', 'Retired', 'Unemployed'] },
    { label: 'Gross basic income', field: 'janeGrossBasicIncome' },
    { label: 'Employment tenure', field: 'janeEmploymentTenure', type: 'select' as const, options: ['Permanent', 'Fixed term', 'Temporary', 'Probationary'] },
    { label: 'Employment start date', field: 'janeEmploymentStartDate' },
    { label: 'Time in employment', field: 'janeTimeInEmployment' },
    { label: 'Job title', field: 'janeJobTitle' },
    { label: 'Employer name', field: 'janeEmployerName' },
    { label: 'Expected retirement age', field: 'janeExpectedRetirementAge' },
    { label: 'Age at end of term', field: 'janeAgeAtEndOfTerm' },
    { label: 'Is the applicant currently in a probationary period', field: 'janeProbationaryPeriod', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Is the applicant currently under a redundancy period', field: 'janeRedundancyPeriod', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Any future changes to income/expenditure', field: 'janeFutureChanges', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Monthly pre-tax salary sacrifices', field: 'janeMonthlyPreTaxSalary' },
  ];

  return (
    <div className="p-8 max-md:px-5">
      
      <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] bg-white p-6 rounded">
        <div className="mb-8">
          <h1 className="text-[#165788] text-[22px] font-medium">
            Income details & Employment details
          </h1>
        </div>
        
        <div className="space-y-8">
          {/* James Taylor Employment Section */}
          <section className="w-full">
            <h3 className="text-[#165788] text-lg font-medium mb-4">{applicantJamesName}</h3>
            <div className="w-full">
              {jamesEmploymentFields.map((field, index) => 
                renderField(
                  field.label, 
                  field.field, 
                  formData[field.field as keyof typeof formData], 
                  index % 2 === 0,
                  'James Taylor Employment',
                  field.type,
                  field.options
                )
              )}
            </div>
          </section>

          {/* Jane Taylor Employment Section */}
          <section className="w-full">
            <h3 className="text-[#165788] text-lg font-medium mb-4">{applicantJaneName}</h3>
            <div className="w-full">
              {janeEmploymentFields.map((field, index) => 
                renderField(
                  field.label, 
                  field.field, 
                  formData[field.field as keyof typeof formData], 
                  index % 2 === 0,
                  'Jane Taylor Employment',
                  field.type,
                  field.options
                )
              )}
            </div>
          </section>
        </div>
      </div>

      <FieldComparisonModal
        open={comparisonModal.open}
        onOpenChange={(open) => setComparisonModal({ open, fieldName: '' })}
        fieldName={comparisonModal.fieldName}
        auditEntries={auditLog}
      />
    </div>
  );
};
