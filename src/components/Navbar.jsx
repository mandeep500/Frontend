import React from 'react';

export default function Navbar({ onLogoClick }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div 
          className="school-brand"
          onClick={onLogoClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="school-logo">
            🎓
          </div>
          <div className="school-title">
            <span className="school-name">St. Peter's Academy</span>
            <span className="school-tagline">Online Admission Portal</span>
          </div>
        </div>

        <div className="nav-links">
          <span style={{ 
            backgroundColor: 'var(--primary-light)', 
            color: 'var(--primary)', 
            fontWeight: 600, 
            fontSize: '0.85rem',
            padding: '0.4rem 0.9rem',
            borderRadius: '20px',
            border: '1px solid var(--primary-border)'
          }}>
            Admissions Open
          </span>
        </div>
      </div>
    </nav>
  );
}
