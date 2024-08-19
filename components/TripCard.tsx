"use client";
import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { differenceInDays, parseISO } from "date-fns";
import Image from "next/image";
import { Trip } from "@/types/custom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-60 md:h-80" {...handlers}>
        <Image
          src={trip.image[currentImageIndex]}
          alt={trip.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        <div className="absolute inset-0 flex justify-between items-center p-2">
          <button
            className="text-2xl text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity"
            onClick={handlePrevImage}
          >
            <HiChevronLeft />
          </button>
          <button
            className="text-2xl text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity"
            onClick={handleNextImage}
          >
            <HiChevronRight />
          </button>
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {trip.image.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ease-in-out ${
                index === currentImageIndex ? "bg-white" : "bg-gray-500"
              }`}
            ></div>
          ))}
        </div>
      </div>
      <div className="p-4 flex flex-col space-y-2">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">
          {trip.title}
        </h2>
        <div className="flex justify-between text-sm md:text-base text-gray-600">
          <p>
            Duration:{" "}
            <span className="font-medium">
              {differenceInDays(
                parseISO(trip.return_date),
                parseISO(trip.start_date)
              ) + 1}{" "}
              Days
            </span>
          </p>
          <p>
            Price:{" "}
            <span className="font-medium"> {formatCurrency(trip.price)}</span>
          </p>
        </div>
        <div className="text-sm md:text-base text-gray-600">
          <p>
            Start Date: <span className="font-medium">{trip.start_date}</span>
          </p>
          <p>
            Return Date: <span className="font-medium">{trip.return_date}</span>
          </p>
          <p>
            Status:{" "}
            <span className="font-medium capitalize">{trip.status}</span>
          </p>
        </div>
        <div className="flex space-x-2 mt-auto">
          <button
            onClick={onEdit}
            className="flex items-center justify-center bg-custom-pri text-white py-1.5 md:py-2 px-2 md:px-4 rounded-md text-sm md:text-base font-medium transition-transform transform hover:scale-105"
          >
            <FaEdit className="mr-1 md:mr-2" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center bg-color-red text-white py-1.5 md:py-2 px-2 md:px-4 rounded-md text-sm md:text-base font-medium transition-transform transform hover:scale-105"
          >
            <FaTrashAlt className="mr-1 md:mr-2" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
