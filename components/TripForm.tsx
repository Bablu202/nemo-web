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

      // If updating an existing trip and images are being updated, prompt for confirmation
      if (initialData) {
        if (
          window.confirm(
            "Are you sure you want to delete existing images for this trip?"
          )
        ) {
          // Ensure the trip ID is used for deleting images
          await deleteTripImagesFolder(tripId);
        }
      }

      // Upload new images with the trip ID as the folder name
      const uploadedImagePaths = await uploadTripImages(selectedFiles, tripId);

      // Submit the form data including the uploaded image paths
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
        className="bg-white px-2 py-3 rounded-lg shadow-lg w-full max-w-lg flex flex-col overflow-hidden"
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4 text-custom-pri">
            {initialData ? "Edit Trip" : "Add New Trip"}
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className="border border-custom-pri hover:border-color-red/80 text-custom-pri  p-2 rounded-full shadow-lg "
          >
            <FaTimes />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 flex-grow  overflow-y-auto scrollbar-hide"
          id="trip-form"
        >
          <div className="flex flex-col gap-2">
            <label className="text-lg lg:font-semibold">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border-custom-sec border p-0.5 lg:p-2 rounded-md text-lg"
                required
              />
            </label>
            <div className="relative">
              <label className="text-lg lg:font-semibold">
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
                  className="border-2 border-custom-sec border-dashed p-0.5 lg:p-2 rounded-md cursor-pointer"
                >
                  <span className="p-1">Choose files...</span>
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
            <label className="text-lg lg:font-semibold">
              Start Date:
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border-custom-sec border p-0.5 lg:p-2 rounded-md text-lg"
                required
              />
            </label>
            <label className="text-lg lg:font-semibold">
              Return Date:
              <input
                type="date"
                name="return_date"
                value={formData.return_date}
                onChange={handleChange}
                className="w-full border-custom-sec border p-0.5 lg:p-2 rounded-md text-lg"
                required
              />
            </label>
            {formData.plan?.map((planItem, index) => (
              <label key={index} className="text-lg lg:font-semibold">
                Day {index + 1}:
                <input
                  type="text"
                  value={planItem}
                  onChange={(e) => handleArrayChange(e, index, "plan")}
                  className="w-full border-custom-sec border p-0.5 lg:p-2 rounded-md text-lg"
                />
              </label>
            ))}
            <div className="flex ml-auto">
              <button
                type="button"
                onClick={() => addArrayField("plan")}
                className="bg-white text-custom-sec border border-custom-sec hover:bg-custom-pri hover:text-white
              px-1 py-1 lg:px-4 lg:py-2 rounded-md text-lg"
              >
                add each day summery
              </button>
            </div>
            {/* <label className="text-lg lg:font-semibold">
              Duration (days):
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border-custom-sec border p-0.5 lg:p-2 rounded-md text-lg"
                required
              />
            </label> */}
            <label className="text-lg lg:font-semibold">
              Status:
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border-custom-sec border p-0.5 lg:p-2 rounded-md text-lg"
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
                className="w-full border-custom-sec border p-0.5 lg:p-2 rounded-md text-lg"
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
                className="w-full border-custom-sec border p-0.5 lg:p-2 rounded-md text-lg"
                required
              />
            </label>
          </div>
          <div className="flex justify-between gap-4 mt-2 lg:mt-4 px-2">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-color-red text-white px-4 py-1 rounded-md shadow-lg text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-custom-pri text-white px-4 py-1 rounded-md shadow-lg text-lg"
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
