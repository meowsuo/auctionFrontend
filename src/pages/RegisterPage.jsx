import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "", password: "", confirm: "",
    firstName: "", lastName: "", email: "",
    phone: "", address: "", location: "", afm: ""
  });
  const [error, setError] = useState("");

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (data.password !== data.confirm) return setError("Passwords don't match");

    try {
      // Remove confirm before sending
      const { confirm, ...payload } = data;

      const response = await axios.post("https://auctionbackend-4sb2.onrender.com/api/register", payload);

      // Save JWT token
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("username", data.username);

      // Navigate to auctions
      navigate("/auctions");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
    }
  };

  return (
      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            ["username", "Username"],
            ["password", "Password", "password"],
            ["confirm", "Confirm Password", "password"],
            ["firstName", "First Name"],
            ["lastName", "Last Name"],
            ["email", "Email", "email"],
            ["phone", "Phone"],
            ["address", "Address"],
            ["location", "Location"],
            ["afm", "AFM"]
          ].map(([name, label, type = "text"]) => (
              <div key={name}>
                <label className="block text-sm">{label}</label>
                <input
                    name={name}
                    type={type}
                    value={data[name]}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
              </div>
          ))}
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Register
          </button>
        </form>
      </div>
  );
}
