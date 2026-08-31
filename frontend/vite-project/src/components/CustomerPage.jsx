import { useEffect, useState } from 'react';

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phoneNumber: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch customers from backend on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
setValidationErrors({});
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };
  const validateCustomer = (customer) => {
  const errors = {};

  if (!customer.name.trim()) {
    errors.name = "Name is required";
  }

  if (!customer.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
    errors.email = "Enter a valid email";
  }

  if (!customer.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!/^\d{10}$/.test(customer.phoneNumber)) {
    errors.phoneNumber = "Phone number must be exactly 10 digits";
  }

  return errors;
};
  const handleAddCustomer = async () => {
    const errors = validateCustomer(newCustomer);

if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    return;
}

setValidationErrors({});
    try {
      setError(null);
      const response = await fetch('http://localhost:8080/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });
      if (!response.ok) {
        throw new Error('Failed to add customer');
      }
      // Refresh customer list
      fetchCustomers();
      // Reset form and close
      setNewCustomer({ name: '', email: '', phoneNumber: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error adding customer:', err);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        setError(null);
        const response = await fetch(`http://localhost:8080/customers/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete customer');
        }
        fetchCustomers();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting customer:', err);
      }
    }
  };
  const handleEdit = (customer) => {
    setEditingCustomer({ ...customer });
    setShowEditForm(true);
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };
  
  const handleUpdate = async () => {
    const errors = validateCustomer(editingCustomer);

if (Object.keys(errors).length > 0) {
  setValidationErrors(errors);
  return;
}

setValidationErrors({});
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCustomer.id,
          name: editingCustomer.name,
          email: editingCustomer.email,
          phoneNumber: editingCustomer.phoneNumber,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update customer');
      }
      fetchCustomers();
      setEditingCustomer(null);
      setShowEditForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating customer:', err);
    }
  };
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Customer Management</h2>
        <div className="page-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search customer by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            Add Customer
          </button>
        </div>
      </div>

      {/* Add Customer Form */}
      {showAddForm && (
        <div className="add-customer-form">
          <h3>Add New Customer</h3>
          <div className="form-group">
  <input
    type="text"
    className="form-input"
    placeholder="Customer Name"
    value={newCustomer.name}
    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
  />
  {validationErrors.name && (
    <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
      {validationErrors.name}
    </p>
  )}
</div>
          <div className="form-group">
  <input
    type="email"
    className="form-input"
    placeholder="Email Address"
    value={newCustomer.email}
    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
  />
  {validationErrors.email && (
    <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
      {validationErrors.email}
    </p>
  )}
</div>
         <div className="form-group">
  <input
    type="tel"
    className="form-input"
    placeholder="Phone Number"
    value={newCustomer.phoneNumber}
    onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
  />
  {validationErrors.phoneNumber && (
    <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
      {validationErrors.phoneNumber}
    </p>
  )}
</div>
          <div className="form-actions">
            <button
  className="btn btn-secondary"
  onClick={() => {
    setValidationErrors({});
    setShowAddForm(false);
  }}
>
  Cancel
</button>
            <button className="btn btn-primary" onClick={handleAddCustomer}>
              Save Customer
            </button>
          </div>
        </div>
      )}

      {/* Edit Customer Form */}
      {showEditForm && editingCustomer && (
        <div className="add-customer-form">
          <h3>Edit Customer</h3>
         <div className="form-group">
  <input
    type="text"
    className="form-input"
    placeholder="Customer Name"
    value={editingCustomer.name}
    onChange={(e) => {
      setEditingCustomer({ ...editingCustomer, name: e.target.value });
      setValidationErrors({ ...validationErrors, name: "" });
    }}
  />

  {validationErrors.name && (
    <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
      {validationErrors.name}
    </p>
  )}
</div>
          <div className="form-group">
  <input
    type="email"
    className="form-input"
    placeholder="Email Address"
    value={editingCustomer.email}
    onChange={(e) => {
      setEditingCustomer({ ...editingCustomer, email: e.target.value });
      setValidationErrors({ ...validationErrors, email: "" });
    }}
  />

  {validationErrors.email && (
    <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
      {validationErrors.email}
    </p>
  )}
</div>
          <div className="form-group">
  <input
    type="tel"
    className="form-input"
    placeholder="Phone Number"
    value={editingCustomer.phoneNumber}
    onChange={(e) => {
      setEditingCustomer({ ...editingCustomer, phoneNumber: e.target.value });
      setValidationErrors({ ...validationErrors, phoneNumber: "" });
    }}
  />

  {validationErrors.phoneNumber && (
    <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
      {validationErrors.phoneNumber}
    </p>
  )}
</div>
          <div className="form-actions">
            <button
  className="btn btn-secondary"
  onClick={() => {
    setValidationErrors({});
    setShowEditForm(false);
  }}
>
  Cancel
</button>
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update Customer
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

      {/* Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '500px', width: '90%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}>
            <h3 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '25px', fontWeight: '600' }}>Customer Details</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Customer ID</label>
              <p style={{ fontSize: '16px', color: '#334155', margin: '0', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>{selectedCustomer.id}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Name</label>
              <p style={{ fontSize: '16px', color: '#334155', margin: '0', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>{selectedCustomer.name}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Email</label>
              <p style={{ fontSize: '16px', color: '#334155', margin: '0', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>{selectedCustomer.email}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Phone Number</label>
              <p style={{ fontSize: '16px', color: '#334155', margin: '0', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>{selectedCustomer.phoneNumber}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px', fontWeight: '500' }}>Status</label>
              <span
                className={`status-badge ${
                  selectedCustomer.status === 'Active' ? 'status-active' : 'status-inactive'
                }`}
              >
                {selectedCustomer.status || 'Active'}
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
          <p>Loading customers...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phoneNumber}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          customer.status === 'Active' ? 'status-active' : 'status-inactive'
                        }`}
                      >
                        {customer.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <button className="view-btn" onClick={() => handleView(customer)}>
                        View
                      </button>
                      <button className="edit-btn" onClick={() => handleEdit(customer)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data-cell">
                    {searchTerm ? 'No customers match your search' : 'No customers found'}
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

export default CustomerPage;
  const handleEdit = (customer) => {
    console.log('handleEdit called with customer:', customer);
    console.log('customer.phoneNumber:', customer.phoneNumber);
    setEditingCustomer({ ...customer });
    setShowEditForm(true);
  };
  const handleUpdate = async () => {
    try {
      setError(null);
      console.log('handleUpdate - editingCustomer:', editingCustomer);
      console.log('handleUpdate - phoneNumber value:', editingCustomer.phoneNumber);
      const body = {
        id: editingCustomer.id,
        name: editingCustomer.name,
        email: editingCustomer.email,
        phoneNumber: editingCustomer.phoneNumber,
      };
      console.log('handleUpdate - JSON body:', body);
      const response = await fetch(`http://localhost:8080/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      console.log('handleUpdate - response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to update customer');
      }
      fetchCustomers();
      setEditingCustomer(null);
      setShowEditForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating customer:', err);
    }
  };
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      console.log('fetchCustomers - received data:', data);
      setCustomers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };
