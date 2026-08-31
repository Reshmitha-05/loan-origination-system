import { useState } from 'react';
import { FaCalculator, FaChartBar, FaRupeeSign } from "react-icons/fa";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanAmountSlider, setLoanAmountSlider] = useState(100000);
  const [interestRate, setInterestRate] = useState('');
  const [interestRateSlider, setInterestRateSlider] = useState(9);
  const [tenureYears, setTenureYears] = useState('');
  const [tenureYearsSlider, setTenureYearsSlider] = useState(5);
  const [result, setResult] = useState(null);
  const [showAmortization, setShowAmortization] = useState(false);
  const [error, setError] = useState('');

  const calculateEMI = () => {
    setError('');
    const amount = parseFloat(loanAmountSlider);
    const rate = parseFloat(interestRateSlider);
    const years = parseInt(tenureYearsSlider);

    if (isNaN(amount) || amount <= 0 || amount > 100000000) {
      setError('Please enter a valid loan amount (between ₹1 and ₹1,00,00,000)');
      setResult(null);
      return;
    }
    if (isNaN(rate) || rate <= 0 || rate > 50) {
      setError('Please enter a valid interest rate (between 0.1% and 50%)');
      setResult(null);
      return;
    }
    if (isNaN(years) || years <= 0 || years > 40) {
      setError('Please enter a valid tenure (between 1 and 40 years)');
      setResult(null);
      return;
    }

    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = emi * months;
    const totalInterest = totalPayable - amount;

    // Generate amortization table (first 12 months or all months)
    const amortizationTable = [];
    let balance = amount;
    for (let i = 1; i <= months; i++) {
      const interestComponent = balance * monthlyRate;
      const principalComponent = emi - interestComponent;
      balance -= principalComponent;
      if (balance < 0) balance = 0;
      
      amortizationTable.push({
        month: i,
        openingBalance: balance + principalComponent,
        emi: emi,
        principal: principalComponent,
        interest: interestComponent,
        closingBalance: balance
      });
    }

    // Generate principal vs interest for chart (annual aggregation)
    const chartData = [
      { name: 'Principal', value: amount, color: '#0A2654' },
      { name: 'Interest', value: totalInterest, color: '#3B82F6' }
    ];

    setResult({
      emi: emi,
      totalPayable: totalPayable,
      totalInterest: totalInterest,
      principal: amount,
      chartData: chartData,
      amortizationTable: amortizationTable
    });
  };

  const handleReset = () => {
    setLoanAmount('');
    setLoanAmountSlider(100000);
    setInterestRate('');
    setInterestRateSlider(9);
    setTenureYears('');
    setTenureYearsSlider(5);
    setResult(null);
    setShowAmortization(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Loan EMI Calculator</h2>
        <p className="page-subtitle">Calculate your monthly EMI, total interest, and total payable amount with our professional loan calculator.</p>
      </div>

      <div className="emi-calculator-container">
        <div className="calculator-form">
          <h3>Calculate EMI</h3>
          
          {/* Loan Amount Input with Slider */}
          <div className="form-group">
            <div className="input-with-slider">
              <label className="form-label">Loan Amount (₹{loanAmountSlider.toLocaleString()})</label>
              <input
                type="range"
                className="slider-input"
                min="10000"
                max="100000000"
                step="10000"
                value={loanAmountSlider}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setLoanAmountSlider(val);
                  setLoanAmount(val > 10000000 ? (val / 1000000).toFixed(2) + 'M' : val);
                }}
              />
              <input
                type="number"
                className="form-input form-input-number"
                placeholder="Enter loan amount"
                value={loanAmountSlider}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 10000 && val <= 100000000) {
                    setLoanAmountSlider(val);
                  }
                }}
              />
            </div>
          </div>
          
          {/* Interest Rate Input with Slider */}
          <div className="form-group">
            <div className="input-with-slider">
              <label className="form-label">Annual Interest Rate ({interestRateSlider}%)</label>
              <input
                type="range"
                className="slider-input"
                min="0.1"
                max="50"
                step="0.1"
                value={interestRateSlider}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setInterestRateSlider(val);
                  setInterestRate(val.toFixed(1));
                }}
              />
              <input
                type="number"
                className="form-input form-input-number"
                placeholder="Enter interest rate"
                value={interestRateSlider}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val > 0 && val <= 50) {
                    setInterestRateSlider(val);
                  }
                }}
              />
            </div>
          </div>
          
          {/* Tenure Input with Slider */}
          <div className="form-group">
            <div className="input-with-slider">
              <label className="form-label">Loan Tenure ({tenureYearsSlider} years)</label>
              <input
                type="range"
                className="slider-input"
                min="1"
                max="40"
                step="1"
                value={tenureYearsSlider}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTenureYearsSlider(val);
                  setTenureYears(val);
                }}
              />
              <input
                type="number"
                className="form-input form-input-number"
                placeholder="Enter tenure in years"
                value={tenureYearsSlider}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= 40) {
                    setTenureYearsSlider(val);
                  }
                }}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn btn-primary" onClick={calculateEMI}>
              Calculate EMI
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
            {result && (
              <button className="btn btn-secondary" onClick={handlePrint}>
                Print Summary
              </button>
            )}
          </div>
          {error && (
            <div className="error-message" style={{ marginTop: '20px' }}>
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="emi-results">
            <div className="results-header">
              <h3>EMI Calculation Results</h3>
              <div className="print-only">
                <button className="btn btn-secondary btn-print-only" onClick={handlePrint}>
                  Print Summary
                </button>
              </div>
            </div>
            
            {/* Three Result Cards with Icons */}
            <div className="results-cards">
              <div className="result-card result-card-1">
                <div className="card-icon"><FaCalculator /></div>
                <label className="result-label">Monthly EMI</label>
                <div className="result-value">{formatCurrency(result.emi)}</div>
              </div>
              
              <div className="result-card result-card-2">
                <div className="card-icon"><FaRupeeSign /></div>
                <label className="result-label">Total Interest</label>
                <div className="result-value">{formatCurrency(result.totalInterest)}</div>
              </div>
              
              <div className="result-card result-card-3">
                <div className="card-icon"><FaChartBar /></div>
                <label className="result-label">Total Payable</label>
                <div className="result-value">{formatCurrency(result.totalPayable)}</div>
              </div>
            </div>

            {/* Principal vs Interest Bar Chart */}
            <div className="emi-chart-section">
              <h4 className="chart-title">Payment Breakdown</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={result.chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#0A2654', fontSize: 14 }} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#ffffff', color: '#0A1E3F', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                    {result.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-color" style={{ backgroundColor: '#0A2654' }}></span>Principal: {formatCurrency(result.principal)}</span>
                <span className="legend-item"><span className="legend-color" style={{ backgroundColor: '#3B82F6' }}></span>Interest: {formatCurrency(result.totalInterest)}</span>
              </div>
            </div>

            {/* Amortization Table */}
            <div className="amortization-section">
              <div className="amortization-header" onClick={() => setShowAmortization(!showAmortization)}>
                <h4 className="amortization-title">Amortization Schedule (First 12 Months)</h4>
                <span className={`expand-icon ${showAmortization ? 'expanded' : ''}`}>▼</span>
              </div>
              {showAmortization && (
                <div className="amortization-table-container">
                  <table className="amortization-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Opening Balance</th>
                        <th>EMI</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Closing Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.amortizationTable.slice(0, 12).map((row, index) => (
                        <tr key={index}>
                          <td>{row.month}</td>
                          <td>{formatCurrency(row.openingBalance)}</td>
                          <td>{formatCurrency(row.emi)}</td>
                          <td>{formatCurrency(row.principal)}</td>
                          <td>{formatCurrency(row.interest)}</td>
                          <td>{formatCurrency(row.closingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden styles for print */}
      <style>{`
        @media print {
          .calculator-form,
          .emi-results .print-only {
            display: none !important;
          }
          .emi-results .results-cards {
            flex-direction: column;
          }
        }
        @media (max-width: 768px) {
          .results-cards {
            flex-direction: column !important;
          }
          .emi-calculator-container {
            flex-direction: column !important;
          }
          .emi-results {
            min-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default EMICalculator;
