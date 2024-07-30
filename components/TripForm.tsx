// components/TripForm.tsx
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
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

    // Cleanup function to revoke object URLs
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
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
      const tripId = initialData?.id.toString() || formData.title || "new-trip";

      if (initialData) {
        // Confirm deletion and handle image deletion and upload
        if (
          window.confirm(
            "Are you sure you want to delete existing images for this trip?"
          )
        ) {
          await deleteTripImagesFolder(tripId);
        }
      }

      const uploadedImagePaths = await uploadTripImages(selectedFiles, tripId);
      onSubmit({ ...formData, image: uploadedImagePaths });
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onBackgroundClick();
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {initialData ? "Edit Trip" : "Add New Trip"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 flex-grow overflow-auto"
          id="trip-form"
        >
          <div className="flex flex-col gap-4">
            <label className="text-lg font-semibold">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border-gray-300 border p-2 rounded-md text-lg"
                required
              />
            </label>
            <div className="relative">
              <label className="text-lg font-semibold">
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
                  className="border-2 border-gray-300 border-dashed p-2 rounded-md cursor-pointer"
                >
                  <span className="text-gray-700">Choose files...</span>
                </button>
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <Image
                      width={96}
                      height={96}
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 p-1 text-red-500 bg-white rounded-full"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <label className="text-lg font-semibold">
              Start Date:
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border-gray-300 border p-2 rounded-md text-lg"
                required
              />
            </label>
            <label className="text-lg font-semibold">
              Return Date:
              <input
                type="date"
                name="return_date"
                value={formData.return_date}
                onChange={handleChange}
                className="w-full border-gray-300 border p-2 rounded-md text-lg"
                required
              />
            </label>
            {formData.plan?.map((planItem, index) => (
              <label key={index} className="text-lg font-semibold">
                Day {index + 1}:
                <input
                  type="text"
                  value={planItem}
                  onChange={(e) => handleArrayChange(e, index, "plan")}
                  className="w-full border-gray-300 border p-2 rounded-md text-lg"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("plan")}
              className="bg-green-500 text-white px-4 py-2 rounded-md text-lg"
            >
              Add More Days
            </button>
            <label className="text-lg font-semibold">
              Duration (days):
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border-gray-300 border p-2 rounded-md text-lg"
                required
              />
            </label>
            <label className="text-lg font-semibold">
              Status:
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border-gray-300 border p-2 rounded-md text-lg"
                required
              />
            </label>
            <label className="text-lg font-semibold">
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border-gray-300 border p-2 rounded-md text-lg"
                required
              />
            </label>
            <label className="text-lg font-semibold">
              Seats:
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full border-gray-300 border p-2 rounded-md text-lg"
                required
              />
            </label>
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md text-lg"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;
