"use client";
import React, { useState, useEffect } from "react";
import TripCard from "@/components/TripCard";
import TripForm from "@/components/TripForm";
import { deleteTripImagesFolder } from "@/lib/supabaseActions";
import axios from "axios";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Trip } from "@/types/custom";
import { GrChapterAdd } from "react-icons/gr";

const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<number | null>(null);

  // Fetch trips on component mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("/api/trips");
        setTrips(response.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isModalOpen) {
          handleCloseModal();
        }
        if (showDeleteConfirmation) {
          cancelDelete();
        }
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isModalOpen, showDeleteConfirmation]);

  const handleOpenAddNewModal = () => {
    setCurrentTrip(null); // Reset currentTrip for a new trip
    setIsModalOpen(true);
    disablePageScroll();
  };

  const handleEdit = (trip: Trip) => {
    setCurrentTrip(trip);
    setIsModalOpen(true);
    disablePageScroll();
  };

  const handleDelete = (id: number) => {
    setShowDeleteConfirmation(true);
    setTripToDelete(id);
    disablePageScroll();
  };

  const confirmDelete = async () => {
    if (tripToDelete === null) return;

    try {
      await deleteTripImagesFolder(tripToDelete.toString());
      await axios.delete(`/api/trips/${tripToDelete}`);
      setTrips(trips.filter((trip) => trip.id !== tripToDelete));
    } catch (error) {
      console.error("Error deleting trip:", error);
    } finally {
      setShowDeleteConfirmation(false);
      setTripToDelete(null);
      enablePageScroll();
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setTripToDelete(null);
    enablePageScroll();
  };

  const handleFormSubmit = async (trip: Partial<Trip>) => {
    setLoading(true);

    try {
      let response;

      if (currentTrip) {
        response = await axios.put(`/api/trips/${currentTrip.id}`, trip);
        // Update trip in state
        setTrips((prevTrips) =>
          prevTrips.map((t) =>
            t.id === currentTrip.id ? { ...t, ...trip } : t
          )
        );
      } else {
        response = await axios.post("/api/trips", trip);
        const newTrip = response.data;
        setTrips((prevTrips) => [...prevTrips, newTrip]);
      }

      setIsModalOpen(false);
      setCurrentTrip(null);
    } catch (error: any) {
      console.error(
        "Form Submit Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
      enablePageScroll();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    enablePageScroll();
  };

  const handleDeleteBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      cancelDelete();
    }
  };

  const handleBackgroundClick = () => {
    handleCloseModal();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-12 mx-auto p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Trips Dashboard</h1>
      <div
        onClick={handleOpenAddNewModal}
        className="fixed bottom-16 right-5 w-14 h-14 flex justify-around items-center rounded-full bg-white/95 backdrop-blur-lg shadow-xl cursor-pointer"
      >
        <GrChapterAdd className="text-custom-pri text-2xl z-50" />
      </div>
      <button
        onClick={handleOpenAddNewModal}
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
          onCancel={handleCloseModal}
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
              Are you sure you want to delete this trip?
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-6"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
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
