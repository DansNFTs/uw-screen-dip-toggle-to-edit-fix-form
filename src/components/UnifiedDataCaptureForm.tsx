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
import { Clock, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { FieldComparisonModal } from '@/components/FieldComparisonModal';

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

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-slate-50 border-r border-border">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Case Details</h2>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Mortgage Section */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-foreground">Mortgage</h3>
            <div className="space-y-1 ml-4">
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'mortgage' ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('mortgage')}
              >
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Mortgage details
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'household' ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('household')}
              >
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Household details
              </div>
            </div>
          </div>

          {/* James Taylor Section */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-blue-600">James Taylor</h3>
            <div className="space-y-1 ml-4">
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'applicants' && activeApplicant === 1 ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  setActiveTab('applicants');
                  setActiveApplicant(1);
                }}
              >
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Personal details
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'applicants-income' && activeApplicant === 1 ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  setActiveTab('applicants-income');
                  setActiveApplicant(1);
                }}
              >
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Income & employment
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'applicants-credit' && activeApplicant === 1 ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  setActiveTab('applicants-credit');
                  setActiveApplicant(1);
                }}
              >
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Credit information
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'applicants-commitments' && activeApplicant === 1 ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  setActiveTab('applicants-commitments');
                  setActiveApplicant(1);
                }}
              >
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Commitments & expenses
              </div>
            </div>
          </div>

          {/* Jane Taylor Section */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-blue-600">Jane Taylor</h3>
            <div className="space-y-1 ml-4">
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'applicants' && activeApplicant === 2 ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  setActiveTab('applicants');
                  setActiveApplicant(2);
                }}
              >
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Personal details
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'applicants-income' && activeApplicant === 2 ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  setActiveTab('applicants-income');
                  setActiveApplicant(2);
                }}
              >
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Income & employment
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'applicants-credit' && activeApplicant === 2 ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  setActiveTab('applicants-credit');
                  setActiveApplicant(2);
                }}
              >
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Credit information
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'applicants-commitments' && activeApplicant === 2 ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  setActiveTab('applicants-commitments');
                  setActiveApplicant(2);
                }}
              >
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Commitments & expenses
              </div>
            </div>
          </div>

          {/* Submission Section */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-foreground">Submission</h3>
            <div className="space-y-1 ml-4">
              <div 
                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                  activeTab === 'submission' ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('submission')}
              >
                <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                Declarations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 flex justify-between items-center bg-background">
          <h1 className="text-lg font-medium text-foreground">Case Details</h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="outline">
              Save Draft
            </Button>
            <Button onClick={handleMainButtonClick} variant={getButtonVariant()}>
              {getButtonText()}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="mortgage" className="space-y-6 mt-0">
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="household" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Household details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField('initialFixedTerm', 'Initial fixed term request', 'radio', ['Yes', 'No'])}
                    {renderField('numberOfApplicants', 'Number of applicants', 'radio', ['One', 'Two'])}
                    {renderField('sameAddress', 'Do all applicants live at the same address?', 'radio', ['Yes', 'No'])}
                    {renderField('dependentsUnder13', 'Dependents under 13')}
                    {renderField('childBenefit', 'Child benefit received', 'radio', ['Yes', 'No'])}
                    {renderField('dependents14Plus', 'Dependents 14 and over')}
                    {renderField('expenditureCalculation', 'Expenditure calculation', 'radio', ['ONS', 'Individual'])}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applicants" className="space-y-6 mt-0">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <p className="text-muted-foreground">Applicant personal details form would be displayed here.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applicants-income" className="space-y-6 mt-0">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Income & Employment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <p className="text-muted-foreground">Income and employment form would be displayed here.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applicants-credit" className="space-y-6 mt-0">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Credit Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <p className="text-muted-foreground">Credit information form would be displayed here.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applicants-commitments" className="space-y-6 mt-0">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Commitments & Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <p className="text-muted-foreground">Commitments and expenses form would be displayed here.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="submission" className="space-y-6 mt-0">
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
        </div>
      </div>

      <FieldComparisonModal
        open={!!comparisonField}
        onOpenChange={(open) => !open && setComparisonField(null)}
        fieldName={comparisonField || ''}
        auditEntries={auditLog}
      />
    </div>
  );
};