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
import ProfilePage from '../pages/ProfilePage';
import PaymentPage from '../pages/PaymentPage';
import MyEventsPage from '../pages/MyEventsPage';
import AboutPage from '../pages/AboutPage';

// Event Pages
import EventsPage from '../pages/EventsPage';
import EventDetailPage from '../pages/EventDetailPage';

// Forum Pages
import ForumPage from '../pages/ForumPage';
import EventManagerPage from '../pages/EventManagerPage';
import OrganizerPricingPage from '../pages/OrganizerPricingPage';
import OrganizerPaymentPage from '../pages/OrganizerPaymentPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public Routes
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      { path: 'forum', element: <ForumPage /> },

      // Protected Routes
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
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
        path: 'manage/events',
        element: <ProtectedRoute><EventManagerPage /></ProtectedRoute>,
      },
      {
        path: 'pricing',
        element: <ProtectedRoute><OrganizerPricingPage /></ProtectedRoute>,
      },
      {
        path: 'organizer-payment',
        element: <ProtectedRoute><OrganizerPaymentPage /></ProtectedRoute>,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;