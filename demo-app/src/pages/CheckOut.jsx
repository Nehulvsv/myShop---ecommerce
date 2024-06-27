import React, { useEffect, useState } from "react";
import productsService from "../services/products.service";
import { Link, useLocation } from "react-router-dom";
import Address from "../components/Address";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckOut() {
  const [checkOutProducts, setCheckOutProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const location = useLocation();
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const products = [];
    let totalPrice = 0;
    let totalQuantity = 0;

    const productIds = [];
    const quantities = [];

    params.forEach((value, key) => {
      if (key.startsWith("productId")) {
        productIds.push(value);
      }
      if (key.startsWith("quantity")) {
        quantities.push(parseInt(value));
      }
    });

    if (productIds.length !== quantities.length) {
      console.error("Error: Inconsistent productId and quantity data");
      return;
    }

    // Process each productId and quantity
    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
      const quantity = quantities[i];

      // Fetch product details using productId from backend
      // eslint-disable-next-line no-loop-func
      const fetchData = async () => {
        try {
          const data =
            await productsService.listSingleProductService.listSingleProduct(
              productId
            );

          if (data.success === true) {
            const product = data.data.product;
            products.push({ ...product, quantity });
            totalPrice += product.cost * quantity;
            totalQuantity += quantity;
            setCheckOutProducts(products);
            setTotalPrice(totalPrice);
            setTotalQuantity(totalQuantity);
          }
        } catch (e) {
          console.log(e);
        }
      };

      fetchData();
    }
  }, [location.search]);

  const handleCheckOut = async () => {
    try {
      const url = await productsService.checkoutService(checkOutProducts);
      window.location = url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  return (
    <div className="container mx-auto mt-8">
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Total Products Summary</h2>
          {checkOutProducts.map((product) => (
            <div className="flex items-center mb-4" key={product._id}>
              <Link to={`/productview/${product._id}`}>
                <img
                  src={`http://localhost:8800/${product.productImage[0]}`}
                  alt=""
                  className="w-24 h-24 rounded mr-4"
                />
              </Link>
              <div>
                <Link to={`/productview/${product._id}`}>
                  <h2 className="text-lg font-semibold">{product.title}</h2>
                </Link>
                <p className="text-gray-600">Price: ₹{product.cost}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Total Price:</h3>
            <p>₹{totalPrice}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Total Quantity:</h3>
            <p>{totalQuantity}</p>
          </div>
          <div className="mb-4">
            <Address onSelectAddress={handleSelectAddress} />
          </div>
          {selectedAddress ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleCheckOut}
            >
              Checkout
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => toast.error("select the an address")}
            >
              Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
