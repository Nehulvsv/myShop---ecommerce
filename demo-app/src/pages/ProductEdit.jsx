import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productsService from "../services/products.service";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageInputRefs = useRef([]);
  const [product, setProduct] = useState({
    productImage: [],
    title: "",
    description: "",
    category: "",
    quantity: "",
    cost: "",
  });

  const fetchData = async () => {
    const res = await fetch(
      `http://localhost:8800/api/product/listProductById/${id}`,
      {
        method: "post",
      }
    );
    const data = await res.json();
    setProduct(data.product);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      product.productImage.forEach((image, index) => {
        formData.append(`productImage${index}`, image);
      });
      formData.append("title", product.title);
      formData.append("cost", product.cost);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("quantity", product.quantity);

      const data = await productsService.productEditService.productEdit(
        id,
        formData
      );

      if (data.success === true) {
        navigate("/ProductTable");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async () => {
    try {
      const data = await productsService.productDeleteService.productDelete(id);
      if (data.success === true) {
        navigate("/ProductTable");
      }
    } catch (err) {
      alert(err);
    }
  };

  // const handleImageChange = (e, index) => {
  //   const files = Array.from(e.target.files);
  //   const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  //   if (imageFiles.length > 0) {
  //     const updatedImages = product.productImage.map((image, i) => {
  //       if (i === index) {
  //         return imageFiles[0];
  //       }
  //       return image;
  //     });

  //     setProduct((prevProduct) => ({
  //       ...prevProduct,
  //       productImage: updatedImages,
  //     }));
  //   }
  // };

  // const handleImageChange = (e, index) => {
  //   const files = Array.from(e.target.files);
  //   const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  //   if (imageFiles.length > 0) {
  //     setProduct((prevProduct) => ({
  //       ...prevProduct,
  //       productImage: [...prevProduct.productImage, imageFiles[0]],
  //     }));
  //   }
  // };

  const handleImageChange = (e, index) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      setProduct((prevProduct) => {
        const updatedImages = [...prevProduct.productImage];
        if (index < updatedImages.length) {
          // Replace existing image at the specified index
          updatedImages[index] = imageFiles[0];
        } else {
          // Append new image if the index is out of range
          updatedImages.push(imageFiles[0]);
        }
        return { ...prevProduct, productImage: updatedImages };
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <form onSubmit={handleEdit} encType="multipart/form-data">
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              type="file"
              accept="image/*"
              name={`productImage${index}`}
              id={`productImage${index}`}
              onChange={(e) => handleImageChange(e, index)}
              ref={(el) => (imageInputRefs.current[index] = el)}
              className="hidden"
            />
          ))}
          <div className="flex flex-wrap gap-4 justify-center">
            {[0, 1, 2].map((index) => (
              <label
                key={index}
                htmlFor={`productImage${index}`}
                className="relative cursor-pointer"
              >
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-md border border-gray-300">
                  {product.productImage && product.productImage[index] ? (
                    typeof product.productImage[index] === "string" ? (
                      <img
                        src={`http://localhost:8800/${product.productImage[index]}`}
                        alt={`Product Image ${index}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(product.productImage[index])}
                        alt={`Product Image ${index}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    )
                  ) : (
                    <span className="text-gray-400">Upload Image</span>
                  )}
                </div>
              </label>
            ))}
          </div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={product.title}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            onChange={(e) =>
              setProduct((prevProduct) => ({
                ...prevProduct,
                [e.target.id]: e.target.value,
              }))
            }
            placeholder="Enter product title"
            required
          />
          <label className="block mb-2">Description</label>
          <textarea
            type="text"
            id="description"
            value={product.description}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            onChange={(e) =>
              setProduct((prevProduct) => ({
                ...prevProduct,
                [e.target.id]: e.target.value,
              }))
            }
            placeholder="Enter Product Description"
            required
          />
          <label className="block mb-2">Category</label>
          <input
            type="text"
            id="category"
            value={product.category}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            onChange={(e) =>
              setProduct((prevProduct) => ({
                ...prevProduct,
                [e.target.id]: e.target.value,
              }))
            }
            placeholder="Enter Product Category"
            required
          />
          <label className="block mb-2">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={product.quantity}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            onChange={(e) =>
              setProduct((prevProduct) => ({
                ...prevProduct,
                [e.target.id]: e.target.value,
              }))
            }
            placeholder="Enter Product Quantity"
            required
          />
          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={product.cost}
            id="cost"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            onChange={(e) =>
              setProduct((prevProduct) => ({
                ...prevProduct,
                [e.target.id]: e.target.value,
              }))
            }
            placeholder="Enter Product Price"
            required
          />
          <div className="flex justify-between">
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg mr-4 hover:bg-green-600 focus:outline-none"
              type="submit"
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
