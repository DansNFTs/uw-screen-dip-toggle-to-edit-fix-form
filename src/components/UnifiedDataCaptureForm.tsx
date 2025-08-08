import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEditMode } from '@/contexts/EditModeContext';
import { useAudit } from '@/contexts/AuditContext';
import { useToast } from '@/hooks/use-toast';
import { useApplicantData } from '@/contexts/ApplicantDataContext';
import { Clock, Plus, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { FieldComparisonModal } from '@/components/FieldComparisonModal';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UnifiedFormData {
  // Mortgage Details
  bankruptcySubject: string;
  ivaSubject: string;
  propertyRepossessed: string;
  applicationPurpose: string;
  applicationType: string;
  residentialSubType: string;
  propertyRegion: string;
  totalPurchasePrice: string;
  depositAmount: string;
  requiredLoanAmount: string;
  loanToValue: string;
  termYears: string;
  repaymentType: string;
  monthlyGroundRent: string;
  initialFixedTerm: string;
  numberOfApplicants: string;
  sameAddress: string;
  dependentsUnder13: string;
  childBenefit: string;
  dependents14Plus: string;
  expenditureCalculation: string;
  
  // James Taylor (Applicant 1)
  jamesCourtDecree: string;
  jamesDebtManagement: string;
  jamesTitle: string;
  jamesFirstName: string;
  jamesMiddleName: string;
  jamesLastName: string;
  jamesNameChange: string;
  jamesBirthDay: string;
  jamesBirthMonth: string;
  jamesBirthYear: string;
  jamesNationality: string;
  jamesCurrentAddress: string;
  jamesPostcode: string;
  jamesMoveInDate: string;
  jamesCurrentAddressYears: string;
  jamesCurrentAddressMonths: string;
  jamesCurrentResidencyStatus: string;
  jamesPreviousAddress: string;
  jamesPreviousAddressYears: string;
  jamesPreviousAddressMonths: string;
  jamesSalePrice: string;
  jamesCurrentLender: string;
  jamesOutstandingMortgageBalance: string;
  jamesPlansForProperty: string;
  jamesExpectedRemainingBalance: string;
  jamesEmploymentStatus: string;
  jamesGrossBasicIncome: string;
  jamesFrequency: string;
  jamesAnnualAmount: string;
  jamesMonthlyNetSalary: string;
  jamesJobTitle: string;
  jamesEmployerName: string;
  jamesEmploymentType: string;
  jamesStartMonth: string;
  jamesStartYear: string;
  jamesExpectedRetirementAge: string;
  jamesCommitmentType: string;
  jamesProvider: string;
  jamesMonthlyPayment: string;
  jamesRemainingBalance: string;
  
  // Jane Taylor (Applicant 2)
  janeCourtDecree: string;
  janeDebtManagement: string;
  janeTitle: string;
  janeFirstName: string;
  janeMiddleName: string;
  janeLastName: string;
  janeNameChange: string;
  janeBirthDay: string;
  janeBirthMonth: string;
  janeBirthYear: string;
  janeNationality: string;
  janeCurrentAddress: string;
  janePostcode: string;
  janeMoveInDate: string;
  janeCurrentAddressYears: string;
  janeCurrentAddressMonths: string;
  janeCurrentResidencyStatus: string;
  janePreviousAddress: string;
  janePreviousAddressYears: string;
  janePreviousAddressMonths: string;
  janeSalePrice: string;
  janeCurrentLender: string;
  janeOutstandingMortgageBalance: string;
  janePlansForProperty: string;
  janeExpectedRemainingBalance: string;
  janeEmploymentStatus: string;
  janeGrossBasicIncome: string;
  janeFrequency: string;
  janeAnnualAmount: string;
  janeMonthlyNetSalary: string;
  janeJobTitle: string;
  janeEmployerName: string;
  janeEmploymentType: string;
  janeStartMonth: string;
  janeStartYear: string;
  janeExpectedRetirementAge: string;
  janeCommitmentType: string;
  janeProvider: string;
  janeMonthlyPayment: string;
  janeRemainingBalance: string;
}

export const UnifiedDataCaptureForm: React.FC = () => {
  const { section, applicantNumber } = useParams<{ section?: string; applicantNumber?: string }>();
  const navigate = useNavigate();
  const { applicantData, updateApplicantData } = useApplicantData();
  
  const [activeTab, setActiveTab] = useState(section || 'mortgage');
  const [activeApplicant, setActiveApplicant] = useState(applicantNumber ? parseInt(applicantNumber) : 1);
  
  const [formData, setFormData] = useState<UnifiedFormData>({
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
    numberOfApplicants: 'Two',
    sameAddress: 'Yes',
    dependentsUnder13: '2',
    childBenefit: 'No',
    dependents14Plus: '0',
    expenditureCalculation: 'ONS',
    
    // James Taylor data
    jamesCourtDecree: 'No',
    jamesDebtManagement: 'No',
    jamesTitle: applicantData.jamesTitle,
    jamesFirstName: applicantData.jamesFirstName,
    jamesMiddleName: applicantData.jamesMiddleName,
    jamesLastName: applicantData.jamesLastName,
    jamesNameChange: 'No',
    jamesBirthDay: '11',
    jamesBirthMonth: '11',
    jamesBirthYear: '1988',
    jamesNationality: 'UK Resident',
    jamesCurrentAddress: '12 Longwood Close',
    jamesPostcode: '',
    jamesMoveInDate: '',
    jamesCurrentAddressYears: '1',
    jamesCurrentAddressMonths: '0',
    jamesCurrentResidencyStatus: 'Owner occupation with mortgage',
    jamesPreviousAddress: '',
    jamesPreviousAddressYears: '',
    jamesPreviousAddressMonths: '',
    jamesSalePrice: '',
    jamesCurrentLender: '',
    jamesOutstandingMortgageBalance: '',
    jamesPlansForProperty: '',
    jamesExpectedRemainingBalance: '',
    jamesEmploymentStatus: 'Employed',
    jamesGrossBasicIncome: '£52000.00',
    jamesFrequency: 'Yearly',
    jamesAnnualAmount: '£52,000.00',
    jamesMonthlyNetSalary: '£4333',
    jamesJobTitle: 'Software Engineer',
    jamesEmployerName: 'NBS',
    jamesEmploymentType: 'Permanent',
    jamesStartMonth: '9',
    jamesStartYear: '2008',
    jamesExpectedRetirementAge: '70',
    jamesCommitmentType: 'Credit card',
    jamesProvider: 'Bank',
    jamesMonthlyPayment: '£100.00',
    jamesRemainingBalance: '£5,000.00',
    
    // Jane Taylor data
    janeCourtDecree: 'No',
    janeDebtManagement: 'No',
    janeTitle: applicantData.janeTitle,
    janeFirstName: applicantData.janeFirstName,
    janeMiddleName: applicantData.janeMiddleName,
    janeLastName: applicantData.janeLastName,
    janeNameChange: 'No',
    janeBirthDay: '04',
    janeBirthMonth: '04',
    janeBirthYear: '1990',
    janeNationality: 'UK Resident',
    janeCurrentAddress: '12 Longwood Close, NEWCASTLE UPON TYNE, Tyne and Wear',
    janePostcode: 'NE16 5QB',
    janeMoveInDate: '01/04/2015',
    janeCurrentAddressYears: '9',
    janeCurrentAddressMonths: '0',
    janeCurrentResidencyStatus: 'Owner occupier with mortgage',
    janePreviousAddress: '',
    janePreviousAddressYears: '',
    janePreviousAddressMonths: '',
    janeSalePrice: '£200,000.00',
    janeCurrentLender: 'Barclays',
    janeOutstandingMortgageBalance: '£56,000.00',
    janePlansForProperty: 'Selling current main residence',
    janeExpectedRemainingBalance: '£56,000.00',
    janeEmploymentStatus: 'Employed',
    janeGrossBasicIncome: '£50000.00',
    janeFrequency: 'Yearly',
    janeAnnualAmount: '£50,000.00',
    janeMonthlyNetSalary: '£4167',
    janeJobTitle: 'Manager',
    janeEmployerName: 'NHS',
    janeEmploymentType: 'Permanent',
    janeStartMonth: '9',
    janeStartYear: '2019',
    janeExpectedRetirementAge: '70',
    janeCommitmentType: 'Credit card',
    janeProvider: 'Bank',
    janeMonthlyPayment: '£100.00',
    janeRemainingBalance: '£5,000.00'
  });

  const [originalFormData, setOriginalFormData] = useState(formData);
  const [comparisonField, setComparisonField] = useState<string | null>(null);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

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

  const handleInputChange = (field: string, value: string) => {
    const oldValue = formData[field as keyof UnifiedFormData];
    if (oldValue !== value) {
      setFormData(prev => ({ ...prev, [field]: value }));
      addAuditEntry(field, oldValue, value, 'Unified Data Capture');
      setHasUnsavedChanges(true);
      
      // Update ApplicantDataContext for name-related fields
      if (field.includes('Title') || field.includes('FirstName') || field.includes('MiddleName') || field.includes('LastName')) {
        const contextField = field.replace('james', '').replace('jane', '');
        const prefix = field.startsWith('james') ? 'james' : 'jane';
        const finalField = `${prefix}${contextField}`;
        updateApplicantData({ [finalField]: value });
      }
    }
  };

  const handleSave = () => {
    endAuditSession();
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    toast({
      title: "Changes saved successfully",
      description: "All data has been updated.",
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
    field: keyof UnifiedFormData,
    label: string,
    type: 'input' | 'select' | 'radio' = 'input',
    options?: { value: string; label: string }[] | string[]
  ) => {
    const value = formData[field];
    const fieldName = field as string;

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
          {isFieldEdited(fieldName) && (
            <Clock
              className="h-4 w-4 text-muted-foreground cursor-pointer inline-block ml-2"
              onClick={() => handleFieldComparisonClick(fieldName)}
            />
          )}
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
          {isFieldEdited(fieldName) && (
            <Clock
              className="h-4 w-4 text-muted-foreground cursor-pointer inline-block ml-2"
              onClick={() => handleFieldComparisonClick(fieldName)}
            />
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldName}>{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            ref={(el) => { fieldRefs.current[fieldName] = el; }}
            id={fieldName}
            value={value}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full"
          />
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

  const getApplicantName = (applicantNum: number) => {
    return applicantNum === 1 ? 
      `${formData.jamesTitle} ${formData.jamesFirstName} ${formData.jamesLastName}` :
      `${formData.janeTitle} ${formData.janeFirstName} ${formData.janeLastName}`;
  };

  const getFieldPrefix = (applicantNum: number) => {
    return applicantNum === 1 ? 'james' : 'jane';
  };

  const navigationItems = [
    {
      title: 'Mortgage',
      items: [
        { label: 'Mortgage details', key: 'mortgage-details', status: 'complete' as const },
        { label: 'Household details', key: 'household-details', status: 'complete' as const }
      ]
    },
    {
      title: 'James Taylor',
      items: [
        { label: 'Personal details', key: 'james-personal', status: 'complete' as const },
        { label: 'Income & employment', key: 'james-employment', status: 'complete' as const },
        { label: 'Credit information', key: 'james-credit', status: 'complete' as const },
        { label: 'Commitments & expenses', key: 'james-commitments', status: 'complete' as const }
      ]
    },
    {
      title: 'Jane Taylor',
      items: [
        { label: 'Personal details', key: 'jane-personal', status: 'complete' as const },
        { label: 'Income & employment', key: 'jane-employment', status: 'complete' as const },
        { label: 'Credit information', key: 'jane-credit', status: 'complete' as const },
        { label: 'Commitments & expenses', key: 'jane-commitments', status: 'complete' as const }
      ]
    },
    {
      title: 'Submission',
      items: [
        { label: 'Declarations', key: 'declarations', status: 'warning' as const }
      ]
    }
  ];

  const getCurrentSectionFromKey = (key: string) => {
    if (key.startsWith('mortgage') || key.startsWith('household')) return 'mortgage';
    if (key.startsWith('james')) return 'applicants';
    if (key.startsWith('jane')) return 'applicants';
    if (key === 'declarations') return 'submission';
    return 'mortgage';
  };

  const handleNavigationClick = (key: string) => {
    const section = getCurrentSectionFromKey(key);
    setActiveTab(section);
    
    if (key.startsWith('james')) {
      setActiveApplicant(1);
    } else if (key.startsWith('jane')) {
      setActiveApplicant(2);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Data Capture Form</h1>
        <Button onClick={handleMainButtonClick} variant={getButtonVariant()}>
          {getButtonText()}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Hidden TabsList for programmatic control */}
        <TabsList className="hidden">
          <TabsTrigger value="mortgage">Mortgage Details</TabsTrigger>
          <TabsTrigger value="applicants">Applicant Information</TabsTrigger>
          <TabsTrigger value="submission">Review & Submit</TabsTrigger>
        </TabsList>

                  <TabsContent value="mortgage" className="space-y-6">
                    <Card>
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

                    <Card>
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

                    <Card>
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
                  </TabsContent>

                  <TabsContent value="applicants" className="space-y-6">
                    <div className="flex justify-center mb-6">
                      <Tabs value={activeApplicant.toString()} onValueChange={(value) => setActiveApplicant(parseInt(value))}>
                        <TabsList>
                          <TabsTrigger value="1">Applicant 1 - {getApplicantName(1)}</TabsTrigger>
                          <TabsTrigger value="2">Applicant 2 - {getApplicantName(2)}</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* Render applicant forms based on activeApplicant */}
                    {[1, 2].map(applicantNum => {
                      if (applicantNum !== activeApplicant) return null;
                      const prefix = getFieldPrefix(applicantNum);
                      
                      return (
                        <div key={applicantNum} className="space-y-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Eligibility - {getApplicantName(applicantNum)}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                In the last 3 years has this applicant had or satisfied any of the following:
                              </p>
                              {renderField(`${prefix}CourtDecree` as keyof UnifiedFormData, 'CCJ (court of decree in Scotland)', 'radio', ['Yes', 'No'])}
                              {renderField(`${prefix}DebtManagement` as keyof UnifiedFormData, 'Had an active or settled debt management plan', 'radio', ['Yes', 'No'])}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Personal details - {getApplicantName(applicantNum)}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderField(`${prefix}Title` as keyof UnifiedFormData, 'Title', 'select', ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'])}
                                {renderField(`${prefix}FirstName` as keyof UnifiedFormData, 'First name')}
                                {renderField(`${prefix}MiddleName` as keyof UnifiedFormData, 'Middle name')}
                                {renderField(`${prefix}LastName` as keyof UnifiedFormData, 'Last name')}
                                {renderField(`${prefix}NameChange` as keyof UnifiedFormData, 'Name change in the last 3 years?', 'radio', ['Yes', 'No'])}
                              </div>

                              <div className="space-y-4">
                                <Label>Date of birth</Label>
                                <div className="grid grid-cols-3 gap-4">
                                  {renderField(`${prefix}BirthDay` as keyof UnifiedFormData, 'Day')}
                                  {renderField(`${prefix}BirthMonth` as keyof UnifiedFormData, 'Month')}
                                  {renderField(`${prefix}BirthYear` as keyof UnifiedFormData, 'Year')}
                                </div>
                              </div>

                              {renderField(`${prefix}Nationality` as keyof UnifiedFormData, 'Nationality', 'radio', ['UK Resident', 'EEA or Swiss National', 'Non EEA'])}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Addresses - {getApplicantName(applicantNum)}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium">Current address</h3>
                                {renderField(`${prefix}CurrentAddress` as keyof UnifiedFormData, 'Address')}
                                {renderField(`${prefix}Postcode` as keyof UnifiedFormData, 'Postcode')}
                                {renderField(`${prefix}MoveInDate` as keyof UnifiedFormData, 'When did the applicant move in')}
                                <div className="grid grid-cols-2 gap-4">
                                  {renderField(`${prefix}CurrentAddressYears` as keyof UnifiedFormData, 'Years')}
                                  {renderField(`${prefix}CurrentAddressMonths` as keyof UnifiedFormData, 'Months')}
                                </div>
                                {renderField(`${prefix}CurrentResidencyStatus` as keyof UnifiedFormData, 'Current residency status', 'select', [
                                  'Owner occupation with mortgage',
                                  'Owner occupier with mortgage',
                                  'Owner occupation without mortgage',
                                  'Privately rented',
                                  'Living with parents',
                                  'Council rented',
                                  'Housing association rented',
                                  'Other'
                                ])}
                                {renderField(`${prefix}SalePrice` as keyof UnifiedFormData, 'Sale price')}
                                {renderField(`${prefix}CurrentLender` as keyof UnifiedFormData, 'Current lender')}
                                {renderField(`${prefix}OutstandingMortgageBalance` as keyof UnifiedFormData, 'Outstanding mortgage balance')}
                                {renderField(`${prefix}PlansForProperty` as keyof UnifiedFormData, 'Plans for property')}
                                {renderField(`${prefix}ExpectedRemainingBalance` as keyof UnifiedFormData, 'Expected remaining balance')}
                              </div>

                              <div className="space-y-4">
                                <h3 className="text-lg font-medium">Previous address</h3>
                                {renderField(`${prefix}PreviousAddress` as keyof UnifiedFormData, 'Address')}
                                <div className="grid grid-cols-2 gap-4">
                                  {renderField(`${prefix}PreviousAddressYears` as keyof UnifiedFormData, 'Years')}
                                  {renderField(`${prefix}PreviousAddressMonths` as keyof UnifiedFormData, 'Months')}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Income - {getApplicantName(applicantNum)}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderField(`${prefix}EmploymentStatus` as keyof UnifiedFormData, 'Employment status', 'select', ['Employed', 'Self-employed', 'Unemployed', 'Retired'])}
                                {renderField(`${prefix}GrossBasicIncome` as keyof UnifiedFormData, 'Gross basic income')}
                                {renderField(`${prefix}Frequency` as keyof UnifiedFormData, 'Payment frequency of gross basic income', 'select', ['Weekly', 'Monthly', 'Yearly'])}
                                {renderField(`${prefix}AnnualAmount` as keyof UnifiedFormData, 'Annual amount')}
                                {renderField(`${prefix}MonthlyNetSalary` as keyof UnifiedFormData, 'Monthly net salary/net income')}
                                {renderField(`${prefix}JobTitle` as keyof UnifiedFormData, 'Job title')}
                                {renderField(`${prefix}EmployerName` as keyof UnifiedFormData, 'Employer name')}
                                {renderField(`${prefix}EmploymentType` as keyof UnifiedFormData, 'Employment nature', 'radio', ['Permanent', 'Contract'])}
                              </div>

                              <div className="space-y-4">
                                <Label>Start date of permanent employment</Label>
                                <div className="grid grid-cols-2 gap-4">
                                  {renderField(`${prefix}StartMonth` as keyof UnifiedFormData, 'Month')}
                                  {renderField(`${prefix}StartYear` as keyof UnifiedFormData, 'Year')}
                                </div>
                              </div>

                              {renderField(`${prefix}ExpectedRetirementAge` as keyof UnifiedFormData, 'Expected retirement age')}

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

                          <Card>
                            <CardHeader>
                              <CardTitle>Commitments - {getApplicantName(applicantNum)}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <p className="text-sm text-muted-foreground">
                                Please add all current commitments related to this applicant, even if they will be redeemed or consolidated upon completion.
                                Please also include, but are not limited to: credit cards, hire purchase, commercial finance, student finance payments, etc.
                              </p>

                              <div className="grid grid-cols-4 gap-4">
                                {renderField(`${prefix}CommitmentType` as keyof UnifiedFormData, 'Commitment type', 'select', ['Credit card', 'Personal loan', 'Hire purchase', 'Student loan'])}
                                {renderField(`${prefix}Provider` as keyof UnifiedFormData, 'Provider', 'select', ['Bank', 'Building Society', 'Finance Company'])}
                                {renderField(`${prefix}MonthlyPayment` as keyof UnifiedFormData, 'Monthly payment')}
                                {renderField(`${prefix}RemainingBalance` as keyof UnifiedFormData, 'Remaining balance')}
                              </div>

                              <Button variant="outline" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Add a commitment
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="submission" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Review & Submit Application</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">Application Summary</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Property Purchase Price:</strong> {formData.totalPurchasePrice}
                            </div>
                            <div>
                              <strong>Loan Amount:</strong> {formData.requiredLoanAmount}
                            </div>
                            <div>
                              <strong>Applicant 1:</strong> {getApplicantName(1)}
                            </div>
                            <div>
                              <strong>Applicant 2:</strong> {getApplicantName(2)}
                            </div>
                            <div>
                              <strong>Application Type:</strong> {formData.applicationType}
                            </div>
                            <div>
                              <strong>Term:</strong> {formData.termYears} years
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-md font-medium">Declaration</h4>
                          <p className="text-sm text-muted-foreground">
                            By submitting this application, you confirm that all information provided is accurate and complete.
                            You understand that any false or misleading information may result in the rejection of your application.
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <Button variant="outline" className="flex-1">
                            Save as Draft
                          </Button>
                          <Button className="flex-1" disabled={!isEditMode || hasUnsavedChanges}>
                            Submit Application
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
        </TabsContent>
      </Tabs>

      {comparisonField && (
        <FieldComparisonModal
          open={!!comparisonField}
          onOpenChange={(open) => !open && setComparisonField(null)}
          fieldName={comparisonField}
          auditEntries={auditLog}
        />
      )}
    </div>
  );
};