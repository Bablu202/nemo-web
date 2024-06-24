import Image from "next/image";
import React from "react";

interface TripCardProps {
  trip: Trip;
  onEdit: () => void;
  onDelete: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded shadow">
      <Image
        src={trip.image}
        alt={trip.title}
        width={800} // Specify the actual width of the image
        height={600} // Specify the actual height of the image
        className="w-full h-40 object-cover rounded"
      />
      <h2 className="text-xl font-bold mt-2">{trip.title}</h2>
      <p>Duration: {trip.duration} days</p>
      <p>Price: {trip.price}</p>
      <p>Status: {trip.status}</p>
      <button
        onClick={onEdit}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default TripCard;
