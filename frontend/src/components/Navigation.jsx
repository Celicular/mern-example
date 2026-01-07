import { Link, useNavigate } from "react-router-dom";

function Navigation({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/auth");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-6">
          <Link
            to="/dashboard"
            className="font-bold text-lg hover:text-blue-200"
          >
            Dashboard
          </Link>
          <Link to="/investments" className="hover:text-blue-200">
            Investments
          </Link>
          <Link to="/referrals" className="hover:text-blue-200">
            Referrals
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span>{user?.fullName || user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
