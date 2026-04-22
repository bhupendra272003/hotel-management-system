import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "../ThemeToggle";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const CustomerTableBooking = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    fetchAvailableTables();
    fetchMyBookings();
    setBookingDate(new Date().toISOString().split('T')[0]);
  }, []);

  const fetchAvailableTables = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/tables/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTables(response.data);
    } catch (err) {
      setError("Failed to load tables");
      console.error(err);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyBookings(response.data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setError("");
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTable) {
      setError("Please select a table");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const bookingData = {
        tableId: selectedTable._id,
        date: bookingDate,
        time: bookingTime,
        guests: parseInt(guests),
        specialRequests: specialRequests,
      };

      const response = await axios.post(`${API_URL}/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(`Table ${selectedTable.tableNumber} booked successfully!`);
      setSelectedTable(null);
      setBookingTime("");
      setGuests(2);
      setSpecialRequests("");
      fetchAvailableTables();
      fetchMyBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMyBookings();
        fetchAvailableTables();
        setSuccess("Booking cancelled successfully!");
      } catch (err) {
        setError("Failed to cancel booking");
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Table Booking
          </h1>
          <ThemeToggle />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 rounded-md">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 rounded-md">
            <p className="text-green-700 dark:text-green-200">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Tables */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Available Tables
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tables.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center">
                    No tables available at the moment.
                  </p>
                ) : (
                  tables.map((table) => (
                    <div
                      key={table._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTable?._id === table._id
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900"
                          : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                      }`}
                      onClick={() => handleTableSelect(table)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Table {table.tableNumber}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Capacity: {table.capacity} persons
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Location: {table.location || "Standard"}
                          </p>
                        </div>
                        {selectedTable?._id === table._id && (
                          <div className="text-indigo-600 dark:text-indigo-400">
                            ✓ Selected
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Book a Table
              </h2>
              {selectedTable ? (
                <form onSubmit={handleBooking}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Selected Table
                    </label>
                    <input
                      type="text"
                      value={`Table ${selectedTable.tableNumber} (Capacity: ${selectedTable.capacity})`}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      min="1"
                      max={selectedTable.capacity}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Any special requests? (dietary restrictions, celebrations, etc.)"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? "Booking..." : "Confirm Booking"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTable(null)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Please select a table from the list
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Bookings */}
        {myBookings.length > 0 && (
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                My Bookings
              </h2>
              <div className="space-y-4">
                {myBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Table {booking.tableId?.tableNumber}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Date: {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Time: {booking.time}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Guests: {booking.guests}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Status:{" "}
                          <span
                            className={`font-medium ${
                              booking.status === "confirmed"
                                ? "text-green-600 dark:text-green-400"
                                : "text-yellow-600 dark:text-yellow-400"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </p>
                      </div>
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTableBooking;