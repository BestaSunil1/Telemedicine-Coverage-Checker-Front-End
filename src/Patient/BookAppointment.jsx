

// import React, { useState, useEffect } from 'react';
// import { Search, Calendar, Clock, User, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
// import './appointment.css';
// import InsuranceEligibilityChecker from './InsuranceEligibilityChecker';

// const AVAILABILITIES_API = 'http://localhost:9090/api/doctors/availabilities';
// const AVAILABILITIES_BY_DAY_API = 'http://localhost:9090/api/doctors/availabilities/day/';
// const BOOK_APPOINTMENT_API = 'http://localhost:9090/api/appointments/book';
// const INITIATE_PAYMENT_API = 'http://localhost:9090/api/payments/initiate';
// const VERIFY_PAYMENT_API = 'http://localhost:9090/api/payments/verify';

// const AVAILABILITIES_PER_PAGE = 3;
// const RAZORPAY_KEY_ID = 'rzp_test_LqWBBDbgwot5lh';

// function groupByDoctor(availabilities) {
//   const map = new Map();
//   for (const slot of availabilities) {
//     slot.doctorSpecializations = slot.doctorSpecializations || [];
//     if (!map.has(slot.doctorId)) {
//       map.set(slot.doctorId, {
//         doctorId: slot.doctorId,
//         doctorName: slot.doctorName,
//         doctorEmail: slot.doctorEmail,
//         doctorSpecializations: slot.doctorSpecializations,
//         slots: [],
//       });
//     }
//     map.get(slot.doctorId).slots.push(slot);
//   }
//   return Array.from(map.values());
// }

// const BookAppointment = ({ userId, onNavigate }) => {
//   const [availabilities, setAvailabilities] = useState([]);
//   const [filteredAvailabilities, setFilteredAvailabilities] = useState([]);
//   const [selectedAvailability, setSelectedAvailability] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');
//   const [selectedDayFilter, setSelectedDayFilter] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [timeSlots, setTimeSlots] = useState([]);

//   const [bookingStep, setBookingStep] = useState('selection');
//   const [bookedAppointment, setBookedAppointment] = useState(null);
//   const [paymentData, setPaymentData] = useState(null);
//   const [bookingLoading, setBookingLoading] = useState(false);
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [insuranceCoverage, setInsuranceCoverage] = useState('COVERED');
//   const [paymentAmount, setPaymentAmount] = useState(500.00);
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);
//   const [paymentError, setPaymentError] = useState(null);
//   const [eligibilityResult, setEligibilityResult] = useState(null);
//   const [selectedDoctorForEligibility, setSelectedDoctorForEligibility] = useState(null);
//   const [insurancePlanId, setInsurancePlanId] = useState('');

//   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const [patientId, setPatientId] = useState(null);

//   // Get patientId and store in state/localStorage
//   useEffect(() => {
//     async function getPatientIdByUserId(userId) {
//       if (!userId) return null;
//       try {
//         const response = await fetch(`http://localhost:9090/api/patients/user/${userId}`);
//         if (!response.ok) throw new Error('Failed to fetch patient data');
//         const patientData = await response.json();
//         const patientId = patientData.id || patientData._id;
//         setPatientId(patientId);
//         localStorage.setItem('patientId', patientId);
//         return patientId;
//       } catch {
//         setPatientId(null);
//         return null;
//       }
//     }
//     getPatientIdByUserId(userId);
//   }, [userId]);

//   // Load Razorpay script on component mount
//   useEffect(() => { loadRazorpayScript(); }, []);
//   const loadRazorpayScript = () => {
//     return new Promise((resolve, reject) => {
//       if (typeof window.Razorpay !== 'undefined') {
//         setRazorpayLoaded(true);
//         resolve(true); return;
//       }
//       const existingScript = document.getElementById('razorpay-script');
//       if (existingScript) {
//         existingScript.onload = () => { setRazorpayLoaded(true); resolve(true); };
//         existingScript.onerror = () => { setRazorpayLoaded(false); reject(false); };
//         return;
//       }
//       const script = document.createElement('script');
//       script.id = 'razorpay-script';
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.async = true;
//       script.onload = () => { setRazorpayLoaded(true); resolve(true); };
//       script.onerror = (error) => { setRazorpayLoaded(false); reject(false); };
//       document.head.appendChild(script);
//     });
//   };

//   // Fetch all available doctor availabilities
//   useEffect(() => {
//     fetchAvailabilities();
//   }, []);

//   const fetchAvailabilities = () => {
//     setLoading(true);
//     fetch(AVAILABILITIES_API)
//       .then(res => res.json())
//       .then(data => {
//         const grouped = groupByDoctor(data);
//         setAvailabilities(grouped);
//         setFilteredAvailabilities(grouped);
//         setCurrentPage(1);
//       })
//       .catch(() => {
//         setAvailabilities([]); setFilteredAvailabilities([]);
//       })
//       .finally(() => { setLoading(false); });
//   };

//   const fetchAvailabilitiesByDay = (dayOfWeek) => {
//     if (!dayOfWeek) { fetchAvailabilities(); return; }
//     setLoading(true);
//     fetch(`${AVAILABILITIES_BY_DAY_API}${dayOfWeek}`)
//       .then(res => res.json())
//       .then(data => {
//         const grouped = groupByDoctor(data);
//         setAvailabilities(grouped);
//         setFilteredAvailabilities(grouped);
//         setCurrentPage(1);
//       })
//       .catch(() => {
//         setAvailabilities([]); setFilteredAvailabilities([]);
//       })
//       .finally(() => { setLoading(false); });
//   };

//   const handleDayFilterChange = (day) => {
//     setSelectedDayFilter(day);
//     fetchAvailabilitiesByDay(day);
//   };

//   // Handle search (doctor name, specialization, etc)
//   useEffect(() => {
//     const filtered = availabilities.filter((doctor) => {
//       const doctorName = doctor.doctorName?.toLowerCase() || '';
//       const specializations = (doctor.doctorSpecializations || []).map(s => s.toLowerCase());
//       const query = searchQuery.toLowerCase();
//       return (
//         doctorName.includes(query) ||
//         specializations.some(s => s.includes(query))
//       );
//     });
//     setFilteredAvailabilities(filtered);
//     setCurrentPage(1);
//   }, [searchQuery, availabilities]);

//   // Pagination logic
//   const totalPages = Math.ceil(filteredAvailabilities.length / AVAILABILITIES_PER_PAGE);
//   const startIndex = (currentPage - 1) * AVAILABILITIES_PER_PAGE;
//   const currentAvailabilities = filteredAvailabilities.slice(startIndex, startIndex + AVAILABILITIES_PER_PAGE);

//   const handleNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };
//   const handlePrevPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const handleSelectAvailability = (slot) => {
//     setSelectedAvailability(slot);
//     setSelectedDate('');
//     setSelectedTime('');
//     setTimeSlots(generateTimeSlots(slot));

//     // NEW: Set selected doctor for eligibility check
//     const doctorForEligibility = {
//       doctorId: slot.doctorId,
//       doctorName: slot.doctorName,
//       doctorEmail: slot.doctorEmail,
//       doctorSpecializations: slot.doctorSpecializations || []
//     };
//     setSelectedDoctorForEligibility(doctorForEligibility);

//     // Reset eligibility when changing doctor
//     setEligibilityResult(null);
//     setInsurancePlanId('');
//   };
//   const handleEligibilityResult = (result) => {
//     setEligibilityResult(result);

//     if (result && result.eligible) {
//       // Update insurance coverage status and plan ID
//       setInsuranceCoverage('COVERED');
//       setInsurancePlanId(result.insurancePlanId);

//       // Optionally adjust payment amount based on coverage
//       if (result.copay) {
//         setPaymentAmount(parseFloat(result.copay));
//       }
//     } else {
//       // Reset to self-pay if not eligible
//       setInsuranceCoverage('NOT_COVERED');
//       setInsurancePlanId('');
//       setPaymentAmount(500.00); // Default amount
//     }
//   };
//   // Generate time slots for a selected availability slot
//   const generateTimeSlots = (availability) => {
//     const start = new Date(availability.startTime);
//     const end = new Date(availability.endTime);
//     const duration = availability.appointmentDuration;
//     const slots = [];
//     let current = new Date(start);
//     while (current < end) {
//       slots.push(formatTime12Hour(current));
//       current = new Date(current.getTime() + duration * 60000);
//     }
//     return slots;
//   };

//   const formatTime12Hour = (date) => {
//     let h = date.getHours();
//     let m = date.getMinutes();
//     const ampm = h >= 12 ? 'PM' : 'AM';
//     h = h % 12 || 12;
//     m = m < 10 ? '0' + m : m;
//     return `${h}:${m} ${ampm}`;
//   };

//   // Convert 12-hour time to 24-hour for API
//   const convertTo24Hour = (time12h, date) => {
//     const [time, modifier] = time12h.split(' ');
//     let [hours, minutes] = time.split(':');
//     if (hours === '12') { hours = '00'; }
//     if (modifier === 'PM') { hours = parseInt(hours, 10) + 12; }
//     return `${date}T${hours.toString().padStart(2, '0')}:${minutes}`;
//   };

//   // Book appointment

//   // 4. Update the handleBookAppointment function to include insurance plan ID:

//   const handleBookAppointment = async () => {
//     if (!selectedAvailability || !selectedDate || !selectedTime) {
//       alert('Please select doctor availability, date, and time');
//       return;
//     }

//     // Check if insurance eligibility was checked for covered appointments
//     if (insuranceCoverage === 'COVERED' && !eligibilityResult?.eligible) {
//       alert('Please verify your insurance eligibility first before booking with coverage');
//       return;
//     }

//     setBookingLoading(true);
//     setBookingStep('booking');
//     setPaymentError(null);

//     try {
//       const scheduledAt = convertTo24Hour(selectedTime, selectedDate);
//       const bookingData = {
//         patientId: patientId || localStorage.getItem('patientId'),
//         doctorId: selectedAvailability.doctorId,
//         scheduledAt: scheduledAt,
//         insuranceCoverageStatus: insuranceCoverage,
//         videoSessionId: `video_session_${Date.now()}`,
//         // NEW: Include insurance plan ID if eligible
//         insurancePlanId: insurancePlanId || null
//       };

//       console.log('Booking appointment with data:', bookingData);

//       const response = await fetch(BOOK_APPOINTMENT_API, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(bookingData)
//       });

//       if (response.ok) {
//         const appointmentData = await response.json();
//         setBookedAppointment(appointmentData);
//         if (appointmentData.status === 'BOOKED') {
//           setBookingStep('payment');
//           await initiatePayment(appointmentData.id || appointmentData.appointmentId);
//         } else {
//           alert('Appointment booking failed. Status: ' + appointmentData.status);
//           setBookingStep('selection');
//         }
//       } else {
//         const errorData = await response.json();
//         alert('Booking failed: ' + (errorData.message || 'Unknown error'));
//         setBookingStep('selection');
//       }
//     } catch (error) {
//       alert('Booking failed: ' + error.message);
//       setBookingStep('selection');
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   // Initiate payment
//   const initiatePayment = async (appointmentId) => {
//     setPaymentLoading(true); setPaymentError(null);
//     try {
//       if (!razorpayLoaded) {
//         const scriptLoaded = await loadRazorpayScript();
//         if (!scriptLoaded) throw new Error('Failed to load Razorpay SDK');
//       }
//       const paymentRequest = {
//         appointmentId: appointmentId,
//         patientId: patientId || localStorage.getItem('patientId'),
//         amount: paymentAmount, currency: "INR"
//       };
//       const response = await fetch(INITIATE_PAYMENT_API, {
//         method: 'POST', headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(paymentRequest)
//       });
//       const paymentData = await response.json();
//       if (response.ok && paymentData.razorpayOrderId) {
//         setPaymentData(paymentData);
//         if (typeof window.Razorpay === 'undefined') throw new Error('Razorpay SDK not loaded properly');
//         const options = {
//           key: RAZORPAY_KEY_ID,
//           amount: Math.round(paymentAmount * 100), currency: 'INR',
//           name: 'Healthcare Appointments',
//           description: `Appointment with Dr. ${selectedAvailability.doctorName}`,
//           order_id: paymentData.razorpayOrderId,
//           handler: async function (response) {
//             setPaymentLoading(true);
//             await verifyPayment(response);
//           },
//           prefill: { name: 'Patient Name', email: 'patient@email.com', contact: '9999999999' },
//           theme: { color: '#007bff' },
//           modal: {
//             ondismiss: function () {
//               setPaymentLoading(false);
//               setPaymentError('Payment was cancelled by user');
//             },
//             escape: true,
//             backdrop_close: false
//           }
//         };
//         const rzp = new window.Razorpay(options);
//         rzp.on('payment.failed', function (response) {
//           setPaymentError(`Payment failed: ${response.error.description || response.error.reason || 'Unknown error'}`);
//           setPaymentLoading(false);
//         });
//         rzp.open();
//       } else {
//         const errorMessage = paymentData.message || paymentData.error || 'Failed to create payment order';
//         setPaymentError(errorMessage);
//         alert('Failed to initiate payment: ' + errorMessage);
//         setBookingStep('selection');
//       }
//     } catch (error) {
//       setPaymentError(error.message);
//       alert('Payment initiation failed: ' + error.message);
//       setBookingStep('selection');
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   // Payment verification
//   const verifyPayment = async (razorpayResponse) => {
//     try {
//       const verificationRequest = {
//         razorpayOrderId: razorpayResponse.razorpay_order_id,
//         razorpayPaymentId: razorpayResponse.razorpay_payment_id,
//         razorpaySignature: razorpayResponse.razorpay_signature
//       };
//       const response = await fetch(VERIFY_PAYMENT_API, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(verificationRequest)
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setBookingStep('confirmation');
//         if (result.appointmentId) {
//           setBookedAppointment(prev => ({
//             ...prev,
//             status: 'CONFIRMED',
//             paymentStatus: 'SUCCESS'
//           }));
//         }
//       } else {
//         setPaymentError(`Payment verification failed: ${result.message || result.error || 'Unknown error'}`);
//         setBookingStep('selection');
//       }
//     } catch (error) {
//       setPaymentError(`Payment verification failed: ${error.message}`);
//       setBookingStep('selection');
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   // Reset booking flow
//   const resetBooking = () => {
//     setBookingStep('selection');
//     setSelectedAvailability(null);
//     setSelectedDate('');
//     setSelectedTime('');
//     setTimeSlots([]);
//     setBookedAppointment(null);
//     setPaymentData(null);
//     setPaymentError(null);
//     // NEW: Reset eligibility state
//     setEligibilityResult(null);
//     setSelectedDoctorForEligibility(null);
//     setInsurancePlanId('');
//     setInsuranceCoverage('NOT_COVERED');
//   };

//   const formatDateTime = (dateTimeString) => {
//     const date = new Date(dateTimeString);
//     return date.toLocaleTimeString('en-US', {
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   // Render booking step indicator
//   const renderStepIndicator = () => {
//     const steps = [
//       { key: 'selection', label: 'Select Slot', icon: Calendar },
//       { key: 'booking', label: 'Book Appointment', icon: Clock },
//       { key: 'payment', label: 'Payment', icon: CreditCard },
//       { key: 'confirmation', label: 'Confirmed', icon: CheckCircle }
//     ];
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
//         {steps.map((step, index) => {
//           const Icon = step.icon;
//           const isActive = step.key === bookingStep;
//           const isCompleted = steps.findIndex(s => s.key === bookingStep) > index;
//           return (
//             <div key={step.key} style={{ display: 'flex', alignItems: 'center' }}>
//               <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 padding: '10px'
//               }}>
//                 <div style={{
//                   width: '40px',
//                   height: '40px',
//                   borderRadius: '50%',
//                   backgroundColor: isActive ? '#007bff' : isCompleted ? '#28a745' : '#e9ecef',
//                   color: isActive || isCompleted ? 'white' : '#6c757d',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginBottom: '5px'
//                 }}>
//                   <Icon size={20} />
//                 </div>
//                 <span style={{
//                   fontSize: '12px',
//                   color: isActive ? '#007bff' : isCompleted ? '#28a745' : '#6c757d',
//                   fontWeight: isActive ? 'bold' : 'normal'
//                 }}>
//                   {step.label}
//                 </span>
//               </div>
//               {index < steps.length - 1 && (
//                 <div style={{
//                   width: '50px',
//                   height: '2px',
//                   backgroundColor: isCompleted ? '#28a745' : '#e9ecef',
//                   margin: '0 10px'
//                 }} />
//               )}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="doctor-booking-container">
//       <div className="booking-header">
//         <h1 className="header-title">Book Your Appointment</h1>
//         <p className="header-subtitle">Find and book appointments with available doctors in Bengaluru</p>
//       </div>

//       {renderStepIndicator()}

//       <div>
//         <InsuranceEligibilityChecker
//           patientId={patientId}
//           selectedDoctor={selectedDoctorForEligibility}
//           onEligibilityResult={handleEligibilityResult}
//           disabled={bookingStep !== 'selection'}
//         />
//       </div>

//       {bookingStep === 'selection' && (
//         <>
//           {/* Search and Filter Section */}
//           <div className="search-section">
//             <h2 className="section-title">Search Available Doctor Slots</h2>
//             <div className="search-container">
//               <div className="search-input-container">
//                 <Search className="search-icon" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search by doctor name or specialty"
//                   value={searchQuery}
//                   onChange={e => setSearchQuery(e.target.value)}
//                   className="search-input"
//                 />
//               </div>
//             </div>
//             {/* <div className="day-filter-container" style={{ marginTop: '20px' }}>
//               <label className="form-label">Filter by Day of Week:</label>
//               <select
//                 value={selectedDayFilter}
//                 onChange={e => handleDayFilterChange(e.target.value)}
//                 className="day-filter-select"
//                 style={{ padding: '8px', marginLeft: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
//               >
//                 <option value="">All Days</option>
//                 {daysOfWeek.map(day => (
//                   <option key={day} value={day}>{day}</option>
//                 ))}
//               </select>
//             </div> */}
//           </div>
//           {/* Availabilities Grid: grouped by doctor */}
//           <div className="availabilities-section">
//             <h2 className="section-title">Available Doctor Slots</h2>
//             {loading && <p>Loading available slots...</p>}
//             {!loading && filteredAvailabilities.length === 0 && (
//               <p>No available slots found. Try adjusting your search or day filter.</p>
//             )}
//             <div className="availabilities-grid">
//               {!loading && currentAvailabilities.map(doctor => (
//                 <div key={doctor.doctorId} className="availability-card">
//                   <div className="doctor-info">
//                     <div className="doctor-avatar">
//                       <User size={40} />
//                     </div>
//                     <div className="doctor-details">
//                       <h3 className="doctor-name">Dr. {doctor.doctorName}</h3>
//                       <p className="doctor-specialty">
//                         {(doctor.doctorSpecializations || []).join(', ')}
//                       </p>
//                       <p className="doctor-email">{doctor.doctorEmail}</p>
//                     </div>
//                   </div>
//                   <div className="availability-info">
//                     {doctor.slots.filter(slot => slot.available).map(slot => (
//                       <div key={slot.id} style={{ marginBottom: "4px" }}>
//                         <Calendar size={14} /> <span>{slot.dayOfWeek}</span>
//                         {" | "}
//                         <Clock size={14} /> <span>
//                           {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
//                         </span>
//                         <button
//                           onClick={() => handleSelectAvailability(slot)}
//                           className={`book-button ${selectedAvailability?.id === slot.id ? 'book-button-selected' : ''}`}
//                           style={{ marginLeft: "8px" }}
//                         >
//                           {selectedAvailability?.id === slot.id ? 'Selected' : 'Select Slot'}
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="pagination-controls" style={{
//                 textAlign: 'center',
//                 marginTop: '50px',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 gap: '15px'
//               }}>
//                 <button
//                   onClick={handlePrevPage}
//                   disabled={currentPage === 1}
//                   style={{
//                     padding: '8px 16px',
//                     backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
//                   }}
//                 >
//                   Previous
//                 </button>
//                 <span style={{ fontWeight: 'bold' }}>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   onClick={handleNextPage}
//                   disabled={currentPage === totalPages}
//                   style={{
//                     padding: '8px 16px',
//                     backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
//                   }}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//           {/* Booking Section */}
//           {selectedAvailability && (
//             <div className="booking-section">
//               <h2 className="section-title">
//                 Book Appointment with Dr. {selectedAvailability.doctorName}
//               </h2>
//               <div className="selected-availability-info" style={{
//                 backgroundColor: '#f8f9fa',
//                 padding: '15px',
//                 borderRadius: '8px',
//                 marginBottom: '20px'
//               }}>
//                 <p><strong>Specialty:</strong> {(selectedAvailability?.doctorSpecializations || []).join(', ')}</p>
//                 <p><strong>Available Day:</strong> {selectedAvailability.dayOfWeek}</p>
//                 <p><strong>Time Range:</strong> {formatDateTime(selectedAvailability.startTime)} - {formatDateTime(selectedAvailability.endTime)}</p>
//                 <p><strong>Appointment Duration:</strong> {selectedAvailability.appointmentDuration} minutes</p>
//               </div>
//               <div className="booking-form">
//                 <div className="date-time-container">
//                   <div className="date-container">
//                     <label className="form-label">
//                       <Calendar size={18} className="label-icon" />
//                       Select Date
//                     </label>
//                     <input
//                       type="date"
//                       className="date-input"
//                       min={new Date().toISOString().split('T')[0]}
//                       value={selectedDate}
//                       onChange={e => setSelectedDate(e.target.value)}
//                     />
//                   </div>
//                   <div className="time-container">
//                     <label className="form-label">
//                       <Clock size={18} className="label-icon" />
//                       Available Time Slots
//                     </label>
//                     {timeSlots.length === 0 && <p>No time slots available.</p>}
//                     <div className="time-slots">
//                       {timeSlots.map(time => (
//                         <button
//                           key={time}
//                           onClick={() => setSelectedTime(time)}
//                           className={`time-slot ${selectedTime === time ? 'time-slot-selected' : ''}`}
//                         >
//                           {time}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ marginBottom: '20px' }}>
//                   <label className="form-label">Insurance Coverage:</label>
//                   <div style={{ marginLeft: '10px', marginTop: '5px' }}>
//                     {eligibilityResult?.eligible ? (
//                       <div style={{
//                         padding: '8px 12px',
//                         backgroundColor: '#d4edda',
//                         border: '1px solid #c3e6cb',
//                         borderRadius: '4px',
//                         color: '#155724'
//                       }}>
//                         ✅ Covered by Insurance
//                         {eligibilityResult.coverage && ` (${eligibilityResult.coverage})`}
//                       </div>
//                     ) : (
//                       <div>
      
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div style={{ marginBottom: '20px' }}>
//                   <label className="form-label">Payment Amount: ₹{paymentAmount}</label>
//                 </div>
//                 <button
//                   onClick={handleBookAppointment}
//                   className="confirm-button"
//                   disabled={!selectedDate || !selectedTime || bookingLoading || !razorpayLoaded}
//                   style={{
//                     backgroundColor: eligibilityResult?.eligible ? '#28a745' : '#007bff'
//                   }}
//                 >
//                   {bookingLoading ? 'Booking...' : !razorpayLoaded ? 'Loading Payment Gateway...' :
//                     eligibilityResult?.eligible ? 'Book with Insurance Coverage' : 'Book Appointment '}
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//       {bookingStep === 'booking' && (
//         <div className="booking-status" style={{ textAlign: 'center', padding: '50px' }}>
//           <Clock size={50} style={{ color: '#007bff', marginBottom: '20px' }} />
//           <h2>Booking Your Appointment...</h2>
//           <p>Please wait while we confirm your appointment with Dr. {selectedAvailability?.doctorName}</p>
//         </div>
//       )}

//       {bookingStep === 'payment' && (
//         <div className="payment-section" style={{ textAlign: 'center', padding: '50px' }}>
//           <CreditCard size={50} style={{ color: '#28a745', marginBottom: '20px' }} />
//           <h2>Processing Payment</h2>
//           {paymentLoading && (
//             <div>
//               <p>Initializing payment gateway...</p>
//               <div style={{
//                 margin: '20px 0',
//                 width: '40px', height: '40px',
//                 border: '4px solid #f3f3f3', borderTop: '4px solid #007bff',
//                 borderRadius: '50%',
//                 animation: 'spin 1s linear infinite',
//                 margin: '0 auto'
//               }} />
//             </div>
//           )}
//           {!paymentLoading && !paymentError && paymentData && (
//             <div>
//               <p style={{ color: '#28a745', marginBottom: '20px' }}>
//                 ✅ Appointment booked successfully! Opening Razorpay payment gateway...
//               </p>
//               <div style={{
//                 backgroundColor: '#f8f9fa', padding: '20px',
//                 borderRadius: '8px', marginTop: '20px',
//                 maxWidth: '500px', margin: '20px auto'
//               }}>
//                 <p><strong>Order ID:</strong> {paymentData.razorpayOrderId || paymentData.orderId || 'Not found'}</p>
//                 <p><strong>Amount:</strong> ₹{paymentAmount}</p>
//                 <p><strong>Status:</strong> {paymentData.status || 'PENDING'}</p>
//                 <p><strong>Doctor:</strong> Dr. {selectedAvailability?.doctorName}</p>
//                 <p><strong>Date &amp; Time:</strong> {selectedDate} at {selectedTime}</p>
//               </div>
//               <div style={{
//                 marginTop: '20px', padding: '15px', backgroundColor: '#d1ecf1',
//                 borderRadius: '4px', border: '1px solid #bee5eb'
//               }}>
//                 <p style={{ color: '#0c5460', margin: '0' }}>
//                   <strong>💡 Payment Window:</strong> The Razorpay payment window should have opened automatically.<br />
//                   If it didn't open, please check if popups are blocked in your browser.
//                 </p>
//               </div>
//               <button
//                 onClick={() => initiatePayment(bookedAppointment?.id || bookedAppointment?.appointmentId)}
//                 style={{
//                   padding: '10px 20px',
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                   marginTop: '15px'
//                 }}
//               >
//                 Retry Payment
//               </button>
//             </div>
//           )}
//           {paymentError && (
//             <div style={{
//               backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px',
//               marginTop: '20px', maxWidth: '500px', margin: '20px auto'
//             }}>
//               <AlertCircle size={24} style={{ color: '#721c24', marginBottom: '10px' }} />
//               <p style={{ color: '#721c24', marginBottom: '15px' }}>
//                 <strong>Payment Error:</strong> {paymentError}
//               </p>
//               <div style={{ textAlign: 'left', fontSize: '14px', color: '#721c24' }}>
//                 <p><strong>Common Solutions:</strong></p>
//                 <ul style={{ paddingLeft: '20px' }}>
//                   <li>Check if popups are enabled for this site</li>
//                   <li>Ensure you have a stable internet connection</li>
//                   <li>Try using a different browser or incognito mode</li>
//                   <li>Verify your Razorpay key is correct and active</li>
//                   <li>Check browser console for detailed error messages</li>
//                 </ul>
//               </div>
//               <div style={{ marginTop: '15px' }}>
//                 <button
//                   onClick={() => initiatePayment(bookedAppointment?.id || bookedAppointment?.appointmentId)}
//                   style={{
//                     padding: '8px 16px',
//                     backgroundColor: '#dc3545',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     marginRight: '10px'
//                   }}
//                 >
//                   Retry Payment
//                 </button>
//                 <button
//                   onClick={resetBooking}
//                   style={{
//                     padding: '8px 16px',
//                     backgroundColor: '#6c757d',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   Start Over
//                 </button>
//               </div>
//             </div>
//           )}
//           <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
//             <details>
//               <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>🔧 Debug Information (Click to expand)</summary>
//               <div style={{ marginTop: '10px', textAlign: 'left', backgroundColor: '#f1f1f1', padding: '15px', borderRadius: '4px' }}>
//                 <p><strong>Razorpay Status:</strong> {razorpayLoaded ? 'Loaded ✅' : 'Not Loaded ❌'}</p>
//                 <p><strong>Razorpay Key:</strong> {RAZORPAY_KEY_ID}</p>
//                 <p><strong>Payment Data:</strong></p>
//                 <pre style={{ fontSize: '10px', overflow: 'auto' }}>
//                   {JSON.stringify(paymentData, null, 2)}
//                 </pre>
//                 <p><strong>Appointment Data:</strong></p>
//                 <pre style={{ fontSize: '10px', overflow: 'auto' }}>
//                   {JSON.stringify(bookedAppointment, null, 2)}
//                 </pre>
//               </div>
//             </details>
//           </div>
//         </div>
//       )}

//       {bookingStep === 'confirmation' && (
//         <div className="confirmation-section" style={{ textAlign: 'center', padding: '50px' }}>
//           <CheckCircle size={50} style={{ color: '#28a745', marginBottom: '20px' }} />
//           <h2>Appointment Confirmed!</h2>
//           <div style={{
//             backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px',
//             marginTop: '20px', maxWidth: '500px', margin: '20px auto'
//           }}>
//             <p><strong>Doctor:</strong> Dr. {selectedAvailability?.doctorName}</p>
//             <p><strong>Date:</strong> {selectedDate}</p>
//             <p><strong>Time:</strong> {selectedTime}</p>
//             <p><strong>Duration:</strong> {selectedAvailability?.appointmentDuration} minutes</p>
//             <p><strong>Payment:</strong> ₹{paymentAmount} - Paid ✅</p>
//             {bookedAppointment && (
//               <>
//                 <p><strong>Appointment ID:</strong> {bookedAppointment.id || bookedAppointment.appointmentId}</p>
//                 <p><strong>Status:</strong> {bookedAppointment.status}</p>
//               </>
//             )}
//           </div>
//           <p style={{ margin: '20px 0', color: '#28a745' }}>
//             📧 A confirmation email has been sent with appointment details.
//           </p>
//           <button
//             onClick={resetBooking}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               marginTop: '20px'
//             }}
//           >
//             Book Another Appointment
//           </button>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BookAppointment;

import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import './appointment.css';
import InsuranceEligibilityChecker from './InsuranceEligibilityChecker';

const AVAILABILITIES_API = 'http://localhost:9090/api/doctors/availabilities';
const AVAILABILITIES_BY_DAY_API = 'http://localhost:9090/api/doctors/availabilities/day/';
const BOOK_APPOINTMENT_API = 'http://localhost:9090/api/appointments/book';
const INITIATE_PAYMENT_API = 'http://localhost:9090/api/payments/initiate';
const VERIFY_PAYMENT_API = 'http://localhost:9090/api/payments/verify';

const AVAILABILITIES_PER_PAGE = 3;
const RAZORPAY_KEY_ID = 'rzp_test_LqWBBDbgwot5lh';

function groupByDoctor(availabilities) {
  const map = new Map();
  for (const slot of availabilities) {
    slot.doctorSpecializations = slot.doctorSpecializations || [];
    if (!map.has(slot.doctorId)) {
      map.set(slot.doctorId, {
        doctorId: slot.doctorId,
        doctorName: slot.doctorName,
        doctorEmail: slot.doctorEmail,
        doctorSpecializations: slot.doctorSpecializations,
        slots: [],
      });
    }
    map.get(slot.doctorId).slots.push(slot);
  }
  return Array.from(map.values());
}

// ------------- PAST TIME SLOT CHECK FUNCTION -------------
function isTimeBeforeNow(time12h, dateString) {
  // If not today, always return false (meaning don't disable)
  const todayISO = new Date().toISOString().split('T')[0];
  if (dateString !== todayISO) return false;

  // Parse time (12-hour to 24-hour)
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  minutes = parseInt(minutes, 10);

  // Slot time with today's date
  const now = new Date();
  const slotDate = new Date();
  slotDate.setHours(hours, minutes, 0, 0);

  return slotDate.getTime() <= now.getTime();
}
// ---------------------------------------------------------

const BookAppointment = ({ userId, onNavigate }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [filteredAvailabilities, setFilteredAvailabilities] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeSlots, setTimeSlots] = useState([]);

  const [bookingStep, setBookingStep] = useState('selection');
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [insuranceCoverage, setInsuranceCoverage] = useState('COVERED');
  const [paymentAmount, setPaymentAmount] = useState(500.00);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [selectedDoctorForEligibility, setSelectedDoctorForEligibility] = useState(null);
  const [insurancePlanId, setInsurancePlanId] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [patientId, setPatientId] = useState(null);

  // Get patientId and store in state/localStorage
  useEffect(() => {
    async function getPatientIdByUserId(userId) {
      if (!userId) return null;
      try {
        const response = await fetch(`http://localhost:9090/api/patients/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch patient data');
        const patientData = await response.json();
        const patientId = patientData.id || patientData._id;
        setPatientId(patientId);
        localStorage.setItem('patientId', patientId);
        return patientId;
      } catch {
        setPatientId(null);
        return null;
      }
    }
    getPatientIdByUserId(userId);
  }, [userId]);

  useEffect(() => { loadRazorpayScript(); }, []);
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof window.Razorpay !== 'undefined') {
        setRazorpayLoaded(true);
        resolve(true); return;
      }
      const existingScript = document.getElementById('razorpay-script');
      if (existingScript) {
        existingScript.onload = () => { setRazorpayLoaded(true); resolve(true); };
        existingScript.onerror = () => { setRazorpayLoaded(false); reject(false); };
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => { setRazorpayLoaded(true); resolve(true); };
      script.onerror = (error) => { setRazorpayLoaded(false); reject(false); };
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = () => {
    setLoading(true);
    fetch(AVAILABILITIES_API)
      .then(res => res.json())
      .then(data => {
        const grouped = groupByDoctor(data);
        setAvailabilities(grouped);
        setFilteredAvailabilities(grouped);
        setCurrentPage(1);
      })
      .catch(() => {
        setAvailabilities([]); setFilteredAvailabilities([]);
      })
      .finally(() => { setLoading(false); });
  };

  const fetchAvailabilitiesByDay = (dayOfWeek) => {
    if (!dayOfWeek) { fetchAvailabilities(); return; }
    setLoading(true);
    fetch(`${AVAILABILITIES_BY_DAY_API}${dayOfWeek}`)
      .then(res => res.json())
      .then(data => {
        const grouped = groupByDoctor(data);
        setAvailabilities(grouped);
        setFilteredAvailabilities(grouped);
        setCurrentPage(1);
      })
      .catch(() => {
        setAvailabilities([]); setFilteredAvailabilities([]);
      })
      .finally(() => { setLoading(false); });
  };

  const handleDayFilterChange = (day) => {
    setSelectedDayFilter(day);
    fetchAvailabilitiesByDay(day);
  };

  useEffect(() => {
    const filtered = availabilities.filter((doctor) => {
      const doctorName = doctor.doctorName?.toLowerCase() || '';
      const specializations = (doctor.doctorSpecializations || []).map(s => s.toLowerCase());
      const query = searchQuery.toLowerCase();
      return (
        doctorName.includes(query) ||
        specializations.some(s => s.includes(query))
      );
    });
    setFilteredAvailabilities(filtered);
    setCurrentPage(1);
  }, [searchQuery, availabilities]);

  const totalPages = Math.ceil(filteredAvailabilities.length / AVAILABILITIES_PER_PAGE);
  const startIndex = (currentPage - 1) * AVAILABILITIES_PER_PAGE;
  const currentAvailabilities = filteredAvailabilities.slice(startIndex, startIndex + AVAILABILITIES_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSelectAvailability = (slot) => {
    setSelectedAvailability(slot);
    setSelectedDate('');
    setSelectedTime('');
    setTimeSlots(generateTimeSlots(slot));
    // NEW: Set selected doctor for eligibility check
    const doctorForEligibility = {
      doctorId: slot.doctorId,
      doctorName: slot.doctorName,
      doctorEmail: slot.doctorEmail,
      doctorSpecializations: slot.doctorSpecializations || []
    };
    setSelectedDoctorForEligibility(doctorForEligibility);
    setEligibilityResult(null);
    setInsurancePlanId('');
  };
  const handleEligibilityResult = (result) => {
    setEligibilityResult(result);
    if (result && result.eligible) {
      setInsuranceCoverage('COVERED');
      setInsurancePlanId(result.insurancePlanId);
      if (result.copay) {
        setPaymentAmount(parseFloat(result.copay));
      }
    } else {
      setInsuranceCoverage('NOT_COVERED');
      setInsurancePlanId('');
      setPaymentAmount(500.00); // Default amount
    }
  };

  const generateTimeSlots = (availability) => {
    const start = new Date(availability.startTime);
    const end = new Date(availability.endTime);
    const duration = availability.appointmentDuration;
    const slots = [];
    let current = new Date(start);
    while (current < end) {
      slots.push(formatTime12Hour(current));
      current = new Date(current.getTime() + duration * 60000);
    }
    return slots;
  };
  const formatTime12Hour = (date) => {
    let h = date.getHours();
    let m = date.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m} ${ampm}`;
  };
  const convertTo24Hour = (time12h, date) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') { hours = '00'; }
    if (modifier === 'PM') { hours = parseInt(hours, 10) + 12; }
    return `${date}T${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleBookAppointment = async () => {
    if (!selectedAvailability || !selectedDate || !selectedTime) {
      alert('Please select doctor availability, date, and time');
      return;
    }
    if (insuranceCoverage === 'COVERED' && !eligibilityResult?.eligible) {
      alert('Please verify your insurance eligibility first before booking with coverage');
      return;
    }
    setBookingLoading(true);
    setBookingStep('booking');
    setPaymentError(null);
    try {
      const scheduledAt = convertTo24Hour(selectedTime, selectedDate);
      const bookingData = {
        patientId: patientId || localStorage.getItem('patientId'),
        doctorId: selectedAvailability.doctorId,
        scheduledAt: scheduledAt,
        insuranceCoverageStatus: insuranceCoverage,
        videoSessionId: `video_session_${Date.now()}`,
        insurancePlanId: insurancePlanId || null
      };
      const response = await fetch(BOOK_APPOINTMENT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (response.ok) {
        const appointmentData = await response.json();
        setBookedAppointment(appointmentData);
        if (appointmentData.status === 'BOOKED') {
          setBookingStep('payment');
          await initiatePayment(appointmentData.id || appointmentData.appointmentId);
        } else {
          alert('Appointment booking failed. Status: ' + appointmentData.status);
          setBookingStep('selection');
        }
      } else {
        const errorData = await response.json();
        alert('Booking failed: ' + (errorData.message || 'Unknown error'));
        setBookingStep('selection');
      }
    } catch (error) {
      alert('Booking failed: ' + error.message);
      setBookingStep('selection');
    } finally {
      setBookingLoading(false);
    }
  };

  const initiatePayment = async (appointmentId) => {
    setPaymentLoading(true); setPaymentError(null);
    try {
      if (!razorpayLoaded) {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) throw new Error('Failed to load Razorpay SDK');
      }
      const paymentRequest = {
        appointmentId: appointmentId,
        patientId: patientId || localStorage.getItem('patientId'),
        amount: paymentAmount, currency: "INR"
      };
      const response = await fetch(INITIATE_PAYMENT_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequest)
      });
      const paymentData = await response.json();
      if (response.ok && paymentData.razorpayOrderId) {
        setPaymentData(paymentData);
        if (typeof window.Razorpay === 'undefined') throw new Error('Razorpay SDK not loaded properly');
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: Math.round(paymentAmount * 100), currency: 'INR',
          name: 'Healthcare Appointments',
          description: `Appointment with Dr. ${selectedAvailability.doctorName}`,
          order_id: paymentData.razorpayOrderId,
          handler: async function (response) {
            setPaymentLoading(true);
            await verifyPayment(response);
          },
          prefill: { name: 'Patient Name', email: 'patient@email.com', contact: '9999999999' },
          theme: { color: '#007bff' },
          modal: {
            ondismiss: function () {
              setPaymentLoading(false);
              setPaymentError('Payment was cancelled by user');
            },
            escape: true,
            backdrop_close: false
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setPaymentError(`Payment failed: ${response.error.description || response.error.reason || 'Unknown error'}`);
          setPaymentLoading(false);
        });
        rzp.open();
      } else {
        const errorMessage = paymentData.message || paymentData.error || 'Failed to create payment order';
        setPaymentError(errorMessage);
        alert('Failed to initiate payment: ' + errorMessage);
        setBookingStep('selection');
      }
    } catch (error) {
      setPaymentError(error.message);
      alert('Payment initiation failed: ' + error.message);
      setBookingStep('selection');
    } finally {
      setPaymentLoading(false);
    }
  };

  const verifyPayment = async (razorpayResponse) => {
    try {
      const verificationRequest = {
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpaySignature: razorpayResponse.razorpay_signature
      };
      const response = await fetch(VERIFY_PAYMENT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationRequest)
      });
      const result = await response.json();
      if (response.ok) {
        setBookingStep('confirmation');
        if (result.appointmentId) {
          setBookedAppointment(prev => ({
            ...prev,
            status: 'CONFIRMED',
            paymentStatus: 'SUCCESS'
          }));
        }
      } else {
        setPaymentError(`Payment verification failed: ${result.message || result.error || 'Unknown error'}`);
        setBookingStep('selection');
      }
    } catch (error) {
      setPaymentError(`Payment verification failed: ${error.message}`);
      setBookingStep('selection');
    } finally {
      setPaymentLoading(false);
    }
  };

  const resetBooking = () => {
    setBookingStep('selection');
    setSelectedAvailability(null);
    setSelectedDate('');
    setSelectedTime('');
    setTimeSlots([]);
    setBookedAppointment(null);
    setPaymentData(null);
    setPaymentError(null);
    setEligibilityResult(null);
    setSelectedDoctorForEligibility(null);
    setInsurancePlanId('');
    setInsuranceCoverage('NOT_COVERED');
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'selection', label: 'Select Slot', icon: Calendar },
      { key: 'booking', label: 'Book Appointment', icon: Clock },
      { key: 'payment', label: 'Payment', icon: CreditCard },
      { key: 'confirmation', label: 'Confirmed', icon: CheckCircle }
    ];
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === bookingStep;
          const isCompleted = steps.findIndex(s => s.key === bookingStep) > index;
          return (
            <div key={step.key} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#007bff' : isCompleted ? '#28a745' : '#e9ecef',
                  color: isActive || isCompleted ? 'white' : '#6c757d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '5px'
                }}>
                  <Icon size={20} />
                </div>
                <span style={{
                  fontSize: '12px',
                  color: isActive ? '#007bff' : isCompleted ? '#28a745' : '#6c757d',
                  fontWeight: isActive ? 'bold' : 'normal'
                }}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  width: '50px',
                  height: '2px',
                  backgroundColor: isCompleted ? '#28a745' : '#e9ecef',
                  margin: '0 10px'
                }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="doctor-booking-container">
      <div className="booking-header">
        <h1 className="header-title">Book Your Appointment</h1>
        <p className="header-subtitle">Find and book appointments with available doctors in Bengaluru</p>
      </div>
      {renderStepIndicator()}
      <div>
        <InsuranceEligibilityChecker
          patientId={patientId}
          selectedDoctor={selectedDoctorForEligibility}
          onEligibilityResult={handleEligibilityResult}
          disabled={bookingStep !== 'selection'}
        />
      </div>
      {bookingStep === 'selection' && (
        <>
          {/* Search and Filter Section */}
          <div className="search-section">
            <h2 className="section-title">Search Available Doctor Slots</h2>
            <div className="search-container">
              <div className="search-input-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search by doctor name or specialty"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>
          {/* Availabilities Grid: grouped by doctor */}
          <div className="availabilities-section">
            <h2 className="section-title">Available Doctor Slots</h2>
            {loading && <p>Loading available slots...</p>}
            {!loading && filteredAvailabilities.length === 0 && (
              <p>No available slots found. Try adjusting your search or day filter.</p>
            )}
            <div className="availabilities-grid">
              {!loading && currentAvailabilities.map(doctor => (
                <div key={doctor.doctorId} className="availability-card">
                  <div className="doctor-info">
                    <div className="doctor-avatar">
                      <User size={40} />
                    </div>
                    <div className="doctor-details">
                      <h3 className="doctor-name">Dr. {doctor.doctorName}</h3>
                      <p className="doctor-specialty">
                        {(doctor.doctorSpecializations || []).join(', ')}
                      </p>
                      <p className="doctor-email">{doctor.doctorEmail}</p>
                    </div>
                  </div>
                  <div className="availability-info">
                    {doctor.slots.filter(slot => slot.available).map(slot => (
                      <div key={slot.id} style={{ marginBottom: "4px" }}>
                        <Calendar size={14} /> <span>{slot.dayOfWeek}</span>
                        {" | "}
                        <Clock size={14} /> <span>
                          {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                        </span>
                        <button
                          onClick={() => handleSelectAvailability(slot)}
                          className={`book-button ${selectedAvailability?.id === slot.id ? 'book-button-selected' : ''}`}
                          style={{ marginLeft: "8px" }}
                        >
                          {selectedAvailability?.id === slot.id ? 'Selected' : 'Select Slot'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-controls" style={{
                textAlign: 'center',
                marginTop: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px'
              }}>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                <span style={{ fontWeight: 'bold' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          {/* Booking Section */}
          {selectedAvailability && (
            <div className="booking-section">
              <h2 className="section-title">
                Book Appointment with Dr. {selectedAvailability.doctorName}
              </h2>
              <div className="selected-availability-info" style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p><strong>Specialty:</strong> {(selectedAvailability?.doctorSpecializations || []).join(', ')}</p>
                <p><strong>Available Day:</strong> {selectedAvailability.dayOfWeek}</p>
                <p><strong>Time Range:</strong> {formatDateTime(selectedAvailability.startTime)} - {formatDateTime(selectedAvailability.endTime)}</p>
                <p><strong>Appointment Duration:</strong> {selectedAvailability.appointmentDuration} minutes</p>
              </div>
              <div className="booking-form">
                <div className="date-time-container">
                  <div className="date-container">
                    <label className="form-label">
                      <Calendar size={18} className="label-icon" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      className="date-input"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="time-container">
                    <label className="form-label">
                      <Clock size={18} className="label-icon" />
                      Available Time Slots
                    </label>
                    {timeSlots.length === 0 && <p>No time slots available.</p>}
                    <div className="time-slots">
                      {/* Map over times -- disable slots in the past for today! */}
                      {timeSlots.map(time => {
                        const isPast = isTimeBeforeNow(time, selectedDate);
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            disabled={isPast}
                            className={`time-slot ${selectedTime === time ? 'time-slot-selected' : ''}`}
                            style={isPast ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                          >
                            {time} {isPast && <span style={{color:'#d11'}}> (Past)</span>}
                          </button>
                        );
                        // To HIDE past slots instead, use:
                        // if (isPast) return null;
                        // return (<button {...}>{time}</button>);
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Insurance Coverage:</label>
                  <div style={{ marginLeft: '10px', marginTop: '5px' }}>
                    {eligibilityResult?.eligible ? (
                      <div style={{
                        padding: '8px 12px',
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                        borderRadius: '4px',
                        color: '#155724'
                      }}>
                        ✅ Covered by Insurance
                        {eligibilityResult.coverage && ` (${eligibilityResult.coverage})`}
                      </div>
                    ) : (
                      <div>
                        {/* Not covered - no message */}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Payment Amount: ₹{paymentAmount}</label>
                </div>
                <button
                  onClick={handleBookAppointment}
                  className="confirm-button"
                  disabled={!selectedDate || !selectedTime || bookingLoading || !razorpayLoaded}
                  style={{
                    backgroundColor: eligibilityResult?.eligible ? '#28a745' : '#007bff'
                  }}
                >
                  {bookingLoading ? 'Booking...' : !razorpayLoaded ? 'Loading Payment Gateway...' :
                    eligibilityResult?.eligible ? 'Book with Insurance Coverage' : 'Book Appointment '}
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {bookingStep === 'booking' && (
        <div className="booking-status" style={{ textAlign: 'center', padding: '50px' }}>
          <Clock size={50} style={{ color: '#007bff', marginBottom: '20px' }} />
          <h2>Booking Your Appointment...</h2>
          <p>Please wait while we confirm your appointment with Dr. {selectedAvailability?.doctorName}</p>
        </div>
      )}
      {bookingStep === 'payment' && (
        <div className="payment-section" style={{ textAlign: 'center', padding: '50px' }}>
          <CreditCard size={50} style={{ color: '#28a745', marginBottom: '20px' }} />
          <h2>Processing Payment</h2>
          {paymentLoading && (
            <div>
              <p>Initializing payment gateway...</p>
              <div style={{
                margin: '20px 0',
                width: '40px', height: '40px',
                border: '4px solid #f3f3f3', borderTop: '4px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }} />
            </div>
          )}
          {!paymentLoading && !paymentError && paymentData && (
            <div>
              <p style={{ color: '#28a745', marginBottom: '20px' }}>
                ✅ Appointment booked successfully! Opening Razorpay payment gateway...
              </p>
              <div style={{
                backgroundColor: '#f8f9fa', padding: '20px',
                borderRadius: '8px', marginTop: '20px',
                maxWidth: '500px', margin: '20px auto'
              }}>
                <p><strong>Order ID:</strong> {paymentData.razorpayOrderId || paymentData.orderId || 'Not found'}</p>
                <p><strong>Amount:</strong> ₹{paymentAmount}</p>
                <p><strong>Status:</strong> {paymentData.status || 'PENDING'}</p>
                <p><strong>Doctor:</strong> Dr. {selectedAvailability?.doctorName}</p>
                <p><strong>Date &amp; Time:</strong> {selectedDate} at {selectedTime}</p>
              </div>
              <div style={{
                marginTop: '20px', padding: '15px', backgroundColor: '#d1ecf1',
                borderRadius: '4px', border: '1px solid #bee5eb'
              }}>
                <p style={{ color: '#0c5460', margin: '0' }}>
                  <strong>💡 Payment Window:</strong> The Razorpay payment window should have opened automatically.<br />
                  If it didn't open, please check if popups are blocked in your browser.
                </p>
              </div>
              <button
                onClick={() => initiatePayment(bookedAppointment?.id || bookedAppointment?.appointmentId)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '15px'
                }}
              >
                Retry Payment
              </button>
            </div>
          )}
          {paymentError && (
            <div style={{
              backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px',
              marginTop: '20px', maxWidth: '500px', margin: '20px auto'
            }}>
              <AlertCircle size={24} style={{ color: '#721c24', marginBottom: '10px' }} />
              <p style={{ color: '#721c24', marginBottom: '15px' }}>
                <strong>Payment Error:</strong> {paymentError}
              </p>
              <div style={{ textAlign: 'left', fontSize: '14px', color: '#721c24' }}>
                <p><strong>Common Solutions:</strong></p>
                <ul style={{ paddingLeft: '20px' }}>
                  <li>Check if popups are enabled for this site</li>
                  <li>Ensure you have a stable internet connection</li>
                  <li>Try using a different browser or incognito mode</li>
                  <li>Verify your Razorpay key is correct and active</li>
                  <li>Check browser console for detailed error messages</li>
                </ul>
              </div>
              <div style={{ marginTop: '15px' }}>
                <button
                  onClick={() => initiatePayment(bookedAppointment?.id || bookedAppointment?.appointmentId)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Retry Payment
                </button>
                <button
                  onClick={resetBooking}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
          <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>🔧 Debug Information (Click to expand)</summary>
              <div style={{ marginTop: '10px', textAlign: 'left', backgroundColor: '#f1f1f1', padding: '15px', borderRadius: '4px' }}>
                <p><strong>Razorpay Status:</strong> {razorpayLoaded ? 'Loaded ✅' : 'Not Loaded ❌'}</p>
                <p><strong>Razorpay Key:</strong> {RAZORPAY_KEY_ID}</p>
                <p><strong>Payment Data:</strong></p>
                <pre style={{ fontSize: '10px', overflow: 'auto' }}>
                  {JSON.stringify(paymentData, null, 2)}
                </pre>
                <p><strong>Appointment Data:</strong></p>
                <pre style={{ fontSize: '10px', overflow: 'auto' }}>
                  {JSON.stringify(bookedAppointment, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      )}
      {bookingStep === 'confirmation' && (
        <div className="confirmation-section" style={{ textAlign: 'center', padding: '50px' }}>
          <CheckCircle size={50} style={{ color: '#28a745', marginBottom: '20px' }} />
          <h2>Appointment Confirmed!</h2>
          <div style={{
            backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px',
            marginTop: '20px', maxWidth: '500px', margin: '20px auto'
          }}>
            <p><strong>Doctor:</strong> Dr. {selectedAvailability?.doctorName}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Duration:</strong> {selectedAvailability?.appointmentDuration} minutes</p>
            <p><strong>Payment:</strong> ₹{paymentAmount} - Paid ✅</p>
            {bookedAppointment && (
              <>
                <p><strong>Appointment ID:</strong> {bookedAppointment.id || bookedAppointment.appointmentId}</p>
                <p><strong>Status:</strong> {bookedAppointment.status}</p>
              </>
            )}
          </div>
          <p style={{ margin: '20px 0', color: '#28a745' }}>
            📧 A confirmation email has been sent with appointment details.
          </p>
          <button
            onClick={resetBooking}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Book Another Appointment
          </button>
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BookAppointment;
