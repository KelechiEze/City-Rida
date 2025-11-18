'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Car } from 'lucide-react';
import { gsap } from 'gsap';
import './WhyChooseUs.css';

const tabs = ['Car Booking', 'Pathfinder', 'Pickup Price', 'Transport'];

const contentData = {
    'Car Booking': {
        title: 'Easy Integrations',
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
        features: [
            "Easy & Emergency Solutions",
            "More Reliable & Experienced",
            "100% Satisfaction Guarantee",
            "Getting Affordable Price",
            "Award Winning Company",
            "Many Pickup Locations"
        ],
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1502&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    'Pathfinder': {
        title: 'Advanced Route Optimization',
        description: "Our Pathfinder system uses real-time traffic data and advanced algorithms to ensure you always get the fastest and most efficient route to your destination, saving you time and money.",
        features: [
            "Real-Time Traffic Analysis",
            "Smart GPS Navigation",
            "Shortest Route Guarantee",
            "ETA Prediction & Updates",
            "Avoids Congestion Zones",
            "Multi-Stop Route Planning"
        ],
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1502&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    'Pickup Price': {
        title: 'Transparent & Fair Pricing',
        description: "No more surprises. With our transparent pricing model, you know the exact cost of your ride before you book. We believe in honesty and providing affordable rates without hidden fees.",
        features: [
            "Upfront Fare Estimates",
            "No Hidden Charges",
            "Multiple Payment Options",
            "Competitive Low Rates",
            "In-App Digital Receipts",
            "Surge Price Alerts"
        ],
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1502&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    'Transport': {
        title: 'Diverse Fleet for Every Need',
        description: "From solo trips to group outings, we have a wide range of vehicles to suit your needs. Choose from standard sedans, spacious SUVs, or luxury cars for a comfortable and stylish ride.",
        features: [
            "Sedans, SUVs, & Luxury Cars",
            "Airport Transfer Specialists",
            "Corporate Travel Solutions",
            "24/7 Availability",
            "Well-Maintained Vehicles",
            "Professional, Vetted Drivers"
        ],
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1502&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
};

const WhyChooseUs: React.FC = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const contentRef = useRef<HTMLDivElement>(null);

    const activeContent = contentData[activeTab as keyof typeof contentData];

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
            );
        }
    }, [activeTab]);

    return (
        <section className="why-choose-us-section">
            <div className="container">
                <div className="section-header">
                    <p className="section-subtitle">
                        <span className="subtitle-line"></span>
                        WHY CHOOSE US
                        <span className="subtitle-line"></span>
                    </p>
                    <h2 className="section-title">
                        Most Trusted Cab Company In USA
                    </h2>
                </div>

                <div className="tabs-container">
                    {tabs.map(tab => (
                       <div key={tab} className="tab-wrapper">
                            <button
                                onClick={() => setActiveTab(tab)}
                                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                            >
                                {tab}
                            </button>
                            <div
                                className="tab-pointer"
                                style={{
                                    borderTopColor: activeTab === tab ? '#FFC107' : 'transparent'
                                }}
                            ></div>
                        </div>
                    ))}
                </div>

                <div ref={contentRef} className="tab-content-container" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')"}}>
                    <div className="tab-content-grid">
                        <div>
                            <h3 className="content-title">{activeContent.title}</h3>
                            <p className="content-description">
                                {activeContent.description}
                            </p>
                            <div className="features-grid">
                                {activeContent.features.map(feature => (
                                    <div key={feature} className="feature-item">
                                        <CheckCircle2 className="feature-icon" size={20} fill="#FFC107" stroke="white" strokeWidth={1} />
                                        <span className="feature-text">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="book-btn-wrapper">
                                <button
                                    className="book-btn"
                                    style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
                                >
                                    <Car size={20} />
                                    <span>BOOK A TAXI</span>
                                </button>
                                <div
                                    className="book-btn-border"
                                    style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
                                ></div>
                            </div>

                        </div>
                        <div>
                            <img 
                                key={activeContent.image}
                                src={activeContent.image}
                                alt={activeContent.title}
                                className="content-image"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;
