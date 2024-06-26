import Image from "next/image";
import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi2";

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
    <div className="border p-4 rounded shadow-md">
      <div className="relative w-full h-40" {...handlers}>
        <Image
          src={trip.image[currentImageIndex]}
          alt={trip.title}
          layout="fill"
          objectFit="cover"
          className="rounded"
        />
        <div className="absolute inset-0 hidden lg:flex justify-between items-center p-2">
          <button
            className="text-2xl text-white bg-black bg-opacity-50 rounded-full p-1"
            onClick={handlePrevImage}
          >
            <HiChevronLeft />
          </button>
          <button
            className="text-2xl text-white bg-black bg-opacity-50 rounded-full p-1"
            onClick={handleNextImage}
          >
            <HiChevronRight />
          </button>
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {trip.image.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ease-in-out ${
                index === currentImageIndex ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>
      <h2 className="text-xl font-bold mt-2">{trip.title}</h2>
      <p>Duration: {trip.duration} days</p>
      <p>Start Date: {trip.start_date}</p>
      <p>Return Date: {trip.return_date}</p>
      <p>Price: {trip.price}</p>
      <p>Status: {trip.status}</p>
      <div className="flex justify-between">
        <button
          onClick={onEdit}
          className="mt-2 bg-custom-pri text-white px-4 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="mt-2 bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TripCard;
