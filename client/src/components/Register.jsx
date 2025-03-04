import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/auth/register", { name, email, password, role });
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center font-bold">Register</h2>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-2 border rounded" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-2 border rounded" required />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 mb-2 border rounded">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
