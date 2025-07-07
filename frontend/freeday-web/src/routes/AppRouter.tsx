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

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes with MainLayout */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
        <Route path="/events/:id" element={<MainLayout><EventDetail /></MainLayout>} />
        <Route path="/forum" element={<MainLayout><Forum /></MainLayout>} />
        <Route path="/forum/create" element={<MainLayout><CreatePost /></MainLayout>} />
        <Route path="/events/manage" element={<MainLayout><EventManagement /></MainLayout>} />
        
        {/* Public routes without MainLayout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 404 route */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </Router>
  )
}

export default AppRouter 