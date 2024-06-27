import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import productsService from "../services/products.service";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useDispatch } from "react-redux";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../store/user/userSlice";

export default function AddToCart() {
  const { currentUser } = useSelector((state) => state.user);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [productQuantities, setProductQuantities] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const products = currentUser.addToCartProducts || [];
    setCartProducts(products);
    const quantities = {};
    products.forEach((product) => {
      quantities[product.productId] = parseInt(product.quantity);
    });
    setProductQuantities(quantities);
  }, [currentUser.addToCartProducts]);

  useEffect(() => {
    let total = 0;
    cartProducts.forEach((product) => {
      total += product.price * productQuantities[product.productId];
    });
    setTotalAmount(total);
  }, [cartProducts, productQuantities]);

  const handleIncrement = (productId) => {
    if (productQuantities[productId] < 10) {
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: (prevQuantities[productId] || 0) + 1,
      }));
    }
  };

  const handleDecrement = (productId) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max((prevQuantities[productId] || 0) - 1, 1),
    }));
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      dispatch(updateStart());
      const data = await productsService.removeFormCart(
        currentUser._id,
        productId
      );
      if (data.success === true) {
        dispatch(updateSuccess(data.payload));
      } else {
        dispatch(updateFailure());
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleBuyNow = () => {
    const queryString = cartProducts
      .map(
        (product) =>
          `productId=${product.productId}&quantity=${
            productQuantities[product.productId]
          }`
      )
      .join("&");
    navigate(`/checkout?${queryString}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4 font-serif">MY CART</h1>
      {cartProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cartProducts.map((product) => (
              <div
                key={product.productId}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <Link to={`/productview/${product.productId}`}>
                    <img
                      src={`http://localhost:8800/${product.productImage}`}
                      alt={product.title}
                      className="w-24 h-24 mr-4 object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={`/productview/${product.productId}`}>
                      <h3 className="font-semibold text-lg">{product.title}</h3>
                    </Link>
                    <p className="text-gray-500">Price: ₹{product.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleDecrement(product.productId)}
                    className="text-gray-600 border rounded-full px-3 py-1 focus:outline-none"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={Math.min(productQuantities[product.productId], 10)}
                    max={10}
                    className="mx-2 w-12 text-center border rounded focus:outline-none"
                  />
                  <button
                    onClick={() => handleIncrement(product.productId)}
                    className="text-gray-600 border rounded-full px-3 py-1 focus:outline-none"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveFromCart(product.productId)}
                    className="ml-4 text-red-500 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-gray-500 mt-auto">
                  Total: ₹{product.price * productQuantities[product.productId]}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-xl">Your cart is empty</p>
      )}
      {cartProducts.length > 0 && (
        <div className="flex justify-between items-center mt-8">
          <h3 className="text-xl font-semibold">Total: ₹{totalAmount}</h3>
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}
