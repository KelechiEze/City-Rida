
import React from 'react';
import { TicketCheck, MapPin, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './Services.css';

const services = [
    {
        icon: <TicketCheck size={32} className="service-icon" />,
        title: "Easier & Faster Bookings",
    },
    {
        icon: <MapPin size={32} className="service-icon" />,
        title: "Too Many Pickup Locations",
    },
    {
        icon: (
            <div className="service-icon-special">
                <Users size={32} className="service-icon" />
                <div className="service-icon-stars">
                    <Star size={8} className="star-icon" fill="currentColor"/>
                    <Star size={8} className="star-icon" fill="currentColor" style={{transform: 'translateY(-2px)'}}/>
                    <Star size={8} className="star-icon" fill="currentColor"/>
                </div>
            </div>
        ),
        title: "Customers 100% Satisfied",
    },
];

const Services: React.FC = () => {
    return (
        <section className="services-section">
            <div 
                className="services-bg-texture"
                style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/subtle-dark-matter.png')"}}
            ></div>
            <div className="deco-pulse-dot"></div>

            <div className="container services-container">
                <div className="services-box">
                    <div className="services-box-dot"></div>
                    <div className="services-content">
                        <div className="services-content-texture" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/concrete-wall.png')"}}></div>
                        
                        <div className="services-grid">
                            {services.map((service, index) => (
                                <div key={index} className="service-item">
                                    <div className="service-icon-wrapper">
                                        {service.icon}
                                    </div>
                                    <h3 className="service-item-title">{service.title}</h3>
                                </div>
                            ))}
                        </div>

                        <div className="services-image-container">
                             <img 
                                src="https://images.unsplash.com/photo-1575496464619-35aalis46a49?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                alt="New York Taxis"
                                className="services-image"
                            />
                             <div className="services-image-overlay"></div>
                        </div>
                    </div>
                </div>

                <div className="services-footer">
                    <div>
                        <p className="services-subtitle">
                            <span className="subtitle-line"></span>
                            OUR SERVICES
                        </p>
                        <h2 className="services-title-main">
                            We're Partner Of<br/>Your Business
                        </h2>
                    </div>
                    <div className="services-nav-buttons">
                        <button className="services-nav-btn">
                            <ChevronLeft size={24} className="services-nav-icon" />
                        </button>
                        <button className="services-nav-btn">
                            <ChevronRight size={24} className="services-nav-icon" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="services-deco-circle">21%</div>
        </section>
    );
};

export default Services;