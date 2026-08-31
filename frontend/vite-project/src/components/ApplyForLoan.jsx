import { useState } from 'react';

function ApplyForLoan() {
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load applications from localStorage
  const [applications, setApplications] = useState(() => {
    const stored = localStorage.getItem('customerApplications');
    return stored ? JSON.parse(stored) : [];
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!loanType) {
      setError('Please select a loan type');
      return;
    }
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      setError('Please enter a valid loan amount');
      return;
    }
    if (parseFloat(loanAmount) > 10000000) {
      setError('Maximum loan amount is ₹1,00,00,000');
      return;
    }
    if (!purpose || purpose.trim().length < 10) {
      setError('Please provide a detailed purpose (minimum 10 characters)');
      return;
    }

    // Get current customer email from localStorage
    const customerEmail = localStorage.getItem('customerEmail');

    // Create new application
    const newApplication = {
      id: Date.now(),
      customerId: customerEmail,
      customerName: localStorage.getItem('userName') || 'Customer',
      loanType,
      loanAmount: parseFloat(loanAmount),
      purpose,
      status: 'Pending',
      appliedDate: new Date().toLocaleDateString('en-IN'),
      appliedTime: new Date().toLocaleTimeString('en-IN')
    };

    // Save to localStorage
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('customerApplications', JSON.stringify(updatedApplications));

    // Show success
    setSuccess(true);
    setLoanType('');
    setLoanAmount('');
    setPurpose('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Apply for Loan</h2>
        <p className="page-subtitle">Fill in the details to submit a new loan application.</p>
      </div>

      <div className="apply-loan-container">
        {success ? (
          <div className="success-message">
            <h3>Application Submitted Successfully!</h3>
            <p>Your loan application has been received and is currently under review.</p>
            <p className="application-id">Application ID: <strong>{new Date().getTime()}</strong></p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => setSuccess(false)}>
                Submit Another Application
              </button>
              <button className="btn btn-secondary" onClick={() => window.location.hash = '#/my-applications'}>
                View My Applications
              </button>
            </div>
          </div>
        ) : (
          <div className="apply-loan-form">
            <h3>Loan Application Form</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Loan Type</label>
                <select
                  className="form-input"
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                >
                  <option value="">Select Loan Type</option>
                  <option value="Personal">Personal Loan</option>
                  <option value="Home">Home Loan</option>
                  <option value="Car">Car Loan</option>
                  <option value="Student">Student Loan</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Requested Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter loan amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  min="1000"
                  step="1000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Purpose / Reason</label>
                <textarea
                  className="form-input"
                  placeholder="Describe the purpose of your loan..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows="4"
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Submit Application
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setLoanType('');
                  setLoanAmount('');
                  setPurpose('');
                  setError('');
                }}>
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplyForLoan;
