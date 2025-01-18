import { useAuth } from "../../context/AuthContext";
import "./styles.css";

const ProfilePage = () => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || !user) {
    return (
      <div className="profile-container">
        <div className="empty-state">Please log in to view your profile.</div>
      </div>
    );
  }

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{getUserInitials(user.username)}</div>
        <div className="profile-info-header">
          <h1 className="profile-username">{user.username}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="details-section">
          <h2 className="section-title">Account Information</h2>
          <div className="detail-item">
            <span className="detail-label">Username</span>
            <span className="detail-value">{user.username}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Account Status</span>
            <span
              className={`status-badge ${user.enabled ? "status-active" : "status-inactive"}`}
            >
              {user.enabled ? "Verified" : "Not Verified"}
            </span>
          </div>
        </div>

        <div className="details-section">
          <h2 className="section-title">Additional Information</h2>
          <div className="detail-item">
            <span className="detail-label">User ID</span>
            <span className="detail-value">{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
