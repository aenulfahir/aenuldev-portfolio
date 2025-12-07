import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import GeneralSettings from "./pages/admin/GeneralSettings";
import ProfileEditor from "./pages/admin/ProfileEditor";
import ProjectManager from "./pages/admin/ProjectManager";
import PricingManager from "./pages/admin/PricingManager";
import BlogManager from "./pages/admin/BlogManager";
import ContactManager from "./pages/admin/ContactManager";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomCursor from "./components/CustomCursor";
import BackgroundAnimation from "./components/BackgroundAnimation";
import Chatbot from "./components/Chatbot";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <CustomCursor />
        <BackgroundAnimation />
        <Chatbot />
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes - Protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<GeneralSettings />} />
              <Route path="profile" element={<ProfileEditor />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="pricing" element={<PricingManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="contact" element={<ContactManager />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
