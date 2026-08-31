import { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

function EligibilityChecker() {
  const [applicantName, setApplicantName] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [requestedLoan, setRequestedLoan] = useState('');
  const [age, setAge] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [creditScoreSlider, setCreditScoreSlider] = useState(700);
  const [result, setResult] = useState(null);

  const [error, setError] = useState('');

  const checkEligibility = () => {
    setError('');
    const salary = parseFloat(monthlySalary);
    const requested = parseFloat(requestedLoan);
    const applicantAge = parseInt(age);
    const score = parseInt(creditScore);

    // Input validation
    if (!applicantName.trim()) {
      setError('Please enter your name');
      setResult(null);
      return;
    }
    if (isNaN(salary) || salary <= 0 || salary > 10000000) {
      setError('Please enter a valid monthly salary (between ₹1 and ₹10,00,000)');
      setResult(null);
      return;
    }
    if (isNaN(requested) || requested <= 0 || requested > 100000000) {
      setError('Please enter a valid loan amount (between ₹1 and ₹1,00,00,000)');
      setResult(null);
      return;
    }
    if (isNaN(applicantAge) || applicantAge < 18 || applicantAge > 70) {
      setError('Please enter a valid age (between 18 and 70)');
      setResult(null);
      return;
    }
    if (!employmentType) {
      setError('Please select your employment type');
      setResult(null);
      return;
    }
    if (isNaN(score) || score < 300 || score > 900) {
      setError('Please enter a valid credit score (between 300 and 900)');
      setResult(null);
      return;
    }

    // Eligibility logic
    const minSalary = 25000;
    const maxLoanAmount = salary * 0.6 * 12; // 60% of annual income
    const eligibilityRatio = requested / maxLoanAmount;
    
    // Calculate eligibility score (0-100)
    // Based on: credit score (40%), income-to-loan ratio (30%), employment stability (20%), age (10%)
    let eligibilityScore = 0;
    let conditions = [];
    let verdict = 'Not Eligible';

    // Credit score component (max 40 points)
    let creditScorePoints = 0;
    if (score >= 750) creditScorePoints = 40;
    else if (score >= 700) creditScorePoints = 35;
    else if (score >= 650) creditScorePoints = 25;
    else if (score >= 600) creditScorePoints = 15;
    else creditScorePoints = 5;
    eligibilityScore += creditScorePoints;

    // Income-to-loan ratio component (max 30 points)
    let ratioPoints = 0;
    if (eligibilityRatio <= 0.5) ratioPoints = 30;
    else if (eligibilityRatio <= 0.75) ratioPoints = 20;
    else if (eligibilityRatio <= 1.0) ratioPoints = 10;
    else ratioPoints = 0;
    eligibilityScore += ratioPoints;

    // Employment stability component (max 20 points)
    let employmentPoints = 0;
    if (employmentType === 'Salaried') employmentPoints = 20;
    else if (employmentType === 'Self-Employed') employmentPoints = 15;
    else if (employmentType === 'Business') employmentPoints = 12;
    eligibilityScore += employmentPoints;

    // Age component (max 10 points)
    let agePoints = 0;
    if (applicantAge >= 25 && applicantAge <= 45) agePoints = 10;
    else if (applicantAge >= 21 || applicantAge <= 60) agePoints = 7;
    else agePoints = 3;
    eligibilityScore += agePoints;

    // Determine verdict
    if (eligibilityScore >= 75 && eligibilityRatio <= 1.0 && salary >= minSalary) {
      verdict = 'Eligible';
    } else if (eligibilityScore >= 50 && eligibilityRatio <= 1.0 && salary >= minSalary) {
      verdict = 'Eligible with Conditions';
      conditions.push('Standard approval criteria met');
    } else if (salary < minSalary) {
      verdict = 'Not Eligible';
      conditions.push(`Minimum monthly income of ₹${minSalary.toLocaleString()} required`);
    } else if (eligibilityRatio > 1.0) {
      verdict = 'Not Eligible';
      conditions.push(`Requested amount exceeds eligible limit`);
    }

    setResult({
      verdict,
      reason: generateReason(verdict, salary, requested, maxLoanAmount, eligibilityRatio, conditions),
      maxRecommended: eligibilityRatio > 1.0 ? maxLoanAmount : (eligibilityRatio * maxLoanAmount),
      eligibilityScore: Math.min(100, Math.round(eligibilityScore)),
      eligibilityPercentage: Math.min(100, Math.round(eligibilityScore)),
      eligibilityRatio: (eligibilityRatio * 100).toFixed(1),
      conditions: conditions
    });
  };

  const generateReason = (verdict, salary, requested, maxLoan, ratio, conditions) => {
    if (verdict === 'Eligible') {
      return `Based on your monthly income of ₹${salary.toLocaleString()}, credit score of ${creditScore}, and requested loan amount of ₹${requested.toLocaleString()}, you qualify for full loan approval. Your income-to-loan ratio of ${ratio}% is within acceptable limits.`;
    } else if (verdict === 'Eligible with Conditions') {
      return `Your application meets most eligibility criteria. While your income and credit score are satisfactory, the requested loan amount is slightly higher than optimal. Consider reducing the loan amount to ₹${Math.round(maxLoan).toLocaleString()} for better approval chances.`;
    } else {
      return conditions.join('. ') + `. Based on your profile, the maximum loan amount you could potentially qualify for is ₹${Math.round(maxLoan).toLocaleString()}.`;
    }
  };

  const handleReset = () => {
    setApplicantName('');
    setMonthlySalary('');
    setRequestedLoan('');
    setAge('');
    setEmploymentType('');
    setCreditScore('');
    setCreditScoreSlider(700);
    setResult(null);
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'Eligible': return '#10b981'; // Green
      case 'Eligible with Conditions': return '#f59e0b'; // Amber
      default: return '#ef4444'; // Red
    }
  };

  const getVerdictBadgeClass = (verdict) => {
    switch (verdict) {
      case 'Eligible': return 'status-active';
      case 'Eligible with Conditions': return 'status-warning';
      default: return 'status-inactive';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Loan Eligibility Checker</h2>
        <p className="page-subtitle">Evaluate your loan eligibility based on your monthly income and requested loan amount using our professional eligibility assessment tool.</p>
      </div>

      <div className="eligibility-container">
        <div className="eligibility-form">
          <h3>Check Eligibility</h3>
          
          <div className="form-group">
            <label className="form-label">Applicant Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Age ({age || '-'} years)</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Monthly Salary (₹{monthlySalary ? Number(monthlySalary).toLocaleString() : '-'})</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter your monthly salary"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              min="0"
              step="1000"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Requested Loan Amount (₹{requestedLoan ? Number(requestedLoan).toLocaleString() : '-'})</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter desired loan amount"
              value={requestedLoan}
              onChange={(e) => setRequestedLoan(e.target.value)}
              min="0"
              step="10000"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select
              className="form-input"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">Select Employment Type</option>
              <option value="Salaried">Salaried (Employee)</option>
              <option value="Self-Employed">Self-Employed (Professional)</option>
              <option value="Business">Business Owner</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Credit Score ({creditScore || '-'})</label>
            <div className="input-with-slider">
              <input
                type="range"
                className="slider-input"
                min="300"
                max="900"
                step="10"
                value={creditScoreSlider}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCreditScoreSlider(val);
                  setCreditScore(val);
                }}
              />
              <input
                type="number"
                className="form-input form-input-number"
                placeholder="Enter Credit Score (300-900)"
                value={creditScoreSlider}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 300 && val <= 900) {
                    setCreditScoreSlider(val);
                    setCreditScore(val);
                  }
                }}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn btn-primary" onClick={checkEligibility}>
              Check Eligibility
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
          {error && (
            <div className="error-message" style={{ marginTop: '20px' }}>
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="eligibility-result-container">
            <div className={`eligibility-result ${getVerdictBadgeClass(result.verdict)}`}>
              <div className="verdict-header">
                {result.verdict === 'Eligible' && <FaCheckCircle className="verdict-icon" />}
                {result.verdict === 'Eligible with Conditions' && <FaInfoCircle className="verdict-icon" />}
                {result.verdict === 'Not Eligible' && <FaExclamationCircle className="verdict-icon" />}
                <h3>{result.verdict}</h3>
              </div>
              
              <div className="score-card">
                <div className="score-circle">
                  <span className="score-value">{result.eligibilityScore}</span>
                  <span className="score-label">Score</span>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ 
                      width: `${result.eligibilityPercentage}%`,
                      backgroundColor: getVerdictColor(result.verdict)
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="reason-box">
                <label className="result-label">Analysis</label>
                <p className="reason-text">{result.reason}</p>
              </div>
              
              {result.maxRecommended > 0 && result.maxRecommended < requestedLoan && (
                <div className="max-loan-box">
                  <label className="result-label">Recommended Maximum</label>
                  <div className="max-loan-value">₹{Math.round(result.maxRecommended).toLocaleString()}</div>
                  <p className="max-loan-note">Based on your income, you could potentially qualify for this amount</p>
                </div>
              )}
              
              <div className="eligibility-details">
                <h4>Eligibility Summary</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Applicant Name</span>
                    <span className="summary-value">{applicantName || '-'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Age</span>
                    <span className="summary-value">{age || '-'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Employment</span>
                    <span className="summary-value">{employmentType || '-'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Credit Score</span>
                    <span className="summary-value">{creditScore || '-'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Monthly Income</span>
                    <span className="summary-value">₹{Number(monthlySalary).toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Requested Loan</span>
                    <span className="summary-value">₹{Number(requestedLoan).toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Income-to-Loan Ratio</span>
                    <span className="summary-value">{result.eligibilityRatio}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditions Info Card */}
            {result.conditions && result.conditions.length > 0 && (
              <div className="eligibility-info-card">
                <h4 className="info-card-title">Conditions & Requirements</h4>
                <ul className="conditions-list">
                  {result.conditions.map((condition, index) => (
                    <li key={index} className="condition-item">
                      <span className="condition-icon">•</span>
                      <span className="condition-text">{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eligibility Criteria Info Card */}
            <div className="eligibility-info-card">
              <h4 className="info-card-title">Eligibility Criteria</h4>
              <div className="criteria-list">
                <div className="criterion">
                  <span className="criterion-icon">1. </span>
                  <span className="criterion-text">Applicant must be between 18 and 70 years of age.</span>
                </div>
                <div className="criterion">
                  <span className="criterion-icon">2. </span>
                  <span className="criterion-text">Minimum monthly income of ₹25,000 is required for standard approval.</span>
                </div>
                <div className="criterion">
                  <span className="criterion-icon">3. </span>
                  <span className="criterion-text">Credit score of 700 or above is preferred for optimal interest rates.</span>
                </div>
                <div className="criterion">
                  <span className="criterion-icon">4. </span>
                  <span className="criterion-text">Maximum loan amount is typically 60% of annual income.</span>
                </div>
                <div className="criterion">
                  <span className="criterion-icon">5. </span>
                  <span className="criterion-text">Loan approval is subject to internal credit evaluation and document verification.</span>
                </div>
              </div>
            </div>
            
            <div className="eligibility-info-card">
              <p className="note">
                <strong>Disclaimer:</strong> Meeting the above eligibility criteria does not guarantee loan approval. 
                Final approval is subject to the lender's credit policy, verification of submitted documents, 
                and internal risk assessment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EligibilityChecker;
