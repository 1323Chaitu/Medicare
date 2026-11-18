
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/users?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error("Unable to connect to the server.");
      }

      const users = await response.json();

      const user = users.find(
        (item) => item.password === password
      );

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      const loggedInUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorId: user.doctorId
      };

      localStorage.setItem(
        "medicareUser",
        JSON.stringify(loggedInUser)
      );

      window.dispatchEvent(new Event("medicare-auth-change"));

      alert("Login successful!");

      if (user.role === "doctor") {
        navigate("/doctor-dashboard");
        } else {
        navigate("/patient-dashboard");
      }

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>Welcome Back!</h2>
        <p>Login to your MediCare account.</p>

        {location.state?.message && (
          <div className="success-message">
            {location.state.message}
          </div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
