import Image from "next/image";
import React from "react";

interface TripCardProps {
  trip: Trip;
  onEdit: () => void;
  onDelete: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      <Image
        src={trip.image}
        alt={trip.title}
        width={800} // Specify the actual width of the image
        height={600} // Specify the actual height of the image
        className="w-full h-40 object-cover rounded"
      />
      <h2 className="text-xl font-bold mt-2">{trip.title}</h2>
      <p>Duration: {trip.duration} days</p>
      <p>StartDate : {trip.start_date}</p>
      <p>StartDate : {trip.return_date}</p>
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
