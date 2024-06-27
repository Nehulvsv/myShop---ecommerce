import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

export default function ForgetPassword() {
  const [formdata, setFormdata] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await authService.ForgetPasswordService.ForgetPassword(
      formdata
    );
    if (data.success === true) {
      navigate("/");
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            onChange={(e) => {
              setFormdata({ ...formdata, [e.target.id]: e.target.value });
            }}
          />
          <input
            type="password"
            placeholder="Enter your password"
            id="password"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            onChange={(e) => {
              setFormdata({ ...formdata, [e.target.id]: e.target.value });
            }}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Reset
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
