import React, { useEffect, useState } from "react";
import axios from "axios";
import InputFormUserManage from "./InputFormUserManage"; // Import the new component

interface User {
  email: string;
  count: number;
  paid_amount: number;
  remaining_amount: number;
  confirmed: boolean;
  refund: boolean;
  price: number; // Include price
}

interface Trip {
  trip_name: string;
  users: User[];
}

const UserManage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Define fetchTrips function
  const fetchTrips = async () => {
    try {
      const response = await axios.get("/api/user/manage/get-trips");
      setTrips(response.data.trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setError("Failed to fetch trips");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleTripClick = (trip_name: string) => {
    setActiveTrip(trip_name === activeTrip ? null : trip_name);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const response = await axios.put(
        "/api/user/manage/update-user",
        updatedUser
      );
      if (response.data.message === "User updated successfully") {
        await fetchTrips(); // Refresh trips data
        setEditingUser(null);
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user");
    }
  };

  return (
    <div className="container mt-12 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {error && <p className="text-red-500">{error}</p>}
      {trips.length > 0 ? (
        <div className="space-y-4">
          {trips.map(({ trip_name, users }) => (
            <div key={trip_name} className="relative">
              <button
                className="block w-full bg-custom-pri text-white py-2 px-4 mb-2 rounded-lg uppercase tracking-[0.35rem] lg:tracking-[1rem]"
                onClick={() => handleTripClick(trip_name)}
              >
                {trip_name}
              </button>
              {activeTrip === trip_name && (
                <div className="transition-all duration-500 ease-in-out bg-white p-4 rounded-lg shadow-lg mt-2">
                  <h2 className="text-lg font-semibold mb-2">User Details</h2>
                  {users.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {users.map((user) => (
                        <div
                          key={user.email}
                          className="bg-white shadow-lg p-4 rounded-lg"
                        >
                          <p className="text-lg font-medium mb-1">
                            {user.email}
                          </p>
                          <div className="space-y-2">
                            <p>
                              <strong>Count:</strong> {user.count}
                            </p>
                            <p>
                              <strong>Paid Amount:</strong> $
                              {user.paid_amount.toFixed(2)}
                            </p>
                            <p>
                              <strong>Remaining Amount:</strong> $
                              {user.remaining_amount.toFixed(2)}
                            </p>
                            <p>
                              <strong>Confirmed:</strong>{" "}
                              {user.confirmed ? "Yes" : "No"}
                            </p>
                            <p>
                              <strong>Refund:</strong>{" "}
                              {user.refund ? "Yes" : "No"}
                            </p>
                            <p>
                              <strong>Price:</strong> ${user.price.toFixed(2)}{" "}
                              {/* Display price */}
                            </p>
                            <button
                              className="bg-blue-500 text-white py-1 px-2 rounded-lg mt-2"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No users found for this trip.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No trips available</p>
      )}
      {editingUser && (
        <InputFormUserManage
          user={editingUser}
          onSave={handleUpdateUser}
          onCancel={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

export default UserManage;
