import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get("/test/");
        setTests(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    fetchTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center py-10">
      <h2 className="text-4xl font-extrabold text-white mb-8">Available Tests</h2>
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div
              key={test._id}
              className="p-6 bg-white rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer border-l-8 border-blue-500"
              onClick={() => navigate(`/test/${test._id}`)}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{test.title}</h3>
              <p className="text-gray-600 text-sm">{test.subject}</p>
            </div>
          ))
        ) : (
          <p className="text-white text-lg">No tests available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
