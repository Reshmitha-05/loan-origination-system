import { useState } from "react";
import { FaBars, FaBell } from "react-icons/fa";

function HeaderBar({ toggleSidebar, onLogout, onProfile, onSettings }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  
  const notifications = [
    { id: 1, text: "New loan application submitted", time: "2 mins ago", read: false },
    { id: 2, text: "Loan #3 approved", time: "15 mins ago", read: false },
    { id: 3, text: "Customer added", time: "1 hour ago", read: false },
    { id: 4, text: "System maintenance scheduled", time: "3 hours ago", read: true },
  ];

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="fixed-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar} title="Toggle Sidebar">
          <FaBars />
        </button>
        <h2 className="header-title">Loan Origination System</h2>
      </div>

      <div className="header-right">
        {/* Notification Bell */}
        <div className="notification-container">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button className="mark-all-read" onClick={handleMarkAllRead}>
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                      onClick={() => setShowNotifications(false)}
                    >
                      <div className="notification-content">
                        <span className="notification-text">{notification.text}</span>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                      {!notification.read && <span className="notification-dot"></span>}
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="profile-container">
          <button 
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
            title="User Profile"
          >
            <span className="avatar-circle">A</span>
            <span className="profile-role">Admin</span>
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <span className="avatar-circle-large">A</span>
                <div className="profile-details">
                  <span className="profile-name">Admin User</span>
                  <span className="profile-email">admin@los.com</span>
                </div>
              </div>
              <div className="profile-menu">
                <button className="profile-menu-item" onClick={() => { setShowProfile(false); onProfile(); }}>
                  Profile
                </button>
                <button className="profile-menu-item" onClick={() => { setShowProfile(false); onSettings(); }}>
                  Settings
                </button>
                <button className="profile-menu-item logout" onClick={() => { setShowProfile(false); onLogout(); }}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
