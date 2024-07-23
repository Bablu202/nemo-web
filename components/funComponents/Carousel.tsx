import React, { useState, useEffect, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSwipeable } from "react-swipeable";

interface CarouselProps {
  children: React.ReactNode;
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  autoSlide = false,
  autoSlideInterval = 3000,
}) => {
  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;
  const [curr, setCurr] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurr((curr) => curr - 1);
    }
  };

  const next = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurr((curr) => curr + 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval]);

  useEffect(() => {
    if (isTransitioning) {
      const transitionEndTimeout = setTimeout(() => {
        setIsTransitioning(false);
        if (curr > totalSlides) {
          setCurr(1);
          containerRef.current!.style.transition = "none";
          containerRef.current!.style.transform = `translateX(-${100}%)`;
          setTimeout(() => {
            containerRef.current!.style.transition = "transform 0.5s ease-out";
          }, 0);
        } else if (curr < 1) {
          setCurr(totalSlides);
          containerRef.current!.style.transition = "none";
          containerRef.current!.style.transform = `translateX(-${
            totalSlides * 100
          }%)`;
          setTimeout(() => {
            containerRef.current!.style.transition = "transform 0.5s ease-out";
          }, 0);
        }
      }, 500); // duration matches the CSS transition duration

      return () => clearTimeout(transitionEndTimeout);
    }
  }, [curr, isTransitioning, totalSlides]);

  return (
    <div className="overflow-hidden relative" {...handlers}>
      <div
        ref={containerRef}
        className={`flex transition-transform duration-500 ${
          isTransitioning ? "" : "transition-none"
        }`}
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {/* Clone the last slide */}
        <div className="w-full flex-shrink-0 h-64 relative">
          {slides[totalSlides - 1]}
        </div>
        {/* Render all slides */}
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 h-64 relative">
            {slide}
          </div>
        ))}
        {/* Clone the first slide */}
        <div className="w-full flex-shrink-0 h-64 relative">{slides[0]}</div>
      </div>
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`transition-all w-2 h-2 bg-white rounded-full cursor-pointer ${
                curr === i + 1 ? "p-1.5" : "bg-opacity-50"
              }`}
              onClick={() => setCurr(i + 1)}
            />
          ))}
        </div>
      </div>
      {/* Navigation Buttons */}
      <div className="absolute inset-0 hidden lg:flex justify-between items-center p-2">
        <button
          className="text-2xl text-white bg-black bg-opacity-50 rounded-full p-1"
          onClick={prev}
        >
          <HiChevronLeft />
        </button>
        <button
          className="text-2xl text-white bg-black bg-opacity-50 rounded-full p-1"
          onClick={next}
        >
          <HiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
