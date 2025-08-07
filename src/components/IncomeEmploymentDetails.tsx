import React from 'react';
import { EmploymentSection } from './EmploymentSection';
import { SecondJobSection } from './SecondJobSection';
import { AdditionalIncomeSection } from './AdditionalIncomeSection';
import { useApplicantData } from '@/contexts/ApplicantDataContext';

export const IncomeEmploymentDetails: React.FC = () => {
  const { getFormattedApplicantNames } = useApplicantData();
  const [jamesName] = getFormattedApplicantNames();
  const employmentData = {
    employmentStatus: 'Employed',
    mostRecentYearNetProfit: '€150,000.00',
    previousYearNetProfit: '€100,000.00',
    previousYearPercentage: '100.00%',
    employmentStartDate: '01/01/1999',
    businessStartDate: '01/01/1999',
    businessName: 'NBS',
    natureOfBusiness: 'Ikhlkjhlk',
    timeInEmployment: '26 years and 3 months',
    employerAddress: 'NHS Address NE33 123',
    expectedRetirementAge: '75',
    ageAtEndOfTerm: '64 years',
    futureChanges: 'No',
  };

  const secondJobData = {
    incomeType: 'Second job',
    amount: '£15,000.00 Yearly',
    employmentStatus: 'Employed',
    jobTitle: '2nd Job Title',
    employerName: '2nd Job Company',
    startDate: 'Jan-10',
    employedByFamily: 'No',
  };

  const additionalIncomeItems = [
    { label: 'Foster Care Allowance', frequency: 'Annually', amount: '$1,000.00' },
    { label: 'Maintenance by court order/CSA', frequency: 'Annually', amount: '$2,000.00' },
    { label: 'Maintenance not by court order', frequency: 'Annually', amount: '$3,000.00' },
    { label: 'Other Taxable Primary Income', frequency: 'Annually', amount: '$4,000.00' },
    { label: 'Working Tax Credit / Family Tax Credit / Personal Independence Payment', frequency: 'Annually', amount: '$5,000.00' },
    { label: 'Car Allowance', frequency: 'Annually', amount: '$6,000.00' },
    { label: 'Large City / Area Allowance', frequency: 'Annually', amount: '$7,000.00' },
    { label: 'regular Bonus / Commission', frequency: 'Annually', amount: '$8,000.00' },
    { label: 'Regular Overtime', frequency: 'Annually', amount: '$9,000.00' },
    { label: 'Shift Allowance (guaranteed)', frequency: 'Annually', amount: '$10,000.00' },
    { label: 'Regular Shift Allowance (non-quaranteed)', frequency: 'Annually', amount: '$11,000.00' },
    { label: 'Total Annual Additional Income', frequency: 'Annually', amount: '$91,000.00' },
  ];

  return (
    <main className="items-stretch flex w-full flex-col bg-[#F7F8FA] mx-auto p-8 max-md:max-w-full max-md:px-5">
      <div className="flex items-center gap-2 text-base text-black font-normal">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/977c705c687843d897208bcf3a90db3a/1ca0014a113f72dc4bbe59f2b49fb69c6124c5cf?placeholderIfAbsent=true"
          className="aspect-[1.55] object-contain w-[17px] stroke-[1.5px] stroke-black self-stretch shrink-0 my-auto"
          alt="Return arrow"
        />
        <div className="text-black self-stretch my-auto">
          Return to Summary
        </div>
      </div>
      
      <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] flex w-full items-stretch gap-4 mt-4 max-md:max-w-full">
        <article className="items-stretch flex min-w-60 w-full flex-col justify-center flex-1 shrink basis-[0%] bg-white p-4 max-md:max-w-full">
          <div className="w-full gap-8 max-md:max-w-full">
            <h1 className="text-[#165788] text-[22px] font-medium max-md:max-w-full">
              Income details & Employment details
            </h1>
            
            <div className="w-full gap-4 mt-8 max-md:max-w-full">
              <EmploymentSection 
                name={jamesName} 
                data={employmentData} 
              />
              
              <SecondJobSection data={secondJobData} />
              
              <AdditionalIncomeSection 
                incomeItems={additionalIncomeItems}
                grandTotal="$216,000.00"
              />
              
              <div className="flex w-full gap-4 text-base flex-wrap bg-white p-1 max-md:max-w-full">
                <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
                  Does the anolicant have an accountant
                </div>
                <div className="text-black font-medium flex-1 shrink basis-[0%]">
                  No
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
};
