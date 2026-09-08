import { useEffect, useState } from 'react';
import API_URL from "./api";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts';

import {
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaMoneyBillWave,
  FaUsers
} from 'react-icons/fa';

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers and loans from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const customersResponse = await fetch(`${API_URL}/customers`);

      if (!customersResponse.ok) {
        throw new Error('Failed to fetch customers');
      }

      const customersData = await customersResponse.json();
      setCustomers(customersData);

      const loansResponse = await fetch(`${API_URL}/loans`);

      if (!loansResponse.ok) {
        throw new Error('Failed to fetch loans');
      }

      const loansData = await loansResponse.json();
      setLoans(loansData);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Summary statistics
  // -----------------------------

  const totalCustomers = customers.length;
  const totalLoans = loans.length;

  const approvedLoans = loans.filter(
    loan => loan.status === 'Approved'
  ).length;

  const pendingLoans = loans.filter(
    loan => loan.status === 'Pending'
  ).length;

  const rejectedLoans = loans.filter(
    loan => loan.status === 'Rejected'
  ).length;

  const totalLoanAmount = loans.reduce(
    (sum, loan) => sum + (Number(loan.loanAmount) || 0),
    0
  );

  const approvedLoanAmount = loans
    .filter(loan => loan.status === 'Approved')
    .reduce(
      (sum, loan) => sum + (Number(loan.loanAmount) || 0),
      0
    );

  // -----------------------------
  // Chart data
  // -----------------------------

  const loanStatusData = [
    {
      name: 'Approved',
      value: approvedLoans,
      color: '#0A2654'
    },
    {
      name: 'Pending',
      value: pendingLoans,
      color: '#3B82F6'
    },
    {
      name: 'Rejected',
      value: rejectedLoans,
      color: '#A1B9D3'
    }
  ];

  // -----------------------------
  // Pending applications
  // -----------------------------

  const pendingApplications = loans
    .filter(loan => loan.status === 'Pending')
    .slice(0, 5);

  // -----------------------------
  // Percentage helper
  // -----------------------------

  const getPercentage = (value) => {
    if (totalLoans === 0) return 0;
    return Math.round((value / totalLoans) * 100);
  };

  // -----------------------------
  // Custom chart tooltip
  // -----------------------------

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const data = payload[0].payload;

    return (
      <div className="dashboard-chart-tooltip">
        <strong>{data.name}</strong>
        <span>
          {data.value} application{data.value !== 1 ? 's' : ''}
        </span>
        <span>
          {getPercentage(data.value)}% of total
        </span>
      </div>
    );
  };

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* Page Header */}

      <div className="admin-dashboard-header">
        <div>
          <h2 className="dashboard-title">
            Admin Dashboard
          </h2>

          <p className="dashboard-subtitle">
            Overview of your loan origination operations
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div
          className="error-message"
          style={{ marginBottom: '20px' }}
        >
          {error}
        </div>
      )}

      {/* -------------------------------- */}
      {/* Summary Cards */}
      {/* -------------------------------- */}

      <div className="summary-cards">

        {/* Total Customers */}

        <div className="summary-card admin-summary-card">
          <div
            className="admin-card-icon"
            style={{ backgroundColor: '#0A2654' }}
          >
            <FaUsers />
          </div>

          <div>
            <div className="card-label">
              Total Customers
            </div>

            <div className="card-value">
              {totalCustomers}
            </div>

            <div className="admin-card-description">
              Registered customers
            </div>
          </div>
        </div>


        {/* Loan Applications */}

        <div className="summary-card admin-summary-card">
          <div
            className="admin-card-icon"
            style={{ backgroundColor: '#3B82F6' }}
          >
            <FaFileAlt />
          </div>

          <div>
            <div className="card-label">
              Loan Applications
            </div>

            <div className="card-value">
              {totalLoans}
            </div>

            <div className="admin-card-description">
              Total applications received
            </div>
          </div>
        </div>


        {/* Pending Applications */}

        <div className="summary-card admin-summary-card">
          <div
            className="admin-card-icon"
            style={{ backgroundColor: '#6F8FB3' }}
          >
            <FaClock />
          </div>

          <div>
            <div className="card-label">
              Pending Applications
            </div>

            <div className="card-value">
              {pendingLoans}
            </div>

            <div className="admin-card-description">
              Require review
            </div>
          </div>
        </div>


        {/* Approved Loans */}

        <div className="summary-card admin-summary-card">
          <div
            className="admin-card-icon"
            style={{ backgroundColor: '#0A2654' }}
          >
            <FaCheckCircle />
          </div>

          <div>
            <div className="card-label">
              Approved Loans
            </div>

            <div className="card-value">
              {approvedLoans}
            </div>

            <div className="admin-card-description">
              Successfully approved
            </div>
          </div>
        </div>

      </div>


      {/* -------------------------------- */}
      {/* Financial Overview */}
      {/* -------------------------------- */}

      <div className="admin-overview-grid">

        <div className="admin-info-card">

          <div
            className="admin-info-icon"
            style={{ backgroundColor: '#0A2654' }}
          >
            <FaMoneyBillWave />
          </div>

          <div>
            <p className="admin-info-label">
              Total Loan Value
            </p>

            <h3 className="admin-info-value">
              ₹{totalLoanAmount.toLocaleString('en-IN')}
            </h3>

            <p className="admin-info-description">
              Total value of all applications
            </p>
          </div>

        </div>


        <div className="admin-info-card">

          <div
            className="admin-info-icon"
            style={{ backgroundColor: '#3B82F6' }}
          >
            <FaCheckCircle />
          </div>

          <div>
            <p className="admin-info-label">
              Approved Loan Value
            </p>

            <h3 className="admin-info-value">
              ₹{approvedLoanAmount.toLocaleString('en-IN')}
            </h3>

            <p className="admin-info-description">
              Total value of approved loans
            </p>
          </div>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* Loan Status Overview */}
      {/* -------------------------------- */}

      <div className="loan-status-chart">

        <div className="chart-heading-area">
          <h3 className="chart-title">
            Loan Status Overview
          </h3>

          <p className="chart-subtitle">
            Current distribution of loan applications
          </p>
        </div>


        <div className="loan-status-content">

          {/* Donut Chart */}

          <div className="chart-container">

            {totalLoans > 0 ? (

              <div className="donut-wrapper">

                <ResponsiveContainer
                  width="100%"
                  height={380}
                >

                  <PieChart>

                    <Pie
                      data={loanStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={105}
                      outerRadius={155}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >

                      {loanStatusData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        )
                      )}

                    </Pie>

                    

                  </PieChart>

                </ResponsiveContainer>


                {/* Center text */}

                <div className="chart-center-text">

                  <div className="center-label">
                    Total Applications
                  </div>

                  <div className="center-value">
                    {totalLoans}
                  </div>

                </div>

              </div>

            ) : (

              <div className="no-data">
                No loan applications available.
              </div>

            )}

          </div>


          {/* Status Breakdown */}

          <div className="status-breakdown">

            <h4>
              Application Status
            </h4>

            <div className="status-breakdown-list">

              <div className="status-breakdown-item">

                <div className="status-breakdown-left">
                  <span
                    className="status-color-dot"
                    style={{ backgroundColor: '#0A2654' }}
                  />

                  <span>Approved</span>
                </div>

                <div className="status-breakdown-right">
                  <strong>{approvedLoans}</strong>
                  <span>{getPercentage(approvedLoans)}%</span>
                </div>

              </div>


              <div className="status-breakdown-item">

                <div className="status-breakdown-left">
                  <span
                    className="status-color-dot"
                    style={{ backgroundColor: '#3B82F6' }}
                  />

                  <span>Pending</span>
                </div>

                <div className="status-breakdown-right">
                  <strong>{pendingLoans}</strong>
                  <span>{getPercentage(pendingLoans)}%</span>
                </div>

              </div>


              <div className="status-breakdown-item">

                <div className="status-breakdown-left">
                  <span
                    className="status-color-dot"
                    style={{ backgroundColor: '#A1B9D3' }}
                  />

                  <span>Rejected</span>
                </div>

                <div className="status-breakdown-right">
                  <strong>{rejectedLoans}</strong>
                  <span>{getPercentage(rejectedLoans)}%</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* Applications Requiring Attention */}
      {/* -------------------------------- */}

      <div className="admin-attention-section">

        <div className="admin-section-header">

          <div>

            <h3>
              Applications Requiring Attention
            </h3>

            <p>
              Pending applications that are waiting for review
            </p>

          </div>

          <span
            className="pending-count-badge"
            style={{
              backgroundColor: '#E8F0FA',
              color: '#0A2654'
            }}
          >
            {pendingLoans} Pending
          </span>

        </div>


        {pendingApplications.length > 0 ? (

          <div className="pending-application-list">

            {pendingApplications.map((loan) => (

              <div
                className="pending-application-card"
                key={loan.id}
              >

                <div className="pending-application-main">

                  <div
                    className="pending-application-icon"
                    style={{
                      backgroundColor: '#E8F0FA',
                      color: '#3B82F6'
                    }}
                  >
                    <FaFileAlt />
                  </div>

                  <div>

                    <h4>
                      {loan.loanType || 'Loan Application'}
                    </h4>

                    <p>
                      Application #{loan.id}
                    </p>

                  </div>

                </div>


                <div className="pending-application-details">

                  <div>
                    <span>Customer ID</span>

                    <strong>
                      {loan.customerId}
                    </strong>
                  </div>


                  <div>
                    <span>Loan Amount</span>

                    <strong>
                      ₹{Number(
                        loan.loanAmount || 0
                      ).toLocaleString('en-IN')}
                    </strong>
                  </div>


                  <span
                    className="pending-status"
                    style={{
                      backgroundColor: '#E8F0FA',
                      color: '#0A2654'
                    }}
                  >
                    Pending Review
                  </span>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="no-pending-applications">

            <FaCheckCircle />

            <div>

              <h4>
                All caught up
              </h4>

              <p>
                There are no pending loan applications
                requiring review.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;