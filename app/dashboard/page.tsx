"use client";
import React, { useState, useEffect } from "react";
import TripCard from "@/components/TripCard";
import TripForm from "@/components/TripForm";
import { GrChapterAdd } from "react-icons/gr";
import axios from "axios";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Trip } from "@/types/custom";
const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<number | null>(null);
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDeleteConfirmation(false);
        setCurrentTrip(null);
        setIsModalOpen(false);
        enablePageScroll();
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("/api/trips");
        setTrips(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrips();
  }, []);

  const handleEdit = (trip: Trip) => {
    setCurrentTrip(trip);
    setIsModalOpen(true);
    disablePageScroll();
  };

  const handleDelete = (id: number) => {
    setShowDeleteConfirmation(true);
    setTripToDelete(id);
  };

  const confirmDelete = async () => {
    if (tripToDelete === null) return;

    try {
      await axios.delete(`/api/trips/${tripToDelete}`);
      setTrips(trips.filter((trip) => trip.id !== tripToDelete));
    } catch (error) {
      console.error(error);
    } finally {
      setShowDeleteConfirmation(false);
      setTripToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setTripToDelete(null);
  };

  const handleFormSubmit = async (trip: Partial<Trip>) => {
    setLoading(true);

    try {
      let response;
      if (currentTrip) {
        response = await axios.put(`/api/trips/${currentTrip.id}`, trip);
      } else {
        response = await axios.post("/api/trips", trip);
        const newTrip = response.data;
        setTrips((prevTrips) => [...prevTrips, newTrip]);
      }

      setIsModalOpen(false);
      setCurrentTrip(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const handleDeleteBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setShowDeleteConfirmation(false);
  };

  const handleBackgroundClick = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mt-12 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trips Dashboard</h1>
      <div
        onClick={() => {
          setIsModalOpen(true);
          disablePageScroll();
        }}
        className="fixed bottom-16 right-5 w-14 h-14 flex justify-around items-center rounded-full bg-white/95 backdrop-blur-lg shadow-xl"
      >
        <GrChapterAdd className="text-custom-pri text-2xl" />
      </div>
      <button
        onClick={() => {
          setIsModalOpen(true);
          disablePageScroll();
        }}
        className="bg-custom-pri text-white px-4 py-2 rounded mb-4"
      >
        Add New Trip
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips
          .filter((trip) => trip != null)
          .map((trip) => (
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
          onBackgroundClick={handleBackgroundClick}
        />
      )}
      {showDeleteConfirmation && (
        <div
          onClick={handleDeleteBackgroundClick}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-4 lg:px-8 lg:py-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 lg:mb-8">
              Are you sure to delete this trip?
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-color-red text-white px-4 py-2 rounded mr-6"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                className="bg-color-blue text-white px-4 py-2 rounded"
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
