import { useEffect, useState } from 'react';

import {
  FaFileAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClock,
  FaCar,
  FaHome,
  FaGraduationCap,
  FaUser,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaInfoCircle
} from "react-icons/fa";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('customerApplications');

    if (stored) {
      try {
        setApplications(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading applications:", error);
        setApplications([]);
      }
    }

    setLoading(false);
  }, []);

  // Active applications
  const activeApplications = applications.filter(
    app =>
      app.status === 'Pending' ||
      app.status === 'Under Review'
  );

  // Completed applications
  const previousApplications = applications.filter(
    app =>
      app.status === 'Approved' ||
      app.status === 'Rejected' ||
      app.status === 'Declined'
  );

  // Loan icon
  const getLoanIcon = (loanType) => {
    const type = String(loanType || '').toLowerCase();

    if (type.includes('car')) {
      return <FaCar />;
    }

    if (type.includes('home')) {
      return <FaHome />;
    }

    if (type.includes('student')) {
      return <FaGraduationCap />;
    }

    return <FaUser />;
  };

  // Loan name
  const formatLoanType = (loanType) => {
    if (!loanType) {
      return 'Loan Application';
    }

    return String(loanType)
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  };

  // Amount formatting
  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  // Date formatting
  const formatDate = (date) => {
    if (!date) {
      return 'Not available';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Continue application
  const handleContinueApplication = (application) => {
    localStorage.setItem(
      'selectedApplication',
      JSON.stringify(application)
    );

    window.location.hash = '#/apply-for-loan';
  };

  // View application details
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  // Close details
  const closeDetails = () => {
    setSelectedApplication(null);
  };

  // Status icon
  const getStatusIcon = (status) => {
    if (status === 'Approved') {
      return <FaCheckCircle />;
    }

    if (
      status === 'Rejected' ||
      status === 'Declined'
    ) {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  };

  return (
    <div className="page-container my-applications-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
        <div>
          <h2 className="page-title">
            My Applications
          </h2>

          <p className="page-subtitle">
            Track and manage your loan applications.
          </p>
        </div>
      </div>


      {loading ? (

        <div className="loading-container">
          <p>Loading applications...</p>
        </div>

      ) : (

        <>

          {/* ================= ACTIVE APPLICATIONS ================= */}

          <section className="my-applications-section">

            <div className="my-applications-section-header">

              <div>
                <h3>
                  Active Applications
                </h3>

                <p>
                  Track your ongoing loan applications
                </p>
              </div>

              <div className="application-count">
                {activeApplications.length}
              </div>

            </div>


            {activeApplications.length > 0 ? (

              <div className="my-application-grid">

                {activeApplications.map((application, index) => (

                  <div
                    className="my-application-card"
                    key={
                      application.id ||
                      application.applicationId ||
                      index
                    }
                  >

                    {/* Card Header */}

                    <div className="my-application-card-header">

                      <div className="my-application-loan-info">

                        <div className="my-application-icon">
                          {getLoanIcon(application.loanType)}
                        </div>

                        <div>

                          <h4>
                            {formatLoanType(
                              application.loanType
                            )}
                          </h4>

                          <p>
                            Application ID:{' '}
                            <strong>
                              {application.id ||
                                application.applicationId ||
                                'N/A'}
                            </strong>
                          </p>

                        </div>

                      </div>


                      <span
                        className={`my-application-status ${
                          String(application.status || 'Pending')
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                        }`}
                      >
                        {application.status || 'Pending'}
                      </span>

                    </div>


                    {/* Details */}

                    <div className="my-application-details">

                      <div className="my-application-detail">

                        <FaMoneyBillWave />

                        <div>
                          <span>
                            Loan Amount
                          </span>

                          <strong>
                            {formatAmount(
                              application.loanAmount
                            )}
                          </strong>
                        </div>

                      </div>


                      <div className="my-application-detail">

                        <FaCalendarAlt />

                        <div>
                          <span>
                            Applied On
                          </span>

                          <strong>
                            {formatDate(
                              application.appliedDate ||
                              application.date ||
                              application.createdAt
                            )}
                          </strong>
                        </div>

                      </div>


                      <div className="my-application-detail">

                        <FaFileAlt />

                        <div>
                          <span>
                            Status
                          </span>

                          <strong>
                            {application.status || 'Pending'}
                          </strong>
                        </div>

                      </div>


                      <div className="my-application-detail">

                        <FaClock />

                        <div>
                          <span>
                            Tenure
                          </span>

                          <strong>
                            {application.tenure ||
                              'Not specified'}
                          </strong>
                        </div>

                      </div>

                    </div>


                    {/* Buttons */}

                    <div className="my-application-actions">

                      <button
                        className="my-application-view-btn"
                        onClick={() =>
                          handleViewDetails(application)
                        }
                      >
                        View Details
                      </button>


                      <button
                        className="my-application-continue-btn"
                        onClick={() =>
                          handleContinueApplication(
                            application
                          )
                        }
                      >
                        Continue Application

                        <FaArrowRight />

                      </button>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="my-applications-empty">

                <FaFileAlt />

                <h4>
                  No active applications
                </h4>

                <p>
                  You don't have any active loan
                  applications at the moment.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    window.location.hash =
                      '#/apply-for-loan'
                  }
                >
                  Apply for Loan
                </button>

              </div>

            )}

          </section>


          {/* ================= PREVIOUS APPLICATIONS ================= */}

          <section className="my-applications-history">

            <div className="my-applications-section-header">

              <div>

                <h3>
                  Application History
                </h3>

                <p>
                  Your completed loan applications
                </p>

              </div>

            </div>


            {previousApplications.length > 0 ? (

              <div className="application-history-list">

                {previousApplications.map(
                  (application, index) => (

                    <div
                      className="application-history-card"
                      key={
                        application.id ||
                        application.applicationId ||
                        index
                      }
                    >

                      <div className="history-icon">
                        {application.status === 'Approved'
                          ? <FaCheckCircle />
                          : <FaFileAlt />}
                      </div>


                      <div className="history-main">

                        <h4>
                          {formatLoanType(
                            application.loanType
                          )}
                        </h4>

                        <p>
                          Application ID:{' '}
                          {application.id ||
                            application.applicationId ||
                            'N/A'}
                        </p>

                      </div>


                      <div className="history-amount">

                        <span>
                          Loan Amount
                        </span>

                        <strong>
                          {formatAmount(
                            application.loanAmount
                          )}
                        </strong>

                      </div>


                      <span
                        className={`history-status ${
                          String(application.status || '')
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                        }`}
                      >
                        {application.status}

                      </span>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="history-empty">

                <p>
                  No previous applications yet.
                </p>

              </div>

            )}

          </section>

        </>

      )}


      {/* ================================================= */}
      {/* APPLICATION DETAILS MODAL                         */}
      {/* ================================================= */}

      {selectedApplication && (

        <div
          className="application-details-overlay"
          onClick={closeDetails}
        >

          <div
            className="application-details-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="application-details-header">

              <div>

                <p className="application-details-label">
                  Loan Application
                </p>

                <h2>
                  {formatLoanType(
                    selectedApplication.loanType
                  )}
                </h2>

                <p className="application-details-id">
                  Application ID:{' '}
                  <strong>
                    {selectedApplication.id ||
                      selectedApplication.applicationId ||
                      'N/A'}
                  </strong>
                </p>

              </div>


              <button
                className="application-details-close"
                onClick={closeDetails}
              >
                ×
              </button>

            </div>


            {/* Status */}

            <div className="application-details-status-section">

              <div className="application-status-icon">
                {getStatusIcon(
                  selectedApplication.status
                )}
              </div>

              <div>

                <span>
                  Application Status
                </span>

                <strong>
                  {selectedApplication.status ||
                    'Pending'}
                </strong>

              </div>

            </div>


            {/* Loan Information */}

            <div className="application-details-section">

              <div className="application-details-section-title">

                <FaMoneyBillWave />

                <h3>
                  Loan Information
                </h3>

              </div>


              <div className="application-details-grid">

                <div className="application-info-item">

                  <span>
                    Loan Type
                  </span>

                  <strong>
                    {formatLoanType(
                      selectedApplication.loanType
                    )}
                  </strong>

                </div>


                <div className="application-info-item">

                  <span>
                    Requested Amount
                  </span>

                  <strong>
                    {formatAmount(
                      selectedApplication.loanAmount
                    )}
                  </strong>

                </div>


                <div className="application-info-item">

                  <span>
                    Applied On
                  </span>

                  <strong>
                    {selectedApplication.appliedDate ||
                      'Not available'}
                  </strong>

                </div>


                <div className="application-info-item">

                  <span>
                    Applied Time
                  </span>

                  <strong>
                    {selectedApplication.appliedTime ||
                      'Not available'}
                  </strong>

                </div>


                <div className="application-info-item">

                  <span>
                    Tenure
                  </span>

                  <strong>
                    {selectedApplication.tenure ||
                      'Not specified'}
                  </strong>

                </div>

              </div>

            </div>


            {/* Purpose */}

            <div className="application-details-section">

              <div className="application-details-section-title">

                <FaInfoCircle />

                <h3>
                  Loan Purpose
                </h3>

              </div>


              <div className="application-purpose-box">

                {selectedApplication.purpose ||
                  'No purpose provided.'}

              </div>

            </div>


            {/* Applicant Information */}

            <div className="application-details-section">

              <div className="application-details-section-title">

                <FaUser />

                <h3>
                  Applicant Information
                </h3>

              </div>


              <div className="application-details-grid">

                <div className="application-info-item">

                  <span>
                    Applicant Name
                  </span>

                  <strong>
                    {selectedApplication.customerName ||
                      localStorage.getItem('userName') ||
                      'Customer'}
                  </strong>

                </div>


                <div className="application-info-item">

                  <span>
                    Email
                  </span>

                  <strong className="application-email">

                    <FaEnvelope />

                    {selectedApplication.customerId ||
                      localStorage.getItem('customerEmail') ||
                      'Not available'}

                  </strong>

                </div>

              </div>

            </div>


            {/* Documents */}

            <div className="application-details-section">

              <div className="application-details-section-title">

                <FaFileAlt />

                <h3>
                  Documents
                </h3>

              </div>


              {selectedApplication.documents &&
              selectedApplication.documents.length > 0 ? (

                <div className="application-documents-list">

                  {selectedApplication.documents.map(
                    (document, index) => (

                      <div
                        className="application-document-item"
                        key={
                          document.id ||
                          document.name ||
                          index
                        }
                      >

                        <div className="application-document-icon">
                          <FaFileAlt />
                        </div>

                        <div className="application-document-info">

                          <strong>
                            {document.name}
                          </strong>

                          <span>
                            {document.type ||
                              'Document'}
                          </span>

                        </div>


                        <span className="application-document-status">

                          <FaCheckCircle />

                          {document.status === 'verified'
                            ? 'Verified'
                            : document.status ||
                              'Uploaded'}

                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="no-documents-message">

                  <FaFileAlt />

                  <p>
                    No documents are attached to this
                    application yet.
                  </p>

                </div>

              )}

            </div>


            {/* Application Timeline */}

            <div className="application-details-section">

              <div className="application-details-section-title">

                <FaClock />

                <h3>
                  Application Timeline
                </h3>

              </div>


              <div className="application-timeline">

                <div className="timeline-item completed">

                  <div className="timeline-dot">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <strong>
                      Application Submitted
                    </strong>

                    <span>
                      {selectedApplication.appliedDate ||
                        'Date not available'}
                    </span>
                  </div>

                </div>


                <div
                  className={`timeline-item ${
                    selectedApplication.status === 'Pending' ||
                    selectedApplication.status === 'Under Review' ||
                    selectedApplication.status === 'Approved' ||
                    selectedApplication.status === 'Rejected' ||
                    selectedApplication.status === 'Declined'
                      ? 'completed'
                      : ''
                  }`}
                >

                  <div className="timeline-dot">
                    <FaCheckCircle />
                  </div>

                  <div>

                    <strong>
                      Application Under Review
                    </strong>

                    <span>
                      Application is being processed
                    </span>

                  </div>

                </div>


                <div
                  className={`timeline-item ${
                    selectedApplication.status === 'Approved' ||
                    selectedApplication.status === 'Rejected' ||
                    selectedApplication.status === 'Declined'
                      ? 'completed'
                      : ''
                  }`}
                >

                  <div className="timeline-dot">

                    {selectedApplication.status === 'Approved'
                      ? <FaCheckCircle />
                      : selectedApplication.status === 'Rejected' ||
                        selectedApplication.status === 'Declined'
                        ? <FaTimesCircle />
                        : <FaClock />}

                  </div>

                  <div>

                    <strong>
                      {selectedApplication.status === 'Approved'
                        ? 'Application Approved'
                        : selectedApplication.status === 'Rejected' ||
                          selectedApplication.status === 'Declined'
                          ? 'Application Declined'
                          : 'Decision Pending'}
                    </strong>

                    <span>
                      {selectedApplication.status === 'Approved'
                        ? 'Your loan application has been approved.'
                        : selectedApplication.status === 'Rejected' ||
                          selectedApplication.status === 'Declined'
                          ? 'Your loan application was not approved.'
                          : 'Awaiting final decision.'}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* Modal Footer */}

            <div className="application-details-footer">

              <button
                className="application-details-secondary-btn"
                onClick={closeDetails}
              >
                Close
              </button>

              {(selectedApplication.status === 'Pending' ||
                selectedApplication.status === 'Under Review') && (

                <button
                  className="application-details-primary-btn"
                  onClick={() =>
                    handleContinueApplication(
                      selectedApplication
                    )
                  }
                >
                  Continue Application

                  <FaArrowRight />

                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default MyApplications;