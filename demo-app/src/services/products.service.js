const BASE_URL = "http://localhost:8800/api/product";

const addProductService = {
  async addProduct(id, formData) {
    try {
      const res = await fetch(
        `http://localhost:8800/api/product/addproduct/${id}`,
        {
          method: "post",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message };
      } else {
        return { success: true, message: data.message };
      }
    } catch (e) {
      throw new Error(e.message);
    }
  },
};

const productEditService = {
  async productEdit(id, formData) {
    try {
      const res = await fetch(`${BASE_URL}/updateproduct/${id}`, {
        method: "put",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message };
      } else {
        return { success: true, message: data.message };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

const listAdminProductService = {
  async fetchAdminProductList(page, pageSize = 5) {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser || !currentUser._id) {
        return { products: [], currentPage: 0, totalPages: 0 };
      }

      const res = await fetch(
        `${BASE_URL}/listadminproduct/${currentUser._id}?page=${page}&pageSize=${pageSize}`,
        {
          method: "post",
          headers: {
            "X-Request-Name": "list product",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

const listProductService = {
  async fetchProductList(page, pageSize = 5) {
    try {
      const res = await fetch(
        `${BASE_URL}/listproduct?page=${page}&pageSize=${pageSize}`,
        {
          method: "post",
          headers: {
            "X-Request-Name": "list product",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

const productDeleteService = {
  async productDelete(id) {
    const res = await fetch(`${BASE_URL}/deleteproduct/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, message: "product deleted successfully" };
    } else {
      throw new Error(data.message);
    }
  },
};

const listSingleProductService = {
  async listSingleProduct(id) {
    const res = await fetch(`${BASE_URL}/listProductById/${id}`, {
      method: "post",
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, data: data };
    } else {
      return { success: false, message: data.message };
    }
  },
};

// services/checkoutService.js

const checkoutService = async (checkOutProducts) => {
  try {
    const res = await fetch("http://localhost:8800/api/product/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        items: checkOutProducts,
      }),
    });
    const data = await res.json();
    return data.url;
  } catch (e) {
    console.log(e);
    throw new Error("An error occurred during checkout");
  }
};

const addToCart = async (userId, formData) => {
  try {
    const res = await fetch(
      `http://localhost:8800/api/product/addtocart/${userId}`,
      {
        method: "post",
        body: formData,
      }
    );
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      return { success: true, data: data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (e) {
    console.log(e);
  }
};

const removeFormCart = async (userId, productId) => {
  try {
    const res = await fetch(
      `http://localhost:8800/api/product/removetocart/${userId}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      return { success: true, message: data.message, payload: data.payload };
    } else {
      return { success: false, message: data.message };
    }
  } catch (e) {
    console.log(e);
  }
};

const createReview = async (formData) => {
  try {
    const res = await fetch(`http://localhost:8800/api/product/review`, {
      method: "post",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, data: data.reviewProduct };
    } else {
      return { success: false, message: data.message };
    }
  } catch (e) {
    console.log(e);
  }
};

const deleteReview = async (id, userId, productId) => {
  try {
    const res = await fetch(
      `http://localhost:8800/api/product/admin/review?id=${id}&productId=${productId}&userId=${userId}`,
      {
        method: "post",
      }
    );
  } catch (e) {
    console.log(e);
  }
};

export default {
  listAdminProductService,
  listProductService,
  productEditService,
  productDeleteService,
  addProductService,
  listSingleProductService,
  checkoutService,
  addToCart,
  removeFormCart,
  createReview,
  deleteReview,
};
