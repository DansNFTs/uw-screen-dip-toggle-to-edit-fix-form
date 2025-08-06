
import React, { useState } from 'react';
import { useEditMode } from '../contexts/EditModeContext';
import { useAudit } from '../contexts/AuditContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export const SummaryPage: React.FC = () => {
  const { isEditMode, hasUnsavedChanges, hasSavedChanges, toggleEditMode, setHasUnsavedChanges, saveChanges, exitEditMode } = useEditMode();
  const { addAuditEntry } = useAudit();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Loan details
    loanAmount: '£175,000',
    depositAmount: '£75,000',
    sourceOfDeposit: 'Own savings',
    valueOfApplicantShare: '100.00%',
    totalPurchasePriceFullMarketValue: '£250,000',
    ltv: '70.00%',
    term: '25 years',
    repaymentType: 'Repayment',
    outstandingMortgageValue: '£56,000',
    newMortgageExceedsCurrentBalance: 'No',

    // Property details
    region: 'North',
    address: '',
    postCode: '',

    // Applicant 1 details
    applicant1Name: 'Mr James Taylor',
    applicant1ID: 'Check',
    applicant1Residency: 'Check',
    applicant1DOB: '11/11/1988 - 36yrs',
    applicant1RetirementAge: '70',
    applicant1AgeAtEndOfTerm: '61 years',
    applicant1EmploymentStatus: 'Employed',
    applicant1BasicIncome: '£52,000',

    // Applicant 2 details
    applicant2Name: 'Mrs Jane Taylor',
    applicant2ID: 'Check',
    applicant2Residency: 'Check',
    applicant2DOB: '04/04/1990 - 35yrs',
    applicant2RetirementAge: '70',
    applicant2AgeAtEndOfTerm: '60 years',
    applicant2EmploymentStatus: 'Employed',
    applicant2BasicIncome: '£50,000',

    // Credit information
    creditScore: '1090',
    customerIndebtednessScore: '-1',
    caisBalance: '£-1.00',
    caisWorstCurrentStatus: 'T',
    caisWorstHistoricalStatus: 'T',
    publicInformationTotal: '£1.00',

    // Affordability
    affordabilityScore: '5',
    basedOnDetails: '£237,500.00',
    freeDisposableIncome: '£4,295.14',
    mortgageSubUnder: '£1,220.17'
  });

  const handleInputChange = (field: string, value: string, section: string = 'Summary') => {
    const oldValue = formData[field as keyof typeof formData];
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    addAuditEntry(field, oldValue, value, section);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    saveChanges();
    toast({
      title: "Changes saved",
      description: "Summary information has been updated and will be reflected across all pages.",
    });
  };

  const getButtonText = () => {
    if (!isEditMode) return "Edit";
    if (hasSavedChanges) return "Exit Edit Mode";
    return "Cancel Edit";
  };

  const getButtonVariant = () => {
    if (!isEditMode) return "default";
    if (hasSavedChanges) return "outline";
    return "destructive";
  };

  const handleMainButtonClick = () => {
    if (hasSavedChanges) {
      exitEditMode();
    } else {
      toggleEditMode();
    }
  };

  const renderField = (label: string, field: string, value: string, type: 'input' | 'select' = 'input', options?: string[], index: number = 0) => {
    const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
    
    if (isEditMode) {
      return (
        <div className={`flex justify-between items-center py-2 px-3 ${bgColor}`}>
          <Label className="text-gray-600 font-normal text-sm w-1/2">
            {label}
          </Label>
          {type === 'select' && options ? (
            <Select value={value} onValueChange={(newValue) => handleInputChange(field, newValue)}>
              <SelectTrigger className="w-1/2">
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
          ) : (
            <Input
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-1/2"
            />
          )}
        </div>
      );
    }

    return (
      <div className={`flex justify-between items-center py-2 px-3 ${bgColor}`}>
        <span className="text-gray-600 font-normal text-sm">{label}</span>
        <span className="font-medium text-sm">{value}</span>
      </div>
    );
  };

  const renderStatusField = (label: string, status: string, index: number = 0) => {
    const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
    
    return (
      <div className={`flex justify-between items-center py-2 px-3 ${bgColor}`}>
        <span className="text-gray-600 font-normal text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-green-600">{status}</span>
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-[#165788] text-[22px] font-medium">
          Summary
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#165788] text-lg font-medium">Loan details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {renderField('Loan amount', 'loanAmount', formData.loanAmount, 'input', undefined, 0)}
            {renderField('Deposit amount', 'depositAmount', formData.depositAmount, 'input', undefined, 1)}
            {renderField('Source of deposit', 'sourceOfDeposit', formData.sourceOfDeposit, 'input', undefined, 2)}
            {renderField('Value of applicant share', 'valueOfApplicantShare', formData.valueOfApplicantShare, 'input', undefined, 3)}
            {renderField('Total purchase price/Full market value', 'totalPurchasePriceFullMarketValue', formData.totalPurchasePriceFullMarketValue, 'input', undefined, 4)}
            {renderField('LTV', 'ltv', formData.ltv, 'input', undefined, 5)}
            {renderField('Term', 'term', formData.term, 'input', undefined, 6)}
            {renderField('Repayment type', 'repaymentType', formData.repaymentType, 'input', undefined, 7)}
            {renderField('Outstanding mortgage value', 'outstandingMortgageValue', formData.outstandingMortgageValue, 'input', undefined, 8)}
            {renderField('New mortgage exceeds current balance', 'newMortgageExceedsCurrentBalance', formData.newMortgageExceedsCurrentBalance, 'input', undefined, 9)}
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#165788] text-lg font-medium">Property details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {renderField('Region', 'region', formData.region, 'input', undefined, 0)}
            {renderField('Address', 'address', formData.address, 'input', undefined, 1)}
            {renderField('Postcode', 'postCode', formData.postCode, 'input', undefined, 2)}
          </CardContent>
        </Card>

        {/* Applicant 1 Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#165788] text-lg font-medium">Applicant 1 details</CardTitle>
            <div className="font-medium">{formData.applicant1Name}</div>
          </CardHeader>
          <CardContent className="space-y-0">
            {renderStatusField('ID', formData.applicant1ID, 0)}
            {renderStatusField('Residency', formData.applicant1Residency, 1)}
            {renderField('D.O.B', 'applicant1DOB', formData.applicant1DOB, 'input', undefined, 2)}
            {renderField('Expected retirement age', 'applicant1RetirementAge', formData.applicant1RetirementAge, 'input', undefined, 3)}
            {renderField('Age at end of term', 'applicant1AgeAtEndOfTerm', formData.applicant1AgeAtEndOfTerm, 'input', undefined, 4)}
            {renderField('Employment status', 'applicant1EmploymentStatus', formData.applicant1EmploymentStatus, 'select', ['Employed', 'Self-employed', 'Retired', 'Unemployed'], 5)}
            {renderField('Basic income', 'applicant1BasicIncome', formData.applicant1BasicIncome, 'input', undefined, 6)}
          </CardContent>
        </Card>

        {/* Applicant 2 Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#165788] text-lg font-medium">Applicant 2 details</CardTitle>
            <div className="font-medium">{formData.applicant2Name}</div>
          </CardHeader>
          <CardContent className="space-y-0">
            {renderStatusField('ID', formData.applicant2ID, 0)}
            {renderStatusField('Residency', formData.applicant2Residency, 1)}
            {renderField('D.O.B', 'applicant2DOB', formData.applicant2DOB, 'input', undefined, 2)}
            {renderField('Expected retirement age', 'applicant2RetirementAge', formData.applicant2RetirementAge, 'input', undefined, 3)}
            {renderField('Age at end of term', 'applicant2AgeAtEndOfTerm', formData.applicant2AgeAtEndOfTerm, 'input', undefined, 4)}
            {renderField('Employment status', 'applicant2EmploymentStatus', formData.applicant2EmploymentStatus, 'select', ['Employed', 'Self-employed', 'Salaried/non salaried company director', 'Retired', 'Unemployed'], 5)}
            {renderField('Basic income', 'applicant2BasicIncome', formData.applicant2BasicIncome, 'input', undefined, 6)}
          </CardContent>
        </Card>
      </div>

      {/* Full width cards */}
      <div className="space-y-6 mt-6">
        {/* Credit Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#165788] text-lg font-medium">Credit information</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 underline">9GTKW94FD5</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-8">
              <div>
                {renderField('Credit score', 'creditScore', formData.creditScore, 'input', undefined, 0)}
                {renderField('Customer indebtedness score', 'customerIndebtednessScore', formData.customerIndebtednessScore, 'input', undefined, 1)}
              </div>
              <div>
                <div className="space-y-1">
                  <div className="font-medium text-sm">CAIS Credit account details</div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Total balance</span>
                    <span className="font-medium text-sm">{formData.caisBalance}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Worst current status</span>
                    <span className="font-medium text-sm">{formData.caisWorstCurrentStatus}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Worst historical status</span>
                    <span className="font-medium text-sm">{formData.caisWorstHistoricalStatus}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Public information</span>
                    <Badge variant="destructive" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                      -1
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Total value</span>
                    <span className="font-medium text-sm">{formData.publicInformationTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affordability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#165788] text-lg font-medium">Affordability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {renderField('Affordability score', 'affordabilityScore', formData.affordabilityScore, 'input', undefined, 0)}
            {renderField('Based on the details provided we would lend', 'basedOnDetails', formData.basedOnDetails, 'input', undefined, 1)}
            {renderField('Free disposable income', 'freeDisposableIncome', formData.freeDisposableIncome, 'input', undefined, 2)}
            {renderField('Mortgage sub under affordability rules', 'mortgageSubUnder', formData.mortgageSubUnder, 'input', undefined, 3)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
