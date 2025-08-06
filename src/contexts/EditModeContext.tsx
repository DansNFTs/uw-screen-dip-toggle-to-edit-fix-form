
import React, { createContext, useContext, useState, useRef } from 'react';

interface EditModeContextType {
  isEditingEnabled: boolean;
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
  hasSavedChanges: boolean;
  caseVersion: number;
  toggleEditingEnabled: () => void;
  toggleEditMode: () => void; // Keep for backward compatibility
  setIsEditMode: (value: boolean) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  saveChanges: () => void;
  saveAndResubmit: () => void;
  exitEditMode: () => void;
  cancelAndExitEditMode: () => void;
  storeOriginalState: (key: string, value: any) => void;
  getOriginalState: (key: string) => any;
  restoreAllOriginalState: () => { [key: string]: any };
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
};

interface EditModeProviderProps {
  children: React.ReactNode;
}

export const EditModeProvider: React.FC<EditModeProviderProps> = ({ children }) => {
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasSavedChanges, setHasSavedChanges] = useState(false);
  const [caseVersion, setCaseVersion] = useState(0);
  const originalStateRef = useRef<{ [key: string]: any }>({});

  const toggleEditingEnabled = () => {
    const newEnabled = !isEditingEnabled;
    setIsEditingEnabled(newEnabled);
    
    if (!newEnabled) {
      // If disabling editing, also exit edit mode and clear state
      setIsEditMode(false);
      setHasUnsavedChanges(false);
      originalStateRef.current = {};
    }
  };

  // Legacy support - keep for backward compatibility during transition
  const toggleEditMode = () => {
    if (!isEditingEnabled) {
      // Enable editing and enter edit mode
      setIsEditingEnabled(true);
      setIsEditMode(true);
    } else if (isEditMode && hasUnsavedChanges) {
      // Could add confirmation dialog here
      return;
    } else {
      setIsEditMode(!isEditMode);
    }
    
    if (!isEditMode && isEditingEnabled) {
      setHasUnsavedChanges(false);
      originalStateRef.current = {};
    }
  };

  const saveChanges = () => {
    setHasUnsavedChanges(false);
    setHasSavedChanges(true);
    // Clear original state after saving
    originalStateRef.current = {};
  };

  const saveAndResubmit = () => {
    setHasUnsavedChanges(false);
    setHasSavedChanges(false); // No longer a draft
    setCaseVersion(prev => prev + 1); // Increment version
    setIsEditMode(false);
    // Clear original state after saving
    originalStateRef.current = {};
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setHasUnsavedChanges(false);
    // Don't reset hasSavedChanges here - keep it to show draft status
    // Clear original state when exiting
    originalStateRef.current = {};
  };

  const cancelAndExitEditMode = () => {
    setIsEditMode(false);
    setHasUnsavedChanges(false);
    // Reset to previous state, abandoning all changes
    // Note: Components will need to handle restoration themselves
  };

  const storeOriginalState = (key: string, value: any) => {
    if (!originalStateRef.current.hasOwnProperty(key)) {
      originalStateRef.current[key] = value;
    }
  };

  const getOriginalState = (key: string) => {
    return originalStateRef.current[key];
  };

  const restoreAllOriginalState = () => {
    const originalState = { ...originalStateRef.current };
    originalStateRef.current = {};
    return originalState;
  };

  return (
    <EditModeContext.Provider value={{ 
      isEditingEnabled,
      isEditMode, 
      hasUnsavedChanges, 
      hasSavedChanges,
      caseVersion,
      toggleEditingEnabled,
      toggleEditMode, 
      setIsEditMode,
      setHasUnsavedChanges,
      saveChanges,
      saveAndResubmit,
      exitEditMode,
      cancelAndExitEditMode,
      storeOriginalState,
      getOriginalState,
      restoreAllOriginalState
    }}>
      {children}
    </EditModeContext.Provider>
  );
};
