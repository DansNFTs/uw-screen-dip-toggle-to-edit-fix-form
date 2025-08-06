
import React from 'react';

interface PolicyRule {
  rule: string;
}

interface CasePolicyRulesProps {
  policyRules: PolicyRule[];
  onPolicyRulesClick?: () => void;
}

export const CasePolicyRules: React.FC<CasePolicyRulesProps> = ({
  policyRules,
  onPolicyRulesClick,
}) => {
  return (
    <div className="w-full">
      <h3 
        className="text-[#165788] self-stretch flex-1 shrink basis-[0%] w-full gap-2.5 text-lg font-medium pb-1 cursor-pointer hover:text-[#134567] transition-colors"
        onClick={onPolicyRulesClick}
      >
        Policy rules triggered
      </h3>
      <div 
        className="w-full text-sm text-black font-normal cursor-pointer hover:bg-gray-50 rounded p-1 -m-1 transition-colors"
        onClick={onPolicyRulesClick}
      >
        {policyRules.map((rule, index) => (
          <div key={index} className="text-black self-stretch flex-1 shrink basis-[0%] w-full gap-2.5 py-1">
            {rule.rule}
          </div>
        ))}
      </div>
    </div>
  );
};
