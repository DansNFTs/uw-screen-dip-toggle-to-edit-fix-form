
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { IncomeEmploymentPage } from "./pages/IncomeEmploymentPage";
import { SummaryPage } from "./pages/SummaryPage";
import { LoanDetailsPage } from "./pages/LoanDetailsPage";
import { PropertyDetailsPage } from "./pages/PropertyDetailsPage";
import { CreditInformationPage } from "./pages/CreditInformationPage";
import { AffordabilityPage } from "./pages/AffordabilityPage";
import { CommitmentsExpensesPage } from "./pages/CommitmentsExpensesPage";
import { PersonalDetailsPage } from "./pages/PersonalDetailsPage";
import { AuditLogPage } from "./pages/AuditLogPage";
import { PolicyRulesNotesPage } from "./pages/PolicyRulesNotesPage";
import { MortgageDetailsPage } from "./pages/MortgageDetailsPage";
import { DetailedPersonalDetailsPage } from "./pages/DetailedPersonalDetailsPage";
import { UnifiedDataCapturePage } from "./pages/UnifiedDataCapturePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<SummaryPage />} />
            <Route path="/income-employment" element={<IncomeEmploymentPage />} />
            <Route path="/loan-details" element={<LoanDetailsPage />} />
            <Route path="/property-details" element={<PropertyDetailsPage />} />
            <Route path="/credit-information" element={<CreditInformationPage />} />
            <Route path="/affordability" element={<AffordabilityPage />} />
            <Route path="/commitments-expenses" element={<CommitmentsExpensesPage />} />
            <Route path="/personal-details" element={<PersonalDetailsPage />} />
            <Route path="/mortgage-details" element={<MortgageDetailsPage />} />
            <Route path="/detailed-personal/:applicantNumber" element={<DetailedPersonalDetailsPage />} />
            <Route path="/data-capture/:section?/:applicantNumber?" element={<UnifiedDataCapturePage />} />
            <Route path="/policy-rules-notes" element={<PolicyRulesNotesPage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
