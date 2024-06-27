import React, { useState } from "react";
// import useCurrentUser from "../hooks/useCurrentUser";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={` bg-gray-100 text-black h-screen ${
        isSidebarOpen ? "w-64" : "w-16"
      } py-4 px-6`}
    >
      <div className="flex justify-end items-end mb-4">
        {/* <h2 className="text-2xl font-bold">Sidebar</h2> */}
        <button className="text-lg flex justify-end " onClick={toggleSidebar}>
          {isSidebarOpen ? "<" : ">"}
        </button>
      </div>
      {isSidebarOpen && <div>{/* Add sidebar content here */}</div>}
    </div>
  );
}
