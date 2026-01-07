import { useEffect, useState } from "react";
import { getReferralTree } from "../api/apiClient";
import ReferralTree from "../components/ReferralTree";
import LoadingSpinner from "../components/LoadingSpinner";

function Referrals({ token }) {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoading(true);
        const response = await getReferralTree(token);
        setTreeData(response.data.tree);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch referral tree"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [token]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Referral Network
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {treeData && (
          <div className="bg-white rounded-lg shadow p-6">
            <ReferralTree node={treeData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Referrals;
