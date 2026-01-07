import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import Referrals from "./pages/Referrals";
import Navigation from "./components/Navigation";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      {token && <Navigation user={user} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/auth"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <AuthPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard token={token} /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/investments"
          element={
            token ? <Investments token={token} /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/referrals"
          element={
            token ? <Referrals token={token} /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
