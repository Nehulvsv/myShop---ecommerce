import React, { useEffect, useState } from "react";
import useProductPagination from "../hooks/useProductPagination";
import productService from "../services/products.service";
import ProductCard from "../components/ProductCard";

export default function ProductTable() {
  const {
    page,
    pageSize,
    totalPages,
    currentPage,
    setPage,
    setPageSize,
    setTotalPages,
    setCurrentPage,
  } = useProductPagination();

  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [productCount, setProductCount] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data =
          await productService.listAdminProductService.fetchAdminProductList(
            page,
            pageSize
          );
        setProduct(data.products);
        setTotalPages(data.totalPages);
        setProductCount(data.totalCount);
        setCurrentPage(data.currentPage);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [page, pageSize]);

  const pagination = () => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(startPage + 2, totalPages);

    const tpa = [];
    for (let index = startPage; index <= endPage; index++) {
      tpa.push(
        <button
          key={index}
          style={{
            margin: "0 5px",
            fontWeight: index === currentPage ? "bold" : "normal",
          }}
          onClick={() => setPage(index)}
        >
          {index}
        </button>
      );
    }

    const options = [];
    for (let i = 1; i <= productCount / 20; i++) {
      options.push(i * 5);
    }

    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <button
          onClick={() => setPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {tpa}

        <button
          onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

        <select
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
            width: "80px",
          }}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
            width: "100px",
          }}
          placeholder="Enter custom value"
          onChange={(e) => {
            setTimeout(() => {
              setPageSize(Number(e.target.value));
            }, 2000);
          }}
        />
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          margin: "20px",
        }}
      >
        <h1 className="text-3xl font-semibold mb-4 font-serif">MY PRODUCTS</h1>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <div className="mainContainer" style={styles.mainContainer}>
              {product.length > 0 ? (
                product.map((item) => <ProductCard key={item._id} {...item} />)
              ) : (
                <h1 style={styles.loading}>NO PRODUCTS</h1>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {product.length > 0 ? pagination() : " "}
            </div>
          </>
        )}
      </div>
    </>
  );
}
const styles = {
  mainContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  loading: {
    textAlign: "center",
  },
};
