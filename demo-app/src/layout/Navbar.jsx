import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCartArrowDown, FaUser, FaSignOutAlt } from "react-icons/fa";
import { signOutSuccess } from "../store/user/userSlice";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = () => {
    dispatch(signOutSuccess());
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="bg-gray-100 py-4 px-6 flex justify-between items-center rounded-md">
      <div>
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 hover:text-gray-600"
        >
          myShop
        </Link>
      </div>
      <div className="flex items-center space-x-4 relative">
        {currentUser && (
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                onClick={toggleDropdown}
                className="text-gray-800 flex items-center gap-2 focus:outline-none"
              >
                <FaUser />
                {currentUser.username}
              </button>
            </div>
            {showDropdown && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <FaSignOutAlt className="mr-2 inline-block" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {!currentUser ? (
          <>
            <Link to="/register" className="text-gray-800 hover:text-gray-600">
              Register
            </Link>
            <Link to="/login" className="text-gray-800 hover:text-gray-600">
              Login
            </Link>
          </>
        ) : (
          <></>
        )}
        {currentUser && currentUser.role === "admin" && (
          <>
            <Link
              to="/addProduct"
              className="text-gray-800 hover:text-gray-600"
            >
              Add Product
            </Link>
            <Link
              to="/producttable"
              className="text-gray-800 hover:text-gray-600"
            >
              My Products
            </Link>
          </>
        )}
        {currentUser && (
          <Link to="/addtocart" className="relative text-gray-800">
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 absolute -top-3.5 right-0 rounded-full">
              {currentUser.addToCartProducts.length}
            </span>
            <FaCartArrowDown className="text-3xl hover:text-gray-600" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
