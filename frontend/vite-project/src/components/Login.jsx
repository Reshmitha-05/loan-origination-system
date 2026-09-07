import { useState } from 'react';

import {
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaLock,
  FaShieldAlt,
  FaUser,
  FaUserShield
} from 'react-icons/fa';

import './Login.css';

function Login({ onLogin }) {
  const [loginMode, setLoginMode] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  const [mousePosition, setMousePosition] = useState({
    x: 0.5,
    y: 0.5
  });

  // Mock customer accounts storage
  const [customerAccounts, setCustomerAccounts] = useState(() => {
    const stored = localStorage.getItem('customerAccounts');
    return stored ? JSON.parse(stored) : [];
  });

  // =========================================
  // MOUSE INTERACTION
  // =========================================

  const handleMouseMove = (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    setMousePosition({
      x,
      y
    });
  };

  // =========================================
  // ADMIN LOGIN
  // =========================================

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');

    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');

      localStorage.setItem('loggedInAdminName', 'Admin User');
      localStorage.setItem('loggedInAdminEmail', 'admin@los.com');

      onLogin('admin', 'Admin User');
    } else {
      setError('Invalid username or password');
    }
  };

  // =========================================
  // CUSTOMER LOGIN
  // =========================================

  const handleCustomerLogin = (e) => {
    e.preventDefault();
    setError('');

    const customer = customerAccounts.find(
      (c) => c.email === email && c.password === password
    );

    if (customer) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'customer');

      localStorage.setItem('customerEmail', email);

      localStorage.setItem('loggedInCustomerEmail', email);
      localStorage.setItem('loggedInCustomerName', customer.name);

      onLogin('customer', customer.name);
    } else {
      setError('Invalid email or password');
    }
  };

  // =========================================
  // CUSTOMER SIGNUP
  // =========================================

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.target);

    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

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

    if (customerAccounts.some((c) => c.email === email)) {
      setError('Email already registered. Please login.');
      return;
    }

    const newCustomer = {
      id: Date.now(),
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString()
    };

    const updatedAccounts = [
      ...customerAccounts,
      newCustomer
    ];

    setCustomerAccounts(updatedAccounts);

    localStorage.setItem(
      'customerAccounts',
      JSON.stringify(updatedAccounts)
    );

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'customer');

    localStorage.setItem('customerEmail', email);

    localStorage.setItem(
      'loggedInCustomerEmail',
      email
    );

    localStorage.setItem(
      'loggedInCustomerName',
      name
    );

    onLogin('customer', name);
  };

  // =========================================
  // SCREEN SWITCHING
  // =========================================

  const switchToSignup = () => {
    setShowSignup(true);
    setError('');
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setError('');
  };

  const switchLoginMode = (mode) => {
    setLoginMode(mode);
    setError('');
    setPassword('');
  };

  // =========================================
  // DOT PARALLAX
  // =========================================

  const dots = [
    { left: '7%', top: '15%', size: 7, strength: 18 },
    { left: '16%', top: '68%', size: 11, strength: 25 },
    { left: '24%', top: '30%', size: 5, strength: 14 },
    { left: '32%', top: '82%', size: 8, strength: 22 },
    { left: '43%', top: '12%', size: 10, strength: 16 },
    { left: '50%', top: '76%', size: 5, strength: 20 },
    { left: '58%', top: '22%', size: 7, strength: 17 },
    { left: '66%', top: '72%', size: 10, strength: 24 },
    { left: '75%', top: '14%', size: 5, strength: 15 },
    { left: '84%', top: '35%', size: 8, strength: 21 },
    { left: '91%', top: '68%', size: 6, strength: 17 },
    { left: '93%', top: '18%', size: 11, strength: 25 }
  ];

  return (
    <div
      className="los-login-page"
      onMouseMove={handleMouseMove}
    >

      {/* =====================================
          BACKGROUND DOTS
      ===================================== */}

      <div className="login-dots-layer">

        {dots.map((dot, index) => {

          const moveX =
            (mousePosition.x - 0.5) *
            dot.strength;

          const moveY =
            (mousePosition.y - 0.5) *
            dot.strength;

          return (
            <span
              key={index}
              className="cursor-dot"
              style={{
                left: dot.left,
                top: dot.top,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                transform: `translate(
                  ${moveX}px,
                  ${moveY}px
                )`
              }}
            />
          );
        })}

      </div>


      {/* =====================================
          CURSOR GLOW
      ===================================== */}

      <div
        className="cursor-glow"
        style={{
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`
        }}
      />


      {/* =====================================
          BACKGROUND CIRCLES
      ===================================== */}

      <div className="background-orbit orbit-one"></div>
      <div className="background-orbit orbit-two"></div>
      <div className="background-orbit orbit-three"></div>


      {/* =====================================
          LEFT HERO SECTION
      ===================================== */}

      <section className="login-hero">

        <div className="hero-inner">

          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>

            <FaShieldAlt />

            SECURE LOAN MANAGEMENT
          </div>


          <h1 className="hero-title">

            Smarter lending.

            <br />

            <span>
              Simpler decisions.
            </span>

          </h1>


          <p className="hero-description">
            A streamlined platform for managing loan
            applications, customer information and
            lending decisions in one place.
          </p>


          {/* =================================
              FLOATING LOAN CARD
          ================================= */}

          <div className="hero-loan-wrapper">

            <div className="loan-glow"></div>

            <div className="hero-loan-card">

              <div className="loan-card-top">

                <div>

                  <span className="loan-label">
                    LOAN OVERVIEW
                  </span>

                  <div className="loan-amount">
                    ₹8,50,000
                  </div>

                </div>

                <div className="loan-icon">
                  <FaChartLine />
                </div>

              </div>


              <div className="loan-progress-area">

                <div className="loan-progress-labels">
                  <span>
                    Application progress
                  </span>

                  <span>
                    75%
                  </span>
                </div>

                <div className="loan-progress-track">

                  <div className="loan-progress-bar"></div>

                </div>

              </div>


              <div className="loan-card-bottom">

                <div>

                  <span>
                    Current status
                  </span>

                  <strong>
                    Under Review
                  </strong>

                </div>


                <div className="active-status">

                  <span className="active-dot"></span>

                  Active

                </div>

              </div>

            </div>

          </div>


          {/* =================================
              FEATURES
          ================================= */}

          <div className="hero-features">

            <div className="hero-feature">

              <div className="feature-check">
                <FaCheckCircle />
              </div>

              <div>

                <strong>
                  Simple application management
                </strong>

                <span>
                  Track your loan journey with ease
                </span>

              </div>

            </div>


            <div className="hero-feature">

              <div className="feature-check">
                <FaShieldAlt />
              </div>

              <div>

                <strong>
                  Secure customer information
                </strong>

                <span>
                  Your information stays protected
                </span>

              </div>

            </div>

          </div>


          <div className="hero-footer">
            <span>Secure</span>
            <span>•</span>
            <span>Simple</span>
            <span>•</span>
            <span>Reliable</span>
          </div>

        </div>

      </section>


      {/* =====================================
          LOGIN AREA
      ===================================== */}

      <section className="login-form-section">

        <div className="login-card">


          {/* =================================
              ROLE SWITCH
          ================================= */}

          {!showSignup && (

            <div className="login-tabs">

              <button
                type="button"
                className={`login-tab ${
                  loginMode === 'admin'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  switchLoginMode('admin')
                }
              >

                <FaUserShield />

                <span>
                  Admin
                </span>

              </button>


              <button
                type="button"
                className={`login-tab ${
                  loginMode === 'customer'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  switchLoginMode('customer')
                }
              >

                <FaUser />

                <span>
                  Customer
                </span>

              </button>

            </div>

          )}


          {/* =================================
              LOGIN HEADER
          ================================= */}

          <div
            className="login-header"
            key={`${loginMode}-${showSignup}`}
          >

            <div className="login-header-icon">

              {showSignup ? (
                <FaUser />
              ) : loginMode === 'admin' ? (
                <FaUserShield />
              ) : (
                <FaUser />
              )}

            </div>


            <div>

              <p className="login-eyebrow">

                {showSignup
                  ? 'Customer Registration'
                  : loginMode === 'admin'
                  ? 'Administrator Portal'
                  : 'Customer Portal'}

              </p>


              <h2 className="login-title">

                {showSignup
                  ? 'Create your account'
                  : 'Welcome back'}

              </h2>


              <p className="login-subtitle">

                {showSignup
                  ? 'Register to manage your loan applications'
                  : 'Sign in to continue to your account'}

              </p>

            </div>

          </div>


          {/* =================================
              ADMIN LOGIN
          ================================= */}

          {loginMode === 'admin' &&
            !showSignup && (

              <form
                className="login-form"
                onSubmit={handleAdminLogin}
                key="admin-login"
              >

                <div className="form-group">

                  <label className="form-label">
                    Username
                  </label>

                  <div className="input-wrapper">

                    <FaUser className="input-icon" />

                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label className="form-label">
                    Password
                  </label>

                  <div className="input-wrapper">

                    <FaLock className="input-icon" />

                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>


                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}


                <button
                  type="submit"
                  className="login-submit-button"
                >

                  <span>
                    Sign In
                  </span>

                  <FaArrowRight />

                </button>

              </form>

            )}


          {/* =================================
              CUSTOMER LOGIN
          ================================= */}

          {loginMode === 'customer' &&
            !showSignup && (

              <form
                className="login-form"
                onSubmit={handleCustomerLogin}
                key="customer-login"
              >

                <div className="form-group">

                  <label className="form-label">
                    Email Address
                  </label>

                  <div className="input-wrapper">

                    <FaUser className="input-icon" />

                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label className="form-label">
                    Password
                  </label>

                  <div className="input-wrapper">

                    <FaLock className="input-icon" />

                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>


                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}


                <button
                  type="submit"
                  className="login-submit-button"
                >

                  <span>
                    Sign In
                  </span>

                  <FaArrowRight />

                </button>


                <div className="signup-link">

                  <span>
                    Don't have an account?
                  </span>

                  <button
                    type="button"
                    className="link-btn"
                    onClick={switchToSignup}
                  >
                    Create an account
                  </button>

                </div>

              </form>

            )}


          {/* =================================
              SIGNUP
          ================================= */}

          {showSignup && (

            <form
              className="login-form signup-form"
              onSubmit={handleSignup}
              key="signup"
            >

              <div className="form-group">

                <label className="form-label">
                  Full Name
                </label>

                <div className="input-wrapper">

                  <FaUser className="input-icon" />

                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />

                </div>

              </div>


              <div className="form-group">

                <label className="form-label">
                  Email Address
                </label>

                <div className="input-wrapper">

                  <FaUser className="input-icon" />

                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />

                </div>

              </div>


              <div className="form-group">

                <label className="form-label">
                  Phone Number
                </label>

                <div className="input-wrapper">

                  <FaUser className="input-icon" />

                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="Enter your phone number"
                    required
                  />

                </div>

              </div>


              <div className="form-group">

                <label className="form-label">
                  Password
                </label>

                <div className="input-wrapper">

                  <FaLock className="input-icon" />

                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="Create a password"
                    minLength="6"
                    required
                  />

                </div>

              </div>


              <div className="form-group">

                <label className="form-label">
                  Confirm Password
                </label>

                <div className="input-wrapper">

                  <FaLock className="input-icon" />

                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm your password"
                    minLength="6"
                    required
                  />

                </div>

              </div>


              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}


              <button
                type="submit"
                className="login-submit-button"
              >

                <span>
                  Create Account
                </span>

                <FaArrowRight />

              </button>


              <div className="signup-link">

                <span>
                  Already have an account?
                </span>

                <button
                  type="button"
                  className="link-btn"
                  onClick={switchToLogin}
                >
                  Sign in
                </button>

              </div>

            </form>

          )}


          {/* =================================
              ADMIN DEMO CREDENTIALS
          ================================= */}

          {loginMode === 'admin' &&
            !showSignup && (

              <div className="login-footer">

                <div className="credentials-icon">
                  <FaShieldAlt />
                </div>

                <div>

                  <span className="credentials-label">
                    Demo administrator access
                  </span>

                  <p>
                    <strong>admin</strong>
                    <span> / </span>
                    <strong>admin123</strong>
                  </p>

                </div>

              </div>

            )}


          {/* =================================
              SECURITY NOTE
          ================================= */}

          <div className="security-note">

            <FaLock />

            <span>
              Your session is protected and securely managed.
            </span>

          </div>

        </div>

      </section>


      {/* =====================================
          STYLES
      ===================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }


        /* =====================================
           FULL PAGE
        ===================================== */

        .los-login-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;

          display: grid;
          grid-template-columns: 55% 45%;

          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(56, 104, 185, 0.24),
              transparent 32%
            ),
            radial-gradient(
              circle at 75% 80%,
              rgba(39, 82, 155, 0.20),
              transparent 35%
            ),
            #0b2854;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* =====================================
           DOTS
        ===================================== */

        .login-dots-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .cursor-dot {
          position: absolute;
          display: block;
          border-radius: 50%;

          background: rgba(161, 194, 255, 0.42);

          box-shadow:
            0 0 12px rgba(132, 174, 255, 0.12);

          transition:
            transform 0.35s cubic-bezier(
              0.22,
              1,
              0.36,
              1
            );

          animation:
            dotFloat 5s ease-in-out infinite;
        }

        .cursor-dot:nth-child(2n) {
          animation-delay: -1.5s;
          opacity: 0.65;
        }

        .cursor-dot:nth-child(3n) {
          animation-delay: -3s;
          opacity: 0.45;
        }

        @keyframes dotFloat {

          0%,
          100% {
            margin-top: 0;
          }

          50% {
            margin-top: -8px;
          }

        }


        /* =====================================
           CURSOR GLOW
        ===================================== */

        .cursor-glow {
          position: absolute;

          width: 280px;
          height: 280px;

          border-radius: 50%;

          transform:
            translate(-50%, -50%);

          background:
            radial-gradient(
              circle,
              rgba(101, 154, 255, 0.12) 0%,
              rgba(101, 154, 255, 0.05) 35%,
              transparent 70%
            );

          pointer-events: none;
          z-index: 0;

          transition:
            left 0.45s ease-out,
            top 0.45s ease-out;
        }


        /* =====================================
           BACKGROUND ORBITS
        ===================================== */

        .background-orbit {
          position: absolute;
          border: 1px solid rgba(170, 201, 255, 0.08);
          border-radius: 50%;
          pointer-events: none;
        }

        .orbit-one {
          width: 620px;
          height: 620px;
          left: -260px;
          top: -220px;

          animation:
            orbitFloat 16s ease-in-out infinite;
        }

        .orbit-two {
          width: 430px;
          height: 430px;
          left: 25%;
          bottom: -300px;

          animation:
            orbitFloat 20s ease-in-out infinite reverse;
        }

        .orbit-three {
          width: 300px;
          height: 300px;
          right: -160px;
          top: 5%;

          border-color:
            rgba(170, 201, 255, 0.06);

          animation:
            orbitFloat 13s ease-in-out infinite;
        }

        @keyframes orbitFloat {

          0%,
          100% {
            transform:
              translate(0, 0)
              rotate(0deg);
          }

          50% {
            transform:
              translate(18px, -15px)
              rotate(5deg);
          }

        }


        /* =====================================
           HERO
        ===================================== */

        .login-hero {
          position: relative;
          z-index: 1;

          min-height: 100vh;

          display: flex;
          align-items: center;

          padding:
            45px
            50px
            45px
            8vw;

          color: white;
        }

        .hero-inner {
          width: 100%;
          max-width: 650px;

          animation:
            heroEnter 0.85s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
        }

        @keyframes heroEnter {

          from {
            opacity: 0;
            transform:
              translateX(-35px);
          }

          to {
            opacity: 1;
            transform:
              translateX(0);
          }

        }


        /* =====================================
           HERO EYEBROW
        ===================================== */

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;

          color: #a9c6ff;

          font-size: 11px;
          font-weight: 650;

          letter-spacing: 1.2px;

          margin-bottom: 20px;

          animation:
            fadeUp 0.7s
            0.1s ease both;
        }

        .hero-eyebrow svg {
          font-size: 11px;
        }

        .eyebrow-line {
          width: 27px;
          height: 1px;
          background: #86adf6;
        }


        /* =====================================
           HERO TITLE
        ===================================== */

        .hero-title {
          margin: 0;

          color: white;

          font-size:
            clamp(
              42px,
              4.3vw,
              64px
            );

          line-height: 1.06;

          letter-spacing: -2.2px;

          font-weight: 750;

          animation:
            fadeUp 0.8s
            0.18s ease both;
        }

        .hero-title span {
          color: #91b9ff;

          display: inline-block;

          animation:
            titleGlow 4s
            ease-in-out
            infinite;
        }

        @keyframes titleGlow {

          0%,
          100% {
            opacity: 0.88;
          }

          50% {
            opacity: 1;
          }

        }


        /* =====================================
           DESCRIPTION
        ===================================== */

        .hero-description {
          max-width: 560px;

          margin:
            23px
            0
            0;

          color: #b9cbe5;

          font-size: 14px;

          line-height: 1.75;

          font-weight: 400;

          animation:
            fadeUp 0.8s
            0.28s ease both;
        }

        @keyframes fadeUp {

          from {
            opacity: 0;
            transform:
              translateY(14px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }

        }


        /* =====================================
           LOAN VISUAL
        ===================================== */

        .hero-loan-wrapper {
          width: 100%;
          max-width: 455px;

          position: relative;

          margin-top: 31px;

          animation:
            loanEnter 0.9s
            0.35s ease both;
        }

        @keyframes loanEnter {

          from {
            opacity: 0;
            transform:
              translateY(25px)
              rotateX(8deg);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              rotateX(0);
          }

        }

        .loan-glow {
          position: absolute;

          width: 170px;
          height: 170px;

          right: 20px;
          top: -30px;

          border-radius: 50%;

          background:
            rgba(
              100,
              158,
              255,
              0.15
            );

          filter: blur(45px);

          pointer-events: none;
        }

        .hero-loan-card {
          position: relative;

          padding:
            21px
            23px;

          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.12),
              rgba(255,255,255,0.055)
            );

          border:
            1px solid
            rgba(255,255,255,0.15);

          backdrop-filter:
            blur(14px);

          box-shadow:
            0 25px 55px
            rgba(0,0,0,0.16);

          animation:
            loanFloat 5s
            ease-in-out
            infinite;

          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .hero-loan-card:hover {
          transform:
            translateY(-7px)
            scale(1.015);

          box-shadow:
            0 32px 65px
            rgba(0,0,0,0.20);
        }

        @keyframes loanFloat {

          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-5px);
          }

        }

        .loan-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .loan-label {
          display: block;

          color: #a9bbd5;

          font-size: 9px;

          letter-spacing: 0.7px;

          margin-bottom: 6px;
        }

        .loan-amount {
          font-size: 25px;

          font-weight: 720;

          color: white;
        }

        .loan-icon {
          width: 38px;
          height: 38px;

          border-radius: 10px;

          background:
            rgba(255,255,255,0.10);

          color: #a9c6ff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 14px;

          transition:
            transform 0.3s ease;
        }

        .hero-loan-card:hover
        .loan-icon {
          transform:
            rotate(-5deg)
            scale(1.08);
        }

        .loan-progress-area {
          margin-top: 21px;
        }

        .loan-progress-labels {
          display: flex;
          justify-content: space-between;

          color: #9eb1cc;

          font-size: 9px;

          margin-bottom: 7px;
        }

        .loan-progress-track {
          height: 5px;

          border-radius: 10px;

          background:
            rgba(255,255,255,0.10);

          overflow: hidden;
        }

        .loan-progress-bar {
          width: 75%;
          height: 100%;

          border-radius: 10px;

          background:
            linear-gradient(
              90deg,
              #78a8ff,
              #b1ccff
            );

          animation:
            progressLoad 1.3s
            0.8s ease both;
        }

        @keyframes progressLoad {

          from {
            width: 0;
          }

          to {
            width: 75%;
          }

        }

        .loan-card-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          margin-top: 18px;
        }

        .loan-card-bottom > div:first-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .loan-card-bottom span {
          color: #8499b7;
          font-size: 9px;
        }

        .loan-card-bottom strong {
          color: #e9f1ff;
          font-size: 11px;
          font-weight: 600;
        }

        .active-status {
          display: flex;
          align-items: center;
          gap: 6px;

          color: #b7cefa;

          font-size: 9px;
          font-weight: 600;
        }

        .active-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #8db7ff;

          box-shadow:
            0 0 0 4px
            rgba(141,183,255,0.10);

          animation:
            statusPulse 2s
            ease-in-out
            infinite;
        }

        @keyframes statusPulse {

          0%,
          100% {
            box-shadow:
              0 0 0 3px
              rgba(141,183,255,0.08);
          }

          50% {
            box-shadow:
              0 0 0 6px
              rgba(141,183,255,0.02);
          }

        }


        /* =====================================
           FEATURES
        ===================================== */

        .hero-features {
          display: flex;

          gap: 30px;

          margin-top: 27px;

          animation:
            fadeUp 0.8s
            0.55s ease both;
        }

        .hero-feature {
          display: flex;
          align-items: flex-start;

          gap: 9px;

          max-width: 245px;

          transition:
            transform 0.25s ease;
        }

        .hero-feature:hover {
          transform:
            translateX(5px);
        }

        .feature-check {
          width: 26px;
          height: 26px;

          flex-shrink: 0;

          border-radius: 7px;

          background:
            rgba(255,255,255,0.08);

          color: #9fc2ff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 9px;
        }

        .hero-feature strong {
          display: block;

          color: #e8effa;

          font-size: 10px;

          font-weight: 600;

          margin-bottom: 3px;
        }

        .hero-feature span {
          color: #91a5c2;

          font-size: 9px;

          line-height: 1.4;
        }


        /* =====================================
           HERO FOOTER
        ===================================== */

        .hero-footer {
          display: flex;
          gap: 8px;

          margin-top: 28px;

          color: #7189aa;

          font-size: 9px;

          animation:
            fadeUp 0.8s
            0.65s ease both;
        }


        /* =====================================
           LOGIN SECTION
        ===================================== */

        .login-form-section {
          position: relative;
          z-index: 2;

          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          padding:
            40px
            7vw
            40px
            30px;
        }


        /* =====================================
           WHITE LOGIN CARD
        ===================================== */

        .login-card {
          width: 100%;
          max-width: 470px;

          padding:
            32px
            36px
            25px;

          background:
            rgba(
              255,
              255,
              255,
              0.98
            );

          border:
            1px solid
            rgba(226,232,240,0.9);

          border-radius: 19px;

          box-shadow:
            0 30px 80px
            rgba(0,0,0,0.20),
            0 7px 25px
            rgba(0,0,0,0.07);

          animation:
            cardEnter 0.85s
            0.15s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;

          transition:
            transform 0.4s ease,
            box-shadow 0.4s ease;
        }

        .login-card:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 35px 90px
            rgba(0,0,0,0.22),
            0 8px 28px
            rgba(0,0,0,0.08);
        }

        @keyframes cardEnter {

          from {
            opacity: 0;

            transform:
              translateX(35px)
              scale(0.98);
          }

          to {
            opacity: 1;

            transform:
              translateX(0)
              scale(1);
          }

        }


        /* =====================================
           TABS
        ===================================== */

        .login-tabs {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          padding: 4px;

          background: #f3f6fa;

          border:
            1px solid #e1e7ef;

          border-radius: 11px;

          margin-bottom: 28px;
        }

        .login-tab {
          height: 44px;

          border: none;

          border-radius: 8px;

          background: transparent;

          color: #69778c;

          font-family: inherit;

          font-size: 13px;

          font-weight: 600;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          cursor: pointer;

          transition:
            all 0.3s ease;
        }

        .login-tab:hover {
          color: #17396e;

          background:
            rgba(
              255,
              255,
              255,
              0.65
            );
        }

        .login-tab.active {
          background: #0d2d5c;

          color: white;

          box-shadow:
            0 5px 14px
            rgba(
              13,
              45,
              92,
              0.20
            );

          transform:
            translateY(-1px);
        }

        .login-tab:active {
          transform:
            scale(0.98);
        }


        /* =====================================
           LOGIN HEADER
        ===================================== */

        .login-header {
          display: flex;

          align-items: flex-start;

          gap: 13px;

          margin-bottom: 27px;

          animation:
            formHeaderIn 0.35s ease;
        }

        @keyframes formHeaderIn {

          from {
            opacity: 0;
            transform:
              translateY(8px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }

        }

        .login-header-icon {
          width: 41px;
          height: 41px;

          flex-shrink: 0;

          border-radius: 10px;

          background: #edf4ff;

          color: #1d4ed8;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 15px;

          transition:
            transform 0.3s ease;
        }

        .login-header:hover
        .login-header-icon {
          transform:
            rotate(-4deg)
            scale(1.05);
        }

        .login-eyebrow {
          margin:
            1px
            0
            5px;

          color: #5273a4;

          font-size: 9px;

          font-weight: 650;

          text-transform: uppercase;

          letter-spacing: 0.7px;
        }

        .login-title {
          margin: 0;

          color: #102c57;

          font-size: 25px;

          line-height: 1.2;

          font-weight: 720;

          letter-spacing: -0.4px;
        }

        .login-subtitle {
          margin:
            6px
            0
            0;

          color: #7c899b;

          font-size: 11px;

          line-height: 1.5;

          font-weight: 400;
        }


        /* =====================================
           FORM
        ===================================== */

        .login-form {
          animation:
            formEnter 0.4s
            ease both;
        }

        @keyframes formEnter {

          from {
            opacity: 0;
            transform:
              translateY(10px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }

        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          display: block;

          margin-bottom: 7px;

          color: #273852;

          font-size: 11px;

          font-weight: 600;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;

          left: 13px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #9aa8bb;

          font-size: 11px;

          pointer-events: none;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .form-input {
          width: 100%;

          height: 47px;

          padding:
            0
            14px
            0
            37px;

          border:
            1px solid #dce3ec;

          border-radius: 9px;

          outline: none;

          background: #fbfcfe;

          color: #1f2937;

          font-family: inherit;

          font-size: 12px;

          font-weight: 400;

          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease,
            transform 0.2s ease;
        }

        .form-input::placeholder {
          color: #a5afbd;
        }

        .form-input:hover {
          border-color:
            #c5d2e3;
        }

        .form-input:focus {
          background: white;

          border-color:
            #3974d8;

          box-shadow:
            0 0 0 3px
            rgba(
              57,
              116,
              216,
              0.10
            );

          transform:
            translateY(-1px);
        }

        .input-wrapper:focus-within
        .input-icon {
          color: #2563eb;

          transform:
            translateY(-50%)
            scale(1.08);
        }


        /* =====================================
           ERROR
        ===================================== */

        .error-message {
          padding:
            10px
            12px;

          margin:
            -2px
            0
            14px;

          border-radius: 8px;

          background: #f5f7fa;

          border:
            1px solid #dfe5ec;

          color: #5b687b;

          font-size: 10px;

          font-weight: 500;

          animation:
            errorShake 0.35s ease;
        }

        @keyframes errorShake {

          0%,
          100% {
            transform:
              translateX(0);
          }

          25% {
            transform:
              translateX(-4px);
          }

          75% {
            transform:
              translateX(4px);
          }

        }


        /* =====================================
           BUTTON
        ===================================== */

        .login-submit-button {
          width: 100%;

          height: 47px;

          border: none;

          border-radius: 9px;

          background: #0d2d5c;

          color: white;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 10px;

          font-family: inherit;

          font-size: 12px;

          font-weight: 650;

          cursor: pointer;

          box-shadow:
            0 7px 17px
            rgba(
              13,
              45,
              92,
              0.18
            );

          transition:
            transform 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
        }

        .login-submit-button svg {
          font-size: 9px;

          transition:
            transform 0.25s ease;
        }

        .login-submit-button:hover {
          background: #123b77;

          transform:
            translateY(-2px);

          box-shadow:
            0 12px 23px
            rgba(
              13,
              45,
              92,
              0.23
            );
        }

        .login-submit-button:hover svg {
          transform:
            translateX(4px);
        }

        .login-submit-button:active {
          transform:
            translateY(0)
            scale(0.99);
        }


        /* =====================================
           SIGNUP
        ===================================== */

        .signup-link {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 5px;

          margin-top: 17px;

          color: #7c899b;

          font-size: 10px;
        }

        .link-btn {
          border: none;

          background: transparent;

          padding: 0;

          color: #1d4ed8;

          font-family: inherit;

          font-size: 10px;

          font-weight: 600;

          cursor: pointer;

          transition:
            color 0.2s ease;
        }

        .link-btn:hover {
          color: #123b77;

          text-decoration:
            underline;
        }


        /* =====================================
           CREDENTIALS
        ===================================== */

        .login-footer {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-top: 23px;

          padding:
            12px
            13px;

          border-radius: 9px;

          background: #f5f8fc;

          border:
            1px solid #e3e9f1;

          transition:
            transform 0.25s ease,
            border-color 0.25s ease;
        }

        .login-footer:hover {
          transform:
            translateY(-2px);

          border-color:
            #ccd9ea;
        }

        .credentials-icon {
          width: 29px;
          height: 29px;

          flex-shrink: 0;

          border-radius: 7px;

          background: #e8f0ff;

          color: #285da8;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 10px;
        }

        .credentials-label {
          display: block;

          color: #738197;

          font-size: 9px;

          margin-bottom: 3px;
        }

        .login-footer p {
          margin: 0;

          color: #6d7b8f;

          font-size: 10px;
        }

        .login-footer strong {
          color: #324764;

          font-weight: 600;
        }


        /* =====================================
           SECURITY
        ===================================== */

        .security-note {
          display: flex;

          justify-content: center;
          align-items: center;

          gap: 6px;

          margin-top: 17px;

          color: #9aa5b5;

          font-size: 9px;

          font-weight: 400;
        }

        .security-note svg {
          color: #6d88b3;

          font-size: 9px;
        }


        /* =====================================
           SIGNUP FORM
        ===================================== */

        .signup-form .form-group {
          margin-bottom: 12px;
        }

        .signup-form .form-input {
          height: 43px;
        }


        /* =====================================
           RESPONSIVE
        ===================================== */

        @media (max-width: 1100px) {

          .los-login-page {
            grid-template-columns:
              52% 48%;
          }

          .login-hero {
            padding-left: 55px;
            padding-right: 30px;
          }

          .login-form-section {
            padding-left: 20px;
            padding-right: 35px;
          }

          .hero-title {
            font-size: 48px;
          }

        }


        @media (max-width: 850px) {

          .los-login-page {
            display: block;

            overflow-y: auto;
          }

          .login-hero {
            min-height: auto;

            padding:
              55px
              25px
              35px;
          }

          .hero-inner {
            max-width: 650px;

            margin:
              0
              auto;
          }

          .hero-title {
            font-size: 43px;
          }

          .hero-loan-wrapper {
            max-width: 500px;
          }

          .login-form-section {
            min-height: auto;

            padding:
              20px
              20px
              60px;
          }

          .login-card {
            max-width: 500px;
          }

          .background-orbit {
            opacity: 0.5;
          }

        }


        @media (max-width: 550px) {

          .login-hero {
            padding:
              40px
              20px
              25px;
          }

          .hero-title {
            font-size: 36px;

            letter-spacing:
              -1.4px;
          }

          .hero-description {
            font-size: 12px;
          }

          .hero-features {
            flex-direction: column;

            gap: 12px;
          }

          .hero-footer {
            margin-top: 20px;
          }

          .login-form-section {
            padding:
              15px
              15px
              35px;
          }

          .login-card {
            padding:
              25px
              21px
              21px;

            border-radius: 15px;
          }

          .cursor-glow {
            display: none;
          }

          .cursor-dot {
            opacity: 0.25;
          }

        }


        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;
          }

        }

      `}</style>

    </div>
  );
}

export default Login;