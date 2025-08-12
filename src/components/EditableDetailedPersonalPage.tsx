import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEditMode } from '@/contexts/EditModeContext';
import { useAudit } from '@/contexts/AuditContext';
import { useToast } from '@/hooks/use-toast';
import { useApplicantData } from '@/contexts/ApplicantDataContext';
import { Clock, Plus } from 'lucide-react';
import { FieldComparisonModal } from '@/components/FieldComparisonModal';
import { useFormSync } from '@/hooks/useFormSync';

interface PersonalData {
  // Eligibility
  courtDecree: string;
  debtManagement: string;
  // Personal Details
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nameChange: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  nationality: string;
  // Addresses
  currentAddress: string;
  postcode: string;
  moveInDate: string;
  currentAddressYears: string;
  currentAddressMonths: string;
  currentResidencyStatus: string;
  previousAddress: string;
  previousAddressYears: string;
  previousAddressMonths: string;
  // Property Details
  salePrice: string;
  currentLender: string;
  outstandingMortgageBalance: string;
  plansForProperty: string;
  expectedRemainingBalance: string;
  // Income
  employmentStatus: string;
  grossBasicIncome: string;
  frequency: string;
  annualAmount: string;
  monthlyNetSalary: string;
  jobTitle: string;
  employerName: string;
  employmentType: string;
  startMonth: string;
  startYear: string;
  expectedRetirementAge: string;
  // Commitments
  commitmentType: string;
  provider: string;
  monthlyPayment: string;
  remainingBalance: string;
}

interface EditableDetailedPersonalPageProps {
  applicantName: string;
  applicantNumber: number;
}

export const EditableDetailedPersonalPage: React.FC<EditableDetailedPersonalPageProps> = ({
  applicantName,
  applicantNumber
}) => {
  const { applicantData, updateApplicantData, getFormattedApplicantNames } = useApplicantData();
  const [formData, setFormData] = useState<PersonalData>({
    // Eligibility
    courtDecree: 'No',
    debtManagement: 'No',
    // Personal Details
    title: applicantNumber === 1 ? applicantData.jamesTitle : applicantData.janeTitle,
    firstName: applicantNumber === 1 ? applicantData.jamesFirstName : applicantData.janeFirstName,
    middleName: applicantNumber === 1 ? applicantData.jamesMiddleName : applicantData.janeMiddleName,
    lastName: applicantNumber === 1 ? applicantData.jamesLastName : applicantData.janeLastName,
    nameChange: 'No',
    birthDay: applicantNumber === 1 ? '11' : '04',
    birthMonth: applicantNumber === 1 ? '11' : '04',
    birthYear: applicantNumber === 1 ? '1988' : '1990',
    nationality: 'UK Resident',
    // Addresses
    currentAddress: applicantNumber === 1 ? '12 Longwood Close' : '12 Longwood Close, NEWCASTLE UPON TYNE, Tyne and Wear',
    postcode: applicantNumber === 1 ? '' : 'NE16 5QB',
    moveInDate: applicantNumber === 1 ? '' : '01/04/2015',
    currentAddressYears: applicantNumber === 1 ? '1' : '9',
    currentAddressMonths: applicantNumber === 1 ? '0' : '0',
    currentResidencyStatus: applicantNumber === 1 ? 'Owner occupation with mortgage' : 'Owner occupier with mortgage',
    previousAddress: '',
    previousAddressYears: '',
    previousAddressMonths: '',
    // Property Details
    salePrice: applicantNumber === 1 ? '' : '£200,000.00',
    currentLender: applicantNumber === 1 ? '' : 'Barclays',
    outstandingMortgageBalance: applicantNumber === 1 ? '' : '£56,000.00',
    plansForProperty: applicantNumber === 1 ? '' : 'Selling current main residence',
    expectedRemainingBalance: applicantNumber === 1 ? '' : '£56,000.00',
    // Income
    employmentStatus: 'Employed',
    grossBasicIncome: applicantNumber === 1 ? '£52000.00' : '£50000.00',
    frequency: 'Yearly',
    annualAmount: applicantNumber === 1 ? '£52,000.00' : '£50,000.00',
    monthlyNetSalary: applicantNumber === 1 ? '£4333' : '£4167',
    jobTitle: applicantNumber === 1 ? 'Software Engineer' : 'Manager',
    employerName: applicantNumber === 1 ? 'NBS' : 'NHS',
    employmentType: 'Permanent',
    startMonth: '9',
    startYear: applicantNumber === 1 ? '2008' : '2019',
    expectedRetirementAge: applicantNumber === 1 ? '70' : '70',
    // Commitments
    commitmentType: 'Credit card',
    provider: 'Bank',
    monthlyPayment: '£100.00',
    remainingBalance: '£5,000.00'
  });

  const [originalFormData, setOriginalFormData] = useState(formData);
  const [comparisonField, setComparisonField] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const { isEditMode, setIsEditMode, hasUnsavedChanges, setHasUnsavedChanges } = useEditMode();
  const { startAuditSession, endAuditSession, addAuditEntry, auditLog } = useAudit();
  const { toast } = useToast();
  
  // Enable form sync for real-time updates to unified data
  const { syncField } = useFormSync({ 
    formData, 
    enabled: isEditMode 
  });

  useEffect(() => {
    if (isEditMode) {
      setOriginalFormData(formData);
      startAuditSession();
    }
  }, [isEditMode, applicantName]);

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
    if (['courtDecree', 'debtManagement'].includes(fieldName)) {
      return 'eligibility';
    }
    if (['title', 'firstName', 'middleName', 'lastName', 'nameChange', 'birthDay', 'birthMonth', 'birthYear', 'nationality'].includes(fieldName)) {
      return 'personalDetails';
    }
    if (['currentAddress', 'postcode', 'moveInDate', 'currentAddressYears', 'currentAddressMonths', 'currentResidencyStatus', 'previousAddress', 'previousAddressYears', 'previousAddressMonths', 'salePrice', 'currentLender', 'outstandingMortgageBalance', 'plansForProperty', 'expectedRemainingBalance'].includes(fieldName)) {
      return 'addresses';
    }
    if (['employmentStatus', 'grossBasicIncome', 'frequency', 'annualAmount', 'monthlyNetSalary', 'jobTitle', 'employerName', 'employmentType', 'startMonth', 'startYear', 'expectedRetirementAge'].includes(fieldName)) {
      return 'income';
    }
    if (['commitmentType', 'provider', 'monthlyPayment', 'remainingBalance'].includes(fieldName)) {
      return 'commitments';
    }
    return 'personalDetails';
  };

  const handleInputChange = (field: string, value: string) => {
    const oldValue = formData[field as keyof PersonalData];
    if (oldValue !== value) {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Sync individual field to unified data
      syncField(field, value);
      
      addAuditEntry(field, oldValue, value, `${applicantName} Personal Details`);
      setHasUnsavedChanges(true);
      
      // Update ApplicantDataContext for name-related fields
      if (['title', 'firstName', 'middleName', 'lastName'].includes(field)) {
        const contextField = applicantNumber === 1 
          ? `james${field.charAt(0).toUpperCase() + field.slice(1)}` 
          : `jane${field.charAt(0).toUpperCase() + field.slice(1)}`;
        updateApplicantData({ [contextField]: value });
      }
    }
  };

  const handleFieldDoubleClick = (fieldName: string) => {
    if (!isEditMode) {
      setFocusedField(fieldName);
      setIsEditMode(true);
    }
  };

  const handleSave = () => {
    endAuditSession();
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    toast({
      title: "Changes saved successfully",
      description: `${applicantName} details have been updated.`,
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
    field: keyof PersonalData,
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
        <h1 className="text-3xl font-bold">{applicantName}</h1>
        <Button onClick={handleMainButtonClick} variant={getButtonVariant()}>
          {getButtonText()}
        </Button>
      </div>

      <Card ref={(el) => { sectionRefs.current['eligibility'] = el; }}>
        <CardHeader>
          <CardTitle>Eligibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            In the last 3 years has this applicant had or satisfied any of the following:
          </p>
          {renderField('courtDecree', 'CCJ (court of decree in Scotland)', 'radio', ['Yes', 'No'])}
          {renderField('debtManagement', 'Had an active or settled debt management plan', 'radio', ['Yes', 'No'])}
        </CardContent>
      </Card>

      <Card ref={(el) => { sectionRefs.current['personalDetails'] = el; }}>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('title', 'Title', 'select', ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'])}
            {renderField('firstName', 'First name')}
            {renderField('middleName', 'Middle name')}
            {renderField('lastName', 'Last name')}
            {renderField('nameChange', 'Name change in the last 3 years?', 'radio', ['Yes', 'No'])}
          </div>

          <div className="space-y-4">
            <Label>Date of birth</Label>
            <div className="grid grid-cols-3 gap-4">
              {renderField('birthDay', 'Day')}
              {renderField('birthMonth', 'Month')}
              {renderField('birthYear', 'Year')}
            </div>
          </div>

          {renderField('nationality', 'Nationality', 'radio', ['UK Resident', 'EEA or Swiss National', 'Non EEA'])}
        </CardContent>
      </Card>

      <Card ref={(el) => { sectionRefs.current['addresses'] = el; }}>
        <CardHeader>
          <CardTitle>{applicantName}'s addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current address</h3>
            {renderField('currentAddress', 'Address')}
            {renderField('postcode', 'Postcode')}
            {renderField('moveInDate', 'When did the applicant move in')}
            <div className="grid grid-cols-2 gap-4">
              {renderField('currentAddressYears', 'Years')}
              {renderField('currentAddressMonths', 'Months')}
            </div>
            {renderField('currentResidencyStatus', 'Current residency status', 'select', [
              'Owner occupation with mortgage',
              'Owner occupier with mortgage',
              'Owner occupation without mortgage',
              'Privately rented',
              'Living with parents',
              'Council rented',
              'Housing association rented',
              'Other'
            ])}
            {renderField('salePrice', 'Sale price')}
            {renderField('currentLender', 'Current lender')}
            {renderField('outstandingMortgageBalance', 'Outstanding mortgage balance')}
            {renderField('plansForProperty', 'Plans for property')}
            {renderField('expectedRemainingBalance', 'Expected remaining balance')}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Previous address</h3>
            {renderField('previousAddress', 'Address')}
            <div className="grid grid-cols-2 gap-4">
              {renderField('previousAddressYears', 'Years')}
              {renderField('previousAddressMonths', 'Months')}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card ref={(el) => { sectionRefs.current['income'] = el; }}>
        <CardHeader>
          <CardTitle>{applicantName}'s income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('employmentStatus', 'Employment status', 'select', ['Employed', 'Self-employed', 'Unemployed', 'Retired'])}
            {renderField('grossBasicIncome', 'Gross basic income')}
            {renderField('frequency', 'Payment frequency of gross basic income', 'select', ['Weekly', 'Monthly', 'Yearly'])}
            {renderField('annualAmount', 'Annual amount')}
            {renderField('monthlyNetSalary', 'Monthly net salary/net income')}
            {renderField('jobTitle', 'Job title')}
            {renderField('employerName', 'Employer name')}
            {renderField('employmentType', 'Employment nature', 'radio', ['Permanent', 'Contract'])}
          </div>

          <div className="space-y-4">
            <Label>Start date of permanent employment</Label>
            <div className="grid grid-cols-2 gap-4">
              {renderField('startMonth', 'Month')}
              {renderField('startYear', 'Year')}
            </div>
          </div>

          {renderField('expectedRetirementAge', 'Expected retirement age')}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Please add all additional income sources relevant to this applicant:</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Income source</Label>
                <Select defaultValue="Before tax return">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Before tax return">Before tax return</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input placeholder="£" />
              </div>
              <div>
                <Label>Frequency</Label>
                <Select defaultValue="Yearly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add an income source
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card ref={(el) => { sectionRefs.current['commitments'] = el; }}>
        <CardHeader>
          <CardTitle>{applicantName}'s commitments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Please add all current commitments related to this applicant, even if they will be redeemed or consolidated upon completion.
            Please also include, but are not limited to: credit cards, hire purchase, commercial finance, student finance payments, etc.
          </p>

          <div className="grid grid-cols-4 gap-4">
            {renderField('commitmentType', 'Commitment type', 'select', ['Credit card', 'Personal loan', 'Hire purchase', 'Student loan'])}
            {renderField('provider', 'Provider', 'select', ['Bank', 'Building Society', 'Finance Company'])}
            {renderField('monthlyPayment', 'Monthly payment')}
            {renderField('remainingBalance', 'Remaining balance')}
          </div>

          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add a commitment
          </Button>
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