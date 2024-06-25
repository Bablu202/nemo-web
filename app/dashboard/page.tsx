"use client";
import React, { useState, useEffect } from "react";
import TripCard from "@/components/TripCard";
import TripForm from "@/components/TripForm";
import supabase from "@/lib/supabase/supabase";
import { GrChapterAdd } from "react-icons/gr";

const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from("nemo_upcoming_trip_details")
        .select("*");
      if (error) {
        console.error(error);
      } else {
        setTrips(data as Trip[]);
      }
      setLoading(false);
    };

    fetchTrips();
  }, []);

  const handleEdit = (trip: Trip) => {
    setCurrentTrip(trip);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setShowDeleteConfirmation(true);
    setTripToDelete(id);
  };

  const confirmDelete = async () => {
    if (tripToDelete === null) return;

    const { error } = await supabase
      .from("nemo_upcoming_trip_details")
      .delete()
      .eq("id", tripToDelete);
    if (error) {
      console.error(error);
    } else {
      setTrips(trips.filter((trip) => trip.id !== tripToDelete));
    }

    setShowDeleteConfirmation(false);
    setTripToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setTripToDelete(null);
  };

  const handleFormSubmit = async (trip: Partial<Trip>) => {
    setLoading(true);
    let result;
    if (currentTrip) {
      result = await supabase
        .from("nemo_upcoming_trip_details")
        .update(trip)
        .eq("id", currentTrip.id);
    } else {
      result = await supabase.from("nemo_upcoming_trip_details").insert(trip);
    }

    if (result.error) {
      console.error(result.error);
    } else {
      const newTrips = result.data || []; // Default to an empty array if result.data is null
      setTrips((prevTrips) => {
        if (currentTrip) {
          return prevTrips.map((t) =>
            t.id === currentTrip.id ? { ...t, ...trip } : t
          );
        } else {
          return [...prevTrips, ...newTrips];
        }
      });
      setIsModalOpen(false);
      setCurrentTrip(null);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  const handleModelCloseOnBG = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="container mt-12 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trips Dashboard</h1>
      <div
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-16 right-5 w-14 h-14 flex justify-around items-center rounded-full bg-white/95 backdrop-blur-lg  shadow-xl"
      >
        <GrChapterAdd className="text-custom-pri text-2xl" />
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-custom-pri text-white px-4 py-2 rounded mb-4"
      >
        Add New Trip
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onEdit={() => handleEdit(trip)}
            onDelete={() => handleDelete(trip.id)}
          />
        ))}
      </div>
      {isModalOpen && (
        <TripForm
          initialData={currentTrip}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setCurrentTrip(null);
          }}
        />
      )}
      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 lg:px-8 lg:py-6  rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 lg:mb-8">
              Are you sure to delete this trip?
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-red-700 text-white px-4 py-2 rounded mr-6"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                className="bg-custom-pri text-white px-4 py-2 rounded"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
