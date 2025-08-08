import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

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
    <Sidebar className="bg-white border-r border-gray-200">
      <div className="px-3 py-4 border-b border-gray-200 bg-[#165788] text-white">
        <h2 className="font-medium text-sm">Decision in Principle</h2>
      </div>
      
      <SidebarContent className="py-2">
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title} className="mb-6">
            <SidebarGroupLabel className="text-[#165788] font-semibold text-base mb-3 px-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.key);
                  
                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        onClick={() => handleNavigationClick(item.key)}
                        className={`py-1 px-2 text-sm transition-colors hover:bg-gray-50 ${
                          active 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'text-gray-600'
                        }`}
                      >
                        {item.status === 'complete' && (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        {item.status === 'warning' && (
                          <div className="w-4 h-4 bg-[#FFA500] rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="text-white text-[10px] font-bold">!</div>
                          </div>
                        )}
                        <span className="flex-1">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};