import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from 'lucide-react';
import { useEditMode } from '../contexts/EditModeContext';
import { useAudit } from '../contexts/AuditContext';
import { useApplicantData } from '../contexts/ApplicantDataContext';
import { useToast } from "@/hooks/use-toast";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
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
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
  const [originalFormData, setOriginalFormData] = useState(formData);
  const [activeTab, setActiveTab] = useState("mortgage-details");
  const [activeApplicant, setActiveApplicant] = useState(1);
  const [comparisonField, setComparisonField] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const fieldRefs = useRef<{ [key: string]: HTMLInputElement | HTMLButtonElement | null }>({});

  // Field targeting from URL parameters
  const targetField = searchParams.get('field');
  const targetApplicant = params.applicantNumber ? parseInt(params.applicantNumber) : null;

  // Handle field targeting and auto-focus
  useEffect(() => {
    if (targetField && targetApplicant && isEditMode) {
      console.log('Targeting field:', targetField, 'for applicant:', targetApplicant);
      
      // Set the active applicant
      setActiveApplicant(targetApplicant);
      
      // Determine section and set active tab
      const section = getSectionFromField(targetField);
      if (section) {
        setActiveTab(section);
      }
      
      // Focus on the field after a delay to ensure the DOM is ready
      setTimeout(() => {
        const fieldRef = fieldRefs.current[targetField];
        if (fieldRef) {
          fieldRef.focus();
          fieldRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [targetField, targetApplicant, isEditMode]);

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

  const handleMainButtonClick = () => {
    if (hasUnsavedChanges) {
      setIsEditMode(false);
      setHasUnsavedChanges(false);
      
      // Restore original state
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
      
      // Navigate back to the originating page
      navigateBackToOriginalPage();
      
      toast({
        title: "Changes discarded",
        description: "Your changes have been discarded and original values restored.",
      });
    } else {
      setIsEditMode(true);
    }
  };

  // Helper function to determine section from field name
  const getSectionFromField = (fieldName: string): string => {
    if (fieldName.includes('mortgage') || fieldName.includes('loan') || fieldName.includes('household')) {
      return 'mortgage-details';
    }
    return 'applicant-information';
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
    
    // Show inactive state if editing is not enabled and not in edit mode
    if (!isEditingEnabled && !isEditMode) {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium opacity-50">{label}</Label>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md opacity-50">
            <span className="text-gray-600">{value || 'Not set'}</span>
          </div>
        </div>
      );
    }

    // Show toast and return inactive if editing is not enabled but user tries to interact
    if (!isEditingEnabled) {
      const handleClick = () => {
        toast({
          title: "Enable editing first",
          description: "Please enable editing mode to modify fields.",
        });
      };

      return (
        <div className="space-y-2" onClick={handleClick}>
          <Label className="text-sm font-medium">{label}</Label>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100">
            <span className="text-gray-700">{value || 'Not set'}</span>
          </div>
        </div>
      );
    }

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

    // Show read-only version with double-click to edit
    return (
      <div 
        className="space-y-2 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors"
        onDoubleClick={() => {
          setIsEditMode(true);
          setTimeout(() => {
            const fieldRef = fieldRefs.current[fieldName];
            if (fieldRef) {
              fieldRef.focus();
            }
          }, 100);
        }}
        title="Double-click to edit this field"
      >
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
        <div className="p-2 border border-gray-200 rounded-md group-hover:border-blue-300">
          <span className="text-gray-900">{value || 'Not set'}</span>
        </div>
      </div>
    );
  };

  // Get applicant names for display
  const [applicantJamesName, applicantJaneName] = getFormattedApplicantNames();
  
  // Navigation items
  const navigationItems = [
    { key: "mortgage-details", label: "Mortgage Details" },
    { key: "applicant-information", label: "Applicant Information" },
    { key: "review-submit", label: "Review & Submit" }
  ];

  const getApplicantName = (applicantNumber: number) => {
    return applicantNumber === 1 ? applicantJamesName : applicantJaneName;
  };

  const getFieldPrefix = (applicantNumber: number) => {
    return applicantNumber === 1 ? 'james' : 'jane';
  };

  // Current section from key
  const getCurrentSectionFromKey = (key: string) => {
    if (key === "mortgage-details") return "mortgage";
    if (key === "applicant-information") return "applicants";
    return "review";
  };

  const handleNavigationClick = (key: string) => {
    setActiveTab(key);
    
    // Auto-switch to applicant 1 when going to applicant information
    if (key === "applicant-information" && !targetApplicant) {
      setActiveApplicant(1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">Data Capture Form</h1>
        
        <div className="flex gap-2">
          {isEditMode && hasUnsavedChanges && (
            <Button onClick={handleSave} variant="default">
              Save Changes
            </Button>
          )}
          <Button 
            onClick={handleMainButtonClick}
            variant={hasUnsavedChanges ? "destructive" : "outline"}
          >
            {hasUnsavedChanges ? "Cancel" : (isEditMode ? "Exit Edit Mode" : "Enter Edit Mode")}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={handleNavigationClick} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {navigationItems.map((item) => (
              <TabsTrigger key={item.key} value={item.key}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Mortgage Details Tab */}
          <TabsContent value="mortgage-details" className="space-y-6">
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
          </TabsContent>

          {/* Applicant Information Tab */}
          <TabsContent value="applicant-information" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">Viewing:</span>
              <div className="flex gap-2">
                <Button
                  variant={activeApplicant === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveApplicant(1)}
                >
                  {getApplicantName(1)}
                </Button>
                <Button
                  variant={activeApplicant === 2 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveApplicant(2)}
                >
                  {getApplicantName(2)}
                </Button>
              </div>
            </div>

            {[1, 2].map((applicantNumber) => (
              <div 
                key={applicantNumber}
                className={applicantNumber === activeApplicant ? 'block' : 'hidden'}
              >
                <div className="space-y-6">
                  {/* Eligibility Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Eligibility - {getApplicantName(applicantNumber)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField(`${getFieldPrefix(applicantNumber)}CourtDecree`, 'Court Decree', formData[`${getFieldPrefix(applicantNumber)}CourtDecree` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}CourtDecree`, value), 'radio', ['Yes', 'No'])}
                        {renderField(`${getFieldPrefix(applicantNumber)}DebtManagement`, 'Debt Management Plan', formData[`${getFieldPrefix(applicantNumber)}DebtManagement` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}DebtManagement`, value), 'radio', ['Yes', 'No'])}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personal Details Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Details - {getApplicantName(applicantNumber)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {renderField(`${getFieldPrefix(applicantNumber)}Title`, 'Title', formData[`${getFieldPrefix(applicantNumber)}Title` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}Title`, value), 'select', ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'])}
                        {renderField(`${getFieldPrefix(applicantNumber)}FirstName`, 'First Name', formData[`${getFieldPrefix(applicantNumber)}FirstName` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}FirstName`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}MiddleName`, 'Middle Name', formData[`${getFieldPrefix(applicantNumber)}MiddleName` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}MiddleName`, value))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField(`${getFieldPrefix(applicantNumber)}LastName`, 'Last Name', formData[`${getFieldPrefix(applicantNumber)}LastName` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}LastName`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}NameChange`, 'Name Change in Last 6 Years', formData[`${getFieldPrefix(applicantNumber)}NameChange` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}NameChange`, value), 'radio', ['Yes', 'No'])}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {renderField(`${getFieldPrefix(applicantNumber)}BirthDay`, 'Day', formData[`${getFieldPrefix(applicantNumber)}BirthDay` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}BirthDay`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}BirthMonth`, 'Month', formData[`${getFieldPrefix(applicantNumber)}BirthMonth` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}BirthMonth`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}BirthYear`, 'Year', formData[`${getFieldPrefix(applicantNumber)}BirthYear` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}BirthYear`, value))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField(`${getFieldPrefix(applicantNumber)}Nationality`, 'Nationality', formData[`${getFieldPrefix(applicantNumber)}Nationality` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}Nationality`, value), 'select', ['UK Resident', 'EU Citizen', 'Other'])}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Address Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Addresses - {getApplicantName(applicantNumber)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {renderField(`${getFieldPrefix(applicantNumber)}CurrentAddress`, 'Current Address', formData[`${getFieldPrefix(applicantNumber)}CurrentAddress` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}CurrentAddress`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}Postcode`, 'Postcode', formData[`${getFieldPrefix(applicantNumber)}Postcode` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}Postcode`, value))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {renderField(`${getFieldPrefix(applicantNumber)}MoveInDate`, 'Move In Date', formData[`${getFieldPrefix(applicantNumber)}MoveInDate` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}MoveInDate`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}CurrentAddressYears`, 'Years at Address', formData[`${getFieldPrefix(applicantNumber)}CurrentAddressYears` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}CurrentAddressYears`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}CurrentAddressMonths`, 'Months at Address', formData[`${getFieldPrefix(applicantNumber)}CurrentAddressMonths` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}CurrentAddressMonths`, value))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField(`${getFieldPrefix(applicantNumber)}CurrentResidencyStatus`, 'Current Residency Status', formData[`${getFieldPrefix(applicantNumber)}CurrentResidencyStatus` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}CurrentResidencyStatus`, value), 'select', ['Owner occupier with mortgage', 'Owner occupier without mortgage', 'Renting', 'Living with family'])}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Income Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Employment & Income - {getApplicantName(applicantNumber)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField(`${getFieldPrefix(applicantNumber)}EmploymentStatus`, 'Employment Status', formData[`${getFieldPrefix(applicantNumber)}EmploymentStatus` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}EmploymentStatus`, value), 'select', ['Employed', 'Self-employed', 'Retired', 'Student', 'Unemployed'])}
                        {renderField(`${getFieldPrefix(applicantNumber)}GrossBasicIncome`, 'Gross Basic Income', formData[`${getFieldPrefix(applicantNumber)}GrossBasicIncome` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}GrossBasicIncome`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}JobTitle`, 'Job Title', formData[`${getFieldPrefix(applicantNumber)}JobTitle` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}JobTitle`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}EmployerName`, 'Employer Name', formData[`${getFieldPrefix(applicantNumber)}EmployerName` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}EmployerName`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}EmploymentType`, 'Employment Type', formData[`${getFieldPrefix(applicantNumber)}EmploymentType` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}EmploymentType`, value), 'select', ['Permanent', 'Fixed Term', 'Temporary', 'Probationary'])}
                        {renderField(`${getFieldPrefix(applicantNumber)}ExpectedRetirementAge`, 'Expected Retirement Age', formData[`${getFieldPrefix(applicantNumber)}ExpectedRetirementAge` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}ExpectedRetirementAge`, value))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Commitments Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Commitments - {getApplicantName(applicantNumber)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField(`${getFieldPrefix(applicantNumber)}CommitmentType`, 'Commitment Type', formData[`${getFieldPrefix(applicantNumber)}CommitmentType` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}CommitmentType`, value), 'select', ['Credit card', 'Personal loan', 'Car loan', 'Store card', 'Other'])}
                        {renderField(`${getFieldPrefix(applicantNumber)}Provider`, 'Provider', formData[`${getFieldPrefix(applicantNumber)}Provider` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}Provider`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}MonthlyPayment`, 'Monthly Payment', formData[`${getFieldPrefix(applicantNumber)}MonthlyPayment` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}MonthlyPayment`, value))}
                        {renderField(`${getFieldPrefix(applicantNumber)}RemainingBalance`, 'Remaining Balance', formData[`${getFieldPrefix(applicantNumber)}RemainingBalance` as keyof UnifiedFormData], (value) => handleInputChange(`${getFieldPrefix(applicantNumber)}RemainingBalance`, value))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Review & Submit Tab */}
          <TabsContent value="review-submit" className="space-y-6">
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
          </TabsContent>
        </Tabs>
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