
import React from 'react';
import { CaseBasicInfo } from './CaseBasicInfo';
import { CaseApplicantNames } from './CaseApplicantNames';
import { CasePropertyDetails } from './CasePropertyDetails';
import { CaseScores } from './CaseScores';
import { CasePolicyRules } from './CasePolicyRules';
import { CaseDecisionOverride } from './CaseDecisionOverride';
import { CaseCaseNotes } from './CaseCaseNotes';
import { CaseEditNotification } from './CaseEditNotification';
import { Badge } from "@/components/ui/badge";
import { useEditMode } from '../contexts/EditModeContext';

interface CaseInfo {
  caseId: string;
  enquiryNo: string;
  applicationNo: string;
  applicantNames: string[];
  propertyType: string;
  transactionType: string;
  loanType: string;
  loanAmount: string;
  ltv: string;
  maxLoanAmount: string;
}

interface PolicyRule {
  rule: string;
}

interface CaseInfoSidebarProps {
  caseInfo: CaseInfo;
  policyRules: PolicyRule[];
  decisionOverride: {
    status: string;
    reason: string;
  };
  onPolicyRulesClick?: () => void;
}

export const CaseInfoSidebar: React.FC<CaseInfoSidebarProps> = ({
  caseInfo,
  policyRules,
  decisionOverride,
  onPolicyRulesClick,
}) => {
  const { hasUnsavedChanges, hasSavedChanges } = useEditMode();
  
  return (
    <aside className="shadow-[-4px_0px_10px_0px_rgba(0,0,0,0.05)] min-h-[1024px] w-full px-4 bg-white pt-0 pb-4">
      <CaseBasicInfo
        caseId={caseInfo.caseId}
        enquiryNo={caseInfo.enquiryNo}
        applicationNo={caseInfo.applicationNo}
        showEditBadge={hasUnsavedChanges || hasSavedChanges}
        isEditing={hasUnsavedChanges}
      />

      <CaseApplicantNames applicantNames={caseInfo.applicantNames} />

      <CasePropertyDetails 
        propertyType={caseInfo.propertyType}
        transactionType={caseInfo.transactionType}
        loanType={caseInfo.loanType}
        loanAmount={caseInfo.loanAmount}
        ltv={caseInfo.ltv}
        maxLoanAmount={caseInfo.maxLoanAmount}
      />

      <CaseScores />

      <div className="flex max-w-full w-[267px] flex-col items-stretch justify-center py-2">
        <div className="border min-h-px w-full bg-[#505A5F] border-[rgba(80,90,95,1)] border-solid" />
      </div>

      <div className="max-w-full w-[267px]">
        <CasePolicyRules 
          policyRules={policyRules}
          onPolicyRulesClick={onPolicyRulesClick}
        />
        
        <CaseDecisionOverride decisionOverride={decisionOverride} />
        
        <CaseCaseNotes />
      </div>
    </aside>
  );
};
