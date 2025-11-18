'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Hero.css';

const slides = [
  {
    titleLine1: "Book Your Taxi From",
    titleLine2: "Anywhere Today...",
    carImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    titleLine1: "Safe & Reliable Rides",
    titleLine2: "With Professional Drivers",
    carImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    titleLine1: "Get To Your Destination",
    titleLine2: "Quickly & Comfortably",
    carImage: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

const Hero: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);
    const carRef = useRef<HTMLImageElement>(null);
    const title1Ref = useRef<HTMLHeadingElement>(null);
    const title2Ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.to([title1Ref.current, title2Ref.current, carRef.current], {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.in',
            stagger: 0.1
        });
        
        tl.add(() => {
            if (title1Ref.current) title1Ref.current.textContent = slides[currentSlide].titleLine1;
            if (title2Ref.current) title2Ref.current.textContent = slides[currentSlide].titleLine2;
            if (carRef.current) carRef.current.src = slides[currentSlide].carImage;
        });
        
        tl.fromTo([title1Ref.current, title2Ref.current], 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.2 }
        );
        tl.fromTo(carRef.current, 
            { opacity: 0, x: 100 },
            { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
            "-=0.8"
        );
    }, [currentSlide]);

    return (
        <section ref={heroRef} className="hero-section">
            {/* Background Shapes */}
            <div className="hero-bg-shapes">
                <div className="hero-bg-shape1"></div>
                <div className="hero-bg-shape2"></div>
                 <div className="hero-bg-shape3"></div>
            </div>
            
            {/* Road */}
            <div className="hero-road">
                <div className="hero-road-gradient"></div>
                <svg className="hero-road-lines" viewBox="0 0 100 10">
                    <path d="M0 5 L40 5 M60 5 L100 5" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2"/>
                </svg>
            </div>

            <div className="container hero-container">
                <div className="hero-grid">
                    {/* Text Content */}
                    <div className="hero-text-content">
                       <div className="hero-dots">
                            {slides.map((_, index) => (
                                <button key={index} onClick={() => setCurrentSlide(index)} className={`hero-dot ${currentSlide === index ? 'active' : ''}`}></button>
                            ))}
                       </div>
                        <h1 ref={title1Ref} className="hero-title">
                            {slides[currentSlide].titleLine1}
                        </h1>
                        <h1 ref={title2Ref} className="hero-subtitle">
                           {slides[currentSlide].titleLine2}
                        </h1>
                    </div>

                    {/* Car Image */}
                    <div className="hero-car-container">
                        <img ref={carRef} src={slides[currentSlide].carImage} alt="Taxi" className="hero-car-image" style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.5))' }}/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
