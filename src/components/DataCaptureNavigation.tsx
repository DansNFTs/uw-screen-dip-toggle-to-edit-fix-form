import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';

export const DataCaptureNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract current section and applicant from URL
  const pathParts = location.pathname.split('/');
  const currentSection = pathParts[2] || 'mortgage';
  const currentApplicant = pathParts[3] || '1';

  const navigationItems = [
    { label: 'Mortgage details', key: 'mortgage-details', status: 'complete' as const },
    { label: 'Applicant details', key: 'applicant-details', status: 'complete' as const },
    { label: 'Income & employment', key: 'income-employment', status: 'complete' as const },
    { label: 'Credit information', key: 'credit-information', status: 'complete' as const },
    { label: 'Commitments & expenses', key: 'commitments-expenses', status: 'complete' as const },
    { label: 'Eligibility', key: 'eligibility', status: 'complete' as const },
    { label: 'Affordability', key: 'affordability', status: 'complete' as const },
    { label: 'Policy check', key: 'policy-check', status: 'complete' as const },
    { label: 'Final checks', key: 'final-checks', status: 'complete' as const },
    { label: 'Decision summary', key: 'decision-summary', status: 'complete' as const },
    { label: 'Declarations', key: 'declarations', status: 'warning' as const }
  ];

  const handleNavigationClick = (key: string) => {
    // For now, all navigation items go to the unified data capture form
    navigate('/data-capture/applicants/1');
  };

  const isActive = (key: string) => {
    // Set applicant-details as active when on applicants route
    return key === 'applicant-details' && currentSection === 'applicants';
  };

  return (
    <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-blue-600 text-white">
        <h2 className="font-semibold text-lg">Decision in Principle</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="py-2">
          {navigationItems.map((item, index) => {
            const active = isActive(item.key);
            
            return (
              <button
                key={item.key}
                onClick={() => handleNavigationClick(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left border-b border-gray-100 ${
                  active 
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-l-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.status === 'complete' && (
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                )}
                {item.status === 'warning' && (
                  <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                )}
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
};