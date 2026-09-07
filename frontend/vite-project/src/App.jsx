import { useEffect, useState } from 'react';

import './App.css';

import ApplyForLoan from './components/ApplyForLoan';
import ApplicationRequests from './components/ApplicationRequests';
import CustomerDashboard from './components/CustomerDashboard';
import CustomerPage from './components/CustomerPage';
import CustomerProfile from './components/CustomerProfile';
import CustomerSidebar from './components/CustomerSidebar';
import Dashboard from './components/Dashboard';
import Documents from './components/Documents';
import EMICalculator from './components/EMICalculator';
import EligibilityChecker from './components/EligibilityChecker';
import HeaderBar from './components/HeaderBar';
import LoanPage from './components/LoanPage';
import LoanProducts from './components/LoanProducts';
import Login from './components/Login';
import MyApplications from './components/MyApplications';
import Profile from './components/Profile';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import DocumentVerification from './components/DocumentVerification';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loginMode, setLoginMode] = useState('admin');

  // Check localStorage on mount
  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedRole = localStorage.getItem('userRole');

    let storedName = '';

    if (storedRole === 'admin') {
      storedName =
        localStorage.getItem('loggedInAdminName') ||
        localStorage.getItem('userName') ||
        'Admin User';
    } else if (storedRole === 'customer') {
      storedName =
        localStorage.getItem('loggedInCustomerName') ||
        localStorage.getItem('userName') ||
        'Customer';
    }

    if (storedLogin === 'true' && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setUserName(storedName);
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, []);

  const handleLogin = (role, name) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);

    if (role === 'admin') {
      localStorage.setItem('loggedInAdminName', name);
      localStorage.setItem(
        'loggedInAdminEmail',
        'admin@los.com'
      );
    } else if (role === 'customer') {
      localStorage.setItem('loggedInCustomerName', name);

      const customerEmail =
        localStorage.getItem('customerEmail') || '';

      localStorage.setItem(
        'loggedInCustomerEmail',
        customerEmail
      );
    }

    setIsAuthenticated(true);
    setUserRole(role);
    setUserName(name);
    setShowLogin(false);
    setShowProfile(false);
    setShowSettings(false);

    setActiveTab(
      role === 'admin'
        ? 'Dashboard'
        : 'Customer Dashboard'
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('loggedInCustomerName');
    localStorage.removeItem('loggedInCustomerEmail');
    localStorage.removeItem('loggedInAdminName');
    localStorage.removeItem('loggedInAdminEmail');

    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
    setShowLogin(true);
    setActiveTab('Dashboard');
    setShowProfile(false);
    setShowSettings(false);
    setLoginMode('admin');
  };

  const handleShowProfile = () => {
    setShowProfile(true);
    setShowSettings(false);
    setActiveTab('Profile');
  };

  const handleShowSettings = () => {
    setShowSettings(true);
    setShowProfile(false);
    setActiveTab('Settings');
  };

  // Close Profile/Settings whenever a sidebar page is selected
  const handleTabChange = (tab) => {
    setShowProfile(false);
    setShowSettings(false);
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (showLogin) {
      return <Login onLogin={handleLogin} />;
    }

    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    // HEADER PROFILE
    if (showProfile) {
      if (userRole === 'admin') {
        return (
          <Profile
            onBack={() => {
              setShowProfile(false);
              setActiveTab('Dashboard');
            }}
            userRole={userRole}
            userName={userName}
          />
        );
      }

      if (userRole === 'customer') {
        return (
          <CustomerProfile
            onBack={() => {
              setShowProfile(false);
              setActiveTab('Customer Dashboard');
            }}
          />
        );
      }
    }

    // SETTINGS
    if (showSettings) {
      return (
        <Settings
          onBack={() => {
            setShowSettings(false);
            setActiveTab(
              userRole === 'admin'
                ? 'Dashboard'
                : 'Customer Dashboard'
            );
          }}
        />
      );
    }

    // ============================
    // CUSTOMER ROUTES
    // ============================

    if (userRole === 'customer') {
      switch (activeTab) {
        case 'Customer Dashboard':
          return (
            <CustomerDashboard
              userName={userName}
              onLogout={handleLogout}
            />
          );

        case 'Apply for Loan':
          return (
            <ApplyForLoan
              onViewApplications={() =>
                setActiveTab('My Applications')
              }
            />
          );

        case 'My Applications':
          return <MyApplications />;

        case 'EMI Calculator':
          return <EMICalculator />;

        case 'Eligibility Checker':
          return <EligibilityChecker />;

        case 'Loan Products':
          return (
            <LoanProducts
              setActiveTab={setActiveTab}
            />
          );

        case 'My Profile':
          return (
            <CustomerProfile
              onBack={() => {
                setActiveTab('Customer Dashboard');
              }}
            />
          );

        case 'Documents':
          return (
            <Documents
              onProceedToApplication={() => {
                setActiveTab('Apply for Loan');
              }}
            />
          );

        default:
          return (
            <CustomerDashboard
              userName={userName}
            />
          );
      }
    }

    // ============================
    // ADMIN ROUTES
    // ============================

    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;

      case 'Customers':
        return <CustomerPage />;

      case 'Application Requests':
        return <ApplicationRequests />;

      case 'Document Verification':
        return <DocumentVerification />;

      case 'Loans':
        return <LoanPage />;

      case 'Reports':
        return <Reports />;

      case 'EMI Calculator':
        return <EMICalculator />;

      case 'Eligibility Checker':
        return <EligibilityChecker />;

      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="app-wrapper">

      {isAuthenticated && (
        <>
          <HeaderBar
            toggleSidebar={toggleSidebar}
            onLogout={handleLogout}
            onProfile={handleShowProfile}
            onSettings={handleShowSettings}
            userName={userName}
            userRole={userRole}
          />

          {userRole === 'admin' && (
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}

          {userRole === 'customer' && (
            <CustomerSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}
        </>
      )}

      <div
  className={`main-content ${
    !isAuthenticated || showLogin
      ? 'login-main-content'
      : isCollapsed && userRole === 'admin'
        ? 'collapsed-sidebar'
        : ''
  }`}
>
        <div className="page-transition">
          {renderContent()}
        </div>
      </div>

      {isAuthenticated && (
        <footer className="app-footer">
          <p>
            © 2026 Loan Origination System. All rights reserved.
          </p>
        </footer>
      )}

    </div>
  );
}

export default App;