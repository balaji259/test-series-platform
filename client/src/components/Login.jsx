import React from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    navigate(data.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center font-bold">Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
        <p className="mt-2 text-center">
          No account? <a href="/register" className="text-blue-600">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
