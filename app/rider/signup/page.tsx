
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, CheckSquare, Phone, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import '../../../pages/Auth.css';

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

export default function RiderSignUpPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login('rider');
        router.push('/rider/dashboard/overview');
    };

    return (
        <div className="auth-container">
            <div className="auth-card-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <Logo />
                        <h2 className="auth-title">Become a CityRide Driver</h2>
                        <p className="auth-subtitle">Start earning on your own schedule.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <User className="input-icon" size={20} />
                            <input type="text" placeholder="Full Name" required className="auth-input" />
                        </div>
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input type="email" placeholder="Email Address" required className="auth-input" />
                        </div>
                         <div className="input-group">
                            <Phone className="input-icon" size={20} />
                            <input type="tel" placeholder="Phone Number" required className="auth-input" />
                        </div>
                        <div className="input-group">
                            <Shield className="input-icon" size={20} />
                            <input type="text" placeholder="Driver's License Number" required className="auth-input" />
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
                         <div className="terms-label">
                            <input type="checkbox" id="terms" required className="terms-checkbox" />
                            <label htmlFor="terms">
                                I agree to the <a href="#" className="form-link">Driver Terms of Service</a> and <a href="#" className="form-link">Privacy Policy</a>.
                            </label>
                        </div>
                        <button type="submit" className="submit-btn">
                            <CheckSquare size={20} />
                            <span>CREATE RIDER ACCOUNT</span>
                        </button>
                    </form>
                    <p className="auth-footer-text">
                        Already have an account? <Link href="/rider/login" className="form-link">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
