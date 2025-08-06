
import React, { createContext, useContext, useState } from 'react';

export interface AuditEntry {
  id: string;
  timestamp: Date;
  field: string;
  oldValue: string;
  newValue: string;
  section: string;
  user: string;
  sessionId?: string; // Track which edit session this belongs to
}

interface AuditContextType {
  auditLog: AuditEntry[];
  currentSessionId: string | null;
  addAuditEntry: (field: string, oldValue: string, newValue: string, section: string) => void;
  revertToOriginal: (field: string, originalValue: string) => void;
  revertSingleChange: (auditEntryId: string, formData: any, setFormData: (data: any) => void) => void;
  startAuditSession: () => void;
  endAuditSession: () => void;
  cancelAuditSession: () => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};

interface AuditProviderProps {
  children: React.ReactNode;
}

export const AuditProvider: React.FC<AuditProviderProps> = ({ children }) => {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const addAuditEntry = (field: string, oldValue: string, newValue: string, section: string) => {
    if (oldValue === newValue) return; // Don't log if no actual change
    
    const entry: AuditEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      field,
      oldValue,
      newValue,
      section,
      user: 'Current User', // In a real app, this would come from auth
      sessionId: currentSessionId || undefined
    };
    
    setAuditLog(prev => [entry, ...prev]);
  };

  const revertToOriginal = (field: string, originalValue: string) => {
    // This would be implemented based on your original data structure
    console.log(`Reverting ${field} to original value: ${originalValue}`);
  };

  const revertSingleChange = (auditEntryId: string, formData: any, setFormData: (data: any) => void) => {
    const entry = auditLog.find(e => e.id === auditEntryId);
    if (!entry) return;

    // Revert the specific field to its old value
    const updatedFormData = {
      ...formData,
      [entry.field]: entry.oldValue
    };
    
    setFormData(updatedFormData);
    
    // Add a new audit entry for the reversion
    addAuditEntry(entry.field, entry.newValue, entry.oldValue, entry.section + ' (Reverted)');
  };

  const startAuditSession = () => {
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setCurrentSessionId(sessionId);
  };

  const endAuditSession = () => {
    setCurrentSessionId(null);
  };

  const cancelAuditSession = () => {
    if (currentSessionId) {
      // Remove all audit entries from this session
      setAuditLog(prev => prev.filter(entry => entry.sessionId !== currentSessionId));
      setCurrentSessionId(null);
    }
  };

  return (
    <AuditContext.Provider value={{ 
      auditLog, 
      currentSessionId,
      addAuditEntry, 
      revertToOriginal, 
      revertSingleChange,
      startAuditSession,
      endAuditSession,
      cancelAuditSession
    }}>
      {children}
    </AuditContext.Provider>
  );
};
