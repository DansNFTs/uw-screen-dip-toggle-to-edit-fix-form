
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useEditMode } from '../contexts/EditModeContext';
import { Check } from 'lucide-react';

interface NavigationItem {
  label: string;
  path: string;
  completed?: boolean;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { isEditMode } = useEditMode();
  
  const formSections: NavigationSection[] = [
    {
      title: "Mortgage",
      items: [
        { label: "Mortgage details", path: "/mortgage-details", completed: true },
        { label: "Household details", path: "/household-details", completed: true },
      ]
    },
    {
      title: "James Taylor",
      items: [
        { label: "Eligibility", path: "/james/eligibility", completed: true },
        { label: "Personal details", path: "/james/personal-details", completed: true },
        { label: "Addresses", path: "/james/addresses", completed: true },
        { label: "Income and commitments", path: "/james/income-commitments", completed: true },
      ]
    },
    {
      title: "Jane Taylor", 
      items: [
        { label: "Eligibility", path: "/jane/eligibility", completed: true },
        { label: "Personal details", path: "/jane/personal-details", completed: true },
        { label: "Addresses", path: "/jane/addresses", completed: true },
        { label: "Income and commitments", path: "/jane/income-commitments", completed: true },
      ]
    },
    {
      title: "Submission",
      items: [
        { label: "Case notes", path: "/case-notes", completed: true },
        { label: "Broker details", path: "/broker-details", completed: true },
        { label: "Declarations", path: "/declarations", completed: false },
      ]
    }
  ];

  const renderSectionItem = (item: NavigationItem, index: number) => {
    const isActive = location.pathname === item.path;
    
    return (
      <SidebarMenuItem key={index}>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link to={item.path} className="flex items-center gap-3 py-2">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-gray-800">{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderDeclarationItem = (item: NavigationItem, index: number) => {
    const isActive = location.pathname === item.path;
    
    return (
      <SidebarMenuItem key={index}>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link to={item.path} className="flex items-center gap-3 py-2">
            <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <span className="text-sm text-gray-800">{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="bg-gray-50 border-r border-gray-200 w-64">
      <SidebarContent className="bg-gray-50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-blue-600">Decision in Principle</h2>
        </div>

        {/* Form Sections */}
        <div className="p-4 space-y-6">
          {formSections.map((section, sectionIndex) => (
            <SidebarGroup key={sectionIndex}>
              <SidebarGroupLabel className="text-blue-600 font-medium text-base mb-3">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    if (item.label === "Declarations" && !item.completed) {
                      return renderDeclarationItem(item, itemIndex);
                    }
                    return renderSectionItem(item, itemIndex);
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
