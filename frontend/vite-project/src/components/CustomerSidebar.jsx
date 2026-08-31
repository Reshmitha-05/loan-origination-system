import { FaCalculator, FaCheckCircle, FaFileAlt, FaFileUpload, FaHome, FaInfoCircle, FaMoneyBillWave, FaUserCircle } from "react-icons/fa";

function CustomerSidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: 'Customer Dashboard' },
    { name: 'Apply for Loan', icon: <FaFileAlt />, path: 'Apply for Loan' },
    { name: 'My Applications', icon: <FaMoneyBillWave />, path: 'My Applications' },
    { name: 'EMI Calculator', icon: <FaCalculator />, path: 'EMI Calculator' },
    { name: 'Eligibility Checker', icon: <FaCheckCircle />, path: 'Eligibility Checker' },
    { name: 'Loan Products', icon: <FaInfoCircle />, path: 'Loan Products' },
    { name: 'My Profile', icon: <FaUserCircle />, path: 'My Profile' },
    { name: 'Documents', icon: <FaFileUpload />, path: 'Documents' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`customer-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="customer-sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`customer-sidebar-item ${activeTab === item.path ? 'active' : ''}`}
            onClick={() => setActiveTab(item.path)}
            title={item.name}
          >
            <div className="menu-content">
              <span className="menu-icon">{item.icon}</span>
              {!isCollapsed && <span className="menu-label">{item.name}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="customer-sidebar-footer">
        {!isCollapsed && (
          <p className="customer-sidebar-version">LOS v1.0</p>
        )}
      </div>
    </div>
  );
}

export default CustomerSidebar;
