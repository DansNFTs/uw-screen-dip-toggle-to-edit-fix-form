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
    {
      title: 'Mortgage',
      items: [
        { label: 'Mortgage details', key: 'mortgage-details', status: 'complete' as const },
        { label: 'Household details', key: 'household-details', status: 'complete' as const }
      ]
    },
    {
      title: 'James Taylor',
      items: [
        { label: 'Personal details', key: 'james-personal', status: 'complete' as const },
        { label: 'Income & employment', key: 'james-employment', status: 'complete' as const },
        { label: 'Credit information', key: 'james-credit', status: 'complete' as const },
        { label: 'Commitments & expenses', key: 'james-commitments', status: 'complete' as const }
      ]
    },
    {
      title: 'Jane Taylor',
      items: [
        { label: 'Personal details', key: 'jane-personal', status: 'complete' as const },
        { label: 'Income & employment', key: 'jane-employment', status: 'complete' as const },
        { label: 'Credit information', key: 'jane-credit', status: 'complete' as const },
        { label: 'Commitments & expenses', key: 'jane-commitments', status: 'complete' as const }
      ]
    },
    {
      title: 'Submission',
      items: [
        { label: 'Declarations', key: 'declarations', status: 'warning' as const }
      ]
    }
  ];

  const handleNavigationClick = (key: string) => {
    let targetSection = 'mortgage';
    let targetApplicant = '1';
    
    if (key.startsWith('mortgage') || key.startsWith('household')) {
      targetSection = 'mortgage';
    } else if (key.startsWith('james')) {
      targetSection = 'applicants';
      targetApplicant = '1';
    } else if (key.startsWith('jane')) {
      targetSection = 'applicants';
      targetApplicant = '2';
    } else if (key === 'declarations') {
      targetSection = 'submission';
    }
    
    navigate(`/data-capture/${targetSection}/${targetApplicant}`);
  };

  const isActive = (key: string) => {
    if (key.startsWith('jane') && currentSection === 'applicants' && currentApplicant === '2') return true;
    if (key.startsWith('james') && currentSection === 'applicants' && currentApplicant === '1') return true;
    if ((key.startsWith('mortgage') || key.startsWith('household')) && currentSection === 'mortgage') return true;
    if (key === 'declarations' && currentSection === 'submission') return true;
    return false;
  };

  return (
    <aside className="w-[200px] bg-white border-r border-gray-200 flex flex-col">
      <div className="px-3 py-4 border-b border-gray-200 bg-blue-700 text-white">
        <h2 className="font-medium text-sm">Decision in Principle</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="py-2">
          {navigationItems.map((section) => (
            <div key={section.title} className="mb-4">
              <h3 className="font-semibold text-blue-700 px-3 py-2 text-sm">
                {section.title}
              </h3>
              <div className="space-y-0">
                {section.items.map((item) => {
                  const active = isActive(item.key);
                  
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNavigationClick(item.key)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left hover:bg-gray-50 ${
                        active 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-gray-600'
                      }`}
                    >
                      {item.status === 'complete' && (
                        <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                      {item.status === 'warning' && (
                        <div className="w-3 h-3 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="text-white text-[8px] font-bold">!</div>
                        </div>
                      )}
                      <span className="flex-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};