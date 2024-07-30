import Image from "next/image";
import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi2";
import { differenceInDays, parseISO } from "date-fns";
import { Trip } from "@/types/custom";

interface TripCardProps {
  trip: Trip;
  onEdit: () => void;
  onDelete: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % trip.image.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? trip.image.length - 1 : prevIndex - 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true,
  });

  return (
    <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="relative w-full h-60 md:h-80" {...handlers}>
        <Image
          src={trip.image[currentImageIndex]}
          alt={trip.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        <div className="absolute inset-0 flex justify-between items-center p-2 lg:p-4">
          <button
            className="text-xl text-white bg-black bg-opacity-50 rounded-full p-2"
            onClick={handlePrevImage}
          >
            <HiChevronLeft />
          </button>
          <button
            className="text-xl text-white bg-black bg-opacity-50 rounded-full p-2"
            onClick={handleNextImage}
          >
            <HiChevronRight />
          </button>
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {trip.image.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ease-in-out ${
                index === currentImageIndex ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg md:text-xl font-semibold mb-2">{trip.title}</h2>
        <p className="text-sm md:text-base mb-1">
          Duration:
          <span className="font-medium">
            {differenceInDays(
              parseISO(trip.return_date),
              parseISO(trip.start_date)
            ) + 1}
            Days
          </span>
        </p>
        <p className="text-sm md:text-base mb-1">
          Start Date: <span className="font-medium">{trip.start_date}</span>
        </p>
        <p className="text-sm md:text-base mb-1">
          Return Date: <span className="font-medium">{trip.return_date}</span>
        </p>
        <p className="text-sm md:text-base mb-1">
          Price: <span className="font-medium">${trip.price.toFixed(2)}</span>
        </p>
        <p className="text-sm md:text-base mb-4">
          Status: <span className="font-medium capitalize">{trip.status}</span>
        </p>
        <div className="flex justify-between mt-auto space-x-2">
          <button
            onClick={onEdit}
            className="bg-custom-pri text-white px-4 py-2 rounded-md text-sm md:text-base font-medium transition-transform transform hover:scale-105"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm md:text-base font-medium transition-transform transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
