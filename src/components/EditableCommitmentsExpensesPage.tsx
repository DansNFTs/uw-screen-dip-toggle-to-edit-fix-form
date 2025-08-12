import React, { useState } from 'react';
import { useEditMode } from '../contexts/EditModeContext';
import { useApplicantData } from '../contexts/ApplicantDataContext';
import { useAudit } from '../contexts/AuditContext';
import { useCaseNotes } from '../contexts/CaseNotesContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { FieldComparisonModal } from './FieldComparisonModal';
import { AffordabilityWarningDialog } from './AffordabilityWarningDialog';
import { useFormSync } from '../hooks/useFormSync';

export const EditableCommitmentsExpensesPage: React.FC = () => {
  const { isEditingEnabled, isEditMode, hasUnsavedChanges, hasSavedChanges, toggleEditMode, setHasUnsavedChanges, saveChanges, saveAndResubmit, exitEditMode, storeOriginalState, restoreAllOriginalState } = useEditMode();
  const { addAuditEntry, auditLog, currentSessionId, startAuditSession, endAuditSession, cancelAuditSession } = useAudit();
  const { getFormattedApplicantNames } = useApplicantData();
  const { addCaseNote } = useCaseNotes();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [applicantJamesName, applicantJaneName] = getFormattedApplicantNames();
  
  const initialFormData = {
    // James Taylor - Revolving Credit Card
    jamesCreditCardProvider: 'Tesco',
    jamesCreditCardRemainingBalance: '£1,250.00',
    jamesCreditCardPaidByCompletion: 'Yes',
    jamesCreditCardConsolidated: 'No',
    
    // James Taylor - Non Revolving Unsecured Loan
    jamesUnsecuredLoanProvider: 'Vauxhall Finance',
    jamesUnsecuredLoanMonthlyPayment: '£250.00',
    jamesUnsecuredLoanRemainingBalance: '£6,000.00',
    jamesUnsecuredLoanLessThan6Months: 'No',
    jamesUnsecuredLoanPaidByCompletion: 'No',
    jamesUnsecuredLoanConsolidated: 'No',
    
    // Jane Taylor - Non Revolving Hire Purchase
    janeHirePurchaseProvider: 'Nissan',
    janeHirePurchaseMonthlyPayment: '£200.00',
    janeHirePurchaseRemainingBalance: '£4,500.00',
    janeHirePurchaseLessThan6Months: 'No',
    janeHirePurchasePaidByCompletion: 'No',
    janeHirePurchaseConsolidated: 'No',
    
    // General Information
    contingencyExpenditure: '£1,655.46',
    dependents13Under: '2',
    dependents14Over: '0',
    receivesChildBenefit: 'No',
    liveTogether: 'Yes'
  };

  const [formData, setFormData] = useState(initialFormData);
  
  // Enable form sync for real-time updates to unified data
  const { syncField } = useFormSync({ 
    formData, 
    enabled: isEditMode 
  });
  const [comparisonModal, setComparisonModal] = useState({ open: false, fieldName: '' });
  const [jamesRevolvingOpen, setJamesRevolvingOpen] = useState(true);
  const [jamesNonRevolvingOpen, setJamesNonRevolvingOpen] = useState(true);
  const [janeNonRevolvingOpen, setJaneNonRevolvingOpen] = useState(true);
  const [needsRecalculation, setNeedsRecalculation] = useState(false);
  const [showAffordabilityWarning, setShowAffordabilityWarning] = useState(false);

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

  const handleInputChange = (field: string, value: string, section: string = 'Commitments & Expenses') => {
    if (!isEditMode) return;
    
    const oldValue = formData[field as keyof typeof formData];
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Sync individual field to unified data
    syncField(field, value);
    
    // Check if this is a commitment field that requires recalculation
    const commitmentFields = [
      'jamesCreditCardProvider', 'jamesCreditCardRemainingBalance', 'jamesCreditCardPaidByCompletion', 'jamesCreditCardConsolidated',
      'jamesUnsecuredLoanProvider', 'jamesUnsecuredLoanMonthlyPayment', 'jamesUnsecuredLoanRemainingBalance', 
      'jamesUnsecuredLoanLessThan6Months', 'jamesUnsecuredLoanPaidByCompletion', 'jamesUnsecuredLoanConsolidated',
      'janeHirePurchaseProvider', 'janeHirePurchaseMonthlyPayment', 'janeHirePurchaseRemainingBalance',
      'janeHirePurchaseLessThan6Months', 'janeHirePurchasePaidByCompletion', 'janeHirePurchaseConsolidated'
    ];
    
    if (commitmentFields.includes(field)) {
      setNeedsRecalculation(true);
    }
    
    console.log('Field changed:', { field, oldValue, value, section, currentSessionId, needsRecalculation: commitmentFields.includes(field) });
    
    // Add audit entry for the change
    addAuditEntry(field, oldValue, value, section);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    saveChanges();
    endAuditSession(); // End the current audit session when saving
    setNeedsRecalculation(false); // Reset recalculation state when saving
    
    const description = needsRecalculation 
      ? "Your commitments and expenses information has been updated. Recalculation triggered."
      : "Your commitments and expenses information has been updated.";
    
    toast({
      title: "Changes saved",
      description,
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

  const handleResubmit = () => {
    if (needsRecalculation) {
      setShowAffordabilityWarning(true);
    } else {
      performResubmit();
    }
  };

  const handleAffordabilityWarningProceed = (notes: string) => {
    addCaseNote({
      author: 'Current User',
      content: notes,
      type: 'user'
    });
    setShowAffordabilityWarning(false);
    performResubmit();
  };

  const performResubmit = () => {
    saveAndResubmit();
    endAuditSession();
    setNeedsRecalculation(false);
    navigate('/affordability');
  };

  // Expose resubmit handler to EditingTaskBar
  React.useEffect(() => {
    const handleResubmitEvent = () => {
      handleResubmit();
    };

    window.addEventListener('resubmitCase', handleResubmitEvent);
    return () => {
      window.removeEventListener('resubmitCase', handleResubmitEvent);
    };
  }, [needsRecalculation, addCaseNote, saveAndResubmit, endAuditSession, navigate]);

  const renderTableCell = (value: string, field?: string, section?: string, type: 'input' | 'select' = 'input', options?: string[]) => {
    const edited = field ? isFieldEdited(field) : false;
    
    return (
      <TableCell className="p-4">
        <div className="flex items-center gap-2">
          {isEditMode && field ? (
            type === 'select' && options ? (
              <Select value={value} onValueChange={(newValue) => handleInputChange(field, newValue, section || 'Commitments & Expenses')}>
                <SelectTrigger className="w-full">
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
                onChange={(e) => handleInputChange(field, e.target.value, section || 'Commitments & Expenses')}
                className="w-full"
              />
            )
          ) : (
            <>
              <span className="text-black font-medium">{value}</span>
              {edited && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(field!)}
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
            </>
          )}
        </div>
      </TableCell>
    );
  };

  const handleFieldDoubleClick = (field: string) => {
    if (!isEditingEnabled) {
      toast({
        title: "Enable editing first",
        description: "Please enable editing mode to modify fields.",
      });
      return;
    }
    
    console.log('Double clicked field:', field);
    // Navigate to unified data capture form - determine applicant number based on field prefix
    const applicantNumber = field.startsWith('james') ? 1 : 2;
    const currentPath = window.location.pathname;
    navigate(`/data-capture/applicants/${applicantNumber}?field=${field}&from=${encodeURIComponent(currentPath)}`);
  };

  const renderField = (label: string, field: string, value: string, isEven: boolean, section: string = 'Commitments & Expenses', type: 'input' | 'select' = 'input', options?: string[]) => {
    const edited = field ? isFieldEdited(field) : false;

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

  return (
    <>
      <div className="p-8 max-md:px-5">
        <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] bg-white p-6 rounded">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-[#165788] text-[22px] font-medium">
                Commitments & Expenses
              </h1>
              {needsRecalculation && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-md px-3 py-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-orange-700 text-sm font-medium">Recalculation Required</span>
                </div>
              )}
            </div>
          </div>
        
          <div className="space-y-6">
            {/* James Taylor Section */}
            <section className="w-full">
              <h2 className="text-[#165788] text-lg font-medium mb-4">{applicantJamesName}</h2>
              
              {/* Revolving Section */}
              <Collapsible open={jamesRevolvingOpen} onOpenChange={setJamesRevolvingOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-[#165788] font-medium hover:underline mb-2">
                  {jamesRevolvingOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Revolving
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 space-y-4">
                  <div>
                    <h4 className="text-black font-medium mb-3">Credit card</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider</TableHead>
                          <TableHead>Remaining balance</TableHead>
                          <TableHead>Paid by completion</TableHead>
                          <TableHead>Consolidated into mortgage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          {renderTableCell(formData.jamesCreditCardProvider, 'jamesCreditCardProvider', 'James Taylor - Credit Card')}
                          {renderTableCell(formData.jamesCreditCardRemainingBalance, 'jamesCreditCardRemainingBalance', 'James Taylor - Credit Card')}
                          {renderTableCell(formData.jamesCreditCardPaidByCompletion, 'jamesCreditCardPaidByCompletion', 'James Taylor - Credit Card', 'select', ['Yes', 'No'])}
                          {renderTableCell(formData.jamesCreditCardConsolidated, 'jamesCreditCardConsolidated', 'James Taylor - Credit Card', 'select', ['Yes', 'No'])}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Non Revolving Section */}
              <Collapsible open={jamesNonRevolvingOpen} onOpenChange={setJamesNonRevolvingOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-[#165788] font-medium hover:underline mb-2">
                  {jamesNonRevolvingOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Non Revolving
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 space-y-4">
                  <div>
                    <h4 className="text-black font-medium mb-3">Unsecured loan</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider</TableHead>
                          <TableHead>Monthly payment</TableHead>
                          <TableHead>Remaining balance</TableHead>
                          <TableHead>Less than 6 months</TableHead>
                          <TableHead>Paid by completion</TableHead>
                          <TableHead>Consolidated into mortgage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          {renderTableCell(formData.jamesUnsecuredLoanProvider, 'jamesUnsecuredLoanProvider', 'James Taylor - Unsecured Loan')}
                          {renderTableCell(formData.jamesUnsecuredLoanMonthlyPayment, 'jamesUnsecuredLoanMonthlyPayment', 'James Taylor - Unsecured Loan')}
                          {renderTableCell(formData.jamesUnsecuredLoanRemainingBalance, 'jamesUnsecuredLoanRemainingBalance', 'James Taylor - Unsecured Loan')}
                          {renderTableCell(formData.jamesUnsecuredLoanLessThan6Months, 'jamesUnsecuredLoanLessThan6Months', 'James Taylor - Unsecured Loan', 'select', ['Yes', 'No'])}
                          {renderTableCell(formData.jamesUnsecuredLoanPaidByCompletion, 'jamesUnsecuredLoanPaidByCompletion', 'James Taylor - Unsecured Loan', 'select', ['Yes', 'No'])}
                          {renderTableCell(formData.jamesUnsecuredLoanConsolidated, 'jamesUnsecuredLoanConsolidated', 'James Taylor - Unsecured Loan', 'select', ['Yes', 'No'])}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </section>

            {/* Jane Taylor Section */}
            <section className="w-full">
              <h2 className="text-[#165788] text-lg font-medium mb-4">{applicantJaneName}</h2>
              
              {/* Non Revolving Section */}
              <Collapsible open={janeNonRevolvingOpen} onOpenChange={setJaneNonRevolvingOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-[#165788] font-medium hover:underline mb-2">
                  {janeNonRevolvingOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Non Revolving
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 space-y-4">
                  <div>
                    <h4 className="text-black font-medium mb-3">Hire purchase</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider</TableHead>
                          <TableHead>Monthly payment</TableHead>
                          <TableHead>Remaining balance</TableHead>
                          <TableHead>Less than 6 months</TableHead>
                          <TableHead>Paid by completion</TableHead>
                          <TableHead>Consolidated into mortgage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          {renderTableCell(formData.janeHirePurchaseProvider, 'janeHirePurchaseProvider', 'Jane Taylor - Hire Purchase')}
                          {renderTableCell(formData.janeHirePurchaseMonthlyPayment, 'janeHirePurchaseMonthlyPayment', 'Jane Taylor - Hire Purchase')}
                          {renderTableCell(formData.janeHirePurchaseRemainingBalance, 'janeHirePurchaseRemainingBalance', 'Jane Taylor - Hire Purchase')}
                          {renderTableCell(formData.janeHirePurchaseLessThan6Months, 'janeHirePurchaseLessThan6Months', 'Jane Taylor - Hire Purchase', 'select', ['Yes', 'No'])}
                          {renderTableCell(formData.janeHirePurchasePaidByCompletion, 'janeHirePurchasePaidByCompletion', 'Jane Taylor - Hire Purchase', 'select', ['Yes', 'No'])}
                          {renderTableCell(formData.janeHirePurchaseConsolidated, 'janeHirePurchaseConsolidated', 'Jane Taylor - Hire Purchase', 'select', ['Yes', 'No'])}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </section>

            {/* General Information Section */}
            <section className="w-full">
              <div className="w-full">
                {renderField('Contingency expenditure', 'contingencyExpenditure', formData.contingencyExpenditure, true, 'General Information')}
                {renderField('Number of dependents 13 and Under', 'dependents13Under', formData.dependents13Under, false, 'General Information')}
                {renderField('Number of dependents 14 and over', 'dependents14Over', formData.dependents14Over, true, 'General Information')}
                {renderField('Does the applicant receive child benefit', 'receivesChildBenefit', formData.receivesChildBenefit, false, 'General Information', 'select', ['Yes', 'No'])}
                {renderField('Will applicants live together on completion', 'liveTogether', formData.liveTogether, true, 'General Information', 'select', ['Yes', 'No'])}
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

      <AffordabilityWarningDialog
        open={showAffordabilityWarning}
        onOpenChange={setShowAffordabilityWarning}
        onProceed={handleAffordabilityWarningProceed}
      />
    </>
  );
};