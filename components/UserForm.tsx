"use client";
import React, { useState } from "react";
import { RegisterForm } from "./actionComponents/Register";
import { LoginForm } from "./actionComponents/Login";

const UserForm: React.FC = () => {
  const [isForm, setIsForm] = useState<boolean>(true);

  return (
    <section className="mt-12 flex items-center justify-center bg-custom-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mb-5 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setIsForm(true)}
              className={`w-1/2 py-2 px-4 border border-transparent rounded-md text-sm font-medium ${
                isForm
                  ? "bg-custom-pri text-custom-white"
                  : "text-custom-sec hover:bg-custom-white hover:text-custom-sec"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setIsForm(false)}
              className={`w-1/2 py-2 px-4 border border-transparent rounded-md text-sm font-medium ${
                isForm
                  ? "text-custom-sec hover:bg-custom-white hover:text-custom-sec"
                  : "bg-custom-pri text-custom-white"
              }`}
            >
              Login
            </button>
          </div>
          {isForm ? <RegisterForm /> : <LoginForm />}
        </div>
        <div className="flex items-center justify-between"></div>
      </div>
    </section>
  );
};

export default UserForm;
