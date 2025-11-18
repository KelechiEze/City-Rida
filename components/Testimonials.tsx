'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import './Testimonials.css';

const testimonialsData = [
  {
    name: 'Leslie Alexander',
    role: 'Web Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quote: "Consectetur adipiscing integer nunc viverra laoreet est the is porta pretium metus aliquam aenean pulvinar.",
    rating: 4.5,
  },
  {
    name: 'Ralph Edwards',
    role: 'Software Tester',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quote: "Consectetur adipiscing integer nunc viverra laoreet est the is porta pretium metus aliquam aenean pulvinar.",
    rating: 5,
  },
  {
    name: 'Eleanor Pena',
    role: 'Ethical Hacker',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&h=100&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quote: "Consectetur adipiscing integer nunc viverra laoreet est the is porta pretium metus aliquam aenean pulvinar.",
    rating: 4,
  },
  {
    name: 'Esther Howard',
    role: 'Project Manager',
    image: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?q=80&w=100&h=100&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quote: "Consectetur adipiscing integer nunc viverra laoreet est the is porta pretium metus aliquam aenean pulvinar.",
    rating: 4.5,
  },
    {
    name: 'Cody Fisher',
    role: 'Data Scientist',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quote: "Consectetur adipiscing integer nunc viverra laoreet est the is porta pretium metus aliquam aenean pulvinar.",
    rating: 5,
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<Star key={i} size={18} className="star filled" fill="currentColor" />);
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(
                <div key={i} className="star-half-wrapper">
                    <Star size={18} className="star empty" fill="currentColor"/>
                    <div className="star-half-inner">
                        <Star size={18} className="star filled" fill="currentColor" />
                    </div>
                </div>
            );
        } else {
            stars.push(<Star key={i} size={18} className="star empty" fill="currentColor" />);
        }
    }
    return <div className="star-rating">{stars}</div>;
};

const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const handlePrev = () => {
        setCurrentIndex(prev => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        if (sliderRef.current && cardRef.current) {
            const cardWidth = cardRef.current.offsetWidth;
            const gap = 32; // Corresponds to gap-8 in CSS
            
            gsap.to(sliderRef.current, {
                x: -(cardWidth + gap) * currentIndex,
                duration: 0.8,
                ease: 'power3.inOut'
            });
        }
    }, [currentIndex]);
    
    return (
        <section className="testimonials-section">
            <div className="container">
                <div className="section-header">
                    <p className="testimonials-subtitle">
                        <span className="subtitle-line-alt"></span>
                        TESTIMONIALS
                        <span className="subtitle-line-alt"></span>
                    </p>
                    <h2 className="section-title">
                        What Our Client's Say<br/>About Us
                    </h2>
                </div>
                
                <div className="slider-container">
                    <div className="slider-wrapper">
                         <div ref={sliderRef} className="slider-track">
                            {testimonialsData.map((testimonial, index) => (
                                <div ref={index === 0 ? cardRef : null} key={index} className="testimonial-card">
                                    <div className="card-header">
                                        <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                                        <div>
                                            <h3 className="author-name">{testimonial.name}</h3>
                                            <p className="author-role">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="quote">"{testimonial.quote}"</p>
                                    <StarRating rating={testimonial.rating} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="slider-nav">
                    <button onClick={handlePrev} className="slider-nav-btn">
                        <ChevronLeft size={28} />
                    </button>
                    <button onClick={handleNext} className="slider-nav-btn">
                        <ChevronRight size={28} />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
