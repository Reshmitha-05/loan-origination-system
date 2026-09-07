import { useEffect, useState } from "react";
import { FaBars, FaBell } from "react-icons/fa";

function HeaderBar({
  toggleSidebar,
  onLogout,
  onProfile,
  onSettings,
  userName,
  userRole,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [applications, setApplications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);

  // Load applications from localStorage
  const loadNotifications = () => {
    const storedApplications =
      localStorage.getItem("customerApplications");

    if (storedApplications) {
      try {
        setApplications(JSON.parse(storedApplications));
      } catch (error) {
        console.error("Error loading applications:", error);
        setApplications([]);
      }
    } else {
      setApplications([]);
    }

    const storedReadNotifications =
      localStorage.getItem("readNotifications");

    if (storedReadNotifications) {
      try {
        setReadNotifications(JSON.parse(storedReadNotifications));
      } catch (error) {
        setReadNotifications([]);
      }
    }
  };

  // Load notifications when HeaderBar opens
  useEffect(() => {
    loadNotifications();

    // Check for changes periodically
    const interval = setInterval(() => {
      loadNotifications();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Close profile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-container")) {
        setShowProfile(false);
      }

      if (!event.target.closest(".notification-container")) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * ADMIN NOTIFICATIONS
   *
   * Every pending application becomes a notification.
   */
  const adminNotifications = applications
    .filter(
      (application) =>
        application.status === "Pending" ||
        application.status === "Under Review"
    )
    .map((application) => ({
      id: `admin-${application.id}`,
      text: `New ${application.loanType} loan application submitted by ${
        application.customerName || "Customer"
      }`,
      time: application.appliedDate
        ? `Applied on ${application.appliedDate}`
        : "Recently submitted",
      read: readNotifications.includes(
        `admin-${application.id}`
      ),
    }));

  /*
   * CUSTOMER NOTIFICATIONS
   *
   * Only show decisions that have actually been made.
   */
  const currentCustomerEmail =
    localStorage.getItem("customerEmail");

  const customerNotifications = applications
    .filter(
      (application) =>
        application.customerId === currentCustomerEmail &&
        (application.status === "Approved" ||
          application.status === "Declined" ||
          application.status === "Rejected")
    )
    .map((application) => ({
      id: `customer-${application.id}-${application.status}`,
      text:
        application.status === "Approved"
          ? `Your ${application.loanType} loan application was approved`
          : `Your ${application.loanType} loan application was declined`,
      time: application.decisionDate
        ? `Decision on ${application.decisionDate}`
        : "Recently updated",
      read: readNotifications.includes(
        `customer-${application.id}-${application.status}`
      ),
    }));

  const notifications =
    userRole === "customer"
      ? customerNotifications
      : adminNotifications;

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    const allNotificationIds = notifications.map(
      (notification) => notification.id
    );

    const updatedReadNotifications = [
      ...new Set([
        ...readNotifications,
        ...allNotificationIds,
      ]),
    ];

    setReadNotifications(updatedReadNotifications);

    localStorage.setItem(
      "readNotifications",
      JSON.stringify(updatedReadNotifications)
    );
  };

  // Mark one notification as read
  const handleNotificationClick = (notificationId) => {
    const updatedReadNotifications = [
      ...new Set([
        ...readNotifications,
        notificationId,
      ]),
    ];

    setReadNotifications(updatedReadNotifications);

    localStorage.setItem(
      "readNotifications",
      JSON.stringify(updatedReadNotifications)
    );

    setShowNotifications(false);
  };

  // Get first letter of name for avatar
  const avatarInitial = userName
    ? userName.charAt(0).toUpperCase()
    : userRole === "admin"
    ? "A"
    : "C";

  return (
    <div className="fixed-header">

      {/* LEFT SIDE */}

      <div className="header-left">

        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          title="Toggle Sidebar"
        >
          <FaBars />
        </button>

        <h2 className="header-title">
          Loan Origination System
        </h2>

      </div>


      {/* RIGHT SIDE */}

      <div className="header-right">

        {/* NOTIFICATIONS */}

        <div className="notification-container">

          <button
            className="notification-btn"
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
            title="Notifications"
          >
            <FaBell />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}
          </button>


          {showNotifications && (

            <div className="notification-dropdown">

              <div className="notification-header">

                <h3>
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <button
                    className="mark-all-read"
                    onClick={handleMarkAllRead}
                  >
                    Mark all as read
                  </button>
                )}

              </div>


              <div className="notification-list">

                {notifications.length > 0 ? (

                  notifications.map((notification) => (

                    <div
                      key={notification.id}
                      className={`notification-item ${
                        notification.read
                          ? "read"
                          : "unread"
                      }`}
                      onClick={() =>
                        handleNotificationClick(
                          notification.id
                        )
                      }
                    >

                      <div className="notification-content">

                        <span className="notification-text">
                          {notification.text}
                        </span>

                        <span className="notification-time">
                          {notification.time}
                        </span>

                      </div>


                      {!notification.read && (
                        <span className="notification-dot"></span>
                      )}

                    </div>

                  ))

                ) : (

                  <div className="no-notifications">
                    No notifications
                  </div>

                )}

              </div>

            </div>

          )}

        </div>


        {/* PROFILE */}

        <div className="profile-container">

          <button
            className="profile-btn"
            onClick={() =>
              setShowProfile(!showProfile)
            }
            title="User Profile"
          >

            <span className="avatar-circle">
              {avatarInitial}
            </span>

            <span className="profile-role">
              {userRole === "admin"
                ? "Admin"
                : "Customer"}
            </span>

          </button>


          {showProfile && (

            <div className="profile-dropdown">

              <div className="profile-info">

                <span className="avatar-circle-large">
                  {avatarInitial}
                </span>

                <div className="profile-details">

                  <span className="profile-name">
                    {userName || "User"}
                  </span>

                  <span className="profile-email">

                    {userRole === "admin"
                      ? "admin@los.com"
                      : localStorage.getItem(
                          "customerEmail"
                        ) || "customer@los.com"}

                  </span>

                </div>

              </div>


              <div className="profile-menu">

                <button
                  className="profile-menu-item"
                  onClick={() => {
                    setShowProfile(false);
                    onProfile();
                  }}
                >
                  Profile
                </button>


                <button
                  className="profile-menu-item"
                  onClick={() => {
                    setShowProfile(false);
                    onSettings();
                  }}
                >
                  Settings
                </button>


                <button
                  className="profile-menu-item logout"
                  onClick={() => {
                    setShowProfile(false);
                    onLogout();
                  }}
                >
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