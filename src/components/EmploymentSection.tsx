import React from 'react';

interface EmploymentData {
  employmentStatus: string;
  mostRecentYearNetProfit: string;
  previousYearNetProfit: string;
  previousYearPercentage: string;
  employmentStartDate: string;
  businessStartDate: string;
  businessName: string;
  natureOfBusiness: string;
  timeInEmployment: string;
  employerAddress: string;
  expectedRetirementAge: string;
  ageAtEndOfTerm: string;
  futureChanges: string;
}

interface EmploymentSectionProps {
  name: string;
  data: EmploymentData;
}

export const EmploymentSection: React.FC<EmploymentSectionProps> = ({ name, data }) => {
  const employmentFields = [
    { label: 'Employment status', value: data.employmentStatus },
    { label: 'Most recent year net profit', value: data.mostRecentYearNetProfit },
    { label: 'Previous year net profit', value: data.previousYearNetProfit },
    { label: 'Previous year net profit', value: data.previousYearPercentage },
    { label: 'Employment start date', value: data.employmentStartDate },
    { label: 'Start date of business activities', value: data.businessStartDate },
    { label: 'Business name', value: data.businessName },
    { label: 'Nature of business', value: data.natureOfBusiness },
    { label: 'Time in employment', value: data.timeInEmployment },
    { label: 'Employer address', value: data.employerAddress },
    { label: 'Expected retirement age', value: data.expectedRetirementAge },
    { label: 'Age at end of term', value: data.ageAtEndOfTerm },
    { label: 'Any future changes to income/expenditure', value: data.futureChanges },
  ];

  return (
    <section className="w-full max-md:max-w-full">
      <h3 className="text-[#165788] text-lg font-medium">{name}</h3>
      <div className="w-full mt-4 max-md:max-w-full">
        {employmentFields.map((field, index) => (
          <div
            key={index}
            className={`flex w-full gap-4 text-base flex-wrap p-1 max-md:max-w-full ${
              index % 2 === 0 ? 'bg-[#F7F8FA]' : ''
            }`}
          >
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              {field.label}
            </div>
            <div className="text-black font-medium flex-1 shrink basis-[0%]">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
