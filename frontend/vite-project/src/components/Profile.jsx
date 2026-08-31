import { FaUserCircle } from "react-icons/fa";

function Profile({ onBack }) {
  const profileData = {
    name: "Admin User",
    role: "Admin",
    organization: "Loan Origination System",
    email: "admin@los.com",
    dateJoined: "January 15, 2026"
  };

  return (
    <div className="page-container">
      <div className="profile-page">
        <div className="profile-header">
          <button className="btn-back" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <h2 className="page-title">Profile</h2>
        </div>

        <div className="profile-card">
          <div className="profile-header-section">
            <FaUserCircle className="profile-icon-large" />
            <div className="profile-info">
              <h3 className="profile-name">{profileData.name}</h3>
              <p className="profile-role">{profileData.role}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-detail-row">
              <span className="profile-label">Organization</span>
              <span className="profile-value">{profileData.organization}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-label">Email</span>
              <span className="profile-value">{profileData.email}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-label">Date Joined</span>
              <span className="profile-value">{profileData.dateJoined}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
