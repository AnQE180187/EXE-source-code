import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Events from '@/pages/Events'
import EventDetail from '@/pages/EventDetail'
import Forum from '@/pages/Forum'
import CreatePost from '@/pages/CreatePost'
import EventManagement from '@/pages/EventManagement'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import NotFound from '@/pages/NotFound'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import PrivateRoute from '@/components/common/PrivateRoute'
import ProfileDetail from '@/components/profile/ProfileDetail'
import ForumPostDetail from '@/components/profile/ForumPostDetail'
import RegisteredEvents from '@/pages/RegisteredEvents'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public routes with MainLayout */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
        <Route path="/events/:id" element={<MainLayout><EventDetail /></MainLayout>} />
        
        {/* Protected routes with MainLayout */}
        <Route path="/forum" element={
          <PrivateRoute>
            <MainLayout><Forum /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/forum/create" element={
          <PrivateRoute>
            <MainLayout><CreatePost /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/forum/:postId" element={
          <PrivateRoute>
            <MainLayout><ForumPostDetail /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/registered-events" element={
          <PrivateRoute>
            <MainLayout><RegisteredEvents /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/events/manage" element={
          <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
            <MainLayout>
              <EventManagement />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <MainLayout><ProfileDetail /></MainLayout>
          </PrivateRoute>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </Router>
  )
}

export default AppRouter 