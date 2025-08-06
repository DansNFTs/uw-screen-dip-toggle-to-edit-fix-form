
import React from 'react';

interface CasePropertyDetailsProps {
  propertyType: string;
  transactionType: string;
  loanType: string;
  loanAmount: string;
  ltv: string;
  maxLoanAmount: string;
}

export const CasePropertyDetails: React.FC<CasePropertyDetailsProps> = ({
  propertyType,
  transactionType,
  loanType,
  loanAmount,
  ltv,
  maxLoanAmount,
}) => {
  return (
    <div className="max-w-full w-[267px]">
      <div className="w-full max-w-[267px]">
        <div className="flex w-full flex-col items-stretch justify-center py-2">
          <div className="border min-h-px w-full bg-[#505A5F] border-[rgba(80,90,95,1)] border-solid" />
        </div>
        <div className="w-full text-sm text-black font-medium">
          <div className="min-w-[267px] items-stretch flex w-full flex-col gap-1">
            <div className="gap-2.5">{propertyType}</div>
            <div className="text-black self-stretch w-full whitespace-nowrap mt-1">
              {transactionType}
            </div>
            <div className="flex min-w-[267px] w-full whitespace-nowrap mt-1">
              <div className="self-stretch w-[170px] gap-2.5">
                {loanType}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-stretch justify-center py-2">
          <div className="border min-h-px w-full bg-[#505A5F] border-[rgba(80,90,95,1)] border-solid" />
        </div>
        
        <div className="flex min-w-[267px] w-full text-sm justify-between">
          <div className="text-[#505A5F] self-stretch gap-2.5 font-normal w-[170px] py-1">
            Loan amount
          </div>
          <div className="text-black self-stretch font-medium whitespace-nowrap flex-1 shrink basis-[0%] py-1">
            {loanAmount}
          </div>
        </div>
        <div className="flex min-w-[267px] w-full text-sm whitespace-nowrap justify-between">
          <div className="text-[#505A5F] self-stretch gap-2.5 font-normal w-[170px] py-1">
            LTV
          </div>
          <div className="text-black self-stretch font-medium flex-1 shrink basis-[0%] py-1">
            {ltv}
          </div>
        </div>
        <div className="flex min-w-[267px] w-full text-sm justify-between">
          <div className="text-[#505A5F] self-stretch gap-2.5 font-normal w-[170px] py-1">
            Max loan amount
          </div>
          <div className="text-black self-stretch font-medium whitespace-nowrap flex-1 shrink basis-[0%] py-1">
            {maxLoanAmount}
          </div>
        </div>
      </div>
    </div>
  );
};
