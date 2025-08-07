import React, { useState, useEffect } from 'react';
import { useEditMode } from '../contexts/EditModeContext';
import { useApplicantData } from '../contexts/ApplicantDataContext';
import { useAudit } from '../contexts/AuditContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { FieldComparisonModal } from './FieldComparisonModal';

export const EditablePersonalDetailsPage: React.FC = () => {
  const { isEditingEnabled, isEditMode, hasUnsavedChanges, hasSavedChanges, setIsEditMode, setHasUnsavedChanges, saveChanges, exitEditMode, storeOriginalState, restoreAllOriginalState } = useEditMode();
  const { addAuditEntry, auditLog, currentSessionId, startAuditSession, endAuditSession, cancelAuditSession } = useAudit();
  const { applicantData, updateApplicantData, getFormattedApplicantNames } = useApplicantData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [applicantJamesName, applicantJaneName] = getFormattedApplicantNames();
  
  // Add anchor functionality
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const fieldRefs = React.useRef<{ [key: string]: HTMLInputElement | HTMLButtonElement | null }>({});
  const sectionRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  const initialFormData = {
    // James Taylor - Eligibility
    jamesAge3Years: 'No',
    jamesDirectorShip: 'No',
    
    // James Taylor - Personal Details
    jamesTitle: 'Mr',
    jamesFirstName: 'James',
    jamesMiddleName: '',
    jamesLastName: 'Taylor',
    jamesNameChange: 'No',
    jamesDateOfBirthDay: '11',
    jamesDateOfBirthMonth: '11',
    jamesDateOfBirthYear: '1988',
    jamesNationality: 'UK Resident',
    
    // James Taylor's addresses
    jamesCurrentAddress: '12 Longwood Close',
    jamesAddressLine2: 'NEWCASTLE',
    jamesAddressLine3: 'Tyne and Wear',
    jamesPostcode: 'NE16 5QB',
    jamesCounty: 'NORTHUMBERLAND',
    jamesMovedInMonths: '6',
    jamesMovedInYears: '2015',
    jamesResidencyStatus: 'Owner occupier with mortgage',
    jamesOwnershipLength: 'More than 3 years',
    jamesSalePrice: '£1000000',
    jamesCurrentLender: 'Halifax',
    jamesOutstandingMortgage: '£500000',
    jamesPlansForProperty: 'Sell',
    jamesExpectedRemainingBalance: '£400000',
    
    // James Taylor's Income
    jamesEmploymentStatus: 'Employed',
    jamesBasicIncome: '£50000.00',
    jamesFrequencyGrossIncome: 'Yearly',
    jamesAnnualAmount: '£50,000.00',
    jamesMonthlyNetSalary: '£3200',
    jamesJobTitle: 'Accountant',
    jamesEmployerName: 'Self Employed',
    jamesEmploymentNature: 'Permanent',
    jamesStartDate: 'Self Employed',
    jamesExpectedRetirement: '70',
    jamesAdditionalIncome1: 'Bonus/commission',
    jamesAdditionalIncome1Amount: '£',
    jamesAdditionalIncome1Frequency: 'Yearly',
    
    // James Taylor's commitments
    jamesCommitmentType1: 'Credit card',
    jamesCommitmentProvider1: 'Tesco',
    jamesCommitmentBalance1: '£300.00',
    jamesCommitmentType2: 'Personal loan',
    jamesCommitmentProvider2: 'Santander Finance',
    jamesCommitmentBalance2: '£500.00',
    jamesRedemptionPenalty: 'No',
    
    // Jane Taylor - Personal Details
    janeTitle: 'Mrs',
    janeFirstName: 'Jane',
    janeMiddleName: '',
    janeLastName: 'Taylor',
    janeDateOfBirthDay: '15',
    janeDateOfBirthMonth: '08',
    janeDateOfBirthYear: '1990',
    janeNationality: 'UK Resident',
    
    // Jane Taylor's employment
    janeEmploymentStatus: 'Employed',
    janeJobTitle: 'Teacher',
    janeEmployerName: 'Newcastle Primary School',
    janeBasicIncome: '£35000.00',
    janeMonthlyNetSalary: '£2400'
  };

  const [formData, setFormData] = useState({
    ...initialFormData,
    ...applicantData
  });

  // Sync form data with applicant data context whenever name fields change
  useEffect(() => {
    const applicantFields = {
      jamesTitle: formData.jamesTitle,
      jamesFirstName: formData.jamesFirstName,
      jamesMiddleName: formData.jamesMiddleName,
      jamesLastName: formData.jamesLastName,
      janeTitle: formData.janeTitle,
      janeFirstName: formData.janeFirstName,
      janeMiddleName: formData.janeMiddleName,
      janeLastName: formData.janeLastName,
    };
    updateApplicantData(applicantFields);
  }, [formData.jamesTitle, formData.jamesFirstName, formData.jamesMiddleName, formData.jamesLastName, 
      formData.janeTitle, formData.janeFirstName, formData.janeMiddleName, formData.janeLastName, updateApplicantData]);
  const [comparisonModal, setComparisonModal] = useState({ open: false, fieldName: '' });

  // Store original state when entering edit mode
  React.useEffect(() => {
    if (isEditMode && !currentSessionId) {
      startAuditSession();
      Object.entries(formData).forEach(([key, value]) => {
        storeOriginalState(`formData.${key}`, value);
      });
    }
  }, [isEditMode, currentSessionId, storeOriginalState, startAuditSession]);

  // Focus on specific field and section when entering edit mode
  React.useEffect(() => {
    if (isEditMode && focusedField) {
      console.log('Focusing on field:', focusedField);
      
      setTimeout(() => {
        // First scroll to the section
        if (sectionRefs.current['james-section']) {
          console.log('Scrolling to james section');
          sectionRefs.current['james-section']?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Then focus on the specific field
        if (fieldRefs.current[focusedField]) {
          setTimeout(() => {
            console.log('Focusing on field element');
            fieldRefs.current[focusedField]?.focus();
          }, 500);
        }
      }, 100);
    }
  }, [isEditMode, focusedField]);

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

    window.addEventListener('editModeCancel', handleRestore);
    return () => {
      window.removeEventListener('editModeCancel', handleRestore);
    };
  }, [restoreAllOriginalState, cancelAuditSession]);

  const handleInputChange = (field: string, value: string, section: string = 'Personal Details') => {
    const oldValue = formData[field as keyof typeof formData];
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    console.log('Field changed:', { field, oldValue, value, section, currentSessionId });
    
    addAuditEntry(field, oldValue, value, section);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    saveChanges();
    endAuditSession();
    toast({
      title: "Changes saved",
      description: "Your personal details have been updated.",
    });
  };

  const handleFieldDoubleClick = (field: string) => {
    console.log('Double clicked field:', field);
    if (isEditingEnabled && !isEditMode) {
      setFocusedField(field);
      setIsEditMode(true);
      if (!currentSessionId) {
        startAuditSession();
        Object.entries(formData).forEach(([key, value]) => {
          storeOriginalState(`formData.${key}`, value);
        });
      }
    }
  };

  const handleFieldComparisonClick = (fieldName: string) => {
    setComparisonModal({ open: true, fieldName });
  };

  const isFieldEdited = (fieldName: string) => {
    return auditLog.some(entry => entry.field === fieldName);
  };

  const renderJamesTaylorForm = () => {
    if (isEditMode) {
      return (
        <div className="space-y-8" ref={(ref) => sectionRefs.current['james-section'] = ref}>
          <h2 className="text-[#165788] text-xl font-medium border-b border-gray-200 pb-3">{applicantJamesName}</h2>
          
          {/* Eligibility Section */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-[#165788] text-lg font-medium mb-4">Eligibility</h3>
            <div className="text-sm text-gray-600 mb-6">
              Is the applicant have if satisfied any of the following:
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-800 mb-2 block">Bankruptcy or insolvency</Label>
                <p className="text-xs text-gray-600 mb-3">
                  Had an insolvency order made that has not been satisfied
                </p>
                <RadioGroup 
                  value={formData.jamesAge3Years}
                  onValueChange={(value) => handleInputChange('jamesAge3Years', value, 'James Taylor Eligibility')}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="james-age-yes" />
                    <Label htmlFor="james-age-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="james-age-no" />
                    <Label htmlFor="james-age-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-800 mb-2 block">Directorship</Label>
                <p className="text-xs text-gray-600 mb-3">
                  Had or current has a director ship management plan<br/>
                  Had any partnership with active guarantees
                </p>
                <RadioGroup 
                  value={formData.jamesDirectorShip}
                  onValueChange={(value) => handleInputChange('jamesDirectorShip', value, 'James Taylor Eligibility')}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="james-director-yes" />
                    <Label htmlFor="james-director-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="james-director-no" />
                    <Label htmlFor="james-director-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h3 className="text-[#165788] text-lg font-medium mb-6">Personal details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="james-title" className="text-sm font-medium">Title</Label>
                <Select 
                  value={formData.jamesTitle}
                  onValueChange={(value) => handleInputChange('jamesTitle', value, 'James Taylor Personal Details')}
                >
                  <SelectTrigger ref={(ref) => fieldRefs.current['jamesTitle'] = ref}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Miss">Miss</SelectItem>
                    <SelectItem value="Ms">Ms</SelectItem>
                    <SelectItem value="Dr">Dr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <Label htmlFor="james-firstname" className="text-sm font-medium">First name</Label>
                <Input 
                  id="james-firstname"
                  ref={(ref) => fieldRefs.current['jamesFirstName'] = ref}
                  value={formData.jamesFirstName}
                  onChange={(e) => handleInputChange('jamesFirstName', e.target.value, 'James Taylor Personal Details')}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="james-middlename" className="text-sm font-medium">Middle name</Label>
                <Input 
                  id="james-middlename"
                  ref={(ref) => fieldRefs.current['jamesMiddleName'] = ref}
                  value={formData.jamesMiddleName}
                  onChange={(e) => handleInputChange('jamesMiddleName', e.target.value, 'James Taylor Personal Details')}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="james-lastname" className="text-sm font-medium">Last name</Label>
                <Input 
                  id="james-lastname"
                  ref={(ref) => fieldRefs.current['jamesLastName'] = ref}
                  value={formData.jamesLastName}
                  onChange={(e) => handleInputChange('jamesLastName', e.target.value, 'James Taylor Personal Details')}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-800 mb-3 block">Name change in the last 6 years?</Label>
              <RadioGroup 
                value={formData.jamesNameChange}
                onValueChange={(value) => handleInputChange('jamesNameChange', value, 'James Taylor Personal Details')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="james-namechange-yes" />
                  <Label htmlFor="james-namechange-yes" className="text-sm">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="james-namechange-no" />
                  <Label htmlFor="james-namechange-no" className="text-sm">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-800 mb-3 block">Date of birth</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="11"
                  className="w-16"
                  ref={(ref) => fieldRefs.current['jamesDateOfBirthDay'] = ref}
                  value={formData.jamesDateOfBirthDay}
                  onChange={(e) => handleInputChange('jamesDateOfBirthDay', e.target.value, 'James Taylor Personal Details')}
                />
                <Input 
                  placeholder="11"
                  className="w-16"
                  ref={(ref) => fieldRefs.current['jamesDateOfBirthMonth'] = ref}
                  value={formData.jamesDateOfBirthMonth}
                  onChange={(e) => handleInputChange('jamesDateOfBirthMonth', e.target.value, 'James Taylor Personal Details')}
                />
                <Input 
                  placeholder="1988"
                  className="w-20"
                  ref={(ref) => fieldRefs.current['jamesDateOfBirthYear'] = ref}
                  value={formData.jamesDateOfBirthYear}
                  onChange={(e) => handleInputChange('jamesDateOfBirthYear', e.target.value, 'James Taylor Personal Details')}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-800 mb-3 block">Nationality</Label>
              <RadioGroup 
                value={formData.jamesNationality}
                onValueChange={(value) => handleInputChange('jamesNationality', value, 'James Taylor Personal Details')}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="UK Resident" id="james-nat-uk" />
                  <Label htmlFor="james-nat-uk" className="text-sm">UK Resident</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EEA or Swiss National" id="james-nat-eea" />
                  <Label htmlFor="james-nat-eea" className="text-sm">EEA or Swiss National</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Non EEA" id="james-nat-non" />
                  <Label htmlFor="james-nat-non" className="text-sm">Non EEA</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* James Taylor's addresses */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h3 className="text-[#165788] text-lg font-medium mb-6">{applicantJamesName}'s addresses</h3>
            <p className="text-sm text-gray-600 mb-6">
              Please enter the applicant's address history. Start with current address.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Current address</Label>
                <Input 
                  value={formData.jamesCurrentAddress}
                  onChange={(e) => handleInputChange('jamesCurrentAddress', e.target.value, 'James Taylor Address')}
                  className="w-full mt-1"
                  placeholder="12 Longwood Close"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input 
                    value={formData.jamesAddressLine2}
                    onChange={(e) => handleInputChange('jamesAddressLine2', e.target.value, 'James Taylor Address')}
                    placeholder="NEWCASTLE"
                  />
                </div>
                <div>
                  <Input 
                    value={formData.jamesAddressLine3}
                    onChange={(e) => handleInputChange('jamesAddressLine3', e.target.value, 'James Taylor Address')}
                    placeholder="Tyne and Wear"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input 
                    value={formData.jamesPostcode}
                    onChange={(e) => handleInputChange('jamesPostcode', e.target.value, 'James Taylor Address')}
                    placeholder="NE16 5QB"
                  />
                </div>
                <div>
                  <Input 
                    value={formData.jamesCounty}
                    onChange={(e) => handleInputChange('jamesCounty', e.target.value, 'James Taylor Address')}
                    placeholder="NORTHUMBERLAND"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">When did the applicant move to this property?</Label>
                <div className="flex gap-2">
                  <Input 
                    value={formData.jamesMovedInMonths}
                    onChange={(e) => handleInputChange('jamesMovedInMonths', e.target.value, 'James Taylor Address')}
                    placeholder="Months"
                    className="w-24"
                  />
                  <Input 
                    value={formData.jamesMovedInYears}
                    onChange={(e) => handleInputChange('jamesMovedInYears', e.target.value, 'James Taylor Address')}
                    placeholder="2015"
                    className="w-24"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Current residency status</Label>
                <Select 
                  value={formData.jamesResidencyStatus}
                  onValueChange={(value) => handleInputChange('jamesResidencyStatus', value, 'James Taylor Address')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner occupier with mortgage">Owner occupier with mortgage</SelectItem>
                    <SelectItem value="Owner occupier without mortgage">Owner occupier without mortgage</SelectItem>
                    <SelectItem value="Tenant">Tenant</SelectItem>
                    <SelectItem value="Living with parents">Living with parents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">If not owner occupier</Label>
                <Select 
                  value={formData.jamesOwnershipLength}
                  onValueChange={(value) => handleInputChange('jamesOwnershipLength', value, 'James Taylor Address')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="More than 3 years">More than 3 years</SelectItem>
                    <SelectItem value="Less than 3 years">Less than 3 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm">Current market value</Label>
                  <Input 
                    value={formData.jamesSalePrice}
                    onChange={(e) => handleInputChange('jamesSalePrice', e.target.value, 'James Taylor Address')}
                    placeholder="£1000000"
                  />
                </div>
                <div>
                  <Label className="text-sm">Current outstanding mortgage</Label>
                  <Input 
                    value={formData.jamesOutstandingMortgage}
                    onChange={(e) => handleInputChange('jamesOutstandingMortgage', e.target.value, 'James Taylor Address')}
                    placeholder="£500000"
                  />
                </div>
                <div>
                  <Label className="text-sm">Remaining outstanding balance</Label>
                  <Input 
                    value={formData.jamesExpectedRemainingBalance}
                    onChange={(e) => handleInputChange('jamesExpectedRemainingBalance', e.target.value, 'James Taylor Address')}
                    placeholder="£400000"
                  />
                </div>
                <div>
                  <Label className="text-sm">Sale price</Label>
                  <Input 
                    value={formData.jamesExpectedRemainingBalance}
                    onChange={(e) => handleInputChange('jamesExpectedRemainingBalance', e.target.value, 'James Taylor Address')}
                    placeholder="£400000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* James Taylor's Income */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h3 className="text-[#165788] text-lg font-medium mb-6">{applicantJamesName}'s Income</h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Employment Status</Label>
                <Select 
                  value={formData.jamesEmploymentStatus}
                  onValueChange={(value) => handleInputChange('jamesEmploymentStatus', value, 'James Taylor Income')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Self Employed">Self Employed</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Basic Income</Label>
                <Input 
                  value={formData.jamesBasicIncome}
                  onChange={(e) => handleInputChange('jamesBasicIncome', e.target.value, 'James Taylor Income')}
                  placeholder="£50000.00"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Frequency of gross basic income</Label>
                <Select 
                  value={formData.jamesFrequencyGrossIncome}
                  onValueChange={(value) => handleInputChange('jamesFrequencyGrossIncome', value, 'James Taylor Income')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Annual amount</Label>
                <Input 
                  value={formData.jamesAnnualAmount}
                  onChange={(e) => handleInputChange('jamesAnnualAmount', e.target.value, 'James Taylor Income')}
                  placeholder="£50,000.00"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Monthly net salary (after tax, NI, pension, childcare expenses, child tax employment and cap guarantee payments)</Label>
                <p className="text-xs text-gray-600 mb-2">
                  Enter any monthly payment amount per recipient
                </p>
                <Input 
                  value={formData.jamesMonthlyNetSalary}
                  onChange={(e) => handleInputChange('jamesMonthlyNetSalary', e.target.value, 'James Taylor Income')}
                  placeholder="£3200"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Job title</Label>
                <Input 
                  value={formData.jamesJobTitle}
                  onChange={(e) => handleInputChange('jamesJobTitle', e.target.value, 'James Taylor Income')}
                  placeholder="Accountant"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Employer name</Label>
                <Input 
                  value={formData.jamesEmployerName}
                  onChange={(e) => handleInputChange('jamesEmployerName', e.target.value, 'James Taylor Income')}
                  placeholder="Self Employed"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Employment nature</Label>
                <RadioGroup 
                  value={formData.jamesEmploymentNature}
                  onValueChange={(value) => handleInputChange('jamesEmploymentNature', value, 'James Taylor Income')}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Permanent" id="james-emp-permanent" />
                    <Label htmlFor="james-emp-permanent" className="text-sm">Permanent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Contract" id="james-emp-contract" />
                    <Label htmlFor="james-emp-contract" className="text-sm">Contract</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Start date of previous employment</Label>
                <Input 
                  value={formData.jamesStartDate}
                  onChange={(e) => handleInputChange('jamesStartDate', e.target.value, 'James Taylor Income')}
                  placeholder="Self Employed"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Expected retirement age</Label>
                <Input 
                  value={formData.jamesExpectedRetirement}
                  onChange={(e) => handleInputChange('jamesExpectedRetirement', e.target.value, 'James Taylor Income')}
                  placeholder="70"
                  className="w-20"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-4 block">Please add all additional income sources relevant to this application:</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label className="text-xs">Income amount</Label>
                    <Input 
                      value={formData.jamesAdditionalIncome1Amount}
                      onChange={(e) => handleInputChange('jamesAdditionalIncome1Amount', e.target.value, 'James Taylor Income')}
                      placeholder="£"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Amount</Label>
                    <Input placeholder="£" />
                  </div>
                  <div>
                    <Label className="text-xs">Frequency</Label>
                    <Select 
                      value={formData.jamesAdditionalIncome1Frequency}
                      onValueChange={(value) => handleInputChange('jamesAdditionalIncome1Frequency', value, 'James Taylor Income')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button variant="outline" className="text-blue-600 border-blue-600">
                  Add an Income source
                </Button>
              </div>
            </div>
          </div>

          {/* James Taylor's commitments */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h3 className="text-[#165788] text-lg font-medium mb-6">{applicantJamesName}'s commitments</h3>
            <p className="text-sm text-gray-600 mb-6">
              Please add all relevant commitments relating to this applicant, where it may will be included in affordability calculation, 
              including but not limited to the following: hire purchase, finance, regular payments, loans, credit cards, store cards, overdrafts, child maintenance.
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Commitment type</Label>
                  <Select 
                    value={formData.jamesCommitmentType1}
                    onValueChange={(value) => handleInputChange('jamesCommitmentType1', value, 'James Taylor Commitments')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit card">Credit card</SelectItem>
                      <SelectItem value="Personal loan">Personal loan</SelectItem>
                      <SelectItem value="Store card">Store card</SelectItem>
                      <SelectItem value="Overdraft">Overdraft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Provider</Label>
                  <Input 
                    value={formData.jamesCommitmentProvider1}
                    onChange={(e) => handleInputChange('jamesCommitmentProvider1', e.target.value, 'James Taylor Commitments')}
                    placeholder="Tesco"
                  />
                </div>
                <div>
                  <Label className="text-xs">Remaining balance</Label>
                  <Input 
                    value={formData.jamesCommitmentBalance1}
                    onChange={(e) => handleInputChange('jamesCommitmentBalance1', e.target.value, 'James Taylor Commitments')}
                    placeholder="£300.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Select 
                    value={formData.jamesCommitmentType2}
                    onValueChange={(value) => handleInputChange('jamesCommitmentType2', value, 'James Taylor Commitments')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit card">Credit card</SelectItem>
                      <SelectItem value="Personal loan">Personal loan</SelectItem>
                      <SelectItem value="Store card">Store card</SelectItem>
                      <SelectItem value="Overdraft">Overdraft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input 
                    value={formData.jamesCommitmentProvider2}
                    onChange={(e) => handleInputChange('jamesCommitmentProvider2', e.target.value, 'James Taylor Commitments')}
                    placeholder="Santander Finance"
                  />
                </div>
                <div>
                  <Input 
                    value={formData.jamesCommitmentBalance2}
                    onChange={(e) => handleInputChange('jamesCommitmentBalance2', e.target.value, 'James Taylor Commitments')}
                    placeholder="£500.00"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <input type="checkbox" id="james-redemption" className="h-4 w-4" />
                <Label htmlFor="james-redemption" className="text-sm">
                  Fund on completion (with some form payment)
                </Label>
              </div>
              
              <Button variant="outline" className="text-blue-600 border-blue-600 mt-4">
                Add a commitment
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Display view when not editing - restore original summary format
    return (
      <div className="space-y-6">
        <h3 className="text-[#165788] text-lg font-medium">{applicantJamesName}</h3>
        
        <div className="w-full">
          {[
            { label: 'Name change in last 6 years', field: 'jamesNameChange', value: formData.jamesNameChange },
            { label: 'Date of birth', field: 'jamesDateOfBirthDay', value: `${formData.jamesDateOfBirthDay}/${formData.jamesDateOfBirthMonth}/${formData.jamesDateOfBirthYear}` },
            { label: 'Nationality', field: 'jamesNationality', value: formData.jamesNationality },
            { label: 'Current address', field: 'jamesCurrentAddress', value: formData.jamesCurrentAddress },
            { label: 'Postcode', field: 'jamesPostcode', value: formData.jamesPostcode },
            { label: 'Employment status', field: 'jamesEmploymentStatus', value: formData.jamesEmploymentStatus },
            { label: 'Job title', field: 'jamesJobTitle', value: formData.jamesJobTitle },
            { label: 'Employer name', field: 'jamesEmployerName', value: formData.jamesEmployerName },
            { label: 'Basic income', field: 'jamesBasicIncome', value: formData.jamesBasicIncome },
            { label: 'Monthly net salary', field: 'jamesMonthlyNetSalary', value: formData.jamesMonthlyNetSalary }
          ].map((item, index) => {
            const edited = isFieldEdited(item.field);
            const fieldClasses = isEditingEnabled 
              ? `flex w-full gap-4 text-base flex-wrap p-1 cursor-pointer hover:bg-gray-50 ${index % 2 === 0 ? 'bg-[#F7F8FA]' : ''}`
              : `flex w-full gap-4 text-base flex-wrap p-1 ${index % 2 === 0 ? 'bg-[#F7F8FA]' : ''}`;

            return (
              <div 
                key={item.field} 
                className={fieldClasses}
                onDoubleClick={() => handleFieldDoubleClick(item.field)}
                title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
              >
                <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
                  {item.label}
                </div>
                <div className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2">
                  {item.value}
                  {edited && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            onClick={() => handleFieldComparisonClick(item.field)}
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
          })}
        </div>
        
        <h3 className="text-[#165788] text-lg font-medium">{applicantJaneName}</h3>
        
        <div className="w-full">
          {[
            { label: 'Date of birth', field: 'janeDateOfBirthDay', value: `${formData.janeDateOfBirthDay}/${formData.janeDateOfBirthMonth}/${formData.janeDateOfBirthYear}` },
            { label: 'Nationality', field: 'janeNationality', value: formData.janeNationality },
            { label: 'Employment status', field: 'janeEmploymentStatus', value: formData.janeEmploymentStatus },
            { label: 'Job title', field: 'janeJobTitle', value: formData.janeJobTitle },
            { label: 'Employer name', field: 'janeEmployerName', value: formData.janeEmployerName },
            { label: 'Basic income', field: 'janeBasicIncome', value: formData.janeBasicIncome },
            { label: 'Monthly net salary', field: 'janeMonthlyNetSalary', value: formData.janeMonthlyNetSalary }
          ].map((item, index) => {
            const edited = isFieldEdited(item.field);
            const fieldClasses = isEditingEnabled 
              ? `flex w-full gap-4 text-base flex-wrap p-1 cursor-pointer hover:bg-gray-50 ${index % 2 === 0 ? 'bg-[#F7F8FA]' : ''}`
              : `flex w-full gap-4 text-base flex-wrap p-1 ${index % 2 === 0 ? 'bg-[#F7F8FA]' : ''}`;

            return (
              <div 
                key={item.field} 
                className={fieldClasses}
                onDoubleClick={() => handleFieldDoubleClick(item.field)}
                title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
              >
                <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
                  {item.label}
                </div>
                <div className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2">
                  {item.value}
                  {edited && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            onClick={() => handleFieldComparisonClick(item.field)}
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
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="p-8 max-md:px-5">
        <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] bg-white p-6 rounded">
          <div className="mb-8">
            <h1 className="text-[#165788] text-[22px] font-medium">
              Personal Details
            </h1>
          </div>
        
          <div className="space-y-8">
            {/* James Taylor Section */}
            <section className="w-full">
              {renderJamesTaylorForm()}
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
    </>
  );
};