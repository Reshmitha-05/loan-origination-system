import { useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
  FaCalculator,
  FaCheckCircle,
  FaFileAlt,
  FaMoneyBillWave,
  FaUser
} from "react-icons/fa";
import API_URL from "../api";


function ApplyForLoan({ onViewApplications }) {

  /* =====================================================
     BASIC APPLICATION STATE
     ===================================================== */

  const [currentStep, setCurrentStep] = useState(1);

  const [loanType, setLoanType] = useState('');

  const [loanAmount, setLoanAmount] = useState('');

  const [tenure, setTenure] = useState('');

  const [purpose, setPurpose] = useState('');


  /* =====================================================
     PERSONAL INFORMATION
     ===================================================== */

  const [fullName, setFullName] = useState(
    localStorage.getItem('userName') || ''
  );

  const [email, setEmail] = useState(
    localStorage.getItem('customerEmail') || ''
  );

  const [phone, setPhone] = useState('');

  const [dob, setDob] = useState('');


  /* =====================================================
     FINANCIAL INFORMATION
     ===================================================== */

  const [employmentType, setEmploymentType] = useState('');

  const [profession, setProfession] = useState('');

  const [company, setCompany] = useState('');

  const [monthlyIncome, setMonthlyIncome] = useState('');

  const [existingEmi, setExistingEmi] = useState('');


  /* =====================================================
     FORM STATE
     ===================================================== */

  const [error, setError] = useState('');

  const [success, setSuccess] = useState(false);

  const [submittedApplicationId, setSubmittedApplicationId] =
    useState(null);


  /* =====================================================
     DOCUMENT STATUS
     ===================================================== */

  const [documentsVerified, setDocumentsVerified] =
    useState(false);


  /* =====================================================
     PREFILL DATA
     ===================================================== */

  useEffect(() => {
  const prefillType =
    localStorage.getItem("prefillLoanType");

  if (prefillType) {
    const typeMap = {
      personal: "Personal",
      home: "Home",
      car: "Car",
      student: "Student",
    };

    setLoanType(
      typeMap[prefillType] || prefillType
    );

    localStorage.removeItem(
      "prefillLoanType"
    );
  }
}, []);


  /* =====================================================
     LOAN DETAILS
     ===================================================== */

  const loanProducts = {

    Personal: {
      rate: 10.5,
      min: 50000,
      max: 1000000
    },

    Home: {
      rate: 8.5,
      min: 100000,
      max: 5000000
    },

    Car: {
      rate: 9,
      min: 100000,
      max: 1500000
    },

    Student: {
      rate: 8,
      min: 50000,
      max: 2000000
    }

  };


  const selectedLoan =
    loanProducts[loanType];


  /* =====================================================
     EMI CALCULATION
     ===================================================== */

  const calculateEMI = () => {

    if (
      !loanAmount ||
      !tenure ||
      !selectedLoan
    ) {

      return 0;

    }

    const principal =
      Number(loanAmount);

    const annualRate =
      selectedLoan.rate;

    const months =
      Number(tenure) * 12;

    const monthlyRate =
      annualRate / 12 / 100;


    if (monthlyRate === 0) {

      return principal / months;

    }


    const emi =
      principal *
      monthlyRate *
      Math.pow(
        1 + monthlyRate,
        months
      ) /
      (
        Math.pow(
          1 + monthlyRate,
          months
        ) - 1
      );


    return Math.round(emi);

  };


  const estimatedEMI =
    calculateEMI();


  /* =====================================================
     VALIDATION
     ===================================================== */

  const validateStep = () => {

    setError('');


    /* Step 1 */

    if (currentStep === 1) {

      if (!fullName.trim()) {

        setError(
          'Please enter your full name.'
        );

        return false;

      }


      if (!email.trim()) {

        setError(
          'Please enter your email address.'
        );

        return false;

      }


      if (!phone.trim()) {

        setError(
          'Please enter your phone number.'
        );

        return false;

      }

      return true;

    }


    /* Step 2 */

    if (currentStep === 2) {

      if (!loanType) {

        setError(
          'Please select a loan type.'
        );

        return false;

      }


      if (
        !loanAmount ||
        Number(loanAmount) <= 0
      ) {

        setError(
          'Please enter a valid loan amount.'
        );

        return false;

      }


      if (selectedLoan) {

        if (
          Number(loanAmount) <
          selectedLoan.min
        ) {

          setError(
            `Minimum loan amount for ${loanType} Loan is ₹${selectedLoan.min.toLocaleString('en-IN')}.`
          );

          return false;

        }


        if (
          Number(loanAmount) >
          selectedLoan.max
        ) {

          setError(
            `Maximum loan amount for ${loanType} Loan is ₹${selectedLoan.max.toLocaleString('en-IN')}.`
          );

          return false;

        }

      }


      if (!tenure) {

        setError(
          'Please select a loan tenure.'
        );

        return false;

      }


      if (
        !purpose.trim() ||
        purpose.trim().length < 10
      ) {

        setError(
          'Please provide a detailed loan purpose (minimum 10 characters).'
        );

        return false;

      }

      return true;

    }


    /* Step 3 */

    if (currentStep === 3) {

      if (!employmentType) {

        setError(
          'Please select your employment type.'
        );

        return false;

      }


      if (!profession.trim()) {

        setError(
          'Please enter your profession.'
        );

        return false;

      }


      if (
        !monthlyIncome ||
        Number(monthlyIncome) <= 0
      ) {

        setError(
          'Please enter your monthly income.'
        );

        return false;

      }

      return true;

    }


    return true;

  };


  /* =====================================================
     NEXT STEP
     ===================================================== */

  const handleNext = () => {

    if (!validateStep()) {
      return;
    }

    setCurrentStep(prev =>
      Math.min(prev + 1, 4)
    );

  };


  /* =====================================================
     PREVIOUS STEP
     ===================================================== */

  const handleBack = () => {

    setError('');

    setCurrentStep(prev =>
      Math.max(prev - 1, 1)
    );

  };


  /* =====================================================
     SUBMIT APPLICATION
     ===================================================== */

 const handleSubmit = async () => {
  setError('');

  try {
    const customerEmail =
      localStorage.getItem('customerEmail') || email;

    if (!customerEmail) {
      setError('Customer email not found. Please log in again.');
      return;
    }

    /*
     * =====================================================
     * STEP 1 — FIND CUSTOMER IN DATABASE
     * =====================================================
     */

    const customersResponse = await fetch(`${API_URL}/customers`);

    if (!customersResponse.ok) {
      throw new Error('Unable to load customer information.');
    }

    const customers = await customersResponse.json();

    let customer = customers.find(
      (c) =>
        c.email &&
        c.email.toLowerCase() === customerEmail.toLowerCase()
    );

    /*
     * =====================================================
     * STEP 2 — CREATE CUSTOMER IF NOT FOUND
     * =====================================================
     */

    if (!customer) {
      const customerResponse = await fetch(`${API_URL}/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: fullName,
            email: customerEmail,
            phoneNumber: phone,
          }),
        }
      );

      if (!customerResponse.ok) {
        throw new Error('Unable to create customer record.');
      }

      customer = await customerResponse.json();
    }

    /*
     * =====================================================
     * STEP 3 — CREATE LOAN IN DATABASE
     * =====================================================
     */

    const loanResponse = await fetch(`${API_URL}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customer.id,
          loanAmount: parseFloat(loanAmount),
          loanType: loanType,
          status: 'Pending',
        }),
      }
    );

    if (!loanResponse.ok) {
      throw new Error('Unable to create loan record.');
    }

    const savedLoan = await loanResponse.json();

    /*
     * =====================================================
     * STEP 4 — SAVE APPLICATION FOR CURRENT UI
     * =====================================================
     */

    const applicationId = Date.now();

    const pendingDocuments = JSON.parse(
      localStorage.getItem(
        'pendingApplicationDocuments'
      ) || '[]'
    );

    const newApplication = {
      id: applicationId,

      customerId: customer.id,

      customerName:
        fullName || customer.name || 'Customer',

      customerEmail: customerEmail,

      loanId: savedLoan.id,

      loanType,

      loanAmount: parseFloat(loanAmount),

      tenure,

      purpose,

      employmentType,

      profession,

      company,

      monthlyIncome: parseFloat(monthlyIncome) || 0,

      existingEmi: parseFloat(existingEmi) || 0,

      status: 'Pending',

      appliedDate:
        new Date().toLocaleDateString('en-IN'),

      appliedTime:
        new Date().toLocaleTimeString('en-IN'),

      documents: pendingDocuments.map((doc) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        uploadedAt: doc.uploadedAt,
        status: doc.status,
        analysisResult:
          doc.analysisResult || null,
      })),
    };

    /*
     * =====================================================
     * STEP 5 — KEEP APPLICATION DATA FOR CURRENT UI
     * =====================================================
     */

    const stored =
      localStorage.getItem('customerApplications');

    const existingApplications = stored
      ? JSON.parse(stored)
      : [];

    const updatedApplications = [
      ...existingApplications,
      newApplication,
    ];

    localStorage.setItem(
      'customerApplications',
      JSON.stringify(updatedApplications)
    );

    /*
     * =====================================================
     * STEP 6 — CLEAN TEMPORARY DOCUMENT DATA
     * =====================================================
     */

    localStorage.removeItem(
      'pendingApplicationDocuments'
    );

    localStorage.removeItem('documentsVerified');

    /*
     * =====================================================
     * STEP 7 — SHOW SUCCESS SCREEN
     * =====================================================
     */

    setSubmittedApplicationId(applicationId);

    setSuccess(true);

  } catch (err) {
    console.error(
      'Loan application submission error:',
      err
    );

    setError(
      err.message ||
      'Something went wrong while submitting your application.'
    );
  }
};


  /* =====================================================
     RESET FORM
     ===================================================== */

  const resetForm = () => {

    setCurrentStep(1);

    setLoanType('');

    setLoanAmount('');

    setTenure('');

    setPurpose('');

    setPhone('');

    setDob('');

    setEmploymentType('');

    setProfession('');

    setCompany('');

    setMonthlyIncome('');

    setExistingEmi('');

    setError('');

    setSuccess(false);

    setSubmittedApplicationId(null);

  };


  /* =====================================================
     SUCCESS SCREEN
     ===================================================== */

  if (success) {

    return (

      <div className="page-container">

        <div className="loan-success-card">

          <div className="loan-success-icon">

            <FaCheckCircle />

          </div>


          <h2>
            Application Submitted Successfully
          </h2>


          <p>
            Your {loanType} Loan application has been
            submitted and is now under review.
          </p>


          <div className="submitted-application-details">

            <div>

              <span>
                Application ID
              </span>

              <strong>
                #{submittedApplicationId}
              </strong>

            </div>


            <div>

              <span>
                Loan Amount
              </span>

              <strong>
                ₹{Number(loanAmount).toLocaleString('en-IN')}
              </strong>

            </div>


            <div>

              <span>
                Status
              </span>

              <strong className="pending-text">
                Pending Review
              </strong>

            </div>

          </div>


          <p className="success-note">

            You will be notified when an administrator
            reviews your application.

          </p>


          <div className="success-actions">

            <button
  className="btn btn-primary"
  onClick={onViewApplications}
>
  View My Applications
</button>


            <button
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Submit Another Application
            </button>

          </div>

        </div>

      </div>

    );

  }


  /* =====================================================
     MAIN FORM
     ===================================================== */

  return (

    <div className="page-container">

      <div className="apply-loan-page">


        {/* ================= HEADER ================= */}

        <div className="page-header">

          <h2 className="page-title">
            Apply for a Loan
          </h2>

          <p className="page-subtitle">
            Complete your application to request a loan.
          </p>

        </div>


        {/* ================= PROGRESS ================= */}

        <div className="loan-progress">

          {[

            {
              number: 1,
              title: 'Personal Details'
            },

            {
              number: 2,
              title: 'Loan Details'
            },

            {
              number: 3,
              title: 'Financial Details'
            },

            {
              number: 4,
              title: 'Review'
            }

          ].map((step) => (

            <div
              key={step.number}
              className={`loan-progress-step ${
                currentStep >= step.number
                  ? 'active'
                  : ''
              }`}
            >

              <div className="loan-progress-number">

                {currentStep > step.number
                  ? <FaCheckCircle />
                  : step.number}

              </div>

              <span>
                {step.title}
              </span>

            </div>

          ))}

        </div>


        {/* ================= ERROR ================= */}

        {error && (

          <div className="loan-form-error">
            {error}
          </div>

        )}


        {/* =================================================
            STEP 1 — PERSONAL DETAILS
            ================================================= */}

        {currentStep === 1 && (

          <section className="loan-form-section">

            <div className="loan-section-heading">

              <div className="loan-section-icon">
                <FaUser />
              </div>

              <div>

                <h3>
                  Personal Information
                </h3>

                <p>
                  Tell us a little about yourself.
                </p>

              </div>

            </div>


            <div className="loan-form-grid">


              <div className="loan-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Enter your full name"
                />

              </div>


              <div className="loan-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  readOnly
                />

              </div>


              <div className="loan-form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter your phone number"
                />

              </div>


              <div className="loan-form-group">

                <label>
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={dob}
                  onChange={(e) =>
                    setDob(e.target.value)
                  }
                />

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            STEP 2 — LOAN DETAILS
            ================================================= */}

        {currentStep === 2 && (

          <section className="loan-form-section">

            <div className="loan-section-heading">

              <div className="loan-section-icon">
                <FaMoneyBillWave />
              </div>

              <div>

                <h3>
                  Loan Details
                </h3>

                <p>
                  Select the loan product and amount you need.
                </p>

              </div>

            </div>


            <div className="loan-form-grid">


              <div className="loan-form-group">

                <label>
                  Loan Product
                </label>

                <select
                  value={loanType}
                  onChange={(e) =>
                    setLoanType(e.target.value)
                  }
                >

                  <option value="">
                    Select loan product
                  </option>

                  <option value="Personal">
                    Personal Loan
                  </option>

                  <option value="Home">
                    Home Loan
                  </option>

                  <option value="Car">
                    Car Loan
                  </option>

                  <option value="Student">
                    Student Loan
                  </option>

                </select>

              </div>


              <div className="loan-form-group">

                <label>
                  Requested Amount
                </label>

                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) =>
                    setLoanAmount(e.target.value)
                  }
                  placeholder="Enter amount"
                  min="1000"
                  step="1000"
                />

                {selectedLoan && (

                  <small className="loan-field-hint">

                    Range: ₹
                    {selectedLoan.min.toLocaleString('en-IN')}
                    {' - '}
                    ₹
                    {selectedLoan.max.toLocaleString('en-IN')}

                  </small>

                )}

              </div>


              <div className="loan-form-group">

                <label>
                  Loan Tenure
                </label>

                <select
                  value={tenure}
                  onChange={(e) =>
                    setTenure(e.target.value)
                  }
                >

                  <option value="">
                    Select tenure
                  </option>

                  <option value="1">
                    1 Year
                  </option>

                  <option value="2">
                    2 Years
                  </option>

                  <option value="3">
                    3 Years
                  </option>

                  <option value="5">
                    5 Years
                  </option>

                  <option value="7">
                    7 Years
                  </option>

                  <option value="10">
                    10 Years
                  </option>

                  <option value="15">
                    15 Years
                  </option>

                  <option value="20">
                    20 Years
                  </option>

                  <option value="30">
                    30 Years
                  </option>

                </select>

              </div>


              <div className="loan-form-group loan-full-width">

                <label>
                  Purpose of Loan
                </label>

                <textarea
                  value={purpose}
                  onChange={(e) =>
                    setPurpose(e.target.value)
                  }
                  placeholder="Explain how you plan to use the loan..."
                  rows="4"
                />

              </div>

            </div>


            {/* EMI PREVIEW */}

            {estimatedEMI > 0 && (

              <div className="loan-emi-preview">

                <div className="loan-emi-icon">
                  <FaCalculator />
                </div>

                <div>

                  <span>
                    Estimated Monthly EMI
                  </span>

                  <strong>
                    ₹{estimatedEMI.toLocaleString('en-IN')}
                  </strong>

                </div>

                <div className="loan-emi-rate">

                  <span>
                    Interest Rate
                  </span>

                  <strong>
                    {selectedLoan?.rate}%
                  </strong>

                </div>

              </div>

            )}

          </section>

        )}


        {/* =================================================
            STEP 3 — FINANCIAL DETAILS
            ================================================= */}

        {currentStep === 3 && (

          <section className="loan-form-section">

            <div className="loan-section-heading">

              <div className="loan-section-icon">
                <FaBriefcase />
              </div>

              <div>

                <h3>
                  Financial Information
                </h3>

                <p>
                  These details help us assess your loan application.
                </p>

              </div>

            </div>


            <div className="loan-form-grid">


              <div className="loan-form-group">

                <label>
                  Employment Type
                </label>

                <select
                  value={employmentType}
                  onChange={(e) =>
                    setEmploymentType(e.target.value)
                  }
                >

                  <option value="">
                    Select employment type
                  </option>

                  <option value="Salaried">
                    Salaried
                  </option>

                  <option value="Self Employed">
                    Self Employed
                  </option>

                  <option value="Business Owner">
                    Business Owner
                  </option>

                  <option value="Student">
                    Student
                  </option>

                  <option value="Retired">
                    Retired
                  </option>

                </select>

              </div>


              <div className="loan-form-group">

                <label>
                  Profession
                </label>

                <input
                  type="text"
                  value={profession}
                  onChange={(e) =>
                    setProfession(e.target.value)
                  }
                  placeholder="e.g. Software Engineer"
                />

              </div>


              <div className="loan-form-group">

                <label>
                  Company / Organization
                </label>

                <input
                  type="text"
                  value={company}
                  onChange={(e) =>
                    setCompany(e.target.value)
                  }
                  placeholder="Enter company name"
                />

              </div>


              <div className="loan-form-group">

                <label>
                  Monthly Income
                </label>

                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) =>
                    setMonthlyIncome(e.target.value)
                  }
                  placeholder="Enter monthly income"
                  min="0"
                />

              </div>


              <div className="loan-form-group">

                <label>
                  Existing Monthly EMI
                </label>

                <input
                  type="number"
                  value={existingEmi}
                  onChange={(e) =>
                    setExistingEmi(e.target.value)
                  }
                  placeholder="Enter existing EMI"
                  min="0"
                />

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            STEP 4 — REVIEW
            ================================================= */}

        {currentStep === 4 && (

          <section className="loan-form-section">

            <div className="loan-section-heading">

              <div className="loan-section-icon">
                <FaFileAlt />
              </div>

              <div>

                <h3>
                  Review Your Application
                </h3>

                <p>
                  Please verify the information before submitting.
                </p>

              </div>

            </div>


            <div className="application-review">


              {/* Personal */}

              <div className="review-block">

                <h4>
                  Personal Information
                </h4>

                <div className="review-grid">

                  <div>
                    <span>Full Name</span>
                    <strong>{fullName || 'Not provided'}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{email || 'Not provided'}</strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>{phone || 'Not provided'}</strong>
                  </div>

                  <div>
                    <span>Date of Birth</span>
                    <strong>{dob || 'Not provided'}</strong>
                  </div>

                </div>

              </div>


              {/* Loan */}

              <div className="review-block">

                <h4>
                  Loan Information
                </h4>

                <div className="review-grid">

                  <div>
                    <span>Loan Product</span>
                    <strong>{loanType} Loan</strong>
                  </div>

                  <div>
                    <span>Requested Amount</span>
                    <strong>
                      ₹{Number(loanAmount).toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <div>
                    <span>Tenure</span>
                    <strong>{tenure} Years</strong>
                  </div>

                  <div>
                    <span>Interest Rate</span>
                    <strong>{selectedLoan?.rate}%</strong>
                  </div>

                  <div>
                    <span>Estimated EMI</span>
                    <strong>
                      ₹{estimatedEMI.toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <div>
                    <span>Purpose</span>
                    <strong>{purpose}</strong>
                  </div>

                </div>

              </div>


              {/* Financial */}

              <div className="review-block">

                <h4>
                  Financial Information
                </h4>

                <div className="review-grid">

                  <div>
                    <span>Employment</span>
                    <strong>{employmentType}</strong>
                  </div>

                  <div>
                    <span>Profession</span>
                    <strong>{profession}</strong>
                  </div>

                  <div>
                    <span>Company</span>
                    <strong>{company || 'Not provided'}</strong>
                  </div>

                  <div>
                    <span>Monthly Income</span>
                    <strong>
                      ₹{Number(monthlyIncome).toLocaleString('en-IN')}
                    </strong>
                  </div>

                </div>

              </div>


              {/* Documents */}

              <div
                className={`review-document-status ${
                  documentsVerified
                    ? 'verified'
                    : 'not-verified'
                }`}
              >

                {documentsVerified ? (
                  <>
                    <FaCheckCircle />

                    <div>

                      <strong>
                        Documents Verified
                      </strong>

                      <p>
                        Your uploaded documents have been verified.
                      </p>

                    </div>
                  </>
                ) : (
                  <>
                    <FaFileAlt />

                    <div>

                      <strong>
                        Documents Not Yet Verified
                      </strong>

                      <p>
                        You can still submit the application, but document verification may be required during review.
                      </p>

                    </div>
                  </>
                )}

              </div>

            </div>

          </section>

        )}


        {/* ================= NAVIGATION ================= */}

        <div className="loan-form-actions">


          {currentStep > 1 && (

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBack}
            >

              <FaArrowLeft />

              Back

            </button>

          )}


          <div className="loan-actions-right">

            {currentStep < 4 ? (

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >

                Continue

                <FaArrowRight />

              </button>

            ) : (

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >

                Submit Loan Application

                <FaArrowRight />

              </button>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}


export default ApplyForLoan;