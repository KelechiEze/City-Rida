'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, History, User } from 'lucide-react';
import './BottomNav.css';

const navItems = [
    { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Book', path: '/dashboard/book', icon: Car },
    { name: 'Trips', path: '/dashboard/trips', icon: History },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
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