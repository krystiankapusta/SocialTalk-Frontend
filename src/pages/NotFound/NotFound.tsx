import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button/Button";
import "./styles.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/");
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          variant="primary"
          label="Back to Home"
          onClick={handleNavigation}
        />
      </div>
    </div>
  );
};

export default NotFound;
