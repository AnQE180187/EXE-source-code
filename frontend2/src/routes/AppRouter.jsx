import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layout
import MainLayout from '../layouts/MainLayout';

// Components
import ProtectedRoute from './ProtectedRoute';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import ProfilePage from '../pages/ProfilePage';
import PaymentPage from '../pages/PaymentPage';
import MyEventsPage from '../pages/MyEventsPage';
import AboutPage from '../pages/AboutPage';

// Event Pages
import EventsPage from '../pages/EventsPage';
import EventDetailPage from '../pages/EventDetailPage';
import TicketPage from '../pages/TicketPage';

// Forum Pages
import ForumPage from '../pages/ForumPage';
import EventManagerPage from '../pages/EventManagerPage';
import OrganizerPricingPage from '../pages/OrganizerPricingPage';
import OrganizerPaymentPage from '../pages/OrganizerPaymentPage';
import { AdminRoute } from './AdminRoute';
import AdminLayout from '../admin/layouts/AdminLayout';
import DashboardPage from '../admin/pages/DashboardPage';
import { Navigate } from 'react-router-dom';
import UserManagementPage from '../admin/pages/UserManagementPage';
import ModerationPage from '../admin/pages/ModerationPage';
import PaymentManagementPage from '../admin/pages/PaymentManagementPage';
import AdminEventManagementPage from '../admin/pages/AdminEventManagementPage';
import UserPricingPage from '../pages/UserPricingPage';
import UserPaymentPage from '../pages/UserPaymentPage';
import ReportManagementPage from '../admin/pages/ReportManagementPage';
import AuditLogsPage from '../admin/pages/AuditLogsPage';
import SettingsPage from '../admin/pages/SettingsPage';


import PaymentQRPage from '../pages/PaymentQRPage';
import PayoutSettingsPage from '../pages/PayoutSettingsPage';
import WalletPage from '../pages/WalletPage';
import ChatPage from '../pages/ChatPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public Routes
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      { path: 'events/:id/ticket', element: <ProtectedRoute><TicketPage /></ProtectedRoute> },
      { path: 'forum', element: <ForumPage /> },

      // Protected Routes
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: 'change-password',
        element: <ProtectedRoute><ChangePasswordPage /></ProtectedRoute>,
      },
      {
        path: 'my-events',
        element: <ProtectedRoute><MyEventsPage /></ProtectedRoute>,
      },
      {
        path: 'payment',
        element: <ProtectedRoute><PaymentPage /></ProtectedRoute>,
      },
      {
        path: 'payment-qr',
        element: <ProtectedRoute><PaymentQRPage /></ProtectedRoute>,
      },
      {
        path: 'payout-settings',
        element: <ProtectedRoute><PayoutSettingsPage /></ProtectedRoute>,
      },
      {
        path: 'wallet',
        element: <ProtectedRoute><WalletPage /></ProtectedRoute>,
      },
      {
        path: 'manage/events',
        element: <ProtectedRoute><EventManagerPage /></ProtectedRoute>,
      },
      {
        path: 'pricing',
        element: <ProtectedRoute><OrganizerPricingPage /></ProtectedRoute>,
      },
      {
        path: 'pricing/user',
        element: <ProtectedRoute><UserPricingPage /></ProtectedRoute>,
      },
      {
        path: 'organizer-payment',
        element: <ProtectedRoute><OrganizerPaymentPage /></ProtectedRoute>,
      },
      {
        path: 'user-payment',
        element: <ProtectedRoute><UserPaymentPage /></ProtectedRoute>,
      },
      {
        path: 'chat',
        element: <ProtectedRoute><ChatPage /></ProtectedRoute>,
      },
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'users', element: <UserManagementPage /> },
          { path: 'moderation', element: <ModerationPage /> },
          { path: 'payments', element: <PaymentManagementPage /> },
          { path: 'events', element: <AdminEventManagementPage /> },
          { path: 'reports', element: <ReportManagementPage /> },
          { path: 'audit-logs', element: <AuditLogsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          // Add other admin pages here
        ],
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;