import React from "react";

import { Outlet } from "react-router-dom";
import Products from "./Products";
//new line added
//home page
export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "8 0%",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Products />
      </div>{" "}
      <Outlet />
    </div>
  );
}
