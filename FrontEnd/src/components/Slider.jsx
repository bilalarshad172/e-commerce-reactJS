import React, { useState, useEffect } from 'react';
import slider1 from '../assets/slider1.jpg';
import slider2 from '../assets/slider2.jpg';
import slider3 from '../assets/slider3.jpg';
import slider4 from '../assets/slider4.jpg';
import slider5 from '../assets/slider5.jpg';

const images = [slider5, slider2, slider3, slider4, slider1];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Change image every 3-4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Adjust timing as needed (3000ms = 3 seconds)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
  <div
    className="flex transition-transform duration-1000 ease-in-out"
    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
  >
    {images.map((image, index) => (
      <img
        key={index}
        src={image}
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    ))}
  </div>
</div>

  );
};

export default Slider;
