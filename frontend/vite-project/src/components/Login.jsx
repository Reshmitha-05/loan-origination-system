import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [loginMode, setLoginMode] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  // Mock customer accounts storage
  const [customerAccounts, setCustomerAccounts] = useState(() => {
    const stored = localStorage.getItem('customerAccounts');
    return stored ? JSON.parse(stored) : [];
  });

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');

    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      onLogin('admin', 'Admin User');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleCustomerLogin = (e) => {
    e.preventDefault();
    setError('');

    const customer = customerAccounts.find(c => c.email === email && c.password === password);
    if (customer) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'customer');
      localStorage.setItem('customerEmail', email);
      onLogin('customer', customer.name);
    } else {
      setError('Invalid email or password');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validation
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Check if email already exists
    if (customerAccounts.some(c => c.email === email)) {
      setError('Email already registered. Please login.');
      return;
    }

    // Create new customer account
    const newCustomer = {
      id: Date.now(),
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString()
    };

    const updatedAccounts = [...customerAccounts, newCustomer];
    setCustomerAccounts(updatedAccounts);
    localStorage.setItem('customerAccounts', JSON.stringify(updatedAccounts));

    // Auto-login after signup
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'customer');
    localStorage.setItem('customerEmail', email);
    onLogin('customer', name);
  };

  const switchToSignup = () => {
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Role Selection Tabs */}
        {!showSignup && (
          <div className="login-tabs">
            <button
              className={`login-tab ${loginMode === 'admin' ? 'active' : ''}`}
              onClick={() => { setLoginMode('admin'); setError(''); }}
            >
              Admin
            </button>
            <button
              className={`login-tab ${loginMode === 'customer' ? 'active' : ''}`}
              onClick={() => { setLoginMode('customer'); setError(''); }}
            >
              Customer
            </button>
          </div>
        )}

        <div className="login-header">
          <h2 className="login-title">Loan Origination System</h2>
          <p className="login-subtitle">
            {showSignup ? 'Create your account' : 
             loginMode === 'admin' ? 'Please sign in to continue' : 
             'Please sign in to continue'}
          </p>
        </div>

        {/* Admin Login Form */}
        {loginMode === 'admin' && !showSignup && (
          <form className="login-form" onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        )}

        {/* Customer Login Form */}
        {loginMode === 'customer' && !showSignup && (
          <form className="login-form" onSubmit={handleCustomerLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            
            <div className="signup-link">
              <p>Don't have an account? <button type="button" className="link-btn" onClick={switchToSignup}>Create an account</button></p>
            </div>
          </form>
        )}

        {/* Customer Signup Form */}
        {showSignup && (
          <form className="login-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Create a password (min 6 characters)"
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                minLength="6"
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create Account
              </button>
            </div>
            
            <div className="signup-link">
              <p>Already have an account? <button type="button" className="link-btn" onClick={switchToLogin}>Sign in</button></p>
            </div>
          </form>
        )}

        {/* Login Footer (Admin info) */}
        {loginMode === 'admin' && !showSignup && (
          <div className="login-footer">
            <p className="login-note">
              <strong>Admin Credentials:</strong> admin / admin123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
