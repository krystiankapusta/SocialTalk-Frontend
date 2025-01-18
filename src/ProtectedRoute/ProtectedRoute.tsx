import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  authenticationPage?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  authenticationPage = false,
}) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  useEffect(() => {
    if (isInitialCheck) {
      setIsInitialCheck(false);
      return;
    }

    if (authenticationPage && isLoggedIn) {
      navigate("/");
      return;
    }

    if (!authenticationPage && !isLoggedIn) {
      navigate("/auth/login", { state: { from: location.pathname } });
      return;
    }
  }, [isLoggedIn, navigate, location, authenticationPage, isInitialCheck]);

  // Show nothing during initial check
  if (isInitialCheck) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
