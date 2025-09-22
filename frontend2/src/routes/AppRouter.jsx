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
import AboutPage from '../pages/AboutPage'; // Import the new page

// Event Pages
import EventsPage from '../pages/EventsPage';
import EventDetailPage from '../pages/EventDetailPage';
import CreateEventPage from '../pages/CreateEventPage';
import EditEventPage from '../pages/EditEventPage';

// Forum Pages
import ForumPage from '../pages/ForumPage';
import CreatePostPage from '../pages/CreatePostPage';
import EditPostPage from '../pages/EditPostPage';
import EventManagerPage from '../pages/EventManagerPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public Routes
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'about', element: <AboutPage /> }, // Add the new route
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
        path: 'events/create',
        element: <ProtectedRoute><CreateEventPage /></ProtectedRoute>,
      },
      {
        path: 'events/:id/edit',
        element: <ProtectedRoute><EditEventPage /></ProtectedRoute>,
      },
      {
        path: 'forum/create',
        element: <ProtectedRoute><CreatePostPage /></ProtectedRoute>,
      },
      {
        path: 'forum/:id/edit',
        element: <ProtectedRoute><EditPostPage /></ProtectedRoute>,
      },
      {
        path: 'manage/events',
        element: <ProtectedRoute><EventManagerPage /></ProtectedRoute>,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;