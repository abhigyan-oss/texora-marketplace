import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: "buyer" | "supplier";
}

const ProtectedRoute = ({
  children,
  allowedRole,
}: ProtectedRouteProps) => {
  const token = localStorage.getItem("texora-token");

  const userData = localStorage.getItem("texora-user");

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "supplier") {
      return (
        <Navigate
          to="/supplier/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/buyer/dashboard"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;