import { useEffect, useState } from 'react';
import { AiOutlineStock } from "react-icons/ai";
import { FaFileAlt, FaRupeeSign, FaTimesCircle, FaUsers } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
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
} from 'recharts';
function Reports() {
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState('Loan Summary');
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
      console.error('Error fetching reports data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate all report statistics
  const totalCustomers = customers.length;
  const totalLoans = loans.length;
  const approvedLoans = loans.filter(loan => loan.status === 'Approved').length;
  const pendingLoans = loans.filter(loan => loan.status === 'Pending').length;
  const rejectedLoans = loans.filter(loan => loan.status === 'Rejected').length;
  const totalLoanAmount = loans.reduce((sum, loan) => sum + (loan.loanAmount || 0), 0);
  const averageLoanAmount = loans.length > 0 ? (totalLoanAmount / loans.length) : 0;

  // Chart data preparation
  const loanStatusData = [
    { name: 'Approved', count: approvedLoans, color: '#0A2654' },
    { name: 'Pending', count: pendingLoans, color: '#3B82F6' },
    { name: 'Rejected', count: rejectedLoans, color: '#A1B9D3' },
  ];

  // Distinct colors for loan types in the pie chart (within navy/blue palette)
  const loanTypeColors = ['#385076ff', '#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'];

  const calculateLoanAmountByType = () => {
    const loanTypes = [...new Set(loans.map(loan => loan.loanType))];
    return loanTypes.map(type => ({
      name: type,
      amount: loans.filter(loan => loan.loanType === type).reduce((sum, loan) => sum + (loan.loanAmount || 0), 0),
    }));
  };
  const loanAmountByType = calculateLoanAmountByType();

  const calculateLoanTypeDistribution = () => {
    const loanTypes = [...new Set(loans.map(loan => loan.loanType))];
    const totalByType = loanTypes.map(type => ({
      name: type,
      value: loans.filter(loan => loan.loanType === type).length,
    }));
    // Assign colors to each loan type for consistent display
    return totalByType.map((entry, index) => ({
      ...entry,
      fillColor: loanTypeColors[index % loanTypeColors.length]
    }));
  };
  const loanTypeDistribution = calculateLoanTypeDistribution();

  // Filtered data based on selected card
  const getFilteredData = () => {
    switch (selectedCard) {
      case 'Customer Summary':
        return customers;
      case 'Loan Summary':
        return loans;
      case 'Approved':
        return loans.filter(loan => loan.status === 'Approved');
      case 'Pending':
        return loans.filter(loan => loan.status === 'Pending');
      case 'Rejected':
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
  const isCustomerData = selectedCard === 'Customer Summary';
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



  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
    setShowTable(false);
    setTimeout(() => {
      setShowTable(true);
    }, 10);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Reports</h2>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <p>Loading reports...</p>
        </div>
      ) : (
        <div className="reports-grid">
          {/* Customer Statistics */}
          <div 
            className="report-card"
            onClick={() => handleCardClick('Customer Summary')}
            style={{ cursor: 'pointer' }}
          >
            <FaUsers className="card-icon" />
            <h3 className="report-title">Customer Summary</h3>
            <div className="report-value">{totalCustomers}</div>
            <p className="report-label">Total Customers</p>
          </div>

          {/* Loan Statistics */}
          <div 
            className="report-card"
            onClick={() => handleCardClick('Loan Summary')}
            style={{ cursor: 'pointer' }}
          >
            <FaFileAlt className="card-icon" />
            <h3 className="report-title">Loan Summary</h3>
            <div className="report-value">{totalLoans}</div>
            <p className="report-label">Total Loans</p>
          </div>

          <div 
            className="report-card"
            onClick={() => handleCardClick('Approved')}
            style={{ cursor: 'pointer' }}
          >
            <AiOutlineStock size={40} className="card-icon" />
            <h3 className="report-title">Approved</h3>
            <div className="report-value">{approvedLoans}</div>
            <p className="report-label">Loans</p>
          </div>

          <div 
            className="report-card"
            onClick={() => handleCardClick('Pending')}
            style={{ cursor: 'pointer' }}
          >
            <MdPendingActions size={40}/>
            <h3 className="report-title">Pending</h3>
            <div className="report-value">{pendingLoans}</div>
            <p className="report-label">Loans</p>
          </div>

          <div 
            className="report-card"
            onClick={() => handleCardClick('Rejected')}
            style={{ cursor: 'pointer' }}
          >
            <FaTimesCircle className="card-icon" />
            <h3 className="report-title">Rejected</h3>
            <div className="report-value">{rejectedLoans}</div>
            <p className="report-label">Loans</p>
          </div>

          {/* Financial Summary */}
          <div className="report-card">
            <FaRupeeSign className="card-icon" />
            <h3 className="report-title">Total Loan Amount</h3>
            <div className="report-value">₹{Number(totalLoanAmount).toLocaleString('en-IN')}</div>
            <p className="report-label">Combined Loan Value</p>
          </div>

          <div className="report-card">
            <FaRupeeSign className="card-icon" />
            <h3 className="report-title">Average Loan Amount</h3>
            <div className="report-value">₹{Number(averageLoanAmount).toLocaleString('en-IN')}</div>
            <p className="report-label">Per Loan</p>
          </div>

          {/* Professional Charts Section */}
          <div className="charts-section">
            <div className="charts-row">
              {/* Loan Status Distribution - Bar Chart */}
              <div className="chart-card">
                <h3 className="chart-title">Loan Status Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={loanStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#A1B9D3" vertical={false} />
                    <XAxis dataKey="name" stroke="#0A2654" fontSize={12} />
                    <YAxis stroke="#0A2654" fontSize={12} />
                    <Tooltip 
  formatter={(value) => `${value} loans`}
  contentStyle={{
    backgroundColor: '#0A2654',
    borderRadius: '8px',
    border: '1px solid #A1B9D3'
  }}
  itemStyle={{
    color: '#ffffff'
  }}
/>
                    <Legend wrapperStyle={{ fontSize: '14px', color: '#0A2654', marginTop: '10px' }} />
                    <Bar dataKey="count" fill="#110d5cff" radius={[4, 4, 0, 0]}>
                      {loanStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Loan Amount by Type - Bar Chart */}
              <div className="chart-card">
                <h3 className="chart-title">Loan Amount by Type</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={loanAmountByType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#A1B9D3" vertical={false} />
                    <XAxis dataKey="name" stroke="#0A2654" fontSize={12} />
                    <YAxis stroke="#0A2654" fontSize={12} />
                    <Tooltip 
                      formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                      contentStyle={{ backgroundColor: '#0A2654', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px', color: '#0A2654', marginTop: '10px' }} />
                    <Bar dataKey="amount" fill="#110d5cff" radius={[4, 4, 0, 0]}>
                      {loanAmountByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={loanStatusData[index % loanStatusData.length]?.color || '#3B82F6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="charts-row">
              {/* Loan Type Distribution - Donut Chart */}
              <div className="chart-card chart-full-width">
                <h3 className="chart-title">Loan Type Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={loanTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {loanTypeDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.fillColor} 
                          stroke="rgba(255,255,255,0.2)"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value} loans`}
                      contentStyle={{ backgroundColor: '#ffffff', color: '#0A1E3F', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      wrapperStyle={{ fontSize: '14px', color: '#0A2654', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
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
        </div>
      )}
    </div>
  );
}

export default Reports;
