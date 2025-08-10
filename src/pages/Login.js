import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./Login.css";
import axios from "axios";

export const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  // const { setUser, setToken } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);

    if (success) {
      navigate("/layout"); // 👈 adjust this path if needed
    } else {
      setError("Invalid email or password");
    }

    // try {
    //   const response = await axios.post("http://127.0.0.1:8000/api/login", {
    //     email,
    //     password,
    //   });

    //   const { token, user } = response.data;

    //   // Store user details
    //   setUser(user);
    //   setToken(token);
    //   localStorage.setItem("authToken", token);
    //   localStorage.setItem("user", JSON.stringify(user));

    //   // Call the onLoginSuccess callback to update authentication state in App
    //   onLoginSuccess();

    //   // Redirect to dashboard
    //   navigate("/Dashboard");
    // } catch (err) {
    //   if (err.response) {
    //     setError(err.response.data.message || "Invalid login credentials");
    //   } else {
    //     setError("Server error. Please try again later.");
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="login-page-container">
      <div className="login-form">
      <div className="logo-container">
          <img src="your-logo.png" alt="LogiTrack Logo" className="logo" /> {/* Replace with your logo path */}
        </div>
        <h2 className="title">LogiTrack</h2>
        
        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
