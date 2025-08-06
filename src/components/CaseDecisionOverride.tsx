
import React from 'react';

interface CaseDecisionOverrideProps {
  decisionOverride: {
    status: string;
    reason: string;
  };
}

export const CaseDecisionOverride: React.FC<CaseDecisionOverrideProps> = ({
  decisionOverride,
}) => {
  return (
    <div className="w-full mt-2">
      <h3 className="text-[#165788] self-stretch flex-1 shrink basis-[0%] w-full gap-2.5 text-lg font-medium pt-2 pb-1">
        Decision Override
      </h3>
      <div className="w-full text-sm text-black font-normal">
        <div className="text-black self-stretch flex-1 shrink basis-[0%] w-full gap-2.5 whitespace-nowrap pr-4 py-1">
          {decisionOverride.status}
        </div>
        <div className="text-black self-stretch flex-1 shrink basis-[0%] w-full gap-2.5 pr-4 py-1">
          {decisionOverride.reason}
        </div>
      </div>
    </div>
  );
};
