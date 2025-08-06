import React from 'react';

interface IncomeItem {
  label: string;
  frequency: string;
  amount: string;
}

interface AdditionalIncomeSectionProps {
  incomeItems: IncomeItem[];
  grandTotal: string;
}

export const AdditionalIncomeSection: React.FC<AdditionalIncomeSectionProps> = ({ 
  incomeItems, 
  grandTotal 
}) => {
  return (
    <section className="w-full py-4 max-md:max-w-full">
      <h4 className="text-[#165788] text-lg self-stretch w-full gap-2.5 font-medium p-1 max-md:max-w-full">
        Additional income
      </h4>
      <div className="w-full text-base max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          {incomeItems.map((item, index) => (
            <div
              key={index}
              className={`flex w-full gap-4 flex-wrap p-1 max-md:max-w-full ${
                index % 2 === 0 ? 'bg-[#F7F8FA]' : ''
              }`}
            >
              <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
                {item.label}
              </div>
              <div className="flex min-w-60 items-center gap-4 whitespace-nowrap flex-1 shrink basis-[0%]">
                <div className="text-[#505A5F] font-normal self-stretch my-auto">
                  {item.frequency}
                </div>
                <div className="text-black text-base font-medium self-stretch flex-1 shrink basis-[0%] my-auto">
                  {item.amount}
                </div>
              </div>
            </div>
          ))}
          <div className="flex w-full gap-4 flex-wrap bg-[#F7F8FA] mt-8 p-1 max-md:max-w-full">
            <div className="text-[#505A5F] font-normal flex-1 shrink basis-[0%]">
              Grand total
            </div>
            <div className="flex min-w-60 items-center gap-4 whitespace-nowrap flex-1 shrink basis-[0%]">
              <div className="text-[#505A5F] font-normal self-stretch my-auto">
                Annually
              </div>
              <div className="text-black text-base font-medium self-stretch flex-1 shrink basis-[0%] my-auto">
                {grandTotal}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
