import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes, FaUpload } from "react-icons/fa";

import {
  uploadTripImages,
  deleteTripImagesFolder,
} from "@/lib/supabaseActions";
import { Trip } from "@/types/custom";

interface TripFormProps {
  initialData?: Trip | null;
  onSubmit: (trip: Partial<Trip>) => void;
  onCancel: () => void;
  onBackgroundClick: () => void;
}

const TripForm: React.FC<TripFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onBackgroundClick,
}) => {
  const [formData, setFormData] = useState<Partial<Trip>>({
    image: initialData?.image || [],
    title: initialData?.title || "",
    start_date: initialData?.start_date || "",
    return_date: initialData?.return_date || "",
    duration: initialData?.duration || "",
    status: initialData?.status || "",
    price: initialData?.price || 0,
    seats: initialData?.seats || 0,
    plan: initialData?.plan || [""],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (selectedFiles.length > 0) {
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }

    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [selectedFiles]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "plan"
  ) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: newArray,
    }));
  };

  const addArrayField = (field: "plan") => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...(prevData[field] || []), ""],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + selectedFiles.length > 6) {
        alert("You can only upload up to 6 images.");
        return;
      }
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (initialData) {
      // Remove from the existing images array for edit mode
      setFormData((prevData) => ({
        ...prevData,
        image: (prevData.image || []).filter((_, i) => i !== index),
      }));
    } else {
      // Remove from the newly selected files and previews for the new trip form
      setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      setImagePreviews((prevPreviews) =>
        prevPreviews.filter((_, i) => i !== index)
      );
    }
  };

  const handleAddMoreImages = () => {
    const input = document.getElementById(
      "image-upload-input"
    ) as HTMLInputElement;
    if (input) input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tripTitle = formData.title || "new-trip";
      const tripId = initialData?.id.toString() || tripTitle;

      if (initialData) {
        await deleteTripImagesFolder(tripId);
      }

      const uploadedImagePaths = await uploadTripImages(
        selectedFiles,
        tripTitle
      );

      onSubmit({
        ...formData,
        image: [...(formData.image || []), ...uploadedImagePaths],
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onBackgroundClick();
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setImagePreviews([]);
    onCancel();
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 py-2"
    >
      <div
        className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md lg:max-w-2xl flex flex-col border border-gray-300"
        style={{ maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-custom-pri">
            {initialData ? "Edit Trip" : "Add New Trip"}
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className="text-custom-pri hover:text-red-500 p-2 rounded-full transition-colors duration-200"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto scrollbar-hide">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 sm:gap-3 md:gap-4"
            id="trip-form"
          >
            <label className="text-sm sm:text-base md:text-lg font-semibold">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base md:text-lg shadow-inner focus:ring-2 focus:ring-custom-pri focus:outline-none"
                required
              />
            </label>
            <div className="relative">
              <label className="text-sm sm:text-base md:text-lg font-semibold">
                Upload Images (up to 6):
                <input
                  id="image-upload-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleAddMoreImages}
                  className="border-2 border-gray-300 border-dashed p-2 rounded-lg cursor-pointer flex items-center justify-center mt-2 transition-colors duration-200 hover:bg-gray-100"
                >
                  <FaUpload className="mr-2" />
                  <span className="text-sm sm:text-base md:text-lg">
                    Choose files...
                  </span>
                </button>
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.image?.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border border-gray-300 rounded-lg overflow-hidden shadow-sm"
                  >
                    <Image
                      width={96}
                      height={96}
                      src={imageUrl}
                      alt={`Image ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 text-red-500 bg-white rounded-full shadow-md"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                {imagePreviews.map((preview, index) => (
                  <div
                    key={`preview-${index}`}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border border-gray-300 rounded-lg overflow-hidden shadow-sm"
                  >
                    <Image
                      width={96}
                      height={96}
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 text-red-500 bg-white rounded-full shadow-md"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <label className="text-sm sm:text-base md:text-lg font-semibold">
              Start Date:
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base md:text-lg shadow-inner focus:ring-2 focus:ring-custom-pri focus:outline-none"
                required
              />
            </label>
            <label className="text-sm sm:text-base md:text-lg font-semibold">
              Return Date:
              <input
                type="date"
                name="return_date"
                value={formData.return_date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base md:text-lg shadow-inner focus:ring-2 focus:ring-custom-pri focus:outline-none"
                required
              />
            </label>
            {formData.plan?.map((planItem, index) => (
              <label
                key={index}
                className="text-sm sm:text-base md:text-lg font-semibold"
              >
                Day {index + 1}:
                <input
                  type="text"
                  value={planItem}
                  onChange={(e) => handleArrayChange(e, index, "plan")}
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base md:text-lg shadow-inner focus:ring-2 focus:ring-custom-pri focus:outline-none"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("plan")}
              className="bg-white text-custom-sec border border-custom-sec hover:bg-custom-pri
               hover:text-white px-2 py-1 lg:px-4 lg:py-2 rounded-lg text-sm sm:text-base md:text-lg mt-2 
               transition-all duration-300"
            >
              Add Each Day Summary
            </button>
            <label className="text-sm sm:text-base md:text-lg font-semibold">
              Status:
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base md:text-lg shadow-inner focus:ring-2 focus:ring-custom-pri focus:outline-none"
                required
              />
            </label>
            <label className="text-sm sm:text-base md:text-lg font-semibold">
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base md:text-lg shadow-inner focus:ring-2 focus:ring-custom-pri focus:outline-none"
                required
              />
            </label>
            <label className="text-sm sm:text-base md:text-lg font-semibold">
              Seats:
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base md:text-lg shadow-inner focus:ring-2 focus:ring-custom-pri focus:outline-none"
                required
              />
            </label>
          </form>
        </div>
        <div className="flex justify-between gap-2 mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 text-white px-3 py-2 rounded-md shadow-lg text-sm sm:text-base md:text-lg transition-transform duration-200 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="trip-form"
            className="bg-custom-pri text-white px-3 py-2 rounded-md shadow-lg text-sm sm:text-base md:text-lg transition-transform duration-200 transform hover:scale-105"
          >
            {initialData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripForm;
