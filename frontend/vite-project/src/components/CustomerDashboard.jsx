import { useEffect, useState } from 'react';

import {
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaMoneyBillWave,
  FaArrowRight,
  FaChevronRight,
  FaInfoCircle,
  FaChartLine,
  FaShieldAlt,
  FaHeadset
} from 'react-icons/fa';

function CustomerDashboard({ userName, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedApps = localStorage.getItem('customerApplications');

    if (storedApps) {
      try {
        setApplications(JSON.parse(storedApps));
      } catch (error) {
        console.error('Error loading applications:', error);
        setApplications([]);
      }
    }

    setLoading(false);
  }, []);

  // -----------------------------
  // Summary Statistics
  // -----------------------------

  const activeApplications = applications.filter(
    (app) =>
      app.status === 'Pending' ||
      app.status === 'Under Review'
  ).length;

  const approvedLoans = applications.filter(
    (app) => app.status === 'Approved'
  ).length;

  const pendingApplications = applications.filter(
    (app) => app.status === 'Pending'
  ).length;

  const underReviewApplications = applications.filter(
    (app) => app.status === 'Under Review'
  ).length;

  const totalAmountBorrowed = applications
    .filter((app) => app.status === 'Approved')
    .reduce(
      (sum, app) => sum + Number(app.loanAmount || 0),
      0
    );

  // Latest applications
  const recentApplications = [...applications]
    .sort((a, b) => {
      const dateA = new Date(
        a.submittedAt || a.applicationDate || 0
      );

      const dateB = new Date(
        b.submittedAt || b.applicationDate || 0
      );

      return dateB - dateA;
    })
    .slice(0, 4);

  // -----------------------------
  // Status Helpers
  // -----------------------------

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-approved';

      case 'Declined':
        return 'status-declined';

      case 'Under Review':
        return 'status-review';

      case 'Pending':
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <FaCheckCircle />;

      case 'Under Review':
        return <FaChartLine />;

      case 'Declined':
        return <FaInfoCircle />;

      case 'Pending':
      default:
        return <FaClock />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Recently';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Recently';
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // -----------------------------
  // Dashboard
  // -----------------------------

  return (
    <div className="customer-dashboard-page">

      <style>{`

        /* =========================================
           PAGE
        ========================================= */

        .customer-dashboard-page {
          min-height: 100%;
          padding: 28px 32px 40px;
          background: #f7f9fc;
          color: #172033;
          animation: dashboardEnter 0.5s ease;
        }

        @keyframes dashboardEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* =========================================
           HEADER
        ========================================= */

        .customer-dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .dashboard-welcome {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .welcome-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #eaf2ff;
          color: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
        }

        .welcome-label {
          margin: 0 0 5px;
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
        }

        .customer-dashboard-title {
          margin: 0;
          font-size: 25px;
          font-weight: 700;
          letter-spacing: -0.4px;
          color: #172033;
        }

        .customer-dashboard-date {
          margin: 7px 0 0;
          color: #7b8798;
          font-size: 13px;
          font-weight: 400;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid #e1e7ef;
          border-radius: 9px;
          background: white;
          color: #526176;
          font-size: 12px;
          font-weight: 500;
        }

        .secure-badge svg {
          color: #1d4ed8;
        }


        /* =========================================
           SUMMARY CARDS
        ========================================= */

        .customer-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 17px;
          margin-bottom: 22px;
        }

        .customer-summary-card {
          background: white;
          border: 1px solid #e5eaf1;
          border-radius: 13px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
          animation: cardEnter 0.55s ease both;
        }

        .customer-summary-card:nth-child(1) {
          animation-delay: 0.05s;
        }

        .customer-summary-card:nth-child(2) {
          animation-delay: 0.1s;
        }

        .customer-summary-card:nth-child(3) {
          animation-delay: 0.15s;
        }

        .customer-summary-card:nth-child(4) {
          animation-delay: 0.2s;
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .customer-summary-card:hover {
          transform: translateY(-4px);
          border-color: #cbd8eb;
          box-shadow: 0 12px 30px rgba(30, 64, 175, 0.08);
        }

        .customer-summary-card::after {
          content: '';
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #f4f7fc;
          right: -30px;
          bottom: -35px;
        }

        .summary-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }

        .card-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eaf2ff;
          color: #1d4ed8;
          font-size: 16px;
          transition: transform 0.25s ease;
        }

        .customer-summary-card:hover .card-icon-badge {
          transform: scale(1.08);
        }

        .summary-card-arrow {
          color: #c0c9d6;
          font-size: 12px;
        }

        .summary-card-content {
          margin-top: 18px;
          position: relative;
          z-index: 1;
        }

        .card-value {
          color: #172033;
          font-size: 26px;
          line-height: 1;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .card-label {
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
        }


        /* =========================================
           MAIN GRID
        ========================================= */

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.9fr);
          gap: 22px;
          margin-bottom: 22px;
        }

        .dashboard-panel {
          background: white;
          border: 1px solid #e5eaf1;
          border-radius: 13px;
          overflow: hidden;
        }

        .panel-header {
          padding: 19px 21px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #edf0f4;
        }

        .panel-heading {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .panel-heading-icon {
          color: #1d4ed8;
          font-size: 15px;
        }

        .panel-title {
          margin: 0;
          font-size: 15px;
          font-weight: 650;
          color: #1f2937;
        }

        .panel-subtitle {
          margin: 4px 0 0;
          color: #8a96a8;
          font-size: 11px;
          font-weight: 400;
        }

        .view-all {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }


        /* =========================================
           RECENT APPLICATIONS
        ========================================= */

        .applications-list {
          padding: 4px 21px 8px;
        }

        .application-row {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 15px 0;
          border-bottom: 1px solid #f0f2f5;
          transition: transform 0.2s ease;
        }

        .application-row:last-child {
          border-bottom: none;
        }

        .application-row:hover {
          transform: translateX(4px);
        }

        .application-icon {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          border-radius: 10px;
          background: #f0f5ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .application-details {
          min-width: 0;
          flex: 1;
        }

        .application-name {
          color: #1f2937;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .application-meta {
          color: #8994a5;
          font-size: 11px;
          font-weight: 400;
        }

        .application-amount {
          text-align: right;
          min-width: 100px;
        }

        .application-loan-amount {
          color: #1f2937;
          font-size: 13px;
          font-weight: 600;
        }

        .application-type {
          margin-top: 4px;
          color: #8b96a7;
          font-size: 10px;
        }

        .application-status {
          min-width: 92px;
          text-align: right;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
        }

        .status-approved {
          background: #eef4ff;
          color: #1d4ed8;
        }

        .status-pending {
          background: #f3f6fa;
          color: #64748b;
        }

        .status-review {
          background: #eaf2ff;
          color: #2563eb;
        }

        .status-declined {
          background: #f4f5f7;
          color: #64748b;
        }


        /* =========================================
           EMPTY STATE
        ========================================= */

        .empty-applications {
          padding: 38px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 12px;
          border-radius: 12px;
          background: #f2f5f9;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-applications h4 {
          margin: 0 0 5px;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
        }

        .empty-applications p {
          margin: 0;
          color: #8a96a8;
          font-size: 11px;
        }


        /* =========================================
           STATUS OVERVIEW
        ========================================= */

        .status-overview {
          padding: 21px;
        }

        .status-total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .status-total-label {
          color: #7a8799;
          font-size: 12px;
        }

        .status-total-value {
          color: #172033;
          font-size: 23px;
          font-weight: 700;
        }

        .status-item {
          margin-bottom: 17px;
        }

        .status-item:last-child {
          margin-bottom: 0;
        }

        .status-item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
        }

        .status-item-label {
          color: #59677a;
          font-size: 11px;
          font-weight: 500;
        }

        .status-item-count {
          color: #263449;
          font-size: 11px;
          font-weight: 600;
        }

        .status-progress {
          height: 5px;
          border-radius: 10px;
          background: #edf1f5;
          overflow: hidden;
        }

        .status-progress-fill {
          height: 100%;
          border-radius: 10px;
          background: #2563eb;
          transition: width 0.8s ease;
        }

        .status-progress-fill.approved {
          background: #1d4ed8;
        }

        .status-progress-fill.review {
          background: #4f7fe8;
        }


        /* =========================================
           BOTTOM GRID
        ========================================= */

        .dashboard-bottom-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.9fr);
          gap: 22px;
        }


        /* =========================================
           LOAN JOURNEY
        ========================================= */

        .journey-content {
          padding: 21px;
        }

        .journey-step {
          display: flex;
          gap: 13px;
          position: relative;
          padding-bottom: 19px;
        }

        .journey-step:last-child {
          padding-bottom: 0;
        }

        .journey-step:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 15px;
          top: 32px;
          width: 1px;
          height: calc(100% - 19px);
          background: #dfe6ef;
        }

        .journey-circle {
          width: 31px;
          height: 31px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f4f9;
          color: #94a3b8;
          font-size: 11px;
          position: relative;
          z-index: 1;
        }

        .journey-step.completed .journey-circle {
          background: #eaf2ff;
          color: #1d4ed8;
        }

        .journey-step.current .journey-circle {
          background: #2563eb;
          color: white;
          box-shadow: 0 0 0 5px #eaf2ff;
        }

        .journey-text h4 {
          margin: 2px 0 4px;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
        }

        .journey-text p {
          margin: 0;
          color: #8a96a8;
          font-size: 10px;
          line-height: 1.5;
        }


        /* =========================================
           SUPPORT CARD
        ========================================= */

        .support-panel {
          background: #172b4d;
          border: none;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .support-panel::before {
          content: '';
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(255,255,255,0.035);
          right: -50px;
          top: -60px;
        }

        .support-content {
          padding: 23px;
          position: relative;
          z-index: 1;
        }

        .support-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          font-size: 15px;
        }

        .support-content h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 650;
        }

        .support-content p {
          margin: 0 0 20px;
          color: #bdc9da;
          font-size: 11px;
          line-height: 1.6;
        }

        .support-info {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #e5ebf4;
          font-size: 11px;
          margin-bottom: 9px;
        }

        .support-info svg {
          color: #8fb2ff;
        }

        .support-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 9px;
          color: white;
          font-size: 11px;
          font-weight: 600;
        }


        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 1100px) {
          .customer-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-main-grid,
          .dashboard-bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .customer-dashboard-page {
            padding: 20px 16px 30px;
          }

          .customer-dashboard-header {
            align-items: flex-start;
          }

          .secure-badge {
            display: none;
          }

          .customer-summary-grid {
            grid-template-columns: 1fr;
          }

          .application-amount {
            display: none;
          }

          .application-status {
            min-width: auto;
          }
        }

      `}</style>


      {/* =========================================
          HEADER
      ========================================= */}

      <div className="customer-dashboard-header">

        <div className="dashboard-welcome">

          <div className="welcome-icon">
            <FaChartLine />
          </div>

          <div>
            <p className="welcome-label">
              Customer Dashboard
            </p>

            <h1 className="customer-dashboard-title">
              Welcome back, {userName}!
            </h1>

            <p className="customer-dashboard-date">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

        </div>

        <div className="secure-badge">
          <FaShieldAlt />
          Secure Customer Portal
        </div>

      </div>


      {/* =========================================
          SUMMARY CARDS
      ========================================= */}

      <div className="customer-summary-grid">

        <div className="customer-summary-card">
          <div className="summary-card-top">
            <div className="card-icon-badge">
              <FaFileAlt />
            </div>

            <FaChevronRight className="summary-card-arrow" />
          </div>

          <div className="summary-card-content">
            <div className="card-value">
              {activeApplications}
            </div>

            <div className="card-label">
              Active Applications
            </div>
          </div>
        </div>


        <div className="customer-summary-card">
          <div className="summary-card-top">
            <div className="card-icon-badge">
              <FaCheckCircle />
            </div>

            <FaChevronRight className="summary-card-arrow" />
          </div>

          <div className="summary-card-content">
            <div className="card-value">
              {approvedLoans}
            </div>

            <div className="card-label">
              Approved Loans
            </div>
          </div>
        </div>


        <div className="customer-summary-card">
          <div className="summary-card-top">
            <div className="card-icon-badge">
              <FaClock />
            </div>

            <FaChevronRight className="summary-card-arrow" />
          </div>

          <div className="summary-card-content">
            <div className="card-value">
              {pendingApplications}
            </div>

            <div className="card-label">
              Pending Applications
            </div>
          </div>
        </div>


        <div className="customer-summary-card">
          <div className="summary-card-top">
            <div className="card-icon-badge">
              <FaMoneyBillWave />
            </div>

            <FaChevronRight className="summary-card-arrow" />
          </div>

          <div className="summary-card-content">
            <div className="card-value">
              ₹{totalAmountBorrowed.toLocaleString('en-IN')}
            </div>

            <div className="card-label">
              Total Borrowed
            </div>
          </div>
        </div>

      </div>


      {/* =========================================
          MAIN DASHBOARD GRID
      ========================================= */}

      <div className="dashboard-main-grid">


        {/* Recent Applications */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div className="panel-heading">
              <FaFileAlt className="panel-heading-icon" />

              <div>
                <h3 className="panel-title">
                  Recent Applications
                </h3>

                <p className="panel-subtitle">
                  Your latest loan applications
                </p>
              </div>
            </div>

            <div className="view-all">
              View All
              <FaArrowRight />
            </div>

          </div>


          {recentApplications.length === 0 ? (

            <div className="empty-applications">

              <div className="empty-icon">
                <FaFileAlt />
              </div>

              <h4>
                No loan applications yet
              </h4>

              <p>
                Your submitted applications will appear here.
              </p>

            </div>

          ) : (

            <div className="applications-list">

              {recentApplications.map((app, index) => (

                <div
                  className="application-row"
                  key={
                    app.applicationId ||
                    app.id ||
                    index
                  }
                >

                  <div className="application-icon">
                    <FaFileAlt />
                  </div>


                  <div className="application-details">

                    <div className="application-name">
                      {app.loanType || 'Loan Application'}
                    </div>

                    <div className="application-meta">
                      Application ID:{' '}
                      {app.applicationId ||
                        app.id ||
                        'N/A'}
                      {' • '}
                      {formatDate(
                        app.submittedAt ||
                        app.applicationDate
                      )}
                    </div>

                  </div>


                  <div className="application-amount">

                    <div className="application-loan-amount">
                      ₹
                      {Number(
                        app.loanAmount || 0
                      ).toLocaleString('en-IN')}
                    </div>

                    <div className="application-type">
                      Loan Amount
                    </div>

                  </div>


                  <div className="application-status">

                    <span
                      className={`status-badge ${getStatusClass(
                        app.status
                      )}`}
                    >
                      {getStatusIcon(app.status)}

                      {app.status || 'Pending'}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* Status Overview */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div className="panel-heading">

              <FaChartLine className="panel-heading-icon" />

              <div>

                <h3 className="panel-title">
                  Status Overview
                </h3>

                <p className="panel-subtitle">
                  Application progress
                </p>

              </div>

            </div>

          </div>


          <div className="status-overview">

            <div className="status-total">

              <span className="status-total-label">
                Total Applications
              </span>

              <span className="status-total-value">
                {applications.length}
              </span>

            </div>


            <div className="status-item">

              <div className="status-item-header">

                <span className="status-item-label">
                  Pending
                </span>

                <span className="status-item-count">
                  {pendingApplications}
                </span>

              </div>

              <div className="status-progress">
                <div
                  className="status-progress-fill"
                  style={{
                    width: applications.length
                      ? `${(pendingApplications / applications.length) * 100}%`
                      : '0%'
                  }}
                />
              </div>

            </div>


            <div className="status-item">

              <div className="status-item-header">

                <span className="status-item-label">
                  Under Review
                </span>

                <span className="status-item-count">
                  {underReviewApplications}
                </span>

              </div>

              <div className="status-progress">

                <div
                  className="status-progress-fill review"
                  style={{
                    width: applications.length
                      ? `${(underReviewApplications / applications.length) * 100}%`
                      : '0%'
                  }}
                />

              </div>

            </div>


            <div className="status-item">

              <div className="status-item-header">

                <span className="status-item-label">
                  Approved
                </span>

                <span className="status-item-count">
                  {approvedLoans}
                </span>

              </div>

              <div className="status-progress">

                <div
                  className="status-progress-fill approved"
                  style={{
                    width: applications.length
                      ? `${(approvedLoans / applications.length) * 100}%`
                      : '0%'
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          BOTTOM SECTION
      ========================================= */}

      <div className="dashboard-bottom-grid">


        {/* Loan Journey */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div className="panel-heading">

              <FaArrowRight className="panel-heading-icon" />

              <div>

                <h3 className="panel-title">
                  Your Loan Journey
                </h3>

                <p className="panel-subtitle">
                  Understand the application process
                </p>

              </div>

            </div>

          </div>


          <div className="journey-content">

            <div className="journey-step completed">

              <div className="journey-circle">
                <FaCheckCircle />
              </div>

              <div className="journey-text">

                <h4>
                  Application Submitted
                </h4>

                <p>
                  Your loan application has been successfully submitted.
                </p>

              </div>

            </div>


            <div
              className={`journey-step ${
                activeApplications > 0
                  ? 'current'
                  : applications.length > 0
                    ? 'completed'
                    : ''
              }`}
            >

              <div className="journey-circle">
                {activeApplications > 0 ? (
                  <FaClock />
                ) : (
                  <FaCheckCircle />
                )}
              </div>

              <div className="journey-text">

                <h4>
                  Application Review
                </h4>

                <p>
                  Our team reviews your application and submitted information.
                </p>

              </div>

            </div>


            <div
              className={`journey-step ${
                approvedLoans > 0
                  ? 'completed'
                  : ''
              }`}
            >

              <div className="journey-circle">

                {approvedLoans > 0 ? (
                  <FaCheckCircle />
                ) : (
                  <FaClock />
                )}

              </div>

              <div className="journey-text">

                <h4>
                  Loan Decision
                </h4>

                <p>
                  Once reviewed, you will receive the final loan decision.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Support */}

        <div className="dashboard-panel support-panel">

          <div className="support-content">

            <div className="support-icon">
              <FaHeadset />
            </div>

            <h3>
              Need assistance?
            </h3>

            <p>
              Have questions about your application or loan?
              Our support team is here to help.
            </p>

            <div className="support-info">
              <FaShieldAlt />
              Secure customer support
            </div>

            <div className="support-info">
              <FaClock />
              Available during business hours
            </div>

            <div className="support-link">
              Contact Support
              <FaArrowRight />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CustomerDashboard;