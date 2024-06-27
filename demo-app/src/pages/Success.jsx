import React from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
        <p className="text-gray-700 mb-4">
          Your order has been successfully placed. Thank you for shopping with
          us!
        </p>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => {
            navigate("/");
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
