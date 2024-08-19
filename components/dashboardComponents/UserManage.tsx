import React, { useEffect, useState } from "react";
import axios from "axios";
import InputFormUserManage from "./InputFormUserManage"; // Import the input form component
import ConfirmationModal from "../re-useable/ConfirmationModal";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

interface User {
  id: string; // ID from trip_users table
  email: string;
  count: number;
  paid_amount: number;
  remaining_amount: number;
  confirmed: boolean;
  refund: boolean;
  price: number;
}

interface Trip {
  id: string;
  trip_id: string;
  email: string;
  trip_name: string;
  users: User[];
}

const UserManage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get("/api/user/manage/get-trips");
      setTrips(response.data.trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setError("Failed to fetch trips");
    }
  };

  const handleTripClick = (trip_name: string) => {
    setActiveTrip(trip_name === activeTrip ? null : trip_name);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    // Recalculate remaining amount
    updatedUser.remaining_amount =
      updatedUser.price * updatedUser.count - updatedUser.paid_amount;

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

  const handleDeleteUser = async () => {
    if (!userIdToDelete) return;

    try {
      const response = await axios.delete("/api/user/manage/delete-user", {
        data: { id: userIdToDelete }, // Pass the ID of the user to delete
      });
      if (response.data.message === "User deleted successfully") {
        await fetchTrips(); // Refresh trips data
        setShowConfirmationModal(false);
        setUserIdToDelete(null);
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  return (
    <div className="container mt-12 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {error && <p className="text-red-500">{error}</p>}
      {trips.length > 0 ? (
        <div className="space-y-4">
          {trips.map(({ id, trip_name, users }) => {
            // Calculate summary values
            const totalMembers = users.reduce(
              (sum, user) => sum + user.count,
              0
            );
            const totalReceivedAmount = users.reduce(
              (sum, user) => sum + user.paid_amount,
              0
            );
            const totalPendingAmount = users.reduce(
              (sum, user) => sum + (user.price * user.count - user.paid_amount),
              0
            );

            return (
              <div key={id} className="relative">
                <button
                  className="block w-full bg-custom-pri dark:bg-color-orange/95 text-white 
                  py-2 px-4 mb-2 rounded-lg uppercase tracking-[0.35rem] lg:tracking-[1rem]"
                  onClick={() => handleTripClick(trip_name)}
                >
                  {trip_name}
                </button>
                {activeTrip === trip_name && (
                  <div
                    className=" p-4 rounded-lg shadow-lg mt-2
                   bg-color-white dark:bg-color-gray text-custom-sec dark:text-color-white 
                   transition-all duration-500 ease-in-out"
                  >
                    <h2 className="text-lg font-semibold mb-2">User Details</h2>
                    {users.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((user) => {
                          const totalPrice = user.price * user.count;
                          const remainingAmount = totalPrice - user.paid_amount;

                          return (
                            <div
                              key={user.id} // Use ID as the key
                              className={`bg-white text-custom-sec dark:bg-color-gray dark:bg-text-color-white shadow-lg p-4 rounded-lg relative ${
                                remainingAmount === 0
                                  ? "bg-green-200"
                                  : "bg-red-200"
                              }`} // Apply green background if remainingAmount is zero
                            >
                              <div className="bg-white dark:bg-color-orange/[0.025] dark:text-color-white shadow-lg p-4 rounded-lg space-y-4">
                                <p className="text-base flex text-custom-pri dark:text-color-orange md:text-lg font-medium mb-1 ">
                                  {user.email}
                                </p>
                                <div className="space-y-2 pb-2">
                                  <div className="flex flex-1 justify-between items-start border-b border-custom-pri/40 pb-2 lg:pb-4">
                                    <strong className="text-custom-pri dark:text-color-orange">
                                      Price :
                                    </strong>
                                    <span>{formatCurrency(user.price)}</span>
                                  </div>
                                  <div className="flex flex-1 justify-between items-start border-b border-custom-pri/40 pb-2 lg:pb-4">
                                    <strong className="text-custom-pri dark:text-color-orange">
                                      Count :
                                    </strong>
                                    <span>{user.count} Persons</span>
                                  </div>
                                  <div className="flex justify-between items-start border-b border-custom-pri/40 pb-2 lg:pb-4">
                                    <strong className="text-custom-pri dark:text-color-orange">
                                      Total Price :
                                    </strong>
                                    <span>{formatCurrency(totalPrice)}</span>
                                  </div>
                                  <div className="flex justify-between items-start border-b border-custom-pri/40 pb-2 lg:pb-4">
                                    <strong className="text-custom-pri dark:text-color-orange">
                                      Paid Amount:
                                    </strong>
                                    <span>
                                      {formatCurrency(user.paid_amount)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-start border-b border-custom-pri/40 pb-2 lg:pb-4">
                                    <strong className="text-custom-pri dark:text-color-orange">
                                      Pending :
                                    </strong>
                                    <span>
                                      {" "}
                                      {formatCurrency(remainingAmount)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-start border-b border-custom-pri/40 pb-2 lg:pb-4">
                                    <strong className="text-custom-pri dark:text-color-orange">
                                      Confirmed :
                                    </strong>
                                    <span>{user.confirmed ? "Yes" : "No"}</span>
                                  </div>
                                  <div className="flex justify-between items-start border-b border-custom-pri/40 pb-2 lg:pb-4">
                                    <strong className="text-custom-pri dark:text-color-orange">
                                      Refund:
                                    </strong>
                                    <span>{user.refund ? "Yes" : "No"}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end space-x-4">
                                <button
                                  className="mt-6 flex items-center bg-custom-pri dark:bg-color-green  text-white lg:px-6 lg:py-1 lg:text-base rounded"
                                  onClick={() => setEditingUser(user)}
                                >
                                  <FaEdit className="mr-2 lg:mr-4" />
                                  Edit
                                </button>
                                <button
                                  className="mt-6 flex items-center bg-color-red dark:bg-gray-500 text-white px-4 py-1 lg:px-6 lg:py-1 lg:text-base rounded"
                                  onClick={() => {
                                    setUserIdToDelete(user.id);
                                    setShowConfirmationModal(true);
                                  }} // Set the user ID to delete and show modal
                                >
                                  <FaTrashAlt className="mr-2 lg:mr-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p>No users found for this trip.</p>
                    )}
                    {/* Summary Section */}
                    <div className=" p-4 mt-4 rounded-lg border shadow-lg">
                      <h3 className="text-lg font-semibold mb-2">Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center border-b border-custom-pri/40 dark:border-color-orange/40 pb-2">
                          <strong className="text-custom-pri dark:text-color-orange">
                            Total Members:
                          </strong>
                          <span>{totalMembers} Persons</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-custom-pri/40 dark:border-color-orange/40 pb-2">
                          <strong className="text-custom-pri dark:text-color-orange">
                            Total Received Amount:
                          </strong>
                          <span> {formatCurrency(totalReceivedAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-custom-pri/40 dark:border-color-orange/40 pb-2">
                          <strong className="text-custom-pri dark:text-color-orange">
                            Total Pending Amount:
                          </strong>
                          <span>₹ {formatCurrency(totalPendingAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
      {showConfirmationModal && (
        <ConfirmationModal
          message={`Remove this user from ${activeTrip} Trip?`}
          onConfirm={handleDeleteUser}
          onCancel={() => {
            setShowConfirmationModal(false);
            setUserIdToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManage;
