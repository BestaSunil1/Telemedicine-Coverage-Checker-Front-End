import React, { useState } from 'react';
import { 
  Search, CheckCircle, XCircle, Shield, Calendar, DollarSign, FileText, Loader2 
} from 'lucide-react';
import './InsuranceEligibilityChecker.css';  

const InsuranceEligibilityChecker = () => {
  const [patientId, setPatientId] = useState('');
  const [insurancePlanId, setInsurancePlanId] = useState('');
  const [eligibilityData, setEligibilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkEligibility = async () => {
    if (!patientId.trim() || !insurancePlanId.trim()) {
      setError('Please enter both Patient ID and Insurance Plan ID');
      return;
    }

    setLoading(true);
    setError('');
    setEligibilityData(null);

    try {
      const response = await fetch('http://localhost:9090/api/eligibility/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientId.trim(),
          insurancePlanId: insurancePlanId.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEligibilityData(data);
    } catch (err) {
      setError(`Error checking eligibility: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkEligibility();
    }
  };

  const clearSearch = () => {
    setPatientId('');
    setInsurancePlanId('');
    setEligibilityData(null);
    setError('');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    // <div className="checker-container">
      <div className="checker-card">
        {/* Header */}
        <div className="checker-header">
          <h4 className="checker-title">
            <Shield className="icon-large" />
            Insurance Eligibility Checker
          </h4>
          {/* <p className="checker-subtitle">Check your insurance coverage and benefits</p> */}
        </div>

        {/* Search Form */}
        <div className="checker-form">
            
          <div className="input-grid">
            <div>
              <label className="input-label">Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Patient ID"
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Insurance Plan ID</label>
              <input
                type="text"
                value={insurancePlanId}
                onChange={(e) => setInsurancePlanId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Insurance Plan ID"
                className="input-field"
              />
            </div>
          </div>

          <div className="button-group">
            <button
              onClick={checkEligibility}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <Loader2 className="icon-spin" />
              ) : (
                <Search className="icon-small" />
              )}
              {loading ? 'Checking...' : 'Check Eligibility'}
            </button>
            <button
              onClick={clearSearch}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <div className="error-icon-text">
                <XCircle className="icon-small text-red" />
                <p className="error-text">{error}</p>
              </div>
            </div>
          )}

          {/* Eligibility Results */}
          {eligibilityData && (
            <div className="result-card">
              {/* Status Header */}
              <div className="result-header">
                <div className="status-icon-text">
                  {eligibilityData.eligibleForBooking ? (
                    <CheckCircle className="icon-status icon-green" />
                  ) : (
                    <XCircle className="icon-status icon-red" />
                  )}
                  <div>
                    <h2 className="patient-name">{eligibilityData.patientName}</h2>
                    <p className="eligibility-msg">{eligibilityData.message}</p>
                  </div>
                </div>
                <div>
                  <span className={`status-badge ${
                    eligibilityData.eligibilityStatus === 'VERIFIED' 
                      ? 'status-verified' 
                      : 'status-other'
                  }`}>
                    {eligibilityData.eligibilityStatus}
                  </span>
                </div>
              </div>

              {/* Plan Details */}
              <div className="details-grid">
                <div className="details-card">
                  <h3 className="details-title">
                    <Shield className="icon-small text-blue" />
                    Insurance Plan Details
                  </h3>
                  <div className="details-content">
                    <p><span className="field-label">Plan Name:</span> {eligibilityData.planName}</p>
                    <p><span className="field-label">Provider:</span> {eligibilityData.planProvider}</p>
                    <p><span className="field-label">Plan ID:</span> {eligibilityData.insurancePlanId}</p>
                  </div>
                </div>

                <div className="details-card">
                  <h3 className="details-title">
                    <Calendar className="icon-small text-blue" />
                    Coverage Status
                  </h3>
                  <div className="details-content">
                    <p>
                      <span className="field-label">Status:</span> 
                      <span className={`coverage-status ${
                        eligibilityData.coverageStatus === 'COVERED' 
                          ? 'covered' 
                          : 'not-covered'
                      }`}>
                        {eligibilityData.coverageStatus}
                      </span>
                    </p>
                    <p><span className="field-label">Verified At:</span> {formatDateTime(eligibilityData.verifiedAt)}</p>
                    <p><span className="field-label">Patient ID:</span> {eligibilityData.patientId}</p>
                  </div>
                </div>
              </div>

              {/* Benefit Details */}
              {/* {eligibilityData.benefitDetails && (
                <div className="details-card">
                  <h3 className="details-title">
                    <FileText className="icon-small text-blue" />
                    Coverage Benefits
                  </h3>
                  <p className="benefits-text">{eligibilityData.benefitDetails}</p>
                </div>
              )} */}

              {/* Booking Status */}
              {eligibilityData.eligibleForBooking && (
                <div className="booking-status">
                  <div className="booking-text">
                    <CheckCircle className="icon-small icon-green mr-3" />
                    <p className="booking-msg">
                      ✅ You are eligible to book appointments with this insurance plan
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    // </div>
  );
};

export default InsuranceEligibilityChecker;
