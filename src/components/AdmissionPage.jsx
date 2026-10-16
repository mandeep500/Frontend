import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const INITIAL_FORM = {
  fullName: '',
  dob: '',
  gender: '',
  parentName: '',
  parentPhone: '',
  email: '',
  address: '',
  previousSchool: '',
  classApplyingFor: '',
  additionalInfo: ''
};

export default function AdmissionPage({ onSubmissionSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    // 1. Full Name
    const cleanName = formData.fullName.trim();
    if (!cleanName) {
      newErrors.fullName = 'Student Full Name is required';
    } else if (cleanName.length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }

    // 2. Date of Birth
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const selectedDate = new Date(formData.dob);
      const today = new Date();
      if (selectedDate >= today) {
        newErrors.dob = 'Date of birth must be in the past';
      }
    }

    // 3. Gender
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    // 4. Parent / Guardian Name
    const cleanParent = formData.parentName.trim();
    if (!cleanParent) {
      newErrors.parentName = 'Parent or Guardian Name is required';
    } else if (cleanParent.length < 2) {
      newErrors.parentName = 'Parent Name must be at least 2 characters';
    }
    
    // 5. Parent / Guardian Phone
    const cleanPhone = formData.parentPhone.trim();
    if (!cleanPhone) {
      newErrors.parentPhone = 'Parent or Guardian Phone is required';
    } else if (!/^[0-9+\s\-().]{7,25}$/.test(cleanPhone)) {
      newErrors.parentPhone = 'Please enter a valid phone number (at least 7 digits)';
    }

    // 6. Email
    const cleanEmail = formData.email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // 7. Residential Address
    const cleanAddress = formData.address.trim();
    if (!cleanAddress) {
      newErrors.address = 'Residential Address is required';
    } else if (cleanAddress.length < 5) {
      newErrors.address = 'Please provide a full address (at least 5 characters)';
    }

    // 8. Previous School
    if (!formData.previousSchool.trim()) {
      newErrors.previousSchool = 'Previous School name is required';
    }

    // 9. Class Applying For
    if (!formData.classApplyingFor) {
      newErrors.classApplyingFor = 'Please select the class applying for';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission attack / race conditions

    setServerError('');

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Sanitize and normalize payload before transmission
    const sanitizedPayload = {
      fullName: formData.fullName.trim(),
      dob: formData.dob,
      gender: formData.gender,
      parentName: formData.parentName.trim(),
      parentPhone: formData.parentPhone.trim(),
      email: formData.email.trim().toLowerCase(),
      address: formData.address.trim(),
      previousSchool: formData.previousSchool.trim(),
      classApplyingFor: formData.classApplyingFor,
      additionalInfo: formData.additionalInfo ? formData.additionalInfo.trim() : ''
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/admissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(sanitizedPayload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setIsSubmitting(false);

        // If backend returned specific validation errors, display them on the form fields
        if (result.errors) {
          setErrors(result.errors);
        }

        // Show server message or specific status error
        if (response.status === 429) {
          setServerError('Rate limit reached: Too many submission attempts. Please wait a few minutes before trying again.');
        } else if (response.status === 503) {
          setServerError('Database is temporarily unavailable. Please verify the backend MySQL connection.');
        } else {
          setServerError(result.message || 'Unable to submit admission application. Please check the form.');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Success from MySQL backend
      const savedData = result.data || {};
      setIsSubmitting(false);

      onSubmissionSuccess({
        ...sanitizedPayload,
        referenceId: savedData.referenceId || 'ADM-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000),
        status: savedData.status || 'Pending',
        submittedAt: new Date(savedData.submittedAt || Date.now()).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });

    } catch (networkErr) {
      setIsSubmitting(false);
      setServerError(`Unable to connect to the backend server at ${API_BASE_URL}. Ensure the backend is running on port 5000.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-badge">Academic Year 2025 – 2026</span>
        <h1 className="card-title">Admission Registration Form</h1>
        <p className="card-subtitle">
          Please complete all required fields accurately. Applications are securely recorded in the school registry.
        </p>
      </div>

      <div className="card-body">
        {serverError && (
          <div 
            className="auth-alert alert-danger" 
            style={{ 
              marginBottom: '1.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              borderRadius: '8px' 
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Student Information */}
          <div className="form-section-title">
            <span>👤</span>
            <span>Student Information</span>
          </div>

          <div className="form-grid">
            <div className="form-group form-grid-full">
              <label className="form-label" htmlFor="fullName">
                Student Full Name <span className="required-star">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                maxLength={150}
                placeholder="e.g. Alexander James Miller"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dob">
                Date of Birth <span className="required-star">*</span>
              </label>
              <input
                id="dob"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`form-input ${errors.dob ? 'input-error' : ''}`}
              />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gender">
                Gender <span className="required-star">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`form-select ${errors.gender ? 'input-error' : ''}`}
              >
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>

            <div className="form-group form-grid-full">
              <label className="form-label" htmlFor="email">
                Student / Contact Email <span className="required-star">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                maxLength={150}
                placeholder="student@example.com or guardian@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          {/* Section 2: Parent / Guardian Information */}
          <div className="form-section-title" style={{ marginTop: '2rem' }}>
            <span>👨‍👩‍👧</span>
            <span>Parent / Guardian Details</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="parentName">
                Parent / Guardian Name <span className="required-star">*</span>
              </label>
              <input
                id="parentName"
                type="text"
                name="parentName"
                maxLength={150}
                placeholder="Full name of parent or guardian"
                value={formData.parentName}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`form-input ${errors.parentName ? 'input-error' : ''}`}
              />
              {errors.parentName && <span className="error-text">{errors.parentName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="parentPhone">
                Parent / Guardian Phone <span className="required-star">*</span>
              </label>
              <input
                id="parentPhone"
                type="tel"
                name="parentPhone"
                maxLength={25}
                placeholder="e.g. +1 555-019-2834"
                value={formData.parentPhone}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`form-input ${errors.parentPhone ? 'input-error' : ''}`}
              />
              {errors.parentPhone && <span className="error-text">{errors.parentPhone}</span>}
            </div>

            <div className="form-group form-grid-full">
              <label className="form-label" htmlFor="address">
                Residential Address <span className="required-star">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                rows="2"
                maxLength={500}
                placeholder="Street address, City, State, Postal code"
                value={formData.address}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`form-textarea ${errors.address ? 'input-error' : ''}`}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
          </div>

          {/* Section 3: Academic Information */}
          <div className="form-section-title" style={{ marginTop: '2rem' }}>
            <span>🏫</span>
            <span>Academic Background</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="classApplyingFor">
                Class Applying For <span className="required-star">*</span>
              </label>
              <select
                id="classApplyingFor"
                name="classApplyingFor"
                value={formData.classApplyingFor}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`form-select ${errors.classApplyingFor ? 'input-error' : ''}`}
              >
                <option value="">-- Choose Class / Grade --</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9 (Freshman)">Grade 9 (Freshman)</option>
                <option value="Grade 10 (Sophomore)">Grade 10 (Sophomore)</option>
                <option value="Grade 11 (Junior)">Grade 11 (Junior)</option>
                <option value="Grade 12 (Senior)">Grade 12 (Senior)</option>
              </select>
              {errors.classApplyingFor && <span className="error-text">{errors.classApplyingFor}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="previousSchool">
                Previous School <span className="required-star">*</span>
              </label>
              <input
                id="previousSchool"
                type="text"
                name="previousSchool"
                maxLength={200}
                placeholder="e.g. Lincoln Elementary School"
                value={formData.previousSchool}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`form-input ${errors.previousSchool ? 'input-error' : ''}`}
              />
              {errors.previousSchool && <span className="error-text">{errors.previousSchool}</span>}
            </div>

            <div className="form-group form-grid-full">
              <label className="form-label" htmlFor="additionalInfo">
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows="3"
                maxLength={1000}
                placeholder="Any special talents, medical considerations, or additional notes..."
                value={formData.additionalInfo}
                onChange={handleChange}
                disabled={isSubmitting}
                className="form-textarea"
              />
            </div>
          </div>

          {/* Submission Button */}
          <div style={{ marginTop: '2.5rem' }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite'
                  }}></span>
                  <span>Saving Application to Registry...</span>
                </>
              ) : (
                <>
                  <span>Submit Admission Form</span>
                  <span>➔</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
