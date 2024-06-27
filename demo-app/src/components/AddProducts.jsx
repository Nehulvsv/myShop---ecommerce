import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import productsService from "../services/products.service";

export default function CreateDodo() {
  const [product, setProduct] = useState({
    productImages: [],
    title: "",
    description: "",
    category: "",
    quantity: "",
    cost: "",
  });
  const [error, setError] = useState("");
  const [isValidFile, setIsValidFile] = useState([true, true, true]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const imageInputRefs = useRef([]);
  console.log(currentUser);

  const handleImageChange = (e, index) => {
    const files = Array.from(e.target.files);
    // Filter out non-image files
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setProduct((prevProduct) => {
        const updatedImages = [...prevProduct.productImages];
        updatedImages[index] = imageFiles[0];
        return { ...prevProduct, productImages: updatedImages };
      });
      setIsValidFile((prev) => {
        const updatedValidity = [...prev];
        updatedValidity[index] = true;
        return updatedValidity;
      });
    } else {
      setIsValidFile((prev) => {
        const updatedValidity = [...prev];
        updatedValidity[index] = false;
        return updatedValidity;
      });
      setError("Please select a valid image file.");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProduct({ ...product, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isValidFile.some((valid) => !valid)) {
        setError("Please select valid image files for all inputs.");
        return;
      }
      const formData = new FormData();
      product.productImages.forEach((image, index) => {
        formData.append(`productImage${index}`, image);
      });
      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("quantity", product.quantity);
      formData.append("cost", product.cost);
      formData.append("userId", currentUser._id);

      const data = await productsService.addProductService.addProduct(
        currentUser._id,
        formData
      );
      if (data.success === true) {
        navigate("/producttable");
      } else {
        setError(data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h4 className="text-center text-2xl mb-6 font-serif">ADD PRODUCT</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex gap-3 justify-center">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <input
                type="file"
                accept="image/*"
                name={`productImage${index}`}
                id={`productImage${index}`}
                onChange={(e) => handleImageChange(e, index)}
                ref={(el) => (imageInputRefs.current[index] = el)}
                className="hidden"
              />
              <label
                htmlFor={`productImage${index}`}
                className="relative cursor-pointer"
              >
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-md">
                  {product.productImages[index] ? (
                    <img
                      src={URL.createObjectURL(product.productImages[index])}
                      alt={`Product Image ${index}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">Upload Image</span>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="mb-2">Title</label>
            <input
              type="text"
              placeholder="Enter product name"
              id="title"
              value={product.title}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Description</label>
            <textarea
              placeholder="Enter product description"
              id="description"
              value={product.description}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Category</label>
            <input
              type="text"
              placeholder="Enter product category"
              id="category"
              value={product.category}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Quantity</label>
            <input
              type="number"
              placeholder="Enter product quantity"
              id="quantity"
              value={product.quantity}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Price</label>
            <input
              type="number"
              placeholder="Enter the cost"
              id="cost"
              value={product.cost}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={isValidFile.some((valid) => !valid)}
            className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none ${
              isValidFile.some((valid) => !valid)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
