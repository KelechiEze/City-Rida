
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../pages/Auth.css';

const Logo: React.FC = () => (
    <Link href="/" className="auth-logo">
        <svg width="50" height="30" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 19C2.46243 19 0 16.5376 0 13.5C0 10.4624 2.46243 8 5.5 8H44.5C47.5376 8 50 10.4624 50 13.5C50 16.5376 47.5376 19 44.5 19H39L36.5 24H13.5L11 19H5.5Z" fill="#FFC107"/>
            <path d="M12 11C12 9.89543 12.8954 9 14 9H36C37.1046 9 38 9.89543 38 11V19H12V11Z" fill="#111111"/>
            <circle cx="10" cy="22" r="4" fill="black" stroke="#FFC107" strokeWidth="1.5"/>
            <circle cx="40" cy="22" r="4" fill="black" stroke="#FFC107" strokeWidth="1.5"/>
        </svg>
        <span className="auth-logo-text">CITYRIDE</span>
    </Link>
);

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login('passenger');
        router.push('/dashboard/overview');
    };

    return (
        <div className="auth-container">
            <div className="auth-card-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <Logo />
                        <h2 className="auth-title">Welcome Back!</h2>
                        <p className="auth-subtitle">Login to continue your journey with Cityride.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                className="auth-input"
                            />
                        </div>
                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                required
                                className="auth-input password-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" className="checkbox" />
                                Remember me
                            </label>
                            <a href="#" className="form-link">Forgot Password?</a>
                        </div>
                        <button
                            type="submit"
                            className="submit-btn"
                        >
                            <LogIn size={20} />
                            <span>LOG IN</span>
                        </button>
                    </form>
                    <div className="divider">
                        <div className="divider-line-wrapper">
                            <div className="divider-line"></div>
                        </div>
                        <div className="divider-text-wrapper">
                            <span className="divider-text">Or continue with</span>
                        </div>
                    </div>
                    <div className="social-login-grid">
                        <button className="social-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.1v2.7h5.1c-.5 2.5-2.7 4.4-5.1 4.4-3 0-5.5-2.5-5.5-5.5s2.5-5.5 5.5-5.5c1.4 0 2.5.5 3.4 1.4l2.1-2.1C15.2 4.6 13.2 4 11.25 4c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5c4.3 0 7.2-2.9 7.2-7.3 0-.5-.1-.9-.2-1.3z"/></svg>
                            <span className="social-btn-text">Google</span>
                        </button>
                         <button className="social-btn">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19.1.5C16.8.4 14.8 2 13.5 3.7c-1.2 1.7-1.3 4 .3 6.3c-2.3 1-4.9 1.4-6.8.5c-2.3-1.1-4-3.3-4-6c0-2.3 1.2-4.9 3.8-5.3c2.4-.4 4.8 1.5 6 3.1c.3.4.6.8 1 1.1c1.3-1.8 3-3.1 5.3-3.1zm.9 8c-1.9-.1-3.7 1-4.7 2.4c-1.3 1.7-1.4 4.3.4 6.4c-2.4 1-5 1.2-6.8.2c-2.3-1.2-4-3.3-3.8-6c0-2.3 1-4.9 3.8-5.2c2.5-.3 4.8 1.7 6 3.3c.3.4.6.8 1 1.2c1.3-1.8 3-3.3 5.3-3.3c.2 0 .4 0 .6.1c-2.4 1.4-3.7 3.8-3.6 6.3z"/></svg>
                           <span className="social-btn-text">Apple</span>
                        </button>
                    </div>
                    <p className="auth-footer-text">
                        Don't have an account? <Link href="/signup" className="form-link">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
