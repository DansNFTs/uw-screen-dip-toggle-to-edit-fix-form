
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CaseNote {
  id: string;
  author: string;
  date: string;
  content: string;
  type: 'system' | 'user';
  reasonCodes?: string[];
  ruleId?: string;
}

interface CaseNotesContextType {
  caseNotes: CaseNote[];
  setCaseNotes: React.Dispatch<React.SetStateAction<CaseNote[]>>;
  addCaseNote: (note: Omit<CaseNote, 'id' | 'date'>) => void;
}

const CaseNotesContext = createContext<CaseNotesContextType | undefined>(undefined);

export const useCaseNotes = () => {
  const context = useContext(CaseNotesContext);
  if (context === undefined) {
    throw new Error('useCaseNotes must be used within a CaseNotesProvider');
  }
  return context;
};

const initialCaseNotes: CaseNote[] = [
  {
    id: '1',
    author: 'DMA-Broker',
    date: '22/07/2025 09:57',
    content: 'Credit card for Mr Taylor to be repaid',
    type: 'user'
  },
  {
    id: '2',
    author: 'DMAUATO204',
    date: '22/07/2025 08:57',
    content: 'Credit card for Mr Taylor to be repaid',
    type: 'user'
  }
];

interface CaseNotesProviderProps {
  children: ReactNode;
}

export const CaseNotesProvider: React.FC<CaseNotesProviderProps> = ({ children }) => {
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>(initialCaseNotes);

  const addCaseNote = (note: Omit<CaseNote, 'id' | 'date'>) => {
    const newNote: CaseNote = {
      ...note,
      id: Date.now().toString(),
      date: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    };
    setCaseNotes(prev => [newNote, ...prev]);
  };

  return (
    <CaseNotesContext.Provider value={{ caseNotes, setCaseNotes, addCaseNote }}>
      {children}
    </CaseNotesContext.Provider>
  );
};
