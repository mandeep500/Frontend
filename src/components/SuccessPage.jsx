import React from 'react';

export default function SuccessPage({ submissionData, onBackToHome }) {
  return (
    <div className="card">
      <div className="card-body success-container">
        <div className="success-icon-wrap">
          ✓
        </div>

        <h1 className="success-title">Registration Completed Successfully!</h1>
        <p className="success-desc">
          We have received your admission application. We will contact you shortly.
        </p>

        {submissionData && (
          <div className="app-receipt-card">
            <div className="receipt-row">
              <span className="receipt-label">Application Reference:</span>
              <span className="receipt-value" style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>
                {submissionData.referenceId || 'ADM-2025-098231'}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Student Name:</span>
              <span className="receipt-value">{submissionData.fullName}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Class Applying For:</span>
              <span className="receipt-value">{submissionData.classApplyingFor}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Parent / Guardian:</span>
              <span className="receipt-value">{submissionData.parentName}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Contact Phone:</span>
              <span className="receipt-value">{submissionData.parentPhone}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Registered Email:</span>
              <span className="receipt-value">{submissionData.email}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Submission Date:</span>
              <span className="receipt-value">{submissionData.submittedAt || 'Today'}</span>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ maxWidth: '280px', margin: '0 auto' }}
            onClick={onBackToHome}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

