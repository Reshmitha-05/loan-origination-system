import { useEffect, useMemo, useState } from "react";
import {
  FaCar,
  FaGraduationCap,
  FaHome,
  FaUser,
  FaFileAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClock,
  FaTimes,
  FaSearch,
  FaCheckCircle,
  FaHourglassHalf,
  FaClipboardList,
  FaExclamationCircle,
} from "react-icons/fa";

function ApplicationRequests() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loanTypeFilter, setLoanTypeFilter] = useState("All");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const stored = localStorage.getItem("customerApplications");

    if (stored) {
      try {
        setApplications(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading applications:", error);
        setApplications([]);
      }
    } else {
      setApplications([]);
    }
  };

  /* -------------------- HELPERS -------------------- */

  const getLoanIcon = (loanType) => {
    const type = loanType?.toLowerCase() || "";

    if (type.includes("student")) {
      return <FaGraduationCap />;
    }

    if (type.includes("car")) {
      return <FaCar />;
    }

    if (type.includes("home")) {
      return <FaHome />;
    }

    return <FaUser />;
  };

  const getLoanName = (loanType) => {
    if (!loanType) return "Loan";

    const cleaned = loanType
      .replace(/loan/gi, "")
      .trim();

    return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)} Loan`;
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return {
          background: "#e8f0fa",
          color: "#0A2654",
          border: "1px solid #c8d8ed",
        };

      case "Declined":
      case "Rejected":
        return {
          background: "#eef2f7",
          color: "#607894",
          border: "1px solid #d4deea",
        };

      case "Under Review":
        return {
          background: "#edf4ff",
          color: "#2563eb",
          border: "1px solid #c8dcfa",
        };

      default:
        return {
          background: "#eef5ff",
          color: "#3B82F6",
          border: "1px solid #d3e3fa",
        };
    }
  };

  const getStatusText = (status) => {
    if (status === "Rejected") return "Declined";
    return status || "Pending";
  };

  /* -------------------- COUNTS -------------------- */

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (application) =>
      application.status === "Pending" ||
      application.status === "Under Review"
  );

  const underReviewApplications = applications.filter(
    (application) => application.status === "Under Review"
  );

  const approvedApplications = applications.filter(
    (application) => application.status === "Approved"
  );

  const declinedApplications = applications.filter(
    (application) =>
      application.status === "Declined" ||
      application.status === "Rejected"
  );

  const loanTypes = [
    ...new Set(
      applications
        .map((application) => application.loanType)
        .filter(Boolean)
    ),
  ];

  /* -------------------- SEARCH + FILTER -------------------- */

  const filteredPendingApplications = useMemo(() => {
    return pendingApplications.filter((application) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        String(application.id)
          .toLowerCase()
          .includes(search) ||
        String(application.customerName || "")
          .toLowerCase()
          .includes(search) ||
        String(application.customerId || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      const matchesLoanType =
        loanTypeFilter === "All" ||
        application.loanType === loanTypeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLoanType
      );
    });
  }, [
    pendingApplications,
    searchTerm,
    statusFilter,
    loanTypeFilter,
  ]);

  const recentlyReviewed = applications
    .filter(
      (application) =>
        application.status === "Approved" ||
        application.status === "Declined" ||
        application.status === "Rejected"
    )
    .sort((a, b) => {
      const dateA = a.decisionDate
        ? new Date(a.decisionDate)
        : new Date(0);

      const dateB = b.decisionDate
        ? new Date(b.decisionDate)
        : new Date(0);

      return dateB - dateA;
    });

  /* -------------------- VIEW DETAILS -------------------- */

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  const closeDetails = () => {
    setSelectedApplication(null);
  };

  /* -------------------- UPDATE STATUS -------------------- */

  const updateApplicationStatus = (newStatus) => {
    if (!selectedApplication) return;

    const decisionDate = new Date().toLocaleDateString("en-IN");
    const decisionTime = new Date().toLocaleTimeString("en-IN");

    const updatedApplications = applications.map(
      (application) =>
        application.id === selectedApplication.id
          ? {
              ...application,
              status: newStatus,
              decisionDate:
                newStatus === "Approved" ||
                newStatus === "Declined"
                  ? decisionDate
                  : application.decisionDate,
              decisionTime:
                newStatus === "Approved" ||
                newStatus === "Declined"
                  ? decisionTime
                  : application.decisionTime,
              reviewStartedAt:
                newStatus === "Under Review"
                  ? decisionDate
                  : application.reviewStartedAt,
            }
          : application
    );

    setApplications(updatedApplications);

    localStorage.setItem(
      "customerApplications",
      JSON.stringify(updatedApplications)
    );

    const updatedSelectedApplication =
      updatedApplications.find(
        (application) =>
          application.id === selectedApplication.id
      );

    setSelectedApplication(updatedSelectedApplication);
  };

  /* -------------------- DOCUMENTS -------------------- */

  const getApplicationDocuments = (application) => {
    /*
      Prefer documents stored inside the application.

      This supports the improved document flow where
      ApplyForLoan attaches verified documents to the
      specific application.

      Older applications will fall back to customerDocuments.
    */

    if (
      application?.documents &&
      Array.isArray(application.documents)
    ) {
      return application.documents;
    }

    try {
      const storedDocuments =
        localStorage.getItem("customerDocuments");

      if (storedDocuments) {
        return JSON.parse(storedDocuments);
      }
    } catch (error) {
      console.error(
        "Error loading customer documents:",
        error
      );
    }

    return [];
  };

  /* -------------------- TIMELINE -------------------- */

  const getTimeline = (application) => {
    const timeline = [
      {
        title: "Application Submitted",
        date: application.appliedDate,
        time: application.appliedTime,
        completed: true,
      },
    ];

    if (
      application.status === "Under Review" ||
      application.status === "Approved" ||
      application.status === "Declined" ||
      application.status === "Rejected"
    ) {
      timeline.push({
        title: "Application Under Review",
        date:
          application.reviewStartedAt ||
          application.appliedDate,
        completed: true,
      });
    }

    if (
      application.status === "Approved" ||
      application.status === "Declined" ||
      application.status === "Rejected"
    ) {
      timeline.push({
        title:
          application.status === "Approved"
            ? "Application Approved"
            : "Application Declined",
        date:
          application.decisionDate ||
          application.appliedDate,
        time: application.decisionTime,
        completed: true,
      });
    }

    if (
      application.status === "Pending"
    ) {
      timeline.push({
        title: "Awaiting Admin Review",
        date: null,
        completed: false,
      });
    }

    if (
      application.status === "Under Review"
    ) {
      timeline.push({
        title: "Decision Pending",
        date: null,
        completed: false,
      });
    }

    return timeline;
  };

  return (
    <div
      style={{
        padding: "28px 34px 50px",
        background: "#f6f8fb",
        minHeight: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "26px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#0A2654",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            Application Requests
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "#6F8FB3",
              fontSize: "15px",
            }}
          >
            Review and manage customer loan applications.
          </p>
        </div>
      </div>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {/* TOTAL */}
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle("#0A2654")}>
            <FaClipboardList />
          </div>

          <div>
            <div style={summaryLabelStyle}>
              Total Applications
            </div>

            <div style={summaryNumberStyle}>
              {totalApplications}
            </div>

            <div style={summaryDescriptionStyle}>
              All applications received
            </div>
          </div>
        </div>

        {/* PENDING */}
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle("#3B82F6")}>
            <FaHourglassHalf />
          </div>

          <div>
            <div style={summaryLabelStyle}>
              Pending Review
            </div>

            <div style={summaryNumberStyle}>
              {pendingApplications.length}
            </div>

            <div style={summaryDescriptionStyle}>
              Require admin attention
            </div>
          </div>
        </div>

        {/* APPROVED */}
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle("#0A2654")}>
            <FaCheckCircle />
          </div>

          <div>
            <div style={summaryLabelStyle}>
              Approved
            </div>

            <div style={summaryNumberStyle}>
              {approvedApplications.length}
            </div>

            <div style={summaryDescriptionStyle}>
              Successfully approved
            </div>
          </div>
        </div>

        {/* DECLINED */}
        <div style={summaryCardStyle}>
          <div style={summaryIconStyle("#6F8FB3")}>
            <FaExclamationCircle />
          </div>

          <div>
            <div style={summaryLabelStyle}>
              Declined
            </div>

            <div style={summaryNumberStyle}>
              {declinedApplications.length}
            </div>

            <div style={summaryDescriptionStyle}>
              Applications declined
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          SEARCH + FILTERS
      ================================================== */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #dce6f1",
          borderRadius: "16px",
          padding: "18px",
          marginBottom: "28px",
          boxShadow: "0 4px 16px rgba(10,38,84,0.04)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(240px, 1fr) 180px 180px",
            gap: "14px",
          }}
        >
          {/* SEARCH */}
          <div
            style={{
              position: "relative",
            }}
          >
            <FaSearch
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6F8FB3",
              }}
            />

            <input
              type="text"
              placeholder="Search applicant or application ID..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            style={selectStyle}
          >
            <option value="All">
              All Statuses
            </option>
            <option value="Pending">
              Pending
            </option>
            <option value="Under Review">
              Under Review
            </option>
          </select>

          {/* LOAN TYPE */}
          <select
            value={loanTypeFilter}
            onChange={(e) =>
              setLoanTypeFilter(e.target.value)
            }
            style={selectStyle}
          >
            <option value="All">
              All Loan Types
            </option>

            {loanTypes.map((type) => (
              <option
                key={type}
                value={type}
              >
                {getLoanName(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ==================================================
          PENDING REQUESTS
      ================================================== */}

      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h3 style={sectionTitleStyle}>
              Applications Requiring Attention
            </h3>

            <p style={sectionSubtitleStyle}>
              Pending and under-review applications
            </p>
          </div>

          <div
            style={{
              background: "#e8f0fa",
              color: "#0A2654",
              padding: "9px 15px",
              borderRadius: "20px",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            {filteredPendingApplications.length} Pending
          </div>
        </div>

        {filteredPendingApplications.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(390px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredPendingApplications.map(
              (application) => (
                <div
                  key={application.id}
                  style={requestCardStyle}
                >
                  {/* CARD HEADER */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: "15px",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={loanIconStyle}
                      >
                        {getLoanIcon(
                          application.loanType
                        )}
                      </div>

                      <div>
                        <h3
                          style={{
                            margin: 0,
                            color: "#0A2654",
                            fontSize: "18px",
                            fontWeight: 700,
                          }}
                        >
                          {getLoanName(
                            application.loanType
                          )}
                        </h3>

                        <p
                          style={{
                            margin:
                              "5px 0 0",
                            color: "#6F8FB3",
                            fontSize: "13px",
                          }}
                        >
                          Application ID:{" "}
                          <strong
                            style={{
                              color:
                                "#0A2654",
                            }}
                          >
                            #{application.id}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        ...statusBadgeStyle,
                        ...getStatusStyle(
                          application.status
                        ),
                      }}
                    >
                      {getStatusText(
                        application.status
                      )}
                    </span>
                  </div>

                  {/* APPLICANT */}
                  <div
                    style={{
                      borderTop:
                        "1px solid #e5ebf2",
                      borderBottom:
                        "1px solid #e5ebf2",
                      padding:
                        "15px 0",
                      marginBottom:
                        "16px",
                    }}
                  >
                    <div
                      style={{
                        color: "#6F8FB3",
                        fontSize: "12px",
                        marginBottom:
                          "5px",
                      }}
                    >
                      Applicant
                    </div>

                    <strong
                      style={{
                        color: "#0A2654",
                        fontSize: "16px",
                      }}
                    >
                      {application.customerName ||
                        "Customer"}
                    </strong>
                  </div>

                  {/* DETAILS */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "18px",
                    }}
                  >
                    <CardDetail
                      icon={<FaMoneyBillWave />}
                      label="Requested Amount"
                      value={formatCurrency(
                        application.loanAmount
                      )}
                    />

                    <CardDetail
                      icon={<FaCalendarAlt />}
                      label="Applied On"
                      value={
                        application.appliedDate ||
                        "Not specified"
                      }
                    />

                    <CardDetail
                      icon={<FaFileAlt />}
                      label="Purpose"
                      value={
                        application.purpose
                          ? application.purpose
                              .length > 28
                            ? application.purpose.substring(
                                0,
                                28
                              ) + "..."
                            : application.purpose
                          : "Not specified"
                      }
                    />

                    <CardDetail
                      icon={<FaClock />}
                      label="Submitted"
                      value={
                        application.appliedTime ||
                        "Not specified"
                      }
                    />
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() =>
                      handleViewDetails(
                        application
                      )
                    }
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      padding: "12px 16px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#0A2654",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    View Application Details →
                  </button>
                </div>
              )
            )}
          </div>
        ) : (
          <EmptyState
            title="No Applications Found"
            message={
              searchTerm ||
              statusFilter !== "All" ||
              loanTypeFilter !== "All"
                ? "Try changing your search or filters."
                : "New customer applications will appear here."
            }
          />
        )}
      </div>

      {/* ==================================================
          RECENTLY REVIEWED
      ================================================== */}

      {recentlyReviewed.length > 0 && (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h3 style={sectionTitleStyle}>
                Recently Reviewed
              </h3>

              <p style={sectionSubtitleStyle}>
                Applications that have already been processed
              </p>
            </div>

            <div
              style={{
                color: "#6F8FB3",
                fontSize: "14px",
              }}
            >
              {recentlyReviewed.length} processed
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {recentlyReviewed
              .slice(0, 6)
              .map((application) => (
                <div
                  key={application.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    padding: "15px 18px",
                    border:
                      "1px solid #e1e8f0",
                    borderRadius: "10px",
                    background:
                      "#fbfcfe",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "13px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background:
                          "#e8f0fa",
                        color: "#0A2654",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                      }}
                    >
                      {getLoanIcon(
                        application.loanType
                      )}
                    </div>

                    <div>
                      <strong
                        style={{
                          color:
                            "#0A2654",
                          fontSize:
                            "14px",
                        }}
                      >
                        {getLoanName(
                          application.loanType
                        )}
                      </strong>

                      <div
                        style={{
                          color:
                            "#6F8FB3",
                          fontSize:
                            "12px",
                          marginTop:
                            "3px",
                        }}
                      >
                        #{application.id}{" "}
                        ·{" "}
                        {application.customerName ||
                          "Customer"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "20px",
                    }}
                  >
                    <strong
                      style={{
                        color:
                          "#0A2654",
                      }}
                    >
                      {formatCurrency(
                        application.loanAmount
                      )}
                    </strong>

                    <span
                      style={{
                        ...statusBadgeStyle,
                        ...getStatusStyle(
                          application.status
                        ),
                      }}
                    >
                      {getStatusText(
                        application.status
                      )}
                    </span>

                    <button
                      onClick={() =>
                        handleViewDetails(
                          application
                        )
                      }
                      style={{
                        border:
                          "1px solid #d5e1ef",
                        background:
                          "#ffffff",
                        color:
                          "#0A2654",
                        padding:
                          "8px 12px",
                        borderRadius:
                          "7px",
                        fontWeight:
                          600,
                        cursor:
                          "pointer",
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

      {selectedApplication && (
        <div
          onClick={closeDetails}
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(10,38,84,0.48)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "25px",
          }}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "min(900px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "18px",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.2)",
            }}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                padding:
                  "24px 28px",
                borderBottom:
                  "1px solid #e3eaf2",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "flex-start",
                gap: "15px",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#6F8FB3",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing:
                      "1px",
                    marginBottom:
                      "6px",
                  }}
                >
                  LOAN APPLICATION
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: "#0A2654",
                    fontSize: "25px",
                  }}
                >
                  {getLoanName(
                    selectedApplication.loanType
                  )}
                </h2>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                    color: "#6F8FB3",
                    fontSize: "13px",
                  }}
                >
                  Application ID:{" "}
                  <strong>
                    #{selectedApplication.id}
                  </strong>
                </p>
              </div>

              <button
                onClick={closeDetails}
                style={{
                  width: "36px",
                  height: "36px",
                  border: "none",
                  borderRadius: "50%",
                  background: "#f0f4f8",
                  color: "#0A2654",
                  cursor: "pointer",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontSize: "15px",
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* STATUS */}
            <div
              style={{
                margin:
                  "20px 28px",
                padding:
                  "14px 16px",
                borderRadius: "10px",
                background: "#f7faff",
                border:
                  "1px solid #dce7f3",
                display: "flex",
                alignItems:
                  "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  ...statusBadgeStyle,
                  ...getStatusStyle(
                    selectedApplication.status
                  ),
                }}
              >
                {getStatusText(
                  selectedApplication.status
                )}
              </span>

              <span
                style={{
                  color: "#607894",
                  fontSize: "13px",
                }}
              >
                {selectedApplication.status ===
                "Pending"
                  ? "This application is waiting for admin review."
                  : selectedApplication.status ===
                    "Under Review"
                  ? "This application is currently being reviewed."
                  : selectedApplication.status ===
                    "Approved"
                  ? "This application has been approved."
                  : "This application has been declined."}
              </span>
            </div>

            <div
              style={{
                padding:
                  "0 28px 28px",
              }}
            >
              {/* APPLICANT */}
              <ModalSection title="Applicant Information">
                <InfoGrid>
                  <InfoItem
                    label="Applicant Name"
                    value={
                      selectedApplication.customerName ||
                      "Not provided"
                    }
                  />

                  <InfoItem
                    label="Email"
                    value={
                      selectedApplication.customerId ||
                      "Not provided"
                    }
                  />

                  <InfoItem
                    label="Phone"
                    value={
                      selectedApplication.phone ||
                      "Not provided"
                    }
                  />

                  <InfoItem
                    label="Customer ID"
                    value={
                      selectedApplication.customerId ||
                      "Not provided"
                    }
                  />
                </InfoGrid>
              </ModalSection>

              {/* LOAN */}
              <ModalSection title="Loan Information">
                <InfoGrid>
                  <InfoItem
                    label="Loan Type"
                    value={getLoanName(
                      selectedApplication.loanType
                    )}
                  />

                  <InfoItem
                    label="Requested Amount"
                    value={formatCurrency(
                      selectedApplication.loanAmount
                    )}
                  />

                  <InfoItem
                    label="Tenure"
                    value={
                      selectedApplication.tenure ||
                      "Not specified"
                    }
                  />

                  <InfoItem
                    label="Applied On"
                    value={
                      selectedApplication.appliedDate ||
                      "Not specified"
                    }
                  />

                  <InfoItem
                    label="Submitted At"
                    value={
                      selectedApplication.appliedTime ||
                      "Not specified"
                    }
                  />
                </InfoGrid>
              </ModalSection>

              {/* PURPOSE */}
              <ModalSection title="Loan Purpose">
                <div
                  style={{
                    padding:
                      "14px 16px",
                    background:
                      "#f8fafc",
                    borderRadius:
                      "9px",
                    color:
                      "#334e6f",
                    lineHeight: 1.6,
                    fontSize:
                      "14px",
                  }}
                >
                  {selectedApplication.purpose ||
                    "No purpose provided."}
                </div>
              </ModalSection>

              {/* DOCUMENTS */}
              <ModalSection title="Uploaded Documents">
                {getApplicationDocuments(
                  selectedApplication
                ).length > 0 ? (
                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: "10px",
                    }}
                  >
                    {getApplicationDocuments(
                      selectedApplication
                    ).map(
                      (document) => {
                        const documentStatus =
                          document.status ||
                          document.analysisStatus ||
                          "pending";

                        const isVerified =
                          documentStatus ===
                            "verified" ||
                          documentStatus ===
                            "Verified";

                        return (
                          <div
                            key={
                              document.id
                            }
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "space-between",
                              padding:
                                "13px 15px",
                              border:
                                "1px solid #e1e8f0",
                              borderRadius:
                                "9px",
                              gap: "15px",
                            }}
                          >
                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  width:
                                    "38px",
                                  height:
                                    "38px",
                                  borderRadius:
                                    "8px",
                                  background:
                                    "#e8f0fa",
                                  color:
                                    "#3B82F6",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                }}
                              >
                                <FaFileAlt />
                              </div>

                              <div>
                                <strong
                                  style={{
                                    display:
                                      "block",
                                    color:
                                      "#0A2654",
                                    fontSize:
                                      "13px",
                                  }}
                                >
                                  {
                                    document.name
                                  }
                                </strong>

                                <span
                                  style={{
                                    color:
                                      "#6F8FB3",
                                    fontSize:
                                      "11px",
                                  }}
                                >
                                  {document.type ||
                                    "Document"}
                                </span>
                              </div>
                            </div>

                            <span
                              style={{
                                ...statusBadgeStyle,
                                ...(isVerified
                                  ? {
                                      background:
                                        "#e8f0fa",
                                      color:
                                        "#0A2654",
                                      border:
                                        "1px solid #c8d8ed",
                                    }
                                  : {
                                      background:
                                        "#f3f6fa",
                                      color:
                                        "#6F8FB3",
                                      border:
                                        "1px solid #dce5ef",
                                    }),
                              }}
                            >
                              {isVerified
                                ? "✓ Verified"
                                : "Pending"}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      padding:
                        "20px",
                      textAlign:
                        "center",
                      background:
                        "#f8fafc",
                      borderRadius:
                        "9px",
                      color:
                        "#6F8FB3",
                      fontSize:
                        "13px",
                    }}
                  >
                    No documents uploaded for this application.
                  </div>
                )}
              </ModalSection>

              {/* TIMELINE */}
              <ModalSection title="Application Timeline">
                <div
                  style={{
                    position:
                      "relative",
                    paddingLeft:
                      "30px",
                  }}
                >
                  {getTimeline(
                    selectedApplication
                  ).map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={index}
                        style={{
                          position:
                            "relative",
                          paddingBottom:
                            index <
                            getTimeline(
                              selectedApplication
                            ).length -
                              1
                              ? "22px"
                              : "0",
                        }}
                      >
                        {index <
                          getTimeline(
                            selectedApplication
                          ).length -
                            1 && (
                          <div
                            style={{
                              position:
                                "absolute",
                              left:
                                "-20px",
                              top:
                                "20px",
                              bottom:
                                "0",
                              width:
                                "2px",
                              background:
                                item.completed
                                  ? "#cbd9e8"
                                  : "#e4eaf1",
                            }}
                          />
                        )}

                        <div
                          style={{
                            position:
                              "absolute",
                            left:
                              "-28px",
                            top:
                              "1px",
                            width:
                              "16px",
                            height:
                              "16px",
                            borderRadius:
                              "50%",
                            background:
                              item.completed
                                ? "#3B82F6"
                                : "#d9e2ec",
                            border:
                              "3px solid #ffffff",
                            boxShadow:
                              "0 0 0 1px #d6e0eb",
                          }}
                        />

                        <strong
                          style={{
                            color:
                              item.completed
                                ? "#0A2654"
                                : "#8aa0b8",
                            fontSize:
                              "13px",
                          }}
                        >
                          {item.title}
                        </strong>

                        {item.date && (
                          <div
                            style={{
                              color:
                                "#6F8FB3",
                              fontSize:
                                "11px",
                              marginTop:
                                "3px",
                            }}
                          >
                            {item.date}
                            {item.time
                              ? ` · ${item.time}`
                              : ""}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </ModalSection>

              {/* DECISION */}
              <div
                style={{
                  marginTop:
                    "24px",
                  padding:
                    "20px",
                  background:
                    "#f7faff",
                  border:
                    "1px solid #dbe6f2",
                  borderRadius:
                    "12px",
                }}
              >
                <h3
                  style={{
                    margin:
                      "0 0 8px",
                    color:
                      "#0A2654",
                    fontSize:
                      "17px",
                  }}
                >
                  Application Decision
                </h3>

                {selectedApplication.status ===
                  "Pending" && (
                  <>
                    <p
                      style={{
                        margin:
                          "0 0 16px",
                        color:
                          "#6F8FB3",
                        fontSize:
                          "13px",
                      }}
                    >
                      Start reviewing this application or make a final decision.
                    </p>

                    <div
                      style={{
                        display:
                          "flex",
                        gap: "10px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            "Under Review"
                          )
                        }
                        style={{
                          flex: 1,
                          minWidth:
                            "170px",
                          padding:
                            "12px",
                          border:
                            "1px solid #3B82F6",
                          borderRadius:
                            "8px",
                          background:
                            "#ffffff",
                          color:
                            "#2563eb",
                          fontWeight:
                            600,
                          cursor:
                            "pointer",
                        }}
                      >
                        Mark Under Review
                      </button>

                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            "Declined"
                          )
                        }
                        style={{
                          flex: 1,
                          minWidth:
                            "150px",
                          padding:
                            "12px",
                          border:
                            "1px solid #cfdbe8",
                          borderRadius:
                            "8px",
                          background:
                            "#ffffff",
                          color:
                            "#607894",
                          fontWeight:
                            600,
                          cursor:
                            "pointer",
                        }}
                      >
                        Decline
                      </button>

                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            "Approved"
                          )
                        }
                        style={{
                          flex: 1,
                          minWidth:
                            "150px",
                          padding:
                            "12px",
                          border: "none",
                          borderRadius:
                            "8px",
                          background:
                            "#0A2654",
                          color:
                            "#ffffff",
                          fontWeight:
                            600,
                          cursor:
                            "pointer",
                        }}
                      >
                        Approve
                      </button>
                    </div>
                  </>
                )}

                {selectedApplication.status ===
                  "Under Review" && (
                  <>
                    <p
                      style={{
                        margin:
                          "0 0 16px",
                        color:
                          "#6F8FB3",
                        fontSize:
                          "13px",
                      }}
                    >
                      This application is currently under review.
                    </p>

                    <div
                      style={{
                        display:
                          "flex",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            "Declined"
                          )
                        }
                        style={{
                          flex: 1,
                          padding:
                            "12px",
                          border:
                            "1px solid #cfdbe8",
                          borderRadius:
                            "8px",
                          background:
                            "#ffffff",
                          color:
                            "#607894",
                          fontWeight:
                            600,
                          cursor:
                            "pointer",
                        }}
                      >
                        Decline Application
                      </button>

                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            "Approved"
                          )
                        }
                        style={{
                          flex: 1,
                          padding:
                            "12px",
                          border: "none",
                          borderRadius:
                            "8px",
                          background:
                            "#0A2654",
                          color:
                            "#ffffff",
                          fontWeight:
                            600,
                          cursor:
                            "pointer",
                        }}
                      >
                        Approve Application
                      </button>
                    </div>
                  </>
                )}

                {(selectedApplication.status ===
                  "Approved" ||
                  selectedApplication.status ===
                    "Declined" ||
                  selectedApplication.status ===
                    "Rejected") && (
                  <div>
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "9px",
                        color:
                          "#0A2654",
                        fontWeight:
                          700,
                        fontSize:
                          "14px",
                      }}
                    >
                      <FaCheckCircle />

                      Decision:{" "}
                      {getStatusText(
                        selectedApplication.status
                      )}
                    </div>

                    <div
                      style={{
                        color:
                          "#6F8FB3",
                        fontSize:
                          "12px",
                        marginTop:
                          "6px",
                      }}
                    >
                      Processed on{" "}
                      {selectedApplication.decisionDate ||
                        "Not specified"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div
              style={{
                padding:
                  "16px 28px",
                borderTop:
                  "1px solid #e3eaf2",
                display:
                  "flex",
                justifyContent:
                  "flex-end",
              }}
            >
              <button
                onClick={closeDetails}
                style={{
                  padding:
                    "10px 20px",
                  border:
                    "1px solid #d2deeb",
                  borderRadius:
                    "8px",
                  background:
                    "#ffffff",
                  color:
                    "#0A2654",
                  fontWeight:
                    600,
                  cursor:
                    "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   SMALL COMPONENTS
====================================================== */

function CardDetail({
  icon,
  label,
  value,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "9px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          color: "#3B82F6",
          marginTop: "2px",
          fontSize: "13px",
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            color: "#6F8FB3",
            fontSize: "11px",
            marginBottom: "4px",
          }}
        >
          {label}
        </div>

        <strong
          style={{
            color: "#0A2654",
            fontSize: "13px",
            lineHeight: 1.4,
          }}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

function ModalSection({
  title,
  children,
}) {
  return (
    <div
      style={{
        marginTop: "24px",
      }}
    >
      <h3
        style={{
          margin:
            "0 0 13px",
          color: "#0A2654",
          fontSize: "16px",
        }}
      >
        {title}
      </h3>

      {children}
    </div>
  );
}

function InfoGrid({
  children,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "14px",
      }}
    >
      {children}
    </div>
  );
}

function InfoItem({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding:
          "13px 14px",
        background:
          "#f8fafc",
        borderRadius:
          "8px",
        border:
          "1px solid #e5ebf2",
      }}
    >
      <div
        style={{
          color: "#6F8FB3",
          fontSize: "11px",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>

      <strong
        style={{
          color: "#0A2654",
          fontSize: "13px",
          wordBreak:
            "break-word",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function EmptyState({
  title,
  message,
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "55px 20px",
        border:
          "1px dashed #d5e0ec",
        borderRadius: "12px",
        background: "#fbfcfe",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          margin: "0 auto 15px",
          borderRadius: "50%",
          background: "#e8f0fa",
          color: "#3B82F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}
      >
        <FaFileAlt />
      </div>

      <h3
        style={{
          margin: 0,
          color: "#0A2654",
          fontSize: "17px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin:
            "7px 0 0",
          color: "#6F8FB3",
          fontSize: "13px",
        }}
      >
        {message}
      </p>
    </div>
  );
}

/* ======================================================
   STYLES
====================================================== */

const summaryCardStyle = {
  background: "#ffffff",
  border: "1px solid #dce6f1",
  borderRadius: "14px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  boxShadow:
    "0 4px 16px rgba(10,38,84,0.04)",
};

const summaryIconStyle = (color) => ({
  width: "45px",
  height: "45px",
  borderRadius: "11px",
  background: "#e8f0fa",
  color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  flexShrink: 0,
});

const summaryLabelStyle = {
  color: "#6F8FB3",
  fontSize: "12px",
  fontWeight: 600,
};

const summaryNumberStyle = {
  color: "#0A2654",
  fontSize: "27px",
  fontWeight: 700,
  lineHeight: 1.2,
  marginTop: "4px",
};

const summaryDescriptionStyle = {
  color: "#8ba1b9",
  fontSize: "11px",
  marginTop: "3px",
};

const inputStyle = {
  width: "100%",
  height: "43px",
  boxSizing: "border-box",
  border:
    "1px solid #d5e0ec",
  borderRadius: "8px",
  padding:
    "0 14px 0 40px",
  outline: "none",
  color: "#0A2654",
  fontSize: "13px",
  background: "#ffffff",
};

const selectStyle = {
  width: "100%",
  height: "43px",
  boxSizing: "border-box",
  border:
    "1px solid #d5e0ec",
  borderRadius: "8px",
  padding: "0 12px",
  outline: "none",
  color: "#0A2654",
  fontSize: "13px",
  background: "#ffffff",
};

const sectionStyle = {
  background: "#ffffff",
  border:
    "1px solid #dce6f1",
  borderRadius: "16px",
  padding: "25px",
  marginBottom: "28px",
  boxShadow:
    "0 4px 16px rgba(10,38,84,0.04)",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginBottom: "22px",
};

const sectionTitleStyle = {
  margin: 0,
  color: "#0A2654",
  fontSize: "21px",
};

const sectionSubtitleStyle = {
  margin: "5px 0 0",
  color: "#6F8FB3",
  fontSize: "13px",
};

const requestCardStyle = {
  background: "#ffffff",
  border:
    "1px solid #dce6f1",
  borderRadius: "14px",
  padding: "22px",
  boxShadow:
    "0 3px 12px rgba(10,38,84,0.04)",
};

const loanIconStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: "#e8f0fa",
  color: "#2f73d9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  flexShrink: 0,
};

const statusBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "7px 11px",
  borderRadius: "7px",
  fontSize: "11px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

export default ApplicationRequests;