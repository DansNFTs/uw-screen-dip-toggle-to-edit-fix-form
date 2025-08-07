import React from 'react';
import { useParams } from 'react-router-dom';
import { EditableDetailedPersonalPage } from '@/components/EditableDetailedPersonalPage';
import { useApplicantData } from '@/contexts/ApplicantDataContext';

export const DetailedPersonalDetailsPage: React.FC = () => {
  const { applicantNumber } = useParams<{ applicantNumber: string }>();
  const applicantNum = parseInt(applicantNumber || '1');
  const { getFormattedApplicantNames } = useApplicantData();
  const [jamesName, janeName] = getFormattedApplicantNames();
  const applicantName = applicantNum === 1 ? jamesName : janeName;

  return (
    <EditableDetailedPersonalPage 
      applicantName={applicantName}
      applicantNumber={applicantNum}
    />
  );
};