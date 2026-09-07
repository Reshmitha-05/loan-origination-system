import { useEffect, useState } from "react";

import {
  AiOutlineStock
} from "react-icons/ai";

import {
  FaFileAlt,
  FaRupeeSign,
  FaTimesCircle,
  FaUsers,
  FaCheckCircle,
  FaChartBar,
  FaClipboardList,
  FaArrowUp,
  FaClock
} from "react-icons/fa";

import {
  MdPendingActions
} from "react-icons/md";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";


function Reports() {

  const [customers, setCustomers] = useState([]);

  const [loans, setLoans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [selectedCard, setSelectedCard] =
    useState("Loan Summary");

  const [showTable, setShowTable] =
    useState(false);

  const [tableRef, setTableRef] =
    useState(null);


  // ==========================================
  // FETCH DATA
  // ==========================================

  useEffect(() => {

    fetchData();

  }, []);


  useEffect(() => {

    if (showTable && tableRef) {

      const timer = setTimeout(() => {

        tableRef.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }, 50);

      return () => clearTimeout(timer);

    }

  }, [showTable, tableRef]);


  const fetchData = async () => {

    try {

      setLoading(true);

      setError(null);


      const customersResponse =
        await fetch(
          "http://localhost:8080/customers"
        );


      if (!customersResponse.ok) {

        throw new Error(
          "Failed to fetch customers"
        );

      }


      const customersData =
        await customersResponse.json();

      setCustomers(customersData);


      const loansResponse =
        await fetch(
          "http://localhost:8080/loans"
        );


      if (!loansResponse.ok) {

        throw new Error(
          "Failed to fetch loans"
        );

      }


      const loansData =
        await loansResponse.json();

      setLoans(loansData);


    } catch (err) {

      setError(err.message);

      console.error(
        "Error fetching reports data:",
        err
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalCustomers =
    customers.length;


  const totalLoans =
    loans.length;


  const approvedLoans =
    loans.filter(
      loan => loan.status === "Approved"
    ).length;


  const pendingLoans =
    loans.filter(
      loan => loan.status === "Pending"
    ).length;


  const rejectedLoans =
    loans.filter(
      loan => loan.status === "Rejected"
    ).length;


  const totalLoanAmount =
    loans.reduce(
      (sum, loan) =>
        sum + (loan.loanAmount || 0),
      0
    );


  const averageLoanAmount =
    loans.length > 0
      ? totalLoanAmount / loans.length
      : 0;


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;

  };


  // ==========================================
  // CHART DATA
  // ==========================================

  const loanStatusData = [

    {
      name: "Approved",
      count: approvedLoans,
      color: "#0A3B80"
    },

    {
      name: "Pending",
      count: pendingLoans,
      color: "#3B82F6"
    },

    {
      name: "Rejected",
      count: rejectedLoans,
      color: "#94A3B8"
    }

  ];


  const loanTypeColors = [
    "#0A3B80",
    "#2563EB",
    "#3B82F6",
    "#60A5FA",
    "#93C5FD"
  ];


  const calculateLoanAmountByType = () => {

    const loanTypes = [
      ...new Set(
        loans.map(
          loan => loan.loanType
        )
      )
    ];


    return loanTypes.map(type => ({

      name: type,

      amount:
        loans
          .filter(
            loan =>
              loan.loanType === type
          )
          .reduce(
            (sum, loan) =>
              sum +
              (loan.loanAmount || 0),
            0
          )

    }));

  };


  const loanAmountByType =
    calculateLoanAmountByType();


  const calculateLoanTypeDistribution = () => {

    const loanTypes = [
      ...new Set(
        loans.map(
          loan => loan.loanType
        )
      )
    ];


    return loanTypes.map(
      (type, index) => ({

        name: type,

        value:
          loans.filter(
            loan =>
              loan.loanType === type
          ).length,

        fillColor:
          loanTypeColors[
            index %
            loanTypeColors.length
          ]

      })
    );

  };


  const loanTypeDistribution =
    calculateLoanTypeDistribution();


  // ==========================================
  // FILTERED DATA
  // ==========================================

  const getFilteredData = () => {

    switch (selectedCard) {

      case "Customer Summary":

        return customers;


      case "Loan Summary":

        return loans;


      case "Approved":

        return loans.filter(
          loan =>
            loan.status === "Approved"
        );


      case "Pending":

        return loans.filter(
          loan =>
            loan.status === "Pending"
        );


      case "Rejected":

        return loans.filter(
          loan =>
            loan.status === "Rejected"
        );


      default:

        return loans;

    }

  };


  const filteredData =
    getFilteredData();


  const isCustomerData =
    selectedCard === "Customer Summary";


  // ==========================================
  // TABLE
  // ==========================================

  const tableHeaders = isCustomerData

    ? [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Status"
      ]

    : [
        "ID",
        "Customer ID",
        "Loan Amount",
        "Loan Type",
        "Status"
      ];


  const getLoanStatusClass = (status) => {

    switch (status) {

      case "Approved":
        return "report-status approved";

      case "Pending":
        return "report-status pending";

      case "Rejected":
        return "report-status rejected";

      default:
        return "report-status";

    }

  };


  const tableBody = isCustomerData

    ? filteredData.map(
        customer => (

          <tr key={customer.id}>

            <td>
              #{customer.id}
            </td>

            <td>
              <div className="customer-name-cell">

                <div className="mini-avatar">
                  {customer.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <strong>
                  {customer.name}
                </strong>

              </div>
            </td>

            <td>
              {customer.email}
            </td>

            <td>
              {customer.phoneNumber}
            </td>

            <td>

              <span
                className={
                  customer.status === "Active"
                    ? "report-status approved"
                    : "report-status rejected"
                }
              >

                {customer.status ||
                  "Active"}

              </span>

            </td>

          </tr>

        )
      )

    : filteredData.map(
        loan => (

          <tr key={loan.id}>

            <td>
              #{loan.id}
            </td>

            <td>
              #{loan.customerId}
            </td>

            <td>
              <strong className="table-amount">
                {formatCurrency(
                  loan.loanAmount
                )}
              </strong>
            </td>

            <td>
              {loan.loanType}
            </td>

            <td>

              <span
                className={
                  getLoanStatusClass(
                    loan.status
                  )
                }
              >

                {loan.status}

              </span>

            </td>

          </tr>

        )
      );


  // ==========================================
  // CARD CLICK
  // ==========================================

  const handleCardClick =
    (cardType) => {

      setSelectedCard(cardType);

      setShowTable(false);

      setTimeout(() => {

        setShowTable(true);

      }, 10);

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="reports-modern-page">

        <div className="reports-loading">

          <div className="loading-circle">
            <FaChartBar />
          </div>

          <h3>
            Loading Reports
          </h3>

          <p>
            Fetching customer and loan data...
          </p>

        </div>


        <style>{reportsCSS}</style>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="reports-modern-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="reports-header">

        <div className="reports-header-left">

          <div className="reports-header-icon">

            <FaChartBar />

          </div>


          <div>

            <h1>
              Reports & Analytics
            </h1>

            <p>
              Monitor your loan portfolio,
              customer activity and application performance.
            </p>

          </div>

        </div>


        <div className="reports-header-badge">

          <FaClipboardList />

          <div>

            <strong>
              Live Portfolio Data
            </strong>

            <span>
              Connected to loan management system
            </span>

          </div>

        </div>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="reports-error">

          <FaTimesCircle />

          {error}

        </div>

      )}


      {/* ======================================
          TOP STATISTICS
      ====================================== */}

      <div className="reports-stat-grid">


        {/* CUSTOMERS */}

        <div
          className={
            `report-stat-card ${
              selectedCard ===
              "Customer Summary"
                ? "selected"
                : ""
            }`
          }
          onClick={() =>
            handleCardClick(
              "Customer Summary"
            )
          }
        >

          <div className="stat-top">

            <div className="stat-icon customers">
              <FaUsers />
            </div>

            <span className="stat-link">
              View records →
            </span>

          </div>


          <div className="stat-value">

            {totalCustomers}

          </div>


          <div className="stat-title">

            Total Customers

          </div>


          <div className="stat-description">

            Registered customers

          </div>

        </div>


        {/* LOANS */}

        <div
          className={
            `report-stat-card ${
              selectedCard ===
              "Loan Summary"
                ? "selected"
                : ""
            }`
          }
          onClick={() =>
            handleCardClick(
              "Loan Summary"
            )
          }
        >

          <div className="stat-top">

            <div className="stat-icon loans">
              <FaFileAlt />
            </div>

            <span className="stat-link">
              View records →
            </span>

          </div>


          <div className="stat-value">

            {totalLoans}

          </div>


          <div className="stat-title">

            Total Loans

          </div>


          <div className="stat-description">

            Loans in portfolio

          </div>

        </div>


        {/* APPROVED */}

        <div
          className={
            `report-stat-card ${
              selectedCard ===
              "Approved"
                ? "selected"
                : ""
            }`
          }
          onClick={() =>
            handleCardClick("Approved")
          }
        >

          <div className="stat-top">

            <div className="stat-icon approved">
              <FaCheckCircle />
            </div>

            <span className="stat-link">
              View records →
            </span>

          </div>


          <div className="stat-value">

            {approvedLoans}

          </div>


          <div className="stat-title">

            Approved Loans

          </div>


          <div className="stat-description">

            Successfully approved

          </div>

        </div>


        {/* PENDING */}

        <div
          className={
            `report-stat-card ${
              selectedCard ===
              "Pending"
                ? "selected"
                : ""
            }`
          }
          onClick={() =>
            handleCardClick("Pending")
          }
        >

          <div className="stat-top">

            <div className="stat-icon pending">
              <MdPendingActions />
            </div>

            <span className="stat-link">
              View records →
            </span>

          </div>


          <div className="stat-value">

            {pendingLoans}

          </div>


          <div className="stat-title">

            Pending Loans

          </div>


          <div className="stat-description">

            Awaiting review

          </div>

        </div>


        {/* REJECTED */}

        <div
          className={
            `report-stat-card ${
              selectedCard ===
              "Rejected"
                ? "selected"
                : ""
            }`
          }
          onClick={() =>
            handleCardClick("Rejected")
          }
        >

          <div className="stat-top">

            <div className="stat-icon rejected">
              <FaTimesCircle />
            </div>

            <span className="stat-link">
              View records →
            </span>

          </div>


          <div className="stat-value">

            {rejectedLoans}

          </div>


          <div className="stat-title">

            Rejected Loans

          </div>


          <div className="stat-description">

            Applications declined

          </div>

        </div>

      </div>


      {/* ======================================
          FINANCIAL SUMMARY
      ====================================== */}

      <div className="financial-grid">


        <div className="financial-card">

          <div className="financial-icon">

            <FaRupeeSign />

          </div>


          <div>

            <span>
              Total Loan Portfolio
            </span>

            <strong>
              {formatCurrency(
                totalLoanAmount
              )}
            </strong>

            <small>
              Combined value of all loans
            </small>

          </div>

        </div>


        <div className="financial-card">

          <div className="financial-icon">

            <AiOutlineStock />

          </div>


          <div>

            <span>
              Average Loan Amount
            </span>

            <strong>
              {formatCurrency(
                averageLoanAmount
              )}
            </strong>

            <small>
              Average value per loan
            </small>

          </div>

        </div>


        <div className="financial-card">

          <div className="financial-icon">

            <FaArrowUp />

          </div>


          <div>

            <span>
              Approval Rate
            </span>

            <strong>
              {
                totalLoans > 0
                  ? Math.round(
                      (approvedLoans /
                        totalLoans) *
                      100
                    )
                  : 0
              }%
            </strong>

            <small>
              Approved loans / total loans
            </small>

          </div>

        </div>

      </div>


      {/* ======================================
          CHARTS
      ====================================== */}

      <div className="analytics-section">


        <div className="section-title-row">

          <div>

            <h2>
              Portfolio Analytics
            </h2>

            <p>
              Visual overview of your current loan portfolio
            </p>

          </div>

        </div>


        <div className="charts-grid">


          {/* STATUS CHART */}

          <div className="analytics-card">

            <div className="chart-heading">

              <div>

                <h3>
                  Loan Status
                </h3>

                <span>
                  Applications by current status
                </span>

              </div>

              <div className="chart-heading-icon">
                <FaChartBar />
              </div>

            </div>


            <ResponsiveContainer
              width="100%"
              height={290}
            >

              <BarChart
                data={loanStatusData}
                margin={{
                  top: 15,
                  right: 15,
                  left: 0,
                  bottom: 5
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="#61758d"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  stroke="#61758d"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />

                <Tooltip
                  formatter={(value) =>
                    `${value} loans`
                  }
                  contentStyle={{
                    backgroundColor:
                      "#ffffff",
                    border:
                      "1px solid #dce5ef",
                    borderRadius:
                      "8px",
                    boxShadow:
                      "0 5px 15px rgba(0,0,0,0.08)"
                  }}
                />

                <Bar
                  dataKey="count"
                  radius={[
                    5,
                    5,
                    0,
                    0
                  ]}
                >

                  {loanStatusData.map(
                    (entry, index) => (

                      <Cell
                        key={
                          `status-${index}`
                        }
                        fill={
                          entry.color
                        }
                      />

                    )
                  )}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>


          {/* LOAN TYPE AMOUNT */}

          <div className="analytics-card">

            <div className="chart-heading">

              <div>

                <h3>
                  Loan Amount by Type
                </h3>

                <span>
                  Portfolio value by loan category
                </span>

              </div>

              <div className="chart-heading-icon">
                <FaRupeeSign />
              </div>

            </div>


            <ResponsiveContainer
              width="100%"
              height={290}
            >

              <BarChart
                data={loanAmountByType}
                margin={{
                  top: 15,
                  right: 15,
                  left: 10,
                  bottom: 5
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="#61758d"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  stroke="#61758d"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(value)
                  }
                  contentStyle={{
                    backgroundColor:
                      "#ffffff",
                    border:
                      "1px solid #dce5ef",
                    borderRadius:
                      "8px",
                    boxShadow:
                      "0 5px 15px rgba(0,0,0,0.08)"
                  }}
                />

                <Bar
                  dataKey="amount"
                  fill="#2563EB"
                  radius={[
                    5,
                    5,
                    0,
                    0
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>


          {/* DONUT */}

          <div className="analytics-card donut-card">

            <div className="chart-heading">

              <div>

                <h3>
                  Loan Type Distribution
                </h3>

                <span>
                  Number of loans by category
                </span>

              </div>

              <div className="chart-heading-icon">
                <FaFileAlt />
              </div>

            </div>


            <div className="donut-wrapper">

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={
                      loanTypeDistribution
                    }
                    cx="50%"
                    cy="45%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                  >

                    {loanTypeDistribution.map(
                      (entry, index) => (

                        <Cell
                          key={
                            `type-${index}`
                          }
                          fill={
                            entry.fillColor
                          }
                          stroke="#ffffff"
                        />

                      )
                    )}

                  </Pie>


                  <Tooltip
                    formatter={(value) =>
                      `${value} loans`
                    }
                    contentStyle={{
                      backgroundColor:
                        "#ffffff",
                      border:
                        "1px solid #dce5ef",
                      borderRadius:
                        "8px",
                      boxShadow:
                        "0 5px 15px rgba(0,0,0,0.08)"
                    }}
                  />


                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "11px",
                      color: "#294566"
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* PORTFOLIO SNAPSHOT */}

          <div className="analytics-card snapshot-card">

            <div className="chart-heading">

              <div>

                <h3>
                  Portfolio Snapshot
                </h3>

                <span>
                  Current loan portfolio overview
                </span>

              </div>

              <div className="chart-heading-icon">
                <FaClipboardList />
              </div>

            </div>


            <div className="snapshot-content">


              <div className="snapshot-row">

                <div className="snapshot-label">

                  <span className="snapshot-dot approved-dot"></span>

                  Approved

                </div>

                <strong>
                  {approvedLoans}
                </strong>

              </div>


              <div className="snapshot-progress">

                <div
                  style={{
                    width:
                      `${
                        totalLoans > 0
                          ? (
                              approvedLoans /
                              totalLoans
                            ) * 100
                          : 0
                      }%`,
                    background:
                      "#0A3B80"
                  }}
                ></div>

              </div>


              <div className="snapshot-row">

                <div className="snapshot-label">

                  <span className="snapshot-dot pending-dot"></span>

                  Pending

                </div>

                <strong>
                  {pendingLoans}
                </strong>

              </div>


              <div className="snapshot-progress">

                <div
                  style={{
                    width:
                      `${
                        totalLoans > 0
                          ? (
                              pendingLoans /
                              totalLoans
                            ) * 100
                          : 0
                      }%`,
                    background:
                      "#3B82F6"
                  }}
                ></div>

              </div>


              <div className="snapshot-row">

                <div className="snapshot-label">

                  <span className="snapshot-dot rejected-dot"></span>

                  Rejected

                </div>

                <strong>
                  {rejectedLoans}
                </strong>

              </div>


              <div className="snapshot-progress">

                <div
                  style={{
                    width:
                      `${
                        totalLoans > 0
                          ? (
                              rejectedLoans /
                              totalLoans
                            ) * 100
                          : 0
                      }%`,
                    background:
                      "#94A3B8"
                  }}
                ></div>

              </div>


              <div className="snapshot-total">

                <span>
                  Total Loans
                </span>

                <strong>
                  {totalLoans}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          RECORD TABLE
      ====================================== */}

      {showTable && (

        <div
          ref={setTableRef}
          className="reports-table-card"
        >

          <div className="table-header">

            <div>

              <h2>
                {selectedCard} Records
              </h2>

              <p>
                {filteredData.length}
                {" "}
                record
                {filteredData.length !== 1
                  ? "s"
                  : ""}
                {" "}
                found
              </p>

            </div>


            <button
              className="close-table-button"
              onClick={() =>
                setShowTable(false)
              }
            >
              Close
            </button>

          </div>


          {filteredData.length > 0 ? (

            <div className="reports-table-wrapper">

              <table>

                <thead>

                  <tr>

                    {tableHeaders.map(
                      (header, index) => (

                        <th key={index}>
                          {header}
                        </th>

                      )
                    )}

                  </tr>

                </thead>


                <tbody>

                  {tableBody}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="reports-no-data">

              <FaFileAlt />

              <h3>
                No records found
              </h3>

              <p>
                There are no records in this category yet.
              </p>

            </div>

          )}

        </div>

      )}


      {/* ======================================
          CSS
      ====================================== */}

      <style>{reportsCSS}</style>

    </div>

  );

}


const reportsCSS = `

/* ==========================================
   PAGE
========================================== */

.reports-modern-page {

  width: 100%;

  min-height: calc(100vh - 70px);

  box-sizing: border-box;

  padding: 24px 26px 40px;

  background: #f4f7fb;

  color: #0a2654;

}


/* ==========================================
   HEADER
========================================== */

.reports-header {

  background:
    linear-gradient(
      135deg,
      #ffffff,
      #f8fbff
    );

  border: 1px solid #dfe7f0;

  border-radius: 15px;

  padding: 21px 24px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 17px;

  box-shadow:
    0 4px 16px
    rgba(15,45,85,0.05);

}


.reports-header-left {

  display: flex;

  align-items: center;

  gap: 15px;

}


.reports-header-icon {

  width: 55px;

  height: 55px;

  border-radius: 13px;

  background: #edf5ff;

  color: #0a4ea3;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 25px;

  flex-shrink: 0;

}


.reports-header h1 {

  margin: 0 0 5px;

  color: #0a2654;

  font-size: 28px;

  font-weight: 700;

}


.reports-header p {

  margin: 0;

  color: #6d829b;

  font-size: 12px;

}


.reports-header-badge {

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 10px 14px;

  background: #edf5ff;

  border-radius: 9px;

  color: #075edb;

}


.reports-header-badge > svg {

  font-size: 20px;

}


.reports-header-badge strong {

  display: block;

  font-size: 10px;

}


.reports-header-badge span {

  display: block;

  margin-top: 3px;

  color: #71859d;

  font-size: 9px;

}


/* ==========================================
   ERROR
========================================== */

.reports-error {

  background: #fff1f2;

  border: 1px solid #fecdd3;

  color: #b42318;

  padding: 11px 14px;

  border-radius: 8px;

  margin-bottom: 15px;

  display: flex;

  align-items: center;

  gap: 8px;

  font-size: 11px;

}


/* ==========================================
   STATISTICS
========================================== */

.reports-stat-grid {

  display: grid;

  grid-template-columns:
    repeat(5, 1fr);

  gap: 12px;

  margin-bottom: 13px;

}


.report-stat-card {

  background: #ffffff;

  border: 1px solid #dfe7f0;

  border-radius: 11px;

  padding: 14px;

  cursor: pointer;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

}


.report-stat-card:hover {

  transform: translateY(-2px);

  border-color: #b9cee7;

  box-shadow:
    0 7px 20px
    rgba(15,45,85,0.08);

}


.report-stat-card.selected {

  border-color: #347bd1;

  box-shadow:
    0 0 0 2px
    rgba(52,123,209,0.09);

}


.stat-top {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 12px;

}


.stat-icon {

  width: 35px;

  height: 35px;

  border-radius: 9px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 15px;

}


.stat-icon.customers {

  background: #edf5ff;

  color: #0a4ea3;

}


.stat-icon.loans {

  background: #eef2ff;

  color: #334b9c;

}


.stat-icon.approved {
  background: #edf5ff;
  color: #0a4ea3;
}


.stat-icon.pending {

  background: #eff6ff;

  color: #2563eb;

}


.stat-icon.rejected {

  background: #f1f5f9;

  color: #64748b;

}


.stat-link {

  color: #7890aa;

  font-size: 8px;

}


.stat-value {

  color: #0a2654;

  font-size: 25px;

  font-weight: 700;

  line-height: 1;

  margin-bottom: 6px;

}


.stat-title {

  color: #294566;

  font-size: 11px;

  font-weight: 700;

}


.stat-description {

  color: #8496aa;

  font-size: 9px;

  margin-top: 3px;

}


/* ==========================================
   FINANCIAL
========================================== */

.financial-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 12px;

  margin-bottom: 20px;

}


.financial-card {

  background: #ffffff;

  border: 1px solid #dfe7f0;

  border-radius: 11px;

  padding: 15px;

  display: flex;

  align-items: center;

  gap: 12px;

}


.financial-icon {

  width: 39px;

  height: 39px;

  border-radius: 9px;

  background: #edf5ff;

  color: #0a4ea3;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 18px;

  flex-shrink: 0;

}


.financial-card span {

  display: block;

  color: #70849c;

  font-size: 9px;

  margin-bottom: 3px;

}


.financial-card strong {

  display: block;

  color: #0a2654;

  font-size: 19px;

}


.financial-card small {

  display: block;

  margin-top: 3px;

  color: #93a1b1;

  font-size: 8px;

}


/* ==========================================
   ANALYTICS
========================================== */

.analytics-section {

  margin-top: 3px;

}


.section-title-row {

  margin-bottom: 11px;

}


.section-title-row h2 {

  margin: 0;

  color: #0a2654;

  font-size: 19px;

}


.section-title-row p {

  margin: 4px 0 0;

  color: #7b8fa6;

  font-size: 10px;

}


.charts-grid {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 13px;

}


.analytics-card {

  background: #ffffff;

  border: 1px solid #dfe7f0;

  border-radius: 12px;

  padding: 16px;

  min-width: 0;

}


.chart-heading {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  margin-bottom: 5px;

}


.chart-heading h3 {

  margin: 0;

  color: #17375e;

  font-size: 13px;

}


.chart-heading span {

  display: block;

  margin-top: 4px;

  color: #8495a8;

  font-size: 9px;

}


.chart-heading-icon {

  width: 31px;

  height: 31px;

  border-radius: 8px;

  background: #edf5ff;

  color: #1469d7;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 13px;

}


.donut-wrapper {

  width: 100%;

}


/* ==========================================
   SNAPSHOT
========================================== */

.snapshot-content {

  padding: 17px 5px 5px;

}


.snapshot-row {

  display: flex;

  align-items: center;

  justify-content: space-between;

  color: #334d6c;

  font-size: 11px;

  margin-bottom: 6px;

}


.snapshot-row strong {

  color: #0a2654;

  font-size: 13px;

}


.snapshot-label {

  display: flex;

  align-items: center;

  gap: 7px;

}


.snapshot-dot {

  width: 8px;

  height: 8px;

  border-radius: 50%;

}


.approved-dot {

  background: #0A3B80;

}


.pending-dot {

  background: #3B82F6;

}


.rejected-dot {

  background: #94A3B8;

}


.snapshot-progress {

  width: 100%;

  height: 7px;

  background: #edf1f5;

  border-radius: 20px;

  overflow: hidden;

  margin-bottom: 18px;

}


.snapshot-progress div {

  height: 100%;

  border-radius: 20px;

}


.snapshot-total {

  display: flex;

  justify-content: space-between;

  border-top: 1px solid #e7edf3;

  padding-top: 14px;

  margin-top: 3px;

}


.snapshot-total span {

  color: #6d8198;

  font-size: 11px;

}


.snapshot-total strong {

  color: #0a2654;

  font-size: 15px;

}


/* ==========================================
   TABLE
========================================== */

.reports-table-card {

  background: #ffffff;

  border: 1px solid #dfe7f0;

  border-radius: 12px;

  margin-top: 18px;

  overflow: hidden;

  box-shadow:
    0 5px 20px
    rgba(15,45,85,0.06);

}


.table-header {

  padding: 16px 18px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border-bottom: 1px solid #e5ebf2;

}


.table-header h2 {

  margin: 0;

  color: #0a2654;

  font-size: 16px;

}


.table-header p {

  margin: 4px 0 0;

  color: #8292a5;

  font-size: 9px;

}


.close-table-button {

  border: none;

  background: #eef2f6;

  color: #52677f;

  border-radius: 7px;

  padding: 8px 14px;

  font-size: 10px;

  font-weight: 600;

  cursor: pointer;

}


.close-table-button:hover {

  background: #e2e8f0;

}


.reports-table-wrapper {

  width: 100%;

  overflow-x: auto;

}


.reports-table-wrapper table {

  width: 100%;

  border-collapse: collapse;

}


.reports-table-wrapper th {

  text-align: left;

  padding: 12px 16px;

  background: #f7f9fc;

  color: #60758f;

  font-size: 9px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 0.3px;

}


.reports-table-wrapper td {

  padding: 13px 16px;

  border-top: 1px solid #edf1f5;

  color: #435b75;

  font-size: 10px;

}


.reports-table-wrapper tbody tr:hover {

  background: #f9fbfd;

}


.customer-name-cell {

  display: flex;

  align-items: center;

  gap: 8px;

}


.mini-avatar {

  width: 27px;

  height: 27px;

  border-radius: 50%;

  background: #eaf3ff;

  color: #1768c7;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 10px;

  font-weight: 700;

}


.customer-name-cell strong {

  color: #17375e;

  font-size: 10px;

}


.table-amount {

  color: #17375e;

}


.report-status {

  display: inline-flex;

  align-items: center;

  padding: 4px 9px;

  border-radius: 20px;

  font-size: 8px;

  font-weight: 700;

}


.report-status.approved {

  color: #047857;

  background: #ecfdf5;

}


.report-status.pending {

  color: #1d4ed8;

  background: #eff6ff;

}


.report-status.rejected {

  color: #64748b;

  background: #f1f5f9;

}


.reports-no-data {

  text-align: center;

  padding: 45px 20px;

  color: #8495a8;

}


.reports-no-data svg {

  font-size: 30px;

  color: #b5c2d0;

  margin-bottom: 10px;

}


.reports-no-data h3 {

  margin: 0 0 5px;

  color: #52677f;

  font-size: 13px;

}


.reports-no-data p {

  margin: 0;

  font-size: 9px;

}


/* ==========================================
   LOADING
========================================== */

.reports-loading {

  min-height: 70vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

}


.loading-circle {

  width: 55px;

  height: 55px;

  border-radius: 50%;

  background: #edf5ff;

  color: #1469d7;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 22px;

  margin-bottom: 13px;

}


.reports-loading h3 {

  margin: 0 0 5px;

  color: #17375e;

  font-size: 16px;

}


.reports-loading p {

  margin: 0;

  color: #8495a8;

  font-size: 10px;

}


/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 1200px) {

  .reports-stat-grid {

    grid-template-columns:
      repeat(3, 1fr);

  }

}


@media (max-width: 900px) {

  .reports-header {

    align-items: flex-start;

    flex-direction: column;

  }


  .reports-header-badge {

    width: 100%;

    box-sizing: border-box;

  }


  .financial-grid {

    grid-template-columns:
      1fr;

  }


  .charts-grid {

    grid-template-columns:
      1fr;

  }

}


@media (max-width: 650px) {

  .reports-modern-page {

    padding: 15px;

  }


  .reports-stat-grid {

    grid-template-columns:
      1fr 1fr;

  }


  .reports-header h1 {

    font-size: 22px;

  }


  .reports-header p {

    line-height: 1.5;

  }

}


@media (max-width: 450px) {

  .reports-stat-grid {

    grid-template-columns:
      1fr;

  }

}


/* ==========================================
   PRINT
========================================== */

@media print {

  .reports-modern-page {

    background: white;

    padding: 0;

  }


  .report-stat-card,
  .financial-card,
  .analytics-card,
  .reports-table-card {

    box-shadow: none;

  }

}

`;


export default Reports;