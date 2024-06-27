import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProductCard({ _id, title, productImage, cost }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleClick = () => {
    window.location.reload(); // Reload the page
  };

  const handleBuyNow = () => {
    if (!currentUser._id) {
      navigate("/login");
      return;
    }
    const queryString = `productId=${_id}&quantity=1`;
    navigate(`/checkout?${queryString}`);
  };

  return (
    <div
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-4"
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-48">
          <Link to={`/productview/${_id}`}>
            <img
              src={`http://localhost:8800/${productImage[currentImageIndex]}`}
              alt={title}
              className="w-full h-full object-cover object-center"
            />
          </Link>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-700">₹{cost}</p>
          {currentUser && currentUser.role === "admin" ? (
            <Link to={`/productEdit/${_id}`}>
              <span className="text-blue-400">Edit</span>
            </Link>
          ) : (
            ""
          )}
          <br />

          <button
            onClick={handleBuyNow}
            className="text-red-400 cursor-pointer"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
}
