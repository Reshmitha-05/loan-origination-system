import { useEffect, useState } from 'react';

function LoanPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLoan, setNewLoan] = useState({ customerId: '', loanAmount: '', loanType: '', status: 'Pending' });
  const [editingLoan, setEditingLoan] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  // Fetch loans from backend on mount
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/loans');
      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }
      const data = await response.json();
      setLoans(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLoan = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8080/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLoan),
      });
      if (!response.ok) {
        throw new Error('Failed to add loan');
      }
      fetchLoans();
      setNewLoan({ customerId: '', loanAmount: '', loanType: '', status: 'Pending' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error adding loan:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        setError(null);
        const response = await fetch(`http://localhost:8080/loans/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete loan');
        }
        fetchLoans();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting loan:', err);
      }
    }
  };

  const handleEdit = (loan) => {
    setEditingLoan({ ...loan });
    setShowEditForm(true);
  };

  const handleView = async (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
    setLoadingCustomer(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/customers/${loan.customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }
      const customerData = await response.json();
      setCustomerDetails(customerData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching customer:', err);
    } finally {
      setLoadingCustomer(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
    setCustomerDetails(null);
  };

  const handleUpdate = async () => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/loans/${editingLoan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingLoan.id,
          customerId: editingLoan.customerId,
          loanAmount: editingLoan.loanAmount,
          loanType: editingLoan.loanType,
          status: editingLoan.status,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update loan');
      }
      fetchLoans();
      setEditingLoan(null);
      setShowEditForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating loan:', err);
    }
  };

  const filteredLoans = loans.filter((loan) =>
    loan.customerId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.loanType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Loan Management</h2>
        <div className="page-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search by customer ID or loan type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            New Loan
          </button>
        </div>
      </div>

      {/* Add Loan Form */}
      {showAddForm && (
        <div className="add-customer-form">
          <h3>Create New Loan</h3>
          <div className="form-group">
            <input
              type="number"
              className="form-input"
              placeholder="Customer ID"
              value={newLoan.customerId}
              onChange={(e) => setNewLoan({ ...newLoan, customerId: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              className="form-input"
              placeholder="Loan Amount"
              value={newLoan.loanAmount}
              onChange={(e) => setNewLoan({ ...newLoan, loanAmount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Loan Type"
              value={newLoan.loanType}
              onChange={(e) => setNewLoan({ ...newLoan, loanType: e.target.value })}
            />
          </div>
          <div className="form-group">
            <select
              className="form-input"
              value={newLoan.status}
              onChange={(e) => setNewLoan({ ...newLoan, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAddLoan}>
              Create Loan
            </button>
          </div>
        </div>
      )}

      {/* Edit Loan Form */}
      {showEditForm && editingLoan && (
        <div className="add-customer-form">
          <h3>Edit Loan</h3>
          <div className="form-group">
            <input
              type="number"
              className="form-input"
              placeholder="Customer ID"
              value={editingLoan.customerId}
              onChange={(e) => setEditingLoan({ ...editingLoan, customerId: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              className="form-input"
              placeholder="Loan Amount"
              value={editingLoan.loanAmount}
              onChange={(e) => setEditingLoan({ ...editingLoan, loanAmount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Loan Type"
              value={editingLoan.loanType}
              onChange={(e) => setEditingLoan({ ...editingLoan, loanType: e.target.value })}
            />
          </div>
          <div className="form-group">
            <select
              className="form-input"
              value={editingLoan.status}
              onChange={(e) => setEditingLoan({ ...editingLoan, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowEditForm(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update Loan
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loan Details Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '500px', width: '90%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}>
            <h3 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '25px', fontWeight: '600' }}>Loan Details</h3>
            
            {/* Customer Information */}
            {loadingCustomer ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Loading customer details...</p>
            ) : customerDetails ? (
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '16px', color: '#0A2654', marginBottom: '15px', fontWeight: '600' }}>Customer Information</h4>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Customer ID</label>
                  <p style={{ fontSize: '16px', color: '#334155', margin: '0', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>{customerDetails.id}</p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Customer Name</label>
                  <p style={{ fontSize: '16px', color: '#334155', margin: '0', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>{customerDetails.name}</p>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '16px', color: '#0A2654', marginBottom: '15px', fontWeight: '600' }}>Customer Information</h4>
                <p style={{ color: '#dc2626', margin: '0' }}>Customer not found</p>
              </div>
            )}

            {/* Loan Information */}
            <h4 style={{ fontSize: '16px', color: '#0A2654', marginBottom: '15px', fontWeight: '600' }}>Loan Information</h4>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Loan ID</label>
              <p style={{ fontSize: '16px', color: '#334155', margin: '0', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>{selectedLoan.id}</p>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Loan Amount</label>
              <p style={{ fontSize: '16px', color: '#334155', margin: '0', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>{selectedLoan.loanAmount?.toLocaleString()}</p>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Loan Type</label>
              <p style={{ fontSize: '16px', color: '#334155', margin: '0', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>{selectedLoan.loanType}</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Loan Status</label>
              <span
                className="status-badge status-custom"
                style={{ backgroundColor: getStatusColor(selectedLoan.status), padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}
              >
                {selectedLoan.status}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={handleCloseModal} style={{ padding: '10px 20px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <p>Loading loans...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="loan-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer ID</th>
                <th>Loan Amount</th>
                <th>Loan Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.id}</td>
                    <td>{loan.customerId}</td>
                    <td>{loan.loanAmount}</td>
                    <td>{loan.loanType}</td>
                    <td>
                      <span
                        className="status-badge status-custom"
                        style={{ backgroundColor: getStatusColor(loan.status) }}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td>
                      <button className="view-btn" onClick={() => handleView(loan)}>
                        View
                      </button>
                      <button className="edit-btn" onClick={() => handleEdit(loan)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(loan.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data-cell">
                    {searchTerm ? 'No loans match your search' : 'No loans found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LoanPage;
