import React, { useState, useEffect } from "react";
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
    image: initialData?.image || [""],
    title: initialData?.title || "",
    start_date: initialData?.start_date || "",
    return_date: initialData?.return_date || "",
    duration: initialData?.duration || "",
    status: initialData?.status || "",
    price: initialData?.price || 0,
    seats: initialData?.seats || 0,
    plan: initialData?.plan || [""],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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
    field: "image" | "plan"
  ) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: newArray,
    }));
  };

  const addArrayField = (field: "image" | "plan") => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...(prevData[field] || []), ""],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onBackgroundClick();
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 lg:p-4"
    >
      <div
        className="bg-white p-4 lg:p-6 rounded shadow-md w-full max-w-md flex flex-col"
        style={{ maxHeight: "80vh" }}
      >
        <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-custom-pri">
          {initialData ? "Edit Trip" : "Add New Trip"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow overflow-y-auto"
          id="trip-form"
        >
          <div className="flex flex-col gap-2 sm:gap-4 flex-grow">
            <label className="block text-sm sm:text-lg font-semibold mb-1">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-1 rounded sm:p-2 text-sm sm:text-base"
                required
              />
            </label>
            {formData.image?.map((imageUrl, index) => (
              <label
                key={index}
                className="block text-sm sm:text-lg font-semibold mb-1"
              >
                Image URL {index + 1}:
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleArrayChange(e, index, "image")}
                  className="w-full border p-1 rounded sm:p-2 text-sm sm:text-base"
                  required
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("image")}
              className="bg-custom-pri text-white px-2 sm:px-4 py-1 sm:py-2 rounded mb-2 sm:mb-4 text-sm sm:text-base"
            >
              Add More Images
            </button>
            <label className="block text-sm sm:text-lg font-semibold mb-1">
              Start Date:
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border p-1 rounded sm:p-2 text-sm sm:text-base"
                required
              />
            </label>
            <label className="block text-sm sm:text-lg font-semibold mb-1">
              Return Date:
              <input
                type="date"
                name="return_date"
                value={formData.return_date}
                onChange={handleChange}
                className="w-full border p-1 rounded sm:p-2 text-sm sm:text-base"
                required
              />
            </label>
            {formData.plan?.map((planItem, index) => (
              <label
                key={index}
                className="block text-sm sm:text-lg font-semibold mb-1"
              >
                Day {index + 1}:
                <input
                  type="text"
                  value={planItem}
                  onChange={(e) => handleArrayChange(e, index, "plan")}
                  className="w-full border p-1 rounded sm:p-2 text-sm sm:text-base"
                  required
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("plan")}
              className="bg-custom-pri text-white px-2 sm:px-4 py-1 sm:py-2 rounded mb-2 sm:mb-4 text-sm sm:text-base"
            >
              Add More Plans
            </button>
            <label className="block text-sm sm:text-lg font-semibold mb-1">
              Status:
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-1 rounded sm:p-2 text-sm sm:text-base"
                required
              />
            </label>
            <label className="block text-sm sm:text-lg font-semibold mb-1">
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-1 rounded sm:p-2 text-sm sm:text-base"
                required
              />
            </label>
            <label className="block text-sm sm:text-lg font-semibold mb-1">
              Seats:
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full border p-1 rounded sm:p-2 text-sm sm:text-base"
                required
              />
            </label>
          </div>
        </form>
        <div className="flex justify-between gap-2 sm:gap-4 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-custom-pri text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="trip-form"
            className="bg-color-green text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base"
          >
            {initialData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripForm;
