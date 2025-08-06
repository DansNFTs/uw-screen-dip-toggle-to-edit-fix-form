
import React from 'react';
import { StatusBadge } from './StatusBadge';

export const CaseScores: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex min-w-[267px] w-full items-center">
        <div className="text-[#505A5F] self-stretch gap-2.5 text-sm font-normal w-[170px] my-auto py-1">
          Credit score
        </div>
        <div className="text-black self-stretch font-medium text-sm flex-1 shrink basis-[0%] py-1">
          1090
        </div>
      </div>
      <div className="flex min-w-[267px] w-full items-center">
        <div className="text-[#505A5F] self-stretch flex-1 shrink basis-[0%] gap-2.5 text-sm font-normal w-[170px] my-auto py-1">
          Affordability score
        </div>
        <div className="text-black self-stretch font-medium text-sm flex-1 shrink basis-[0%] py-1">
          5
        </div>
      </div>
    </div>
  );
};
