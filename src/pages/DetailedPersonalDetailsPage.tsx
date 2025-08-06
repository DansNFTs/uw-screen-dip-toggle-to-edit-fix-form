import React from 'react';
import { useParams } from 'react-router-dom';
import { EditableDetailedPersonalPage } from '@/components/EditableDetailedPersonalPage';

export const DetailedPersonalDetailsPage: React.FC = () => {
  const { applicantNumber } = useParams<{ applicantNumber: string }>();
  const applicantNum = parseInt(applicantNumber || '1');
  const applicantName = applicantNum === 1 ? 'James Taylor' : 'Jane Taylor';

  return (
    <EditableDetailedPersonalPage 
      applicantName={applicantName}
      applicantNumber={applicantNum}
    />
  );
};