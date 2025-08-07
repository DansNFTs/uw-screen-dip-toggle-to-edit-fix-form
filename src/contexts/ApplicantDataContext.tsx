import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ApplicantData {
  // James Taylor
  jamesTitle: string;
  jamesFirstName: string;
  jamesMiddleName: string;
  jamesLastName: string;
  
  // Jane Taylor
  janeTitle: string;
  janeFirstName: string;
  janeMiddleName: string;
  janeLastName: string;
}

interface ApplicantDataContextType {
  applicantData: ApplicantData;
  updateApplicantData: (data: Partial<ApplicantData>) => void;
  getFormattedApplicantNames: () => string[];
}

const ApplicantDataContext = createContext<ApplicantDataContextType | undefined>(undefined);

const initialApplicantData: ApplicantData = {
  // James Taylor
  jamesTitle: 'Mr',
  jamesFirstName: 'James',
  jamesMiddleName: '',
  jamesLastName: 'Taylor',
  
  // Jane Taylor
  janeTitle: 'Mrs',
  janeFirstName: 'Jane',
  janeMiddleName: '',
  janeLastName: 'Taylor',
};

export const ApplicantDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applicantData, setApplicantData] = useState<ApplicantData>(initialApplicantData);

  const updateApplicantData = (data: Partial<ApplicantData>) => {
    setApplicantData(prev => ({ ...prev, ...data }));
  };

  const getFormattedApplicantNames = (): string[] => {
    const jamesName = [
      applicantData.jamesTitle,
      applicantData.jamesFirstName,
      applicantData.jamesMiddleName,
      applicantData.jamesLastName
    ].filter(Boolean).join(' ');

    const janeName = [
      applicantData.janeTitle,
      applicantData.janeFirstName,
      applicantData.janeMiddleName,
      applicantData.janeLastName
    ].filter(Boolean).join(' ');

    return [jamesName, janeName];
  };

  const value = {
    applicantData,
    updateApplicantData,
    getFormattedApplicantNames,
  };

  return (
    <ApplicantDataContext.Provider value={value}>
      {children}
    </ApplicantDataContext.Provider>
  );
};

export const useApplicantData = () => {
  const context = useContext(ApplicantDataContext);
  if (context === undefined) {
    throw new Error('useApplicantData must be used within an ApplicantDataProvider');
  }
  return context;
};