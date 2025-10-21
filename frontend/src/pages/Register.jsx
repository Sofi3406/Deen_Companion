import { useState } from "react";
import apiClient from "../api/apiClient";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async e => {
  e.preventDefault();
  try {
    await apiClient.post("/auth/signup", form);
    setSuccess("Registration successful! Please login.");
    setError("");
  } catch (err) {
    // Show backend error if possible
    const msg = err?.response?.data?.msg || "Registration failed. Email may already exist.";
    setError(msg);
    setSuccess("");
  }
};


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold">Register</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <input 
        type="text" 
        name="name" 
        placeholder="Name" 
        value={form.name} 
        onChange={handleChange} 
        required 
        className="w-full mb-3 p-2 border rounded"
      />
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        value={form.email} 
        onChange={handleChange} 
        required 
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full mb-5 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
    </form>
  );
}
