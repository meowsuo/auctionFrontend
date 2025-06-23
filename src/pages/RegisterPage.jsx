import { useState } from "react";

export default function RegisterPage() {
  const [data, setData] = useState({
    username: "", password: "", confirm: "",
    firstName: "", lastName: "", email: "",
    phone: "", address: "", location: "", afm: ""
  });
  const [error, setError] = useState("");

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (data.password !== data.confirm) return setError("Οι κωδικοί δεν ταιριάζουν.");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.username === data.username))
      return setError("Το όνομα χρήστη υπάρχει ήδη.");

    const newUsers = [...users, data];
    localStorage.setItem("users", JSON.stringify(newUsers));
    localStorage.setItem("user", JSON.stringify({ username: data.username, role: "BIDDER" }));
    window.location.href = "/dashboard";
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Εγγραφή</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          ["username", "Όνομα Χρήστη"],
          ["password", "Κωδικός", "password"],
          ["confirm", "Επιβεβαίωση Κωδικού", "password"],
          ["firstName", "Όνομα"],
          ["lastName", "Επώνυμο"],
          ["email", "Email", "email"],
          ["phone", "Τηλέφωνο"],
          ["address", "Διεύθυνση"],
          ["location", "Τοποθεσία"],
          ["afm", "ΑΦΜ"]
        ].map(([name, label, type = "text"]) => (
          <div key={name}>
            <label className="block text-sm">{label}</label>
            <input
              name={name} type={type} value={data[name]}
              onChange={handleChange} required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        ))}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Εγγραφή
        </button>
      </form>
    </div>
  );
}
