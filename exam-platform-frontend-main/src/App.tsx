import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ExamProvider } from "@/contexts/ExamContext";
import { DataCacheProvider } from '@/contexts/DataCacheContext';
import DataPreloader from '@/components/DataPreloader';

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import ExamPage from "./pages/ExamPage";
import ResultsPage from "./pages/ResultsPage";
import FeedbackPage from "./pages/FeedbackPage";
import NotFound from "./pages/NotFound";
import Attendancesheet from "./pages/Attendencesheet";
import RoundSelectionPage from "./pages/RoundSelectionPage";
import GroupSelection from "./pages/GroupSelection";
import NewRegistration from "./pages/NewRegisteration";
import PhaseSelection from "./pages/PhaseSelection";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataCacheProvider>
          <DataPreloader>
            <ExamProvider >
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/phaseselection" element={<PhaseSelection />} />
                    <Route path="/round" element={< RoundSelectionPage/>}/>
                    <Route path="/attendance" element={<Attendancesheet />} />
                    <Route path="/groupselection" element={<GroupSelection />} />
                    <Route path="/exam" element={<ExamPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/registration" element={<NewRegistration/>}/>

                  </Routes>
                </BrowserRouter>
            </ExamProvider>
          </DataPreloader>
        </DataCacheProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
