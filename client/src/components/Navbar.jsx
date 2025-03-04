import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Test Simulation</h1>
      <div>
        <Link to="/dashboard" className="px-4">Dashboard</Link>
        <Link to="/" className="px-4">Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
