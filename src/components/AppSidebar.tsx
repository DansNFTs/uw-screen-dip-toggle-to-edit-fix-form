
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useEditMode } from '../contexts/EditModeContext';

interface NavigationItem {
  label: string;
  path: string;
}

interface EditModeSection {
  title: string;
  items: EditModeItem[];
}

interface EditModeItem {
  label: string;
  status: 'warning' | 'complete' | 'normal';
}

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { isEditMode } = useEditMode();
  
  const mainMenuItems: NavigationItem[] = [
    { label: 'Summary', path: '/' },
    { label: 'Loan details', path: '/loan-details' },
    { label: 'Property details', path: '/property-details' },
    { label: 'Credit information', path: '/credit-information' },
    { label: 'Affordability', path: '/affordability' },
    { label: 'Commitments & Expenses', path: '/commitments-expenses' },
    { label: 'Personal details', path: '/personal-details' },
    { label: 'Income & Employment', path: '/income-employment' },
    { label: 'Policy rules & Notes', path: '/policy-rules-notes' },
  ];

  const additionalMenuItems: NavigationItem[] = [
    { label: 'Broker details', path: '/broker-details' },
    { label: 'Solicitor details', path: '/solicitor-details' },
    { label: 'Direct debit details', path: '/direct-debit-details' },
  ];

  const editModeSections: EditModeSection[] = [
    {
      title: "Mortgage",
      items: [
        { label: "Mortgage details", status: "complete" },
        { label: "Property details", status: "complete" },
        { label: "Affordability", status: "complete" },
      ]
    },
    {
      title: "James Taylor",
      items: [
        { label: "Personal details", status: "complete" },
        { label: "Income & employment", status: "complete" },
        { label: "Credit information", status: "complete" },
        { label: "Commitments & expenses", status: "complete" },
      ]
    },
    {
      title: "Jane Taylor",
      items: [
        { label: "Personal details", status: "complete" },
        { label: "Income & employment", status: "complete" },
        { label: "Credit information", status: "complete" },
        { label: "Commitments & expenses", status: "complete" },
      ]
    },
    {
      title: "Submission",
      items: [
        { label: "Declarations", status: "warning" },
      ]
    }
  ];

  const renderMenuItem = (item: NavigationItem, index: number) => {
    const isActive = location.pathname === item.path;
    
    return (
      <SidebarMenuItem key={index}>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link to={item.path} className="flex items-center gap-2">
            {isActive && (
              <div className="w-0 shrink-0 h-[17px] bg-white border-white border-solid border-2" />
            )}
            <span className="text-sm">{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderEditModeItem = (item: EditModeItem, index: number) => {
    const getStatusIcon = () => {
      switch (item.status) {
        case 'warning':
          return (
            <div className="w-4 h-4 rounded-full bg-[#FFA500] flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          );
        case 'complete':
          return (
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div key={index} className="flex items-center gap-2 py-1 px-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
        {getStatusIcon()}
        <span>{item.label}</span>
      </div>
    );
  };

  if (isEditMode) {
    return (
      <Sidebar className="bg-white border-r border-gray-200">
        <SidebarContent className="bg-white text-gray-900 p-4">
          {editModeSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="text-[#165788] font-semibold text-base mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => renderEditModeItem(item, itemIndex))}
              </div>
            </div>
          ))}
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="bg-[#165788] border-none">
      <SidebarContent className="bg-[#165788] text-white">
        <SidebarGroup className="pt-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {mainMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {additionalMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/audit-log" className="text-sm">
                    Audit log
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
