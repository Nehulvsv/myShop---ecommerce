import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <>
      <Navbar />
      {/* <Sidebar /> */}
      <main>
        <Outlet />
      </main>
    </>
  );
}
