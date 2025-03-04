import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import TakeTest from "./components/TakeTest";
import TeacherDashboard from "./components/TeacherDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth type="login" />} />
        <Route path="/register" element={<Auth type="register" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/test/:id" element={<TakeTest />} />
      </Routes>
    </Router>
  );
}

export default App;
