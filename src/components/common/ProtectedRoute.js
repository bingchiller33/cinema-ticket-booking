import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({redirectPath, isAllowed }) => {
  return isAllowed ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
