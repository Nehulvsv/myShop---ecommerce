import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import productsService from "../services/products.service";
import ProductCard from "../components/ProductCard";
import { FaStar } from "react-icons/fa";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../store/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ProductView() {
  const [product, setProduct] = useState();
  const [relatedproduct, setRelatedProduct] = useState();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [img, setImg] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchData = async () => {
    const data =
      await productsService.listSingleProductService.listSingleProduct(id);
    if (data.success === true) {
      setProduct(data.data.product);
    }
  };

  const fetchRelatedProduct = async () => {
    const data = await productsService.listProductService.fetchProductList(
      currentUser._id
    );
    setRelatedProduct(data);
  };

  const handleBuyNow = () => {
    if (!currentUser || !currentUser.currentUser) {
      navigate("/login");
      return;
    }
    const queryString = `productId=${id}&quantity=1`;
    navigate(`/checkout?${queryString}`);
  };

  const handleCreateReview = async () => {
    if (!currentUser || !currentUser.currentUser) {
      navigate("/login");
      return;
    }
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("productId", id);
    formData.append("userId", currentUser.currentUser._id);
    formData.append("userName", currentUser.currentUser.username);

    const data = await productsService.createReview(formData);
    window.location.reload();
  };

  const handleDeleteReview = async (id) => {
    const data = await productsService.deleteReview(
      id,
      currentUser.currentUser._id,
      product._id
    );
    window.location.reload();
  };

  const addtocart = async () => {
    if (!currentUser || !currentUser.currentUser) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.cost);
    formData.append("quantity", 1);
    formData.append("productId", product._id);
    formData.append("productImage", product.productImage[0]);
    formData.append("userId", currentUser.currentUser._id);

    try {
      dispatch(updateStart());
      const data = await productsService.addToCart(
        currentUser.currentUser._id,
        formData
      );
      if (data.success === true) {
        dispatch(updateSuccess(data.data));
        toast("product added successfully!");
      }
      if (data.success === false) {
        toast(data.message);
        dispatch(updateFailure());
        navigate("/addtocart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRelatedProduct();
  }, []);

  useEffect(() => {
    fetchRelatedProduct();
  }, [currentUser]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <ToastContainer />
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <img
            src={`http://localhost:8800/${product.productImage[img]}`}
            alt={product.title}
            className="w-full h-auto"
          />
          {product.productImage.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {product.productImage.map((image, index) => (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img
                  key={index}
                  src={`http://localhost:8800/${image}`}
                  alt={`Product Image ${index + 1}`}
                  className="w-16 h-auto cursor-pointer border"
                  onClick={() => setImg(index)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="col-span-1">
          <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
          <p className="text-lg mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-2">₹{product.cost}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={addtocart}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none"
            >
              Add to Cart
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 focus:outline-none"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
          <div>
            <div className="mt-4 border p-4 rounded-md flex">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`h-6 w-6 ${
                    index < rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(index + 1)}
                />
              ))}
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Write your review here..."
                className="w-full px-4 py-2 border rounded-md resize-none"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                onClick={handleCreateReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 max-w-lg">
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">Overall Rating</h3>
          <div className="flex items-center">
            <p className="text-3xl font-semibold mr-4">{product.ratings}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-8 w-8 ${
                    i < product.ratings ? "text-yellow-500" : "text-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a1 1 0 0 1 .778.371l2.314 2.89 4.357.76a1 1 0 0 1 .554 1.705l-3.142 2.471.988 4.441a1 1 0 0 1-1.451 1.054L10 13.675l-4.125 2.294a1 1 0 0 1-1.451-1.054l.988-4.441-3.142-2.47a1 1 0 0 1 .554-1.705l4.357-.76L9.222 1.37A1 1 0 0 1 10 1z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4">Product Reviews</h3>
        <div>
          {product.reviews.map((review, index) => (
            <div
              key={index}
              className="border p-4 rounded-md mb-4 flex align-middle justify-between"
            >
              <div>
                <div className="flex items-center mb-2">
                  <div className="ml-3">
                    <p className="text-lg font-semibold">{review.name}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
              {(currentUser.currentUser && currentUser.currentUser.role) ===
              "admin" ? (
                <span
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDeleteReview(review._id)}
                >
                  Delete
                </span>
              ) : (
                " "
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4">Related Products</h3>
        <div className="flex">
          {relatedproduct &&
            relatedproduct.products
              .slice(0, 3)
              .map((product) => <ProductCard {...product} />)}
        </div>
      </div>
    </div>
  );
}
