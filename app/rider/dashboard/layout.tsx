
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/rider/dashboard/Sidebar';
import BottomNav from '../../../components/rider/dashboard/BottomNav';
import '../../../layouts/DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const RiderDashboardLayoutComponent: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/rider/login');
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar-container">
        <Sidebar onLogout={handleLogout} />
      </div>
      <main className="main-content">
        <div className="main-content-inner">
          {children}
        </div>
      </main>
      <div className="bottom-nav-container">
        <BottomNav onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default function RiderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated || userType !== 'rider') {
        router.replace('/rider/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, userType, router]);

  if (!isAuthenticated || userType !== 'rider') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <RiderDashboardLayoutComponent>
      {children}
    </RiderDashboardLayoutComponent>
  );
}
