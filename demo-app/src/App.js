// Importing necessary modules and components
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ProductAdmin from "./pages/ProductAdmin";
import ProductEdit from "./pages/ProductEdit";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import AddProducts from "./components/AddProducts";
import ProductDummy from "./pages/ProductDummy";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import CheckOut from "./pages/CheckOut";
import ProductView from "./pages/ProductView";
import AddToCart from "./pages/AddToCart";

// App component function
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/forget" element={<ForgetPassword />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/login" element={<Login />} />

        {/* Routes wrapped within Layout */}
        <Route element={<Layout />}>
          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/addtocart" element={<AddToCart />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/addProduct" element={<AddProducts />} />
            <Route path="/productEdit/:id" element={<ProductEdit />} />
            <Route path="/producttable" element={<ProductAdmin />} />
          </Route>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductDummy />} />
          <Route path="/productview/:id" element={<ProductView />} />
          <Route path="/aboutus" element={<AboutUs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
