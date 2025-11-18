
import React from 'react';
import { Handshake, Play, Phone, Car } from 'lucide-react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
    return (
        <section className="about-us-section">
            <div className="container about-us-container">
                <div className="about-us-grid">
                    {/* Left Column - Images */}
                    <div className="about-us-image-column">
                        <div className="about-us-deco-line"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                            alt="White sports car"
                            className="about-us-image"
                        />
                        <div className="about-us-float-card animate-float">
                            <div className="float-card-icon-wrapper">
                                <Handshake className="float-card-icon" size={32} />
                            </div>
                            <div>
                                <p className="float-card-value">6561+</p>
                                <p className="float-card-label">Satisfied Clients</p>
                            </div>
                        </div>
                    </div>
                    {/* Right Column - Text Content */}
                    <div className="about-us-text-column">
                        <p className="about-us-subtitle">
                            <span className="subtitle-line"></span>
                            ABOUT OUR COMPANY
                        </p>
                        <h2 className="about-us-title">
                            Services With A Wide Range Of Cars
                        </h2>
                        <p className="about-us-description">
                            Whether you're embarking on a cross-country adventure or exploring a new destination by car, finding the right car rental vehicle is essential for a stress-free journey. Here are some rental car tips to help you score.
                        </p>
                        <div className="about-us-actions">
                             <div className="emergency-call">
                                <div className="agent-image-wrapper">
                                    <img 
                                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Support agent"
                                        className="agent-image"
                                    />
                                    <span className="online-indicator">
                                        <Phone className="online-indicator-icon" size={12} fill="currentColor" />
                                    </span>
                                </div>
                                <div>
                                    <p className="emergency-label">Emergency Call Us</p>
                                    <p className="emergency-number">+91 2569 003 452</p>
                                </div>
                             </div>
                             <button className="about-more-btn">
                                <span className="btn-hover-overlay"></span>
                                <div className="btn-skew-bg"></div>
                                <div className="btn-content">
                                    <Car size={20} />
                                    <span>ABOUT MORE</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Decorative elements */}
            <div className="deco-circle-sm">11%</div>
            <svg className="deco-svg-path" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.18,34.33 C15.42,14.07 33.74,5.43 52.88,6.00 C77.58,6.72 96.63,27.94 94.39,52.23 C92.16,76.52 70.36,95.94 45.66,95.22 C20.96,94.50 1.91,73.28 4.15,48.99 C5.20,37.60 11.66,27.65 21.68,22.33" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5, 15"/>
            </svg>
        </section>
    );
}

export default AboutUs;