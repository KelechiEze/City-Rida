
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/dashboard/Sidebar';
import BottomNav from '../../components/dashboard/BottomNav';
import '../../layouts/DashboardLayout.css';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayoutComponent: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar for medium screens and up */}
      <div className="sidebar-container">
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-content-inner">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for small screens */}
      <div className="bottom-nav-container">
        <BottomNav onLogout={handleLogout} />
      </div>
    </div>
  );
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // A slight delay to allow auth state to initialize
    const timer = setTimeout(() => {
        if (!isAuthenticated || userType !== 'passenger') {
            router.replace('/login');
        }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, userType, router]);

  if (!isAuthenticated || userType !== 'passenger') {
    // Render a loader or null while the redirect happens
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayoutComponent>
      {children}
    </DashboardLayoutComponent>
  );
}
