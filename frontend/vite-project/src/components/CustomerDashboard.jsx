import { useEffect, useState } from 'react';
import { FaCheckCircle, FaClock, FaFileAlt, FaMoneyBillWave } from "react-icons/fa";

function CustomerDashboard({ userName, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load mock applications for this customer
  useEffect(() => {
    const storedApps = localStorage.getItem('customerApplications');
    if (storedApps) {
      setApplications(JSON.parse(storedApps));
    }
    setLoading(false);
  }, []);

  // Calculate summary statistics
  const activeApplications = applications.filter(app => app.status === 'Pending').length;
  const approvedLoans = applications.filter(app => app.status === 'Approved').length;
  const pendingApplications = applications.filter(app => app.status === 'Pending').length;
  const totalAmountBorrowed = applications
    .filter(app => app.status === 'Approved')
    .reduce((sum, app) => sum + (app.loanAmount || 0), 0);

  // Generate recent activity (mock data)
  const recentActivity = [
    { id: 1, text: 'Application #1001 submitted', time: '2 hours ago', type: 'submitted' },
    { id: 2, text: 'Application #1001 approved', time: '1 day ago', type: 'approved' },
    { id: 3, text: 'Profile updated', time: '3 days ago', type: 'profile' },
  ];

  const getStatusColor = (type) => {
    switch (type) {
      case 'submitted': return '#3B82F6';
      case 'approved': return '#10b981';
      case 'profile': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Welcome back, {userName}!</h2>
          <p className="page-subtitle">
            Today is {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="customer-summary-grid">
        {/* Active Applications Card */}
        <div className="customer-summary-card">
          <div className="card-header">
            <div className="card-icon-badge">
              <FaFileAlt />
            </div>
          </div>
          <div className="card-body">
            <div className="card-value">{activeApplications}</div>
            <div className="card-label">Active Applications</div>
          </div>
        </div>

        {/* Approved Loans Card */}
        <div className="customer-summary-card">
          <div className="card-header">
            <div className="card-icon-badge" style={{ backgroundColor: '#10b981' }}>
              <FaCheckCircle />
            </div>
          </div>
          <div className="card-body">
            <div className="card-value">{approvedLoans}</div>
            <div className="card-label">Approved Loans</div>
          </div>
        </div>

        {/* Pending Applications Card */}
        <div className="customer-summary-card">
          <div className="card-header">
            <div className="card-icon-badge" style={{ backgroundColor: '#3B82F6' }}>
              <FaClock />
            </div>
          </div>
          <div className="card-body">
            <div className="card-value">{pendingApplications}</div>
            <div className="card-label">Pending Applications</div>
          </div>
        </div>

        {/* Total Borrowed Card */}
        <div className="customer-summary-card">
          <div className="card-header">
            <div className="card-icon-badge" style={{ backgroundColor: '#F59E0B' }}>
              <FaMoneyBillWave />
            </div>
          </div>
          <div className="card-body">
            <div className="card-value">₹{totalAmountBorrowed.toLocaleString()}</div>
            <div className="card-label">Total Borrowed</div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="activity-section-card">
        <h3 className="activity-title">Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-info">
                <span className="activity-text">{activity.text}</span>
              </div>
              <div className="activity-meta">
                <span 
                  className="activity-dot" 
                  style={{ backgroundColor: getStatusColor(activity.type) }}
                ></span>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
