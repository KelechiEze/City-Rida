'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, DollarSign, ListTodo, Car } from 'lucide-react';
import '../../../components/dashboard/BottomNav.css';

const navItems = [
    { name: 'Overview', path: '/rider/dashboard/overview', icon: LayoutDashboard },
    { name: 'Trips', path: '/rider/dashboard/trips', icon: ListTodo },
    { name: 'Vehicles', path: '/rider/dashboard/vehicles', icon: Car },
    { name: 'Earnings', path: '/rider/dashboard/earnings', icon: DollarSign },
    { name: 'Profile', path: '/rider/dashboard/profile', icon: User },
];

const BottomNav: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <Link
                    key={item.name}
                    href={item.path}
                    className={
                        `bottom-nav-link ${pathname.startsWith(item.path) ? 'active' : 'inactive'}`
                    }
                >
                    <item.icon size={24} />
                    <span className="bottom-nav-text">{item.name}</span>
                </Link>
            ))}
        </nav>
    );
};

export default BottomNav;