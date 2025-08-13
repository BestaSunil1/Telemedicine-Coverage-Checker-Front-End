
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   Search, CheckCircle, XCircle, Shield, Calendar, Loader2 
// // } from 'lucide-react';
// // import './InsuranceEligibilityChecker.css';  

// // const InsuranceEligibilityChecker = () => {
// //   // Patient ID (read-only)
// //   const [patientId] = useState(() => localStorage.getItem('patientId') || '');
  
// //   // Selected insurance plan ID from dropdown
// //   const [insurancePlanId, setInsurancePlanId] = useState('');
  
// //   // List of insurance plans fetched from API
// //   const [insurancePlans, setInsurancePlans] = useState([]);
// //   const [eligibilityData, setEligibilityData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [loadingPlans, setLoadingPlans] = useState(true);

// //   // Fetch insurance plans from API on component mount
// //   useEffect(() => {
// //     const fetchPlans = async () => {
// //       setLoadingPlans(true);
// //       setError('');
// //       try {
// //         const response = await fetch('http://localhost:9090/api/eligibility/getAllInsurancePlans');
// //         if (!response.ok) throw new Error(`HTTP error ${response.status}`);
// //         const data = await response.json();
// //         // Optionally filter active plans only
// //         const activePlans = data.filter(plan => plan.active);
// //         setInsurancePlans(activePlans);
// //       } catch (err) {
// //         setError(`Failed to load insurance plans: ${err.message}`);
// //       } finally {
// //         setLoadingPlans(false);
// //       }
// //     };

// //     fetchPlans();
// //   }, []);

// //   // Function to check eligibility by calling backend API
// //   const checkEligibility = async () => {
// //     if (!patientId.trim() || !insurancePlanId.trim()) {
// //       setError('Please enter both Patient ID and select an Insurance Plan');
// //       setEligibilityData(null);
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');
// //     setEligibilityData(null);

// //     try {
// //       const response = await fetch('http://localhost:9090/api/eligibility/check', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           patientId: patientId.trim(),
// //           insurancePlanId: insurancePlanId.trim(),
// //         }),
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const data = await response.json();
// //       setEligibilityData(data);
// //     } catch (err) {
// //       setError(`Error checking eligibility: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Handle Enter key press to trigger eligibility check
// //   const handleKeyPress = (e) => {
// //     if (e.key === 'Enter') {
// //       checkEligibility();
// //     }
// //   };

// //   // Clear all inputs and results
// //   const clearSearch = () => {
// //     // patientId is read-only, so don't clear it
// //     setInsurancePlanId('');
// //     setEligibilityData(null);
// //     setError('');
// //   };

// //   // Format date/time nicely
// //   const formatDateTime = (dateString) => {
// //     if (!dateString) return 'N/A';
// //     const date = new Date(dateString);
// //     return date.toLocaleString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     });
// //   };

// //   return (
// //     <div className="checker-card">
// //       {/* Header */}
// //       <div className="checker-header">
// //         <h4 className="checker-title">
// //           <Shield className="icon-large" />
// //           Insurance Eligibility Checker
// //         </h4>
// //       </div>

// //       {/* Search Form */}
// //       <div className="checker-form">
// //         <div className="input-grid">
// //           <div>
// //             <label className="input-label">Patient ID</label>
// //             <input
// //               type="text"
// //               value={patientId}
// //               readOnly
// //               disabled
// //               placeholder="Patient ID"
// //               className="input-field read-only"
// //               title="Patient ID is read-only"
// //             />
// //           </div>

// //           <div>
// //             <label className="input-label">Insurance Plan</label>
// //             {loadingPlans ? (
// //               <div className="loading-plans">Loading plans...</div>
// //             ) : (
// //               <select
// //                 value={insurancePlanId}
// //                 onChange={(e) => setInsurancePlanId(e.target.value)}
// //                 onKeyPress={handleKeyPress}
// //                 className="input-field"
// //               >
// //                 <option value="" disabled>
// //                   -- Select Insurance Plan --
// //                 </option>
// //                 {insurancePlans.map((plan) => (
// //                   <option key={plan.id} value={plan.id}>
// //                     {plan.planName} ({plan.planProvider})
// //                   </option>
// //                 ))}
// //               </select>
// //             )}
// //           </div>
// //         </div>

// //         <div className="button-group">
// //           <button
// //             onClick={checkEligibility}
// //             disabled={loading || loadingPlans}
// //             className="btn-primary"
// //             type="button"
// //           >
// //             {loading ? (
// //               <Loader2 className="icon-spin" />
// //             ) : (
// //               <Search className="icon-small" />
// //             )}
// //             {loading ? 'Checking...' : 'Check Eligibility'}
// //           </button>
// //           <button onClick={clearSearch} className="btn-secondary" type="button">
// //             Clear
// //           </button>
// //         </div>

// //         {/* Error Message */}
// //         {error && (
// //           <div className="error-message">
// //             <div className="error-icon-text">
// //               <XCircle className="icon-small text-red" />
// //               <p className="error-text">{error}</p>
// //             </div>
// //           </div>
// //         )}

// //         {/* Eligibility Results */}
// //         {eligibilityData && (
// //           <div className="result-card">
// //             {/* Status Header */}
// //             <div className="result-header">
// //               <div className="status-icon-text">
// //                 {eligibilityData.eligibleForBooking ? (
// //                   <CheckCircle className="icon-status icon-green" />
// //                 ) : (
// //                   <XCircle className="icon-status icon-red" />
// //                 )}
// //                 <div>
// //                   <h2 className="patient-name">{eligibilityData.patientName}</h2>
// //                   <p className="eligibility-msg">{eligibilityData.message}</p>
// //                 </div>
// //               </div>
// //               <div>
// //                 <span
// //                   className={`status-badge ${
// //                     eligibilityData.eligibilityStatus === 'VERIFIED'
// //                       ? 'status-verified'
// //                       : 'status-other'
// //                   }`}
// //                 >
// //                   {eligibilityData.eligibilityStatus}
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Plan Details */}
// //             <div className="details-grid">
// //               <div className="details-card">
// //                 <h3 className="details-title">
// //                   <Shield className="icon-small text-blue" />
// //                   Insurance Plan Details
// //                 </h3>
// //                 <div className="details-content">
// //                   <p>
// //                     <span className="field-label">Plan Name:</span> {eligibilityData.planName}
// //                   </p>
// //                   <p>
// //                     <span className="field-label">Provider:</span> {eligibilityData.planProvider}
// //                   </p>
// //                   <p>
// //                     <span className="field-label">Plan ID:</span> {eligibilityData.insurancePlanId}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="details-card">
// //                 <h3 className="details-title">
// //                   <Calendar className="icon-small text-blue" />
// //                   Coverage Status
// //                 </h3>
// //                 <div className="details-content">
// //                   <p>
// //                     <span className="field-label">Status:</span>{' '}
// //                     <span
// //                       className={`coverage-status ${
// //                         eligibilityData.coverageStatus === 'COVERED'
// //                           ? 'covered'
// //                           : 'not-covered'
// //                       }`}
// //                     >
// //                       {eligibilityData.coverageStatus}
// //                     </span>
// //                   </p>
// //                   <p>
// //                     <span className="field-label">Verified At:</span>{' '}
// //                     {formatDateTime(eligibilityData.verifiedAt)}
// //                   </p>
// //                   <p>
// //                     <span className="field-label">Patient ID:</span>{' '}
// //                     {eligibilityData.patientId}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Booking Status */}
// //             {eligibilityData.eligibleForBooking && (
// //               <div className="booking-status">
// //                 <div className="booking-text">
// //                   <CheckCircle className="icon-small icon-green mr-3" />
// //                   <p className="booking-msg">
// //                     ✅ You are eligible to book appointments with this insurance plan
// //                   </p>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default InsuranceEligibilityChecker;
// import React, { useState, useEffect } from 'react';
// import { 
//   Search, CheckCircle, XCircle, Shield, Calendar, Loader2 
// } from 'lucide-react';
// import './InsuranceEligibilityChecker.css';  

// const InsuranceEligibilityChecker = () => {
//   // Patient ID (read-only)
//   const [patientId] = useState(() => localStorage.getItem('patientId') || '');
  
//   // Selected insurance plan ID from dropdown
//   const [insurancePlanId, setInsurancePlanId] = useState('');
  
//   // List of insurance plans fetched from API
//   const [insurancePlans, setInsurancePlans] = useState([]);
//   const [eligibilityData, setEligibilityData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [loadingPlans, setLoadingPlans] = useState(true);

//   // Fetch insurance plans from API on component mount
//   useEffect(() => {
//     const fetchPlans = async () => {
//       setLoadingPlans(true);
//       setError('');
//       try {
//         const response = await fetch('http://localhost:9090/api/eligibility/getAllInsurancePlans');
//         if (!response.ok) throw new Error(`HTTP error ${response.status}`);
//         const data = await response.json();
//         // Filter active plans only if needed
//         const activePlans = data.filter(plan => plan.active);
//         setInsurancePlans(activePlans);
//       } catch (err) {
//         setError(`Failed to load insurance plans: ${err.message}`);
//       } finally {
//         setLoadingPlans(false);
//       }
//     };

//     fetchPlans();
//   }, []);

//   // Function to check eligibility by calling backend API
//   const checkEligibility = async () => {
//     if (!patientId.trim() || !insurancePlanId.trim()) {
//       setError('Please enter both Patient ID and select an Insurance Plan');
//       setEligibilityData(null);
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setEligibilityData(null);

//     try {
//       const response = await fetch('http://localhost:9090/api/eligibility/check', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           patientId: patientId.trim(),
//           insurancePlanId: insurancePlanId.trim(),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setEligibilityData(data);
//     } catch (err) {
//       setError(`Error checking eligibility: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Enter key press to trigger eligibility check
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       checkEligibility();
//     }
//   };

//   // Clear all inputs and results
//   const clearSearch = () => {
//     setInsurancePlanId('');
//     setEligibilityData(null);
//     setError('');
//   };

//   // Format date/time nicely
//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="checker-card">
//       {/* Header */}
//       <div className="checker-header">
//         <h4 className="checker-title">
//           <Shield className="icon-large" />
//           Insurance Eligibility Checker
//         </h4>
//       </div>

//       {/* Search Form */}
//       <div className="checker-form">
//         <div className="input-grid">
//           <div>
//             <label className="input-label">Patient ID</label>
//             <input
//               type="text"
//               value={patientId}
//               readOnly
//               disabled
//               placeholder="Patient ID"
//               className="input-field read-only"
//               title="Patient ID is read-only"
//             />
//           </div>

//           <div>
//             <label className="input-label">Insurance Plan</label>
//             {loadingPlans ? (
//               <div className="loading-plans">Loading plans...</div>
//             ) : (
//               <select
//                 value={insurancePlanId}
//                 onChange={(e) => setInsurancePlanId(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="input-field"
//               >
//                 <option value="" disabled>
//                   -- Select Insurance Plan --
//                 </option>
//                 {insurancePlans.map((plan) => (
//                   <option key={plan.id} value={plan.id}>
//                     {plan.planName} ({plan.planProvider})
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </div>

//         <div className="button-group">
//           <button
//             onClick={checkEligibility}
//             disabled={loading || loadingPlans}
//             className="btn-primary"
//             type="button"
//           >
//             {loading ? (
//               <Loader2 className="icon-spin" />
//             ) : (
//               <Search className="icon-small" />
//             )}
//             {loading ? 'Checking...' : 'Check Eligibility'}
//           </button>
//           <button onClick={clearSearch} className="btn-secondary" type="button">
//             Clear
//           </button>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="error-message">
//             <div className="error-icon-text">
//               <XCircle className="icon-small text-red" />
//               <p className="error-text">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Eligibility Results */}
//         {eligibilityData && (
//           <div className="result-card">
//             {/* Status Header */}
//             <div className="result-header">
//               <div className="status-icon-text">
//                 {eligibilityData.eligibleForBooking ? (
//                   <CheckCircle className="icon-status icon-green" />
//                 ) : (
//                   <XCircle className="icon-status icon-red" />
//                 )}
//                 <div>
//                   <h2 className="patient-name">{eligibilityData.patientName}</h2>
//                   <p className="eligibility-msg">{eligibilityData.message}</p>
//                 </div>
//               </div>
//               <div>
//                 <span
//                   className={`status-badge ${
//                     eligibilityData.eligibilityStatus === 'VERIFIED'
//                       ? 'status-verified'
//                       : 'status-other'
//                   }`}
//                 >
//                   {eligibilityData.eligibilityStatus}
//                 </span>
//               </div>
//             </div>

//             {/* Plan Details */}
//             <div className="details-grid">
//               <div className="details-card">
//                 <h3 className="details-title">
//                   <Shield className="icon-small text-blue" />
//                   Insurance Plan Details
//                 </h3>
//                 <div className="details-content">
//                   <p><span className="field-label">Plan Name:</span> {eligibilityData.planName}</p>
//                   <p><span className="field-label">Provider:</span> {eligibilityData.planProvider}</p>
//                   <p><span className="field-label">Plan ID:</span> {eligibilityData.insurancePlanId}</p>
//                 </div>
//               </div>

//               <div className="details-card">
//                 <h3 className="details-title">
//                   <Calendar className="icon-small text-blue" />
//                   Coverage Status
//                 </h3>
//                 <div className="details-content">
//                   <p>
//                     <span className="field-label">Status:</span>{' '}
//                     <span className={`coverage-status ${
//                       eligibilityData.coverageStatus === 'COVERED'
//                         ? 'covered'
//                         : 'not-covered'
//                     }`}>
//                       {eligibilityData.coverageStatus}
//                     </span>
//                   </p>
                
//                   <p><span className="field-label">Verified At:</span> {formatDateTime(eligibilityData.verifiedAt)}</p>
//                   <p><span className="field-label">Patient ID:</span> {eligibilityData.patientId}</p>

//                   {/* Coverages List */}
//                   {eligibilityData.coverages && eligibilityData.coverages.length > 0 && (
//                     <div>
//                       <span className="field-label">Coverages:</span>
//                       <ul className="coverages-list">
//                         {eligibilityData.coverages.map((coverage, idx) => (
//                           <li key={idx}>{coverage}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Booking Status */}
//             {eligibilityData.eligibleForBooking && (
//               <div className="booking-status">
//                 <div className="booking-text">
//                   <CheckCircle className="icon-small icon-green mr-3" />
//                   <p className="booking-msg">
//                     ✅ You are eligible to book appointments with this insurance plan
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InsuranceEligibilityChecker;
import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle, User, FileText, Clock, RefreshCw } from 'lucide-react';
import './InsuranceEligibilityChecker.css';

const InsuranceEligibilityChecker = ({ 
  patientId, 
  selectedDoctor, 
  onEligibilityResult, 
  disabled = false 
}) => {
  const [selectedInsurancePlan, setSelectedInsurancePlan] = useState('');
  const [eligibilityStatus, setEligibilityStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [eligibilityDetails, setEligibilityDetails] = useState(null);

  const INSURANCE_PLANS_API = 'http://localhost:9090/api/eligibility/getAllInsurancePlans';
  const PATIENT_ELIGIBILITY_API = 'http://localhost:9090/api/eligibility/patient';
  const ELIGIBILITY_CHECK_API = 'http://localhost:9090/api/eligibility/check';

  useEffect(() => {
    const fetchInsurancePlans = async () => {
      try {
        setLoading(true);
        const response = await fetch(INSURANCE_PLANS_API);
        if (response.ok) {
          const plans = await response.json();
          const activePlans = plans.filter(plan => plan.active);
          setAvailablePlans(activePlans);
        } else {
          setError('Failed to fetch insurance plans');
        }
      } catch {
        setError('Failed to load insurance plans');
      } finally {
        setLoading(false);
      }
    };
    fetchInsurancePlans();
  }, []);

  useEffect(() => {
    if (!patientId) return;

    const fetchPatientEligibility = async () => {
      try {
        const response = await fetch(`${PATIENT_ELIGIBILITY_API}/${patientId}/plans`);
        if (response.ok) {
          const eligibilityRecords = await response.json();
          const verifiedRecords = eligibilityRecords.filter(r => r.status === 'VERIFIED');
          if (verifiedRecords.length > 0) {
            setEligibilityDetails(verifiedRecords);
            if (!selectedInsurancePlan && verifiedRecords[0].plan) {
              setSelectedInsurancePlan(verifiedRecords[0].plan.insurancePlanId || verifiedRecords[0].plan.id);
            }
          }
        }
      } catch {
        // Ignore errors here
      }
    };
    fetchPatientEligibility();
  }, [patientId, selectedInsurancePlan]);

  const checkEligibility = async () => {
    if (!selectedInsurancePlan || !selectedDoctor) {
      setError('Please select an insurance plan and doctor');
      return;
    }
    setLoading(true);
    setError(null);
    setEligibilityStatus(null);
    try {
      const requestBody = {
        patientId,
        doctorId: selectedDoctor.doctorId,
        insurancePlanId: selectedInsurancePlan
      };
      const response = await fetch(ELIGIBILITY_CHECK_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const result = await response.json();
      if (response.ok) {
        const isEligible = !!result.eligibleForBooking;
        const message = result.message || (isEligible ? "Patient is eligible for insurance coverage" : "Patient is not eligible for insurance coverage");
        const eligibilityResult = {
          eligible: isEligible,
          message,
          coverages: result.coverages || [],
          benefitDetails: result.benefitDetails || '',
          insurancePlanId: selectedInsurancePlan,
          planName: result.planName || '',
          planProvider: result.planProvider || ''
        };
        setEligibilityStatus(eligibilityResult);
        if (onEligibilityResult) onEligibilityResult(eligibilityResult);
      } else {
        setError(result.message || 'Failed to check eligibility');
        if (onEligibilityResult) onEligibilityResult({ eligible: false, message: result.message || 'Failed to check eligibility' });
      }
    } catch (error) {
      const msg = 'Error checking eligibility: ' + error.message;
      setError(msg);
      if (onEligibilityResult) onEligibilityResult({ eligible: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  const resetEligibilityCheck = () => {
    setEligibilityStatus(null);
    setError(null);
    if (onEligibilityResult) onEligibilityResult(null);
  };

  const handlePlanChange = (planId) => {
    setSelectedInsurancePlan(planId);
    resetEligibilityCheck();
  };

  return (
    <div className="insurance-eligibility-container">
      <div className="insurance-header">
        <Shield className="text-blue-500" size={24} />
        <h2 className="insurance-title">Insurance Eligibility Check</h2>
      </div>

      {/* Verified plans section */}
      {/* {eligibilityDetails?.length > 0 && (
        <div className="eligibility-records">
          <div className="eligibility-records-header">
            <CheckCircle className="text-green-500" size={16} />
            <span className="eligibility-records-title">Verified Insurance Plans</span>
          </div>
          {eligibilityDetails.map((record, idx) => (
            <div key={idx} className="eligibility-record-item">
              • {record.plan?.planName || 'Unknown Plan'} ({record.plan?.planProvider || 'Unknown Provider'}) - Status: {record.status}
            </div>
          ))}
        </div>
      )} */}

      {/* Selected Doctor info */}
      {selectedDoctor && (
        <div className="selected-doctor-display">
          <div className="selected-doctor-header">
            <User className="text-blue-500" size={16} />
            <span className="selected-doctor-title">Selected Doctor</span>
          </div>
          <div className="selected-doctor-details">
            <div className="doctor-name">Dr. {selectedDoctor.doctorName}</div>
            <div className="doctor-specializations">
              Specializations: {selectedDoctor.doctorSpecializations?.join(', ') || 'N/A'}
            </div>
            <div>Email: {selectedDoctor.doctorEmail}</div>
          </div>
        </div>
      )}

      {/* Insurance Plan Selector */}
      <div className="insurance-form-group">
        <label className="insurance-form-label">Select Your Insurance Plan</label>
        <select
          value={selectedInsurancePlan}
          onChange={e => handlePlanChange(e.target.value)}
          className="insurance-plan-select"
          disabled={loading || disabled}
        >
          <option value="">Choose an insurance plan...</option>
          {availablePlans.map(plan => (
            <option key={plan.id || plan._id} value={plan.id || plan._id}>
              {plan.planName} - {plan.planProvider}
              {plan.coverages && plan.coverages.length > 0 && ` (Covers: ${plan.coverages.join(', ')})`}
            </option>
          ))}
        </select>
      </div>

      {/* Check Eligibility Button */}
      <button
        onClick={checkEligibility}
        disabled={!selectedInsurancePlan || !selectedDoctor || loading || disabled}
        className={`check-eligibility-btn ${!selectedInsurancePlan || !selectedDoctor || loading || disabled ? 'disabled' : 'enabled'}`}
      >
        {loading ? (
          <>
            <RefreshCw className="eligibility-loading" size={16} />
            Checking Eligibility...
          </>
        ) : (
          <>
            <Shield className="mr-2" size={16} />
            Check Insurance Eligibility
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle className="text-red-500" size={16} />
          <span className="error-text">{error}</span>
        </div>
      )}

      {/* Eligibility Result */}
      {eligibilityStatus && (
        <div className={`eligibility-result ${eligibilityStatus.eligible ? 'eligible' : 'not-eligible'}`}>
          <div className="eligibility-result-content">
            <div className="eligibility-result-icon">
              {eligibilityStatus.eligible ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <AlertCircle className="text-red-500" size={24} />
              )}
            </div>
            <div className="flex-1">
              <div className={`eligibility-status-title ${eligibilityStatus.eligible ? 'eligible' : 'not-eligible'}`}>
                {eligibilityStatus.eligible ? 'Eligible for Coverage' : 'Not Eligible'}
              </div>
              <div className={`eligibility-status-message ${eligibilityStatus.eligible ? 'eligible' : 'not-eligible'}`}>
                {eligibilityStatus.message}
              </div>

              {/* Coverage List */}
              {eligibilityStatus.eligible && eligibilityStatus.coverages && eligibilityStatus.coverages.length > 0 && (
                <div className="coverage-details">
                  <div className="coverage-details-title">Covered Specializations:</div>
                  <ul>
                    {eligibilityStatus.coverages.map((cvg, idx) => (
                      <li key={idx}>{cvg}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefit Details */}
              {eligibilityStatus.eligible && eligibilityStatus.benefitDetails && (
                <div className="benefit-details">
                  <strong>Benefit Details:</strong> {eligibilityStatus.benefitDetails}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notice if no doctor selected */}
      {!selectedDoctor && (
        <div className="no-doctor-selected">
          <Clock className="text-gray-500" size={16} />
          <span>Please select a doctor first to check insurance eligibility.</span>
        </div>
      )}

      {/* Help text */}
      <div className="help-text">
        <FileText className="inline mr-1" size={12} />
        Insurance eligibility is verified in real-time based on your plan coverage and the doctor's specializations.
        {!eligibilityDetails?.length && (
          <span className="help-text-note">
            <strong>Note:</strong> If you don't have verified insurance eligibility records, please contact admin.
          </span>
        )}
      </div>
    </div>
  );
};

export default InsuranceEligibilityChecker;
