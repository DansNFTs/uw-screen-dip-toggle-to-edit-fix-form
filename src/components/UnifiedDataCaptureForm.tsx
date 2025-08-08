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
  applicantSubjectTo: string;
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
    applicantSubjectTo: 'No',
    applicationPurpose: 'Residential',
    applicationType: 'Purchase',
    residentialSubType: 'Standard',
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Render different content based on current section */}
      {currentSection === 'mortgage' && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            {/* Mortgage Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Mortgage details</h2>
              
              {/* Combined Bankruptcy/IVA Question */}
              <div className="mb-8">
                <h3 className="text-base font-medium mb-4 text-gray-900">Have any applicants been subject to:</h3>
                <div className="ml-4 space-y-2 mb-4">
                  <div className="text-sm text-gray-700">• bankruptcy which has not been satisfied for at least 3 years?</div>
                  <div className="text-sm text-gray-700">• an individual voluntary arrangement (IVA) or debt relief order (DRO) that has not been satisfied for at least 3 years?</div>
                  <div className="text-sm text-gray-700">• property repossession at any time?</div>
                </div>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="applicantSubjectTo"
                      value="Yes"
                      checked={formData.applicantSubjectTo === 'Yes'}
                      onChange={(e) => handleInputChange('applicantSubjectTo', e.target.value)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={!isEditMode}
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="applicantSubjectTo"
                      value="No"
                      checked={formData.applicantSubjectTo === 'No'}
                      onChange={(e) => handleInputChange('applicantSubjectTo', e.target.value)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={!isEditMode}
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Property and Loan Details */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application purpose</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="applicationPurpose"
                        value="Residential"
                        checked={formData.applicationPurpose === 'Residential'}
                        onChange={(e) => handleInputChange('applicationPurpose', e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={!isEditMode}
                      />
                      <span className="text-sm text-gray-700">Residential</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="applicationPurpose"
                        value="Buy to Let"
                        checked={formData.applicationPurpose === 'Buy to Let'}
                        onChange={(e) => handleInputChange('applicationPurpose', e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={!isEditMode}
                      />
                      <span className="text-sm text-gray-700">Buy to Let</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application type</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="applicationType"
                        value="Purchase"
                        checked={formData.applicationType === 'Purchase'}
                        onChange={(e) => handleInputChange('applicationType', e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={!isEditMode}
                      />
                      <span className="text-sm text-gray-700">Purchase</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="applicationType"
                        value="Remortgage"
                        checked={formData.applicationType === 'Remortgage'}
                        onChange={(e) => handleInputChange('applicationType', e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={!isEditMode}
                      />
                      <span className="text-sm text-gray-700">Remortgage</span>
                    </label>
                  </div>
                </div>

                {formData.applicationType === 'Purchase' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Residential purchase sub-type</label>
                    <select
                      value={formData.residentialSubType}
                      onChange={(e) => handleInputChange('residentialSubType', e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="Standard">Standard</option>
                      <option value="First Time Buyer">First Time Buyer</option>
                      <option value="Home Mover">Home Mover</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property region</label>
                  <select
                    value={formData.propertyRegion}
                    onChange={(e) => handleInputChange('propertyRegion', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="England">England</option>
                    <option value="Scotland">Scotland</option>
                    <option value="Wales">Wales</option>
                    <option value="Northern Ireland">Northern Ireland</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total purchase price</label>
                  <input
                    type="text"
                    value={formData.totalPurchasePrice}
                    onChange={(e) => handleInputChange('totalPurchasePrice', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deposit amount</label>
                  <input
                    type="text"
                    value={formData.depositAmount}
                    onChange={(e) => handleInputChange('depositAmount', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required loan amount</label>
                  <input
                    type="text"
                    value={formData.requiredLoanAmount}
                    onChange={(e) => handleInputChange('requiredLoanAmount', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan-to-value</label>
                  <input
                    type="text"
                    value={formData.loanToValue}
                    onChange={(e) => handleInputChange('loanToValue', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Term (years)</label>
                  <input
                    type="text"
                    value={formData.termYears}
                    onChange={(e) => handleInputChange('termYears', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Repayment type</label>
                  <select
                    value={formData.repaymentType}
                    onChange={(e) => handleInputChange('repaymentType', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="Repayment">Repayment</option>
                    <option value="Interest Only">Interest Only</option>
                    <option value="Part and Part">Part and Part</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly ground rent</label>
                  <input
                    type="text"
                    value={formData.monthlyGroundRent}
                    onChange={(e) => handleInputChange('monthlyGroundRent', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial fixed term</label>
                  <select
                    value={formData.initialFixedTerm}
                    onChange={(e) => handleInputChange('initialFixedTerm', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="2 years">2 years</option>
                    <option value="3 years">3 years</option>
                    <option value="5 years">5 years</option>
                    <option value="10 years">10 years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Household Details Section */}
            <div className="border-t pt-8 mb-8">
              <h2 className="text-xl font-semibold mb-6">Household details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Number of applicants</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="numberOfApplicants"
                        value="1"
                        checked={formData.numberOfApplicants === '1'}
                        onChange={(e) => handleInputChange('numberOfApplicants', e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={!isEditMode}
                      />
                      <span className="text-sm text-gray-700">One</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="numberOfApplicants"
                        value="2"
                        checked={formData.numberOfApplicants === '2'}
                        onChange={(e) => handleInputChange('numberOfApplicants', e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={!isEditMode}
                      />
                      <span className="text-sm text-gray-700">Two</span>
                    </label>
                  </div>
                </div>

                {formData.numberOfApplicants === '2' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Will all applicants live at the same address?</label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sameAddress"
                          value="Yes"
                          checked={formData.sameAddress === 'Yes'}
                          onChange={(e) => handleInputChange('sameAddress', e.target.value)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          disabled={!isEditMode}
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sameAddress"
                          value="No"
                          checked={formData.sameAddress === 'No'}
                          onChange={(e) => handleInputChange('sameAddress', e.target.value)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          disabled={!isEditMode}
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of dependents under 13</label>
                  <input
                    type="text"
                    value={formData.dependentsUnder13}
                    onChange={(e) => handleInputChange('dependentsUnder13', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of dependents 14+</label>
                  <input
                    type="text"
                    value={formData.dependents14Plus}
                    onChange={(e) => handleInputChange('dependents14Plus', e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {(parseInt(formData.dependentsUnder13) > 0 || parseInt(formData.dependents14Plus) > 0) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Do you receive child benefit?</label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="childBenefit"
                          value="Yes"
                          checked={formData.childBenefit === 'Yes'}
                          onChange={(e) => handleInputChange('childBenefit', e.target.value)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          disabled={!isEditMode}
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="childBenefit"
                          value="No"
                          checked={formData.childBenefit === 'No'}
                          onChange={(e) => handleInputChange('childBenefit', e.target.value)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          disabled={!isEditMode}
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Household Expenditure Section */}
            <div className="border-t pt-8 mb-8">
              <h2 className="text-xl font-semibold mb-6">Household expenditure</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    We can use the Office for National Statistics (ONS) data to calculate your household expenditure, or you can enter your own figures if you prefer.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">How would you like to calculate expenditure?</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="expenditureCalculation"
                        value="ONS"
                        checked={formData.expenditureCalculation === 'ONS'}
                        onChange={(e) => handleInputChange('expenditureCalculation', e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={!isEditMode}
                      />
                      <span className="text-sm text-gray-700">Use ONS data</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="expenditureCalculation"
                        value="Manual"
                        checked={formData.expenditureCalculation === 'Manual'}
                        onChange={(e) => handleInputChange('expenditureCalculation', e.target.value)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={!isEditMode}
                      />
                      <span className="text-sm text-gray-700">Enter expenditure manually</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button 
                    className="w-full md:w-auto px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                    disabled={!isEditMode}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
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