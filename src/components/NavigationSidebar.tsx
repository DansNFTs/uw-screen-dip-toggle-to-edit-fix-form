import React from 'react';

interface NavigationItem {
  label: string;
  isActive?: boolean;
}

export const NavigationSidebar: React.FC = () => {
  const mainMenuItems: NavigationItem[] = [
    { label: 'Summary' },
    { label: 'Loan details' },
    { label: 'Property details' },
    { label: 'Credit information' },
    { label: 'Affordability' },
    { label: 'Commitments & Expenses' },
    { label: 'Personal details' },
    { label: 'Income & Employment', isActive: true },
    { label: 'ID & Residency' },
    { label: 'Policy rules & Notes' },
  ];

  const additionalMenuItems: NavigationItem[] = [
    { label: 'Broker details' },
    { label: 'Solicitor details' },
    { label: 'Direct debit details' },
  ];

  const renderMenuItem = (item: NavigationItem, index: number) => {
    if (item.isActive) {
      return (
        <div
          key={index}
          className="items-stretch flex min-h-[33px] w-full gap-2 overflow-hidden font-medium px-4 py-2"
        >
          <div className="w-0 shrink-0 h-[17px] bg-white border-white border-solid border-2" />
          <div className="text-white text-sm flex-1 shrink basis-[0%] my-auto">
            {item.label}
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="text-white text-sm self-stretch flex-1 shrink basis-[0%] w-full gap-2 px-4 py-2 cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
      >
        {item.label}
      </div>
    );
  };

  return (
    <nav className="w-full bg-[#165788]">
      <div className="w-full max-w-[264px] text-sm text-white font-normal bg-[#165788]">
        <div className="w-full pt-6">
          {mainMenuItems.map(renderMenuItem)}
        </div>
        <div className="w-full mt-4">
          {additionalMenuItems.map(renderMenuItem)}
        </div>
        <div className="text-sm self-stretch flex-1 shrink basis-[0%] w-full gap-2 text-white px-4 py-2 mt-4 cursor-pointer hover:bg-[rgba(255,255,255,0.1)]">
          Audit log
        </div>
      </div>
      <div className="w-full mt-[360px] max-md:mt-10">
        <div className="bg-[rgba(22,87,136,1)] flex min-h-20 w-full" />
      </div>
    </nav>
  );
};
