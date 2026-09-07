import { useState } from 'react';
import { FaCar, FaGraduationCap, FaHome, FaUser } from "react-icons/fa";

function LoanProducts({ setActiveTab }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 'personal',
      name: 'Personal Loan',
      icon: <FaUser />,
      description: 'Flexible personal loan for your everyday needs',
      rate: '10.5% - 14%',
      tenure: '1-5 years',
      minAmount: '₹50,000',
      maxAmount: '₹10,00,000',
      processingFee: '1% - 2%',
      documents: ['Identity Proof', 'Address Proof', 'Income Proof', 'Bank Statement']
    },
    {
      id: 'home',
      name: 'Home Loan',
      icon: <FaHome />,
      description: 'Build your dream home with our competitive home loans',
      rate: '8.5% - 10.5%',
      tenure: '5-30 years',
      minAmount: '₹1,00,000',
      maxAmount: '₹50,00,000',
      processingFee: '0.5% - 1%',
      documents: ['Identity Proof', 'Address Proof', 'Income Proof', 'Property Documents', 'Bank Statement']
    },
    {
      id: 'car',
      name: 'Car Loan',
      icon: <FaCar />,
      description: 'Drive home in your dream car with easy EMI options',
      rate: '9.0% - 12%',
      tenure: '3-7 years',
      minAmount: '₹1,00,000',
      maxAmount: '₹15,00,000',
      processingFee: '1% - 1.5%',
      documents: ['Identity Proof', 'Address Proof', 'Income Proof', 'PAN Card', 'Bank Statement']
    },
    {
      id: 'student',
      name: 'Student Loan',
      icon: <FaGraduationCap />,
      description: ' fund your education with our student loan programs',
      rate: '8% - 11%',
      tenure: '1-5 years (with moratorium)',
      minAmount: '₹50,000',
      maxAmount: '₹20,00,000',
      processingFee: '0.5% - 1%',
      documents: ['Identity Proof', 'Address Proof', 'Admission Letter', 'Marksheets', 'Income Proof of Parent/Guardian']
    }
  ];

  const handleApply = (loanType) => {
    // Store loan type for prefill in ApplyForLoan
    localStorage.setItem('prefillLoanType', loanType);
    // Navigate to Apply for Loan page
    setActiveTab('Apply for Loan');
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Loan Products</h2>
          <p className="page-subtitle">Explore our range of loan products tailored to your needs.</p>
        </div>
      </div>

      {/* Loan Products Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <div className="product-icon">{product.icon}</div>
              <h3 className="product-name">{product.name}</h3>
            </div>
            
            <p className="product-description">{product.description}</p>
            
            <div className="product-features">
              <div className="feature-item">
                <span className="feature-label">Interest Rate</span>
                <span className="feature-value">{product.rate}</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">Tenure</span>
                <span className="feature-value">{product.tenure}</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">Loan Amount</span>
                <span className="feature-value">{product.minAmount} - {product.maxAmount}</span>
              </div>
            </div>

            <div className="product-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedProduct(product)}
              >
                View Details
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleApply(product.id)}
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedProduct.name}</h3>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">{selectedProduct.description}</p>
              
              <div className="modal-features">
                <div className="feature-grid">
                  <div className="feature-item">
                    <span className="feature-label">Interest Rate</span>
                    <span className="feature-value">{selectedProduct.rate}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Tenure</span>
                    <span className="feature-value">{selectedProduct.tenure}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Processing Fee</span>
                    <span className="feature-value">{selectedProduct.processingFee}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-label">Max Loan Amount</span>
                    <span className="feature-value">{selectedProduct.maxAmount}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-title">Required Documents</h4>
                <ul className="document-list">
                  {selectedProduct.documents.map((doc, index) => (
                    <li key={index} className="document-item">
                      <span className="document-icon">📄</span>
                      <span className="document-name">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    handleApply(selectedProduct.id);
                    closeModal();
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoanProducts;
