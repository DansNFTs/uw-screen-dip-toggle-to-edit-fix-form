import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, LogOut, Send, Edit, ArrowLeft, X } from 'lucide-react';
import { useEditMode } from '../contexts/EditModeContext';
import { useAudit } from '../contexts/AuditContext';
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from 'react-router-dom';
import { SaveWithNotesDialog } from './SaveWithNotesDialog';
import { AffordabilityWarningDialog } from './AffordabilityWarningDialog';
import { useCaseNotes } from '../contexts/CaseNotesContext';

export const EditingTaskBar: React.FC = () => {
  const { 
    isEditingEnabled, 
    isEditMode, 
    hasUnsavedChanges, 
    hasSavedChanges, 
    saveChanges, 
    saveAndResubmit, 
    exitEditMode, 
    toggleEditingEnabled, 
    cancelAndExitEditMode 
  } = useEditMode();
  const { auditLog, currentSessionId } = useAudit();
  const { addCaseNote } = useCaseNotes();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showSaveExitDialog, setShowSaveExitDialog] = useState(false);
  const [showSaveResubmitDialog, setShowSaveResubmitDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAffordabilityWarning, setShowAffordabilityWarning] = useState(false);

  const getPageName = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Income & Employment';
      case '/summary':
        return 'Summary';
      case '/loan-details':
        return 'Loan Details';
      case '/policy-rules-notes':
        return 'Policy Rules & Notes';
      case '/audit-log':
        return 'Audit Log';
      case '/commitments-expenses':
        return 'Commitments & Expenses';
      default:
        return 'Case Details';
    }
  };

  // Fields that affect affordability calculation
  const affordabilityFields = [
    // Income fields
    'mostRecentYearNetProfit',
    'previousYearNetProfit',
    'secondJobAmount', // This is the "Amount" field
    'fosterCareAllowance',
    'maintenanceCourtOrder', // Maintenance by court order/CSA
    'maintenanceNotCourtOrder', // Maintenance not by court order
    'otherTaxablePrimaryIncome',
    'workingTaxCredit', // Working Tax Credit / Family Tax Credit / Personal Independence Payment
    'carAllowance',
    'cityAreaAllowance', // Large City / Area Allowance
    'regularBonus', // regular Bonus / Commission
    'regularOvertime',
    'shiftAllowanceGuaranteed', // Shift Allowance (guaranteed)
    'shiftAllowanceNonGuaranteed', // Regular Shift Allowance (non-quaranteed)
    // Commitment fields
    'jamesCreditCardProvider', 
    'jamesCreditCardRemainingBalance', 
    'jamesCreditCardPaidByCompletion', 
    'jamesCreditCardConsolidated',
    'jamesUnsecuredLoanProvider', 
    'jamesUnsecuredLoanMonthlyPayment', 
    'jamesUnsecuredLoanRemainingBalance', 
    'jamesUnsecuredLoanLessThan6Months', 
    'jamesUnsecuredLoanPaidByCompletion', 
    'jamesUnsecuredLoanConsolidated',
    'janeHirePurchaseProvider', 
    'janeHirePurchaseMonthlyPayment', 
    'janeHirePurchaseRemainingBalance',
    'janeHirePurchaseLessThan6Months', 
    'janeHirePurchasePaidByCompletion', 
    'janeHirePurchaseConsolidated'
  ];

  const checkAffordabilityFieldsChanged = () => {
    // For now, check all recent audit entries since session management is complex
    const recentEntries = auditLog.filter(entry => 
      affordabilityFields.some(field => 
        entry.field.toLowerCase().includes(field.toLowerCase()) ||
        field.toLowerCase().includes(entry.field.toLowerCase())
      )
    );
    
    console.log('Checking affordability fields changed:', {
      currentSessionId,
      totalAuditEntries: auditLog.length,
      affordabilityFields,
      recentEntries
    });
    
    return recentEntries.length > 0;
  };

  const handleSaveAndExit = () => {
    setShowSaveExitDialog(true);
  };

  const handleSaveAndResubmit = () => {
    if (checkAffordabilityFieldsChanged()) {
      setShowAffordabilityWarning(true);
    } else {
      setShowSaveResubmitDialog(true);
    }
  };

  const handleAffordabilityWarningProceed = (notes: string) => {
    setShowAffordabilityWarning(false);
    
    // Add the case note directly
    addCaseNote({
      content: notes,
      author: 'System',
      type: 'system'
    });
    
    // Proceed with save and resubmit without showing another dialog
    performSaveAndResubmit();
  };

  const performSaveAndExit = () => {
    saveChanges();
    exitEditMode();
    toast({
      title: "Changes saved",
      description: "Your changes have been saved and edit mode has been exited.",
    });
  };

  const performSaveAndResubmit = () => {
    const affordabilityChanged = checkAffordabilityFieldsChanged();
    saveAndResubmit();
    toast({
      title: "Changes saved and resubmitted",
      description: "Your changes have been saved and the case has been resubmitted for review.",
    });
    // Navigate to affordability page if affordability calculations were affected
    if (affordabilityChanged) {
      navigate('/affordability');
    } else {
      navigate('/');
    }
  };

  const handleReturnToSummary = () => {
    navigate('/summary');
  };

  const handleEditToggle = () => {
    toggleEditingEnabled();
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const performCancel = () => {
    // Dispatch custom event to notify components to restore their state
    window.dispatchEvent(new CustomEvent('editModeCancel'));
    cancelAndExitEditMode();
    toast({
      title: "Changes cancelled",
      description: "All unsaved changes have been discarded.",
    });
    setShowCancelDialog(false);
  };

  // Always show task bar for all case states

  // Draft mode (not currently editing)
  const isDraftMode = hasSavedChanges && !hasUnsavedChanges && !isEditMode;

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-8 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {getPageName(location.pathname)}
        </div>
        <div className="flex items-center gap-3">
          {isDraftMode ? (
            <>
              <Button 
                onClick={handleReturnToSummary} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Summary
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="edit-toggle-draft" className="text-sm font-medium">
                  Enable Editing
                </Label>
                <Switch
                  id="edit-toggle-draft"
                  checked={isEditingEnabled}
                  onCheckedChange={handleEditToggle}
                />
              </div>
              <Button 
                onClick={handleSaveAndResubmit}
                size="sm"
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Resubmit Case
              </Button>
            </>
           ) : hasUnsavedChanges || isEditMode ? (
            <>
              <Button 
                onClick={handleCancel} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSaveAndExit} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button 
                onClick={handleSaveAndResubmit}
                size="sm"
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Resubmit Case
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleReturnToSummary} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Summary
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="edit-toggle" className="text-sm font-medium">
                  Enable Editing
                </Label>
                <Switch
                  id="edit-toggle"
                  checked={isEditingEnabled}
                  onCheckedChange={handleEditToggle}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <SaveWithNotesDialog
        open={showSaveExitDialog}
        onOpenChange={setShowSaveExitDialog}
        onSave={performSaveAndExit}
        title="Save Draft"
        description="You're about to save your changes as a draft and exit edit mode."
        saveButtonText="Save Draft"
      />

      <SaveWithNotesDialog
        open={showSaveResubmitDialog}
        onOpenChange={setShowSaveResubmitDialog}
        onSave={performSaveAndResubmit}
        title="Resubmit Case"
        description="You're about to save your changes and resubmit the case for review."
        saveButtonText="Resubmit Case"
      />

      <SaveWithNotesDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onSave={performCancel}
        title="Cancel Changes"
        description="Are you sure you want to exit without saving? All your changes will be lost."
        saveButtonText="Yes, Cancel Changes"
      />

      <AffordabilityWarningDialog
        open={showAffordabilityWarning}
        onOpenChange={setShowAffordabilityWarning}
        onProceed={handleAffordabilityWarningProceed}
      />
    </div>
  );
};