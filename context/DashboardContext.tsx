// context/DashboardContext.tsx
"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { deleteTripImagesFolder } from "@/lib/supabaseActions";
import { Trip } from "@/types/custom";

interface DashboardContextType {
  trips: Trip[];
  loading: boolean;
  isModalOpen: boolean;
  currentTrip: Trip | null;
  showDeleteConfirmation: boolean;
  tripToDelete: number | null;
  handleOpenAddNewModal: () => void;
  handleEdit: (trip: Trip) => void;
  handleDelete: (id: number) => void;
  confirmDelete: () => void;
  cancelDelete: () => void;
  handleFormSubmit: (trip: Partial<Trip>) => Promise<void>;
  handleCloseModal: () => void;
  handleDeleteBackgroundClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleBackgroundClick: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<number | null>(null);

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

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isModalOpen) handleCloseModal();
        if (showDeleteConfirmation) cancelDelete();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isModalOpen, showDeleteConfirmation]);

  const handleOpenAddNewModal = () => {
    setCurrentTrip(null);
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

  return (
    <DashboardContext.Provider
      value={{
        trips,
        loading,
        isModalOpen,
        currentTrip,
        showDeleteConfirmation,
        tripToDelete,
        handleOpenAddNewModal,
        handleEdit,
        handleDelete,
        confirmDelete,
        cancelDelete,
        handleFormSubmit,
        handleCloseModal,
        handleDeleteBackgroundClick,
        handleBackgroundClick,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};

export { DashboardProvider, useDashboardContext };
