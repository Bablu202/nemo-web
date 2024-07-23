"use client";

import React, { useState, useEffect } from "react";
import { UserType } from "@/types/custom";

type UserDetailsFormProps = {
  initialValues: UserType;
  onUpdate: (updatedUser: Partial<UserType>) => void;
  onCancel: () => void;
};

const UserDetailsForm = ({
  initialValues,
  onUpdate,
  onCancel,
}: UserDetailsFormProps) => {
  const [name, setName] = useState(initialValues.name);
  const [mobileNumber, setMobileNumber] = useState(initialValues.mobile_number);
  const [dateOfBirth, setDateOfBirth] = useState(initialValues.date_of_birth);
  const [profession, setProfession] = useState(initialValues.profession);
  const [gender, setGender] = useState(initialValues.gender);

  const [errors, setErrors] = useState({
    name: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    validateForm();
  }, [name, dateOfBirth]);

  const validateForm = () => {
    const newErrors = {
      name: !name ? "Name is required" : "",
      dateOfBirth: !dateOfBirth ? "Date of Birth is required" : "",
    };
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !dateOfBirth) {
      validateForm();
      return;
    }
    onUpdate({
      name,
      mobile_number: mobileNumber,
      date_of_birth: dateOfBirth,
      profession,
      gender,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name}</span>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mobile Number:
        </label>
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Enter your mobile number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date of Birth:
        </label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.dateOfBirth && (
          <span className="text-red-500 text-sm">{errors.dateOfBirth}</span>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Profession:
        </label>
        <input
          type="text"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          placeholder="Enter your profession"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Gender:
        </label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="not_mentioned">Not Mentioned</option>
        </select>
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserDetailsForm;
