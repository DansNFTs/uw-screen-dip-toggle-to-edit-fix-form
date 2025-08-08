import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from 'lucide-react';
import { useEditMode } from '../contexts/EditModeContext';
import { useAudit } from '../contexts/AuditContext';
import { useApplicantData } from '../contexts/ApplicantDataContext';
import { useToast } from "@/hooks/use-toast";
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FieldComparisonModal } from './FieldComparisonModal';

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
  jamesBasicIncome: string;
  jamesEmploymentTenure: string;
  jamesEmploymentStartDate: string;
  jamesTimeInEmployment: string;
  jamesAgeAtEndOfTerm: string;
  jamesProbationaryPeriod: string;
  jamesRedundancyPeriod: string;
  jamesFutureChanges: string;
  jamesMonthlyPreTaxSalary: string;
  
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
  janeBasicIncome: string;
  janeEmploymentTenure: string;
  janeEmploymentStartDate: string;
  janeTimeInEmployment: string;
  janeAgeAtEndOfTerm: string;
  janeProbationaryPeriod: string;
  janeRedundancyPeriod: string;
  janeFutureChanges: string;
  janeMonthlyPreTaxSalary: string;
}

export const UnifiedDataCaptureForm: React.FC = () => {
  const { isEditingEnabled, isEditMode, hasUnsavedChanges, setIsEditMode, setHasUnsavedChanges, saveChanges, exitEditMode, storeOriginalState, restoreAllOriginalState } = useEditMode();
  const { addAuditEntry, auditLog, currentSessionId, startAuditSession, endAuditSession, cancelAuditSession } = useAudit();
  const { applicantData, updateApplicantData, getFormattedApplicantNames } = useApplicantData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const targetField = searchParams.get('field');
  const fieldRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // Extract current section and applicant from URL
  const pathParts = location.pathname.split('/');
  const currentSection = pathParts[2] || 'mortgage';
  const currentApplicant = parseInt(pathParts[3]) || 1;

  const [comparisonField, setComparisonField] = useState<string | null>(null);

  const initialFormData: UnifiedFormData = {
    // Mortgage Details
    bankruptcySubject: 'No',
    ivaSubject: 'No', 
    propertyRepossessed: 'No',
    applicationPurpose: 'Purchase',
    applicationType: 'Standard Residential',
    residentialSubType: 'Home Mover',
    propertyRegion: 'England',
    totalPurchasePrice: '£280,000.00',
    depositAmount: '£70,000.00',
    requiredLoanAmount: '£210,000.00',
    loanToValue: '75.00%',
    termYears: '25',
    repaymentType: 'Repayment',
    monthlyGroundRent: '£0.00',
    initialFixedTerm: '2 years',
    numberOfApplicants: '2',
    sameAddress: 'Yes',
    dependentsUnder13: '2',
    childBenefit: 'No',
    dependents14Plus: '0',
    expenditureCalculation: 'Auto',

    // James Taylor defaults
    jamesCourtDecree: 'No',
    jamesDebtManagement: 'No',
    jamesTitle: applicantData.jamesTitle || 'Mr',
    jamesFirstName: applicantData.jamesFirstName || 'James',
    jamesMiddleName: applicantData.jamesMiddleName || '',
    jamesLastName: applicantData.jamesLastName || 'Taylor',
    jamesNameChange: 'No',
    jamesBirthDay: '11',
    jamesBirthMonth: '11',
    jamesBirthYear: '1988',
    jamesNationality: 'UK Resident',
    jamesCurrentAddress: '12 Longwood Close, NEWCASTLE UPON TYNE, Tyne and Wear',
    jamesPostcode: 'NE16 5QB',
    jamesMoveInDate: '01/01/2015',
    jamesCurrentAddressYears: '9',
    jamesCurrentAddressMonths: '3',
    jamesCurrentResidencyStatus: 'Owner occupier with mortgage',
    jamesPreviousAddress: '',
    jamesPreviousAddressYears: '',
    jamesPreviousAddressMonths: '',
    jamesSalePrice: '£200,000.00',
    jamesCurrentLender: 'Barclays',
    jamesOutstandingMortgageBalance: '£56,000.00',
    jamesPlansForProperty: 'Selling current main residence',
    jamesExpectedRemainingBalance: '£56,000.00',
    jamesEmploymentStatus: 'Employed',
    jamesGrossBasicIncome: '£50,000.00',
    jamesFrequency: 'Yearly',
    jamesAnnualAmount: '£50,000.00',
    jamesMonthlyNetSalary: '£3,200.00',
    jamesJobTitle: 'Accountant',
    jamesEmployerName: 'ABC Accountant',
    jamesEmploymentType: 'Permanent',
    jamesStartMonth: '04',
    jamesStartYear: '2016',
    jamesExpectedRetirementAge: '70',
    jamesCommitmentType: 'Credit card',
    jamesProvider: 'Tesco',
    jamesMonthlyPayment: '£0.00',
    jamesRemainingBalance: '£300.00',
    jamesBasicIncome: '£52,000',
    jamesEmploymentTenure: 'Permanent',
    jamesEmploymentStartDate: '01/04/2016',
    jamesTimeInEmployment: '9 years and 3 months',
    jamesAgeAtEndOfTerm: '61 years',
    jamesProbationaryPeriod: 'No',
    jamesRedundancyPeriod: 'No',
    jamesFutureChanges: 'No',
    jamesMonthlyPreTaxSalary: '£0.00',

    // Jane Taylor defaults
    janeCourtDecree: 'No',
    janeDebtManagement: 'No',
    janeTitle: applicantData.janeTitle || 'Mrs',
    janeFirstName: applicantData.janeFirstName || 'Jane',
    janeMiddleName: applicantData.janeMiddleName || '',
    janeLastName: applicantData.janeLastName || 'Taylor',
    janeNameChange: 'No',
    janeBirthDay: '04',
    janeBirthMonth: '04',
    janeBirthYear: '1990',
    janeNationality: 'UK Resident',
    janeCurrentAddress: '12 Longwood Close, NEWCASTLE UPON TYNE, Tyne and Wear',
    janePostcode: 'NE16 5QB',
    janeMoveInDate: '01/04/2015',
    janeCurrentAddressYears: '9',
    janeCurrentAddressMonths: '1',
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
    janeGrossBasicIncome: '£35,000.00',
    janeFrequency: 'Yearly',
    janeAnnualAmount: '£35,000.00',
    janeMonthlyNetSalary: '£2,400.00',
    janeJobTitle: 'Teacher',
    janeEmployerName: 'Newcastle Primary School',
    janeEmploymentType: 'Permanent',
    janeStartMonth: '09',
    janeStartYear: '2019',
    janeExpectedRetirementAge: '70',
    janeCommitmentType: 'Personal loan',
    janeProvider: 'Bank',
    janeMonthlyPayment: '£100.00',
    janeRemainingBalance: '£5,000.00',
    janeBasicIncome: '£50,000',
    janeEmploymentTenure: 'Permanent',
    janeEmploymentStartDate: '01/09/2019',
    janeTimeInEmployment: '5 years and 10 months',
    janeAgeAtEndOfTerm: '60 years',
    janeProbationaryPeriod: 'No',
    janeRedundancyPeriod: 'No',
    janeFutureChanges: 'No',
    janeMonthlyPreTaxSalary: '£60.00'
  };

  const [formData, setFormData] = useState(initialFormData);

  // Auto-enter edit mode when navigating with a target field
  useEffect(() => {
    if (targetField && isEditingEnabled && !isEditMode) {
      setIsEditMode(true);
    }
  }, [targetField, isEditingEnabled, isEditMode, setIsEditMode]);

  // Handle field targeting and auto-focus
  useEffect(() => {
    if (targetField && isEditMode) {
      console.log('Targeting field:', targetField);
      
      // Focus on the field after a delay to ensure the DOM is ready
      setTimeout(() => {
        const fieldRef = fieldRefs.current[targetField];
        if (fieldRef) {
          fieldRef.focus();
          fieldRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [targetField, isEditMode]);

  // Handle initialization and cleanup
  useEffect(() => {
    if (isEditMode && !currentSessionId) {
      startAuditSession();
      Object.entries(formData).forEach(([key, value]) => {
        storeOriginalState(`formData.${key}`, value);
      });
    }
  }, [isEditMode, currentSessionId, storeOriginalState, startAuditSession]);

  useEffect(() => {
    const handleEditModeCancel = () => {
      const originalState = restoreAllOriginalState();
      const restoredFormData: any = {};
      
      Object.keys(initialFormData).forEach(key => {
        const originalValue = originalState[`formData.${key}`];
        if (originalValue !== undefined) {
          restoredFormData[key] = originalValue;
        } else {
          restoredFormData[key] = initialFormData[key as keyof UnifiedFormData];
        }
      });
      
      setFormData(restoredFormData);
      cancelAuditSession();
    };

    window.addEventListener('editModeCancel', handleEditModeCancel);
    return () => window.removeEventListener('editModeCancel', handleEditModeCancel);
  }, [restoreAllOriginalState, cancelAuditSession, initialFormData]);

  const handleInputChange = (field: string, value: string) => {
    const oldValue = formData[field as keyof UnifiedFormData];
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    addAuditEntry(field, oldValue, value, 'Unified Data Capture');
    setHasUnsavedChanges(true);
    
    // Update ApplicantDataContext for name fields
    if (field.includes('Title') || field.includes('FirstName') || field.includes('MiddleName') || field.includes('LastName')) {
      updateApplicantData({ [field]: value });
    }
  };

  // Helper function to navigate back to original page
  const navigateBackToOriginalPage = () => {
    const referrer = searchParams.get('from');
    if (referrer) {
      navigate(decodeURIComponent(referrer));
    } else {
      // Default navigation based on field type or current context
      navigate('/');
    }
  };

  const handleSave = () => {
    saveChanges();
    endAuditSession();
    
    // Navigate back to the originating page
    navigateBackToOriginalPage();
    
    toast({
      title: "Changes saved",
      description: "Your data has been successfully saved.",
    });
  };

  const isFieldEdited = (fieldName: string) => {
    return auditLog.some(entry => entry.field === fieldName);
  };

  const handleFieldComparisonClick = (fieldName: string) => {
    setComparisonField(fieldName);
  };

  const renderField = (
    fieldName: string, 
    label: string, 
    value: string, 
    onChange: (value: string) => void,
    type: 'input' | 'select' | 'radio' = 'input',
    options?: string[]
  ) => {
    const edited = isFieldEdited(fieldName);
    
    // Show edit mode version
    if (isEditMode) {
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldName} className="text-sm font-medium">
            {label}
            {edited && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => handleFieldComparisonClick(fieldName)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
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
          </Label>
          
          {type === 'input' && (
            <Input
              id={fieldName}
              ref={(ref) => fieldRefs.current[fieldName] = ref}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
          
          {type === 'select' && options && (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger ref={(ref) => fieldRefs.current[fieldName] = ref}>
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
          )}
          
          {type === 'radio' && options && (
            <RadioGroup value={value} onValueChange={onChange}>
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${fieldName}-${option}`} />
                  <Label htmlFor={`${fieldName}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      );
    }

    // Show read-only version
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {label}
          {edited && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFieldComparisonClick(fieldName);
                    }}
                    className="ml-2 text-blue-500 hover:text-blue-700"
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
        </Label>
        <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
          <span className="text-gray-900">{value || 'Not set'}</span>
        </div>
      </div>
    );
  };

  // Get applicant names for display
  const [applicantJamesName, applicantJaneName] = getFormattedApplicantNames();

  const getApplicantName = (applicantNumber: number) => {
    return applicantNumber === 1 ? applicantJamesName : applicantJaneName;
  };

  const getFieldPrefix = (applicantNumber: number) => {
    return applicantNumber === 1 ? 'james' : 'jane';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        {/* Render different content based on current section */}
        {currentSection === 'mortgage' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Mortgage Information</CardTitle>
                <CardDescription>Basic loan and property details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('applicationPurpose', 'Application Purpose', formData.applicationPurpose, (value) => handleInputChange('applicationPurpose', value), 'select', ['Purchase', 'Remortgage', 'Transfer of Equity'])}
                  {renderField('applicationType', 'Application Type', formData.applicationType, (value) => handleInputChange('applicationType', value), 'select', ['Standard Residential', 'Buy to Let', 'Right to Buy'])}
                  {renderField('totalPurchasePrice', 'Total Purchase Price', formData.totalPurchasePrice, (value) => handleInputChange('totalPurchasePrice', value))}
                  {renderField('depositAmount', 'Deposit Amount', formData.depositAmount, (value) => handleInputChange('depositAmount', value))}
                  {renderField('requiredLoanAmount', 'Required Loan Amount', formData.requiredLoanAmount, (value) => handleInputChange('requiredLoanAmount', value))}
                  {renderField('loanToValue', 'Loan to Value', formData.loanToValue, (value) => handleInputChange('loanToValue', value))}
                  {renderField('termYears', 'Term (Years)', formData.termYears, (value) => handleInputChange('termYears', value))}
                  {renderField('repaymentType', 'Repayment Type', formData.repaymentType, (value) => handleInputChange('repaymentType', value), 'select', ['Repayment', 'Interest Only', 'Part and Part'])}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Household Information</CardTitle>
                <CardDescription>Applicant and dependency details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('numberOfApplicants', 'Number of Applicants', formData.numberOfApplicants, (value) => handleInputChange('numberOfApplicants', value), 'select', ['1', '2', '3', '4'])}
                  {renderField('sameAddress', 'Same Address', formData.sameAddress, (value) => handleInputChange('sameAddress', value), 'radio', ['Yes', 'No'])}
                  {renderField('dependentsUnder13', 'Dependents Under 13', formData.dependentsUnder13, (value) => handleInputChange('dependentsUnder13', value))}
                  {renderField('dependents14Plus', 'Dependents 14+', formData.dependents14Plus, (value) => handleInputChange('dependents14Plus', value))}
                  {renderField('childBenefit', 'Child Benefit', formData.childBenefit, (value) => handleInputChange('childBenefit', value), 'radio', ['Yes', 'No'])}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Applicant Information Section */}
        {currentSection === 'applicants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {getApplicantName(currentApplicant)} Information
              </h2>
            </div>

            {/* Eligibility Section */}
            <Card>
              <CardHeader>
                <CardTitle>Eligibility - {getApplicantName(currentApplicant)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(`${getFieldPrefix(currentApplicant)}CourtDecree`, 'Court Decree', formData[`${getFieldPrefix(currentApplicant)}CourtDecree` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}CourtDecree`, value), 'radio', ['Yes', 'No'])}
                  {renderField(`${getFieldPrefix(currentApplicant)}DebtManagement`, 'Debt Management Plan', formData[`${getFieldPrefix(currentApplicant)}DebtManagement` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}DebtManagement`, value), 'radio', ['Yes', 'No'])}
                </div>
              </CardContent>
            </Card>

            {/* Personal Details Section */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Details - {getApplicantName(currentApplicant)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField(`${getFieldPrefix(currentApplicant)}Title`, 'Title', formData[`${getFieldPrefix(currentApplicant)}Title` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}Title`, value), 'select', ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'])}
                  {renderField(`${getFieldPrefix(currentApplicant)}FirstName`, 'First Name', formData[`${getFieldPrefix(currentApplicant)}FirstName` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}FirstName`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}MiddleName`, 'Middle Name', formData[`${getFieldPrefix(currentApplicant)}MiddleName` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}MiddleName`, value))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(`${getFieldPrefix(currentApplicant)}LastName`, 'Last Name', formData[`${getFieldPrefix(currentApplicant)}LastName` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}LastName`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}NameChange`, 'Name Change in Last 6 Years', formData[`${getFieldPrefix(currentApplicant)}NameChange` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}NameChange`, value), 'radio', ['Yes', 'No'])}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {renderField(`${getFieldPrefix(currentApplicant)}BirthDay`, 'Day', formData[`${getFieldPrefix(currentApplicant)}BirthDay` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}BirthDay`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}BirthMonth`, 'Month', formData[`${getFieldPrefix(currentApplicant)}BirthMonth` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}BirthMonth`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}BirthYear`, 'Year', formData[`${getFieldPrefix(currentApplicant)}BirthYear` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}BirthYear`, value))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(`${getFieldPrefix(currentApplicant)}Nationality`, 'Nationality', formData[`${getFieldPrefix(currentApplicant)}Nationality` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}Nationality`, value), 'select', ['UK Resident', 'EU Citizen', 'Other'])}
                </div>
              </CardContent>
            </Card>

            {/* Address Section */}
            <Card>
              <CardHeader>
                <CardTitle>Addresses - {getApplicantName(currentApplicant)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {renderField(`${getFieldPrefix(currentApplicant)}CurrentAddress`, 'Current Address', formData[`${getFieldPrefix(currentApplicant)}CurrentAddress` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}CurrentAddress`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}Postcode`, 'Postcode', formData[`${getFieldPrefix(currentApplicant)}Postcode` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}Postcode`, value))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField(`${getFieldPrefix(currentApplicant)}MoveInDate`, 'Move In Date', formData[`${getFieldPrefix(currentApplicant)}MoveInDate` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}MoveInDate`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}CurrentAddressYears`, 'Years at Address', formData[`${getFieldPrefix(currentApplicant)}CurrentAddressYears` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}CurrentAddressYears`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}CurrentAddressMonths`, 'Months at Address', formData[`${getFieldPrefix(currentApplicant)}CurrentAddressMonths` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}CurrentAddressMonths`, value))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(`${getFieldPrefix(currentApplicant)}CurrentResidencyStatus`, 'Current Residency Status', formData[`${getFieldPrefix(currentApplicant)}CurrentResidencyStatus` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}CurrentResidencyStatus`, value), 'select', ['Owner occupier with mortgage', 'Owner occupier without mortgage', 'Renting', 'Living with family'])}
                </div>
              </CardContent>
            </Card>

            {/* Income Section */}
            <Card>
              <CardHeader>
                <CardTitle>Employment & Income - {getApplicantName(currentApplicant)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(`${getFieldPrefix(currentApplicant)}EmploymentStatus`, 'Employment Status', formData[`${getFieldPrefix(currentApplicant)}EmploymentStatus` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}EmploymentStatus`, value), 'select', ['Employed', 'Self-employed', 'Retired', 'Student', 'Unemployed'])}
                  {renderField(`${getFieldPrefix(currentApplicant)}GrossBasicIncome`, 'Gross Basic Income', formData[`${getFieldPrefix(currentApplicant)}GrossBasicIncome` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}GrossBasicIncome`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}JobTitle`, 'Job Title', formData[`${getFieldPrefix(currentApplicant)}JobTitle` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}JobTitle`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}EmployerName`, 'Employer Name', formData[`${getFieldPrefix(currentApplicant)}EmployerName` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}EmployerName`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}EmploymentType`, 'Employment Type', formData[`${getFieldPrefix(currentApplicant)}EmploymentType` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}EmploymentType`, value), 'select', ['Permanent', 'Fixed Term', 'Temporary', 'Probationary'])}
                  {renderField(`${getFieldPrefix(currentApplicant)}ExpectedRetirementAge`, 'Expected Retirement Age', formData[`${getFieldPrefix(currentApplicant)}ExpectedRetirementAge` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}ExpectedRetirementAge`, value))}
                </div>
              </CardContent>
            </Card>

            {/* Commitments Section */}
            <Card>
              <CardHeader>
                <CardTitle>Commitments - {getApplicantName(currentApplicant)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(`${getFieldPrefix(currentApplicant)}CommitmentType`, 'Commitment Type', formData[`${getFieldPrefix(currentApplicant)}CommitmentType` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}CommitmentType`, value), 'select', ['Credit card', 'Personal loan', 'Car loan', 'Store card', 'Other'])}
                  {renderField(`${getFieldPrefix(currentApplicant)}Provider`, 'Provider', formData[`${getFieldPrefix(currentApplicant)}Provider` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}Provider`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}MonthlyPayment`, 'Monthly Payment', formData[`${getFieldPrefix(currentApplicant)}MonthlyPayment` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}MonthlyPayment`, value))}
                  {renderField(`${getFieldPrefix(currentApplicant)}RemainingBalance`, 'Remaining Balance', formData[`${getFieldPrefix(currentApplicant)}RemainingBalance` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(currentApplicant)}RemainingBalance`, value))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Review & Submit Section */}
        {currentSection === 'submission' && (
          <Card>
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
              <CardDescription>Review your information before submitting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Ready to Submit</h3>
                  <p className="text-gray-600 mb-4">All required information has been collected.</p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline">Save as Draft</Button>
                    <Button>Submit Application</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Field Comparison Modal */}
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