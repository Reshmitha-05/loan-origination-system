import { useState } from "react";

import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaUser,
  FaRupeeSign,
  FaCalendarAlt,
  FaBriefcase,
  FaCreditCard,
  FaClipboardCheck,
  FaShieldAlt,
  FaArrowRight
} from "react-icons/fa";


function EligibilityChecker() {

  // ==========================================
  // STATES
  // ==========================================

  const [applicantName, setApplicantName] = useState("");

  const [monthlySalary, setMonthlySalary] = useState("");

  const [requestedLoan, setRequestedLoan] = useState("");

  const [age, setAge] = useState("");

  const [employmentType, setEmploymentType] = useState("");

  const [creditScore, setCreditScore] = useState("");

  const [creditScoreSlider, setCreditScoreSlider] = useState(700);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {

    if (
      amount === "" ||
      amount === null ||
      amount === undefined ||
      isNaN(amount)
    ) {
      return "₹0";
    }

    return "₹" + Math.round(amount).toLocaleString("en-IN");

  };


  // ==========================================
  // ELIGIBILITY CHECK
  // ==========================================

  const checkEligibility = () => {

    setError("");

    const salary = parseFloat(monthlySalary);

    const requested = parseFloat(requestedLoan);

    const applicantAge = parseInt(age);

    const score = parseInt(creditScore);


    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!applicantName.trim()) {

      setError("Please enter your name");

      setResult(null);

      return;

    }


    if (
      isNaN(salary) ||
      salary <= 0 ||
      salary > 10000000
    ) {

      setError(
        "Please enter a valid monthly salary (between ₹1 and ₹10,00,000)"
      );

      setResult(null);

      return;

    }


    if (
      isNaN(requested) ||
      requested <= 0 ||
      requested > 100000000
    ) {

      setError(
        "Please enter a valid loan amount (between ₹1 and ₹1,00,00,000)"
      );

      setResult(null);

      return;

    }


    if (
      isNaN(applicantAge) ||
      applicantAge < 18 ||
      applicantAge > 70
    ) {

      setError(
        "Please enter a valid age (between 18 and 70)"
      );

      setResult(null);

      return;

    }


    if (!employmentType) {

      setError(
        "Please select your employment type"
      );

      setResult(null);

      return;

    }


    if (
      isNaN(score) ||
      score < 300 ||
      score > 900
    ) {

      setError(
        "Please enter a valid credit score (between 300 and 900)"
      );

      setResult(null);

      return;

    }


    // ==========================================
    // EXISTING ELIGIBILITY LOGIC
    // ==========================================

    const minSalary = 25000;

    const maxLoanAmount =
      salary * 0.6 * 12;

    const eligibilityRatio =
      requested / maxLoanAmount;


    let eligibilityScore = 0;

    let conditions = [];

    let verdict = "Not Eligible";


    // ------------------------------------------
    // CREDIT SCORE — 40 POINTS
    // ------------------------------------------

    let creditScorePoints = 0;

    if (score >= 750) {

      creditScorePoints = 40;

    } else if (score >= 700) {

      creditScorePoints = 35;

    } else if (score >= 650) {

      creditScorePoints = 25;

    } else if (score >= 600) {

      creditScorePoints = 15;

    } else {

      creditScorePoints = 5;

    }

    eligibilityScore += creditScorePoints;


    // ------------------------------------------
    // INCOME TO LOAN RATIO — 30 POINTS
    // ------------------------------------------

    let ratioPoints = 0;

    if (eligibilityRatio <= 0.5) {

      ratioPoints = 30;

    } else if (eligibilityRatio <= 0.75) {

      ratioPoints = 20;

    } else if (eligibilityRatio <= 1.0) {

      ratioPoints = 10;

    } else {

      ratioPoints = 0;

    }

    eligibilityScore += ratioPoints;


    // ------------------------------------------
    // EMPLOYMENT — 20 POINTS
    // ------------------------------------------

    let employmentPoints = 0;

    if (employmentType === "Salaried") {

      employmentPoints = 20;

    } else if (employmentType === "Self-Employed") {

      employmentPoints = 15;

    } else if (employmentType === "Business") {

      employmentPoints = 12;

    }

    eligibilityScore += employmentPoints;


    // ------------------------------------------
    // AGE — 10 POINTS
    // ------------------------------------------

    let agePoints = 0;

    if (
      applicantAge >= 25 &&
      applicantAge <= 45
    ) {

      agePoints = 10;

    } else if (
      applicantAge >= 21 ||
      applicantAge <= 60
    ) {

      agePoints = 7;

    } else {

      agePoints = 3;

    }

    eligibilityScore += agePoints;


    // ==========================================
    // VERDICT
    // ==========================================

    if (
      eligibilityScore >= 75 &&
      eligibilityRatio <= 1.0 &&
      salary >= minSalary
    ) {

      verdict = "Eligible";

    } else if (
      eligibilityScore >= 50 &&
      eligibilityRatio <= 1.0 &&
      salary >= minSalary
    ) {

      verdict = "Eligible with Conditions";

      conditions.push(
        "Standard approval criteria met"
      );

    } else if (salary < minSalary) {

      verdict = "Not Eligible";

      conditions.push(
        `Minimum monthly income of ₹${minSalary.toLocaleString()} required`
      );

    } else if (eligibilityRatio > 1.0) {

      verdict = "Not Eligible";

      conditions.push(
        "Requested amount exceeds eligible limit"
      );

    }


    // ==========================================
    // RESULT
    // ==========================================

    setResult({

      verdict,

      reason: generateReason(
        verdict,
        salary,
        requested,
        maxLoanAmount,
        eligibilityRatio,
        conditions
      ),

      maxRecommended:
        eligibilityRatio > 1.0
          ? maxLoanAmount
          : eligibilityRatio * maxLoanAmount,

      eligibilityScore:
        Math.min(
          100,
          Math.round(eligibilityScore)
        ),

      eligibilityPercentage:
        Math.min(
          100,
          Math.round(eligibilityScore)
        ),

      eligibilityRatio:
        (eligibilityRatio * 100).toFixed(1),

      conditions

    });

  };


  // ==========================================
  // REASON
  // ==========================================

  const generateReason = (
    verdict,
    salary,
    requested,
    maxLoan,
    ratio,
    conditions
  ) => {

    if (verdict === "Eligible") {

      return `Based on your monthly income of ₹${salary.toLocaleString()}, credit score of ${creditScore}, and requested loan amount of ₹${requested.toLocaleString()}, you qualify for full loan approval. Your income-to-loan ratio of ${ratio}% is within acceptable limits.`;

    } else if (
      verdict === "Eligible with Conditions"
    ) {

      return `Your application meets most eligibility criteria. While your income and credit score are satisfactory, the requested loan amount is slightly higher than optimal. Consider reducing the loan amount to ₹${Math.round(maxLoan).toLocaleString()} for better approval chances.`;

    } else {

      return (
        conditions.join(". ") +
        `. Based on your profile, the maximum loan amount you could potentially qualify for is ₹${Math.round(maxLoan).toLocaleString()}.`
      );

    }

  };


  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {

    setApplicantName("");

    setMonthlySalary("");

    setRequestedLoan("");

    setAge("");

    setEmploymentType("");

    setCreditScore("");

    setCreditScoreSlider(700);

    setResult(null);

    setError("");

  };


  // ==========================================
  // VERDICT HELPERS
  // ==========================================

  const getVerdictColor = (verdict) => {

    switch (verdict) {

      case "Eligible":
        return "#10b981";

      case "Eligible with Conditions":
        return "#f59e0b";

      default:
        return "#ef4444";

    }

  };


  const getVerdictBackground = (verdict) => {

    switch (verdict) {

      case "Eligible":
        return "#ecfdf5";

      case "Eligible with Conditions":
        return "#fffbeb";

      default:
        return "#fef2f2";

    }

  };


  const getVerdictIcon = (verdict) => {

    if (verdict === "Eligible") {

      return <FaCheckCircle />;

    }

    if (
      verdict === "Eligible with Conditions"
    ) {

      return <FaInfoCircle />;

    }

    return <FaExclamationCircle />;

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="eligibility-modern-page">


      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="eligibility-heading">

        <div className="eligibility-heading-icon">

          <FaClipboardCheck />

        </div>


        <div>

          <h1>
            Loan Eligibility Checker
          </h1>

          <p>
            Check your potential loan eligibility based on
            income, credit score, employment and loan amount.
          </p>

        </div>


        <div className="eligibility-heading-badge">

          <FaShieldAlt />

          <div>

            <strong>
              Smart Eligibility Assessment
            </strong>

            <span>
              Evaluate your loan profile
            </span>

          </div>

        </div>

      </div>


      {/* ======================================
          MAIN GRID
      ====================================== */}

      <div className="eligibility-main-grid">


        {/* ====================================
            LEFT — APPLICANT DETAILS
        ==================================== */}

        <div className="eligibility-card applicant-card">


          <div className="section-heading">

            <h2>
              Applicant Details
            </h2>

            <p>
              Enter your information to check eligibility
            </p>

          </div>


          {/* NAME */}

          <div className="eligibility-field">

            <label>
              Applicant Name
            </label>


            <div className="icon-input">

              <FaUser />

              <input
                type="text"
                placeholder="Enter your full name"
                value={applicantName}
                onChange={(e) =>
                  setApplicantName(e.target.value)
                }
              />

            </div>

          </div>


          {/* AGE */}

          <div className="eligibility-field">

            <label>
              Age
            </label>


            <div className="icon-input">

              <FaCalendarAlt />

              <input
                type="number"
                placeholder="Enter your age"
                min="18"
                max="70"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value)
                }
              />

              <span className="input-suffix">
                years
              </span>

            </div>

          </div>


          {/* SALARY */}

          <div className="eligibility-field">

            <div className="field-label-row">

              <label>
                Monthly Income
              </label>

              {monthlySalary && (
                <strong>
                  {formatCurrency(monthlySalary)}
                </strong>
              )}

            </div>


            <div className="icon-input">

              <FaRupeeSign />

              <input
                type="number"
                placeholder="Enter your monthly salary"
                min="0"
                step="1000"
                value={monthlySalary}
                onChange={(e) =>
                  setMonthlySalary(e.target.value)
                }
              />

            </div>


            <small className="field-hint">
              Minimum monthly income required:
              <strong> ₹25,000</strong>
            </small>

          </div>


          {/* REQUESTED LOAN */}

          <div className="eligibility-field">

            <div className="field-label-row">

              <label>
                Requested Loan Amount
              </label>

              {requestedLoan && (
                <strong>
                  {formatCurrency(requestedLoan)}
                </strong>
              )}

            </div>


            <div className="icon-input">

              <FaRupeeSign />

              <input
                type="number"
                placeholder="Enter desired loan amount"
                min="0"
                step="10000"
                value={requestedLoan}
                onChange={(e) =>
                  setRequestedLoan(e.target.value)
                }
              />

            </div>

          </div>


          {/* EMPLOYMENT */}

          <div className="eligibility-field">

            <label>
              Employment Type
            </label>


            <div className="icon-select">

              <FaBriefcase />

              <select
                value={employmentType}
                onChange={(e) =>
                  setEmploymentType(e.target.value)
                }
              >

                <option value="">
                  Select Employment Type
                </option>

                <option value="Salaried">
                  Salaried (Employee)
                </option>

                <option value="Self-Employed">
                  Self-Employed (Professional)
                </option>

                <option value="Business">
                  Business Owner
                </option>

              </select>

            </div>

          </div>


          {/* CREDIT SCORE */}

          <div className="eligibility-field">

            <div className="field-label-row">

              <label>
                Credit Score
              </label>

              <strong className="credit-score-value">
                {creditScoreSlider}
              </strong>

            </div>


            <div className="credit-input-row">

              <div className="credit-number">

                <FaCreditCard />

                <input
                  type="number"
                  min="300"
                  max="900"
                  step="10"
                  value={creditScoreSlider}
                  onChange={(e) => {

                    const value = e.target.value;

                    if (value === "") {

                      setCreditScoreSlider("");

                      setCreditScore("");

                      return;

                    }

                    const val = parseInt(value);

                    if (
                      val >= 300 &&
                      val <= 900
                    ) {

                      setCreditScoreSlider(val);

                      setCreditScore(val);

                    }

                  }}
                />

              </div>


              <input
                type="range"
                className="credit-slider"
                min="300"
                max="900"
                step="10"
                value={creditScoreSlider || 300}
                onChange={(e) => {

                  const val =
                    parseInt(e.target.value);

                  setCreditScoreSlider(val);

                  setCreditScore(val);

                }}
              />

            </div>


            <div className="range-labels">

              <span>
                300 — Poor
              </span>

              <span>
                900 — Excellent
              </span>

            </div>

          </div>


          {/* BUTTONS */}

          <div className="eligibility-actions">

            <button
              className="check-button"
              onClick={checkEligibility}
            >

              <FaClipboardCheck />

              Check Eligibility

            </button>


            <button
              className="reset-button"
              onClick={handleReset}
            >

              Reset

            </button>

          </div>


          {/* ERROR */}

          {error && (

            <div className="eligibility-error">

              <FaExclamationCircle />

              <span>
                {error}
              </span>

            </div>

          )}


          {/* INFO */}

          <div className="assessment-tip">

            <div className="tip-symbol">
              ✓
            </div>

            <div>

              <strong>
                How it works
              </strong>

              <p>
                Your eligibility score considers credit score,
                income-to-loan ratio, employment stability and age.
              </p>

            </div>

          </div>

        </div>


        {/* ====================================
            RIGHT — RESULTS
        ==================================== */}

        <div className="eligibility-card results-card">


          <div className="results-header">

            <div>

              <h2>
                Eligibility Assessment
              </h2>

              <p>
                Your loan eligibility evaluation
              </p>

            </div>

          </div>


          {!result ? (

            /* =================================
               EMPTY STATE
            ================================= */

            <div className="eligibility-empty">

              <div className="empty-check-icon">

                <FaClipboardCheck />

              </div>


              <h3>
                Check your loan eligibility
              </h3>


              <p>
                Enter your applicant details on the left
                and click <strong>Check Eligibility</strong>
                to receive your assessment.
              </p>


              <div className="empty-features">

                <div>
                  <FaCreditCard />
                  <span>
                    Credit Score
                  </span>
                </div>

                <div>
                  <FaRupeeSign />
                  <span>
                    Income
                  </span>
                </div>

                <div>
                  <FaBriefcase />
                  <span>
                    Employment
                  </span>
                </div>

                <div>
                  <FaShieldAlt />
                  <span>
                    Risk Profile
                  </span>
                </div>

              </div>

            </div>

          ) : (

            <>

              {/* =================================
                  VERDICT
              ================================= */}

              <div
                className="verdict-banner"
                style={{
                  background:
                    getVerdictBackground(
                      result.verdict
                    ),
                  borderColor:
                    getVerdictColor(
                      result.verdict
                    )
                }}
              >

                <div
                  className="verdict-icon"
                  style={{
                    color:
                      getVerdictColor(
                        result.verdict
                      )
                  }}
                >

                  {getVerdictIcon(
                    result.verdict
                  )}

                </div>


                <div className="verdict-text">

                  <span>
                    Assessment Result
                  </span>

                  <h3
                    style={{
                      color:
                        getVerdictColor(
                          result.verdict
                        )
                    }}
                  >
                    {result.verdict}
                  </h3>

                </div>

              </div>


              {/* =================================
                  SCORE SECTION
              ================================= */}

              <div className="score-section">

                <div className="score-header">

                  <div>

                    <h3>
                      Eligibility Score
                    </h3>

                    <p>
                      Based on your financial profile
                    </p>

                  </div>

                  <div className="score-number">

                    <strong>
                      {result.eligibilityScore}
                    </strong>

                    <span>
                      / 100
                    </span>

                  </div>

                </div>


                <div className="score-track">

                  <div
                    className="score-progress"
                    style={{
                      width:
                        `${result.eligibilityPercentage}%`,
                      background:
                        getVerdictColor(
                          result.verdict
                        )
                    }}
                  ></div>

                </div>


                <div className="score-scale">

                  <span>
                    Low
                  </span>

                  <span>
                    Moderate
                  </span>

                  <span>
                    Strong
                  </span>

                  <span>
                    Excellent
                  </span>

                </div>

              </div>


              {/* =================================
                  QUICK SUMMARY
              ================================= */}

              <div className="quick-summary">

                <div className="quick-card">

                  <span>
                    Monthly Income
                  </span>

                  <strong>
                    {formatCurrency(monthlySalary)}
                  </strong>

                </div>


                <div className="quick-card">

                  <span>
                    Requested Loan
                  </span>

                  <strong>
                    {formatCurrency(requestedLoan)}
                  </strong>

                </div>


                <div className="quick-card">

                  <span>
                    Credit Score
                  </span>

                  <strong>
                    {creditScore}
                  </strong>

                </div>


                <div className="quick-card">

                  <span>
                    Income-to-Loan
                  </span>

                  <strong>
                    {result.eligibilityRatio}%
                  </strong>

                </div>

              </div>


              {/* =================================
                  ANALYSIS
              ================================= */}

              <div className="analysis-box">

                <div className="analysis-heading">

                  <FaInfoCircle />

                  <strong>
                    Assessment Analysis
                  </strong>

                </div>


                <p>
                  {result.reason}
                </p>

              </div>


              {/* =================================
                  MAX LOAN
              ================================= */}

              {result.maxRecommended > 0 &&
                result.maxRecommended <
                  Number(requestedLoan) && (

                <div className="recommended-box">

                  <div className="recommended-icon">

                    <FaRupeeSign />

                  </div>


                  <div>

                    <span>
                      Recommended Maximum Loan
                    </span>

                    <strong>
                      {formatCurrency(
                        result.maxRecommended
                      )}
                    </strong>

                    <p>
                      Reducing your requested amount
                      may improve your approval chances.
                    </p>

                  </div>


                  <FaArrowRight className="recommended-arrow" />

                </div>

              )}


              {/* =================================
                  PROFILE SUMMARY
              ================================= */}

              <div className="profile-summary">

                <div className="profile-summary-header">

                  <div>

                    <h3>
                      Applicant Summary
                    </h3>

                    <p>
                      Information used for this assessment
                    </p>

                  </div>

                </div>


                <div className="profile-grid">

                  <div className="profile-item">

                    <span>
                      Applicant
                    </span>

                    <strong>
                      {applicantName || "-"}
                    </strong>

                  </div>


                  <div className="profile-item">

                    <span>
                      Age
                    </span>

                    <strong>
                      {age || "-"} years
                    </strong>

                  </div>


                  <div className="profile-item">

                    <span>
                      Employment
                    </span>

                    <strong>
                      {employmentType || "-"}
                    </strong>

                  </div>


                  <div className="profile-item">

                    <span>
                      Credit Score
                    </span>

                    <strong>
                      {creditScore || "-"}
                    </strong>

                  </div>


                  <div className="profile-item">

                    <span>
                      Monthly Income
                    </span>

                    <strong>
                      {formatCurrency(monthlySalary)}
                    </strong>

                  </div>


                  <div className="profile-item">

                    <span>
                      Requested Loan
                    </span>

                    <strong>
                      {formatCurrency(requestedLoan)}
                    </strong>

                  </div>

                </div>

              </div>


              {/* =================================
                  CONDITIONS
              ================================= */}

              {result.conditions &&
                result.conditions.length > 0 && (

                <div className="conditions-box">

                  <h3>
                    Conditions & Requirements
                  </h3>


                  <ul>

                    {result.conditions.map(
                      (condition, index) => (

                      <li key={index}>

                        <span>
                          !
                        </span>

                        {condition}

                      </li>

                    ))}

                  </ul>

                </div>

              )}


              {/* =================================
                  CRITERIA
              ================================= */}

              <div className="criteria-box">

                <h3>
                  Eligibility Criteria
                </h3>

                <p className="criteria-subtitle">
                  Key factors considered during the assessment
                </p>


                <div className="criteria-grid">

                  <div className="criteria-item">

                    <div className="criteria-number">
                      01
                    </div>

                    <div>

                      <strong>
                        Age
                      </strong>

                      <span>
                        Applicant must be between
                        18 and 70 years.
                      </span>

                    </div>

                  </div>


                  <div className="criteria-item">

                    <div className="criteria-number">
                      02
                    </div>

                    <div>

                      <strong>
                        Monthly Income
                      </strong>

                      <span>
                        Minimum monthly income of
                        ₹25,000 is required.
                      </span>

                    </div>

                  </div>


                  <div className="criteria-item">

                    <div className="criteria-number">
                      03
                    </div>

                    <div>

                      <strong>
                        Credit Score
                      </strong>

                      <span>
                        A score of 700 or above is
                        preferred.
                      </span>

                    </div>

                  </div>


                  <div className="criteria-item">

                    <div className="criteria-number">
                      04
                    </div>

                    <div>

                      <strong>
                        Loan Amount
                      </strong>

                      <span>
                        Maximum loan is typically
                        60% of annual income.
                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================
                  DISCLAIMER
              ================================= */}

              <div className="eligibility-disclaimer">

                <strong>
                  Disclaimer:
                </strong>

                Meeting the eligibility criteria does not
                guarantee loan approval. Final approval is
                subject to credit policy, document verification
                and internal risk assessment.

              </div>

            </>

          )}

        </div>

      </div>


      {/* ======================================
          COMPLETE CSS
      ====================================== */}

      <style>{`

        /* =====================================
           PAGE
        ===================================== */

        .eligibility-modern-page {

          width: 100%;

          box-sizing: border-box;

          padding: 26px;

          background: #f4f7fb;

          min-height: calc(100vh - 70px);

          color: #0a2654;

        }


        /* =====================================
           HEADER
        ===================================== */

        .eligibility-heading {

          background: linear-gradient(
            135deg,
            #ffffff,
            #f8fbff
          );

          border: 1px solid #e2e9f2;

          border-radius: 16px;

          padding: 23px 26px;

          display: flex;

          align-items: center;

          gap: 17px;

          margin-bottom: 19px;

          box-shadow:
            0 4px 16px rgba(
              15,
              45,
              85,
              0.06
            );

        }


        .eligibility-heading-icon {

          width: 57px;

          height: 57px;

          border-radius: 14px;

          background: #edf5ff;

          color: #0a4ea3;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 27px;

          flex-shrink: 0;

        }


        .eligibility-heading h1 {

          margin: 0 0 5px;

          font-size: 29px;

          color: #0a2654;

          font-weight: 700;

        }


        .eligibility-heading p {

          margin: 0;

          color: #607893;

          font-size: 13px;

          line-height: 1.5;

        }


        .eligibility-heading-badge {

          margin-left: auto;

          min-width: 215px;

          padding: 11px 15px;

          background: #edf5ff;

          border-radius: 11px;

          display: flex;

          align-items: center;

          gap: 10px;

          color: #0a4ea3;

        }


        .eligibility-heading-badge > svg {

          font-size: 25px;

        }


        .eligibility-heading-badge strong {

          display: block;

          font-size: 12px;

        }


        .eligibility-heading-badge span {

          display: block;

          margin-top: 3px;

          color: #68809b;

          font-size: 10px;

        }


        /* =====================================
           MAIN GRID
        ===================================== */

        .eligibility-main-grid {

          display: grid;

          grid-template-columns:
            minmax(350px, 0.72fr)
            minmax(650px, 1.28fr);

          gap: 18px;

          align-items: start;

        }


        .eligibility-card {

          background: white;

          border: 1px solid #dfe7f0;

          border-radius: 15px;

          box-shadow:
            0 4px 18px rgba(
              15,
              45,
              85,
              0.06
            );

        }


        /* =====================================
           APPLICANT CARD
        ===================================== */

        .applicant-card {

          padding: 22px;

          position: sticky;

          top: 20px;

        }


        .section-heading h2 {

          margin: 0;

          font-size: 20px;

          color: #0a2654;

        }


        .section-heading p {

          margin: 5px 0 21px;

          color: #71859d;

          font-size: 12px;

        }


        /* =====================================
           FORM
        ===================================== */

        .eligibility-field {

          margin-bottom: 17px;

        }


        .eligibility-field label {

          display: block;

          color: #18365e;

          font-size: 12px;

          font-weight: 700;

          margin-bottom: 7px;

        }


        .field-label-row {

          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 7px;

        }


        .field-label-row label {

          margin: 0;

        }


        .field-label-row strong {

          color: #0764dc;

          font-size: 12px;

        }


        .icon-input,
        .icon-select {

          height: 44px;

          border: 1px solid #cbd7e5;

          border-radius: 8px;

          display: flex;

          align-items: center;

          position: relative;

          background: white;

        }


        .icon-input > svg,
        .icon-select > svg {

          color: #50708f;

          font-size: 14px;

          margin-left: 13px;

          flex-shrink: 0;

        }


        .icon-input input {

          width: 100%;

          height: 100%;

          border: none;

          outline: none;

          padding: 0 12px;

          font-size: 13px;

          color: #17375e;

          background: transparent;

          box-sizing: border-box;

        }


        .icon-input:focus-within,
        .icon-select:focus-within {

          border-color: #3b82f6;

          box-shadow:
            0 0 0 3px
            rgba(59,130,246,0.09);

        }


        .icon-select select {

          width: 100%;

          height: 100%;

          border: none;

          outline: none;

          background: transparent;

          padding: 0 12px;

          color: #17375e;

          font-size: 13px;

          appearance: none;

          cursor: pointer;

        }


        .input-suffix {

          color: #8192a7;

          font-size: 11px;

          margin-right: 12px;

        }


        .field-hint {

          display: block;

          margin-top: 5px;

          color: #8192a7;

          font-size: 10px;

        }


        .field-hint strong {

          color: #506a87;

        }


        /* =====================================
           CREDIT SCORE
        ===================================== */

        .credit-score-value {

          color: #075edb !important;

          font-size: 13px !important;

        }


        .credit-input-row {

          display: grid;

          grid-template-columns:
            105px 1fr;

          gap: 15px;

          align-items: center;

        }


        .credit-number {

          height: 43px;

          display: flex;

          align-items: center;

          gap: 9px;

          border: 1px solid #cbd7e5;

          border-radius: 8px;

          padding: 0 10px;

          box-sizing: border-box;

        }


        .credit-number svg {

          color: #52718f;

          font-size: 14px;

        }


        .credit-number input {

          width: 100%;

          border: none;

          outline: none;

          color: #17375e;

          font-size: 13px;

          font-weight: 600;

          background: transparent;

        }


        .credit-slider {

          width: 100%;

          accent-color: #1976ed;

          cursor: pointer;

        }


        .range-labels {

          display: flex;

          justify-content: space-between;

          margin-top: 4px;

          color: #8293a8;

          font-size: 9px;

        }


        /* =====================================
           BUTTONS
        ===================================== */

        .eligibility-actions {

          display: grid;

          grid-template-columns: 1.6fr 0.7fr;

          gap: 9px;

          margin-top: 21px;

        }


        .check-button,
        .reset-button {

          height: 48px;

          border: none;

          border-radius: 8px;

          font-size: 13px;

          font-weight: 700;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          cursor: pointer;

          transition: 0.2s ease;

        }


        .check-button {

          background: #0a2e67;

          color: white;

        }


        .check-button:hover {

          background: #0a3d87;

          transform: translateY(-1px);

        }


        .reset-button {

          background: #64758d;

          color: white;

        }


        .reset-button:hover {

          background: #52647b;

        }


        /* =====================================
           ERROR
        ===================================== */

        .eligibility-error {

          margin-top: 13px;

          padding: 10px 12px;

          background: #fff2f2;

          border: 1px solid #fecaca;

          border-radius: 8px;

          color: #b42318;

          display: flex;

          align-items: center;

          gap: 8px;

          font-size: 11px;

        }


        /* =====================================
           TIP
        ===================================== */

        .assessment-tip {

          margin-top: 17px;

          padding: 12px;

          background: #edf5ff;

          border-radius: 9px;

          display: flex;

          gap: 10px;

        }


        .tip-symbol {

          width: 24px;

          height: 24px;

          border-radius: 50%;

          background: #d9ebff;

          color: #075edb;

          display: flex;

          align-items: center;

          justify-content: center;

          font-weight: 700;

          font-size: 11px;

          flex-shrink: 0;

        }


        .assessment-tip strong {

          display: block;

          color: #075edb;

          font-size: 11px;

        }


        .assessment-tip p {

          margin: 3px 0 0;

          color: #627a97;

          font-size: 10px;

          line-height: 1.5;

        }


        /* =====================================
           RESULTS CARD
        ===================================== */

        .results-card {

          padding: 21px;

          min-height: 600px;

        }


        .results-header h2 {

          margin: 0;

          font-size: 20px;

          color: #0a2654;

        }


        .results-header p {

          margin: 5px 0 18px;

          color: #71859d;

          font-size: 12px;

        }


        /* =====================================
           EMPTY STATE
        ===================================== */

        .eligibility-empty {

          min-height: 520px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          padding: 30px;

          box-sizing: border-box;

        }


        .empty-check-icon {

          width: 70px;

          height: 70px;

          border-radius: 50%;

          background: #edf5ff;

          color: #1469d7;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 30px;

          margin-bottom: 15px;

        }


        .eligibility-empty h3 {

          margin: 0 0 7px;

          color: #17375e;

          font-size: 17px;

        }


        .eligibility-empty > p {

          max-width: 390px;

          margin: 0;

          color: #71849b;

          font-size: 11px;

          line-height: 1.6;

        }


        .empty-features {

          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 9px;

          margin-top: 28px;

          width: 100%;

          max-width: 500px;

        }


        .empty-features div {

          padding: 13px 7px;

          border: 1px solid #e0e8f1;

          border-radius: 9px;

          background: #fbfdff;

        }


        .empty-features svg {

          display: block;

          margin: 0 auto 7px;

          color: #196ed9;

          font-size: 17px;

        }


        .empty-features span {

          color: #607894;

          font-size: 9px;

        }


        /* =====================================
           VERDICT
        ===================================== */

        .verdict-banner {

          border: 1px solid;

          border-radius: 10px;

          padding: 14px 16px;

          display: flex;

          align-items: center;

          gap: 13px;

          margin-bottom: 14px;

        }


        .verdict-icon {

          font-size: 28px;

          display: flex;

        }


        .verdict-text span {

          display: block;

          color: #6e8198;

          font-size: 10px;

          margin-bottom: 3px;

        }


        .verdict-text h3 {

          margin: 0;

          font-size: 19px;

        }


        /* =====================================
           SCORE
        ===================================== */

        .score-section {

          border: 1px solid #dce5ef;

          border-radius: 10px;

          padding: 16px;

          margin-bottom: 13px;

        }


        .score-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 12px;

        }


        .score-header h3 {

          margin: 0;

          color: #17375e;

          font-size: 14px;

        }


        .score-header p {

          margin: 3px 0 0;

          color: #8092a7;

          font-size: 10px;

        }


        .score-number {

          display: flex;

          align-items: baseline;

          gap: 3px;

        }


        .score-number strong {

          color: #0a3b80;

          font-size: 29px;

        }


        .score-number span {

          color: #8092a7;

          font-size: 11px;

        }


        .score-track {

          width: 100%;

          height: 9px;

          background: #e8edf3;

          border-radius: 20px;

          overflow: hidden;

        }


        .score-progress {

          height: 100%;

          border-radius: 20px;

          transition: width 0.4s ease;

        }


        .score-scale {

          display: flex;

          justify-content: space-between;

          margin-top: 5px;

          color: #8998aa;

          font-size: 8px;

        }


        /* =====================================
           QUICK SUMMARY
        ===================================== */

        .quick-summary {

          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 9px;

          margin-bottom: 13px;

        }


        .quick-card {

          background: #f3f7fb;

          border-radius: 8px;

          padding: 11px;

        }


        .quick-card span {

          display: block;

          color: #71859d;

          font-size: 9px;

          margin-bottom: 4px;

        }


        .quick-card strong {

          color: #0a2654;

          font-size: 13px;

        }


        /* =====================================
           ANALYSIS
        ===================================== */

        .analysis-box {

          background: #f8fafc;

          border: 1px solid #e1e8f0;

          border-radius: 9px;

          padding: 13px;

          margin-bottom: 13px;

        }


        .analysis-heading {

          display: flex;

          align-items: center;

          gap: 7px;

          color: #0a4ea3;

          font-size: 12px;

          margin-bottom: 7px;

        }


        .analysis-box p {

          margin: 0;

          color: #5e748f;

          font-size: 10px;

          line-height: 1.6;

        }


        /* =====================================
           RECOMMENDED LOAN
        ===================================== */

        .recommended-box {

          display: flex;

          align-items: center;

          gap: 12px;

          background: #edf5ff;

          border: 1px solid #cfe2fb;

          border-radius: 10px;

          padding: 13px;

          margin-bottom: 13px;

        }


        .recommended-icon {

          width: 38px;

          height: 38px;

          border-radius: 50%;

          background: #d8eaff;

          color: #075edb;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

        }


        .recommended-box span {

          display: block;

          color: #617994;

          font-size: 9px;

          margin-bottom: 2px;

        }


        .recommended-box strong {

          display: block;

          color: #075edb;

          font-size: 18px;

        }


        .recommended-box p {

          margin: 3px 0 0;

          color: #7187a0;

          font-size: 9px;

        }


        .recommended-arrow {

          margin-left: auto;

          color: #3984df;

          font-size: 14px;

        }


        /* =====================================
           PROFILE SUMMARY
        ===================================== */

        .profile-summary {

          border: 1px solid #dce5ef;

          border-radius: 10px;

          overflow: hidden;

          margin-bottom: 13px;

        }


        .profile-summary-header {

          padding: 12px 14px;

          background: #f8fafc;

          border-bottom: 1px solid #e2e8f0;

        }


        .profile-summary-header h3 {

          margin: 0;

          color: #17375e;

          font-size: 13px;

        }


        .profile-summary-header p {

          margin: 3px 0 0;

          color: #8495a8;

          font-size: 9px;

        }


        .profile-grid {

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

        }


        .profile-item {

          padding: 11px 13px;

          border-right: 1px solid #edf1f5;

          border-bottom: 1px solid #edf1f5;

        }


        .profile-item:nth-child(3n) {

          border-right: none;

        }


        .profile-item span {

          display: block;

          color: #7b8da1;

          font-size: 9px;

          margin-bottom: 4px;

        }


        .profile-item strong {

          display: block;

          color: #17375e;

          font-size: 11px;

        }


        /* =====================================
           CONDITIONS
        ===================================== */

        .conditions-box {

          background: #fffbeb;

          border: 1px solid #f5df9c;

          border-radius: 9px;

          padding: 13px;

          margin-bottom: 13px;

        }


        .conditions-box h3 {

          margin: 0 0 9px;

          color: #8a6100;

          font-size: 12px;

        }


        .conditions-box ul {

          margin: 0;

          padding: 0;

          list-style: none;

        }


        .conditions-box li {

          display: flex;

          gap: 8px;

          align-items: flex-start;

          color: #765f2d;

          font-size: 10px;

          line-height: 1.5;

          margin-bottom: 5px;

        }


        .conditions-box li:last-child {

          margin-bottom: 0;

        }


        .conditions-box li span {

          width: 16px;

          height: 16px;

          border-radius: 50%;

          background: #f5d779;

          color: #725500;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 9px;

          font-weight: 700;

          flex-shrink: 0;

        }


        /* =====================================
           CRITERIA
        ===================================== */

        .criteria-box {

          border: 1px solid #dce5ef;

          border-radius: 10px;

          padding: 14px;

          margin-bottom: 13px;

        }


        .criteria-box h3 {

          margin: 0;

          color: #17375e;

          font-size: 13px;

        }


        .criteria-subtitle {

          margin: 3px 0 13px;

          color: #8495a8;

          font-size: 9px;

        }


        .criteria-grid {

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 9px;

        }


        .criteria-item {

          display: flex;

          gap: 9px;

          padding: 10px;

          background: #f8fafc;

          border-radius: 8px;

        }


        .criteria-number {

          color: #2372cf;

          font-size: 10px;

          font-weight: 700;

        }


        .criteria-item strong {

          display: block;

          color: #294566;

          font-size: 10px;

          margin-bottom: 3px;

        }


        .criteria-item span {

          display: block;

          color: #7589a0;

          font-size: 9px;

          line-height: 1.4;

        }


        /* =====================================
           DISCLAIMER
        ===================================== */

        .eligibility-disclaimer {

          padding: 10px 12px;

          background: #f8fafc;

          border-radius: 8px;

          color: #8291a2;

          font-size: 9px;

          line-height: 1.5;

        }


        .eligibility-disclaimer strong {

          color: #5f7084;

        }


        /* =====================================
           RESPONSIVE
        ===================================== */

        @media (max-width: 1200px) {

          .eligibility-main-grid {

            grid-template-columns: 1fr;

          }


          .applicant-card {

            position: static;

          }

        }


        @media (max-width: 800px) {

          .eligibility-modern-page {

            padding: 14px;

          }


          .eligibility-heading {

            flex-wrap: wrap;

          }


          .eligibility-heading-badge {

            margin-left: 0;

            width: 100%;

          }


          .quick-summary {

            grid-template-columns:
              1fr 1fr;

          }


          .profile-grid {

            grid-template-columns:
              1fr 1fr;

          }


          .profile-item:nth-child(3n) {

            border-right: 1px solid #edf1f5;

          }


          .profile-item:nth-child(2n) {

            border-right: none;

          }

        }


        @media (max-width: 600px) {

          .eligibility-heading h1 {

            font-size: 23px;

          }


          .empty-features {

            grid-template-columns:
              1fr 1fr;

          }


          .criteria-grid {

            grid-template-columns: 1fr;

          }


          .profile-grid {

            grid-template-columns: 1fr;

          }


          .profile-item,
          .profile-item:nth-child(2n),
          .profile-item:nth-child(3n) {

            border-right: none;

          }


          .credit-input-row {

            grid-template-columns:
              90px 1fr;

          }

        }


        /* =====================================
           PRINT
        ===================================== */

        @media print {

          .eligibility-modern-page {

            background: white;

            padding: 0;

          }


          .applicant-card {

            display: none;

          }


          .results-card {

            border: none;

            box-shadow: none;

          }

        }

      `}</style>

    </div>

  );

}


export default EligibilityChecker;