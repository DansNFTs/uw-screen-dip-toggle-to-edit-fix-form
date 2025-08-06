
import React from 'react';

interface CaseApplicantNamesProps {
  applicantNames: string[];
}

export const CaseApplicantNames: React.FC<CaseApplicantNamesProps> = ({
  applicantNames,
}) => {
  return (
    <div className="flex max-w-full w-[267px] flex-col items-stretch text-sm text-black font-medium whitespace-nowrap justify-center py-2">
      <div className="min-w-[267px] max-w-[267px] items-stretch flex w-full flex-col gap-1">
        {applicantNames.map((name, index) => (
          <div key={index} className="text-black gap-2.5">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};
