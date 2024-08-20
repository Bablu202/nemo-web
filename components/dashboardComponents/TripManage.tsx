// components/TripManage.tsx
import React from "react";
import TripCard from "@/components/TripCard";
import TripForm from "@/components/TripForm";
import { useDashboardContext } from "@/context/DashboardContext";

const TripManage: React.FC = () => {
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

  if (loading) return <SkeletonLoader />;

  return (
    <div className="container mt-12 mx-auto p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Trips Dashboard</h1>
      <button
        onClick={handleOpenAddNewModal}
        className=" px-4 py-2 rounded mb-4 btn-dark-light"
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
          <div className="bg-white dark:bg-color-gray p-4 lg:px-8 lg:py-6 rounded-lg shadow-lg">
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
                className=" px-4 py-2 btn-dark-light-cancel"
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

export default TripManage;

const SkeletonLoader: React.FC = () => {
  return (
    <div className="container mt-12 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 bg-gray-200 h-8 w-1/3 rounded animate-pulse"></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col animate-pulse"
          >
            <div className="relative w-full h-60 md:h-80 bg-gray-200"></div>
            <div className="p-4 flex flex-col space-y-2">
              <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
              <div className="flex justify-between text-sm md:text-base text-gray-600">
                <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
                <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
              </div>
              <div className="text-sm md:text-base text-gray-600 space-y-2">
                <div className="bg-gray-200 h-4 w-full rounded"></div>
                <div className="bg-gray-200 h-4 w-full rounded"></div>
                <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
              </div>
              <div className="flex space-x-2 mt-auto">
                <div className="bg-gray-200 h-10 w-24 rounded"></div>
                <div className="bg-gray-200 h-10 w-24 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
