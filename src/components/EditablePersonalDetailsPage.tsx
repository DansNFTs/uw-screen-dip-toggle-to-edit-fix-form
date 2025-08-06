import React, { useState } from 'react';
import { useEditMode } from '../contexts/EditModeContext';
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
import { EditableField } from './EditableField';

export const EditablePersonalDetailsPage: React.FC = () => {
  const { isEditingEnabled, isEditMode, hasUnsavedChanges, hasSavedChanges, setIsEditMode, setHasUnsavedChanges, saveChanges, exitEditMode, storeOriginalState, restoreAllOriginalState } = useEditMode();
  const { addAuditEntry, auditLog, currentSessionId, startAuditSession, endAuditSession, cancelAuditSession } = useAudit();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const initialFormData = {
    // James Taylor - Eligibility
    jamesAgeEligibility: 'No',
    jamesManagementPlan: 'No',
    
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
    
    // James Taylor - Address
    jamesCurrentAddress: '12 Longwood Close',
    jamesAddressLine2: 'NEWCASTLE UPON TYNE',
    jamesAddressLine3: 'Tyne and Wear',
    jamesPostcode: 'NE16 5QB',
    jamesMovedInMonths: '6',
    jamesMovedInYears: '2015',
    jamesResidencyStatus: 'Owner occupier with mortgage',
    jamesSalePrice: '£350,000',
    jamesCurrentLender: 'Halifax',
    jamesOutstandingMortgage: '£280,000',
    jamesPlansForProperty: 'Continue to live in it',
    jamesExpectedRemainingBalance: '£250,000',
    
    // James Taylor - Income
    jamesEmploymentStatus: 'Employed',
    jamesBasicIncome: '£50000.00',
    jamesFrequencyGrossIncome: 'Yearly',
    jamesAnnualAmount: '£50,000.00',
    jamesMonthlyNetSalary: '£3200',
    jamesJobTitle: 'Manager',
    jamesEmployerName: 'NHS',
    jamesEmploymentNature: 'Permanent',
    jamesStartDate: '9/2020',
    jamesExpectedRetirement: '70',
    
    // Jane Taylor - Eligibility  
    janeAgeEligibility: 'No',
    janeManagementPlan: 'No',
    
    // Jane Taylor - Personal Details
    janeTitle: 'Mrs',
    janeFirstName: 'Jane',
    janeMiddleName: '',
    janeLastName: 'Taylor',
    janeNameChange: 'No',
    janeDateOfBirthDay: '04',
    janeDateOfBirthMonth: '04', 
    janeDateOfBirthYear: '1990',
    janeNationality: 'UK Resident',
    
    // Jane Taylor - Address
    janeCurrentAddress: '12 Longwood Close',
    janeAddressLine2: 'NEWCASTLE UPON TYNE',
    janeAddressLine3: 'Tyne and Wear',
    janePostcode: 'NE16 5QB',
    janeMovedInMonths: '4',
    janeMovedInYears: '2015',
    janeResidencyStatus: 'Owner occupier with mortgage',
    janeSalePrice: '£350,000',
    janeCurrentLender: 'Halifax',
    janeOutstandingMortgage: '£280,000',
    janePlansForProperty: 'Continue to live in it',
    janeExpectedRemainingBalance: '£250,000',
    
    // Jane Taylor - Income
    janeEmploymentStatus: 'Employed',
    janeBasicIncome: '£45000.00',
    janeFrequencyGrossIncome: 'Yearly',
    janeAnnualAmount: '£45,000.00',
    janeMonthlyNetSalary: '£2800',
    janeJobTitle: 'Manager',
    janeEmployerName: 'NHS',
    janeEmploymentNature: 'Permanent',
    janeStartDate: '9/2020',
    janeExpectedRetirement: '70'
  };

  const [formData, setFormData] = useState(initialFormData);
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
    if (isEditingEnabled && !isEditMode) {
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

  // Render form sections based on edit mode
  const renderApplicantSection = (
    applicantName: string, 
    prefix: string,
    title: string
  ) => {
    if (isEditMode) {
      // Form view when editing
      return (
        <div className="space-y-6">
          <h2 className="text-[#165788] text-lg font-medium">{applicantName}</h2>
          
          {/* Eligibility Section */}
          <EditableField isEdited={isFieldEdited(`${prefix}AgeEligibility`) || isFieldEdited(`${prefix}ManagementPlan`)}>
            <div className="space-y-4">
              <h3 className="text-[#165788] text-base font-medium">Eligibility</h3>
              <div className="text-sm text-gray-600 mb-4">
                Is the {prefix === 'james' ? 'first' : 'second'} applicant satisfied any of the following:
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-700">Bankruptcy which has not been satisfied for at least 3 years?</Label>
                  <RadioGroup 
                    value={formData[`${prefix}AgeEligibility` as keyof typeof formData]}
                    onValueChange={(value) => handleInputChange(`${prefix}AgeEligibility`, value, `${applicantName} Eligibility`)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id={`${prefix}-age-yes`} />
                      <Label htmlFor={`${prefix}-age-yes`}>Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id={`${prefix}-age-no`} />
                      <Label htmlFor={`${prefix}-age-no`}>No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-700">Had an active debt management plan</Label>
                  <RadioGroup 
                    value={formData[`${prefix}ManagementPlan` as keyof typeof formData]}
                    onValueChange={(value) => handleInputChange(`${prefix}ManagementPlan`, value, `${applicantName} Eligibility`)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id={`${prefix}-plan-yes`} />
                      <Label htmlFor={`${prefix}-plan-yes`}>Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id={`${prefix}-plan-no`} />
                      <Label htmlFor={`${prefix}-plan-no`}>No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </EditableField>

          {/* Personal Details Section */}
          <EditableField isEdited={isFieldEdited(`${prefix}Title`) || isFieldEdited(`${prefix}FirstName`) || isFieldEdited(`${prefix}LastName`)}>
            <div className="space-y-4">
              <h3 className="text-[#165788] text-base font-medium">Personal details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${prefix}-title`}>Title</Label>
                  <Select 
                    value={formData[`${prefix}Title` as keyof typeof formData]}
                    onValueChange={(value) => handleInputChange(`${prefix}Title`, value, `${applicantName} Personal Details`)}
                  >
                    <SelectTrigger>
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
              
              <div>
                <Label htmlFor={`${prefix}-firstname`}>First name</Label>
                <Input 
                  id={`${prefix}-firstname`}
                  value={formData[`${prefix}FirstName` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}FirstName`, e.target.value, `${applicantName} Personal Details`)}
                />
              </div>
              
              <div>
                <Label htmlFor={`${prefix}-middlename`}>Middle name</Label>
                <Input 
                  id={`${prefix}-middlename`}
                  value={formData[`${prefix}MiddleName` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}MiddleName`, e.target.value, `${applicantName} Personal Details`)}
                />
              </div>
              
              <div>
                <Label htmlFor={`${prefix}-lastname`}>Last name</Label>
                <Input 
                  id={`${prefix}-lastname`}
                  value={formData[`${prefix}LastName` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}LastName`, e.target.value, `${applicantName} Personal Details`)}
                />
              </div>
              
              <div>
                <Label className="text-sm text-gray-700">Name change in the last 6 years?</Label>
                <RadioGroup 
                  value={formData[`${prefix}NameChange` as keyof typeof formData]}
                  onValueChange={(value) => handleInputChange(`${prefix}NameChange`, value, `${applicantName} Personal Details`)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id={`${prefix}-namechange-yes`} />
                    <Label htmlFor={`${prefix}-namechange-yes`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id={`${prefix}-namechange-no`} />
                    <Label htmlFor={`${prefix}-namechange-no`}>No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Date of birth</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    placeholder="DD"
                    className="w-16"
                    value={formData[`${prefix}DateOfBirthDay` as keyof typeof formData]}
                    onChange={(e) => handleInputChange(`${prefix}DateOfBirthDay`, e.target.value, `${applicantName} Personal Details`)}
                  />
                  <Input 
                    placeholder="MM"
                    className="w-16"
                    value={formData[`${prefix}DateOfBirthMonth` as keyof typeof formData]}
                    onChange={(e) => handleInputChange(`${prefix}DateOfBirthMonth`, e.target.value, `${applicantName} Personal Details`)}
                  />
                  <Input 
                    placeholder="YYYY"
                    className="w-20"
                    value={formData[`${prefix}DateOfBirthYear` as keyof typeof formData]}
                    onChange={(e) => handleInputChange(`${prefix}DateOfBirthYear`, e.target.value, `${applicantName} Personal Details`)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-700">Nationality</Label>
                <RadioGroup 
                  value={formData[`${prefix}Nationality` as keyof typeof formData]}
                  onValueChange={(value) => handleInputChange(`${prefix}Nationality`, value, `${applicantName} Personal Details`)}
                  className="space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UK Resident" id={`${prefix}-nat-uk`} />
                    <Label htmlFor={`${prefix}-nat-uk`}>UK Resident</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="EEA or Swiss National" id={`${prefix}-nat-eea`} />
                    <Label htmlFor={`${prefix}-nat-eea`}>EEA or Swiss National</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Non EEA" id={`${prefix}-nat-non`} />
                    <Label htmlFor={`${prefix}-nat-non`}>Non EEA</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </EditableField>

          {/* Address Section */}
          <EditableField isEdited={isFieldEdited(`${prefix}CurrentAddress`) || isFieldEdited(`${prefix}Postcode`)}>
            <div className="space-y-4">
              <h3 className="text-[#165788] text-base font-medium">Address</h3>
              
              <div>
                <Label htmlFor={`${prefix}-address`}>Current address</Label>
                <Input 
                  id={`${prefix}-address`}
                  value={formData[`${prefix}CurrentAddress` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}CurrentAddress`, e.target.value, `${applicantName} Address`)}
                />
              </div>
              
              <div>
                <Label htmlFor={`${prefix}-address2`}>Address line 2</Label>
                <Input 
                  id={`${prefix}-address2`}
                  value={formData[`${prefix}AddressLine2` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}AddressLine2`, e.target.value, `${applicantName} Address`)}
                />
              </div>
              
              <div>
                <Label htmlFor={`${prefix}-address3`}>Address line 3</Label>
                <Input 
                  id={`${prefix}-address3`}
                  value={formData[`${prefix}AddressLine3` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}AddressLine3`, e.target.value, `${applicantName} Address`)}
                />
              </div>
              
              <div>
                <Label htmlFor={`${prefix}-postcode`}>Postcode</Label>
                <Input 
                  id={`${prefix}-postcode`}
                  value={formData[`${prefix}Postcode` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}Postcode`, e.target.value, `${applicantName} Address`)}
                />
              </div>
              
              <div>
                <Label>When did the applicant move into the property?</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    placeholder="Months"
                    className="w-24"
                    value={formData[`${prefix}MovedInMonths` as keyof typeof formData]}
                    onChange={(e) => handleInputChange(`${prefix}MovedInMonths`, e.target.value, `${applicantName} Address`)}
                  />
                  <span className="self-center text-gray-500">/</span>
                  <Input 
                    placeholder="Year"
                    className="w-24"
                    value={formData[`${prefix}MovedInYears` as keyof typeof formData]}
                    onChange={(e) => handleInputChange(`${prefix}MovedInYears`, e.target.value, `${applicantName} Address`)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`${prefix}-residency`}>Current residency status</Label>
                <Select 
                  value={formData[`${prefix}ResidencyStatus` as keyof typeof formData]}
                  onValueChange={(value) => handleInputChange(`${prefix}ResidencyStatus`, value, `${applicantName} Address`)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner occupier with mortgage">Owner occupier with mortgage</SelectItem>
                    <SelectItem value="Owner occupier without mortgage">Owner occupier without mortgage</SelectItem>
                    <SelectItem value="Tenant">Tenant</SelectItem>
                    <SelectItem value="Living with family">Living with family</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </EditableField>

          {/* Property Details Section */}
          <EditableField isEdited={isFieldEdited(`${prefix}SalePrice`) || isFieldEdited(`${prefix}CurrentLender`)}>
            <div className="space-y-4">
              <h3 className="text-[#165788] text-base font-medium">Property Details</h3>
              
              <div>
                <Label htmlFor={`${prefix}-saleprice`}>Sale price</Label>
                <Input 
                  id={`${prefix}-saleprice`}
                  value={formData[`${prefix}SalePrice` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}SalePrice`, e.target.value, `${applicantName} Property`)}
                />
              </div>
              
              <div>
                <Label htmlFor={`${prefix}-lender`}>Current lender</Label>
                <Input 
                  id={`${prefix}-lender`}
                  value={formData[`${prefix}CurrentLender` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}CurrentLender`, e.target.value, `${applicantName} Property`)}
                />
              </div>
              
              <div>
                <Label htmlFor={`${prefix}-outstanding`}>Outstanding mortgage balance</Label>
                <Input 
                  id={`${prefix}-outstanding`}
                  value={formData[`${prefix}OutstandingMortgage` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}OutstandingMortgage`, e.target.value, `${applicantName} Property`)}
                />
              </div>
              
              <div>
                <Label htmlFor={`${prefix}-plans`}>Plans for property</Label>
                <Select 
                  value={formData[`${prefix}PlansForProperty` as keyof typeof formData]}
                  onValueChange={(value) => handleInputChange(`${prefix}PlansForProperty`, value, `${applicantName} Property`)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Continue to live in it">Continue to live in it</SelectItem>
                    <SelectItem value="Sell it">Sell it</SelectItem>
                    <SelectItem value="Rent it out">Rent it out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`${prefix}-remaining`}>Expected remaining mortgage balance</Label>
                <Input 
                  id={`${prefix}-remaining`}
                  value={formData[`${prefix}ExpectedRemainingBalance` as keyof typeof formData]}
                  onChange={(e) => handleInputChange(`${prefix}ExpectedRemainingBalance`, e.target.value, `${applicantName} Property`)}
                />
              </div>
            </div>
          </EditableField>
        </div>
      );
    }

    // Display view when not editing
    return (
      <div className="space-y-6">
        <h3 className="text-[#165788] text-lg font-medium">{applicantName}</h3>
        
        <div className="w-full">
          <div className={`flex w-full gap-4 text-base flex-wrap p-1 bg-[#F7F8FA]`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              Name change in last 6 years
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}NameChange`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}NameChange` as keyof typeof formData]}
              {isFieldEdited(`${prefix}NameChange`) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}NameChange`)}
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
          
          <div className={`flex w-full gap-4 text-base flex-wrap p-1`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              D.O.B - Age
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}DateOfBirthDay`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}DateOfBirthDay` as keyof typeof formData]}/{formData[`${prefix}DateOfBirthMonth` as keyof typeof formData]}/{formData[`${prefix}DateOfBirthYear` as keyof typeof formData]}
              {(isFieldEdited(`${prefix}DateOfBirthDay`) || isFieldEdited(`${prefix}DateOfBirthMonth`) || isFieldEdited(`${prefix}DateOfBirthYear`)) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}DateOfBirthDay`)}
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
          
          <div className={`flex w-full gap-4 text-base flex-wrap p-1 bg-[#F7F8FA]`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              Current address
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}CurrentAddress`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}CurrentAddress` as keyof typeof formData]} {formData[`${prefix}AddressLine2` as keyof typeof formData]} {formData[`${prefix}AddressLine3` as keyof typeof formData]}
              {(isFieldEdited(`${prefix}CurrentAddress`) || isFieldEdited(`${prefix}AddressLine2`) || isFieldEdited(`${prefix}AddressLine3`)) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}CurrentAddress`)}
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
          
          <div className={`flex w-full gap-4 text-base flex-wrap p-1`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              Postcode
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}Postcode`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}Postcode` as keyof typeof formData]}
              {isFieldEdited(`${prefix}Postcode`) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}Postcode`)}
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
          
          <div className={`flex w-full gap-4 text-base flex-wrap p-1 bg-[#F7F8FA]`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              When did the applicant move into the property
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}MovedInMonths`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}MovedInMonths` as keyof typeof formData]}/{formData[`${prefix}MovedInYears` as keyof typeof formData]}
              {(isFieldEdited(`${prefix}MovedInMonths`) || isFieldEdited(`${prefix}MovedInYears`)) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}MovedInMonths`)}
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
          
          <div className={`flex w-full gap-4 text-base flex-wrap p-1`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              Sale price
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}SalePrice`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}SalePrice` as keyof typeof formData]}
              {isFieldEdited(`${prefix}SalePrice`) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}SalePrice`)}
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
          
          <div className={`flex w-full gap-4 text-base flex-wrap p-1 bg-[#F7F8FA]`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              Current residency status
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}ResidencyStatus`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}ResidencyStatus` as keyof typeof formData]}
              {isFieldEdited(`${prefix}ResidencyStatus`) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}ResidencyStatus`)}
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
          
          <div className={`flex w-full gap-4 text-base flex-wrap p-1`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              Current lender
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}CurrentLender`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}CurrentLender` as keyof typeof formData]}
              {isFieldEdited(`${prefix}CurrentLender`) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}CurrentLender`)}
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
          
          <div className={`flex w-full gap-4 text-base flex-wrap p-1 bg-[#F7F8FA]`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              Outstanding mortgage balance
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}OutstandingMortgage`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}OutstandingMortgage` as keyof typeof formData]}
              {isFieldEdited(`${prefix}OutstandingMortgage`) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}OutstandingMortgage`)}
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
          
          <div className={`flex w-full gap-4 text-base flex-wrap p-1`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              Plans for property
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}PlansForProperty`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}PlansForProperty` as keyof typeof formData]}
              {isFieldEdited(`${prefix}PlansForProperty`) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}PlansForProperty`)}
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
          
          <div className={`flex w-full gap-4 text-base flex-wrap p-1 bg-[#F7F8FA]`}>
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              Expected remaining mortgage balance
            </div>
            <div 
              className="text-black font-medium flex-1 shrink basis-[0%] flex items-center gap-2 cursor-pointer hover:text-blue-600"
              onDoubleClick={() => handleFieldDoubleClick(`${prefix}ExpectedRemainingBalance`)}
              title={isEditingEnabled && !isEditMode ? "Double-click to edit this field" : ""}
            >
              {formData[`${prefix}ExpectedRemainingBalance` as keyof typeof formData]}
              {isFieldEdited(`${prefix}ExpectedRemainingBalance`) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleFieldComparisonClick(`${prefix}ExpectedRemainingBalance`)}
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
              {renderApplicantSection("James Taylor", "james", "Mr")}
            </section>

            {/* Jane Taylor Section */}
            <section className="w-full">
              {renderApplicantSection("Jane Taylor", "jane", "Mrs")}
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