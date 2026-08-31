import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState('Active Loans');
  const [showTable, setShowTable] = useState(false);
  const [tableRef, setTableRef] = useState(null);

  // Fetch customers and loans from backend on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Scroll to table when showTable changes
  useEffect(() => {
    if (showTable && tableRef) {
      const timer = setTimeout(() => {
        tableRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showTable, tableRef]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch customers
      const customersResponse = await fetch('http://localhost:8080/customers');
      if (!customersResponse.ok) {
        throw new Error('Failed to fetch customers');
      }
      const customersData = await customersResponse.json();
      setCustomers(customersData);

      // Fetch loans
      const loansResponse = await fetch('http://localhost:8080/loans');
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

  // Calculate summary statistics
  const totalCustomers = customers.length;
  const totalLoans = loans.length;
  const approvedLoans = loans.filter(loan => loan.status === 'Approved').length;
  const pendingLoans = loans.filter(loan => loan.status === 'Pending').length;
  const rejectedLoans = loans.filter(loan => loan.status === 'Rejected').length;
  const activeLoans = loans.filter(loan => ['Approved', 'Pending'].includes(loan.status)).length;

  // Mock month-over-month change data (can be replaced with real backend values later)
  const getMonthlyChange = (label, currentValue) => {
    // Simulate realistic changes based on the current value
    const baseChange = Math.floor(currentValue * 0.15); // ~15% variation
    
    if (baseChange === 0) {
      return { value: 0, isPositive: true };
    }
    
    // Generate pseudo-random but consistent changes based on label
    const changes = {
      'Total Customers': Math.floor(Math.random() * 5) + 1,
      'Active Loans': Math.floor(Math.random() * 4) + 1,
      'Approved Loans': Math.floor(Math.random() * 3) + 1,
      'Pending Loans': Math.floor(Math.random() * 3),
    };
    
    const change = changes[label] || 0;
    return { value: change, isPositive: true };
  };

  // Filtered data based on selected card
  const getFilteredData = () => {
    switch (selectedCard) {
      case 'Total Customers':
        return customers;
      case 'Active Loans':
        return loans.filter(loan => ['Approved', 'Pending'].includes(loan.status));
      case 'Approved Loans':
        return loans.filter(loan => loan.status === 'Approved');
      case 'Pending Loans':
        return loans.filter(loan => loan.status === 'Pending');
      case 'Rejected Loans':
        return loans.filter(loan => loan.status === 'Rejected');
      default:
        return loans;
    }
  };
  const getLoanStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#0A2654';
      case 'Pending':
        return '#3B82F6';
      case 'Rejected':
        return '#a1b9d3ff';
      default:
        return '#6b7280';
    }
  };
  const filteredData = getFilteredData();

  // Determine table headers based on data type
  const isCustomerData = selectedCard === 'Total Customers';
  const tableHeaders = isCustomerData 
    ? ['ID', 'Name', 'Email', 'Phone', 'Status']
    : ['ID', 'Customer ID', 'Loan Amount', 'Loan Type', 'Status'];

  const tableBody = isCustomerData ? (
    filteredData.map((customer) => (
      <tr key={customer.id}>
        <td>{customer.id}</td>
        <td>{customer.name}</td>
        <td>{customer.email}</td>
        <td>{customer.phoneNumber}</td>
        <td>
          <span className={`status-badge ${customer.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
            {customer.status || 'Active'}
          </span>
        </td>
        
      </tr>
    ))
  ) : (
    filteredData.map((loan) => (
      <tr key={loan.id}>
        <td>{loan.id}</td>
        <td>{loan.customerId}</td>
        <td>{loan.loanAmount}</td>
        <td>{loan.loanType}</td>
        <td>
          <span className="status-badge status-custom" style={{ backgroundColor: getLoanStatusColor(loan.status) }}>
            {loan.status}
          </span>
        </td>
        
      </tr>
    ))
  );


  // Loan status data for chart
  const loanStatusData = [
    { name: 'Approved', value: approvedLoans, color: '#0A2654' },
    { name: 'Pending', value: pendingLoans, color: '#3B82F6' },
    { name: 'Rejected', value: rejectedLoans, color: '#a1b9d3ff' },
  ];

  // Generate recent activity from actual data
  const generateRecentActivity = () => {
    const activities = [];
    
    // Add recent customers (newest first)
    [...customers].reverse().slice(0, 3).forEach((customer) => {
      activities.push({
        text: `Customer ${customer.name} registered`,
        type: 'customer'
      });
    });

    // Add recent loans (newest first)
    [...loans].reverse().slice(0, 3).forEach((loan) => {
      activities.push({
        text: `Loan created for Customer ID ${loan.customerId}, Amount: ${loan.loanAmount}`,
        type: 'loan'
      });
    });

    // Sort by ID (newest first since higher ID = newer) and limit to 5
    return activities.slice(0, 5);
  };
  const recentActivity = generateRecentActivity();
  // Summary card data (percentages removed)
  const summaryData = [
    { label: 'Total Customers', value: totalCustomers, color: '#0A2654' },
    { label: 'Active Loans', value: activeLoans, color: '#0A2654' },
    { label: 'Approved Loans', value: approvedLoans, color: '#0A2654' },
    { label: 'Pending Loans', value: pendingLoans, color: '#0A2654' },
  ];

  const handleCardClick = (label) => {
    setSelectedCard(label);
    setShowTable(false);
    setTimeout(() => {
      setShowTable(true);
    }, 10);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">DashBoard</h2>

      {/* Error Message */}
      {error && (
        <div className="error-message" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="summary-cards">
            {summaryData.map((card, index) => (
              <div 
                key={index} 
                className={`summary-card ${selectedCard === card.label ? 'card-selected' : ''}`}
                onClick={() => handleCardClick(card.label)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-header">
                  <span className="card-label">{card.label}</span>
                </div>
                <div className="card-value">{card.value}</div>
                <div className="card-change-indicator">
                  <span className="change-value">{getMonthlyChange(card.label, card.value).value}</span>
                  <span className="change-arrow">↑</span>
                  <span className="change-text">this month</span>
                </div>
                <div
                  className="card-indicator"
                  style={{ backgroundColor: card.color }}
                />
              </div>
            ))}
          </div>

          {/* Loan Status Overview Chart */}
          <div className="loan-status-chart">
            <h3 className="chart-title">Loan Status Overview</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={420}>
                <PieChart>
                  <Pie
                    data={loanStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={120}
                    outerRadius={165}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                  >
                    {loanStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
  verticalAlign="bottom"
  align="center"
  wrapperStyle={{ bottom: -20 }}
/>
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-center-text">
                <div className="center-label">Total</div>
                <div className="center-value">{totalLoans}</div>
              </div>
            </div>
          </div>

          {/* Filtered Results Table */}
          {showTable && (
            <div ref={setTableRef} className="table-container" style={{ marginTop: '20px' }}>
              <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>
                {selectedCard} Records
              </h3>
              <table className={isCustomerData ? 'customer-table' : 'loan-table'}>
                <thead>
                  <tr>
                    {tableHeaders.map((header, idx) => (
                      <th key={idx}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableBody}
                </tbody>
              </table>
              {filteredData.length === 0 && (
                <div className="no-data" style={{ textAlign: 'center', padding: '20px' }}>
                  No records found
                </div>
              )}
            </div>
          )}

          <div className="recent-activity">
            <h3 className="activity-title">Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-dot" />
                    <span className="activity-text">{activity.text}</span>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <div className="activity-dot" style={{ backgroundColor: '#cbd5e1' }} />
                  <span className="activity-text" style={{ color: '#94a3b8' }}>No recent activity</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Dashboard;
