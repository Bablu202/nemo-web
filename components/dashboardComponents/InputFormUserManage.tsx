import React, { useState, ChangeEvent } from "react";

interface User {
  id: string;
  email: string;
  count: number;
  paid_amount: number;
  remaining_amount: number;
  confirmed: boolean;
  refund: boolean;
  price: number;
}

interface InputFormUserManageProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const InputFormUserManage: React.FC<InputFormUserManageProps> = ({
  user,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<User>(user);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white  rounded-lg shadow-lg">
        <h2
          className=" bg-custom-pri text-white p-2 rounded-t-lg
         text-center text-xl lg:text-2xl  font-extralight mb-1 md:mb-2 lg:mb-4"
        >
          Edit Trip User
        </h2>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-1 md:mb-2 lg:mb-4 ">
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="number"
              name="count"
              value={formData.count}
              onChange={handleChange}
              className="w-full p-0.5 md:p-1 lg:p-2 border rounded"
            />
          </div>
          <div className="mb-1 md:mb-2 lg:mb-4">
            <label className="block text-sm font-medium mb-2">
              Paid Amount
            </label>
            <input
              type="number"
              name="paid_amount"
              value={formData.paid_amount}
              onChange={handleChange}
              className="w-full p-0.5 md:p-1 lg:p-2 border rounded"
            />
          </div>
          {/* <div className="mb-1 md:mb-2 lg:mb-4">
            <label className="block text-sm font-medium mb-2">
              Remaining Amount
            </label>
            <input
              type="number"
              name="remaining_amount"
              value={formData.remaining_amount}
              onChange={handleChange}
              disabled
              className="w-full p-0.5 md:p-1 lg:p-2 border rounded"
            />
          </div> */}
          <div className="mb-1 md:mb-2 lg:mb-4">
            <label className="block text-sm font-medium mb-2">Confirmed</label>
            <input
              type="checkbox"
              name="confirmed"
              checked={formData.confirmed}
              onChange={handleChange}
              className="mr-2"
            />
          </div>
          <div className="mb-1 md:mb-2 lg:mb-4">
            <label className="block text-sm font-medium mb-2">Refund</label>
            <input
              type="checkbox"
              name="refund"
              checked={formData.refund}
              onChange={handleChange}
              className="mr-2"
            />
          </div>
          <div className="mb-1 md:mb-2 lg:mb-4">
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-0.5 md:p-1 lg:p-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6 ">
            <button
              type="submit"
              className="bg-custom-pri shadow-md hover:shadow-2xl text-white px-3 py-1 lg:px-5 lg:py-2 rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-white shadow-md hover:shadow-2xl  px-3 py-1 lg:px-5 lg:py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputFormUserManage;
