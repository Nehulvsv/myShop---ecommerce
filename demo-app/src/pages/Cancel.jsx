import React from "react";
import { useNavigate } from "react-router-dom";

export default function Cancel() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Order Cancelled
        </h2>
        <p className="text-gray-700 mb-4">
          Your order has been cancelled. If you have any questions, please
          contact customer support.
        </p>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
