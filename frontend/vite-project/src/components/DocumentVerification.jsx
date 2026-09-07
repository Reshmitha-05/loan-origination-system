import { useEffect, useMemo, useState } from "react";

import {
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaTimes,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaCalendarAlt,
  FaIdCard,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";

function DocumentVerification() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadDocuments();
  }, []);

  /* =========================================================
     LOAD DOCUMENTS
  ========================================================= */

  const loadDocuments = () => {
    const storedDocuments =
      localStorage.getItem("customerDocuments");

    const storedApplications =
      localStorage.getItem("customerApplications");

    let customerDocuments = [];
    let applications = [];

    try {
      customerDocuments = storedDocuments
        ? JSON.parse(storedDocuments)
        : [];
    } catch (error) {
      console.error("Error loading customer documents:", error);
    }

    try {
      applications = storedApplications
        ? JSON.parse(storedApplications)
        : [];
    } catch (error) {
      console.error("Error loading applications:", error);
    }

    /*
     * Documents.jsx stores uploaded customer documents in
     * customerDocuments.
     *
     * ApplyForLoan / ApplicationRequests may also store
     * documents inside the application.
     */

    const applicationDocuments = [];

    applications.forEach((application) => {
      const docs =
        application.documents ||
        application.customerDocuments ||
        [];

      docs.forEach((document, index) => {
        applicationDocuments.push({
          ...document,

          documentIndex: index,

          applicationId:
            application.applicationId ||
            application.id ||
            "N/A",

          customerName:
            application.customerName ||
            application.name ||
            document.customerName ||
            "Customer",

          customerEmail:
            application.customerEmail ||
            application.email ||
            document.customerEmail ||
            "",

          loanType:
            application.loanType ||
            application.loanTypeName ||
            "Loan",

          source: "application",
        });
      });
    });

    /*
     * If application documents exist, use those.
     * Otherwise use customerDocuments.
     */

    let finalDocuments = applicationDocuments;

    if (applicationDocuments.length === 0) {
      finalDocuments = customerDocuments.map((document) => ({
        ...document,

        documentIndex: null,

        applicationId:
          document.applicationId || "Not attached",

        customerName:
          document.customerName || "Customer",

        customerEmail:
          document.customerEmail || "",

        loanType:
          document.loanType || "Not attached",

        source: "customer",
      }));
    }

    setDocuments(finalDocuments);
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatus = (document) => {
    const status = String(
      document.status || "pending"
    ).toLowerCase();

    if (
      status === "verified" ||
      status === "approved"
    ) {
      return "Verified";
    }

    if (
      status === "rejected" ||
      status === "declined"
    ) {
      return "Rejected";
    }

    return "Pending Review";
  };

  /* =========================================================
     FILTERING
  ========================================================= */

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const status = getStatus(document);

      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        String(
          document.name ||
            document.fileName ||
            ""
        )
          .toLowerCase()
          .includes(search) ||
        String(
          document.customerName || ""
        )
          .toLowerCase()
          .includes(search) ||
        String(
          document.customerEmail || ""
        )
          .toLowerCase()
          .includes(search) ||
        String(
          document.loanType || ""
        )
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [documents, searchTerm, statusFilter]);

  /* =========================================================
     MODAL
  ========================================================= */

  const handleView = (document) => {
    setSelectedDocument(document);
    setRejectReason("");
    setShowRejectBox(false);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedDocument(null);
    setRejectReason("");
    setShowRejectBox(false);
  };

  /* =========================================================
     UPDATE CUSTOMER DOCUMENT
  ========================================================= */

  const updateCustomerDocument = (
    documentId,
    status,
    reason = ""
  ) => {
    const stored =
      localStorage.getItem("customerDocuments");

    if (!stored) {
      return;
    }

    try {
      const customerDocuments =
        JSON.parse(stored);

      const updatedDocuments =
        customerDocuments.map((document) => {
          if (
            String(document.id) !==
            String(documentId)
          ) {
            return document;
          }

          return {
            ...document,
            status: status,

            rejectionReason:
              status === "rejected"
                ? reason
                : "",

            verifiedAt:
              status === "verified"
                ? new Date().toLocaleString(
                    "en-IN"
                  )
                : document.verifiedAt || "",

            rejectedAt:
              status === "rejected"
                ? new Date().toLocaleString(
                    "en-IN"
                  )
                : document.rejectedAt || "",
          };
        });

      localStorage.setItem(
        "customerDocuments",
        JSON.stringify(updatedDocuments)
      );
    } catch (error) {
      console.error(
        "Error updating customer document:",
        error
      );
    }
  };

  /* =========================================================
     UPDATE APPLICATION DOCUMENT
  ========================================================= */

  const updateApplicationDocument = (
    applicationId,
    documentIndex,
    status,
    reason = ""
  ) => {
    const stored =
      localStorage.getItem("customerApplications");

    if (!stored || documentIndex === null) {
      return;
    }

    try {
      const applications =
        JSON.parse(stored);

      const updatedApplications =
        applications.map((application) => {
          const currentId =
            application.applicationId ||
            application.id;

          if (
            String(currentId) !==
            String(applicationId)
          ) {
            return application;
          }

          const docs =
            application.documents ||
            application.customerDocuments ||
            [];

          const updatedDocs =
            docs.map((document, index) => {
              if (index !== documentIndex) {
                return document;
              }

              return {
                ...document,
                status: status,

                rejectionReason:
                  status === "rejected"
                    ? reason
                    : "",

                verifiedAt:
                  status === "verified"
                    ? new Date().toLocaleString(
                        "en-IN"
                      )
                    : document.verifiedAt || "",

                rejectedAt:
                  status === "rejected"
                    ? new Date().toLocaleString(
                        "en-IN"
                      )
                    : document.rejectedAt || "",
              };
            });

          return {
            ...application,
            documents: updatedDocs,
          };
        });

      localStorage.setItem(
        "customerApplications",
        JSON.stringify(updatedApplications)
      );
    } catch (error) {
      console.error(
        "Error updating application document:",
        error
      );
    }
  };

  /* =========================================================
     VERIFY
  ========================================================= */

  const handleVerify = () => {
    if (!selectedDocument) {
      return;
    }

    if (selectedDocument.source === "customer") {
      updateCustomerDocument(
        selectedDocument.id,
        "verified"
      );
    } else {
      updateApplicationDocument(
        selectedDocument.applicationId,
        selectedDocument.documentIndex,
        "verified"
      );

      updateCustomerDocument(
        selectedDocument.id,
        "verified"
      );
    }

    handleClose();
    loadDocuments();
  };

  /* =========================================================
     REJECT
  ========================================================= */

  const handleReject = () => {
    if (!selectedDocument) {
      return;
    }

    if (!rejectReason.trim()) {
      alert(
        "Please enter a reason for rejecting this document."
      );
      return;
    }

    if (selectedDocument.source === "customer") {
      updateCustomerDocument(
        selectedDocument.id,
        "rejected",
        rejectReason.trim()
      );
    } else {
      updateApplicationDocument(
        selectedDocument.applicationId,
        selectedDocument.documentIndex,
        "rejected",
        rejectReason.trim()
      );

      updateCustomerDocument(
        selectedDocument.id,
        "rejected",
        rejectReason.trim()
      );
    }

    handleClose();
    loadDocuments();
  };

  /* =========================================================
     COUNTS
  ========================================================= */

  const pendingCount = documents.filter(
    (document) =>
      getStatus(document) === "Pending Review"
  ).length;

  const verifiedCount = documents.filter(
    (document) =>
      getStatus(document) === "Verified"
  ).length;

  const rejectedCount = documents.filter(
    (document) =>
      getStatus(document) === "Rejected"
  ).length;

  /* =========================================================
     HELPERS
  ========================================================= */

  const getDocumentName = (document) =>
    document.name ||
    document.fileName ||
    "Document";

  const getInitials = (name) => {
    if (!name) return "CU";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getStatusClass = (status) => {
    if (status === "Verified") {
      return "dv-status verified";
    }

    if (status === "Rejected") {
      return "dv-status rejected";
    }

    return "dv-status pending";
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="dv-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="dv-header">

        <div className="dv-header-left">

          <div className="dv-header-icon">
            <FaShieldAlt />
          </div>

          <div>
            <div className="dv-breadcrumb">
              ADMINISTRATION
              <span>/</span>
              DOCUMENTS
            </div>

            <h1>
              Document Verification
            </h1>

            <p>
              Review, verify and manage customer
              documentation
            </p>
          </div>

        </div>

        <div className="dv-header-count">
          <span>Total Documents</span>
          <strong>{documents.length}</strong>
        </div>

      </div>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="dv-stats">

        <div className="dv-stat-card">

          <div className="dv-stat-top">
            <div className="dv-stat-icon pending-icon">
              <FaClock />
            </div>

            <span className="dv-stat-mini">
              NEEDS ACTION
            </span>
          </div>

          <div className="dv-stat-number">
            {pendingCount}
          </div>

          <div className="dv-stat-label">
            Pending Review
          </div>

        </div>

        <div className="dv-stat-card">

          <div className="dv-stat-top">
            <div className="dv-stat-icon verified-icon">
              <FaCheckCircle />
            </div>

            <span className="dv-stat-mini">
              COMPLETED
            </span>
          </div>

          <div className="dv-stat-number">
            {verifiedCount}
          </div>

          <div className="dv-stat-label">
            Verified Documents
          </div>

        </div>

        <div className="dv-stat-card">

          <div className="dv-stat-top">
            <div className="dv-stat-icon rejected-icon">
              <FaTimesCircle />
            </div>

            <span className="dv-stat-mini">
              ATTENTION
            </span>
          </div>

          <div className="dv-stat-number">
            {rejectedCount}
          </div>

          <div className="dv-stat-label">
            Rejected Documents
          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="dv-content-card">

        {/* TOOLBAR */}

        <div className="dv-toolbar">

          <div>
            <h2>
              Customer Documents
            </h2>

            <p>
              Review submitted documents and
              update their verification status.
            </p>
          </div>

          <div className="dv-toolbar-right">

            <div className="dv-search">
              <FaSearch />

              <input
                type="text"
                placeholder="Search documents, customers..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

              {searchTerm && (
                <button
                  className="dv-search-clear"
                  onClick={() =>
                    setSearchTerm("")
                  }
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <select
              className="dv-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending Review">
                Pending Review
              </option>

              <option value="Verified">
                Verified
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>

          </div>

        </div>

        {/* TABLE */}

        {filteredDocuments.length === 0 ? (

          <div className="dv-empty">

            <div className="dv-empty-icon">
              <FaFileAlt />
            </div>

            <h3>
              No documents found
            </h3>

            <p>
              {documents.length === 0
                ? "Customer documents will appear here once they are submitted."
                : "Try changing your search or status filter."}
            </p>

            {(searchTerm ||
              statusFilter !== "All") && (
              <button
                className="dv-clear-filter"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
              >
                Clear Filters
              </button>
            )}

          </div>

        ) : (

          <div className="dv-table-wrapper">

            <table className="dv-table">

              <thead>
                <tr>
                  <th>
                    DOCUMENT
                  </th>

                  <th>
                    CUSTOMER
                  </th>

                  <th>
                    LOAN TYPE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th className="dv-action-heading">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredDocuments.map(
                  (document, index) => {

                    const status =
                      getStatus(document);

                    return (
                      <tr
                        key={`${document.id}-${index}`}
                      >

                        {/* DOCUMENT */}

                        <td>

                          <div className="dv-document-cell">

                            <div className="dv-document-icon">
                              <FaFileAlt />
                            </div>

                            <div className="dv-document-info">

                              <strong>
                                {getDocumentName(
                                  document
                                )}
                              </strong>

                              <span>
                                {document.applicationId &&
                                document.applicationId !==
                                  "Not attached"
                                  ? `Application #${document.applicationId}`
                                  : "Customer document"}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* CUSTOMER */}

                        <td>

                          <div className="dv-customer-cell">

                            <div className="dv-avatar">
                              {getInitials(
                                document.customerName
                              )}
                            </div>

                            <div>

                              <strong className="dv-customer-name">
                                {document.customerName ||
                                  "Customer"}
                              </strong>

                              {document.customerEmail && (
                                <span className="dv-customer-email">
                                  {document.customerEmail}
                                </span>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* LOAN TYPE */}

                        <td>

                          <span className="dv-loan-type">
                            {document.loanType ||
                              "Not attached"}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={getStatusClass(
                              status
                            )}
                          >

                            {status ===
                              "Verified" && (
                              <FaCheckCircle />
                            )}

                            {status ===
                              "Rejected" && (
                              <FaTimesCircle />
                            )}

                            {status ===
                              "Pending Review" && (
                              <FaClock />
                            )}

                            {status}

                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            className="dv-view-button"
                            onClick={() =>
                              handleView(
                                document
                              )
                            }
                          >
                            <FaEye />
                            View
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {showModal &&
        selectedDocument && (

          <div
            className="dv-modal-overlay"
            onMouseDown={(e) => {
              if (
                e.target === e.currentTarget
              ) {
                handleClose();
              }
            }}
          >

            <div className="dv-modal">

              {/* MODAL HEADER */}

              <div className="dv-modal-header">

                <div className="dv-modal-title-area">

                  <div className="dv-modal-file-icon">
                    <FaFileAlt />
                  </div>

                  <div>

                    <span>
                      DOCUMENT REVIEW
                    </span>

                    <h2>
                      Document Details
                    </h2>

                  </div>

                </div>

                <button
                  className="dv-close-button"
                  onClick={handleClose}
                >
                  <FaTimes />
                </button>

              </div>

              {/* DOCUMENT STATUS */}

              <div className="dv-modal-status-row">

                <span className="dv-modal-label">
                  CURRENT STATUS
                </span>

                <span
                  className={getStatusClass(
                    getStatus(
                      selectedDocument
                    )
                  )}
                >
                  {getStatus(
                    selectedDocument
                  )}
                </span>

              </div>

              {/* DETAILS */}

              <div className="dv-detail-section">

                <div className="dv-section-title">
                  <FaIdCard />
                  DOCUMENT INFORMATION
                </div>

                <div className="dv-detail-grid">

                  <div className="dv-detail-item">

                    <span>
                      Document Name
                    </span>

                    <strong>
                      {getDocumentName(
                        selectedDocument
                      )}
                    </strong>

                  </div>

                  <div className="dv-detail-item">

                    <span>
                      Loan Type
                    </span>

                    <strong>
                      {selectedDocument.loanType ||
                        "Not attached"}
                    </strong>

                  </div>

                  <div className="dv-detail-item">

                    <span>
                      Application ID
                    </span>

                    <strong>
                      {selectedDocument.applicationId ||
                        "Not available"}
                    </strong>

                  </div>

                  <div className="dv-detail-item">

                    <span>
                      Uploaded At
                    </span>

                    <strong>
                      {selectedDocument.uploadedAt ||
                        "Not available"}
                    </strong>

                  </div>

                </div>

              </div>

              {/* CUSTOMER INFORMATION */}

              <div className="dv-detail-section">

                <div className="dv-section-title">
                  <FaUser />
                  CUSTOMER INFORMATION
                </div>

                <div className="dv-customer-detail">

                  <div className="dv-modal-avatar">
                    {getInitials(
                      selectedDocument.customerName
                    )}
                  </div>

                  <div>

                    <strong>
                      {selectedDocument.customerName ||
                        "Customer"}
                    </strong>

                    {selectedDocument.customerEmail && (
                      <span>
                        <FaEnvelope />
                        {selectedDocument.customerEmail}
                      </span>
                    )}

                  </div>

                </div>

              </div>

              {/* DOCUMENT PREVIEW */}

              <div className="dv-preview-box">

                <div className="dv-preview-icon">
                  <FaFileAlt />
                </div>

                <div>

                  <strong>
                    Document Preview
                  </strong>

                  <p>
                    The current application stores
                    document metadata only. The
                    actual uploaded file is not stored
                    in browser storage, so a real
                    PDF/image preview is not available
                    yet.
                  </p>

                </div>

              </div>

              {/* REJECTION REASON */}

              {selectedDocument.rejectionReason && (
                <div className="dv-rejection-existing">

                  <div className="dv-rejection-title">
                    <FaExclamationTriangle />
                    Previous Rejection Reason
                  </div>

                  <p>
                    {selectedDocument.rejectionReason}
                  </p>

                </div>
              )}

              {/* REJECT BOX */}

              {showRejectBox && (

                <div className="dv-reject-area">

                  <label>
                    Reason for rejection
                  </label>

                  <textarea
                    value={rejectReason}
                    onChange={(e) =>
                      setRejectReason(
                        e.target.value
                      )
                    }
                    placeholder="Enter a clear reason for rejecting this document..."
                    rows={4}
                    autoFocus
                  />

                  <span>
                    Please provide a reason so the
                    customer can understand what needs
                    to be corrected.
                  </span>

                </div>

              )}

              {/* ACTIONS */}

              <div className="dv-modal-actions">

                <button
                  className="dv-modal-cancel"
                  onClick={handleClose}
                >
                  Close
                </button>

                {getStatus(
                  selectedDocument
                ) !== "Verified" && (

                  <>

                    {!showRejectBox ? (

                      <button
                        className="dv-modal-reject"
                        onClick={() =>
                          setShowRejectBox(true)
                        }
                      >
                        <FaTimesCircle />
                        Reject
                      </button>

                    ) : (

                      <button
                        className="dv-modal-reject-confirm"
                        onClick={handleReject}
                      >
                        <FaTimesCircle />
                        Confirm Rejection
                      </button>

                    )}

                    <button
                      className="dv-modal-verify"
                      onClick={handleVerify}
                    >
                      <FaCheck />
                      Verify Document
                    </button>

                  </>

                )}

              </div>

            </div>

          </div>

        )}

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .dv-page {
          min-height: calc(100vh - 70px);
          padding: 30px 34px 50px;
          background: #f4f7fb;
          color: #102a4c;
          box-sizing: border-box;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .dv-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .dv-header-left {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .dv-header-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #e8f2ff;
          color: #075bbd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
          border: 1px solid #d4e6fa;
        }

        .dv-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 1.3px;
          font-weight: 800;
          color: #7b91ad;
          margin-bottom: 5px;
        }

        .dv-breadcrumb span {
          color: #b6c3d2;
        }

        .dv-header h1 {
          margin: 0;
          color: #062a61;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .dv-header p {
          margin: 5px 0 0;
          color: #71839a;
          font-size: 13px;
        }

        .dv-header-count {
          min-width: 135px;
          padding: 14px 18px;
          background: #ffffff;
          border: 1px solid #e1e8f0;
          border-radius: 12px;
          text-align: right;
          box-shadow: 0 4px 14px rgba(16, 42, 76, 0.035);
        }

        .dv-header-count span {
          display: block;
          color: #8293a8;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .dv-header-count strong {
          color: #0a3b80;
          font-size: 22px;
          font-weight: 800;
        }

        /* =====================================================
           STAT CARDS
        ===================================================== */

        .dv-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }

        .dv-stat-card {
          background: #ffffff;
          border: 1px solid #e2e9f1;
          border-radius: 14px;
          padding: 19px 21px;
          box-shadow: 0 4px 16px rgba(16, 42, 76, 0.035);
          transition: transform 0.18s ease,
                      box-shadow 0.18s ease;
        }

        .dv-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(16, 42, 76, 0.07);
        }

        .dv-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .dv-stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }

        .pending-icon {
          color: #2563a8;
          background: #edf5ff;
        }

        .verified-icon {
          color: #174f91;
          background: #e8f1fc;
        }

        .rejected-icon {
          color: #60758e;
          background: #eef2f6;
        }

        .dv-stat-mini {
          font-size: 9px;
          letter-spacing: 1px;
          font-weight: 800;
          color: #9aaabc;
        }

        .dv-stat-number {
          color: #082e65;
          font-size: 28px;
          line-height: 1;
          font-weight: 800;
          margin-bottom: 7px;
        }

        .dv-stat-label {
          color: #667b94;
          font-size: 12px;
          font-weight: 600;
        }

        /* =====================================================
           CONTENT CARD
        ===================================================== */

        .dv-content-card {
          background: #ffffff;
          border: 1px solid #e1e8f0;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(16, 42, 76, 0.04);
        }

        .dv-toolbar {
          min-height: 82px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #e8edf3;
        }

        .dv-toolbar h2 {
          margin: 0 0 5px;
          color: #0a2e67;
          font-size: 16px;
          font-weight: 800;
        }

        .dv-toolbar p {
          margin: 0;
          color: #8191a5;
          font-size: 11px;
        }

        .dv-toolbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* =====================================================
           SEARCH
        ===================================================== */

        .dv-search {
          height: 38px;
          width: 245px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 11px;
          background: #f8fafc;
          border: 1px solid #dce5ee;
          border-radius: 9px;
          box-sizing: border-box;
        }

        .dv-search > svg {
          color: #7d93ad;
          font-size: 13px;
          flex-shrink: 0;
        }

        .dv-search input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #193a61;
          font-size: 11px;
        }

        .dv-search input::placeholder {
          color: #a0afbf;
        }

        .dv-search:focus-within {
          border-color: #7faee0;
          background: #ffffff;
          box-shadow: 0 0 0 3px #edf5ff;
        }

        .dv-search-clear {
          border: none;
          background: transparent;
          color: #8798aa;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 3px;
        }

        .dv-filter {
          height: 38px;
          min-width: 130px;
          padding: 0 10px;
          border-radius: 9px;
          border: 1px solid #dce5ee;
          background: #f8fafc;
          color: #35516f;
          font-size: 11px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .dv-filter:focus {
          border-color: #7faee0;
          box-shadow: 0 0 0 3px #edf5ff;
        }

        /* =====================================================
           TABLE
        ===================================================== */

        .dv-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .dv-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        .dv-table thead {
          background: #f8fafc;
        }

        .dv-table th {
          padding: 12px 20px;
          text-align: left;
          color: #8495a9;
          font-size: 9px;
          letter-spacing: 0.9px;
          font-weight: 800;
          border-bottom: 1px solid #e6ecf2;
          white-space: nowrap;
        }

        .dv-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #edf1f5;
          vertical-align: middle;
        }

        .dv-table tbody tr {
          transition: background 0.16s ease;
        }

        .dv-table tbody tr:hover {
          background: #f9fbfe;
        }

        .dv-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* =====================================================
           DOCUMENT CELL
        ===================================================== */

        .dv-document-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dv-document-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #edf5ff;
          color: #0a5db5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #d9e9fa;
        }

        .dv-document-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dv-document-info strong {
          color: #0a3d7d;
          font-size: 12px;
          font-weight: 800;
        }

        .dv-document-info span {
          color: #93a2b2;
          font-size: 10px;
        }

        /* =====================================================
           CUSTOMER
        ===================================================== */

        .dv-customer-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dv-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #e9f2fc;
          color: #0a4e9c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          border: 1px solid #d7e7f8;
          flex-shrink: 0;
        }

        .dv-customer-cell > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .dv-customer-name {
          color: #0754a5;
          font-size: 12px;
          font-weight: 800;
        }

        .dv-customer-email {
          color: #91a0b1;
          font-size: 10px;
        }

        /* =====================================================
           LOAN TYPE
        ===================================================== */

        .dv-loan-type {
          color: #47627f;
          font-size: 11px;
          font-weight: 650;
        }

        /* =====================================================
           STATUS
        ===================================================== */

        .dv-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        .dv-status svg {
          font-size: 9px;
        }

        .dv-status.pending {
          color: #24588f;
          background: #edf5ff;
          border: 1px solid #d7e8fa;
        }

        .dv-status.verified {
          color: #164d8d;
          background: #e9f2fc;
          border: 1px solid #d5e5f7;
        }

        .dv-status.rejected {
          color: #66788d;
          background: #eef2f6;
          border: 1px solid #dde5ec;
        }

        /* =====================================================
           VIEW BUTTON
        ===================================================== */

        .dv-view-button {
          height: 33px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 8px;
          border: 1px solid #c8ddf3;
          background: #edf5ff;
          color: #075bbd;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.16s ease;
        }

        .dv-view-button:hover {
          background: #0a3b80;
          border-color: #0a3b80;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(10, 59, 128, 0.16);
        }

        .dv-view-button svg {
          font-size: 10px;
        }

        /* =====================================================
           EMPTY STATE
        ===================================================== */

        .dv-empty {
          padding: 75px 25px;
          text-align: center;
        }

        .dv-empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          border-radius: 16px;
          background: #edf5ff;
          color: #6593c2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
        }

        .dv-empty h3 {
          margin: 0 0 7px;
          color: #17385e;
          font-size: 16px;
        }

        .dv-empty p {
          margin: 0 auto;
          max-width: 430px;
          color: #8797a9;
          font-size: 11px;
          line-height: 1.6;
        }

        .dv-clear-filter {
          margin-top: 17px;
          padding: 9px 16px;
          border-radius: 8px;
          border: 1px solid #c9dced;
          background: #edf5ff;
          color: #075bbd;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        /* =====================================================
           MODAL OVERLAY
        ===================================================== */

        .dv-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          padding: 20px;
          background: rgba(5, 25, 51, 0.54);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .dv-modal {
          width: 100%;
          max-width: 690px;
          max-height: 91vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow:
            0 25px 70px rgba(4, 24, 50, 0.24);
          border: 1px solid #dfe7ef;
          animation: dvModalIn 0.18s ease;
        }

        @keyframes dvModalIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* =====================================================
           MODAL HEADER
        ===================================================== */

        .dv-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 22px 24px;
          border-bottom: 1px solid #e7edf3;
        }

        .dv-modal-title-area {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .dv-modal-file-icon {
          width: 43px;
          height: 43px;
          border-radius: 11px;
          background: #e9f3ff;
          color: #075bbd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .dv-modal-title-area span {
          display: block;
          color: #8b9bad;
          font-size: 9px;
          letter-spacing: 1px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .dv-modal-title-area h2 {
          margin: 0;
          color: #092f65;
          font-size: 19px;
          font-weight: 800;
        }

        .dv-close-button {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #e1e8ef;
          background: #f7f9fb;
          color: #718399;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .dv-close-button:hover {
          background: #edf5ff;
          color: #075bbd;
          border-color: #c9def4;
        }

        /* =====================================================
           MODAL STATUS
        ===================================================== */

        .dv-modal-status-row {
          padding: 14px 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e8edf2;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dv-modal-label {
          color: #8b9bac;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.9px;
        }

        /* =====================================================
           DETAIL SECTIONS
        ===================================================== */

        .dv-detail-section {
          padding: 20px 24px 0;
        }

        .dv-section-title {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 13px;
          color: #7890aa;
          font-size: 9px;
          letter-spacing: 1px;
          font-weight: 800;
        }

        .dv-section-title svg {
          color: #0a5db5;
          font-size: 10px;
        }

        .dv-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border: 1px solid #e5ebf1;
          border-radius: 10px;
          overflow: hidden;
        }

        .dv-detail-item {
          padding: 13px 15px;
          background: #fbfcfd;
          border-bottom: 1px solid #e8edf2;
        }

        .dv-detail-item:nth-child(odd) {
          border-right: 1px solid #e8edf2;
        }

        .dv-detail-item:nth-child(3),
        .dv-detail-item:nth-child(4) {
          border-bottom: none;
        }

        .dv-detail-item span {
          display: block;
          color: #8c9bac;
          font-size: 9px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .dv-detail-item strong {
          color: #193d68;
          font-size: 11px;
          font-weight: 750;
        }

        /* =====================================================
           CUSTOMER DETAIL
        ===================================================== */

        .dv-customer-detail {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 15px;
          background: #f8fafc;
          border: 1px solid #e5ebf1;
          border-radius: 10px;
        }

        .dv-modal-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e8f2ff;
          color: #0a4e9c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
        }

        .dv-customer-detail > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dv-customer-detail strong {
          color: #0a3b80;
          font-size: 12px;
          font-weight: 800;
        }

        .dv-customer-detail span {
          color: #8393a5;
          font-size: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dv-customer-detail span svg {
          font-size: 9px;
        }

        /* =====================================================
           PREVIEW
        ===================================================== */

        .dv-preview-box {
          margin: 20px 24px 0;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #f5f9fd;
          border: 1px solid #dceaf7;
          border-radius: 10px;
        }

        .dv-preview-icon {
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          border-radius: 8px;
          background: #e4f0fc;
          color: #0a5db5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dv-preview-box strong {
          display: block;
          color: #174575;
          font-size: 11px;
          margin-bottom: 5px;
        }

        .dv-preview-box p {
          margin: 0;
          color: #7d90a5;
          font-size: 10px;
          line-height: 1.6;
        }

        /* =====================================================
           EXISTING REJECTION
        ===================================================== */

        .dv-rejection-existing {
          margin: 18px 24px 0;
          padding: 14px;
          border-radius: 9px;
          background: #f5f7fa;
          border: 1px solid #e0e7ee;
        }

        .dv-rejection-title {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #63788f;
          font-size: 10px;
          font-weight: 800;
          margin-bottom: 7px;
        }

        .dv-rejection-title svg {
          font-size: 10px;
        }

        .dv-rejection-existing p {
          margin: 0;
          color: #6f8093;
          font-size: 10px;
          line-height: 1.6;
        }

        /* =====================================================
           REJECT AREA
        ===================================================== */

        .dv-reject-area {
          margin: 20px 24px 0;
        }

        .dv-reject-area label {
          display: block;
          color: #314e6d;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 7px;
        }

        .dv-reject-area textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 12px;
          border-radius: 9px;
          border: 1px solid #ccd9e6;
          background: #fbfcfd;
          color: #294966;
          font-family: inherit;
          font-size: 11px;
          line-height: 1.5;
          resize: vertical;
          outline: none;
        }

        .dv-reject-area textarea:focus {
          background: #ffffff;
          border-color: #7ba9d8;
          box-shadow: 0 0 0 3px #edf5ff;
        }

        .dv-reject-area span {
          display: block;
          margin-top: 6px;
          color: #94a2b1;
          font-size: 9px;
        }

        /* =====================================================
           MODAL ACTIONS
        ===================================================== */

        .dv-modal-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 9px;
          padding: 21px 24px 23px;
          margin-top: 20px;
          border-top: 1px solid #e7edf3;
        }

        .dv-modal-actions button {
          height: 38px;
          padding: 0 15px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.16s ease;
        }

        .dv-modal-cancel {
          background: #ffffff;
          color: #61768e;
          border: 1px solid #d8e1ea;
        }

        .dv-modal-cancel:hover {
          background: #f5f8fb;
          color: #294c70;
        }

        .dv-modal-reject {
          background: #eef2f6;
          color: #65788d;
          border: 1px solid #d8e1e9;
        }

        .dv-modal-reject:hover {
          background: #e5ebf1;
          color: #52677e;
          transform: translateY(-1px);
        }

        .dv-modal-reject-confirm {
          background: #647991;
          color: #ffffff;
          border: 1px solid #647991;
        }

        .dv-modal-reject-confirm:hover {
          background: #536a82;
          transform: translateY(-1px);
        }

        .dv-modal-verify {
          background: #0a3b80;
          color: #ffffff;
          border: 1px solid #0a3b80;
          box-shadow: 0 4px 10px rgba(10, 59, 128, 0.14);
        }

        .dv-modal-verify:hover {
          background: #0754a5;
          border-color: #0754a5;
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(10, 59, 128, 0.2);
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 950px) {

          .dv-page {
            padding: 24px 20px 40px;
          }

          .dv-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .dv-toolbar-right {
            width: 100%;
          }

          .dv-search {
            flex: 1;
            width: auto;
          }

        }

        @media (max-width: 700px) {

          .dv-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .dv-header-count {
            text-align: left;
          }

          .dv-stats {
            grid-template-columns: 1fr;
          }

          .dv-toolbar-right {
            flex-direction: column;
            align-items: stretch;
          }

          .dv-filter {
            width: 100%;
          }

          .dv-detail-grid {
            grid-template-columns: 1fr;
          }

          .dv-detail-item:nth-child(odd) {
            border-right: none;
          }

          .dv-detail-item:nth-child(3) {
            border-bottom: 1px solid #e8edf2;
          }

          .dv-modal-actions {
            flex-wrap: wrap;
          }

        }

      `}</style>

    </div>
  );
}

export default DocumentVerification;