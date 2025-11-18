
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import TaxiRates from '../components/TaxiRates';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className={`transition-opacity duration-1000 opacity-100`}>
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        <Services />
        <WhyChooseUs />
        <TaxiRates />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};
