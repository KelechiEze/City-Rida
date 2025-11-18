
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, Phone, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Logo: React.FC = () => (
    <div className="logo">
        <svg width="50" height="30" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 19C2.46243 19 0 16.5376 0 13.5C0 10.4624 2.46243 8 5.5 8H44.5C47.5376 8 50 10.4624 50 13.5C50 16.5376 47.5376 19 44.5 19H39L36.5 24H13.5L11 19H5.5Z" fill="#FFC107"/>
            <path d="M12 11C12 9.89543 12.8954 9 14 9H36C37.1046 9 38 9.89543 38 11V19H12V11Z" fill="#111111"/>
            <circle cx="10" cy="22" r="4" fill="black" stroke="#FFC107" strokeWidth="1.5"/>
            <circle cx="40" cy="22" r="4" fill="black" stroke="#FFC107" strokeWidth="1.5"/>
        </svg>
        <span className="logo-text">CITYRIDE</span>
    </div>
);


const NavLinks: React.FC<{className?: string, onLinkClick?: () => void}> = ({ className, onLinkClick }) => {
    const links = [
        { name: "HOME", path: "/" },
    ];

    const pathname = usePathname();

    return (
        <nav className={`nav-links ${className || ''}`}>
            {links.map((link) => (
                <Link 
                    key={link.name} 
                    href={link.path} 
                    onClick={onLinkClick}
                    className={`nav-link ${pathname === link.path ? 'active' : ''}`}>
                    {link.name}
                </Link>
            ))}
        </nav>
    );
};

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, userType } = useAuth();

    const getDashboardPath = () => {
        if (!isAuthenticated) return "/login";
        return userType === 'rider' ? '/rider/dashboard' : '/dashboard';
    }

    return (
        <header className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link href="/"><Logo /></Link>

                    {/* Desktop Navigation */}
                    <div className="desktop-nav">
                        <NavLinks />
                        <div className="nav-icons">
                            <Search className="nav-icon" size={20}/>
                            <ShoppingCart className="nav-icon" size={20}/>
                        </div>
                    </div>
                    
                    <div className="desktop-actions">
                         <div className="phone-contact">
                            <div className="phone-contact-bg" style={{
                                backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 6px)'
                            }}></div>
                            <div className="phone-contact-content">
                                <Phone className="phone-icon" size={24}/>
                                <span className="phone-number">+91 526 420 009</span>
                            </div>
                         </div>
                         <Link href={getDashboardPath()} className="book-taxi-btn">
                            <div className="book-taxi-btn-bg"></div>
                            <span className="book-taxi-btn-text">BOOK A TAXI</span>
                         </Link>
                         <Link href="/rider/login" className="drive-btn">
                            DRIVE WITH US
                         </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="mobile-menu-button">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                 <div className="mobile-menu">
                    <div className="container mobile-menu-content">
                        <NavLinks className="mobile-nav-links" onLinkClick={() => setIsMenuOpen(false)}/>
                        <div className="mobile-nav-icons">
                             <Search className="nav-icon" size={24}/>
                             <ShoppingCart className="nav-icon" size={24}/>
                        </div>
                        <div className="mobile-phone-contact">
                            <Phone className="phone-icon" size={24}/>
                            <span className="phone-number">+91 526 420 009</span>
                        </div>
                        <Link href={getDashboardPath()} onClick={() => setIsMenuOpen(false)} className="mobile-book-btn">
                           BOOK A TAXI
                        </Link>
                        <Link href="/rider/login" onClick={() => setIsMenuOpen(false)} className="mobile-drive-btn">
                           DRIVE WITH US
                        </Link>
                    </div>
                 </div>
            )}
        </header>
    );
};

export default Navbar;
