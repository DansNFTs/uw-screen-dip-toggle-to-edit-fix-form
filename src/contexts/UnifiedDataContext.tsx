import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useAudit } from './AuditContext';
import { FIELD_MAPPINGS, isProtectedField, getDataCaptureField, getReadOnlyField } from '../utils/fieldMapping';

interface UnifiedData {
  [key: string]: string;
}

interface UnifiedDataContextType {
  unifiedData: UnifiedData;
  updateField: (field: string, value: string, section?: string) => void;
  getFieldValue: (field: string) => string;
  syncFromDataCapture: (dataCaptureData: UnifiedData) => void;
  syncFromReadOnly: (readOnlyData: UnifiedData) => void;
  isFieldModified: (field: string) => boolean;
  getFieldLastModified: (field: string) => Date | null;
  resetField: (field: string) => void;
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

const initialData: UnifiedData = {
  // James Taylor
  jamesTitle: 'Mr',
  jamesFirstName: 'James',
  jamesMiddleName: '',
  jamesLastName: 'Taylor',
  jamesNameChange: 'No',
  jamesBirthDay: '11',
  jamesBirthMonth: '11',
  jamesBirthYear: '1988',
  jamesDateOfBirthDay: '11',
  jamesDateOfBirthMonth: '11',
  jamesDateOfBirthYear: '1988',
  jamesNationality: 'UK Resident',
  jamesCurrentAddress: '12 Longwood Close, NEWCASTLE UPON TYNE, Tyne and Wear',
  jamesAddressLine2: 'NEWCASTLE',
  jamesPostcode: 'NE16 5QB',
  jamesMoveInDate: '01/01/2015',
  jamesResidencyStatus: 'Owner occupier with mortgage',
  jamesEmploymentStatus: 'Employed',
  jamesJobTitle: 'Accountant',
  jamesEmployerName: 'Self Employed',
  jamesBasicIncome: '£50000.00',
  jamesMonthlyNetSalary: '£3200',
  
  // Jane Taylor
  janeTitle: 'Mrs',
  janeFirstName: 'Jane',
  janeMiddleName: '',
  janeLastName: 'Taylor',
  janeBirthDay: '04',
  janeBirthMonth: '04',
  janeBirthYear: '1990',
  janeDateOfBirthDay: '04',
  janeDateOfBirthMonth: '04',
  janeDateOfBirthYear: '1990',
  janeNationality: 'UK Resident',
  janeEmploymentStatus: 'Employed',
  janeJobTitle: 'Teacher',
  janeEmployerName: 'Newcastle Primary School',
  janeBasicIncome: '£35000.00',
  
  // James Property Details
  jamesCurrentLender: 'Barclays',
  jamesSalePrice: '',
  jamesOutstandingMortgage: '',
  jamesPlansForProperty: '',
  jamesExpectedRemainingBalance: '',
  
  // Jane Property Details
  janeCurrentLender: '',
  janeSalePrice: '',
  janeOutstandingMortgage: '',
  janePlansForProperty: '',
  janeExpectedRemainingBalance: '',
  
  // Mortgage Details
  loanAmount: '£300000',
  loanTerm: '25',
  propertyValue: '£400000',
  deposit: '£100000',
  
  // Protected/Calculated fields
  requiredLoanAmount: '£300,000.00',
  loanToValue: '75.00%',
};

export const UnifiedDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unifiedData, setUnifiedData] = useState<UnifiedData>(initialData);
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());
  const [fieldTimestamps, setFieldTimestamps] = useState<Map<string, Date>>(new Map());
  const { addAuditEntry } = useAudit();

  const updateField = useCallback((field: string, value: string, section: string = 'Unknown') => {
    // Don't update protected fields from user input
    if (isProtectedField(field)) {
      console.warn(`Attempted to update protected field: ${field}`);
      return;
    }

    const oldValue = unifiedData[field] || '';
    
    setUnifiedData(prev => ({
      ...prev,
      [field]: value
    }));

    // Track modified fields and timestamps
    setModifiedFields(prev => new Set(prev).add(field));
    setFieldTimestamps(prev => new Map(prev).set(field, new Date()));

    // Add to audit log
    addAuditEntry(field, oldValue, value, section);

    // Sync to mapped field if exists
    const mappedField = getReadOnlyField(field) || getDataCaptureField(field);
    if (mappedField && mappedField !== field && !isProtectedField(mappedField)) {
      setUnifiedData(prev => ({
        ...prev,
        [mappedField]: value
      }));
    }
  }, [unifiedData, addAuditEntry]);

  const getFieldValue = useCallback((field: string): string => {
    return unifiedData[field] || '';
  }, [unifiedData]);

  const syncFromDataCapture = useCallback((dataCaptureData: UnifiedData) => {
    const updates: UnifiedData = {};
    
    // Map data capture fields to read-only fields
    Object.entries(dataCaptureData).forEach(([field, value]) => {
      if (!isProtectedField(field)) {
        updates[field] = value;
        
        // Also update mapped read-only field
        const readOnlyField = getReadOnlyField(field);
        if (readOnlyField && !isProtectedField(readOnlyField)) {
          updates[readOnlyField] = value;
        }
      }
    });

    setUnifiedData(prev => ({ ...prev, ...updates }));
  }, []);

  const syncFromReadOnly = useCallback((readOnlyData: UnifiedData) => {
    const updates: UnifiedData = {};
    
    // Map read-only fields to data capture fields (excluding protected fields)
    Object.entries(readOnlyData).forEach(([field, value]) => {
      if (!isProtectedField(field)) {
        updates[field] = value;
        
        // Also update mapped data capture field
        const dataCaptureField = getDataCaptureField(field);
        if (dataCaptureField && !isProtectedField(dataCaptureField)) {
          updates[dataCaptureField] = value;
        }
      }
    });

    setUnifiedData(prev => ({ ...prev, ...updates }));
  }, []);

  const isFieldModified = useCallback((field: string): boolean => {
    return modifiedFields.has(field);
  }, [modifiedFields]);

  const getFieldLastModified = useCallback((field: string): Date | null => {
    return fieldTimestamps.get(field) || null;
  }, [fieldTimestamps]);

  const resetField = useCallback((field: string) => {
    if (isProtectedField(field)) {
      console.warn(`Cannot reset protected field: ${field}`);
      return;
    }

    const initialValue = initialData[field] || '';
    updateField(field, initialValue, 'Reset');
    
    setModifiedFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(field);
      return newSet;
    });
    
    setFieldTimestamps(prev => {
      const newMap = new Map(prev);
      newMap.delete(field);
      return newMap;
    });
  }, [updateField]);

  const value = {
    unifiedData,
    updateField,
    getFieldValue,
    syncFromDataCapture,
    syncFromReadOnly,
    isFieldModified,
    getFieldLastModified,
    resetField,
  };

  return (
    <UnifiedDataContext.Provider value={value}>
      {children}
    </UnifiedDataContext.Provider>
  );
};

export const useUnifiedData = () => {
  const context = useContext(UnifiedDataContext);
  if (context === undefined) {
    throw new Error('useUnifiedData must be used within a UnifiedDataProvider');
  }
  return context;
};