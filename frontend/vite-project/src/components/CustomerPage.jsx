import { useEffect, useState } from "react";
import API_URL from "../api";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaUserCheck,
  FaUser,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";


function CustomerPage() {

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phoneNumber: ""
  });

  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [showEditForm, setShowEditForm] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [validationErrors, setValidationErrors] =
    useState({});


  // ==========================================
  // FETCH CUSTOMERS
  // ==========================================

  useEffect(() => {

    fetchCustomers();

  }, []);


  const fetchCustomers = async () => {

    try {

      setLoading(true);

      setError(null);

     const response = await fetch(
  `${API_URL}/customers`
);


      if (!response.ok) {

        throw new Error(
          "Failed to fetch customers"
        );

      }


      const data = await response.json();

      setCustomers(data);

    } catch (err) {

      setError(err.message);

      console.error(
        "Error fetching customers:",
        err
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // VALIDATION
  // ==========================================

  const validateCustomer = (customer) => {

    const errors = {};


    if (!customer?.name?.trim()) {

      errors.name =
        "Customer name is required";

    }


    if (!customer?.email?.trim()) {

      errors.email =
        "Email address is required";

    } else if (
      !/\S+@\S+\.\S+/.test(
        customer.email
      )
    ) {

      errors.email =
        "Enter a valid email address";

    }


    if (!customer?.phoneNumber?.trim()) {

      errors.phoneNumber =
        "Phone number is required";

    } else if (
      !/^\d{10}$/.test(
        customer.phoneNumber
      )
    ) {

      errors.phoneNumber =
        "Enter a valid 10-digit number";

    }


    return errors;

  };


  // ==========================================
  // ADD CUSTOMER
  // ==========================================

  const handleAddCustomer = async () => {

    const errors =
      validateCustomer(newCustomer);


    if (Object.keys(errors).length > 0) {

      setValidationErrors(errors);

      return;

    }


    try {

      setError(null);


      const response = await fetch(
  `${API_URL}/customers`,
  {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              newCustomer
            )
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to add customer"
        );

      }


      await fetchCustomers();


      setNewCustomer({
        name: "",
        email: "",
        phoneNumber: ""
      });


      setValidationErrors({});

      setShowAddForm(false);

    } catch (err) {

      setError(err.message);

      console.error(
        "Error adding customer:",
        err
      );

    }

  };


  // ==========================================
  // DELETE CUSTOMER
  // ==========================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this customer?"
      );


    if (!confirmed) {

      return;

    }


    try {

      setError(null);


      const response = await fetch(
  `${API_URL}/customers/${id}`,
  {
          method: "DELETE"
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to delete customer"
        );

      }


      await fetchCustomers();

    } catch (err) {

      setError(err.message);

      console.error(
        "Error deleting customer:",
        err
      );

    }

  };


  // ==========================================
  // EDIT CUSTOMER
  // ==========================================

  const handleEdit = (customer) => {

    setEditingCustomer({
      ...customer
    });

    setValidationErrors({});

    setShowEditForm(true);

  };


  // ==========================================
  // UPDATE CUSTOMER
  // ==========================================

  const handleUpdate = async () => {

    const errors =
      validateCustomer(
        editingCustomer
      );


    if (Object.keys(errors).length > 0) {

      setValidationErrors(errors);

      return;

    }


    try {

      setError(null);


      const response = await fetch(
  `${API_URL}/customers/${editingCustomer.id}`,
  {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            id:
              editingCustomer.id,

            name:
              editingCustomer.name,

            email:
              editingCustomer.email,

            phoneNumber:
              editingCustomer.phoneNumber
          })
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to update customer"
        );

      }


      await fetchCustomers();


      setEditingCustomer(null);

      setValidationErrors({});

      setShowEditForm(false);

    } catch (err) {

      setError(err.message);

      console.error(
        "Error updating customer:",
        err
      );

    }

  };


  // ==========================================
  // VIEW CUSTOMER
  // ==========================================

  const handleView = (customer) => {

    setSelectedCustomer(customer);

    setShowModal(true);

  };


  const closeModal = () => {

    setSelectedCustomer(null);

    setShowModal(false);

  };


  // ==========================================
  // FILTER
  // ==========================================

  const filteredCustomers =
    customers.filter(
      (customer) => {

        const search =
          searchTerm
            .toLowerCase()
            .trim();


        return (

          customer.name
            ?.toLowerCase()
            .includes(search)

          ||

          customer.email
            ?.toLowerCase()
            .includes(search)

          ||

          customer.phoneNumber
            ?.toLowerCase()
            .includes(search)

        );

      }
    );


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalCustomers =
    customers.length;


  const activeCustomers =
    customers.filter(
      customer =>
        customer.status !== "Inactive"
    ).length;


  const inactiveCustomers =
    customers.filter(
      customer =>
        customer.status === "Inactive"
    ).length;


  // ==========================================
  // INITIALS
  // ==========================================

  const getInitials = (name) => {

    if (!name) {

      return "?";

    }


    const parts =
      name.trim().split(/\s+/);


    if (parts.length === 1) {

      return parts[0]
        .charAt(0)
        .toUpperCase();

    }


    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();

  };


  // ==========================================
  // FORM
  // ==========================================

  const CustomerForm = ({
    editing = false
  }) => {

    const customer =
      editing
        ? editingCustomer
        : newCustomer;


    const setCustomer =
      editing
        ? setEditingCustomer
        : setNewCustomer;


    const closeForm = () => {

      setValidationErrors({});

      if (editing) {

        setEditingCustomer(null);

        setShowEditForm(false);

      } else {

        setShowAddForm(false);

      }

    };


    return (

      <div className="customer-form-panel">


        <div className="form-panel-top">

          <div className="form-panel-heading">

            <div className="form-panel-icon">

              {editing
                ? <FaEdit />
                : <FaUserPlus />}

            </div>


            <div>

              <h2>
                {editing
                  ? "Edit Customer"
                  : "Add New Customer"}
              </h2>

              <p>
                {editing
                  ? "Update the customer's account information."
                  : "Create a new customer profile in the system."}
              </p>

            </div>

          </div>


          <button
            className="form-close"
            onClick={closeForm}
          >

            <FaTimes />

          </button>

        </div>


        <div className="form-fields">


          {/* NAME */}

          <div className="form-field">

            <label>
              Customer Name
            </label>

            <div
              className={
                validationErrors.name
                  ? "form-input has-error"
                  : "form-input"
              }
            >

              <FaUser />

              <input
                type="text"
                placeholder="Enter full name"
                value={
                  customer?.name || ""
                }
                onChange={(e) => {

                  setCustomer({
                    ...customer,
                    name:
                      e.target.value
                  });

                  setValidationErrors({
                    ...validationErrors,
                    name: ""
                  });

                }}
              />

            </div>


            {validationErrors.name && (

              <small className="validation-error">

                {validationErrors.name}

              </small>

            )}

          </div>


          {/* EMAIL */}

          <div className="form-field">

            <label>
              Email Address
            </label>

            <div
              className={
                validationErrors.email
                  ? "form-input has-error"
                  : "form-input"
              }
            >

              <FaEnvelope />

              <input
                type="email"
                placeholder="customer@example.com"
                value={
                  customer?.email || ""
                }
                onChange={(e) => {

                  setCustomer({
                    ...customer,
                    email:
                      e.target.value
                  });

                  setValidationErrors({
                    ...validationErrors,
                    email: ""
                  });

                }}
              />

            </div>


            {validationErrors.email && (

              <small className="validation-error">

                {validationErrors.email}

              </small>

            )}

          </div>


          {/* PHONE */}

          <div className="form-field">

            <label>
              Phone Number
            </label>

            <div
              className={
                validationErrors.phoneNumber
                  ? "form-input has-error"
                  : "form-input"
              }
            >

              <FaPhone />

              <input
                type="text"
                inputMode="numeric"
                maxLength="10"
                placeholder="10 digit phone number"
                value={
                  customer?.phoneNumber ||
                  ""
                }
                onChange={(e) => {

                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setCustomer({
                    ...customer,
                    phoneNumber:
                      value
                  });

                  setValidationErrors({
                    ...validationErrors,
                    phoneNumber: ""
                  });

                }}
              />

            </div>


            {validationErrors.phoneNumber && (

              <small className="validation-error">

                {
                  validationErrors.phoneNumber
                }

              </small>

            )}

          </div>

        </div>


        <div className="form-panel-footer">

          <button
            className="cancel-form-button"
            onClick={closeForm}
          >
            Cancel
          </button>


          <button
            className="save-form-button"
            onClick={
              editing
                ? handleUpdate
                : handleAddCustomer
            }
          >

            <FaSave />

            {editing
              ? "Save Changes"
              : "Add Customer"}

          </button>

        </div>

      </div>

    );

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="customer-management-page">


      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="customer-page-header">

        <div className="customer-header-left">

          <div className="customer-header-icon">

            <FaUsers />

          </div>


          <div>

            <div className="customer-breadcrumb">

              MANAGEMENT

            </div>

            <h1>
              Customer Management
            </h1>

            <p>
              Manage customer profiles, contact information
              and account records.
            </p>

          </div>

        </div>


        <button
          className="add-customer-button"
          onClick={() => {

            setValidationErrors({});

            setShowAddForm(true);

          }}
        >

          <FaUserPlus />

          Add Customer

        </button>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="customer-alert">

          <FaExclamationCircle />

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              setError(null)
            }
          >

            <FaTimes />

          </button>

        </div>

      )}


      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="customer-statistics">


        <div className="customer-stat">

          <div className="customer-stat-icon total-icon">

            <FaUsers />

          </div>


          <div className="customer-stat-content">

            <span>
              TOTAL CUSTOMERS
            </span>

            <strong>
              {totalCustomers}
            </strong>

            <small>
              All registered customers
            </small>

          </div>

        </div>


        <div className="customer-stat">

          <div className="customer-stat-icon active-icon">

            <FaUserCheck />

          </div>


          <div className="customer-stat-content">

            <span>
              ACTIVE CUSTOMERS
            </span>

            <strong>
              {activeCustomers}
            </strong>

            <small>
              Currently active accounts
            </small>

          </div>

        </div>


        <div className="customer-stat">

          <div className="customer-stat-icon inactive-icon">

            <FaUser />

          </div>


          <div className="customer-stat-content">

            <span>
              INACTIVE CUSTOMERS
            </span>

            <strong>
              {inactiveCustomers}
            </strong>

            <small>
              Currently inactive accounts
            </small>

          </div>

        </div>

      </div>


      {/* ======================================
          FORM
      ====================================== */}

      {showAddForm && (
        <CustomerForm />
      )}


      {showEditForm &&
        editingCustomer && (
          <CustomerForm
            editing={true}
          />
        )
      }


      {/* ======================================
          CUSTOMER DIRECTORY
      ====================================== */}

      <div className="customer-directory">


        <div className="directory-header">

          <div className="directory-title">

            <div className="directory-title-icon">

              <FaIdCard />

            </div>


            <div>

              <h2>
                Customer Directory
              </h2>

              <p>
                {filteredCustomers.length}
                {" "}
                of{" "}
                {customers.length}
                {" "}
                customer records
              </p>

            </div>

          </div>


          <div className="directory-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
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


        {/* ====================================
            TABLE
        ==================================== */}

        {loading ? (

          <div className="customer-loading">

            <div className="loading-icon">

              <FaUsers />

            </div>

            <h3>
              Loading customer records
            </h3>

            <p>
              Please wait while we retrieve the data.
            </p>

          </div>

        ) : (

          <div className="customer-table-container">

            <table className="customer-table">

              <thead>

                <tr>

                  <th className="customer-column">
                    CUSTOMER
                  </th>

                  <th>
                    EMAIL ADDRESS
                  </th>

                  <th>
                    PHONE NUMBER
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th className="actions-column">
                    ACTIONS
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredCustomers.length > 0 ? (

                  filteredCustomers.map(
                    (customer) => (

                      <tr
                        key={
                          customer.id
                        }
                      >


                        {/* CUSTOMER */}

                        <td>

                          <div className="customer-profile-cell">

                            <div className="customer-avatar">

                              {getInitials(
                                customer.name
                              )}

                            </div>


                            <div className="customer-name-block">

                              <strong>
                                {customer.name}
                              </strong>

                              <span>
                                Customer ID #
                                {customer.id}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td>

                          <div className="table-contact">

                            <div className="table-contact-icon email-icon">

                              <FaEnvelope />

                            </div>


                            <span>
                              {customer.email}
                            </span>

                          </div>

                        </td>


                        {/* PHONE */}

                        <td>

                          <div className="table-contact">

                            <div className="table-contact-icon phone-icon">

                              <FaPhone />

                            </div>


                            <span>
                              {
                                customer.phoneNumber
                              }
                            </span>

                          </div>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              customer.status ===
                                "Inactive"
                                ? "customer-status status-inactive"
                                : "customer-status status-active"
                            }
                          >

                            <span className="status-dot"></span>

                            {
                              customer.status ||
                              "Active"
                            }

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="customer-action-buttons">


                            <button
                              className="view-button"
                              onClick={() =>
                                handleView(
                                  customer
                                )
                              }
                              title="View customer"
                            >

                              <FaEye />

                              <span>
                                View
                              </span>

                            </button>


                            <button
                              className="edit-button"
                              onClick={() =>
                                handleEdit(
                                  customer
                                )
                              }
                              title="Edit customer"
                            >

                              <FaEdit />

                              <span>
                                Edit
                              </span>

                            </button>


                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDelete(
                                  customer.id
                                )
                              }
                              title="Delete customer"
                            >

                              <FaTrash />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-customer-state"
                    >

                      <div className="empty-icon">

                        <FaUsers />

                      </div>

                      <h3>
                        No customers found
                      </h3>

                      <p>
                        {searchTerm
                          ? "Try searching with a different name, email or phone number."
                          : "There are no customer records available."}
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ======================================
          CUSTOMER DETAILS MODAL
      ====================================== */}

      {showModal &&
        selectedCustomer && (

        <div
          className="customer-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="customer-details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="details-modal-header">

              <div className="details-customer">

                <div className="details-avatar">

                  {getInitials(
                    selectedCustomer.name
                  )}

                </div>


                <div>

                  <span>
                    CUSTOMER PROFILE
                  </span>

                  <h2>
                    {selectedCustomer.name}
                  </h2>

                  <small>
                    Customer ID #
                    {selectedCustomer.id}
                  </small>

                </div>

              </div>


              <button
                className="modal-close-button"
                onClick={closeModal}
              >

                <FaTimes />

              </button>

            </div>


            {/* STATUS */}

            <div className="details-status-bar">

              <span>
                Account Status
              </span>


              <span
                className={
                  selectedCustomer.status ===
                    "Inactive"
                    ? "customer-status status-inactive"
                    : "customer-status status-active"
                }
              >

                <span className="status-dot"></span>

                {
                  selectedCustomer.status ||
                  "Active"
                }

              </span>

            </div>


            {/* DETAILS */}

            <div className="details-content">

              <div className="details-section-title">

                <span>
                  ACCOUNT INFORMATION
                </span>

              </div>


              <div className="details-grid">


                <div className="detail-box">

                  <div className="detail-box-icon">

                    <FaIdCard />

                  </div>

                  <div>

                    <span>
                      Customer ID
                    </span>

                    <strong>
                      #{selectedCustomer.id}
                    </strong>

                  </div>

                </div>


                <div className="detail-box">

                  <div className="detail-box-icon">

                    <FaUser />

                  </div>

                  <div>

                    <span>
                      Full Name
                    </span>

                    <strong>
                      {
                        selectedCustomer.name
                      }
                    </strong>

                  </div>

                </div>


                <div className="detail-box">

                  <div className="detail-box-icon">

                    <FaEnvelope />

                  </div>

                  <div>

                    <span>
                      Email Address
                    </span>

                    <strong>
                      {
                        selectedCustomer.email
                      }
                    </strong>

                  </div>

                </div>


                <div className="detail-box">

                  <div className="detail-box-icon">

                    <FaPhone />

                  </div>

                  <div>

                    <span>
                      Phone Number
                    </span>

                    <strong>
                      {
                        selectedCustomer.phoneNumber
                      }
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* FOOTER */}

            <div className="details-modal-footer">

              <button
                className="details-edit-button"
                onClick={() => {

                  closeModal();

                  handleEdit(
                    selectedCustomer
                  );

                }}
              >

                <FaEdit />

                Edit Customer

              </button>


              <button
                className="details-close-button"
                onClick={closeModal}
              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================
          CSS
      ====================================== */}

      <style>{`

        /* =====================================
           PAGE
        ===================================== */

        .customer-management-page {

          min-height: calc(100vh - 70px);

          padding: 24px 28px 42px;

          box-sizing: border-box;

          background: #f4f7fb;

          color: #0a2654;

        }


        /* =====================================
           HEADER
        ===================================== */

        .customer-page-header {

          background:
            linear-gradient(
              120deg,
              #ffffff 0%,
              #f8fbff 100%
            );

          border: 1px solid #dce6f0;

          border-radius: 16px;

          min-height: 88px;

          padding: 18px 22px;

          box-sizing: border-box;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          box-shadow:
            0 5px 18px
            rgba(15,45,85,0.055);

          margin-bottom: 17px;

        }


        .customer-header-left {

          display: flex;

          align-items: center;

          gap: 15px;

        }


        .customer-header-icon {

          width: 54px;

          height: 54px;

          border-radius: 13px;

          background: #e8f2ff;

          color: #0a4ea3;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 24px;

          flex-shrink: 0;

        }


        .customer-breadcrumb {

          color: #4680bd;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1.2px;

          margin-bottom: 3px;

        }


        .customer-page-header h1 {

          margin: 0;

          color: #062a61;

          font-size: 27px;

          line-height: 1.1;

          font-weight: 800;

          letter-spacing: -0.4px;

        }


        .customer-page-header p {

          margin: 5px 0 0;

          color: #607995;

          font-size: 11px;

        }


        .add-customer-button {

          height: 43px;

          padding: 0 18px;

          border: none;

          border-radius: 8px;

          background: #0a2e67;

          color: #ffffff;

          font-size: 11px;

          font-weight: 700;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          cursor: pointer;

          box-shadow:
            0 4px 10px
            rgba(10,46,103,0.18);

          transition:
            background 0.18s ease,
            transform 0.18s ease;

        }


        .add-customer-button:hover {

          background: #0b438f;

          transform: translateY(-1px);

        }


        /* =====================================
           ALERT
        ===================================== */

        .customer-alert {

          display: flex;

          align-items: center;

          gap: 9px;

          padding: 10px 13px;

          margin-bottom: 15px;

          border-radius: 8px;

          border: 1px solid #cbdcf0;

          background: #edf5ff;

          color: #174f8e;

          font-size: 10px;

        }


        .customer-alert svg {

          color: #2563a8;

        }


        .customer-alert button {

          margin-left: auto;

          border: none;

          background: transparent;

          color: #68819e;

          cursor: pointer;

        }


        /* =====================================
           STATISTICS
        ===================================== */

        .customer-statistics {

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 13px;

          margin-bottom: 17px;

        }


        .customer-stat {

          min-height: 92px;

          background: #ffffff;

          border: 1px solid #dfe7f0;

          border-radius: 12px;

          padding: 15px 17px;

          box-sizing: border-box;

          display: flex;

          align-items: center;

          gap: 13px;

          box-shadow:
            0 3px 12px
            rgba(15,45,85,0.035);

        }


        .customer-stat-icon {

          width: 43px;

          height: 43px;

          border-radius: 11px;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 18px;

          flex-shrink: 0;

        }


        .total-icon {

          background: #e8f2ff;

          color: #0a4ea3;

        }


        .active-icon {

          background: #edf5ff;

          color: #1469d7;

        }


        .inactive-icon {

          background: #eaf2fb;

          color: #526f94;

        }


        .customer-stat-content span {

          display: block;

          color: #7187a0;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 0.7px;

          margin-bottom: 4px;

        }


        .customer-stat-content strong {

          display: block;

          color: #062a61;

          font-size: 24px;

          line-height: 1;

          font-weight: 800;

        }


        .customer-stat-content small {

          display: block;

          color: #8a9bad;

          font-size: 8px;

          margin-top: 4px;

        }


        /* =====================================
           FORM PANEL
        ===================================== */

        .customer-form-panel {

          background: #ffffff;

          border: 1px solid #d9e4ef;

          border-radius: 13px;

          margin-bottom: 17px;

          box-shadow:
            0 5px 18px
            rgba(15,45,85,0.06);

          overflow: hidden;

        }


        .form-panel-top {

          padding: 16px 19px;

          border-bottom: 1px solid #e5ebf2;

          display: flex;

          align-items: center;

          justify-content: space-between;

        }


        .form-panel-heading {

          display: flex;

          align-items: center;

          gap: 11px;

        }


        .form-panel-icon {

          width: 38px;

          height: 38px;

          border-radius: 9px;

          background: #e8f2ff;

          color: #1469d7;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 15px;

        }


        .form-panel-heading h2 {

          margin: 0;

          color: #082d64;

          font-size: 15px;

          font-weight: 800;

        }


        .form-panel-heading p {

          margin: 3px 0 0;

          color: #8293a7;

          font-size: 9px;

        }


        .form-close {

          width: 31px;

          height: 31px;

          border: none;

          border-radius: 7px;

          background: #eef3f8;

          color: #63778e;

          display: flex;

          align-items: center;

          justify-content: center;

          cursor: pointer;

        }


        .form-fields {

          padding: 17px 19px;

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 14px;

        }


        .form-field label {

          display: block;

          margin-bottom: 6px;

          color: #294a6e;

          font-size: 9px;

          font-weight: 800;

        }


        .form-input {

          height: 42px;

          box-sizing: border-box;

          border: 1px solid #cbd8e6;

          border-radius: 8px;

          display: flex;

          align-items: center;

          gap: 9px;

          padding: 0 11px;

          background: #ffffff;

        }


        .form-input:focus-within {

          border-color: #3981d8;

          box-shadow:
            0 0 0 3px
            rgba(57,129,216,0.08);

        }


        .form-input.has-error {

          border-color: #dc6b76;

        }


        .form-input svg {

          color: #68829e;

          font-size: 12px;

        }


        .form-input input {

          width: 100%;

          height: 100%;

          border: none;

          outline: none;

          background: transparent;

          color: #173b66;

          font-size: 11px;

        }


        .validation-error {

          display: block;

          color: #c54855;

          margin-top: 4px;

          font-size: 8px;

        }


        .form-panel-footer {

          padding: 13px 19px;

          border-top: 1px solid #e6edf3;

          background: #fbfcfe;

          display: flex;

          justify-content: flex-end;

          gap: 8px;

        }


        .cancel-form-button,
        .save-form-button {

          height: 37px;

          border: none;

          border-radius: 7px;

          padding: 0 15px;

          font-size: 9px;

          font-weight: 700;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          cursor: pointer;

        }


        .cancel-form-button {

          background: #e8eef5;

          color: #526b86;

        }


        .save-form-button {

          background: #0a2e67;

          color: white;

        }


        .save-form-button:hover {

          background: #0b438f;

        }


        /* =====================================
           DIRECTORY
        ===================================== */

        .customer-directory {

          background: #ffffff;

          border: 1px solid #dce6ef;

          border-radius: 13px;

          overflow: hidden;

          box-shadow:
            0 5px 18px
            rgba(15,45,85,0.045);

        }


        .directory-header {

          min-height: 70px;

          padding: 13px 17px;

          box-sizing: border-box;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          border-bottom: 1px solid #e2e9f0;

        }


        .directory-title {

          display: flex;

          align-items: center;

          gap: 10px;

        }


        .directory-title-icon {

          width: 34px;

          height: 34px;

          border-radius: 8px;

          background: #edf5ff;

          color: #1768c7;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 13px;

        }


        .directory-title h2 {

          margin: 0;

          color: #082d64;

          font-size: 14px;

          font-weight: 800;

        }


        .directory-title p {

          margin: 3px 0 0;

          color: #8798aa;

          font-size: 8px;

        }


        .directory-search {

          width: 315px;

          height: 39px;

          box-sizing: border-box;

          border: 1px solid #cbd8e6;

          border-radius: 8px;

          background: #fbfdff;

          display: flex;

          align-items: center;

          gap: 8px;

          padding: 0 11px;

        }


        .directory-search:focus-within {

          border-color: #3981d8;

          box-shadow:
            0 0 0 3px
            rgba(57,129,216,0.07);

        }


        .directory-search > svg {

          color: #66819e;

          font-size: 12px;

        }


        .directory-search input {

          width: 100%;

          border: none;

          outline: none;

          background: transparent;

          color: #173b66;

          font-size: 10px;

        }


        .directory-search button {

          border: none;

          background: transparent;

          color: #8394a6;

          cursor: pointer;

          display: flex;

        }


        /* =====================================
           TABLE
        ===================================== */

        .customer-table-container {

          width: 100%;

          overflow-x: auto;

        }


        .customer-table {

          width: 100%;

          min-width: 920px;

          border-collapse: collapse;

        }


        .customer-table thead {

          background: #f7f9fc;

        }


        .customer-table th {

          text-align: left;

          padding: 11px 17px;

          color: #5f7690;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 0.6px;

          border-bottom: 1px solid #e0e8f0;

          white-space: nowrap;

        }


        .customer-table th.customer-column {

          width: 25%;

        }


        .customer-table th.actions-column {

          width: 20%;

        }


        .customer-table td {

          padding: 14px 17px;

          border-bottom: 1px solid #edf1f5;

          vertical-align: middle;

          color: #4d6580;

          font-size: 10px;

        }


        .customer-table tbody tr {

          transition:
            background 0.12s ease;

        }


        .customer-table tbody tr:hover {

          background: #f9fbfe;

        }


        .customer-table tbody tr:last-child td {

          border-bottom: none;

        }


        /* =====================================
           CUSTOMER PROFILE
        ===================================== */

        .customer-profile-cell {

          display: flex;

          align-items: center;

          gap: 11px;

        }


        .customer-avatar {

          width: 39px;

          height: 39px;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #dcecff,
              #edf5ff
            );

          color: #075ab9;

          border: 1px solid #cce0f5;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 11px;

          font-weight: 900;

          flex-shrink: 0;

        }


        .customer-name-block strong {

          display: block;

          color: #064ea5;

          font-size: 12px;

          font-weight: 800;

          line-height: 1.2;

        }


        .customer-name-block span {

          display: block;

          color: #8a9bae;

          font-size: 8px;

          margin-top: 4px;

        }


        /* =====================================
           CONTACT
        ===================================== */

        .table-contact {

          display: flex;

          align-items: center;

          gap: 8px;

        }


        .table-contact-icon {

          width: 27px;

          height: 27px;

          border-radius: 7px;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 10px;

          flex-shrink: 0;

        }


        .email-icon {

          background: #edf5ff;

          color: #1469d7;

        }


        .phone-icon {

          background: #eaf2fb;

          color: #526f94;

        }


        .table-contact span {

          color: #36536f;

          font-size: 10px;

        }


        /* =====================================
           STATUS
        ===================================== */

        .customer-status {

          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 10px;

          border-radius: 20px;

          font-size: 8px;

          font-weight: 800;

        }


        .status-active {

          background: #edf5ff;

          color: #0a4ea3;

          border: 1px solid #d6e7fa;

        }


        .status-inactive {

          background: #eaf2fb;

          color: #526f94;

          border: 1px solid #d7e3ef;

        }


        .status-dot {

          width: 5px;

          height: 5px;

          border-radius: 50%;

          background: currentColor;

        }


        /* =====================================
           ACTION BUTTONS
        ===================================== */

        .customer-action-buttons {

          display: flex;

          align-items: center;

          gap: 7px;

        }


        .customer-action-buttons button {

          height: 33px;

          border-radius: 7px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 6px;

          padding: 0 10px;

          font-size: 9px;

          font-weight: 800;

          cursor: pointer;

          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            background 0.15s ease;

        }


        .customer-action-buttons button:hover {

          transform: translateY(-1px);

        }


        /* VIEW */

        .view-button {

          color: #075bbd;

          background: #eaf3ff;

          border: 1px solid #c9def6;

        }


        .view-button:hover {

          background: #dcecff;

          box-shadow:
            0 3px 8px
            rgba(20,105,215,0.12);

        }


        /* EDIT */

        .edit-button {

          color: #ffffff;

          background: #0a3b80;

          border: 1px solid #0a3b80;

        }


        .edit-button:hover {

          background: #0b4d9d;

          box-shadow:
            0 3px 8px
            rgba(10,59,128,0.18);

        }


        /* DELETE */

        .delete-button {

          width: 33px;

          padding: 0 !important;

          color: #64748b;

          background: #f1f5f9;

          border: 1px solid #d8e0e8;

        }


        .delete-button:hover {

          color: #8b3d4a;

          background: #f5e9ec;

          border-color: #e2c8ce;

          box-shadow:
            0 3px 8px
            rgba(100,70,80,0.08);

        }


        /* =====================================
           EMPTY
        ===================================== */

        .empty-customer-state {

          padding: 65px 20px !important;

          text-align: center;

        }


        .empty-icon {

          width: 55px;

          height: 55px;

          margin: 0 auto 11px;

          border-radius: 50%;

          background: #edf5ff;

          color: #79a2ce;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 22px;

        }


        .empty-customer-state h3 {

          margin: 0 0 5px;

          color: #405a75;

          font-size: 13px;

        }


        .empty-customer-state p {

          margin: 0;

          color: #8798a9;

          font-size: 9px;

        }


        /* =====================================
           LOADING
        ===================================== */

        .customer-loading {

          padding: 75px 20px;

          text-align: center;

        }


        .loading-icon {

          width: 55px;

          height: 55px;

          margin: 0 auto 12px;

          border-radius: 50%;

          background: #edf5ff;

          color: #1768c7;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 22px;

        }


        .customer-loading h3 {

          margin: 0 0 5px;

          color: #17375e;

          font-size: 14px;

        }


        .customer-loading p {

          margin: 0;

          color: #8999aa;

          font-size: 9px;

        }


        /* =====================================
           MODAL
        ===================================== */

        .customer-modal-overlay {

          position: fixed;

          inset: 0;

          background:
            rgba(5,28,61,0.50);

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 20px;

          z-index: 1000;

        }


        .customer-details-modal {

          width: 100%;

          max-width: 520px;

          background: #ffffff;

          border-radius: 15px;

          overflow: hidden;

          box-shadow:
            0 24px 70px
            rgba(4,25,55,0.25);

        }


        .details-modal-header {

          padding: 20px;

          background:
            linear-gradient(
              120deg,
              #f6faff,
              #ffffff
            );

          border-bottom: 1px solid #e0e8f0;

          display: flex;

          align-items: center;

          justify-content: space-between;

        }


        .details-customer {

          display: flex;

          align-items: center;

          gap: 12px;

        }


        .details-avatar {

          width: 52px;

          height: 52px;

          border-radius: 13px;

          background: #e5f0ff;

          color: #075ab9;

          border: 1px solid #c9def5;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 15px;

          font-weight: 900;

        }


        .details-customer > div:last-child > span {

          color: #5281b4;

          font-size: 7px;

          font-weight: 900;

          letter-spacing: 1px;

        }


        .details-customer h2 {

          margin: 3px 0 2px;

          color: #063a7a;

          font-size: 19px;

          font-weight: 800;

        }


        .details-customer small {

          color: #8496a9;

          font-size: 8px;

        }


        .modal-close-button {

          width: 32px;

          height: 32px;

          border: none;

          border-radius: 7px;

          background: #edf2f7;

          color: #60758d;

          display: flex;

          align-items: center;

          justify-content: center;

          cursor: pointer;

        }


        .details-status-bar {

          padding: 12px 20px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          border-bottom: 1px solid #edf1f5;

        }


        .details-status-bar > span:first-child {

          color: #72869c;

          font-size: 9px;

          font-weight: 700;

        }


        .details-content {

          padding: 18px 20px;

        }


        .details-section-title {

          color: #7188a0;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 0.8px;

          margin-bottom: 10px;

        }


        .details-grid {

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 9px;

        }


        .detail-box {

          padding: 12px;

          border: 1px solid #e0e8f0;

          border-radius: 9px;

          display: flex;

          align-items: center;

          gap: 9px;

        }


        .detail-box-icon {

          width: 30px;

          height: 30px;

          border-radius: 7px;

          background: #edf5ff;

          color: #1469d7;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 11px;

          flex-shrink: 0;

        }


        .detail-box span {

          display: block;

          color: #8a9bad;

          font-size: 8px;

          margin-bottom: 3px;

        }


        .detail-box strong {

          display: block;

          color: #234568;

          font-size: 9px;

          word-break: break-word;

        }


        .details-modal-footer {

          padding: 13px 20px;

          background: #fbfcfe;

          border-top: 1px solid #e3eaf1;

          display: flex;

          justify-content: flex-end;

          gap: 8px;

        }


        .details-edit-button,
        .details-close-button {

          height: 37px;

          padding: 0 14px;

          border: none;

          border-radius: 7px;

          font-size: 9px;

          font-weight: 800;

          cursor: pointer;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 6px;

        }


        .details-edit-button {

          background: #0a3b80;

          color: white;

        }


        .details-edit-button:hover {

          background: #0b4d9d;

        }


        .details-close-button {

          background: #e8eef5;

          color: #536b84;

        }


        /* =====================================
           RESPONSIVE
        ===================================== */

        @media (max-width: 1000px) {

          .customer-statistics {

            grid-template-columns:
              1fr 1fr;

          }


          .customer-stat:last-child {

            grid-column: span 2;

          }


          .form-fields {

            grid-template-columns:
              1fr;

          }

        }


        @media (max-width: 760px) {

          .customer-management-page {

            padding: 15px;

          }


          .customer-page-header {

            align-items: flex-start;

            flex-direction: column;

          }


          .add-customer-button {

            width: 100%;

          }


          .directory-header {

            align-items: stretch;

            flex-direction: column;

          }


          .directory-search {

            width: 100%;

          }

        }


        @media (max-width: 560px) {

          .customer-statistics {

            grid-template-columns:
              1fr;

          }


          .customer-stat:last-child {

            grid-column: auto;

          }


          .customer-page-header h1 {

            font-size: 22px;

          }


          .details-grid {

            grid-template-columns:
              1fr;

          }

        }

      `}</style>

    </div>

  );

}


export default CustomerPage;