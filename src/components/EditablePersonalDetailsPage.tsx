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
import { Clock, Plus } from 'lucide-react';
import { FieldComparisonModal } from '@/components/FieldComparisonModal';

interface ApplicantData {
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
  currentAddressYears: string;
  currentAddressMonths: string;
  currentResidencyStatus: string;
  previousAddress: string;
  previousAddressYears: string;
  previousAddressMonths: string;
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

export const EditablePersonalDetailsPage: React.FC = () => {
  const [jamesData, setJamesData] = useState<ApplicantData>({
    // Eligibility
    courtDecree: 'No',
    debtManagement: 'No',
    // Personal Details
    title: 'Mr',
    firstName: 'James',
    middleName: '',
    lastName: 'Taylor',
    nameChange: 'No',
    birthDay: '15',
    birthMonth: '3',
    birthYear: '1965',
    nationality: 'UK Resident',
    // Addresses
    currentAddress: '93 Liverpool Drive, Newcastle, Tyne and Wear, NE5 2NS, United Kingdom',
    currentAddressYears: '1',
    currentAddressMonths: '0',
    currentResidencyStatus: 'Owner occupation with mortgage',
    previousAddress: '',
    previousAddressYears: '',
    previousAddressMonths: '',
    // Income
    employmentStatus: 'Employed',
    grossBasicIncome: '£100000.00',
    frequency: 'Yearly',
    annualAmount: '£50,000.00',
    monthlyNetSalary: '£5200',
    jobTitle: 'Accountant',
    employerName: 'NBS',
    employmentType: 'Permanent',
    startMonth: '9',
    startYear: '2008',
    expectedRetirementAge: '70',
    // Commitments
    commitmentType: 'Credit card',
    provider: 'Bank',
    monthlyPayment: '£100.00',
    remainingBalance: '£5,000.00'
  });

  const [janeData, setJaneData] = useState<ApplicantData>({
    // Eligibility
    courtDecree: 'No',
    debtManagement: 'No',
    // Personal Details
    title: 'Mrs',
    firstName: 'Jane',
    middleName: '',
    lastName: 'Taylor',
    nameChange: 'No',
    birthDay: '8',
    birthMonth: '4',
    birthYear: '1968',
    nationality: 'UK Resident',
    // Addresses
    currentAddress: '93 Liverpool Drive, Newcastle, Tyne and Wear, NE5 2NS, United Kingdom',
    currentAddressYears: '1',
    currentAddressMonths: '0',
    currentResidencyStatus: 'Owner occupation with mortgage',
    previousAddress: '',
    previousAddressYears: '',
    previousAddressMonths: '',
    // Income
    employmentStatus: 'Employed',
    grossBasicIncome: '£45000.00',
    frequency: 'Yearly',
    annualAmount: '£30,000.00',
    monthlyNetSalary: '£3100',
    jobTitle: 'Manager',
    employerName: 'NHS',
    employmentType: 'Permanent',
    startMonth: '9',
    startYear: '2019',
    expectedRetirementAge: '70',
    // Commitments
    commitmentType: 'Credit card',
    provider: 'Bank',
    monthlyPayment: '£50.00',
    remainingBalance: '£2,500.00'
  });

  const [originalJamesData, setOriginalJamesData] = useState(jamesData);
  const [originalJaneData, setOriginalJaneData] = useState(janeData);
  const [comparisonField, setComparisonField] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const { isEditMode, setIsEditMode, hasUnsavedChanges, setHasUnsavedChanges } = useEditMode();
  const { startAuditSession, endAuditSession, addAuditEntry, auditLog } = useAudit();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditMode) {
      setOriginalJamesData(jamesData);
      setOriginalJaneData(janeData);
      startAuditSession();
    }
  }, [isEditMode]);

  useEffect(() => {
    const handleEditModeCancel = () => {
      setJamesData(originalJamesData);
      setJaneData(originalJaneData);
      endAuditSession();
    };

    window.addEventListener('editModeCancel', handleEditModeCancel);
    return () => window.removeEventListener('editModeCancel', handleEditModeCancel);
  }, [originalJamesData, originalJaneData, endAuditSession]);

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
    if (fieldName.startsWith('james')) {
      return 'james-section';
    }
    if (fieldName.startsWith('jane')) {
      return 'jane-section';
    }
    return 'james-section';
  };

  const handleInputChange = (field: string, value: string, applicant: 'james' | 'jane') => {
    const currentData = applicant === 'james' ? jamesData : janeData;
    const setData = applicant === 'james' ? setJamesData : setJaneData;
    const fieldKey = field as keyof ApplicantData;
    const oldValue = currentData[fieldKey];
    
    if (oldValue !== value) {
      setData(prev => ({ ...prev, [field]: value }));
      addAuditEntry(`${applicant}-${field}`, oldValue, value, `${applicant === 'james' ? 'James Taylor' : 'Jane Taylor'} Personal Details`);
      setHasUnsavedChanges(true);
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
      description: "Personal details have been updated.",
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
    field: keyof ApplicantData,
    label: string,
    applicant: 'james' | 'jane',
    type: 'input' | 'select' | 'radio' = 'input',
    options?: { value: string; label: string }[] | string[]
  ) => {
    const data = applicant === 'james' ? jamesData : janeData;
    const value = data[field];
    const fieldName = `${applicant}-${field}`;

    if (isEditMode) {
      if (type === 'select') {
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldName}>{label}</Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleInputChange(field, newValue, applicant)}
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
              onValueChange={(newValue) => handleInputChange(field, newValue, applicant)}
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
            onChange={(e) => handleInputChange(field, e.target.value, applicant)}
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

  const renderApplicantSection = (applicant: 'james' | 'jane', title: string) => {
    const data = applicant === 'james' ? jamesData : janeData;
    
    return (
      <div className="space-y-6">
        <Card ref={(el) => { sectionRefs.current[`${applicant}-section`] = el; }}>
          <CardHeader>
            <CardTitle className="text-[#165788] text-xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Eligibility Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Eligibility</h3>
              <p className="text-sm text-muted-foreground">
                In the last 3 years has this applicant had or satisfied any of the following:
              </p>
              <div className="space-y-4">
                {renderField('courtDecree', 'CCJ (court of decree in Scotland)', applicant, 'radio', ['Yes', 'No'])}
                {renderField('debtManagement', 'Had an active or settled debt management plan', applicant, 'radio', ['Yes', 'No'])}
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal details</h3>
              <p className="text-sm text-muted-foreground">
                Please complete this to the applicant and in form of official identification such as passport or driving licence.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('title', 'Title', applicant, 'select', ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'])}
                {renderField('firstName', 'First name', applicant)}
                {renderField('middleName', 'Middle name', applicant)}
                {renderField('lastName', 'Last name', applicant)}
                {renderField('nameChange', 'Name change in the last 3 years?', applicant, 'radio', ['Yes', 'No'])}
              </div>

              <div className="space-y-4">
                <Label>Date of birth</Label>
                <div className="grid grid-cols-3 gap-4">
                  {renderField('birthDay', 'Day', applicant)}
                  {renderField('birthMonth', 'Month', applicant)}
                  {renderField('birthYear', 'Year', applicant)}
                </div>
              </div>

              {renderField('nationality', 'Nationality', applicant, 'radio', ['UK Resident', 'EEA or Swiss National', 'Non EEA'])}
            </div>

            {/* Addresses Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{title}'s addresses</h3>
              <p className="text-sm text-muted-foreground">
                Please complete the applicant's address over the last 3 years.
              </p>
              
              <div className="space-y-4">
                <h4 className="font-medium">Current address</h4>
                {renderField('currentAddress', 'Address', applicant)}
                <div className="grid grid-cols-2 gap-4">
                  {renderField('currentAddressYears', 'Years', applicant)}
                  {renderField('currentAddressMonths', 'Months', applicant)}
                </div>
                {renderField('currentResidencyStatus', 'Current residency status', applicant, 'select', [
                  'Owner occupation with mortgage',
                  'Owner occupation without mortgage',
                  'Privately rented',
                  'Living with parents',
                  'Council rented',
                  'Housing association rented',
                  'Other'
                ])}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Previous address</h4>
                {renderField('previousAddress', 'Address', applicant)}
                <div className="grid grid-cols-2 gap-4">
                  {renderField('previousAddressYears', 'Years', applicant)}
                  {renderField('previousAddressMonths', 'Months', applicant)}
                </div>
              </div>
            </div>

            {/* Income Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{title}'s income</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('employmentStatus', 'Employment status', applicant, 'select', ['Employed', 'Self-employed', 'Unemployed', 'Retired'])}
                {renderField('grossBasicIncome', 'Gross basic income', applicant)}
                {renderField('frequency', 'Payment frequency of gross basic income', applicant, 'select', ['Weekly', 'Monthly', 'Yearly'])}
                {renderField('annualAmount', 'Annual amount', applicant)}
                {renderField('monthlyNetSalary', 'Monthly net salary/net income', applicant)}
                {renderField('jobTitle', 'Job title', applicant)}
                {renderField('employerName', 'Employer name', applicant)}
                {renderField('employmentType', 'Employment nature', applicant, 'radio', ['Permanent', 'Contract'])}
              </div>

              <div className="space-y-4">
                <Label>Start date of permanent employment</Label>
                <div className="grid grid-cols-2 gap-4">
                  {renderField('startMonth', 'Month', applicant)}
                  {renderField('startYear', 'Year', applicant)}
                </div>
              </div>

              {renderField('expectedRetirementAge', 'Expected retirement age', applicant)}

              <div className="space-y-4">
                <h4 className="font-medium">Please add all additional income sources relevant to this applicant:</h4>
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
            </div>

            {/* Commitments Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{title}'s commitments</h3>
              <p className="text-sm text-muted-foreground">
                Please add all current commitments related to this applicant, even if they will be redeemed or consolidated upon completion.
                Please also include, but are not limited to: credit cards, hire purchase, commercial finance, student finance payments, etc.
              </p>

              <div className="grid grid-cols-4 gap-4">
                {renderField('commitmentType', 'Commitment type', applicant, 'select', ['Credit card', 'Personal loan', 'Hire purchase', 'Student loan'])}
                {renderField('provider', 'Provider', applicant, 'select', ['Bank', 'Building Society', 'Finance Company'])}
                {renderField('monthlyPayment', 'Monthly payment', applicant)}
                {renderField('remainingBalance', 'Remaining balance', applicant)}
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add a commitment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Personal Details</h1>
        <Button onClick={handleMainButtonClick} variant={getButtonVariant()}>
          {getButtonText()}
        </Button>
      </div>

      {renderApplicantSection('james', 'James Taylor')}
      {renderApplicantSection('jane', 'Jane Taylor')}

      <FieldComparisonModal
        open={!!comparisonField}
        onOpenChange={(open) => !open && setComparisonField(null)}
        fieldName={comparisonField || ''}
        auditEntries={auditLog}
      />
    </div>
  );
};