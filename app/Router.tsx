
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { DashboardLayout } from '../components/Layout';
import { Role } from '../types';

// Public Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPassword from '../pages/ForgotPassword';
import AboutPage from '../pages/AboutPage';

// Dashboard Pages
import UserDashboard from '../pages/UserDashboard';
import ManagerDashboard from '../pages/ManagerDashboard';
import CEODashboard from '../pages/CEODashboard';
import AdminDashboard from '../pages/AdminDashboard';

// Feature Pages
import TasksPage from '../pages/TasksPage';
import CollaboratorPage from '../pages/CollaboratorPage';
import MeetingsPage from '../pages/MeetingsPage';
import PerformancePage from '../pages/PerformancePage';
import CareerPage from '../pages/CareerPage';
import CompanyPage from '../pages/CompanyPage';
import VerificationPage from '../pages/VerificationPage';
import ProfilePage from '../pages/ProfilePage';
import TeamsPage from '../pages/TeamsPage';
import TaskAllocationPage from '../pages/TaskAllocationPage';
import ReportsPage from '../pages/ReportsPage';
import PromotionsPage from '../pages/PromotionsPage';
import RevenuePage from '../pages/RevenuePage';
import MethodologyPage from '../pages/MethodologyPage';
import HiringPage from '../pages/HiringPage';
import InterviewsPage from '../pages/InterviewsPage';
import UsersManagementPage from '../pages/UsersManagementPage';
import CompaniesManagementPage from '../pages/CompaniesManagementPage';
import AIControlPanel from '../pages/AIControlPanel';
import FraudPanel from '../pages/FraudPanel';
import ResumeValidationPage from '../pages/ResumeValidationPage';
import EditorPage from '../pages/EditorPage';

const PrivateRoute: React.FC<{ children: React.ReactNode; roles?: Role[] }> = ({ children, roles }) => {
  const { currentUser } = useSimulation();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const RoleBasedDashboard = () => {
  const { currentUser } = useSimulation();
  if (currentUser?.role === Role.CEO) return <CEODashboard />;
  if (currentUser?.role === Role.MANAGER) return <ManagerDashboard />;
  if (currentUser?.role === Role.ADMIN) return <AdminDashboard />;
  return <UserDashboard />;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<AboutPage />} />
      
      {/* Main Dashboard */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <RoleBasedDashboard />
        </PrivateRoute>
      } />

      {/* Editor Route (No Layout - Full Screen) */}
      <Route path="/dashboard/editor/:taskId" element={
        <EditorPage /> 
      } />

      {/* Common Authenticated Routes */}
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/company" element={<PrivateRoute roles={[Role.USER, Role.MANAGER, Role.CEO]}><CompanyPage /></PrivateRoute>} />
      <Route path="/meetings" element={<PrivateRoute roles={[Role.USER, Role.MANAGER, Role.CEO]}><MeetingsPage /></PrivateRoute>} />
      <Route path="/collaborator" element={<PrivateRoute roles={[Role.USER, Role.MANAGER]}><CollaboratorPage /></PrivateRoute>} />
      <Route path="/performance" element={<PrivateRoute roles={[Role.USER, Role.MANAGER]}><PerformancePage /></PrivateRoute>} />

      {/* Role Specific Routes: USER */}
      <Route path="/tasks" element={<PrivateRoute roles={[Role.USER]}><TasksPage /></PrivateRoute>} />
      <Route path="/career" element={<PrivateRoute roles={[Role.USER]}><CareerPage /></PrivateRoute>} />
      <Route path="/verification" element={<PrivateRoute roles={[Role.USER]}><VerificationPage /></PrivateRoute>} />
      
      {/* Interview Access for Candidates (Users) and Hiring Managers */}
      <Route path="/interviews" element={<PrivateRoute roles={[Role.USER, Role.MANAGER, Role.CEO]}><InterviewsPage /></PrivateRoute>} />

      {/* Role Specific Routes: MANAGER */}
      <Route path="/team" element={<PrivateRoute roles={[Role.MANAGER]}><TeamsPage /></PrivateRoute>} />
      <Route path="/allocation" element={<PrivateRoute roles={[Role.MANAGER]}><TaskAllocationPage /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute roles={[Role.MANAGER]}><ReportsPage /></PrivateRoute>} />
      <Route path="/promotions" element={<PrivateRoute roles={[Role.MANAGER, Role.CEO]}><PromotionsPage /></PrivateRoute>} />
      
      {/* Hiring & Validation Routes */}
      <Route path="/resume-validation" element={<PrivateRoute roles={[Role.MANAGER, Role.CEO]}><ResumeValidationPage /></PrivateRoute>} />
      <Route path="/hiring" element={<PrivateRoute roles={[Role.MANAGER, Role.CEO]}><HiringPage /></PrivateRoute>} />

      {/* Role Specific Routes: CEO */}
      <Route path="/revenue" element={<PrivateRoute roles={[Role.CEO]}><RevenuePage /></PrivateRoute>} />
      <Route path="/methodology" element={<PrivateRoute roles={[Role.CEO]}><MethodologyPage /></PrivateRoute>} />
      
      {/* Role Specific Routes: ADMIN */}
      <Route path="/admin" element={<PrivateRoute roles={[Role.ADMIN]}><AdminDashboard /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute roles={[Role.ADMIN]}><UsersManagementPage /></PrivateRoute>} />
      <Route path="/companies" element={<PrivateRoute roles={[Role.ADMIN]}><CompaniesManagementPage /></PrivateRoute>} />
      <Route path="/ai-control" element={<PrivateRoute roles={[Role.ADMIN]}><AIControlPanel /></PrivateRoute>} />
      <Route path="/fraud" element={<PrivateRoute roles={[Role.ADMIN]}><FraudPanel /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
