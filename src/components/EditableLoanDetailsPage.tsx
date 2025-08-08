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
    applicationPurpose: 'Residential',
    applicationType: 'Purchase',
    applicationSubtype: 'Standard',
    totalPurchasePrice: '£290,000',
    loanAmount: '£175,000',
    depositAmount: '£75,000',
    sourceOfDeposit: '£75,000 Own savings',
    valueOfApplicantShare: '100.00%',
    currentMortgageBalance: '£56,000',
    outstandingMortgageValue: '£58,000',
    term: '25 years',
    ltv: '70.00%',
    maxLtvAllowed: '95.00%',
    repaymentType: 'Repayment',
    initialFixedRate: 'No',
    stressRate: '6.85%',
    // Edit mode specific fields from screenshot
    loanPurpose: 'Residential purchase',
    loanAmountEdit: '',
    termEdit: '',
    interestRateType: '',
    numberOfAdults: '',
    numberOfChildren: '',
    dependentsLivingWithYou: '',
    householdIncome: '',
    monthlyMortgagePayment: '',
    monthlyRent: '',
    creditCardPayments: '',
    loanRepayments: '',
    otherCommitments: ''
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

  const handleInputChange = (field: string, value: string, section: string = 'Loan Details') => {
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
      description: "Your loan details have been updated.",
    });
  };

  const handleFieldDoubleClick = (field: string) => {
    if (isEditingEnabled && !isEditMode) {
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

  const renderField = (label: string, field: string, value: string, isEven: boolean, section: string = 'Loan Details', type: 'input' | 'select' | 'radio' = 'input', options?: string[]) => {
    const edited = isFieldEdited(field);

    if (isEditMode) {
      return (
        <div key={field} className={`flex w-full gap-4 items-center p-2 ${isEven ? 'bg-[#F7F8FA]' : ''}`}>
          <Label className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
            {label}
          </Label>
          {type === 'radio' && options ? (
            <RadioGroup value={value} onValueChange={(newValue) => handleInputChange(field, newValue, section)} className="flex-1 shrink basis-[0%]">
              <div className="flex gap-4">
                {options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${field}-${option}`} />
                    <Label htmlFor={`${field}-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : type === 'select' && options ? (
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

  // Read-only fields (unchanged)
  const loanFields = [
    { label: 'Application purpose', field: 'applicationPurpose', type: 'select' as const, options: ['Residential', 'Commercial', 'Buy to Let'] },
    { label: 'Application type', field: 'applicationType', type: 'select' as const, options: ['Purchase', 'Remortgage', 'Additional Borrowing'] },
    { label: 'Application subtype', field: 'applicationSubtype', type: 'select' as const, options: ['Standard', 'Help to Buy', 'Right to Buy'] },
    { label: 'Total Purchase Price/Full Market Value', field: 'totalPurchasePrice' },
    { label: 'Loan amount', field: 'loanAmount' },
    { label: 'Deposit amount', field: 'depositAmount' },
    { label: 'Source of deposit', field: 'sourceOfDeposit' },
    { label: 'Value of applicant share', field: 'valueOfApplicantShare' },
    { label: 'Current mortgage balance', field: 'currentMortgageBalance' },
    { label: 'Outstanding mortgage value', field: 'outstandingMortgageValue' },
    { label: 'Term', field: 'term' },
    { label: 'LTV', field: 'ltv' },
    { label: 'Max LTV allowed for total loan', field: 'maxLtvAllowed' },
    { label: 'Repayment type', field: 'repaymentType', type: 'select' as const, options: ['Repayment', 'Interest Only', 'Part and Part'] },
    { label: 'Initial fixed rate of 5 years or more', field: 'initialFixedRate', type: 'select' as const, options: ['Yes', 'No'] },
    { label: 'Stress rate', field: 'stressRate' }
  ];

  // Edit mode fields (from screenshot)
  const editModeFields = {
    mortgageDetails: [
      { label: 'What is the purpose of your loan?', field: 'loanPurpose', type: 'select' as const, options: ['Residential purchase', 'Buy to let purchase', 'Remortgage', 'Further advance'] },
      { label: 'How much do you want to borrow?', field: 'loanAmountEdit', type: 'input' as const, options: undefined },
      { label: 'Over how many years?', field: 'termEdit', type: 'input' as const, options: undefined },
      { label: 'Do you want a fixed or variable interest rate?', field: 'interestRateType', type: 'radio' as const, options: ['Fixed', 'Variable'] }
    ],
    householdDetails: [
      { label: 'How many adults will be living in the property?', field: 'numberOfAdults', type: 'input' as const, options: undefined },
      { label: 'How many children will be living in the property?', field: 'numberOfChildren', type: 'input' as const, options: undefined },
      { label: 'Do you have any dependents not living with you?', field: 'dependentsLivingWithYou', type: 'radio' as const, options: ['Yes', 'No'] }
    ],
    householdExpenditure: [
      { label: 'What is your total annual household income?', field: 'householdIncome', type: 'input' as const, options: undefined },
      { label: 'What do you currently pay per month for your mortgage?', field: 'monthlyMortgagePayment', type: 'input' as const, options: undefined },
      { label: 'What do you currently pay per month in rent?', field: 'monthlyRent', type: 'input' as const, options: undefined },
      { label: 'What do you pay per month towards credit cards?', field: 'creditCardPayments', type: 'input' as const, options: undefined },
      { label: 'What do you pay per month towards loan repayments?', field: 'loanRepayments', type: 'input' as const, options: undefined },
      { label: 'What do you pay per month towards other financial commitments?', field: 'otherCommitments', type: 'input' as const, options: undefined }
    ]
  };

  return (
    <>
      <div className="p-8 max-md:px-5">
        <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] bg-white p-6 rounded">
          <div className="mb-8">
            <h1 className="text-[#165788] text-[22px] font-medium">
              Loan Details
            </h1>
          </div>
        
          <div className="space-y-6">
            {isEditMode ? (
              // Edit Mode Form (from screenshot)
              <>
                {/* Mortgage Details Section */}
                <section className="w-full">
                  <h2 className="text-[#165788] text-lg font-medium mb-4">Mortgage details</h2>
                  <div className="w-full">
                    {editModeFields.mortgageDetails.map((field, index) => 
                      renderField(
                        field.label, 
                        field.field, 
                        formData[field.field as keyof typeof formData], 
                        index % 2 === 0,
                        'Mortgage Details',
                        field.type,
                        field.options
                      )
                    )}
                  </div>
                </section>

                {/* Household Details Section */}
                <section className="w-full">
                  <h2 className="text-[#165788] text-lg font-medium mb-4">Household details</h2>
                  <div className="w-full">
                    {editModeFields.householdDetails.map((field, index) => 
                      renderField(
                        field.label, 
                        field.field, 
                        formData[field.field as keyof typeof formData], 
                        index % 2 === 0,
                        'Household Details',
                        field.type,
                        field.options
                      )
                    )}
                  </div>
                </section>

                {/* Household Expenditure Section */}
                <section className="w-full">
                  <h2 className="text-[#165788] text-lg font-medium mb-4">Household expenditure</h2>
                  <div className="w-full">
                    {editModeFields.householdExpenditure.map((field, index) => 
                      renderField(
                        field.label, 
                        field.field, 
                        formData[field.field as keyof typeof formData], 
                        index % 2 === 0,
                        'Household Expenditure',
                        field.type,
                        field.options
                      )
                    )}
                  </div>
                </section>
              </>
            ) : (
              // Read-only View (unchanged)
              <section className="w-full">
                <div className="w-full">
                  {loanFields.map((field, index) => 
                    renderField(
                      field.label, 
                      field.field, 
                      formData[field.field as keyof typeof formData], 
                      index % 2 === 0,
                      'Loan Details',
                      field.type,
                      field.options
                    )
                  )}
                </div>
              </section>
            )}
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