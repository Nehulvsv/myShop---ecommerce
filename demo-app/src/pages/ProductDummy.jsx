import React, { useState, useEffect } from "react";

export default function Product() {
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProduct = async () => {
    const response = await fetch(
      "https://dummyjson.com/products?limit=20&skip=1"
    );
    const data = await response.json();
    console.log(data);
    setProduct(data.products);
    setTotalPages(Math.ceil(data.products.length / 10));
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const changePage = (pageNumber) => {
    setPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <span
          key={i}
          onClick={() => changePage(i)}
          style={{ cursor: "pointer", marginRight: "10px" }}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="mainContainer" style={styles.mainContainer}>
        {product.length > 0 ? (
          product.slice(page * 10 - 10, page * 10).map((item, index) => (
            <div key={index} style={styles.product}>
              <img src={item.images[0]} alt={item.title} style={styles.image} />
              <p style={styles.title}>{item.title}</p>
              <p style={styles.price}>Price: {item.price}</p>
            </div>
          ))
        ) : (
          <h1 style={styles.loading}>Loading...</h1>
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
        {renderPageNumbers()}
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
  product: {
    width: "200px",
    margin: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    marginBottom: "10px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  price: {
    fontSize: "16px",
  },
  loading: {
    textAlign: "center",
  },
};
