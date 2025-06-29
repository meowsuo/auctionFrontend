import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/useAuth';
import api from "../services/api";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = location.state?.message;

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/auth/login", credentials);

      const token = response.data.token;
      login(token, credentials.username);
      navigate("/auctions");
    } catch (err) {
      console.error(err);
      setError("Wrong username or password");
    }
  };

  return (
      <div className="max-w-sm mx-auto mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        {redirectMessage && (
            <p className="text-yellow-600 mb-2">{redirectMessage}</p>
        )}

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1">Username</label>
            <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
  );
}

export default LoginPage;
