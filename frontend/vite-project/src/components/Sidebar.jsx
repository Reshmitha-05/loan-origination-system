import { FaFileAlt, FaHome, FaMoneyBillWave, FaUsers } from "react-icons/fa";

function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: 'Dashboard' },
    { name: 'Customers', icon: <FaUsers />, path: 'Customers' },
    {
      name: 'Loans',
      icon: <FaMoneyBillWave />,
      path: 'Loans',
      children: [
        { name: 'EMI Calculator', path: 'EMI Calculator' },
        { name: 'Eligibility Checker', path: 'Eligibility Checker' },
      ]
    },
    { name: 'Reports', icon: <FaFileAlt />, path: 'Reports' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Menu */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          if (item.children) {
            return (
              <li key={item.name} className="sidebar-parent-item">
                <div 
                  className={`sidebar-item ${item.path === activeTab || item.children.some(child => child.path === activeTab) ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.path)}
                  title={item.name}
                >
                  <div className="menu-content">
                    <span className="menu-icon">{item.icon}</span>
                    {!isCollapsed && <span className="menu-label">{item.name}</span>}
                  </div>
                </div>
                {!isCollapsed && (
                  <ul className="sidebar-submenu">
                    {item.children.map((child) => (
                      <li
                        key={child.path}
                        className={`sidebar-submenu-item ${activeTab === child.path ? 'active' : ''}`}
                        onClick={() => setActiveTab(child.path)}
                      >
                        {child.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }
          return (
            <li
              key={item.name}
              className={`sidebar-item ${activeTab === item.path ? 'active' : ''}`}
              onClick={() => setActiveTab(item.path)}
              title={item.name}
            >
              <div className="menu-content">
                <span className="menu-icon">{item.icon}</span>
                {!isCollapsed && <span className="menu-label">{item.name}</span>}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <p className="sidebar-version">LOS v1.0</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
