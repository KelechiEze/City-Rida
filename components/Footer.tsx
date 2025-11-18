'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, Facebook, Twitter, Linkedin, Youtube, ArrowRight, ChevronUp, ChevronRight } from 'lucide-react';
import './Footer.css';

const Logo: React.FC = () => (
    <div className="footer-logo">
        <svg width="50" height="30" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 19C2.46243 19 0 16.5376 0 13.5C0 10.4624 2.46243 8 5.5 8H44.5C47.5376 8 50 10.4624 50 13.5C50 16.5376 47.5376 19 44.5 19H39L36.5 24H13.5L11 19H5.5Z" fill="#FFC107"/>
            <path d="M12 11C12 9.89543 12.8954 9 14 9H36C37.1046 9 38 9.89543 38 11V19H12V11Z" fill="#111111"/>
            <circle cx="10" cy="22" r="4" fill="black" stroke="#FFC107" strokeWidth="1.5"/>
            <circle cx="40" cy="22" r="4" fill="black" stroke="#FFC107" strokeWidth="1.5"/>
        </svg>
        <span className="footer-logo-text">CITYRIDE</span>
    </div>
);

const Footer: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <footer className="footer">
            <div className="footer-top">
                <div 
                    className="footer-bg-image"
                    style={{backgroundImage: "url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop')"}}
                ></div>
                <div className="container footer-container">
                    <div className="footer-grid">
                        {/* Column 1: About */}
                        <div className="footer-column">
                            <Logo />
                            <p className="footer-description">Phasellus ultricies aliquam volutpat ullamcorper laoreet neque, a lacinia curabitur lacinia mollis.</p>
                            <div className="social-links">
                                <a href="#" className="social-link"><Facebook size={18} /></a>
                                <a href="#" className="social-link"><Twitter size={18} /></a>
                                <a href="#" className="social-link"><Linkedin size={18} /></a>
                                <a href="#" className="social-link"><Youtube size={18} /></a>
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div className="footer-column">
                            <h3 className="footer-column-title">Quick Links</h3>
                            <ul className="quick-links-list">
                                {[
                                    { name: 'Home', path: '/' },
                                    { name: 'Book a Taxi', path: '/login' },
                                    { name: 'My Dashboard', path: '/dashboard' },
                                ].map(link => (
                                     <li key={link.name} className="quick-link-item">
                                         <ChevronRight size={16} className="quick-link-icon" />
                                         <Link href={link.path}>{link.name}</Link>
                                     </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Recent Posts */}
                        <div className="footer-column">
                            <h3 className="footer-column-title">Recent Posts</h3>
                            <div className="recent-posts-list">
                                <div className="recent-post-item">
                                    <img src="https://images.unsplash.com/photo-1575496464619-35aalis46a49?q=80&w=100&h=100&fit=crop" alt="post" className="post-image"/>
                                    <div>
                                        <p className="post-date">20 Feb, 2024</p>
                                        <a href="#" className="post-title">Top 5 Most Famous Technology Trend In 2024</a>
                                    </div>
                                </div>
                                <div className="recent-post-item">
                                    <img src="https://images.unsplash.com/photo-1552642762-049a405421d0?q=80&w=100&h=100&fit=crop" alt="post" className="post-image"/>
                                    <div>
                                        <p className="post-date">15 Dec, 2024</p>
                                        <a href="#" className="post-title">The Surfing Man Will Blow Your Mind</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 4: Contact Us */}
                        <div className="footer-column">
                            <h3 className="footer-column-title">Contact Us</h3>
                             <div className="contact-item">
                                <Mail size={18} className="contact-icon" />
                                <a href="mailto:info@example.com">info@example.com</a>
                            </div>
                             <div className="contact-item">
                                <Phone size={18} className="contact-icon" />
                                <a href="tel:+9156980036420">+91 5698 0036 420</a>
                            </div>
                            <form className="newsletter-form">
                                <div className="newsletter-input-wrapper">
                                    <input type="email" placeholder="Your email address" className="newsletter-input" />
                                    <button type="submit" className="newsletter-submit">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                                <div className="privacy-checkbox-wrapper">
                                    <input type="checkbox" id="privacy" className="privacy-checkbox" />
                                    <label htmlFor="privacy" className="privacy-label">
                                        I agree to the <a href="#" className="privacy-link">Privacy Policy</a>.
                                    </label>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom-bar">
                <div className="container footer-bottom-container">
                    <p className="copyright">&copy; All Copyright 2024 by Cityride</p>
                    <div className="footer-bottom-links">
                        <a href="#">Terms & Condition</a>
                        <a href="#">Privacy Policy</a>
                    </div>
                </div>
            </div>

            {/* Scroll to top button */}
             {isVisible && (
                <button 
                    onClick={scrollToTop} 
                    className="scroll-to-top animate-bounce"
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={24} />
                </button>
            )}
        </footer>
    );
};

export default Footer;
