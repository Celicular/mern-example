import { useEffect, useState } from "react";
import { getUserInvestments, createInvestment } from "../api/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";

function Investments({ token }) {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: "", plan: "3-months" });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, [token]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await getUserInvestments(token);
      setInvestments(response.data.investments);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch investments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (amount <= 0) {
        setError("Amount must be greater than 0");
        return;
      }

      await createInvestment(token, amount, formData.plan);
      setFormData({ amount: "", plan: "3-months" });
      setShowForm(false);
      await fetchInvestments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create investment");
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Investments</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Create Investment"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Create New Investment</h2>
            <form onSubmit={handleCreateInvestment}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Plan
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) =>
                      setFormData({ ...formData, plan: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="3-months">3 Months (0.5% daily)</option>
                    <option value="6-months">6 Months (0.3% daily)</option>
                    <option value="12-months">12 Months (0.2% daily)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {formLoading ? "Creating..." : "Create Investment"}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">
                  Daily ROI %
                </th>
              </tr>
            </thead>
            <tbody>
              {investments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No investments yet
                  </td>
                </tr>
              ) : (
                investments.map((inv) => (
                  <tr key={inv._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ${inv.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{inv.plan}</td>
                    <td className="px-6 py-4">
                      {new Date(inv.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(inv.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{inv.dailyROIPercentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Investments;
