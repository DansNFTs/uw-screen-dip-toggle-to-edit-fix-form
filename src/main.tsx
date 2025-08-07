import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApplicantDataProvider } from './contexts/ApplicantDataContext'
import { EditModeProvider } from './contexts/EditModeContext'
import { AuditProvider } from './contexts/AuditContext'
import { CaseNotesProvider } from './contexts/CaseNotesContext'

createRoot(document.getElementById("root")!).render(
  <ApplicantDataProvider>
    <EditModeProvider>
      <AuditProvider>
        <CaseNotesProvider>
          <App />
        </CaseNotesProvider>
      </AuditProvider>
    </EditModeProvider>
  </ApplicantDataProvider>
);
