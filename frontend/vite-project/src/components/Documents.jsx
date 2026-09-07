import { useEffect, useState } from 'react';
import API_URL from "../api";
import {
  FaFileImage,
  FaFilePdf,
  FaUpload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight
} from "react-icons/fa";

function Documents({ onProceedToApplication }) {

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [analyzingFile, setAnalyzingFile] = useState(null);

  const [analysisResults, setAnalysisResults] = useState({});

  const [dragOver, setDragOver] = useState(false);


  /* =====================================================
     LOAD PREVIOUSLY VERIFIED DOCUMENTS
     ===================================================== */

  useEffect(() => {

    const storedDocuments =
      localStorage.getItem('customerDocuments');

    if (storedDocuments) {

      try {

        const parsedDocuments =
          JSON.parse(storedDocuments);

        setUploadedFiles(parsedDocuments);

        // Restore previous analysis results
        const savedResults = {};

        parsedDocuments.forEach(file => {

          if (file.analysisResult) {
            savedResults[file.id] = file.analysisResult;
          }

        });

        setAnalysisResults(savedResults);

      } catch (error) {

        console.error(
          "Error loading documents:",
          error
        );

      }

    }

  }, []);


  /* =====================================================
     DRAG & DROP
     ===================================================== */

  const handleDragOver = (e) => {

    e.preventDefault();
    setDragOver(true);

  };


  const handleDragLeave = () => {

    setDragOver(false);

  };


  const handleDrop = (e) => {

    e.preventDefault();
    setDragOver(false);

    const files =
      Array.from(e.dataTransfer.files);

    processFiles(files);

  };


  /* =====================================================
     FILE SELECT
     ===================================================== */

  const handleFileSelect = (e) => {

    const files =
      Array.from(e.target.files);

    processFiles(files);

  };


  /* =====================================================
     PROCESS FILES
     ===================================================== */

  const processFiles = (files) => {

    const customerEmail =
      localStorage.getItem('loggedInCustomerEmail') ||
      localStorage.getItem('customerEmail') ||
      '';

    const customerName =
      localStorage.getItem('loggedInCustomerName') ||
      localStorage.getItem('userName') ||
      'Customer';

    const newFiles = files.map((file) => ({

      id: Date.now() + Math.random(),

      name: file.name,

      type: file.type,

      size: file.size,

      uploadedAt:
        new Date().toLocaleString('en-IN'),

      status: 'pending',

      customerEmail: customerEmail,

      customerName: customerName

    }));


    const updatedFiles = [
      ...uploadedFiles,
      ...newFiles
    ];

    setUploadedFiles(updatedFiles);

    localStorage.setItem(
      'customerDocuments',
      JSON.stringify(updatedFiles)
    );

  };


  /* =====================================================
     ANALYZE DOCUMENT
     ===================================================== */

  const analyzeDocument = (fileId) => {

    setAnalyzingFile(fileId);


    setTimeout(() => {

      const file =
        uploadedFiles.find(
          f => f.id === fileId
        );


      if (!file) {

        setAnalyzingFile(null);
        return;

      }


      const isPdf =
        file.type.includes('pdf');

      const isImage =
        file.type.includes('image');

      const fileSize =
        file.size;


      const isValidSize =
        fileSize <= 5000000;


      /*
       * For now this is a DEMO verification.
       * Later this can be replaced with actual
       * backend / OCR / AI document verification.
       */

      const isValidDocument =
        (isPdf || isImage) &&
        isValidSize;


      const checklist = [];


      /* File format */

      if (isPdf || isImage) {

        checklist.push({
          text: 'File format is valid',
          status: 'success'
        });

      } else {

        checklist.push({
          text: 'Unsupported file format',
          status: 'error'
        });

      }


      /* File size */

      if (isValidSize) {

        checklist.push({
          text: 'File size is within the 5MB limit',
          status: 'success'
        });

      } else {

        checklist.push({
          text: 'File size exceeds the 5MB limit',
          status: 'error'
        });

      }


      /* Document quality */

      if (isValidDocument) {

        checklist.push({
          text: 'Document appears clear and complete',
          status: 'success'
        });

      } else {

        checklist.push({
          text: 'Document requires review or re-upload',
          status: 'warning'
        });

      }


      const resultScore =
        isValidDocument
          ? 'Verified'
          : 'Needs Review';


      const analysisResult = {

        score: resultScore,

        checklist: checklist,

        analyzedAt:
          new Date().toLocaleString('en-IN')

      };


      /* =================================================
         UPDATE ANALYSIS RESULT
         ================================================= */

      setAnalysisResults(prev => ({

        ...prev,

        [fileId]: analysisResult

      }));


      /* =================================================
         UPDATE DOCUMENT STATUS
         ================================================= */

      const updatedFiles =
        uploadedFiles.map(file => {

          if (file.id === fileId) {

            return {

              ...file,

              status:
                resultScore === 'Verified'
                  ? 'verified'
                  : 'needs-review',

              analysisResult:
                analysisResult

            };

          }

          return file;

        });


      setUploadedFiles(updatedFiles);


      /* Save to localStorage */

      localStorage.setItem(
        'customerDocuments',
        JSON.stringify(updatedFiles)
      );


      setAnalyzingFile(null);

    }, 1500);

  };


  /* =====================================================
     DOCUMENT ICON
     ===================================================== */

  const getDocumentIcon = (type) => {

    if (type.includes('pdf')) {

      return (
        <FaFilePdf
          className="document-pdf-icon"
        />
      );

    }

    if (type.includes('image')) {

      return (
        <FaFileImage
          className="document-image-icon"
        />
      );

    }

    return <FaUpload />;

  };


  /* =====================================================
     PROCEED TO APPLICATION
     ===================================================== */

const proceedToApplication = () => {
  // Get only verified documents
  const verifiedDocs = uploadedFiles.filter(
    file => file.status === 'verified'
  );

  if (verifiedDocs.length === 0) {
    alert('Please verify at least one document before proceeding.');
    return;
  }

  // Store the verified documents temporarily.
  // ApplyForLoan will attach these to the new application.
  localStorage.setItem(
    'pendingApplicationDocuments',
    JSON.stringify(verifiedDocs)
  );

  localStorage.setItem(
    'documentsVerified',
    'true'
  );

  if (onProceedToApplication) {
    onProceedToApplication();
  }
};


  /* =====================================================
     CHECK VERIFIED DOCUMENTS
     ===================================================== */

  const verifiedDocuments =
    uploadedFiles.filter(
      file => file.status === 'verified'
    );


  return (

    <div className="page-container">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>

          <h2 className="page-title">
            Documents
          </h2>

          <p className="page-subtitle">
            Upload and verify your KYC and income proof documents.
          </p>

        </div>

      </div>


      {/* ================= UPLOAD ZONE ================= */}

      <div
        className={`upload-zone ${
          dragOver ? 'drag-over' : ''
        }`}

        onDragOver={handleDragOver}

        onDragLeave={handleDragLeave}

        onDrop={handleDrop}
      >

        <input
          type="file"

          className="file-input"

          accept=".pdf,.jpg,.jpeg,.png"

          multiple

          onChange={handleFileSelect}
        />


        <div className="upload-icon">
          <FaUpload />
        </div>


        <p className="upload-text">
          Drag & drop your document here, or click to browse
        </p>


        <p className="upload-subtext">
          Supports PDF, JPG, JPEG, PNG (Max 5MB per file)
        </p>

      </div>


      {/* ================= VERIFIED MESSAGE ================= */}

      {verifiedDocuments.length > 0 && (

        <div className="documents-next-step">

          <div className="documents-next-icon">
            <FaCheckCircle />
          </div>


          <div className="documents-next-content">

            <h3>
              Documents Verified
            </h3>

            <p>
              Your document verification is complete.
              You can now proceed with your loan application.
            </p>

          </div>


          <button
            className="documents-proceed-btn"
            onClick={proceedToApplication}
          >

            Proceed to Loan Application

            <FaArrowRight />

          </button>

        </div>

      )}


      {/* ================= UPLOADED DOCUMENTS ================= */}

      <div className="documents-container">

        {uploadedFiles.length > 0 && (

          <div className="uploaded-files">

            <h3>
              Uploaded Documents ({uploadedFiles.length})
            </h3>


            <ul className="uploaded-list">

              {uploadedFiles.map((file) => (

                <li
                  key={file.id}
                  className="uploaded-item"
                >


                  {/* File information */}

                  <div className="uploaded-file-info">

                    <span className="uploaded-file-name">

                      {getDocumentIcon(file.type)}

                      {file.name}

                    </span>


                    <span className="uploaded-file-meta">

                      {file.uploadedAt}

                      {' • '}

                      {(file.size / 1024).toFixed(1)}
                      {' KB'}

                    </span>

                  </div>


                  {/* File actions */}

                  <div className="file-actions">


                    {file.status === 'verified' ? (

                      <span className="document-verified-badge">

                        <FaCheckCircle />

                        Verified

                      </span>

                    ) : (

                      <button
                        className="btn btn-secondary"

                        onClick={() =>
                          analyzeDocument(file.id)
                        }

                        disabled={
                          analyzingFile === file.id
                        }

                        style={{
                          padding: '6px 12px',
                          fontSize: '12px'
                        }}
                      >

                        {analyzingFile === file.id
                          ? 'Analyzing...'
                          : 'Analyze'}

                      </button>

                    )}

                  </div>


                  {/* ================= ANALYSIS RESULT ================= */}

                  {analysisResults[file.id] && (

                    <div
                      className={`analysis-result ${
                        analysisResults[file.id].score ===
                        'Verified'
                          ? 'analysis-success'
                          : 'analysis-warning'
                      }`}
                    >


                      {/* Result heading */}

                      <div className="analysis-status">

                        {analysisResults[file.id].score ===
                        'Verified' ? (

                          <>
                            <FaCheckCircle />
                            Document Verified
                          </>

                        ) : (

                          <>
                            <FaExclamationTriangle />
                            Needs Review
                          </>

                        )}

                      </div>


                      {/* Checklist */}

                      <ul className="analysis-checklist">

                        {analysisResults[file.id].checklist.map(
                          (item, index) => (

                            <li key={index}>

                              {item.status === 'success'
                                ? '✓'
                                : item.status === 'error'
                                ? '✗'
                                : '⚠'}

                              {' '}

                              {item.text}

                            </li>

                          )
                        )}

                      </ul>


                      <span className="analysis-time">

                        Analyzed at:{' '}

                        {analysisResults[file.id].analyzedAt}

                      </span>


                      {/* Next action for verified document */}

                      {analysisResults[file.id].score ===
                        'Verified' && (

                        <div className="document-result-next">

                          <span>
                            This document is ready for your loan application.
                          </span>

                        </div>

                      )}


                      {/* Next action for failed review */}

                      {analysisResults[file.id].score ===
                        'Needs Review' && (

                        <div className="document-result-next review-message">

                          <span>
                            Please upload a clearer or valid document and analyze it again.
                          </span>

                        </div>

                      )}

                    </div>

                  )}

                </li>

              ))}

            </ul>

          </div>

        )}

      </div>

    </div>

  );

}

export default Documents;