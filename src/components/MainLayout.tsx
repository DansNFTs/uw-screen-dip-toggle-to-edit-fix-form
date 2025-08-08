
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { CaseInfoSidebar } from './CaseInfoSidebar';
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditModeProvider } from '../contexts/EditModeContext';
import { AuditProvider } from '../contexts/AuditContext';
import { CaseNotesProvider } from '../contexts/CaseNotesContext';
import { ApplicantDataProvider, useApplicantData } from '../contexts/ApplicantDataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditingTaskBar } from './EditingTaskBar';
import { useEditMode } from '../contexts/EditModeContext';
import { DataCaptureNavigation } from './DataCaptureNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayoutContent: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getFormattedApplicantNames } = useApplicantData();
  const { isEditMode } = useEditMode();
  
  const caseInfo = {
    caseId: '[123456789]',
    enquiryNo: '[123456789]',
    applicationNo: '[123456789]',
    applicantNames: getFormattedApplicantNames(),
    propertyType: 'Residential',
    transactionType: 'Purchase',
    loanType: 'Standard',
    loanAmount: '£175,000',
    ltv: '70%',
    maxLoanAmount: '£180,000',
  };

  const policyRules = [
    { rule: 'R010 No Trace' }
  ];

  const decisionOverride = {
    status: 'Manual Decision Override',
    reason: 'Referred'
  };

  const handlePolicyRulesClick = () => {
    navigate('/policy-rules-notes');
  };

  // Hide task bar on summary, policy rules, and audit log pages
  const showTaskBar = location.pathname !== '/' && 
                      !location.pathname.includes('/policy-rules-notes') && 
                      !location.pathname.includes('/audit-log');
  
  // Show data capture navigation when on data capture routes
  const showDataCaptureNav = location.pathname.includes('/data-capture');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        {showDataCaptureNav ? <DataCaptureNavigation /> : <AppSidebar />}
        <SidebarInset className="flex-1">
          <div className="flex h-screen">
            <main className="flex-1 bg-[#F7F8FA] overflow-hidden flex flex-col">
              {showTaskBar && <EditingTaskBar />}
              <ScrollArea className="h-full">
                {children}
              </ScrollArea>
            </main>
            <aside className="w-[300px] bg-white border-l h-screen overflow-hidden">
              <ScrollArea className="h-full">
                <CaseInfoSidebar 
                  caseInfo={caseInfo}
                  policyRules={policyRules}
                  decisionOverride={decisionOverride}
                  onPolicyRulesClick={handlePolicyRulesClick}
                />
              </ScrollArea>
            </aside>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ApplicantDataProvider>
      <AuditProvider>
        <EditModeProvider>
          <CaseNotesProvider>
            <MainLayoutContent>{children}</MainLayoutContent>
          </CaseNotesProvider>
        </EditModeProvider>
      </AuditProvider>
    </ApplicantDataProvider>
  );
};
