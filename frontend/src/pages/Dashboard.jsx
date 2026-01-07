import { useEffect, useState } from "react";
import { getDashboard } from "../api/apiClient";
import DashboardCard from "../components/DashboardCard";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getDashboard(token);
        setData(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Total Invested"
              value={`$${data.totalInvested.toFixed(2)}`}
              subtitle={`${data.investmentCount} active investment(s)`}
            />
            <DashboardCard
              title="Today's ROI"
              value={`$${data.dailyROI.toFixed(2)}`}
              subtitle="Daily returns"
            />
            <DashboardCard
              title="Total ROI Earned"
              value={`$${data.totalROIEarned.toFixed(2)}`}
              subtitle="Accumulated returns"
            />
            <DashboardCard
              title="Level Income"
              value={`$${data.totalLevelIncome.toFixed(2)}`}
              subtitle="From referral network"
            />
            <DashboardCard
              title="Today's Level Income"
              value={`$${data.dailyLevelIncome.toFixed(2)}`}
              subtitle="Daily referral income"
            />
            <DashboardCard
              title="Current Balance"
              value={`$${data.currentBalance.toFixed(2)}`}
              subtitle="Total account balance"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
