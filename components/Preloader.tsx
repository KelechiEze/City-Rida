'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CarTaxiFront } from 'lucide-react';
import './Preloader.css';

interface PreloaderProps {
  onFinished: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onFinished }) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const taxiRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: onFinished });

    tl.fromTo(taxiRef.current, 
      { x: '-100vw', y: '-50%' }, 
      { x: '100vw', y: '-50%', duration: 3, ease: 'power2.inOut' }
    );
    
    tl.fromTo(textRef.current, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' },
      "-=2.5"
    );

    tl.to(preloaderRef.current, 
      { opacity: 0, duration: 0.7, ease: 'power1.in' }
    );
    
    tl.set(preloaderRef.current, { display: 'none' });

  }, [onFinished]);

  return (
    <div ref={preloaderRef} className="preloader">
      <div className="preloader-content">
        <div ref={textRef} className="preloader-text">
          CITYRIDE
        </div>
        <div ref={taxiRef} className="preloader-taxi" style={{ transform: 'translate(-100vw, -50%)' }}>
          <CarTaxiFront className="preloader-taxi-icon" size={100} />
        </div>
      </div>
       <div ref={trackRef} className="preloader-track">
         <div className="preloader-track-inner"></div>
       </div>
       <div className="preloader-radial-glow"></div>
    </div>
  );
};

export default Preloader;
