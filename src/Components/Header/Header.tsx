import Button from "../Button/Button";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

import { logout } from "../../endpoints/users";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { isLoggedIn, user, checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    await checkAuthStatus();
    navigate("/auth/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link className="custom-link" to="/">
          Social Talk
        </Link>
      </div>
      <nav className="header-right">
        {!isLoggedIn ? (
          <>
            <Button
              variant="primary"
              label="Login"
              onClick={() => handleNavigation("/auth/login")}
            />
            <Button
              variant="tertiary"
              label="Signup"
              onClick={() => handleNavigation("/auth/signup")}
            />
          </>
        ) : (
          <>
            {user ? (
              <div className="user-info">{user.username}</div>
            ) : (
              <div className="user-info">Loading...</div>
            )}
            <Button
              variant="secondary"
              label="Friends"
              onClick={() => handleNavigation("/friends")}
            />
            <Button
              variant="primary"
              label="Profile"
              onClick={() => handleNavigation("/profile")}
            />
            <Button variant="tertiary" label="Logout" onClick={handleLogout} />
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
