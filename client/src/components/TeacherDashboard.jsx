import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const TeacherDashboard = () => {
  const [viewMode, setViewMode] = useState("menu"); // "menu", "create", "results"
  const [testData, setTestData] = useState({
    title: "",
    subject: "Physics",
    scheduledDate: "",
    questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
  });
  const [results, setResults] = useState([]); // To store fetched results

  const handleChange = (e) => {
    setTestData({ ...testData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...testData.questions];
    if (field === "options") {
      updatedQuestions[index].options[value.optionIndex] = value.text;
    } else {
      updatedQuestions[index][field] = value;
    }
    setTestData({ ...testData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setTestData({
      ...testData,
      questions: [...testData.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = testData.questions.filter((_, i) => i !== index);
    setTestData({ ...testData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      const response = await axios.post(
        "/test/create",
        { ...testData, createdBy: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setViewMode("menu"); // Return to menu after test creation
    } catch (error) {
      alert("Error creating test");
    }
  };

  const fetchResults = async () => {
    try {
      axios.get("/result/getresults")
      .then(response => {
        console.log("API Response:", response.data);
        const transformedResults = Object.entries(response.data); // Convert object to array
        setResults(transformedResults);
      }) 
    } catch (error) {
      alert("Error fetching results");
    }
  };

 
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
        <p className="mt-2">Manage tests & view student results.</p>

        {viewMode === "menu" && (
          <div className="flex space-x-4 mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setViewMode("create")}>
              Create a Test
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => { setViewMode("results"); fetchResults(); }}>
              View Results
            </button>
          </div>
        )}

        {viewMode === "create" && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <input type="text" name="title" placeholder="Test Title" className="w-full p-2 border rounded"
              onChange={handleChange} required />

            <select name="subject" className="w-full p-2 border rounded" onChange={handleChange} required>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Math">Math</option>
            </select>

            <input type="datetime-local" name="scheduledDate" className="w-full p-2 border rounded"
              onChange={handleChange} required />

            <h3 className="text-lg font-semibold mt-4">Questions</h3>
            {testData.questions.map((q, index) => (
              <div key={index} className="p-3 border rounded space-y-2 bg-gray-50">
                <input type="text" placeholder="Question" className="w-full p-2 border rounded" value={q.questionText} 
                  onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)} required />
                
                {q.options.map((option, i) => (
                  <input key={i} type="text" placeholder={`Option ${i + 1}`} className="w-full p-2 border rounded"
                    value={option} onChange={(e) => handleQuestionChange(index, "options", { optionIndex: i, text: e.target.value })} required />
                ))}

                <select className="w-full p-2 border rounded" value={q.correctAnswer} onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)} required>
                  <option value="">Select Correct Answer</option>
                  {q.options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>

                <button type="button" className="bg-red-500 text-white p-1 rounded" onClick={() => removeQuestion(index)}>Remove</button>
              </div>
            ))}

            <button type="button" className="bg-green-500 text-white px-4 py-2 rounded" onClick={addQuestion}>+ Add Question</button>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Create Test</button>
          </form>
        )}

        {viewMode === "results" && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Student Results</h3>
            {results.length === 0 ? (
              <p>No results available</p>
            ) : (
              // <table className="w-full mt-2 border-collapse border border-gray-300">
              //   <thead>
              //     <tr className="bg-gray-200">
              //       <th className="border p-2">Student Name</th>
              //       <th className="border p-2">Test Title</th>
              //       <th className="border p-2">Score</th>
              //     </tr>
              //   </thead>
              //   <tbody>
              //     {results.map((result, index) => (
              //       <tr key={index} className="text-center">
              //         <td className="border p-2">{result.studentName}</td>
              //         <td className="border p-2">{result.testTitle}</td>
              //         <td className="border p-2">{result.score}</td>
              //       </tr>
              //     ))}
              //   </tbody>
              // </table>
             
              results.map(([testTitle, students]) => (
                <div key={testTitle} className="p-6 border rounded-lg mt-4 shadow-lg bg-white">
                  {/* Test Name Heading */}
                  <h4 className="font-bold text-xl text-gray-800 mb-4">{testTitle}</h4>
            
                  {/* Table for Student Results */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      {/* Table Header */}
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Marks</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Submitted At</th>
                        </tr>
                      </thead>
            
                      {/* Table Body */}
                      <tbody>
                        {students.map((student, index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.studentName}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                            <td className="border border-gray-300 px-4 py-2 font-semibold">{student.score}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                              {new Date(student.submittedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
              
              
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
