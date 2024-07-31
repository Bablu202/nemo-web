// components/Dashboard.tsx
"use client";
import React from "react";
import TripCard from "@/components/TripCard";
import TripForm from "@/components/TripForm";
import { GrChapterAdd } from "react-icons/gr";
import { useDashboardContext } from "@/context/DashboardContext";

const Dashboard: React.FC = () => {
  const {
    trips,
    loading,
    isModalOpen,
    currentTrip,
    showDeleteConfirmation,
    handleOpenAddNewModal,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleFormSubmit,
    handleCloseModal,
    handleDeleteBackgroundClick,
    handleBackgroundClick,
  } = useDashboardContext();

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
