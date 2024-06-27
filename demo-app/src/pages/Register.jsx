import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sha256 } from "js-sha256";
import authService from "../services/auth.service";

export default function Register() {
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({});
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formdata.email)) {
      setError("Please enter a valid email address.");
      return;
    } else if (formdata.username.trim() === "") {
      setError("Please enter a valid username.");
      return;
    } else if (
      formdata.password.trim() === "" ||
      formdata.password.trim().length < 8
    ) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const hashedPassword = sha256(formdata.password);

    const dataToSend = {
      ...formdata,
      password: hashedPassword,
    };

    const data = await authService.registerService.register(dataToSend);
    if (data.success) {
      alert(data.message);
      navigate("/login");
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            id="username"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            onChange={(e) => {
              setFormdata({ ...formdata, [e.target.id]: e.target.value });
            }}
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            onChange={(e) => {
              setFormdata({ ...formdata, [e.target.id]: e.target.value });
            }}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            id="password"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            onChange={(e) => {
              setFormdata({ ...formdata, [e.target.id]: e.target.value });
            }}
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Register
          </button>
        </form>
        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
