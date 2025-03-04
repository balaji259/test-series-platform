import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TakeTest = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`/test/${id}`);
        setTest(res.data);
      } catch (error) {
        console.error("Error fetching test:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
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
      const studentId = payload.id;

      const formattedAnswers = Object.keys(answers).map((key) => ({
        question: test.questions[key].questionText,
        selectedOption: String(answers[key]),
        correct: false,
      }));

      const response = await axios.post(
        "http://localhost:5000/test/submit",
        { testId: id, studentId, answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Test submitted successfully!");
      setSubmitted(true);
      fetchResults(studentId);
    } catch (error) {
      console.error("❌ Error submitting test:", error);
      alert(error.response?.data?.message || "Failed to submit test. Try again.");
    }
  };

  const fetchResults = async (studentId) => {
    try {
      const res = await axios.get(`http://localhost:5000/result/${id}/results/${studentId}`);
      setScore(res.data.score);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (!test) return <p className="text-center text-red-500">No test found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-br from-blue-50 to-purple-100 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{test.title}</h2>
      <p className="text-center text-gray-600 text-lg mb-6">{test.subject}</p>

      {submitted && score !== null ? (
        <div className="mt-6 p-6 bg-green-100 border border-green-400 rounded-lg text-center">
          <h3 className="text-2xl font-semibold text-green-700">Test Completed!</h3>
          <p className="text-lg text-gray-800">Your Score: <span className="text-blue-600 font-bold">{score} / {test.questions.length}</span></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {test.questions.map((question, index) => (
            <div key={index} className="p-5 bg-white rounded-lg shadow-md border border-gray-200">
              <p className="font-bold text-lg text-gray-900 mb-3">{question.questionText}</p>
              {question.options.map((option, idx) => (
                <label key={idx} className="block p-2 hover:bg-gray-100 rounded transition">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleAnswerChange(index, option)}
                    required
                    className="mr-2 cursor-pointer"
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Submit Test
          </button>
        </form>
      )}
    </div>
  );
};

export default TakeTest;
