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

export const EditableLoanDetailsPage: React.FC = () => {
  const { isEditingEnabled, isEditMode, hasUnsavedChanges, hasSavedChanges, setIsEditMode, setHasUnsavedChanges, saveChanges, exitEditMode, storeOriginalState, restoreAllOriginalState } = useEditMode();
  const { addAuditEntry, auditLog, currentSessionId, startAuditSession, endAuditSession, cancelAuditSession } = useAudit();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const initialFormData = {
    // Household details
    grossHouseholdIncome: '£95,000',
    netHouseholdIncome: '£6,000',
    dependentChildren: '0',
    adultDependents: '0',
    
    // Expenditure calculation
    foodShopping: '£650',
    utilityBills: '£400',
    transport: '£350',
    communicationsItRecreation: '£120',
    clothing: '£100',
    householdGoods: '£130',
    personalCare: '£180',
    otherEssential: '£290',
    totalEssentialExpenditure: '£2,220',
    discretionaryExpenditure: '£630',
    totalExpenditure: '£2,850',
    disposableIncome: '£3,150',
    
    // Application type details
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
    stressRate: '6.85%'
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

  const renderField = (label: string, field: string, value: string, isEven: boolean, section: string = 'Loan Details', type: 'input' | 'select' = 'input', options?: string[]) => {
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

  const householdFields = [
    { label: 'Gross household income', field: 'grossHouseholdIncome' },
    { label: 'Net household income', field: 'netHouseholdIncome' },
    { label: 'Number of dependent children under 18', field: 'dependentChildren' },
    { label: 'Number of adult dependents', field: 'adultDependents' }
  ];

  const expenditureFields = [
    { label: 'Food and housekeeping', field: 'foodShopping' },
    { label: 'Utility bills and council tax', field: 'utilityBills' },
    { label: 'Transport', field: 'transport' },
    { label: 'Communications, IT and recreation', field: 'communicationsItRecreation' },
    { label: 'Clothing', field: 'clothing' },
    { label: 'Household goods', field: 'householdGoods' },
    { label: 'Personal care', field: 'personalCare' },
    { label: 'Other essential expenditure', field: 'otherEssential' },
    { label: 'Total essential expenditure', field: 'totalEssentialExpenditure' },
    { label: 'Discretionary expenditure', field: 'discretionaryExpenditure' },
    { label: 'Total expenditure', field: 'totalExpenditure' },
    { label: 'Disposable income', field: 'disposableIncome' }
  ];

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

  return (
    <>
      <div className="p-8 max-md:px-5">
        <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] bg-white p-6 rounded">
          <div className="mb-8">
            <h1 className="text-[#165788] text-[22px] font-medium">
              Mortgage Application Form
            </h1>
          </div>
        
          <div className="space-y-8">
            {/* Household Details Section */}
            <section className="w-full">
              <h2 className="text-[#165788] text-lg font-medium mb-4">Household Details</h2>
              <div className="w-full border border-gray-200 rounded">
                {householdFields.map((field, index) => 
                  renderField(
                    field.label, 
                    field.field, 
                    formData[field.field as keyof typeof formData], 
                    index % 2 === 0,
                    'Household Details'
                  )
                )}
              </div>
            </section>

            {/* Expenditure Calculation Section */}
            <section className="w-full">
              <h2 className="text-[#165788] text-lg font-medium mb-4">Expenditure Calculation</h2>
              <div className="w-full border border-gray-200 rounded">
                {expenditureFields.map((field, index) => 
                  renderField(
                    field.label, 
                    field.field, 
                    formData[field.field as keyof typeof formData], 
                    index % 2 === 0,
                    'Expenditure Calculation'
                  )
                )}
              </div>
            </section>

            {/* Loan Details Section */}
            <section className="w-full">
              <h2 className="text-[#165788] text-lg font-medium mb-4">Loan Details</h2>
              <div className="w-full border border-gray-200 rounded">
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