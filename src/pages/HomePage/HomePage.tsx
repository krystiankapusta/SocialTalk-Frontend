import Button from "../../Components/Button/Button";
import "./styles.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const HomePageTitle = `Welcome ${user?.username} to Social Talk`;

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>{HomePageTitle}</h1>
        <p>Connect, share, and engage with your community like never before.</p>
      </div>
      <div className="home-main">
        <section className="features">
          <div className="feature">
            <h2>Create Connections</h2>
            <p>
              Find and connect with friends, family, and like-minded
              individuals.
            </p>
          </div>
          <div className="feature">
            <h2>Engage in Communities</h2>
            <p>Join groups and discussions that match your interests.</p>
          </div>
        </section>
        <section className="cta">
          {!isLoggedIn ? (
            <Button
              variant="primary"
              label="Get Started"
              onClick={() => handleNavigation("/auth/login")}
            />
          ) : (
            <Button
              variant="secondary"
              label="Chat"
              onClick={() => handleNavigation("/chat")}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
