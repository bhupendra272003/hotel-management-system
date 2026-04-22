import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const CustomerBilling = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  const fetchBills = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/bills/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBills(response.data);
    } catch (err) {
      setError("Failed to load bills");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
  };

  const handleCloseModal = () => {
    setSelectedBill(null);
  };

  const handleDownloadBill = async (billId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/bills/${billId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bill_${billId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      setError("Failed to download bill");
      console.error(err);
    }
  };

  const handlePayBill = async (billId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/bills/${billId}/pay`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        fetchBills(); // Refresh bills
        alert("Payment successful!");
      }
    } catch (err) {
      setError("Failed to process payment");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "overdue":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading bills...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Bills
          </h2>
        </div>

        {error && (
          <div className="m-6 p-4 bg-red-50 dark:bg-red-900 rounded-md">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {bills.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No bills found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bill ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {bill.billNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ₹{bill.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getStatusColor(bill.status)}`}>
                        {bill.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleViewBill(bill)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadBill(bill._id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Download
                      </button>
                      {bill.status === "pending" && (
                        <button
                          onClick={() => handlePayBill(bill._id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bill Details Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bill Details
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bill Number
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedBill.billNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {new Date(selectedBill.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Items
                  </label>
                  <div className="mt-2 space-y-2">
                    {selectedBill.items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.description}</span>
                        <span>₹{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount:</span>
                    <span>₹{selectedBill.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBilling;