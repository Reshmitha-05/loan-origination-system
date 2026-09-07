import { useEffect, useMemo, useState } from "react";
import API_URL from "../api";
import {
  FaMoneyBillWave,
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUser,
  FaIdCard,
  FaFileInvoiceDollar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaArrowUp,
} from "react-icons/fa";

function LoanPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const [newLoan, setNewLoan] = useState({
    customerId: "",
    loanAmount: "",
    loanType: "",
    status: "Pending",
  });

  const [editingLoan, setEditingLoan] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const [customerDetails, setCustomerDetails] =
    useState(null);

  const [loadingCustomer, setLoadingCustomer] =
    useState(false);

  /* =====================================================
     FETCH LOANS
  ===================================================== */

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/loans`);

      if (!response.ok) {
        throw new Error("Failed to fetch loans");
      }

      const data = await response.json();

      setLoans(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching loans:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     ADD LOAN
  ===================================================== */

  const handleAddLoan = async () => {
    try {
      setError(null);

      if (
        !newLoan.customerId ||
        !newLoan.loanAmount ||
        !newLoan.loanType
      ) {
        setError("Please fill in all loan details.");
        return;
      }

      const response = await fetch(`${API_URL}/loans`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLoan),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add loan");
      }

      await fetchLoans();

      setNewLoan({
        customerId: "",
        loanAmount: "",
        loanType: "",
        status: "Pending",
      });

      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
      console.error("Error adding loan:", err);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this loan?"
      )
    ) {
      return;
    }

    try {
      setError(null);

      const response = await fetch(`${API_URL}/loans/${id}`, {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete loan");
      }

      await fetchLoans();
    } catch (err) {
      setError(err.message);
      console.error("Error deleting loan:", err);
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (loan) => {
    setEditingLoan({
      ...loan,
    });

    setShowEditForm(true);

    setShowAddForm(false);
  };

  /* =====================================================
     UPDATE
  ===================================================== */

  const handleUpdate = async () => {
    try {
      setError(null);

      if (
        !editingLoan.customerId ||
        !editingLoan.loanAmount ||
        !editingLoan.loanType
      ) {
        setError("Please fill in all loan details.");
        return;
      }

      const response = await fetch(`${API_URL}/loans/${editingLoan.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingLoan.id,
            customerId: editingLoan.customerId,
            loanAmount: editingLoan.loanAmount,
            loanType: editingLoan.loanType,
            status: editingLoan.status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update loan");
      }

      await fetchLoans();

      setEditingLoan(null);
      setShowEditForm(false);
    } catch (err) {
      setError(err.message);
      console.error("Error updating loan:", err);
    }
  };

  /* =====================================================
     VIEW
  ===================================================== */

  const handleView = async (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);

    setCustomerDetails(null);
    setLoadingCustomer(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/customers/${loan.customerId}`);

      if (!response.ok) {
        throw new Error(
          "Failed to fetch customer details"
        );
      }

      const customerData = await response.json();

      setCustomerDetails(customerData);
    } catch (err) {
      setError(err.message);
      console.error(
        "Error fetching customer:",
        err
      );
    } finally {
      setLoadingCustomer(false);
    }
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
    setCustomerDetails(null);
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredLoans = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return loans.filter((loan) => {
      return (
        String(loan.id || "")
          .toLowerCase()
          .includes(search) ||
        String(loan.customerId || "")
          .toLowerCase()
          .includes(search) ||
        String(loan.loanType || "")
          .toLowerCase()
          .includes(search) ||
        String(loan.status || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [loans, searchTerm]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalLoans = loans.length;

  const pendingLoans = loans.filter(
    (loan) =>
      String(loan.status).toLowerCase() ===
      "pending"
  ).length;

  const approvedLoans = loans.filter(
    (loan) =>
      String(loan.status).toLowerCase() ===
      "approved"
  ).length;

  const totalAmount = loans.reduce(
    (sum, loan) =>
      sum + Number(loan.loanAmount || 0),
    0
  );

  /* =====================================================
     STATUS
  ===================================================== */

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "approved") {
      return "loan-status approved";
    }

    if (value === "rejected") {
      return "loan-status rejected";
    }

    return "loan-status pending";
  };

  const getStatusIcon = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "approved") {
      return <FaCheckCircle />;
    }

    if (value === "rejected") {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  const getCustomerInitials = (name) => {
    if (!name) return "CU";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  /* =====================================================
     FORM
  ===================================================== */

  const LoanForm = ({
    loan,
    setLoan,
    onCancel,
    onSubmit,
    editing = false,
  }) => {
    return (
      <div className="loan-form-card">

        <div className="loan-form-header">

          <div className="loan-form-title">

            <div className="loan-form-icon">
              {editing ? (
                <FaEdit />
              ) : (
                <FaPlus />
              )}
            </div>

            <div>
              <h3>
                {editing
                  ? "Edit Loan"
                  : "Create New Loan"}
              </h3>

              <p>
                {editing
                  ? "Update the selected loan details"
                  : "Enter the details for the new loan"}
              </p>
            </div>

          </div>

          <button
            className="loan-form-close"
            onClick={onCancel}
          >
            <FaTimes />
          </button>

        </div>

        <div className="loan-form-grid">

          <div className="loan-field">

            <label>
              Customer ID
            </label>

            <div className="loan-input-wrapper">
              <FaUser />

              <input
                type="number"
                placeholder="Enter customer ID"
                value={loan.customerId}
                onChange={(e) =>
                  setLoan({
                    ...loan,
                    customerId:
                      e.target.value,
                  })
                }
              />
            </div>

          </div>

          <div className="loan-field">

            <label>
              Loan Amount
            </label>

            <div className="loan-input-wrapper">
              <FaMoneyBillWave />

              <input
                type="number"
                placeholder="Enter loan amount"
                value={loan.loanAmount}
                onChange={(e) =>
                  setLoan({
                    ...loan,
                    loanAmount:
                      e.target.value,
                  })
                }
              />
            </div>

          </div>

          <div className="loan-field">

            <label>
              Loan Type
            </label>

            <div className="loan-input-wrapper">
              <FaFileInvoiceDollar />

              <input
                type="text"
                placeholder="e.g. Personal Loan"
                value={loan.loanType}
                onChange={(e) =>
                  setLoan({
                    ...loan,
                    loanType:
                      e.target.value,
                  })
                }
              />
            </div>

          </div>

          <div className="loan-field">

            <label>
              Status
            </label>

            <select
              className="loan-select"
              value={loan.status}
              onChange={(e) =>
                setLoan({
                  ...loan,
                  status: e.target.value,
                })
              }
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>

          </div>

        </div>

        <div className="loan-form-actions">

          <button
            className="loan-cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="loan-save-btn"
            onClick={onSubmit}
          >
            <FaSave />

            {editing
              ? "Save Changes"
              : "Create Loan"}
          </button>

        </div>

      </div>
    );
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="loan-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="loan-header">

        <div className="loan-header-left">

          <div className="loan-header-icon">
            <FaFileInvoiceDollar />
          </div>

          <div>

            <div className="loan-breadcrumb">
              ADMINISTRATION
              <span>/</span>
              LOANS
            </div>

            <h1>
              Loan Management
            </h1>

            <p>
              Manage loan applications,
              amounts and approval status
            </p>

          </div>

        </div>

        <button
          className="loan-new-button"
          onClick={() => {
            setShowAddForm(true);
            setShowEditForm(false);
          }}
        >
          <FaPlus />
          New Loan
        </button>

      </div>

      {/* ===================================================
          STAT CARDS
      =================================================== */}

      <div className="loan-stats">

        <div className="loan-stat-card">

          <div className="loan-stat-icon total">
            <FaFileInvoiceDollar />
          </div>

          <div>
            <span>
              TOTAL LOANS
            </span>

            <strong>
              {totalLoans}
            </strong>

            <small>
              All loan records
            </small>
          </div>

        </div>

        <div className="loan-stat-card">

          <div className="loan-stat-icon pending">
            <FaClock />
          </div>

          <div>
            <span>
              PENDING
            </span>

            <strong>
              {pendingLoans}
            </strong>

            <small>
              Awaiting review
            </small>
          </div>

        </div>

        <div className="loan-stat-card">

          <div className="loan-stat-icon approved">
            <FaCheckCircle />
          </div>

          <div>
            <span>
              APPROVED
            </span>

            <strong>
              {approvedLoans}
            </strong>

            <small>
              Approved loans
            </small>
          </div>

        </div>

        <div className="loan-stat-card amount-card">

          <div className="loan-stat-icon amount">
            <FaMoneyBillWave />
          </div>

          <div>
            <span>
              TOTAL VALUE
            </span>

            <strong>
              ₹{formatAmount(totalAmount)}
            </strong>

            <small>
              Combined loan amount
            </small>
          </div>

        </div>

      </div>

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div className="loan-error">
          <FaTimesCircle />
          <span>{error}</span>

          <button
            onClick={() =>
              setError(null)
            }
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* ===================================================
          ADD FORM
      =================================================== */}

      {showAddForm && (
        <LoanForm
          loan={newLoan}
          setLoan={setNewLoan}
          onCancel={() => {
            setShowAddForm(false);
          }}
          onSubmit={handleAddLoan}
        />
      )}

      {/* ===================================================
          EDIT FORM
      =================================================== */}

      {showEditForm && editingLoan && (
        <LoanForm
          loan={editingLoan}
          setLoan={setEditingLoan}
          onCancel={() => {
            setShowEditForm(false);
            setEditingLoan(null);
          }}
          onSubmit={handleUpdate}
          editing
        />
      )}

      {/* ===================================================
          TABLE CARD
      =================================================== */}

      <div className="loan-content-card">

        <div className="loan-content-header">

          <div>

            <h2>
              Loan Directory
            </h2>

            <p>
              {filteredLoans.length}{" "}
              {filteredLoans.length === 1
                ? "loan"
                : "loans"}{" "}
              displayed
            </p>

          </div>

          <div className="loan-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search by ID, customer or loan type..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            {searchTerm && (
              <button
                onClick={() =>
                  setSearchTerm("")
                }
              >
                <FaTimes />
              </button>
            )}

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="loan-loading">

            <div className="loan-loading-icon">
              <FaFileInvoiceDollar />
            </div>

            <h3>
              Loading loans
            </h3>

            <p>
              Fetching loan records...
            </p>

          </div>

        ) : (

          <div className="loan-table-wrapper">

            <table className="loan-table">

              <thead>

                <tr>
                  <th>LOAN</th>
                  <th>CUSTOMER</th>
                  <th>AMOUNT</th>
                  <th>LOAN TYPE</th>
                  <th>STATUS</th>
                  <th className="loan-action-heading">
                    ACTIONS
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredLoans.length > 0 ? (

                  filteredLoans.map((loan) => (

                    <tr key={loan.id}>

                      {/* LOAN */}

                      <td>

                        <div className="loan-id-cell">

                          <div className="loan-row-icon">
                            <FaFileInvoiceDollar />
                          </div>

                          <div>

                            <strong>
                              Loan #{loan.id}
                            </strong>

                            <span>
                              Application record
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* CUSTOMER */}

                      <td>

                        <div className="loan-customer-cell">

                          <div className="loan-customer-avatar">
                            CU
                          </div>

                          <div>

                            <strong>
                              Customer #{loan.customerId}
                            </strong>

                            <span>
                              Customer ID
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* AMOUNT */}

                      <td>

                        <div className="loan-amount-cell">

                          <strong>
                            ₹
                            {formatAmount(
                              loan.loanAmount
                            )}
                          </strong>

                        </div>

                      </td>

                      {/* TYPE */}

                      <td>

                        <span className="loan-type">
                          {loan.loanType ||
                            "Not specified"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={getStatusClass(
                            loan.status
                          )}
                        >
                          {getStatusIcon(
                            loan.status
                          )}

                          {loan.status}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="loan-actions">

                          <button
                            className="loan-view-btn"
                            onClick={() =>
                              handleView(loan)
                            }
                          >
                            <FaEye />
                            View
                          </button>

                          <button
                            className="loan-edit-btn"
                            onClick={() =>
                              handleEdit(loan)
                            }
                          >
                            <FaEdit />
                            Edit
                          </button>

                          <button
                            className="loan-delete-btn"
                            onClick={() =>
                              handleDelete(
                                loan.id
                              )
                            }
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="loan-no-data"
                    >

                      <div className="loan-empty-icon">
                        <FaFileInvoiceDollar />
                      </div>

                      <strong>
                        {searchTerm
                          ? "No matching loans"
                          : "No loans found"}
                      </strong>

                      <span>
                        {searchTerm
                          ? "Try a different search term."
                          : "Loan records will appear here once they are created."}
                      </span>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ===================================================
          VIEW MODAL
      =================================================== */}

      {showModal && selectedLoan && (

        <div
          className="loan-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              handleCloseModal();
            }
          }}
        >

          <div className="loan-modal">

            {/* MODAL HEADER */}

            <div className="loan-modal-header">

              <div className="loan-modal-title">

                <div className="loan-modal-icon">
                  <FaFileInvoiceDollar />
                </div>

                <div>

                  <span>
                    LOAN RECORD
                  </span>

                  <h2>
                    Loan #{selectedLoan.id}
                  </h2>

                </div>

              </div>

              <button
                className="loan-modal-close"
                onClick={handleCloseModal}
              >
                <FaTimes />
              </button>

            </div>

            {/* STATUS */}

            <div className="loan-modal-status">

              <span>
                CURRENT STATUS
              </span>

              <span
                className={getStatusClass(
                  selectedLoan.status
                )}
              >
                {getStatusIcon(
                  selectedLoan.status
                )}

                {selectedLoan.status}
              </span>

            </div>

            {/* CUSTOMER */}

            <div className="loan-modal-section">

              <div className="loan-modal-section-title">
                <FaUser />
                CUSTOMER INFORMATION
              </div>

              {loadingCustomer ? (

                <div className="loan-customer-loading">
                  Loading customer details...
                </div>

              ) : customerDetails ? (

                <div className="loan-customer-detail">

                  <div className="loan-modal-avatar">
                    {getCustomerInitials(
                      customerDetails.name
                    )}
                  </div>

                  <div>

                    <strong>
                      {customerDetails.name}
                    </strong>

                    <span>
                      Customer ID:{" "}
                      {customerDetails.id}
                    </span>

                    {customerDetails.email && (
                      <span>
                        {customerDetails.email}
                      </span>
                    )}

                  </div>

                </div>

              ) : (

                <div className="loan-customer-not-found">
                  Customer details could not be loaded.
                </div>

              )}

            </div>

            {/* LOAN DETAILS */}

            <div className="loan-modal-section">

              <div className="loan-modal-section-title">
                <FaFileInvoiceDollar />
                LOAN INFORMATION
              </div>

              <div className="loan-detail-grid">

                <div className="loan-detail-item">

                  <span>
                    Loan ID
                  </span>

                  <strong>
                    #{selectedLoan.id}
                  </strong>

                </div>

                <div className="loan-detail-item">

                  <span>
                    Customer ID
                  </span>

                  <strong>
                    #{selectedLoan.customerId}
                  </strong>

                </div>

                <div className="loan-detail-item">

                  <span>
                    Loan Amount
                  </span>

                  <strong className="loan-modal-amount">
                    ₹
                    {formatAmount(
                      selectedLoan.loanAmount
                    )}
                  </strong>

                </div>

                <div className="loan-detail-item">

                  <span>
                    Loan Type
                  </span>

                  <strong>
                    {selectedLoan.loanType}
                  </strong>

                </div>

              </div>

            </div>

            {/* MODAL ACTION */}

            <div className="loan-modal-footer">

              <button
                className="loan-modal-close-btn"
                onClick={handleCloseModal}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================
          CSS
      =================================================== */}

      <style>{`

        /* =================================================
           PAGE
        ================================================= */

        .loan-page {
          min-height: calc(100vh - 70px);
          padding: 30px 34px 50px;
          background: #f5f7fa;
          color: #233b58;
          box-sizing: border-box;
        }

        /* =================================================
           HEADER
        ================================================= */

        .loan-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 27px;
        }

        .loan-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .loan-header-icon {
          width: 52px;
          height: 52px;
          border-radius: 13px;
          background: #e8eef5;
          color: #0a2654;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          border: 1px solid #d8e1eb;
        }

        .loan-breadcrumb {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 5px;
          color: #91a0b0;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .loan-breadcrumb span {
          color: #c1cbd5;
        }

        .loan-header h1 {
          margin: 0;
          color: #0a2654;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .loan-header p {
          margin: 5px 0 0;
          color: #78899d;
          font-size: 12px;
        }

        .loan-new-button {
          height: 40px;
          padding: 0 17px;
          border: 1px solid #0a2654;
          border-radius: 9px;
          background: #0a2654;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.16s ease;
          box-shadow: 0 4px 10px rgba(10, 38, 84, 0.12);
        }

        .loan-new-button:hover {
          background: #163b6c;
          transform: translateY(-1px);
          box-shadow: 0 7px 15px rgba(10, 38, 84, 0.17);
        }

        /* =================================================
           STATS
        ================================================= */

        .loan-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 23px;
        }

        .loan-stat-card {
          min-height: 92px;
          padding: 17px 18px;
          display: flex;
          align-items: center;
          gap: 13px;
          background: #ffffff;
          border: 1px solid #e1e7ee;
          border-radius: 13px;
          box-shadow: 0 4px 15px rgba(25, 50, 80, 0.035);
          box-sizing: border-box;
        }

        .loan-stat-icon {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }

        .loan-stat-icon.total {
          color: #0a2654;
          background: #e9eef4;
        }

        .loan-stat-icon.pending {
          color: #55708e;
          background: #edf2f6;
        }

        .loan-stat-icon.approved {
          color: #355e84;
          background: #e8f0f6;
        }

        .loan-stat-icon.amount {
          color: #6b7180;
          background: #f0f1f3;
        }

        .loan-stat-card span {
          display: block;
          color: #95a2b0;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.9px;
          margin-bottom: 5px;
        }

        .loan-stat-card strong {
          display: block;
          color: #17385e;
          font-size: 20px;
          font-weight: 800;
          line-height: 1.1;
        }

        .loan-stat-card small {
          display: block;
          color: #9aa7b5;
          font-size: 9px;
          margin-top: 4px;
        }

        /* =================================================
           ERROR
        ================================================= */

        .loan-error {
          margin-bottom: 18px;
          padding: 11px 13px;
          border-radius: 9px;
          background: #f1f4f7;
          border: 1px solid #dce3e9;
          color: #617387;
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 10px;
        }

        .loan-error > svg {
          color: #73879b;
        }

        .loan-error button {
          margin-left: auto;
          border: none;
          background: transparent;
          color: #8393a3;
          cursor: pointer;
        }

        /* =================================================
           FORM
        ================================================= */

        .loan-form-card {
          margin-bottom: 22px;
          background: #ffffff;
          border: 1px solid #dfe6ed;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(25, 50, 80, 0.05);
        }

        .loan-form-header {
          padding: 18px 21px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e7ecf1;
          background: #fafbfd;
        }

        .loan-form-title {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .loan-form-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #e8eef5;
          color: #0a2654;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }

        .loan-form-title h3 {
          margin: 0 0 3px;
          color: #17385e;
          font-size: 14px;
          font-weight: 800;
        }

        .loan-form-title p {
          margin: 0;
          color: #8c9aaa;
          font-size: 10px;
        }

        .loan-form-close {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          border: 1px solid #dde5ec;
          background: #ffffff;
          color: #77899c;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .loan-form-grid {
          padding: 20px 21px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 17px;
        }

        .loan-field label {
          display: block;
          margin-bottom: 7px;
          color: #50677f;
          font-size: 10px;
          font-weight: 800;
        }

        .loan-input-wrapper {
          height: 39px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          box-sizing: border-box;
          border: 1px solid #d8e1e9;
          border-radius: 8px;
          background: #fbfcfd;
        }

        .loan-input-wrapper:focus-within {
          background: white;
          border-color: #8ba5bf;
          box-shadow: 0 0 0 3px #eef3f7;
        }

        .loan-input-wrapper svg {
          color: #8397ab;
          font-size: 11px;
        }

        .loan-input-wrapper input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #294763;
          font-size: 11px;
        }

        .loan-input-wrapper input::placeholder {
          color: #a3afbb;
        }

        .loan-select {
          width: 100%;
          height: 39px;
          padding: 0 10px;
          border: 1px solid #d8e1e9;
          border-radius: 8px;
          outline: none;
          background: #fbfcfd;
          color: #294763;
          font-size: 11px;
        }

        .loan-form-actions {
          padding: 14px 21px 17px;
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          border-top: 1px solid #e8edf2;
        }

        .loan-cancel-btn,
        .loan-save-btn {
          height: 36px;
          padding: 0 14px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .loan-cancel-btn {
          color: #65788b;
          background: white;
          border: 1px solid #d7e0e8;
        }

        .loan-save-btn {
          color: white;
          background: #0a2654;
          border: 1px solid #0a2654;
        }

        .loan-save-btn:hover {
          background: #163b6c;
        }

        /* =================================================
           CONTENT
        ================================================= */

        .loan-content-card {
          background: #ffffff;
          border: 1px solid #e0e6ed;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 5px 18px rgba(25, 50, 80, 0.035);
        }

        .loan-content-header {
          padding: 18px 21px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #e6ebf0;
        }

        .loan-content-header h2 {
          margin: 0 0 4px;
          color: #17385e;
          font-size: 15px;
          font-weight: 800;
        }

        .loan-content-header p {
          margin: 0;
          color: #96a3b1;
          font-size: 10px;
        }

        /* =================================================
           SEARCH
        ================================================= */

        .loan-search {
          width: 290px;
          height: 37px;
          padding: 0 11px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-sizing: border-box;
          background: #f8fafc;
          border: 1px solid #dbe3ea;
          border-radius: 8px;
        }

        .loan-search > svg {
          color: #8396a9;
          font-size: 12px;
        }

        .loan-search input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #294763;
          font-size: 10px;
        }

        .loan-search input::placeholder {
          color: #a0adba;
        }

        .loan-search button {
          border: none;
          background: transparent;
          color: #8999a9;
          cursor: pointer;
          display: flex;
        }

        .loan-search:focus-within {
          background: white;
          border-color: #8ba5bf;
          box-shadow: 0 0 0 3px #eef3f7;
        }

        /* =================================================
           TABLE
        ================================================= */

        .loan-table-wrapper {
          overflow-x: auto;
        }

        .loan-table {
          width: 100%;
          min-width: 950px;
          border-collapse: collapse;
        }

        .loan-table thead {
          background: #f8fafc;
        }

        .loan-table th {
          padding: 12px 19px;
          text-align: left;
          color: #8796a6;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.9px;
          border-bottom: 1px solid #e6ebf0;
          white-space: nowrap;
        }

        .loan-table td {
          padding: 15px 19px;
          border-bottom: 1px solid #edf1f4;
          vertical-align: middle;
        }

        .loan-table tbody tr {
          transition: background 0.15s ease;
        }

        .loan-table tbody tr:hover {
          background: #fafbfd;
        }

        .loan-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* =================================================
           LOAN ID
        ================================================= */

        .loan-id-cell,
        .loan-customer-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .loan-row-icon {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border-radius: 9px;
          background: #edf1f5;
          color: #506b87;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .loan-id-cell > div:last-child,
        .loan-customer-cell > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .loan-id-cell strong {
          color: #174475;
          font-size: 11px;
          font-weight: 800;
        }

        .loan-id-cell span,
        .loan-customer-cell span {
          color: #9aa7b4;
          font-size: 9px;
        }

        /* =================================================
           CUSTOMER
        ================================================= */

        .loan-customer-avatar {
          width: 33px;
          height: 33px;
          border-radius: 50%;
          background: #e9eef4;
          color: #3e5d7d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 800;
        }

        .loan-customer-cell strong {
          color: #0754a5;
          font-size: 11px;
          font-weight: 800;
        }

        /* =================================================
           AMOUNT
        ================================================= */

        .loan-amount-cell strong {
          color: #203f60;
          font-size: 12px;
          font-weight: 800;
        }

        /* =================================================
           TYPE
        ================================================= */

        .loan-type {
          color: #526a82;
          font-size: 10px;
          font-weight: 700;
        }

        /* =================================================
           STATUS
        ================================================= */

        .loan-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border-radius: 20px;
          font-size: 8px;
          font-weight: 800;
          white-space: nowrap;
        }

        .loan-status svg {
          font-size: 8px;
        }

        .loan-status.pending {
          color: #5c7187;
          background: #eef2f5;
          border: 1px solid #dfe6ec;
        }

        .loan-status.approved {
          color: #365e82;
          background: #e9f0f5;
          border: 1px solid #d9e4ec;
        }

        .loan-status.rejected {
          color: #6e7d8d;
          background: #f0f2f4;
          border: 1px solid #e2e6e9;
        }

        /* =================================================
           ACTIONS
        ================================================= */

        .loan-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .loan-actions button {
          height: 30px;
          border-radius: 7px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .loan-view-btn {
          padding: 0 9px;
          color: #42647f;
          background: #edf3f7;
          border: 1px solid #dbe5ec;
        }

        .loan-view-btn:hover {
          background: #dfe9f0;
          color: #294f70;
        }

        .loan-edit-btn {
          padding: 0 9px;
          color: #ffffff;
          background: #45647f;
          border: 1px solid #45647f;
        }

        .loan-edit-btn:hover {
          background: #344f69;
          border-color: #344f69;
          transform: translateY(-1px);
        }

        .loan-delete-btn {
          width: 30px;
          color: #738292;
          background: #f1f3f5;
          border: 1px solid #dfe4e8;
        }

        .loan-delete-btn:hover {
          color: #ffffff;
          background: #7c6b6b;
          border-color: #7c6b6b;
        }

        /* =================================================
           LOADING
        ================================================= */

        .loan-loading {
          padding: 70px 20px;
          text-align: center;
        }

        .loan-loading-icon {
          width: 54px;
          height: 54px;
          margin: 0 auto 13px;
          border-radius: 14px;
          background: #edf1f5;
          color: #71869b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
        }

        .loan-loading h3 {
          margin: 0 0 5px;
          color: #3b5772;
          font-size: 14px;
        }

        .loan-loading p {
          margin: 0;
          color: #9aa7b4;
          font-size: 10px;
        }

        /* =================================================
           EMPTY
        ================================================= */

        .loan-no-data {
          padding: 65px 20px !important;
          text-align: center !important;
        }

        .loan-empty-icon {
          width: 54px;
          height: 54px;
          margin: 0 auto 12px;
          border-radius: 14px;
          background: #edf1f5;
          color: #8293a4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .loan-no-data strong {
          display: block;
          color: #48627b;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .loan-no-data span {
          color: #9aa7b4;
          font-size: 10px;
        }

        /* =================================================
           MODAL
        ================================================= */

        .loan-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          background: rgba(10, 27, 47, 0.52);
          backdrop-filter: blur(4px);
        }

        .loan-modal {
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 15px;
          border: 1px solid #dce4eb;
          box-shadow: 0 25px 70px rgba(9, 29, 52, 0.22);
        }

        .loan-modal-header {
          padding: 20px 22px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #e5ebf0;
        }

        .loan-modal-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .loan-modal-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #e8eef4;
          color: #0a2654;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
        }

        .loan-modal-title span {
          display: block;
          color: #94a1ae;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .loan-modal-title h2 {
          margin: 0;
          color: #17385e;
          font-size: 18px;
          font-weight: 800;
        }

        .loan-modal-close {
          width: 31px;
          height: 31px;
          border-radius: 8px;
          border: 1px solid #dfe6ec;
          background: #f7f9fb;
          color: #74879a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .loan-modal-close:hover {
          background: #edf2f6;
        }

        /* =================================================
           MODAL STATUS
        ================================================= */

        .loan-modal-status {
          padding: 12px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafb;
          border-bottom: 1px solid #e7edf2;
        }

        .loan-modal-status > span:first-child {
          color: #91a0ae;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.9px;
        }

        /* =================================================
           MODAL SECTIONS
        ================================================= */

        .loan-modal-section {
          padding: 19px 22px 0;
        }

        .loan-modal-section-title {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 11px;
          color: #73889e;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .loan-modal-section-title svg {
          color: #55718e;
          font-size: 10px;
        }

        .loan-customer-detail {
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 11px;
          background: #f8fafb;
          border: 1px solid #e2e8ed;
          border-radius: 9px;
        }

        .loan-modal-avatar {
          width: 39px;
          height: 39px;
          border-radius: 50%;
          background: #e9eef4;
          color: #3f607f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
        }

        .loan-customer-detail > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .loan-customer-detail strong {
          color: #1b4166;
          font-size: 12px;
          font-weight: 800;
        }

        .loan-customer-detail span {
          color: #8998a7;
          font-size: 9px;
        }

        .loan-customer-loading,
        .loan-customer-not-found {
          padding: 17px;
          text-align: center;
          border-radius: 9px;
          background: #f8fafb;
          border: 1px solid #e2e8ed;
          color: #8494a4;
          font-size: 10px;
        }

        .loan-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border: 1px solid #e2e8ed;
          border-radius: 9px;
          overflow: hidden;
        }

        .loan-detail-item {
          padding: 13px;
          background: #fbfcfd;
          border-bottom: 1px solid #e7ecf1;
        }

        .loan-detail-item:nth-child(odd) {
          border-right: 1px solid #e7ecf1;
        }

        .loan-detail-item:nth-child(3),
        .loan-detail-item:nth-child(4) {
          border-bottom: none;
        }

        .loan-detail-item span {
          display: block;
          margin-bottom: 5px;
          color: #95a2af;
          font-size: 9px;
          font-weight: 700;
        }

        .loan-detail-item strong {
          color: #244765;
          font-size: 11px;
          font-weight: 800;
        }

        .loan-modal-amount {
          color: #355e82 !important;
          font-size: 13px !important;
        }

        /* =================================================
           MODAL FOOTER
        ================================================= */

        .loan-modal-footer {
          margin-top: 21px;
          padding: 16px 22px 20px;
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid #e6ebf0;
        }

        .loan-modal-close-btn {
          height: 35px;
          padding: 0 15px;
          border-radius: 8px;
          border: 1px solid #d5dfe7;
          background: #ffffff;
          color: #64788c;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .loan-modal-close-btn:hover {
          background: #f3f6f8;
        }

        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 1100px) {

          .loan-stats {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 800px) {

          .loan-page {
            padding: 23px 18px 40px;
          }

          .loan-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .loan-new-button {
            align-self: flex-start;
          }

          .loan-content-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .loan-search {
            width: 100%;
          }

        }

        @media (max-width: 600px) {

          .loan-stats {
            grid-template-columns: 1fr;
          }

          .loan-form-grid {
            grid-template-columns: 1fr;
          }

          .loan-detail-grid {
            grid-template-columns: 1fr;
          }

          .loan-detail-item:nth-child(odd) {
            border-right: none;
          }

          .loan-detail-item:nth-child(3) {
            border-bottom: 1px solid #e7ecf1;
          }

        }

      `}</style>

    </div>
  );
}

export default LoanPage;