// Field mapping configuration for synchronizing between data capture and read-only pages
export interface FieldMapping {
  dataCapture: string;
  readOnly: string;
  section: string;
  isProtected?: boolean; // Protected fields are calculated by backend
}

// Protected/calculated fields that should not be altered on read-only pages
export const PROTECTED_FIELDS = [
  'requiredLoanAmount',
  'loanToValue',
  'affordabilityScore',
  'riskRating',
  'maxLoanAmount',
  'monthlyPayment',
  'totalInterest',
  'ltv',
  'calculatedIncome',
  'debtToIncomeRatio'
];

// Comprehensive field mapping between data capture and read-only forms
export const FIELD_MAPPINGS: FieldMapping[] = [
  // James Taylor - Personal Details
  { dataCapture: 'jamesTitle', readOnly: 'jamesTitle', section: 'Personal Details' },
  { dataCapture: 'jamesFirstName', readOnly: 'jamesFirstName', section: 'Personal Details' },
  { dataCapture: 'jamesMiddleName', readOnly: 'jamesMiddleName', section: 'Personal Details' },
  { dataCapture: 'jamesLastName', readOnly: 'jamesLastName', section: 'Personal Details' },
  { dataCapture: 'jamesNameChange', readOnly: 'jamesNameChange', section: 'Personal Details' },
  { dataCapture: 'jamesBirthDay', readOnly: 'jamesDateOfBirthDay', section: 'Personal Details' },
  { dataCapture: 'jamesBirthMonth', readOnly: 'jamesDateOfBirthMonth', section: 'Personal Details' },
  { dataCapture: 'jamesBirthYear', readOnly: 'jamesDateOfBirthYear', section: 'Personal Details' },
  { dataCapture: 'jamesNationality', readOnly: 'jamesNationality', section: 'Personal Details' },
  
  // James Taylor - Address
  { dataCapture: 'jamesCurrentAddress', readOnly: 'jamesCurrentAddress', section: 'Address Details' },
  { dataCapture: 'jamesAddressLine2', readOnly: 'jamesAddressLine2', section: 'Address Details' },
  { dataCapture: 'jamesPostcode', readOnly: 'jamesPostcode', section: 'Address Details' },
  { dataCapture: 'jamesMoveInDate', readOnly: 'jamesMoveInDate', section: 'Address Details' },
  { dataCapture: 'jamesResidencyStatus', readOnly: 'jamesResidencyStatus', section: 'Address Details' },
  
  // James Taylor - Employment
  { dataCapture: 'jamesEmploymentStatus', readOnly: 'jamesEmploymentStatus', section: 'Employment Details' },
  { dataCapture: 'jamesJobTitle', readOnly: 'jamesJobTitle', section: 'Employment Details' },
  { dataCapture: 'jamesEmployerName', readOnly: 'jamesEmployerName', section: 'Employment Details' },
  { dataCapture: 'jamesBasicIncome', readOnly: 'jamesBasicIncome', section: 'Employment Details' },
  { dataCapture: 'jamesMonthlyNetSalary', readOnly: 'jamesMonthlyNetSalary', section: 'Employment Details' },
  
  // Jane Taylor - Personal Details
  { dataCapture: 'janeTitle', readOnly: 'janeTitle', section: 'Personal Details' },
  { dataCapture: 'janeFirstName', readOnly: 'janeFirstName', section: 'Personal Details' },
  { dataCapture: 'janeMiddleName', readOnly: 'janeMiddleName', section: 'Personal Details' },
  { dataCapture: 'janeLastName', readOnly: 'janeLastName', section: 'Personal Details' },
  { dataCapture: 'janeBirthDay', readOnly: 'janeDateOfBirthDay', section: 'Personal Details' },
  { dataCapture: 'janeBirthMonth', readOnly: 'janeDateOfBirthMonth', section: 'Personal Details' },
  { dataCapture: 'janeBirthYear', readOnly: 'janeDateOfBirthYear', section: 'Personal Details' },
  { dataCapture: 'janeNationality', readOnly: 'janeNationality', section: 'Personal Details' },
  
  // Jane Taylor - Employment
  { dataCapture: 'janeEmploymentStatus', readOnly: 'janeEmploymentStatus', section: 'Employment Details' },
  { dataCapture: 'janeJobTitle', readOnly: 'janeJobTitle', section: 'Employment Details' },
  { dataCapture: 'janeEmployerName', readOnly: 'janeEmployerName', section: 'Employment Details' },
  { dataCapture: 'janeBasicIncome', readOnly: 'janeBasicIncome', section: 'Employment Details' },
  
  // Mortgage Details
  { dataCapture: 'loanAmount', readOnly: 'loanAmount', section: 'Mortgage Details' },
  { dataCapture: 'loanTerm', readOnly: 'loanTerm', section: 'Mortgage Details' },
  { dataCapture: 'propertyValue', readOnly: 'propertyValue', section: 'Property Details' },
  { dataCapture: 'deposit', readOnly: 'deposit', section: 'Mortgage Details' },
  
  // Protected/Calculated Fields (these should not be modified from read-only pages)
  { dataCapture: 'requiredLoanAmount', readOnly: 'requiredLoanAmount', section: 'Mortgage Details', isProtected: true },
  { dataCapture: 'loanToValue', readOnly: 'loanToValue', section: 'Mortgage Details', isProtected: true },
];

// Utility functions
export const getDataCaptureField = (readOnlyField: string): string | null => {
  const mapping = FIELD_MAPPINGS.find(m => m.readOnly === readOnlyField);
  return mapping?.dataCapture || null;
};

export const getReadOnlyField = (dataCaptureField: string): string | null => {
  const mapping = FIELD_MAPPINGS.find(m => m.dataCapture === dataCaptureField);
  return mapping?.readOnly || null;
};

export const isProtectedField = (fieldName: string): boolean => {
  return PROTECTED_FIELDS.includes(fieldName) || 
         FIELD_MAPPINGS.some(m => (m.dataCapture === fieldName || m.readOnly === fieldName) && m.isProtected);
};

export const getMappingForField = (fieldName: string): FieldMapping | null => {
  return FIELD_MAPPINGS.find(m => m.dataCapture === fieldName || m.readOnly === fieldName) || null;
};