import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEditMode } from '@/contexts/EditModeContext';
import { useAudit } from '@/contexts/AuditContext';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import { FieldComparisonModal } from '@/components/FieldComparisonModal';

export const EditableMortgageDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Mortgage Details
    bankruptcySubject: 'No',
    ivaSubject: 'No',
    propertyRepossessed: 'No',
    applicationPurpose: 'Residential',
    applicationType: 'Purchase',
    residentialSubType: 'Standard',
    propertyRegion: 'North',
    totalPurchasePrice: '£590,000',
    depositAmount: '£75,000',
    requiredLoanAmount: '£515,000',
    loanToValue: '70%',
    termYears: '25',
    repaymentType: 'Repayment',
    monthlyGroundRent: '£0',
    initialFixedTerm: 'No',
    // Household Details
    numberOfApplicants: 'Two',
    sameAddress: 'Yes',
    dependentsUnder13: '2',
    childBenefit: 'No',
    dependents14Plus: '0',
    // Household Expenditure
    expenditureCalculation: 'ONS'
  });

  const [originalFormData, setOriginalFormData] = useState(formData);
  const [comparisonField, setComparisonField] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const { isEditMode, setIsEditMode, hasUnsavedChanges, setHasUnsavedChanges } = useEditMode();
  const { startAuditSession, endAuditSession, addAuditEntry, auditLog } = useAudit();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditMode) {
      setOriginalFormData(formData);
      startAuditSession();
    }
  }, [isEditMode]);

  useEffect(() => {
    const handleEditModeCancel = () => {
      setFormData(originalFormData);
      endAuditSession();
    };

    window.addEventListener('editModeCancel', handleEditModeCancel);
    return () => window.removeEventListener('editModeCancel', handleEditModeCancel);
  }, [originalFormData, endAuditSession]);

  useEffect(() => {
    if (focusedField && isEditMode) {
      const fieldElement = fieldRefs.current[focusedField];
      const sectionKey = getSectionForField(focusedField);
      const sectionElement = sectionRefs.current[sectionKey];

      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (fieldElement) {
        setTimeout(() => {
          fieldElement.focus();
        }, 300);
      }

      setFocusedField(null);
    }
  }, [focusedField, isEditMode]);

  const getSectionForField = (fieldName: string) => {
    if (['bankruptcySubject', 'ivaSubject', 'propertyRepossessed', 'applicationPurpose', 'applicationType', 'residentialSubType', 'propertyRegion', 'totalPurchasePrice', 'depositAmount', 'requiredLoanAmount', 'loanToValue', 'termYears', 'repaymentType', 'monthlyGroundRent', 'initialFixedTerm'].includes(fieldName)) {
      return 'mortgageDetails';
    }
    if (['numberOfApplicants', 'sameAddress', 'dependentsUnder13', 'childBenefit', 'dependents14Plus'].includes(fieldName)) {
      return 'householdDetails';
    }
    if (['expenditureCalculation'].includes(fieldName)) {
      return 'householdExpenditure';
    }
    return 'mortgageDetails';
  };

  const handleInputChange = (field: string, value: string) => {
    const oldValue = formData[field as keyof typeof formData];
    if (oldValue !== value) {
      setFormData(prev => ({ ...prev, [field]: value }));
      addAuditEntry(field, oldValue, value, 'Mortgage Details');
      setHasUnsavedChanges(true);
    }
  };

  const handleFieldDoubleClick = (fieldName: string) => {
    if (!isEditMode) {
      navigate('/data-capture/mortgage');
    }
  };

  const handleSave = () => {
    endAuditSession();
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    toast({
      title: "Changes saved successfully",
      description: "Mortgage details have been updated.",
    });
  };

  const isFieldEdited = (fieldName: string) => {
    return auditLog.some(entry => entry.field === fieldName);
  };

  const handleFieldComparisonClick = (fieldName: string) => {
    setComparisonField(fieldName);
  };

  const getButtonText = () => {
    if (!isEditMode) return "Edit";
    return hasUnsavedChanges ? "Save" : "Exit Edit Mode";
  };

  const getButtonVariant = () => {
    if (!isEditMode) return "default";
    return hasUnsavedChanges ? "default" : "outline";
  };

  const handleMainButtonClick = () => {
    if (!isEditMode) {
      setIsEditMode(true);
    } else if (hasUnsavedChanges) {
      handleSave();
    } else {
      setIsEditMode(false);
    }
  };

  const renderField = (
    field: keyof typeof formData,
    label: string,
    type: 'input' | 'select' | 'radio' = 'input',
    options?: { value: string; label: string }[] | string[]
  ) => {
    const value = formData[field];
    const fieldName = field as string;

    if (isEditMode) {
      if (type === 'select') {
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldName}>{label}</Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleInputChange(fieldName, newValue)}
            >
              <SelectTrigger
                ref={(el) => { fieldRefs.current[fieldName] = el; }}
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => {
                  const optionValue = typeof option === 'string' ? option : option.value;
                  const optionLabel = typeof option === 'string' ? option : option.label;
                  return (
                    <SelectItem key={optionValue} value={optionValue}>
                      {optionLabel}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );
      }

      if (type === 'radio' && options) {
        return (
          <div className="space-y-2">
            <Label>{label}</Label>
            <RadioGroup
              value={value}
              onValueChange={(newValue) => handleInputChange(fieldName, newValue)}
              className="flex gap-4"
            >
              {options.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                return (
                  <div key={optionValue} className="flex items-center space-x-2">
                    <RadioGroupItem value={optionValue} id={`${fieldName}-${optionValue}`} />
                    <Label htmlFor={`${fieldName}-${optionValue}`}>{optionLabel}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <Label htmlFor={fieldName}>{label}</Label>
          <Input
            ref={(el) => { fieldRefs.current[fieldName] = el; }}
            id={fieldName}
            value={value}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full"
          />
        </div>
      );
    }

    return (
      <div className="space-y-2" onDoubleClick={() => handleFieldDoubleClick(fieldName)}>
        <Label className="text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm">{value}</span>
          {isFieldEdited(fieldName) && (
            <Clock
              className="h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={() => handleFieldComparisonClick(fieldName)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mortgage Details</h1>
        <Button onClick={handleMainButtonClick} variant={getButtonVariant()}>
          {getButtonText()}
        </Button>
      </div>

      <Card ref={(el) => { sectionRefs.current['mortgageDetails'] = el; }}>
        <CardHeader>
          <CardTitle>Mortgage details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Have any applicants been subject to:</h3>
            {renderField('bankruptcySubject', 'A bankruptcy which has not been satisfied for at least 3 years?', 'radio', ['Yes', 'No'])}
            {renderField('ivaSubject', 'An Individual Voluntary arrangement (IVA) or debt relief order (DRO) that has not been satisfied for at least 3 years?', 'radio', ['Yes', 'No'])}
            {renderField('propertyRepossessed', 'Property repossession at any time?', 'radio', ['Yes', 'No'])}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('applicationPurpose', 'Application purpose', 'radio', ['Residential', 'Buy to Let'])}
            {renderField('applicationType', 'Application type', 'radio', ['Purchase', 'Remortgage'])}
            {renderField('residentialSubType', 'Residential purchase sub-type', 'select', ['Standard', 'Help to Buy', 'Shared Ownership'])}
            {renderField('propertyRegion', 'Region of the property to be mortgaged', 'select', ['North', 'South', 'East', 'West', 'Central'])}
            {renderField('totalPurchasePrice', 'Total purchase price')}
            {renderField('depositAmount', 'Deposit amount')}
            {renderField('requiredLoanAmount', 'Required loan amount')}
            {renderField('loanToValue', 'Loan to value')}
            {renderField('termYears', 'Term (years)')}
            {renderField('repaymentType', 'Repayment type', 'radio', ['Repayment', 'Interest Only', 'Part And Part'])}
            {renderField('monthlyGroundRent', 'Monthly ground rent/service charge of the property to be purchased')}
            {renderField('initialFixedTerm', 'Will the initial fixed term be 60 months or more?', 'radio', ['Yes', 'No'])}
          </div>
        </CardContent>
      </Card>

      <Card ref={(el) => { sectionRefs.current['householdDetails'] = el; }}>
        <CardHeader>
          <CardTitle>Household details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('numberOfApplicants', 'Number of applicants', 'radio', ['One', 'Two'])}
            {renderField('sameAddress', 'Will all applicants live at the same address once the mortgage completes?', 'radio', ['Yes', 'No'])}
            {renderField('dependentsUnder13', 'Number of household dependents aged 0-13')}
            {renderField('childBenefit', 'Does the applicant receive child benefit?', 'radio', ['Yes', 'No'])}
            {renderField('dependents14Plus', 'Number of household dependents aged 14 and over')}
          </div>
        </CardContent>
      </Card>

      <Card ref={(el) => { sectionRefs.current['householdExpenditure'] = el; }}>
        <CardHeader>
          <CardTitle>Household expenditure</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Newcastle Building Society uses Office of National Statistics (ONS) data to calculate affordability, which considers 
            typical household expenditure for the region. Alternatively, we can calculate affordability using the applicant's 
            expected total monthly expenditure.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Please select how you would like us to calculate the applicant's affordability:
          </p>
          {renderField('expenditureCalculation', 'Calculation method', 'radio', ['ONS', 'Enter expenditure'])}
        </CardContent>
      </Card>

      <FieldComparisonModal
        open={!!comparisonField}
        onOpenChange={(open) => !open && setComparisonField(null)}
        fieldName={comparisonField || ''}
        auditEntries={auditLog}
      />
    </div>
  );
};