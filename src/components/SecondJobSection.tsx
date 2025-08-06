import React from 'react';

interface SecondJobData {
  incomeType: string;
  amount: string;
  employmentStatus: string;
  jobTitle: string;
  employerName: string;
  startDate: string;
  employedByFamily: string;
}

interface SecondJobSectionProps {
  data: SecondJobData;
}

export const SecondJobSection: React.FC<SecondJobSectionProps> = ({ data }) => {
  const secondJobFields = [
    { label: 'Income type', value: data.incomeType },
    { label: 'Amount', value: data.amount },
    { label: 'Employment status', value: data.employmentStatus },
    { label: 'Job title', value: data.jobTitle },
    { label: 'Employer name', value: data.employerName },
    { label: 'Start date', value: data.startDate },
    { label: 'Employed by family member', value: data.employedByFamily },
  ];

  return (
    <section className="w-full py-4 max-md:max-w-full">
      <h4 className="text-[#165788] text-lg self-stretch w-full gap-2.5 font-medium p-1 max-md:max-w-full">
        Second job
      </h4>
      <div className="w-full text-base max-md:max-w-full">
        {secondJobFields.map((field, index) => (
          <div
            key={index}
            className={`flex w-full gap-4 flex-wrap p-1 max-md:max-w-full ${
              index % 2 === 0 ? 'bg-[#F7F8FA]' : ''
            }`}
          >
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              {field.label}
            </div>
            <div className="text-black text-base self-stretch flex-1 shrink basis-[0%] min-w-60 gap-4 font-medium">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
