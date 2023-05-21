import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../api/firebase";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const isLogin = localStorage.getItem("isLogin");
  const location = useLocation();
  return isLogin === "true" ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace state={{ redirectedFrom: location }} />
  );
};

export default ProtectedRoute;
