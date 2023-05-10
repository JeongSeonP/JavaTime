import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const [isLogin] = useAuthState(auth);
  const location = useLocation();
  return isLogin ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace state={{ redirectedFrom: location }} />
  );
};

export default ProtectedRoute;
