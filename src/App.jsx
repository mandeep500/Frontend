import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AdmissionPage from './components/AdmissionPage';
import SuccessPage from './components/SuccessPage';

export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  // Handle successful admission form submission
  const handleSubmissionSuccess = (data) => {
    setSubmissionData(data);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Admission Form
  const handleBackToForm = () => {
    setIsSubmitted(false);
    setSubmissionData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* School Website Header */}
      <Navbar onLogoClick={handleBackToForm} />

      {/* Main Container */}
      <main className="main-content">
        {!isSubmitted ? (
          <AdmissionPage onSubmissionSuccess={handleSubmissionSuccess} />
        ) : (
          <SuccessPage
            submissionData={submissionData}
            onBackToHome={handleBackToForm}
          />
        )}
      </main>

      {/* Clean School Footer */}
      <footer className="school-footer">
        <p>© {new Date().getFullYear()} St. Peter's Academy. All Rights Reserved.</p>
        <p style={{ marginTop: '4px', fontSize: '0.8rem' }}>
          Admissions Office • 1200 University Ave • Contact: admissions@school.edu
        </p>
      </footer>
    </div>
  );
}
