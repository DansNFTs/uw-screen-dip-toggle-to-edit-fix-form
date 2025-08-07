import React, { useState } from 'react';
import { useEditMode } from '../contexts/EditModeContext';
import { useAudit } from '../contexts/AuditContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { FieldComparisonModal } from './FieldComparisonModal';

export const EditableLoanDetailsPage: React.FC = () => {
  const { isEditingEnabled, isEditMode, hasUnsavedChanges, hasSavedChanges, setIsEditMode, setHasUnsavedChanges, saveChanges, exitEditMode, storeOriginalState, restoreAllOriginalState } = useEditMode();
  const { addAuditEntry, auditLog, currentSessionId, startAuditSession, endAuditSession, cancelAuditSession } = useAudit();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const initialFormData = {
    // Mortgage details
    bankruptcyQuestion: 'No',
    applicationPurpose: 'Residential',
    applicationType: 'Purchase',
    applicationSubtype: 'Standard',
    propertyRegion: 'North',
    totalPurchasePrice: '£290,000',
    depositAmount: '£75,000',
    requiredLoanAmount: '£175,000',
    loanToValue: '70%',
    termYears: '25',
    repaymentType: 'Repayment',
    monthlyGroundRent: '£0',
    initialFixedTerm: 'No',
    
    // Household details
    numberOfApplicants: 'Two',
    sameAddress: 'Yes',
    dependents0to13: '2',
    childBenefit: 'No',
    dependents14Plus: '0',
    
    // Household expenditure
    affordabilityMethod: 'ONS'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [comparisonModal, setComparisonModal] = useState({ open: false, fieldName: '' });

  // Store original state when entering edit mode
  React.useEffect(() => {
    if (isEditMode && !currentSessionId) {
      startAuditSession();
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

    window.addEventListener('editModeCancel', handleRestore);
    return () => {
      window.removeEventListener('editModeCancel', handleRestore);
    };
  }, [restoreAllOriginalState, cancelAuditSession]);

  const handleInputChange = (field: string, value: string, section: string = 'Mortgage') => {
    const oldValue = formData[field as keyof typeof formData];
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    console.log('Field changed:', { field, oldValue, value, section, currentSessionId });
    
    addAuditEntry(field, oldValue, value, section);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    saveChanges();
    endAuditSession();
    toast({
      title: "Changes saved",
      description: "Your mortgage and household details have been updated.",
    });
  };

  const handleFieldDoubleClick = (field: string) => {
    if (isEditingEnabled && !isEditMode) {
      setIsEditMode(true);
      if (!currentSessionId) {
        startAuditSession();
        Object.entries(formData).forEach(([key, value]) => {
          storeOriginalState(`formData.${key}`, value);
        });
      }
    }
  };

  const handleFieldComparisonClick = (fieldName: string) => {
    setComparisonModal({ open: true, fieldName });
  };

  const isFieldEdited = (fieldName: string) => {
    return auditLog.some(entry => entry.field === fieldName);
  };

  const renderRadioField = (label: string, field: string, value: string, options: string[], section: string, description?: string) => {
    const edited = isFieldEdited(field);

    if (isEditMode) {
      return (
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-800 mb-2 block">{label}</Label>
          {description && (
            <p className="text-xs text-gray-600 mb-3">{description}</p>
          )}
          <RadioGroup 
            value={value}
            onValueChange={(newValue) => handleInputChange(field, newValue, section)}
            className="flex gap-6"
          >
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field}-${option.toLowerCase()}`} />
                <Label htmlFor={`${field}-${option.toLowerCase()}`} className="text-sm">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div className="text-[#505A5F] font-normal mb-1">{label}</div>
        <div className="text-black font-medium flex items-center gap-2">
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

  const renderInputField = (label: string, field: string, value: string, section: string) => {
    const edited = isFieldEdited(field);

    if (isEditMode) {
      return (
        <div className="mb-4">
          <Label htmlFor={field} className="text-sm font-medium">{label}</Label>
          <Input 
            id={field}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value, section)}
            className="w-full"
          />
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div className="text-[#505A5F] font-normal mb-1">{label}</div>
        <div className="text-black font-medium flex items-center gap-2">
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

  const renderSelectField = (label: string, field: string, value: string, options: string[], section: string) => {
    const edited = isFieldEdited(field);

    if (isEditMode) {
      return (
        <div className="mb-4">
          <Label htmlFor={field} className="text-sm font-medium">{label}</Label>
          <Select value={value} onValueChange={(newValue) => handleInputChange(field, newValue, section)}>
            <SelectTrigger>
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
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div className="text-[#505A5F] font-normal mb-1">{label}</div>
        <div className="text-black font-medium flex items-center gap-2">
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

  return (
    <>
      <div className="p-8 max-md:px-5">
        <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] bg-white p-6 rounded">
          <div className="mb-8">
            <h1 className="text-[#165788] text-[22px] font-medium">
              Mortgage
            </h1>
          </div>
        
          <div className="space-y-8">
            {/* Mortgage Details Section */}
            <section className="w-full">
              <h2 className="text-[#165788] text-xl font-medium mb-6">Mortgage details</h2>
              
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-800 mb-3 block">Have any applicants been subject to:</Label>
                <div className="space-y-4 ml-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-2">• bankruptcy which has not been satisfied for at least 3 years?</p>
                    <p className="text-sm text-gray-700 mb-2">• an Individual voluntary arrangement (IVA) or debt relief order (DRO) that has not been satisfied for at least 3 years?</p>
                    <p className="text-sm text-gray-700 mb-3">• property repossession at any time?</p>
                    {renderRadioField('', 'bankruptcyQuestion', formData.bankruptcyQuestion, ['Yes', 'No'], 'Mortgage Details')}
                  </div>
                </div>
              </div>

              {renderRadioField('Application purpose', 'applicationPurpose', formData.applicationPurpose, ['Residential', 'Buy to Let'], 'Mortgage Details')}
              
              {renderRadioField('Application type', 'applicationType', formData.applicationType, ['Purchase', 'Remortgage'], 'Mortgage Details')}
              
              {renderSelectField('Residential purchase sub-type', 'applicationSubtype', formData.applicationSubtype, ['Standard', 'Help to Buy', 'Right to Buy'], 'Mortgage Details')}
              
              {renderSelectField('Region of the property to be mortgaged', 'propertyRegion', formData.propertyRegion, ['North', 'South', 'East', 'West', 'Central'], 'Mortgage Details')}
              
              {renderInputField('Total purchase price', 'totalPurchasePrice', formData.totalPurchasePrice, 'Mortgage Details')}
              
              {renderInputField('Deposit amount', 'depositAmount', formData.depositAmount, 'Mortgage Details')}
              
              {renderInputField('Required loan amount', 'requiredLoanAmount', formData.requiredLoanAmount, 'Mortgage Details')}
              
              {renderInputField('Loan to value', 'loanToValue', formData.loanToValue, 'Mortgage Details')}
              
              {renderInputField('Term (years)', 'termYears', formData.termYears, 'Mortgage Details')}
              
              {renderRadioField('Repayment type', 'repaymentType', formData.repaymentType, ['Repayment', 'Interest Only', 'Part And Part'], 'Mortgage Details')}
              
              {renderInputField('Monthly ground rent/service charge of the property to be purchased (If this is unknown, enter 0)', 'monthlyGroundRent', formData.monthlyGroundRent, 'Mortgage Details')}
              
              {renderRadioField('Will the initial fixed term be 60 months or more? (These are our Affordability boost products)', 'initialFixedTerm', formData.initialFixedTerm, ['Yes', 'No'], 'Mortgage Details')}
            </section>

            {/* Household Details Section */}
            <section className="w-full">
              <h2 className="text-[#165788] text-xl font-medium mb-6">Household details</h2>
              
              {renderRadioField('Number of applicants', 'numberOfApplicants', formData.numberOfApplicants, ['One', 'Two'], 'Household Details')}
              
              {renderRadioField('Will all applicants live at the same address once the mortgage completes?', 'sameAddress', formData.sameAddress, ['Yes', 'No'], 'Household Details')}
              
              {renderInputField('Number of household dependents aged 0-13', 'dependents0to13', formData.dependents0to13, 'Household Details')}
              
              {renderRadioField('Does the applicant receive child benefit?', 'childBenefit', formData.childBenefit, ['Yes', 'No'], 'Household Details')}
              
              {renderInputField('Number of household dependents aged 14 and over', 'dependents14Plus', formData.dependents14Plus, 'Household Details')}
            </section>

            {/* Household Expenditure Section */}
            <section className="w-full">
              <h2 className="text-[#165788] text-xl font-medium mb-6">Household expenditure</h2>
              
              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-4">
                  Newcastle Building Society uses Office of National Statistics (ONS) data to calculate affordability, which considers 
                  typical household expenditure for the region. Alternatively, we can calculate affordability using the applicant's 
                  expected total monthly expenditure.
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  Please select how you would like us to calculate the applicant's affordability
                </p>
                {renderRadioField('', 'affordabilityMethod', formData.affordabilityMethod, ['ONS', 'Enter expenditure'], 'Household Expenditure')}
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