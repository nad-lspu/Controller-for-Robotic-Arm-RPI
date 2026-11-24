import { type ReactNode, useContext, useEffect } from "react";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [user, navigate]);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
