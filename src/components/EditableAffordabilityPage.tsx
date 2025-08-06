import React, { useState } from 'react';
import { useEditMode } from '../contexts/EditModeContext';
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

export const EditableAffordabilityPage: React.FC = () => {
  const { isEditMode, hasUnsavedChanges, hasSavedChanges, toggleEditMode, setHasUnsavedChanges, saveChanges, exitEditMode, storeOriginalState, restoreAllOriginalState } = useEditMode();
  const { addAuditEntry, auditLog, currentSessionId, startAuditSession, endAuditSession, cancelAuditSession } = useAudit();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const initialFormData = {
    affordabilityDecision: 'Accepted',
    borrowingCapacity: '616021.26',
    maxBorrowingIncomeMultiple: '510000.00',
    maxBorrowingLTV: '237500.00',
    meetsMinimumRentCover: 'No',
    minimumAcceptableRentalIncome: '0.00',
    freeDisposableIncome: '4295.14',
    mortgageSubAffordability: '1220.17',
    netMonthlyIncomeAffordability: '6400.60',
    totalMonthlyCreditCommitments: '450.00',
    affordabilityScore: '5',
    affordabilityPercentage: '252.01',
    incomeMultipleAssessed: '1.72',
    maxIncomeMultipleAllowed: '5.00',
    basedOnDetailsWouldLend: '237500.00'
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
      cancelAuditSession();
    };

    window.addEventListener('restoreOriginalState', handleRestore);
    return () => {
      window.removeEventListener('restoreOriginalState', handleRestore);
    };
  }, [restoreAllOriginalState, cancelAuditSession]);

  const handleInputChange = (field: string, value: string, section: string = 'Affordability') => {
    if (!isEditMode) return;
    
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
      description: "Your affordability information has been updated.",
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

  const renderField = (label: string, field: string, value: string, isEven: boolean, section: string = 'Affordability', type: 'input' | 'select' = 'input', options?: string[]) => {
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
  const affordabilityFields = [
    { label: 'Affordability Decision', field: 'affordabilityDecision', type: 'select' as const, options: ['Accepted', 'Declined', 'Refer'] },
    { label: 'Borrowing capacity', field: 'borrowingCapacity', type: 'input' as const, options: undefined },
    { label: 'Max borrowing based on income multiple', field: 'maxBorrowingIncomeMultiple', type: 'input' as const, options: undefined },
    { label: 'Max borrowing based on LTV', field: 'maxBorrowingLTV', type: 'input' as const, options: undefined },
    { label: 'Meets Minimum Rent Cover', field: 'meetsMinimumRentCover', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Minimum Acceptable Rental Income', field: 'minimumAcceptableRentalIncome', type: 'input' as const, options: undefined },
    { label: 'Free disposable income', field: 'freeDisposableIncome', type: 'input' as const, options: undefined },
    { label: 'Mortgage sub under affordability rules', field: 'mortgageSubAffordability', type: 'input' as const, options: undefined },
    { label: 'Net monthly income for affordability', field: 'netMonthlyIncomeAffordability', type: 'input' as const, options: undefined },
    { label: 'Total monthly credit commitments', field: 'totalMonthlyCreditCommitments', type: 'input' as const, options: undefined },
    { label: 'Affordability score', field: 'affordabilityScore', type: 'input' as const, options: undefined },
    { label: 'Affordability percentage', field: 'affordabilityPercentage', type: 'input' as const, options: undefined },
    { label: 'Income multiple for assessed', field: 'incomeMultipleAssessed', type: 'input' as const, options: undefined },
    { label: 'Max income multiple allowed for total loan', field: 'maxIncomeMultipleAllowed', type: 'input' as const, options: undefined },
    { label: 'Based on the details provided we would lend', field: 'basedOnDetailsWouldLend', type: 'input' as const, options: undefined }
  ];

  return (
    <>
      <div className="p-8 max-md:px-5">
        <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] bg-white p-6 rounded">
          <div className="mb-8">
            <h1 className="text-[#165788] text-[22px] font-medium">
              Affordability
            </h1>
          </div>
        
          <div className="space-y-6">
            {/* Affordability Section */}
            <section className="w-full">
              <div className="w-full">
                {affordabilityFields.map((field, index) => 
                  renderField(
                    field.label, 
                    field.field, 
                    formData[field.field as keyof typeof formData], 
                    index % 2 === 0,
                    'Affordability',
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