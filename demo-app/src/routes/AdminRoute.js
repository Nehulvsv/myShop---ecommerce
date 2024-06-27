import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminRoute() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchUser();
  }, []);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  if (currentUser.role !== "admin") {
    navigate("/login");

    return null;
  }
  return <Outlet />;
}
