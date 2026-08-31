import { useEffect, useState } from 'react';
import { FaFileAlt } from "react-icons/fa";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load applications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('customerApplications');
    if (stored) {
      setApplications(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#0A2654';
      case 'Pending': return '#3B82F6';
      case 'Rejected': return '#a1b9d3ff';
      default: return '#6b7280';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">My Applications</h2>
        <p className="page-subtitle">Track the status of your loan applications.</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Loading applications...</p>
        </div>
      ) : (
        <div className="applications-container">
          {applications.length > 0 ? (
            <table className="loan-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td>{app.loanType}</td>
                    <td>₹{Number(app.loanAmount).toLocaleString()}</td>
                    <td>
                      <span className="status-badge status-custom" style={{ backgroundColor: getStatusColor(app.status) }}>
                        {app.status}
                      </span>
                    </td>
                    <td>{app.appliedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-applications">
              <div className="empty-icon">
                <FaFileAlt />
              </div>
              <h3>No Applications Found</h3>
              <p>You haven't submitted any loan applications yet.</p>
              <button className="btn btn-primary" onClick={() => window.location.hash = '#/apply-for-loan'}>
                Apply for Loan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
