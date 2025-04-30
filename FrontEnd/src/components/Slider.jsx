import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import slider1 from '../assets/slider1.jpg';
import slider2 from '../assets/slider2.jpg';
import slider3 from '../assets/slider3.jpg';
import slider4 from '../assets/slider4.jpg';
import slider5 from '../assets/slider5.jpg';

// Slide content with images and text
const slides = [
  {
    image: slider5,
    title: "Summer Collection 2024",
    subtitle: "Discover the latest trends for the season",
    buttonText: "Shop Now",
    buttonLink: "/products?category=summer",
    align: "left" // text alignment
  },
  {
    image: slider2,
    title: "Premium Electronics",
    subtitle: "High-quality devices for your everyday needs",
    buttonText: "Explore",
    buttonLink: "/products?category=electronics",
    align: "center"
  },
  {
    image: slider3,
    title: "Exclusive Offers",
    subtitle: "Limited time deals on selected items",
    buttonText: "View Deals",
    buttonLink: "/products?sort=discount",
    align: "right"
  },
  {
    image: slider4,
    title: "New Arrivals",
    subtitle: "Be the first to discover our latest products",
    buttonText: "Shop New",
    buttonLink: "/products?sort=newest",
    align: "center"
  },
  {
    image: slider1,
    title: "Accessories Collection",
    subtitle: "Complete your look with our premium accessories",
    buttonText: "Shop Accessories",
    buttonLink: "/products?category=accessories",
    align: "left"
  }
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  // Change image every 5 seconds if autoplay is enabled
  useEffect(() => {
    let interval;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000);
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [isAutoPlaying]);

  // Pause autoplay when user interacts with slider
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);

    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  // Navigate to previous slide
  const prevSlide = () => {
    pauseAutoPlay();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  // Navigate to next slide
  const nextSlide = () => {
    pauseAutoPlay();
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % slides.length
    );
  };

  // Go to a specific slide
  const goToSlide = (index) => {
    pauseAutoPlay();
    setCurrentIndex(index);
  };

  // Handle button click
  const handleButtonClick = (link) => {
    navigate(link);
  };

  return (
    <div className="hero">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero__slide ${index === currentIndex ? 'active' : ''}`}
          style={{ zIndex: index === currentIndex ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="hero__image"
            loading={index === 0 ? "eager" : "lazy"}
          />

          <div className="hero__content">
            <div
              className={`container mx-auto flex flex-col ${
                slide.align === 'center' ? 'items-center text-center' :
                slide.align === 'right' ? 'items-end text-right' :
                'items-start text-left'
              }`}
            >
              <h2 className="hero__title">{slide.title}</h2>
              <p className="hero__subtitle">{slide.subtitle}</p>
              <Button
                type="primary"
                size="large"
                onClick={() => handleButtonClick(slide.buttonLink)}
                className="bg-black text-white hover:bg-gray-800 border-none px-8 py-6 h-auto flex items-center"
              >
                {slide.buttonText}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white p-3 rounded-full z-10"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <LeftOutlined />
      </button>

      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white p-3 rounded-full z-10"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <RightOutlined />
      </button>

      {/* Dots Navigation */}
      <div className="hero__controls">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero__dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
