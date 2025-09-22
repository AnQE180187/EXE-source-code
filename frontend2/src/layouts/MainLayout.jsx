import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import './MainLayout.css';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="main-layout">
      <Header />
      {/* Apply a specific class for the homepage to allow for a full-width hero section */}
      <main className={isHomePage ? "main-content--home" : "main-content--default"}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;