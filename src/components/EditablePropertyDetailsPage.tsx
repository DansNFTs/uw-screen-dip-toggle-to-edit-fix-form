import React, { useState, useRef, useEffect } from 'react';
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

export const EditablePropertyDetailsPage: React.FC = () => {
  const { isEditingEnabled, isEditMode, hasUnsavedChanges, hasSavedChanges, setIsEditMode, setHasUnsavedChanges, saveChanges, exitEditMode, storeOriginalState, restoreAllOriginalState } = useEditMode();
  const { addAuditEntry, auditLog, currentSessionId, startAuditSession, endAuditSession, cancelAuditSession } = useAudit();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const initialFormData = {
    addressOfProperty: '',
    mortgageOfProperty: '',
    region: 'North',
    yearPropertyBuilt: '0',
    isNewBuild: 'No',
    readyForOccupation: 'Yes',
    othersLivingInProperty: 'No',
    groundRentServiceCharge: '£0'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [comparisonModal, setComparisonModal] = useState({ open: false, fieldName: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const fieldRefs = useRef<{ [key: string]: HTMLInputElement | HTMLButtonElement | null }>({});

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

  const handleInputChange = (field: string, value: string, section: string = 'Property Details') => {
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
      description: "Your property details have been updated.",
    });
  };

  // Focus on specific field when entering edit mode
  useEffect(() => {
    if (isEditMode && focusedField && fieldRefs.current[focusedField]) {
      const fieldElement = fieldRefs.current[focusedField];
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        fieldElement?.focus();
        fieldElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isEditMode, focusedField]);

  const handleFieldDoubleClick = (field: string) => {
    if (isEditingEnabled && !isEditMode) {
      // Store which field was clicked to enter edit mode
      setFocusedField(field);
      // Start editing this specific field
      setIsEditMode(true);
      if (!currentSessionId) {
        startAuditSession();
        Object.entries(formData).forEach(([key, value]) => {
          storeOriginalState(`formData.${key}`, value);
        });
      }
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

  const renderField = (label: string, field: string, value: string, isEven: boolean, section: string = 'Property Details', type: 'input' | 'select' = 'input', options?: string[]) => {
    const edited = isFieldEdited(field);

    if (isEditMode) {
      return (
        <div key={field} className={`flex w-full gap-4 items-center p-2 ${isEven ? 'bg-[#F7F8FA]' : ''}`}>
          <Label className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
            {label}
          </Label>
          {type === 'select' && options ? (
            <Select value={value} onValueChange={(newValue) => handleInputChange(field, newValue, section)}>
              <SelectTrigger 
                ref={(ref) => fieldRefs.current[field] = ref}
                className="flex-1 shrink basis-[0%]"
              >
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
              ref={(ref) => fieldRefs.current[field] = ref}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value, section)}
              className="flex-1 shrink basis-[0%]"
            />
          )}
        </div>
      );
    }

    const fieldClasses = isEditingEnabled 
      ? `flex w-full gap-4 text-base flex-wrap p-1 cursor-pointer hover:bg-gray-50 ${isEven ? 'bg-[#F7F8FA]' : ''}`
      : `flex w-full gap-4 text-base flex-wrap p-1 ${isEven ? 'bg-[#F7F8FA]' : ''}`;

    return (
      <div 
        key={field} 
        className={fieldClasses}
        onDoubleClick={() => handleFieldDoubleClick(field)}
        title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
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

  const propertyFields = [
    { label: 'Address of property to be mortgaged', field: 'addressOfProperty' },
    { label: 'Mortgage of property to be mortgaged', field: 'mortgageOfProperty' },
    { label: 'Region', field: 'region', type: 'select' as const, options: ['North', 'South', 'East', 'West', 'Central'] },
    { label: 'Year property was built', field: 'yearPropertyBuilt' },
    { label: 'Is the property classed as a new build', field: 'isNewBuild', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Will the property be ready for immediate occupation', field: 'readyForOccupation', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Will anyone over the age of 17, other than the applicant(s) be living in the property on the date of completion', field: 'othersLivingInProperty', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Ground rent/service charge', field: 'groundRentServiceCharge' }
  ];

  return (
    <>
      <div className="p-8 max-md:px-5">
        <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] bg-white p-6 rounded">
          <div className="mb-8">
            <h1 className="text-[#165788] text-[22px] font-medium">
              Property details
            </h1>
          </div>
        
          <div className="space-y-6">
            {/* Property Details Section */}
            <section className="w-full">
              <div className="w-full">
                {propertyFields.map((field, index) => 
                  renderField(
                    field.label, 
                    field.field, 
                    formData[field.field as keyof typeof formData], 
                    index % 2 === 0,
                    'Property Details',
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