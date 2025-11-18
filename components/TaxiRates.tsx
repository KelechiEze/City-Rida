'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Car } from 'lucide-react';
import { gsap } from 'gsap';
import './TaxiRates.css';

const heroImages = [
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop', // Yellow Lambo
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop', // White Porsche
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop', // Red Mustang
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop'  // Black Ferrari
];

const carData = {
  Toyota: [
    {
      name: 'Supra',
      subtitle: 'Navana Japan',
      image: heroImages[0],
      startingPrice: 120,
      initialCharge: 120,
      additionalCharge: 15,
      seats: '02 Seat',
    },
    {
      name: 'RAV4',
      subtitle: 'Navana Japan',
      image: heroImages[1],
      startingPrice: 95,
      initialCharge: 95,
      additionalCharge: 10,
      seats: '05 Seat',
    },
  ],
  Honda: [
      {
      name: 'NSX',
      subtitle: 'Navana Japan',
      image: heroImages[2],
      startingPrice: 150,
      initialCharge: 150,
      additionalCharge: 18,
      seats: '02 Seat',
    },
  ],
  Chevrolet: [
     {
      name: 'Corvette',
      subtitle: 'Navana Japan',
      image: heroImages[3],
      startingPrice: 140,
      initialCharge: 140,
      additionalCharge: 16,
      seats: '02 Seat',
    },
    {
      name: 'Camaro',
      subtitle: 'Navana Japan',
      image: heroImages[0],
      startingPrice: 110,
      initialCharge: 110,
      additionalCharge: 14,
      seats: '04 Seat',
    },
  ],
  Nissan: [
      {
      name: 'GT-R',
      subtitle: 'Navana Japan',
      image: heroImages[2],
      startingPrice: 160,
      initialCharge: 160,
      additionalCharge: 20,
      seats: '04 Seat',
    }
  ],
};

const brands = ['All', 'Toyota', 'Honda', 'Chevrolet', 'Nissan'];

const TaxiRates: React.FC = () => {
    const [activeBrand, setActiveBrand] = useState('All');
    const carsGridRef = useRef<HTMLDivElement>(null);

    const displayedCars = activeBrand === 'All'
        ? Object.values(carData).flat()
        : carData[activeBrand as keyof typeof carData] || [];
    
    useEffect(() => {
        if (carsGridRef.current) {
            gsap.fromTo(carsGridRef.current.children, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [activeBrand]);

    return (
        <section className="taxi-rates-section">
            <div className="container">
                <div className="section-header">
                    <p className="section-subtitle-alt">
                        <span className="subtitle-line"></span>
                        OUR TAXI RATES
                        <span className="subtitle-line"></span>
                    </p>
                    <h2 className="section-title">
                        Our Flexible Taxi Rates
                    </h2>
                </div>

                <div className="topo-pattern-container">
                    <div 
                        className="topo-pattern"
                        style={{ backgroundImage: "url('https://i.ibb.co/hZJ3TjY/topo-pattern.png')" }}
                    ></div>
                </div>

                <div className="brands-filter">
                    {brands.map(brand => (
                        <button
                            key={brand}
                            onClick={() => setActiveBrand(brand)}
                            className={`brand-button ${activeBrand === brand ? 'active' : ''}`}
                        >
                            {activeBrand === brand && <Car size={18} />}
                            {brand}
                        </button>
                    ))}
                </div>

                <div ref={carsGridRef} className="cars-grid">
                    {displayedCars.length > 0 ? (
                        displayedCars.map((car, index) => (
                            <div key={`${car.name}-${index}`} className="car-card">
                                <div className="car-card-image-container">
                                    <img src={car.image} alt={car.name} className="car-card-image" />
                                    <div className="car-card-price-tag">
                                        STARTING ${car.startingPrice}
                                    </div>
                                </div>
                                <div 
                                    className="car-card-content"
                                    style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/subtle-dark-matter.png')"}}
                                >
                                    <h3 className="car-card-title">{car.name}</h3>
                                    <p className="car-card-subtitle">{car.subtitle}</p>
                                    <hr className="card-divider" />
                                    <ul className="car-details-list">
                                        <li className="car-detail-item">
                                            <span className="detail-label">Initial Charge</span>
                                            <span className="detail-value">${car.initialCharge}</span>
                                        </li>
                                        <li className="car-detail-item">
                                            <span className="detail-label">Additional Charge / Kilo</span>
                                            <span className="detail-value">${car.additionalCharge.toString().padStart(2, '0')}</span>
                                        </li>
                                        <li className="car-detail-item">
                                            <span className="detail-label">Passengers Seat</span>
                                            <span className="detail-value">{car.seats}</span>
                                        </li>
                                    </ul>
                                    <hr className="card-divider" />
                                    <button className="car-card-book-btn">
                                        <Car size={18} />
                                        BOOK NOW
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p className="empty-state-text">No cars available for this brand at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TaxiRates;
