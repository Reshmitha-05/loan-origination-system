import { useState } from "react";

function Settings({ onBack }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    loanAlerts: true,
    systemUpdates: false,
    defaultCurrency: 'INR',
    interestFormat: 'percentage'
  });
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="page-container">
      <div className="settings-page">
        <div className="settings-header">
          <button className="btn-back" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <h2 className="page-title">Settings</h2>
        </div>

        <div className="settings-card">
          <h3 className="settings-section-title">Notifications</h3>
          
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Email Notifications</span>
              <span className="setting-description">Receive email updates about loans and customers</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Loan Alerts</span>
              <span className="setting-description">Get alerts for new loan applications and approvals</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.loanAlerts}
                onChange={(e) => handleChange('loanAlerts', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">System Updates</span>
              <span className="setting-description">Receive notifications about system updates</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.systemUpdates}
                onChange={(e) => handleChange('systemUpdates', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <h3 className="settings-section-title">Display Preferences</h3>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Default Currency</span>
              <span className="setting-description">Currency format for displaying loan amounts</span>
            </div>
            <select
              className="form-input"
              value={settings.defaultCurrency}
              onChange={(e) => handleChange('defaultCurrency', e.target.value)}
            >
              <option value="INR">₹ INR (Indian Rupee)</option>
              <option value="USD">$ USD (US Dollar)</option>
              <option value="EUR">€ EUR (Euro)</option>
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Interest Rate Format</span>
              <span className="setting-description">How interest rates are displayed</span>
            </div>
            <select
              className="form-input"
              value={settings.interestFormat}
              onChange={(e) => handleChange('interestFormat', e.target.value)}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="decimal">Decimal (0.00)</option>
            </select>
          </div>

          <div className="settings-actions">
            {showSaveSuccess && (
              <span className="save-success">Settings saved successfully!</span>
            )}
            <button className="btn btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
