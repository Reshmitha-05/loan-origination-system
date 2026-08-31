import { useEffect, useState } from 'react';
import './App.css';
import CustomerDashboard from './components/CustomerDashboard';
import CustomerPage from './components/CustomerPage';
import Dashboard from './components/Dashboard';
import EMICalculator from './components/EMICalculator';
import EligibilityChecker from './components/EligibilityChecker';
import HeaderBar from "./components/HeaderBar";
import LoanPage from './components/LoanPage';
import Login from './components/Login';
import Profile from './components/Profile';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import CustomerSidebar from './components/CustomerSidebar';

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
  const [showCustomerSidebar, setShowCustomerSidebar] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedRole = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('userName');
    
    if (storedLogin === 'true' && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setUserName(storedName || 'User');
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, []);

 const handleLogin = (role, name) => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", role);
  localStorage.setItem("userName", name);
  setIsAuthenticated(true);
  setUserRole(role);
  setUserName(name);
  setShowLogin(false);
  setActiveTab(role === 'admin' ? 'Dashboard' : 'Customer Dashboard');
};

 const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("customerEmail");
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

  const renderContent = () => {
    if (showLogin) {
      return <Login onLogin={handleLogin} />;
    }

    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    if (showProfile) {
      return <Profile onBack={() => { setShowProfile(false); setActiveTab(userRole === 'admin' ? 'Dashboard' : 'Customer Dashboard'); }} />;
    }

    if (showSettings) {
      return <Settings onBack={() => { setShowSettings(false); setActiveTab(userRole === 'admin' ? 'Dashboard' : 'Customer Dashboard'); }} />;
    }

    // Role-based routing
    if (userRole === 'customer') {
      
      switch (activeTab) {
        case 'Customer Dashboard':
          return <CustomerDashboard userName={userName} onLogout={handleLogout} />;
        case 'Apply for Loan':
          return <ApplyForLoan />;
        case 'My Applications':
          return <MyApplications />;
        case 'EMI Calculator':
          return <EMICalculator />;
        case 'Eligibility Checker':
          return <EligibilityChecker />;
        case 'Loan Products':
          return <div className="page-container"><h2 className="page-title">Loan Products</h2><p className="page-subtitle">Explore our loan products here.</p></div>;
        case 'My Profile':
          return <Profile onBack={() => { setShowProfile(false); setActiveTab('Customer Dashboard'); }} />;
        case 'Documents':
          return <div className="page-container"><h2 className="page-title">Documents</h2><p className="page-subtitle">Upload and manage your documents here.</p></div>;
        default:
          return <CustomerDashboard userName={userName} onLogout={handleLogout} />;
      }
    }

    // Admin routes
    
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Customers':
        return <CustomerPage />;
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
          <HeaderBar toggleSidebar={toggleSidebar} onLogout={handleLogout} onProfile={handleShowProfile} onSettings={handleShowSettings} />
          {userRole === 'admin' && (
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
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
      <div className={`main-content ${isAuthenticated && (isCollapsed && userRole === 'admin') ? "collapsed-sidebar" : ""}`}>
        <div className="page-transition">{renderContent()}</div>
      </div>
      {isAuthenticated && (
        <footer className="app-footer">
          <p>© 2026 Loan Origination System. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}
export default App;
