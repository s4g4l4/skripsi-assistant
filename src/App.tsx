import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProposalWizardPage from './pages/ProposalWizardPage';
import EditorPage from './pages/EditorPage';
import AutoFormatPage from './pages/AutoFormatPage';
import CitationManagerPage from './pages/CitationManagerPage';
import PresentationWizardPage from './pages/PresentationWizardPage';
import DefenseSimulationPage from './pages/DefenseSimulationPage';
import BrainstormingPage from './pages/BrainstormingPage';
import PdfChatPage from './pages/PdfChatPage';
import CollaborationPage from './pages/CollaborationPage';
import OlahDataPage from './pages/OlahDataPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/proposal/new" element={<ProposalWizardPage />} />
        <Route path="/proposal-wizard" element={<ProposalWizardPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/auto-format" element={<AutoFormatPage />} />
        <Route path="/citation-manager" element={<CitationManagerPage />} />
        <Route path="/presentation/new" element={<PresentationWizardPage />} />
        <Route path="/simulation" element={<DefenseSimulationPage />} />
        <Route path="/brainstorming" element={<BrainstormingPage />} />
        <Route path="/pdf-chat" element={<PdfChatPage />} />
        <Route path="/collaboration" element={<CollaborationPage />} />
        <Route path="/olah-data" element={<OlahDataPage />} />
        <Route path="/riwayat" element={<HistoryPage />} />
        <Route path="/pengaturan" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

