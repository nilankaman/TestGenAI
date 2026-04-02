import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import AppShell from "@/components/layout/AppShell";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import GeneratePage from "@/pages/GeneratePage";
import AiChatPage from "@/pages/AiChatPage";
import TeamPage from "@/pages/TeamPage";
import ProjectsPage from "@/pages/ProjectsPage";
import HistoryPage from "@/pages/HistoryPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import SearchPage from "@/pages/SearchPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import PaymentPage from "@/pages/PaymentPage";
import AttachmentsPage from "@/pages/AttachmentsPage";
import AdminPage from "@/pages/AdminPage";
import PortfolioPage from "@/pages/PortfolioPage";
import CiCdGeneratorPage from "@/pages/CiCdGeneratorPage";
import JiraPage from "@/pages/JiraPage";
import ConfluencePage from "@/pages/ConfluencePage";
import CiCdPage from "@/pages/CiCdPage";
import NotFoundPage from "@/pages/NotFoundPage";

function Guard({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function GuestOnly({ children }) {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? children : <Navigate to="/home" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        }
      />

      <Route
        element={
          <Guard>
            <AppShell />
          </Guard>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/chat" element={<AiChatPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/attachments" element={<AttachmentsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/cicd-generator" element={<CiCdGeneratorPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/integrations/jira" element={<JiraPage />} />
        <Route path="/integrations/confluence" element={<ConfluencePage />} />
        <Route path="/integrations/cicd" element={<CiCdPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
