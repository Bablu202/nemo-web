import React, { useState, useEffect } from "react";

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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newImages = [...(formData.image || [])];
    newImages[index] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      image: newImages,
    }));
  };

  const addImageField = () => {
    setFormData((prevData) => ({
      ...prevData,
      image: [...(prevData.image || []), ""],
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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-1.5 lg:p-0"
    >
      <div className="bg-white p-4 lg:p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl text-custom-pri font-bold mb-2 lg:mb-4">
          {initialData ? "Edit Trip" : "Add New Trip"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-lg font-semibold ">
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-1 rounded lg:p-2"
              required
            />
          </label>
          {formData.image?.map((imageUrl, index) => (
            <label key={index} className="block mb-2 text-lg font-semibold ">
              Image URL {index + 1}:
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageChange(e, index)}
                className="w-full border p-1 rounded lg:p-2"
                required
              />
            </label>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="bg-custom-pri text-white px-4 py-2 rounded mb-4"
          >
            Add More Images
          </button>
          <label className="block mb-2 text-lg font-semibold ">
            Start Date:
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full border p-1 rounded lg:p-2"
              required
            />
          </label>
          <label className="block mb-2 text-lg font-semibold ">
            Return Date:
            <input
              type="date"
              name="return_date"
              value={formData.return_date}
              onChange={handleChange}
              className="w-full border p-1 rounded lg:p-2"
              required
            />
          </label>
          <label className="block mb-2 text-lg font-semibold ">
            Duration:
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border p-1 rounded lg:p-2"
              required
            />
          </label>
          <label className="block mb-2 text-lg font-semibold ">
            Status:
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-1 rounded lg:p-2"
              required
            />
          </label>
          <label className="block mb-2 text-lg font-semibold ">
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-1 rounded lg:p-2"
              required
            />
          </label>
          <label className="block mb-2 text-lg font-semibold ">
            Seats:
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              className="w-full border p-1 rounded lg:p-2"
              required
            />
          </label>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-custom-sec text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-custom-pri text-white px-4 py-2 rounded-md"
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
