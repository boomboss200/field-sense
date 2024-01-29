// src/components/Onboarding.js
import React, { useState, useRef } from 'react';
import slide1Image from './images/Slide1.png';
import slide2Image from './images/Slide2.png';
import slide3Image from './images/Slide3.png';
import slide4Image from './images/Slide4.png';

import './slideshow.css'; // Import your custom CSS for onboarding

const Slideshow = ({ onboardingComplete }) => {
  const slides = [
    { id: 1, image: slide1Image },
    { id: 2, image: slide2Image },
    { id: 3, image: slide3Image },
    { id: 4, image: slide4Image },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesContainerRef = useRef(null);

  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    scrollToNextSlide();
  };

  const handlePrevious = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    scrollToPreviousSlide();
  };

  const handleComplete = () => {
    onboardingComplete();
  };

  const scrollToNextSlide = () => {
    if (slidesContainerRef.current) {
      slidesContainerRef.current.scrollLeft += slidesContainerRef.current.offsetWidth;
    }
  };

  const scrollToPreviousSlide = () => {
    if (slidesContainerRef.current) {
      slidesContainerRef.current.scrollLeft -= slidesContainerRef.current.offsetWidth;
    }
  };

  return (
    <div className="onboarding-container">
      <div ref={slidesContainerRef} className="slides">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`slide ${index === currentSlide ? 'active' : ''}`}>
            <img src={slide.image} alt={`Slide ${slide.id}`} />
          </div>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrevious} className="navigation-button">
          &lt; Previous
        </button>
        <button onClick={handleNext} className="navigation-button">
          Next &gt;
        </button>
      </div>
      <button onClick={handleComplete} className="complete-button" style={{ background: '#4CAF50', color: '#fff' }}>
        Get Started
      </button>
    </div>
  );
};

export default Slideshow;
