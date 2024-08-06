import React, { useState } from "react";

interface User {
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
  const [updatedUser, setUpdatedUser] = useState<User>({ ...user });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]:
        name === "confirmed" || name === "refund"
          ? e.target.checked
          : parseFloat(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(updatedUser);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit User Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="count">
              Count
            </label>
            <input
              type="number"
              id="count"
              name="count"
              value={updatedUser.count}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="paid_amount"
            >
              Paid Amount
            </label>
            <input
              type="number"
              id="paid_amount"
              name="paid_amount"
              value={updatedUser.paid_amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="remaining_amount"
            >
              Remaining Amount
            </label>
            <input
              type="number"
              id="remaining_amount"
              name="remaining_amount"
              value={updatedUser.remaining_amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={updatedUser.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirmed</label>
            <input
              type="checkbox"
              id="confirmed"
              name="confirmed"
              checked={updatedUser.confirmed}
              onChange={handleChange}
              className="mr-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Refund</label>
            <input
              type="checkbox"
              id="refund"
              name="refund"
              checked={updatedUser.refund}
              onChange={handleChange}
              className="mr-2"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
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
