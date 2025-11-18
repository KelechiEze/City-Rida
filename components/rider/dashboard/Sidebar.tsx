'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, User, LogOut, DollarSign, ListTodo } from 'lucide-react';
import '../../../components/dashboard/Sidebar.css';

const Logo: React.FC = () => (
    <Link href="/" className="sidebar-logo">
        <svg width="40" height="24" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 19C2.46243 19 0 16.5376 0 13.5C0 10.4624 2.46243 8 5.5 8H44.5C47.5376 8 50 10.4624 50 13.5C50 16.5376 47.5376 19 44.5 19H39L36.5 24H13.5L11 19H5.5Z" fill="#FFC107"/>
            <path d="M12 11C12 9.89543 12.8954 9 14 9H36C37.1046 9 38 9.89543 38 11V19H12V11Z" fill="#111111"/>
            <circle cx="10" cy="22" r="4" fill="black" stroke="#FFC107" strokeWidth="1.5"/>
            <circle cx="40" cy="22" r="4" fill="black" stroke="#FFC107" strokeWidth="1.5"/>
        </svg>
        <span className="sidebar-logo-text">CITYRIDE</span>
    </Link>
);

const navItems = [
    { name: 'Overview', path: '/rider/dashboard/overview', icon: LayoutDashboard },
    { name: 'My Trips', path: '/rider/dashboard/trips', icon: ListTodo },
    { name: 'Vehicles', path: '/rider/dashboard/vehicles', icon: Car },
    { name: 'Earnings', path: '/rider/dashboard/earnings', icon: DollarSign },
    { name: 'Profile', path: '/rider/dashboard/profile', icon: User },
];

const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-main">
                <Logo />
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={
                                `sidebar-nav-link ${pathname.startsWith(item.path) ? 'active' : 'inactive'}`
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="sidebar-footer">
                <button
                    onClick={onLogout}
                    className="logout-button"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;