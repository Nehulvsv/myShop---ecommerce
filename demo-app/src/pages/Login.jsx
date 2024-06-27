import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sha256 } from "js-sha256";
import authService from "../services/auth.service";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../store/user/userSlice";
export default function Login() {
  const [formdata, setFormdata] = useState({});
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hashedPassword = sha256(formdata.password);
    const dataToSend = {
      email: formdata.email,
      password: hashedPassword,
    };
    dispatch(signInStart());
    const data = await authService.loginService.login(dataToSend);
    if (data.success === true) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: data.payload.email,
          username: data.payload.username,
          _id: data.payload._id,
        })
      );
      dispatch(signInSuccess(data.payload));
      navigate("/");
    } else {
      setError(data.message);
      dispatch(signInFailure("Please fill all the fields"));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
        <Link
          to="/forget"
          className="text-blue-500 block mt-4 text-sm underline"
        >
          Forgot password?
        </Link>
        <p className="mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
