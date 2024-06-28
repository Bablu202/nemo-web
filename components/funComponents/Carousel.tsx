import React, { useState, useEffect } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
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
  const [curr, setCurr] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const prev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    }
  };

  const next = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
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
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // duration matches the CSS transition duration
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  return (
    <div className="overflow-hidden relative" {...handlers}>
      <div
        className={`flex transition-transform ease-out duration-500 ${
          isTransitioning ? "" : "transition-none"
        }`}
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 h-64 relative">
            {slide}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prev}
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
        >
          <BiChevronLeft size={40} />
        </button>
        <button
          onClick={next}
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
        >
          <BiChevronRight size={40} />
        </button>
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`
                transition-all w-3 h-3 bg-white rounded-full cursor-pointer
                ${curr === i ? "p-2" : "bg-opacity-50"}
              `}
              onClick={() => setCurr(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
