
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Menu } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Get logged-in user from localStorage
  useEffect(() => {
    const updateUser = () => {
      try {
        const savedUser = localStorage.getItem("medicareUser");
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch (error) {
        console.error("Error reading user:", error);
        setUser(null);
      }
    };

    // Check user when Navbar loads
    updateUser();

    // Listen for login/logout changes
    window.addEventListener("medicare-auth-change", updateUser);

    return () => {
      window.removeEventListener("medicare-auth-change", updateUser);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("medicareUser");

    setUser(null);

    window.dispatchEvent(new Event("medicare-auth-change"));

    navigate("/");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        <HeartPulse size={30} />
        <span>MediCare</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/doctors">Find Doctors</Link>

        {user && (
            <Link to={user.role === "doctor"
            ? "/doctor-dashboard"
            : "/patient-dashboard"
            }>
            Dashboard
            </Link>
        )}

        <a href="/#services">Services</a>
        <a href="/#about">About Us</a>
        </div>

      <div className="nav-actions">

        {user ? (
          <>
            <span className="user-name">
              Hi, {user.name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="register-btn">
              Sign Up
            </Link>
          </>
        )}

      </div>

      <Menu className="mobile-menu" size={26} />

    </nav>
  );
}

export default Navbar;
