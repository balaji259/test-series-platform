import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";


const Auth = ({ type }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
    const backendUrl='http://localhost:5000';
    const navigate=useNavigate(); 

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = type === "login" ? "/auth/login" : "/auth/register";
    const res = await axios.post(`http://localhost:5000${endpoint}`, form);
    console.log(res.data);
    console.log("form submitted successfully!");
    localStorage.setItem('token',res.data.token);
    if(type=="login")
    {
        if(res.data.user.role=="student")
            navigate('/dashboard');
        else
            navigate('/teacher/dashboard')
    }
    else if(type=="register")
        navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-5">{type === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "register" && <input type="text" name="name" onChange={handleChange} className="w-full border p-2" placeholder="Name" />}
        
        <input type="email" name="email" onChange={handleChange} className="w-full border p-2" placeholder="Email" required />
        <input type="password" name="password" onChange={handleChange} className="w-full border p-2" placeholder="Password" required />
        
        {type==="register" && <select
            name="role"
            onChange={handleChange}
            className="w-full border p-2"
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>}

        <button className="w-full bg-blue-500 text-white p-2 rounded">{type === "login" ? "Login" : "Register"}</button>

        {type==="login" && <p>Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={()=>{navigate('/register')}}>Register</span></p>}

        {type==="register" && <p>Already have an account? <span className="text-blue-500 cursor-pointer" onClick={()=>{navigate('/')}}>Login</span></p>}

      </form>
    </div>
  );
};

export default Auth;
