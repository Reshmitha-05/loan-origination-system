function AboutLOS() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">About Loan Origination System</h2>
        <p className="page-subtitle">Learn about our comprehensive Loan Origination System designed to streamline the lending process for financial institutions and borrowers.</p>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h3>What is a Loan Origination System?</h3>
          <p>
            A Loan Origination System (LOS) is a comprehensive software solution designed to 
            streamline and automate the entire loan application and approval process. It serves 
            as a centralized platform for managing all aspects of lending operations, from initial 
            application submission through underwriting, approval, documentation, and final funding.
          </p>
        </section>

        <section className="about-section">
          <h3>Key Features</h3>
          <div className="features-list">
            <div className="feature-item">
              <strong>1. Customer Management</strong>
              <p>Comprehensive customer database with CRUD operations for easy management of borrower information.</p>
            </div>
            <div className="feature-item">
              <strong>2. Loan Processing</strong>
              <p>Efficient loan application handling with automated validation and status tracking.</p>
            </div>
            <div className="feature-item">
              <strong>3. Real-time Dashboard</strong>
              <p>Visual dashboard with key metrics, loan status summaries, and recent activity tracking.</p>
            </div>
            <div className="feature-item">
              <strong>4. Reports & Analytics</strong>
              <p>Comprehensive reporting tools with customizable filters and data visualizations.</p>
            </div>
            <div className="feature-item">
              <strong>5. Loan EMI Calculator</strong>
              <p> built-in calculator to help customers understand their monthly repayment obligations.</p>
            </div>
            <div className="feature-item">
              <strong>6. Eligibility Checker</strong>
              <p>Simple eligibility assessment tool to help applicants understand their loan approval potential.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h3>Technology Stack</h3>
          <div className="tech-stack">
            <div className="tech-item">React (Frontend)</div>
            <div className="tech-item">Java Spring Boot (Backend)</div>
            <div className="tech-item">MySQL (Database)</div>
            <div className="tech-item">REST API</div>
          </div>
        </section>

        <section className="about-section">
          <h3>Purpose of This Project</h3>
          <p>
            This Loan Origination System serves as a portfolio demonstration project showcasing:
          </p>
          <ul className="project-purpose">
            <li>Full-stack web application development capabilities</li>
            <li>Modern React component architecture with state management</li>
            <li>RESTful API integration and data handling</li>
            <li>Responsive design with modern UI/UX principles</li>
            <li>Database management and CRUD operations</li>
            <li>Real-time data visualization and reporting</li>
          </ul>
          <p>
            The system demonstrates professional coding practices, clean architecture, and 
            user-friendly interfaces suitable for modern lending institutions.
          </p>
        </section>

        <section className="about-section">
          <h3>System Benefits</h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h4>Efficiency</h4>
              <p>Automated processes reduce manual work and processing time</p>
            </div>
            <div className="benefit-card">
              <h4>Accuracy</h4>
              <p>Reduced errors through standardized validation and calculations</p>
            </div>
            <div className="benefit-card">
              <h4>Transparency</h4>
              <p>Clear tracking and audit trail for all loan applications</p>
            </div>
            <div className="benefit-card">
              <h4>Scalability</h4>
              <p>Designed to handle growing volumes of applications and data</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutLOS;
