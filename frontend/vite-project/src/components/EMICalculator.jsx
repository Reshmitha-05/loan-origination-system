import { useState } from "react";

import {
  FaCalculator,
  FaChartBar,
  FaRupeeSign,
  FaCoins,
  FaHome,
  FaCar,
  FaGraduationCap,
  FaBriefcase,
  FaCalendarAlt,
  FaFileAlt,
  FaLightbulb,
  FaSyncAlt,
  FaPrint,
  FaChevronDown,
  FaArrowRight
} from "react-icons/fa";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";


function EMICalculator() {

  // =========================
  // INPUT STATES
  // =========================

  const [loanType, setLoanType] = useState("Home Loan");

  const [loanAmount, setLoanAmount] = useState(100000);

  const [interestRate, setInterestRate] = useState(9);

  const [tenureYears, setTenureYears] = useState(5);

  const [purpose, setPurpose] = useState("");

  const [result, setResult] = useState(null);

  const [showAmortization, setShowAmortization] = useState(true);

  const [error, setError] = useState("");


  // =========================
  // LOAN TYPE INFORMATION
  // =========================

  const loanTypes = {
    "Home Loan": {
      icon: <FaHome />,
      rate: 8.5,
      min: 100000,
      max: 5000000
    },

    "Personal Loan": {
      icon: <FaBriefcase />,
      rate: 11,
      min: 50000,
      max: 2000000
    },

    "Vehicle Loan": {
      icon: <FaCar />,
      rate: 9.5,
      min: 50000,
      max: 3000000
    },

    "Education Loan": {
      icon: <FaGraduationCap />,
      rate: 8,
      min: 50000,
      max: 1000000
    }
  };


  // =========================
  // CURRENCY FORMAT
  // =========================

  const formatCurrency = (amount) => {

    if (amount === "" || amount === null || amount === undefined) {
      return "₹0";
    }

    return "₹" + Math.round(amount).toLocaleString("en-IN");
  };


  // =========================
  // EMI CALCULATION
  // =========================

  const calculateEMI = () => {

    setError("");

    const amount = Number(loanAmount);

    const rate = Number(interestRate);

    const years = Number(tenureYears);


    if (!amount || amount < 10000 || amount > 100000000) {

      setError(
        "Please enter a valid loan amount between ₹10,000 and ₹1,00,00,000."
      );

      setResult(null);

      return;
    }


    if (!rate || rate <= 0 || rate > 50) {

      setError(
        "Please enter a valid interest rate between 0.1% and 50%."
      );

      setResult(null);

      return;
    }


    if (!years || years < 1 || years > 40) {

      setError(
        "Please enter a valid loan tenure between 1 and 40 years."
      );

      setResult(null);

      return;
    }


    const monthlyRate = rate / 12 / 100;

    const months = years * 12;


    const emi =
      (amount *
        monthlyRate *
        Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);


    const totalPayable = emi * months;

    const totalInterest = totalPayable - amount;


    // =========================
    // AMORTIZATION
    // =========================

    const amortizationTable = [];

    let balance = amount;


    for (let month = 1; month <= months; month++) {

      const openingBalance = balance;

      const interestComponent =
        balance * monthlyRate;

      const principalComponent =
        emi - interestComponent;


      balance -= principalComponent;


      if (balance < 0) {
        balance = 0;
      }


      amortizationTable.push({

        month,

        openingBalance,

        emi,

        principal: principalComponent,

        interest: interestComponent,

        closingBalance: balance

      });

    }


    // =========================
    // PIE CHART
    // =========================

    const pieData = [

      {
        name: "Principal",
        value: amount
      },

      {
        name: "Interest",
        value: totalInterest
      }

    ];


    // =========================
    // YEARLY BREAKDOWN
    // =========================

    const yearlyData = [];


    for (let year = 1; year <= years; year++) {

      const start = (year - 1) * 12;

      const end = Math.min(year * 12, amortizationTable.length);

      const yearRows =
        amortizationTable.slice(start, end);


      const principal =
        yearRows.reduce(
          (sum, row) => sum + row.principal,
          0
        );


      const interest =
        yearRows.reduce(
          (sum, row) => sum + row.interest,
          0
        );


      yearlyData.push({

        year: `Year ${year}`,

        principal,

        interest

      });

    }


    setResult({

      emi,

      totalPayable,

      totalInterest,

      principal: amount,

      pieData,

      yearlyData,

      amortizationTable

    });

  };


  // =========================
  // RESET
  // =========================

  const handleReset = () => {

    setLoanType("Home Loan");

    setLoanAmount(100000);

    setInterestRate(9);

    setTenureYears(5);

    setPurpose("");

    setResult(null);

    setError("");

    setShowAmortization(true);

  };


  // =========================
  // PRINT
  // =========================

  const handlePrint = () => {

    window.print();

  };


  // =========================
  // LOAN TYPE CHANGE
  // =========================

  const handleLoanTypeChange = (type) => {

    setLoanType(type);

    const information = loanTypes[type];

    if (information) {

      setInterestRate(information.rate);

    }

  };


  // =========================
  // RENDER
  // =========================

  return (

    <div className="emi-modern-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="emi-heading">

        <div className="emi-heading-icon">

          <FaCalculator />

        </div>


        <div>

          <h1>
            Loan EMI Calculator
          </h1>

          <p>
            Plan your finances better. Calculate your monthly EMI,
            total interest, and total payable amount before applying
            for a loan.
          </p>

        </div>


        <div className="emi-heading-badge">

          <FaChartBar />

          <div>

            <strong>
              Smarter financial decisions
            </strong>

            <span>
              Plan your loan confidently
            </span>

          </div>

        </div>

      </div>


      {/* ======================================
          MAIN GRID
      ====================================== */}

      <div className="emi-main-grid">


        {/* ====================================
            LEFT — LOAN DETAILS
        ==================================== */}

        <div className="emi-card loan-details-card">

          <div className="section-heading">

            <h2>
              Loan Details
            </h2>

            <p>
              Enter your loan information to calculate EMI
            </p>

          </div>


          {/* LOAN TYPE */}

          <div className="emi-field">

            <label>
              Loan Type
            </label>


            <div className="loan-type-wrapper">

              <span className="field-icon">

                {loanTypes[loanType]?.icon}

              </span>


              <select

                value={loanType}

                onChange={(e) =>
                  handleLoanTypeChange(e.target.value)
                }

              >

                {Object.keys(loanTypes).map((type) => (

                  <option key={type} value={type}>

                    {type}

                  </option>

                ))}

              </select>


              <FaChevronDown className="select-arrow" />

            </div>

          </div>


          {/* LOAN INFORMATION */}

          <div className="loan-info-strip">

            <div>

              <span>
                Typical Interest Rate
              </span>

              <strong>
                {loanTypes[loanType].rate}% p.a.
              </strong>

            </div>


            <div>

              <span>
                Min Amount
              </span>

              <strong>
                {formatCurrency(loanTypes[loanType].min)}
              </strong>

            </div>


            <div>

              <span>
                Max Amount
              </span>

              <strong>
                {formatCurrency(loanTypes[loanType].max)}
              </strong>

            </div>

          </div>


          {/* LOAN AMOUNT */}

          <div className="emi-field slider-field">

            <div className="field-title-row">

              <label>
                Loan Amount
              </label>

              <strong>
                {formatCurrency(loanAmount)}
              </strong>

            </div>


            <div className="slider-input-row">

              <div className="input-prefix">
                ₹
              </div>


              <input

                type="number"

                value={loanAmount}

                onChange={(e) => {

                  const value = e.target.value;

                  setLoanAmount(
                    value === "" ? "" : Number(value)
                  );

                }}

              />


              <input

                type="range"

                min="10000"

                max="100000000"

                step="10000"

                value={loanAmount || 10000}

                onChange={(e) =>
                  setLoanAmount(Number(e.target.value))
                }

              />

            </div>


            <div className="range-labels">

              <span>
                ₹10,000
              </span>

              <span>
                ₹1,00,00,000
              </span>

            </div>

          </div>


          {/* INTEREST RATE */}

          <div className="emi-field slider-field">

            <div className="field-title-row">

              <label>
                Annual Interest Rate (%)
              </label>

              <strong>
                {interestRate}%
              </strong>

            </div>


            <div className="slider-input-row">

              <div className="input-prefix">
                %
              </div>


              <input

                type="number"

                min="0.1"

                max="50"

                step="0.1"

                value={interestRate}

                onChange={(e) => {

                  const value = e.target.value;

                  setInterestRate(
                    value === "" ? "" : Number(value)
                  );

                }}

              />


              <input

                type="range"

                min="0.1"

                max="50"

                step="0.1"

                value={interestRate || 0.1}

                onChange={(e) =>
                  setInterestRate(Number(e.target.value))
                }

              />

            </div>


            <div className="range-labels">

              <span>
                0.1%
              </span>

              <span>
                50%
              </span>

            </div>

          </div>


          {/* TENURE */}

          <div className="emi-field slider-field">

            <div className="field-title-row">

              <label>
                Loan Tenure (Years)
              </label>

              <strong>
                {tenureYears} years
              </strong>

            </div>


            <div className="slider-input-row">

              <div className="input-prefix calendar-icon">
                <FaCalendarAlt />
              </div>


              <input

                type="number"

                min="1"

                max="40"

                value={tenureYears}

                onChange={(e) => {

                  const value = e.target.value;

                  setTenureYears(
                    value === "" ? "" : Number(value)
                  );

                }}

              />


              <input

                type="range"

                min="1"

                max="40"

                step="1"

                value={tenureYears || 1}

                onChange={(e) =>
                  setTenureYears(Number(e.target.value))
                }

              />

            </div>


            <div className="range-labels">

              <span>
                1 year
              </span>

              <span>
                40 years
              </span>

            </div>

          </div>


          {/* PURPOSE */}

          <div className="emi-field">

            <label>
              Purpose <span>(Optional)</span>
            </label>


            <div className="purpose-input">

              <FaFileAlt />

              <input

                type="text"

                placeholder="e.g. Home purchase, Education, Business..."

                value={purpose}

                onChange={(e) =>
                  setPurpose(e.target.value)
                }

              />

            </div>

          </div>


          {/* BUTTONS */}

          <div className="emi-action-buttons">

            <button
              className="calculate-button"
              onClick={calculateEMI}
            >

              <FaCalculator />

              Calculate EMI

            </button>


            <button
              className="reset-button"
              onClick={handleReset}
            >

              <FaSyncAlt />

              Reset

            </button>

          </div>


          {/* ERROR */}

          {error && (

            <div className="emi-error">

              {error}

            </div>

          )}


          {/* TIP */}

          <div className="emi-tip">

            <div className="tip-icon">

              <FaLightbulb />

            </div>


            <div>

              <strong>
                Tip
              </strong>

              <p>
                Adjust the loan amount, interest rate, or tenure
                to see how it affects your EMI and total payable amount.
              </p>

            </div>

          </div>

        </div>


        {/* ====================================
            RIGHT — RESULTS
        ==================================== */}

        <div className="emi-card results-card">


          <div className="results-heading">

            <div>

              <h2>
                Calculation Results
              </h2>

              <p>
                Here's your loan repayment summary
              </p>

            </div>


            {result && (

              <button
                className="print-button"
                onClick={handlePrint}
              >

                <FaPrint />

                Print Summary

              </button>

            )}

          </div>


          {!result ? (

            /* =================================
               EMPTY RESULT STATE
            ================================= */

            <div className="empty-results">

              <div className="empty-icon">

                <FaCalculator />

              </div>

              <h3>
                Your EMI results will appear here
              </h3>

              <p>
                Enter your loan details and click
                <strong> Calculate EMI </strong>
                to see your repayment summary.
              </p>

            </div>

          ) : (

            <>

              {/* ==============================
                  RESULT CARDS
              ============================== */}

              <div className="result-metrics">


                <div className="metric-card">

                  <div className="metric-icon">
                    <FaRupeeSign />
                  </div>

                  <div>

                    <span>
                      Monthly EMI
                    </span>

                    <strong>
                      {formatCurrency(result.emi)}
                    </strong>

                    <small>
                      Your monthly repayment
                    </small>

                  </div>

                </div>


                <div className="metric-card">

                  <div className="metric-icon">
                    <FaChartBar />
                  </div>

                  <div>

                    <span>
                      Total Interest
                    </span>

                    <strong>
                      {formatCurrency(result.totalInterest)}
                    </strong>

                    <small>
                      Total interest over {tenureYears} years
                    </small>

                  </div>

                </div>


                <div className="metric-card">

                  <div className="metric-icon">
                    <FaCoins />
                  </div>

                  <div>

                    <span>
                      Total Payable
                    </span>

                    <strong>
                      {formatCurrency(result.totalPayable)}
                    </strong>

                    <small>
                      Principal + Interest
                    </small>

                  </div>

                </div>

              </div>


              {/* ==============================
                  LOAN SUMMARY STRIP
              ============================== */}

              <div className="loan-summary-strip">

                <div>

                  <span>
                    Principal Amount
                  </span>

                  <strong>
                    {formatCurrency(result.principal)}
                  </strong>

                </div>


                <div>

                  <span>
                    Interest Rate
                  </span>

                  <strong>
                    {interestRate}% p.a.
                  </strong>

                </div>


                <div>

                  <span>
                    Loan Tenure
                  </span>

                  <strong>
                    {tenureYears} years ({tenureYears * 12} months)
                  </strong>

                </div>


                <div>

                  <span>
                    Loan Type
                  </span>

                  <strong>
                    {loanType}
                  </strong>

                </div>

              </div>


              {/* ==============================
                  CHARTS
              ============================== */}

              <div className="charts-grid">


                {/* PIE */}

                <div className="chart-card">

                  <h3>
                    Payment Breakdown
                  </h3>

                  <p>
                    Principal vs Interest
                  </p>


                  <div className="pie-content">

                    <div className="pie-chart">

                      <ResponsiveContainer
                        width="100%"
                        height={230}
                      >

                        <PieChart>

                          <Pie

                            data={result.pieData}

                            dataKey="value"

                            nameKey="name"

                            cx="50%"

                            cy="50%"

                            innerRadius={65}

                            outerRadius={90}

                            paddingAngle={3}

                          >

                            <Cell fill="#0A2654" />

                            <Cell fill="#3B82F6" />

                          </Pie>

                        </PieChart>

                      </ResponsiveContainer>


                      <div className="pie-center">

                        <strong>
                          {formatCurrency(result.totalPayable)}
                        </strong>

                        <span>
                          Total Payable
                        </span>

                      </div>

                    </div>


                    <div className="chart-legend-modern">

                      <div>

                        <span className="legend-dot principal-dot"></span>

                        <div>

                          <strong>
                            Principal
                          </strong>

                          <span>
                            {formatCurrency(result.principal)}
                          </span>

                        </div>

                      </div>


                      <div>

                        <span className="legend-dot interest-dot"></span>

                        <div>

                          <strong>
                            Interest
                          </strong>

                          <span>
                            {formatCurrency(result.totalInterest)}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>


                {/* YEARLY CHART */}

                <div className="chart-card">

                  <h3>
                    Year-wise Breakdown
                  </h3>

                  <p>
                    How your payments are distributed
                  </p>


                  <div className="bar-chart">

                    <ResponsiveContainer
                      width="100%"
                      height={250}
                    >

                      <BarChart
                        data={result.yearlyData.slice(0, 5)}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E2E8F0"
                        />

                        <XAxis
                          dataKey="year"
                          tick={{
                            fill: "#475569",
                            fontSize: 12
                          }}
                        />

                        <YAxis
                          tick={{
                            fill: "#64748B",
                            fontSize: 11
                          }}

                          tickFormatter={(value) =>
                            `₹${Math.round(value / 1000)}k`
                          }

                        />

                        <Tooltip
                          formatter={(value) =>
                            formatCurrency(value)
                          }
                        />


                        <Bar
                          dataKey="principal"
                          stackId="a"
                          fill="#0A2654"
                          radius={[0, 0, 0, 0]}
                        />

                        <Bar
                          dataKey="interest"
                          stackId="a"
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                </div>

              </div>


              {/* ==============================
                  AMORTIZATION
              ============================== */}

              <div className="amortization-modern">

                <div
                  className="amortization-title-row"
                  onClick={() =>
                    setShowAmortization(!showAmortization)
                  }
                >

                  <div>

                    <h3>
                      Amortization Schedule
                      <span> (First 12 Months)</span>
                    </h3>

                    <p>
                      Detailed monthly repayment breakdown
                    </p>

                  </div>


                  <div className="schedule-toggle">

                    <span>
                      {showAmortization
                        ? "Hide Schedule"
                        : "View Schedule"}
                    </span>

                    <FaChevronDown
                      className={
                        showAmortization
                          ? "rotate-chevron"
                          : ""
                      }
                    />

                  </div>

                </div>


                {showAmortization && (

                  <div className="table-wrapper">

                    <table>

                      <thead>

                        <tr>

                          <th>
                            Month
                          </th>

                          <th>
                            Opening Balance
                          </th>

                          <th>
                            EMI
                          </th>

                          <th>
                            Principal
                          </th>

                          <th>
                            Interest
                          </th>

                          <th>
                            Closing Balance
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {result.amortizationTable
                          .slice(0, 12)
                          .map((row) => (

                            <tr key={row.month}>

                              <td>
                                {row.month}
                              </td>

                              <td>
                                {formatCurrency(row.openingBalance)}
                              </td>

                              <td>
                                {formatCurrency(row.emi)}
                              </td>

                              <td className="principal-value">
                                {formatCurrency(row.principal)}
                              </td>

                              <td className="interest-value">
                                {formatCurrency(row.interest)}
                              </td>

                              <td>
                                {formatCurrency(row.closingBalance)}
                              </td>

                            </tr>

                          ))}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            </>

          )}

        </div>

      </div>


      {/* ======================================
          COMPLETE EMI PAGE CSS
      ====================================== */}

      <style>{`

        /* ===============================
           MAIN PAGE
        =============================== */

        .emi-modern-page {
          width: 100%;
          box-sizing: border-box;
          padding: 26px;
          background: #f4f7fb;
          min-height: calc(100vh - 70px);
          color: #0a2654;
        }


        /* ===============================
           TOP HEADING
        =============================== */

        .emi-heading {
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #f8fbff 100%
          );

          border: 1px solid #e3eaf3;

          border-radius: 16px;

          padding: 24px 28px;

          display: flex;

          align-items: center;

          gap: 18px;

          margin-bottom: 20px;

          box-shadow:
            0 4px 16px rgba(15, 45, 85, 0.06);
        }


        .emi-heading-icon {
          width: 58px;
          height: 58px;

          border-radius: 14px;

          background: #edf5ff;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #0a4ea3;

          font-size: 28px;

          flex-shrink: 0;
        }


        .emi-heading h1 {
          margin: 0 0 5px;

          font-size: 30px;

          color: #0a2654;

          font-weight: 700;
        }


        .emi-heading p {
          margin: 0;

          color: #58708f;

          font-size: 14px;

          line-height: 1.5;
        }


        .emi-heading-badge {
          margin-left: auto;

          display: flex;

          align-items: center;

          gap: 12px;

          padding: 12px 18px;

          background: #edf5ff;

          border-radius: 12px;

          color: #0a4ea3;

          min-width: 210px;
        }


        .emi-heading-badge > svg {
          font-size: 28px;
        }


        .emi-heading-badge strong {
          display: block;

          font-size: 13px;
        }


        .emi-heading-badge span {
          display: block;

          font-size: 11px;

          color: #5c7696;

          margin-top: 3px;
        }


        /* ===============================
           MAIN TWO COLUMN LAYOUT
        =============================== */

        .emi-main-grid {
          display: grid;

          grid-template-columns:
            minmax(370px, 0.8fr)
            minmax(650px, 1.2fr);

          gap: 18px;

          align-items: start;
        }


        .emi-card {
          background: #ffffff;

          border: 1px solid #e1e8f1;

          border-radius: 15px;

          box-shadow:
            0 4px 18px rgba(15, 45, 85, 0.06);
        }


        /* ===============================
           LOAN DETAILS
        =============================== */

        .loan-details-card {
          padding: 22px;

          position: sticky;

          top: 20px;
        }


        .section-heading h2,
        .results-heading h2 {
          margin: 0;

          font-size: 21px;

          color: #0a2654;
        }


        .section-heading p,
        .results-heading p {
          margin: 5px 0 20px;

          font-size: 13px;

          color: #667d99;
        }


        /* ===============================
           FIELDS
        =============================== */

        .emi-field {
          margin-bottom: 20px;
        }


        .emi-field label {
          display: block;

          font-size: 13px;

          font-weight: 700;

          color: #18365e;

          margin-bottom: 8px;
        }


        .emi-field label span {
          font-weight: 400;

          color: #7b8da5;
        }


        .loan-type-wrapper {
          position: relative;

          display: flex;

          align-items: center;
        }


        .loan-type-wrapper select {
          width: 100%;

          height: 48px;

          border: 1px solid #cbd7e5;

          border-radius: 8px;

          background: white;

          padding: 0 40px 0 46px;

          font-size: 14px;

          color: #1d3557;

          outline: none;

          appearance: none;

          cursor: pointer;
        }


        .loan-type-wrapper select:focus {
          border-color: #3b82f6;

          box-shadow:
            0 0 0 3px rgba(59,130,246,0.10);
        }


        .field-icon {
          position: absolute;

          left: 15px;

          z-index: 2;

          color: #0a4ea3;

          font-size: 17px;

          pointer-events: none;
        }


        .select-arrow {
          position: absolute;

          right: 16px;

          color: #60758f;

          pointer-events: none;

          font-size: 12px;
        }


        /* ===============================
           INFO STRIP
        =============================== */

        .loan-info-strip {
          display: grid;

          grid-template-columns:
            1.2fr 1fr 1fr;

          background: #f0f5fb;

          border-radius: 9px;

          padding: 12px 8px;

          margin-bottom: 23px;
        }


        .loan-info-strip div {
          padding: 0 12px;

          border-right: 1px solid #d8e1ec;
        }


        .loan-info-strip div:last-child {
          border-right: none;
        }


        .loan-info-strip span {
          display: block;

          color: #617893;

          font-size: 10px;

          margin-bottom: 4px;
        }


        .loan-info-strip strong {
          display: block;

          color: #0a2654;

          font-size: 12px;
        }


        /* ===============================
           SLIDER FIELDS
        =============================== */

        .field-title-row {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-bottom: 8px;
        }


        .field-title-row label {
          margin: 0;
        }


        .field-title-row strong {
          font-size: 13px;

          color: #075edb;
        }


        .slider-input-row {
          display: grid;

          grid-template-columns:
            38px 115px 1fr;

          gap: 0;

          align-items: center;
        }


        .input-prefix {
          height: 44px;

          border: 1px solid #cbd7e5;

          border-right: none;

          border-radius: 8px 0 0 8px;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #18365e;

          font-weight: 700;

          background: #f8fafc;
        }


        .input-prefix svg {
          font-size: 14px;
        }


        .slider-input-row > input[type="number"] {
          height: 44px;

          width: 100%;

          box-sizing: border-box;

          border: 1px solid #cbd7e5;

          border-radius: 0 8px 8px 0;

          padding: 0 10px;

          font-size: 14px;

          color: #17375e;

          outline: none;
        }


        .slider-input-row > input[type="number"]:focus {
          border-color: #3b82f6;

          z-index: 2;
        }


        .slider-input-row > input[type="range"] {
          width: 100%;

          margin-left: 18px;

          accent-color: #1976ed;

          cursor: pointer;
        }


        .range-labels {
          display: flex;

          justify-content: space-between;

          margin-top: 5px;

          padding-left: 172px;

          color: #6d829c;

          font-size: 10px;
        }


        /* ===============================
           PURPOSE
        =============================== */

        .purpose-input {
          height: 45px;

          border: 1px solid #cbd7e5;

          border-radius: 8px;

          display: flex;

          align-items: center;

          gap: 10px;

          padding: 0 13px;

          color: #56708f;
        }


        .purpose-input input {
          width: 100%;

          border: none;

          outline: none;

          font-size: 13px;

          color: #17375e;
        }


        /* ===============================
           BUTTONS
        =============================== */

        .emi-action-buttons {
          display: grid;

          grid-template-columns: 1.5fr 1fr;

          gap: 10px;

          margin-top: 22px;
        }


        .calculate-button,
        .reset-button {
          height: 50px;

          border-radius: 8px;

          border: none;

          font-size: 14px;

          font-weight: 700;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          cursor: pointer;

          transition: 0.2s ease;
        }


        .calculate-button {
          background: #0a2e67;

          color: white;
        }


        .calculate-button:hover {
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


        /* ===============================
           ERROR
        =============================== */

        .emi-error {
          margin-top: 14px;

          padding: 11px 13px;

          background: #fff2f2;

          border: 1px solid #fecaca;

          border-radius: 8px;

          color: #b42318;

          font-size: 12px;
        }


        /* ===============================
           TIP
        =============================== */

        .emi-tip {
          margin-top: 18px;

          padding: 13px;

          border-radius: 9px;

          background: #edf5ff;

          display: flex;

          gap: 12px;
        }


        .tip-icon {
          color: #f5a900;

          font-size: 22px;
        }


        .emi-tip strong {
          font-size: 13px;

          color: #075edb;
        }


        .emi-tip p {
          margin: 4px 0 0;

          color: #59718f;

          font-size: 11px;

          line-height: 1.5;
        }


        /* ===============================
           RESULTS
        =============================== */

        .results-card {
          padding: 20px;
        }


        .results-heading {
          display: flex;

          align-items: flex-start;

          justify-content: space-between;
        }


        .print-button {
          border: 1px solid #d6dfeb;

          background: #f5f8fc;

          color: #17375e;

          padding: 10px 15px;

          border-radius: 8px;

          display: flex;

          align-items: center;

          gap: 8px;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;
        }


        .print-button:hover {
          background: #eaf1f9;
        }


        /* ===============================
           EMPTY STATE
        =============================== */

        .empty-results {
          min-height: 400px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          padding: 30px;
        }


        .empty-icon {
          width: 70px;

          height: 70px;

          border-radius: 50%;

          background: #edf5ff;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #1469d7;

          font-size: 30px;

          margin-bottom: 15px;
        }


        .empty-results h3 {
          margin: 0 0 7px;

          color: #17375e;

          font-size: 17px;
        }


        .empty-results p {
          max-width: 350px;

          margin: 0;

          color: #71849b;

          font-size: 12px;

          line-height: 1.6;
        }


        /* ===============================
           METRIC CARDS
        =============================== */

        .result-metrics {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 10px;

          margin-top: 4px;

          margin-bottom: 14px;
        }


        .metric-card {
          border: 1px solid #dce5ef;

          border-radius: 10px;

          padding: 14px;

          display: flex;

          align-items: flex-start;

          gap: 11px;

          background: #fbfdff;
        }


        .metric-icon {
          width: 42px;

          height: 42px;

          border-radius: 50%;

          background: linear-gradient(
            135deg,
            #0a3b80,
            #1976ed
          );

          color: white;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 17px;

          flex-shrink: 0;
        }


        .metric-card span {
          display: block;

          color: #405a78;

          font-size: 11px;

          margin-bottom: 3px;
        }


        .metric-card strong {
          display: block;

          color: #0a3b80;

          font-size: 19px;

          margin-bottom: 3px;
        }


        .metric-card small {
          display: block;

          color: #8090a5;

          font-size: 9px;
        }


        /* ===============================
           SUMMARY STRIP
        =============================== */

        .loan-summary-strip {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          background: #eff4f9;

          border-radius: 8px;

          padding: 12px;

          margin-bottom: 15px;
        }


        .loan-summary-strip div {
          padding: 0 12px;

          border-right: 1px solid #d6e0eb;
        }


        .loan-summary-strip div:last-child {
          border-right: none;
        }


        .loan-summary-strip span {
          display: block;

          font-size: 10px;

          color: #6d8199;

          margin-bottom: 4px;
        }


        .loan-summary-strip strong {
          display: block;

          font-size: 12px;

          color: #0a2654;
        }


        /* ===============================
           CHARTS
        =============================== */

        .charts-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 12px;

          margin-bottom: 15px;
        }


        .chart-card {
          border: 1px solid #dce5ef;

          border-radius: 10px;

          padding: 14px;

          background: white;
        }


        .chart-card h3 {
          margin: 0;

          color: #17375e;

          font-size: 15px;
        }


        .chart-card > p {
          margin: 4px 0;

          color: #7890aa;

          font-size: 10px;
        }


        .pie-content {
          position: relative;

          display: grid;

          grid-template-columns: 1fr 0.8fr;

          align-items: center;
        }


        .pie-chart {
          position: relative;
        }


        .pie-center {
          position: absolute;

          top: 50%;

          left: 50%;

          transform: translate(-50%, -50%);

          text-align: center;

          pointer-events: none;

          width: 100px;
        }


        .pie-center strong {
          display: block;

          color: #17375e;

          font-size: 13px;
        }


        .pie-center span {
          display: block;

          color: #8291a5;

          font-size: 8px;

          margin-top: 2px;
        }


        .chart-legend-modern {
          display: flex;

          flex-direction: column;

          gap: 16px;
        }


        .chart-legend-modern > div {
          display: flex;

          align-items: flex-start;

          gap: 8px;
        }


        .legend-dot {
          width: 10px;

          height: 10px;

          border-radius: 50%;

          margin-top: 3px;

          flex-shrink: 0;
        }


        .principal-dot {
          background: #0a2654;
        }


        .interest-dot {
          background: #3b82f6;
        }


        .chart-legend-modern strong {
          display: block;

          color: #17375e;

          font-size: 11px;
        }


        .chart-legend-modern span:not(.legend-dot) {
          display: block;

          color: #617993;

          font-size: 10px;

          margin-top: 2px;
        }


        .bar-chart {
          margin-top: 8px;
        }


        /* ===============================
           AMORTIZATION
        =============================== */

        .amortization-modern {
          border: 1px solid #dce5ef;

          border-radius: 10px;

          overflow: hidden;

          background: white;
        }


        .amortization-title-row {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 14px 16px;

          cursor: pointer;

          background: #ffffff;
        }


        .amortization-title-row:hover {
          background: #f9fbfd;
        }


        .amortization-title-row h3 {
          margin: 0;

          color: #17375e;

          font-size: 15px;
        }


        .amortization-title-row h3 span {
          font-weight: 500;

          color: #687f9b;
        }


        .amortization-title-row p {
          margin: 4px 0 0;

          color: #8092a7;

          font-size: 10px;
        }


        .schedule-toggle {
          display: flex;

          align-items: center;

          gap: 7px;

          color: #075edb;

          font-size: 11px;

          font-weight: 600;
        }


        .schedule-toggle svg {
          transition: 0.2s;
        }


        .rotate-chevron {
          transform: rotate(180deg);
        }


        .table-wrapper {
          overflow-x: auto;

          border-top: 1px solid #e2e8f0;
        }


        .table-wrapper table {
          width: 100%;

          border-collapse: collapse;

          font-size: 11px;
        }


        .table-wrapper th {
          background: #f2f6fa;

          color: #17375e;

          font-weight: 700;

          text-align: left;

          padding: 10px 9px;

          white-space: nowrap;
        }


        .table-wrapper td {
          padding: 9px;

          color: #405a78;

          border-top: 1px solid #edf1f5;

          white-space: nowrap;
        }


        .table-wrapper tbody tr:hover {
          background: #f8fbff;
        }


        .principal-value {
          color: #0a4ea3 !important;

          font-weight: 600;
        }


        .interest-value {
          color: #3180ed !important;

          font-weight: 600;
        }


        /* ===============================
           RESPONSIVE
        =============================== */

        @media (max-width: 1200px) {

          .emi-main-grid {
            grid-template-columns: 1fr;
          }


          .loan-details-card {
            position: static;
          }

        }


        @media (max-width: 800px) {

          .emi-modern-page {
            padding: 14px;
          }


          .emi-heading {
            flex-wrap: wrap;
          }


          .emi-heading-badge {
            margin-left: 0;

            width: 100%;
          }


          .result-metrics {
            grid-template-columns: 1fr;
          }


          .loan-summary-strip {
            grid-template-columns: 1fr 1fr;

            gap: 12px;
          }


          .loan-summary-strip div {
            border-right: none;
          }


          .charts-grid {
            grid-template-columns: 1fr;
          }


          .slider-input-row {
            grid-template-columns:
              38px 100px 1fr;
          }


          .range-labels {
            padding-left: 138px;
          }

        }


        @media (max-width: 550px) {

          .emi-heading h1 {
            font-size: 23px;
          }


          .emi-heading p {
            font-size: 11px;
          }


          .loan-info-strip {
            grid-template-columns: 1fr;

            gap: 10px;
          }


          .loan-info-strip div {
            border-right: none;

            border-bottom: 1px solid #d8e1ec;

            padding-bottom: 8px;
          }


          .loan-info-strip div:last-child {
            border-bottom: none;
          }


          .slider-input-row {
            grid-template-columns:
              35px 90px 1fr;
          }


          .range-labels {
            padding-left: 125px;
          }


          .loan-summary-strip {
            grid-template-columns: 1fr;
          }


          .emi-action-buttons {
            grid-template-columns: 1fr;
          }

        }


        /* ===============================
           PRINT
        =============================== */

        @media print {

          .emi-modern-page {
            background: white;
            padding: 0;
          }


          .loan-details-card {
            display: none;
          }


          .results-card {
            box-shadow: none;
            border: none;
          }
            


          .print-button {
            display: none;
          }

        }

      `}</style>

    </div>

  );

}


export default EMICalculator;