
// import React, { useState } from "react";
// import axios from "axios";
// import './zoom.css'; // Assume the CSS included previously or your own styling

// export default function DoctorZoomMeeting() {
//   const [joinUrl, setJoinUrl] = useState("");
//   const [topic, setTopic] = useState("Doctor Consultation");

//   // Call backend API to create Zoom meeting
//   const scheduleMeeting = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:8081/api/zoom/meeting",
//         { topic, type: 1 }, // type 1 for instant meeting
//         { headers: { "Content-Type": "application/json" } }
//       );
//       const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
//       setJoinUrl(data.join_url);
//     } catch (err) {
//       console.error("Error creating meeting:", err);
//     }
//   };

//   // Reset form to create another meeting
//   const handleClear = () => {
//     setTopic("Doctor Consultation");
//     setJoinUrl("");
//   };

//   return (
//     <div className="zoom-outer-box">
//       <h1 className="zoom-title">Join Your Virtual Doctor Appointment</h1>
//       <h4 className="zoom-subtitle">
//         Enter your appointment details and click "Join Meet" to connect with your doctor instantly.
//       </h4>
//       <div className="zoom-meeting-content">
//         {!joinUrl ? (
//           <div className="zoom-form-row">
//             <div className="zoom-form-field">
//               <label className="zoom-label" htmlFor="topic-input">Appointment Topic</label>
//               <input
//                 id="topic-input"
//                 type="text"
//                 className="zoom-input"
//                 value={topic}
//                 onChange={(e) => setTopic(e.target.value)}
//                 placeholder="Enter appointment topic"
//               />
//             </div>
//             <button className="zoom-action-btn" onClick={scheduleMeeting}>
//               Join Meet
//             </button>
//           </div>
//         ) : (
//           <div className="zoom-meeting-ready">
//             <p className="zoom-success-msg">Your appointment is ready!</p>
//             <a
//               className="zoom-join-link"
//               href={joinUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Click here to join your doctor
//             </a>
//             <button className="zoom-clear-btn" onClick={handleClear}>
//               Schedule Another Appointment
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Shield, CheckCircle, XCircle, User, CreditCard } from 'lucide-react';
// import './zoom.css';

// const ZoomMeetingComponent = () => {
//   // Mock data - replace with your actual data source
//   const [appointmentData, setAppointmentData] = useState({
//     appointmentId: 'APT123',
//     patientId: 'PAT456',
//     doctorId: 'DOC789',
//     appointmentStatus: 'confirmed', // confirmed, pending, cancelled
//     paymentStatus: 'completed', // completed, pending, failed
//     scheduledTime: '2024-08-03T14:30:00Z',
//     doctorSchedule: {
//       isAvailable: true,
//       bookedSlots: ['2024-08-03T14:30:00Z']
//     },
//     meetingUrl: 'https://zoom.us/j/1234567890',
//     userRole: 'patient' // patient, doctor
//   });

//   const [accessGranted, setAccessGranted] = useState(false);
//   const [accessMessage, setAccessMessage] = useState('');
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     checkAccess();
//   }, [appointmentData, currentTime]);

//   const checkAccess = () => {
//     const { 
//       appointmentStatus, 
//       paymentStatus, 
//       scheduledTime, 
//       doctorSchedule, 
//       userRole 
//     } = appointmentData;

//     const scheduledDateTime = new Date(scheduledTime);
//     const timeDiff = scheduledDateTime.getTime() - currentTime.getTime();
//     const minutesUntilMeeting = Math.floor(timeDiff / (1000 * 60));

//     // Check basic requirements
//     if (appointmentStatus !== 'confirmed') {
//       setAccessGranted(false);
//       setAccessMessage('Appointment must be confirmed to join the meeting.');
//       return;
//     }

//     if (paymentStatus !== 'completed') {
//       setAccessGranted(false);
//       setAccessMessage('Payment must be completed before joining the meeting.');
//       return;
//     }

//     // Role-specific checks
//     if (userRole === 'patient') {
//       // Patient can join 15 minutes before scheduled time
//       if (minutesUntilMeeting > 15) {
//         setAccessGranted(false);
//         setAccessMessage(`Meeting will be available 15 minutes before scheduled time. Please wait ${minutesUntilMeeting - 15} more minutes.`);
//         return;
//       }
      
//       // Meeting expires 1 hour after scheduled time
//       if (minutesUntilMeeting < -60) {
//         setAccessGranted(false);
//         setAccessMessage('This meeting has expired.');
//         return;
//       }
//     }

//     if (userRole === 'doctor') {
//       // Check if doctor is scheduled for this slot
//       if (!doctorSchedule.bookedSlots.includes(scheduledTime)) {
//         setAccessGranted(false);
//         setAccessMessage('You are not scheduled for this appointment slot.');
//         return;
//       }

//       if (!doctorSchedule.isAvailable) {
//         setAccessGranted(false);
//         setAccessMessage('You are currently marked as unavailable.');
//         return;
//       }

//       // Doctor can join 30 minutes before scheduled time
//       if (minutesUntilMeeting > 30) {
//         setAccessGranted(false);
//         setAccessMessage(`You can join 30 minutes before the scheduled time. Please wait ${minutesUntilMeeting - 30} more minutes.`);
//         return;
//       }
//     }

//     // All checks passed
//     setAccessGranted(true);
//     setAccessMessage('You can now join the meeting.');
//   };

//   const joinMeeting = () => {
//     if (accessGranted) {
//       // Replace with your actual Zoom SDK integration
//       window.open(appointmentData.meetingUrl, '_blank');
//       // Or integrate with Zoom Web SDK
//       console.log('Joining Zoom meeting...');
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'confirmed':
//       case 'completed':
//         return <CheckCircle className="icon status-confirmed" />;
//       case 'pending':
//         return <Clock className="icon status-pending" />;
//       case 'cancelled':
//       case 'failed':
//         return <XCircle className="icon status-cancelled" />;
//       default:
//         return <Clock className="icon icon-gray" />;
//     }
//   };

//   const formatTime = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   return (
//     <div className="zoom-meeting-container">
//       <div className="zoom-meeting-header">
//         <h2 className="zoom-meeting-title">Virtual Consultation</h2>
//         <p className="appointment-id">Appointment ID: {appointmentData.appointmentId}</p>
//       </div>

//       {/* Appointment Status */}
//       <div className="status-section">
//         <div className="status-item">
//           <div className="status-label">
//             <Calendar className="icon icon-blue" />
//             <span className="status-label-text">Appointment Status</span>
//           </div>
//           <div className="status-value">
//             {getStatusIcon(appointmentData.appointmentStatus)}
//             <span className="status-text">{appointmentData.appointmentStatus}</span>
//           </div>
//         </div>

//         <div className="status-item">
//           <div className="status-label">
//             <CreditCard className="icon icon-green" />
//             <span className="status-label-text">Payment Status</span>
//           </div>
//           <div className="status-value">
//             {getStatusIcon(appointmentData.paymentStatus)}
//             <span className="status-text">{appointmentData.paymentStatus}</span>
//           </div>
//         </div>

//         <div className="status-item">
//           <div className="status-label">
//             <Clock className="icon icon-purple" />
//             <span className="status-label-text">Scheduled Time</span>
//           </div>
//           <span className="scheduled-time">{formatTime(appointmentData.scheduledTime)}</span>
//         </div>

//         <div className="status-item">
//           <div className="status-label">
//             <User className="icon icon-indigo" />
//             <span className="status-label-text">Role</span>
//           </div>
//           <span className="status-text">{appointmentData.userRole}</span>
//         </div>
//       </div>

//       {/* Access Control Message */}
//       <div className={`access-message ${accessGranted ? 'access-granted' : 'access-denied'}`}>
//         <div className="access-message-content">
//           <Shield className={`icon ${accessGranted ? 'access-message-icon-granted' : 'access-message-icon-denied'}`} />
//           <p className={`access-message-text ${accessGranted ? 'access-message-granted' : 'access-message-denied'}`}>
//             {accessMessage}
//           </p>
//         </div>
//       </div>

//       {/* Join Meeting Button */}
//       <button
//         onClick={joinMeeting}
//         disabled={!accessGranted}
//         className={`join-button ${accessGranted ? 'join-button-enabled' : 'join-button-disabled'}`}
//       >
//         {accessGranted ? 'Join Meeting' : 'Access Denied'}
//       </button>

//       {/* Current Time Display */}
//       <div className="current-time">
//         Current Time: {currentTime.toLocaleString()}
//       </div>

//       {/* Demo Controls */}
//       <div className="demo-controls">
//         <p className="demo-controls-title">Demo Controls:</p>
//         <div className="demo-buttons">
//           <button
//             onClick={() => setAppointmentData(prev => ({
//               ...prev,
//               appointmentStatus: prev.appointmentStatus === 'confirmed' ? 'pending' : 'confirmed'
//             }))}
//             className="demo-button"
//           >
//             Toggle Appointment
//           </button>
//           <button
//             onClick={() => setAppointmentData(prev => ({
//               ...prev,
//               paymentStatus: prev.paymentStatus === 'completed' ? 'pending' : 'completed'
//             }))}
//             className="demo-button"
//           >
//             Toggle Payment
//           </button>
//           <button
//             onClick={() => setAppointmentData(prev => ({
//               ...prev,
//               userRole: prev.userRole === 'patient' ? 'doctor' : 'patient'
//             }))}
//             className="demo-button"
//           >
//             Switch Role
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ZoomMeetingComponent;

// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Shield, CheckCircle, XCircle, User, CreditCard, RefreshCw } from 'lucide-react';
// import './zoom.css';

// const ZoomMeetingComponent = () => {
//   const [appointmentData, setAppointmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [accessGranted, setAccessGranted] = useState(false);
//   const [accessMessage, setAccessMessage] = useState('');
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   // Configuration - you can modify these
//   const [config, setConfig] = useState({
//     appointmentId: '688ca94f7e8d40289b6710dc', // Default appointment ID to fetch
//     userId: '68834a1b8c1b9df340ede7d7', // Current user ID
//     userRole: 'patient', // patient or doctor
//     serverUrl: 'http://localhost:9090'
//   });

//   // Update current time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Fetch appointment data when appointment ID changes
//   useEffect(() => {
//     fetchAppointmentData();
//   }, [config.appointmentId]);

//   // Check access whenever data or time changes
//   useEffect(() => {
//     if (appointmentData) {
//       checkAccess();
//     }
//   }, [appointmentData, currentTime, config.userRole]);

//   const fetchAppointmentData = async () => {
//     if (!config.appointmentId) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch(`${config.serverUrl}/api/appointments/${config.appointmentId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           // Add any authentication headers here if needed
//           // 'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error('Appointment not found. Please check the appointment ID.');
//         } else if (response.status === 500) {
//           throw new Error('Server error. Please try again later.');
//         } else {
//           throw new Error(`Failed to fetch appointment: ${response.status} ${response.statusText}`);
//         }
//       }
      
//       const appointment = await response.json();
      
//       // Transform the backend data to match our component structure
//       const transformedData = {
//         appointmentId: appointment.appointmentId,
//         patientId: appointment.patientId,
//         doctorId: appointment.doctorId,
//         appointmentStatus: mapAppointmentStatus(appointment.status),
//         paymentStatus: mapPaymentStatus(appointment.paymentStatus),
//         scheduledTime: appointment.appointmentDateTime,
//         meetingUrl: appointment.meetingUrl || generateMeetingUrl(appointment.appointmentId),
//         userRole: config.userRole,
//         doctorSchedule: {
//           isAvailable: appointment.doctorAvailable !== false,
//           bookedSlots: [appointment.appointmentDateTime]
//         },
//         // Additional fields from your backend
//         reason: appointment.reason,
//         notes: appointment.notes,
//         createdAt: appointment.createdAt,
//         updatedAt: appointment.updatedAt
//       };
      
//       setAppointmentData(transformedData);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching appointment:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Map backend status values to component expected values
//   const mapAppointmentStatus = (status) => {
//     if (!status) return 'pending';
//     const statusLower = status.toLowerCase();
//     switch (statusLower) {
//       case 'accepted':
//       case 'confirmed':
//         return 'confirmed';
//       case 'rejected':
//       case 'cancelled':
//         return 'cancelled';
//       case 'pending':
//       case 'requested':
//         return 'pending';
//       default:
//         return statusLower;
//     }
//   };

//   const mapPaymentStatus = (status) => {
//     if (!status) return 'pending';
//     const statusLower = status.toLowerCase();
//     switch (statusLower) {
//       case 'paid':
//       case 'success':
//       case 'complete':
//         return 'completed';
//       case 'failed':
//       case 'declined':
//         return 'failed';
//       case 'pending':
//       case 'processing':
//         return 'pending';
//       default:
//         return statusLower;
//     }
//   };

//   // Generate a placeholder meeting URL if none exists
//   const generateMeetingUrl = (appointmentId) => {
//     return `https://zoom.us/j/placeholder?pwd=${appointmentId}`;
//   };

//   const checkAccess = () => {
//     if (!appointmentData) return;

//     const { 
//       appointmentStatus, 
//       paymentStatus, 
//       scheduledTime, 
//       userRole,
//       doctorSchedule 
//     } = appointmentData;

//     const scheduledDateTime = new Date(scheduledTime);
//     const timeDiff = scheduledDateTime.getTime() - currentTime.getTime();
//     const minutesUntilMeeting = Math.floor(timeDiff / (1000 * 60));

//     // Check basic requirements
//     if (appointmentStatus !== 'confirmed') {
//       setAccessGranted(false);
//       setAccessMessage(`Appointment must be confirmed to join the meeting. Current status: ${appointmentStatus}`);
//       return;
//     }

//     if (paymentStatus !== 'completed') {
//       setAccessGranted(false);
//       setAccessMessage(`Payment must be completed before joining the meeting. Current status: ${paymentStatus}`);
//       return;
//     }

//     // Role-specific checks
//     if (userRole === 'patient') {
//       // Patient can join 15 minutes before scheduled time
//       if (minutesUntilMeeting > 15) {
//         setAccessGranted(false);
//         setAccessMessage(`Meeting will be available 15 minutes before scheduled time. Please wait ${minutesUntilMeeting - 15} more minute${minutesUntilMeeting - 15 !== 1 ? 's' : ''}.`);
//         return;
//       }
      
//       // Meeting expires 1 hour after scheduled time
//       if (minutesUntilMeeting < -60) {
//         setAccessGranted(false);
//         setAccessMessage('This meeting has expired. Please contact support if you need assistance.');
//         return;
//       }
//     }

//     if (userRole === 'doctor') {
//       // Check if doctor is available
//       if (doctorSchedule && !doctorSchedule.isAvailable) {
//         setAccessGranted(false);
//         setAccessMessage('You are currently marked as unavailable. Please update your availability status.');
//         return;
//       }

//       // Doctor can join 30 minutes before scheduled time
//       if (minutesUntilMeeting > 30) {
//         setAccessGranted(false);
//         setAccessMessage(`You can join 30 minutes before the scheduled time. Please wait ${minutesUntilMeeting - 30} more minute${minutesUntilMeeting - 30 !== 1 ? 's' : ''}.`);
//         return;
//       }
      
//       // Meeting expires 2 hours after scheduled time for doctors
//       if (minutesUntilMeeting < -120) {
//         setAccessGranted(false);
//         setAccessMessage('This meeting has expired.');
//         return;
//       }
//     }

//     // All checks passed
//     setAccessGranted(true);
//     if (minutesUntilMeeting > 0) {
//       setAccessMessage(`Meeting starts in ${minutesUntilMeeting} minute${minutesUntilMeeting !== 1 ? 's' : ''}. You can join now.`);
//     } else if (minutesUntilMeeting >= -5) {
//       setAccessMessage('Meeting is starting now. You can join the meeting.');
//     } else {
//       setAccessMessage('Meeting is in progress. You can join the meeting.');
//     }
//   };

//   const joinMeeting = async () => {
//     if (accessGranted && appointmentData?.meetingUrl) {
//       try {
//         // Log the meeting join attempt
//         console.log('Joining Zoom meeting:', {
//           appointmentId: appointmentData.appointmentId,
//           userRole: config.userRole,
//           userId: config.userId,
//           timestamp: new Date().toISOString()
//         });

//         // Open meeting in new tab
//         window.open(appointmentData.meetingUrl, '_blank');
        
//         // Optional: Send analytics or logging to your backend
//         // await logMeetingJoin();
//       } catch (error) {
//         console.error('Error joining meeting:', error);
//         alert('There was an error joining the meeting. Please try again or contact support.');
//       }
//     }
//   };

//   // Optional: Log meeting join to backend
//   const logMeetingJoin = async () => {
//     try {
//       await fetch(`${config.serverUrl}/api/appointments/${appointmentData.appointmentId}/join`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: config.userId,
//           userRole: config.userRole,
//           joinTime: new Date().toISOString()
//         })
//       });
//     } catch (error) {
//       console.error('Failed to log meeting join:', error);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'confirmed':
//       case 'completed':
//         return <CheckCircle className="icon status-confirmed" />;
//       case 'pending':
//         return <Clock className="icon status-pending" />;
//       case 'cancelled':
//       case 'failed':
//         return <XCircle className="icon status-cancelled" />;
//       default:
//         return <Clock className="icon icon-gray" />;
//     }
//   };

//   const formatTime = (dateString) => {
//     if (!dateString) return 'Not scheduled';
//     try {
//       return new Date(dateString).toLocaleString('en-US', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         timeZoneName: 'short'
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   const handleConfigChange = (field, value) => {
//     setConfig(prev => ({ ...prev, [field]: value }));
//   };

//   const handleRefresh = () => {
//     fetchAppointmentData();
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="loading-container">
//           <RefreshCw className="loading-spinner" />
//           <span className="loading-text">Loading appointment data...</span>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="error-container">
//           <XCircle className="error-icon" />
//           <h3 className="error-title">Error Loading Appointment</h3>
//           <p className="error-message">{error}</p>
//           <button onClick={handleRefresh} className="error-retry-btn">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // No appointment found state
//   if (!appointmentData) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="no-appointment">
//           <Calendar className="no-appointment-icon" />
//           <h3 className="no-appointment-title">No Appointment Found</h3>
//           <p className="no-appointment-message">Please check the appointment ID and try again.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="zoom-meeting-container fade-in">
//       {/* Header */}
//       <div className="zoom-meeting-header">
//         <h2 className="zoom-meeting-title">Virtual Consultation</h2>
//         <p className="appointment-id">Appointment ID: {appointmentData.appointmentId}</p>
//       </div>

//       {/* Configuration Panel */}
//       <div className="config-panel">
//         <h3 className="config-title">Configuration</h3>
//         <div className="config-grid">
//           <div className="config-field">
//             <label className="config-label">Appointment ID</label>
//             <input
//               type="text"
//               value={config.appointmentId}
//               onChange={(e) => handleConfigChange('appointmentId', e.target.value)}
//               className="config-input"
//               placeholder="Enter appointment ID"
//             />
//           </div>
//           <div className="config-field">
//             <label className="config-label">User Role</label>
//             <select
//               value={config.userRole}
//               onChange={(e) => handleConfigChange('userRole', e.target.value)}
//               className="config-select"
//             >
//               <option value="patient">Patient</option>
//               <option value="doctor">Doctor</option>
//             </select>
//           </div>
//         </div>
//         <button onClick={handleRefresh} className="config-refresh-btn">
//           Refresh Data
//         </button>
//       </div>

//       {/* Appointment Status */}
//       <div className="status-section">
//         <div className="status-item">
//           <div className="status-label">
//             <Calendar className="icon icon-blue" />
//             <span className="status-label-text">Appointment Status</span>
//           </div>
//           <div className="status-value">
//             {getStatusIcon(appointmentData.appointmentStatus)}
//             <span className="status-text">{appointmentData.appointmentStatus}</span>
//           </div>
//         </div>

//         <div className="status-item">
//           <div className="status-label">
//             <CreditCard className="icon icon-green" />
//             <span className="status-label-text">Payment Status</span>
//           </div>
//           <div className="status-value">
//             {getStatusIcon(appointmentData.paymentStatus)}
//             <span className="status-text">{appointmentData.paymentStatus}</span>
//           </div>
//         </div>

//         <div className="status-item">
//           <div className="status-label">
//             <Clock className="icon icon-purple" />
//             <span className="status-label-text">Scheduled Time</span>
//           </div>
//           <span className="scheduled-time">{formatTime(appointmentData.scheduledTime)}</span>
//         </div>

//         <div className="status-item">
//           <div className="status-label">
//             <User className="icon icon-indigo" />
//             <span className="status-label-text">Role</span>
//           </div>
//           <span className="status-text">{appointmentData.userRole}</span>
//         </div>
//       </div>

//       {/* Access Control Message */}
//       <div className={`access-message ${accessGranted ? 'access-granted' : 'access-denied'}`}>
//         <div className="access-message-content">
//           <Shield className={`icon ${accessGranted ? 'access-message-icon-granted' : 'access-message-icon-denied'}`} />
//           <p className={`access-message-text ${accessGranted ? 'access-message-granted' : 'access-message-denied'}`}>
//             {accessMessage}
//           </p>
//         </div>
//       </div>

//       {/* Join Meeting Button */}
//       <button
//         onClick={joinMeeting}
//         disabled={!accessGranted}
//         className={`join-button ${accessGranted ? 'join-button-enabled' : 'join-button-disabled'}`}
//         aria-label={accessGranted ? 'Join the virtual meeting' : 'Access denied - cannot join meeting'}
//       >
//         {accessGranted ? 'Join Meeting' : 'Access Denied'}
//       </button>

//       {/* Current Time Display */}
//       <div className="current-time">
//         Current Time: {currentTime.toLocaleString()}
//       </div>
//     </div>
//   );
// };

// export default ZoomMeetingComponent;

// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Shield, CheckCircle, XCircle, User, CreditCard, RefreshCw } from 'lucide-react';
// import './zoom.css';

// const ZoomMeetingComponent = () => {
//   const [appointmentData, setAppointmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [accessGranted, setAccessGranted] = useState(false);
//   const [accessMessage, setAccessMessage] = useState('');
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   // Configuration - you can modify these
//   const [config, setConfig] = useState({
//     appointmentId: '688ca94f7e8d40289b6710dc', // Default appointment ID to fetch
//     userId: '68834a1b8c1b9df340ede7d7', // Current user ID
//     userRole: 'patient', // patient or doctor
//     serverUrl: 'http://localhost:9090'
//   });

//   // Update current time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Fetch appointment data when appointment ID changes
//   useEffect(() => {
//     fetchAppointmentData();
//   }, [config.appointmentId]);

//   // Check access whenever data or time changes
//   useEffect(() => {
//     if (appointmentData) {
//       checkAccess();
//     }
//   }, [appointmentData, currentTime, config.userRole]);

//   const fetchAppointmentData = async () => {
//     if (!config.appointmentId) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Step 1: Check payment confirmation first using your BookingPayment endpoint
//       console.log('Step 1: Checking payment confirmation for appointment:', config.appointmentId);
//       const paymentResponse = await fetch(`${config.serverUrl}/api/booking-payments/appointment/${config.appointmentId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
      
//       let paymentData = null;
//       if (paymentResponse.ok) {
//         paymentData = await paymentResponse.json();
//         console.log('Payment data found:', paymentData);
//       } else if (paymentResponse.status !== 404) {
//         console.warn('Payment API error:', paymentResponse.status);
//       }
      
//       // Step 2: Fetch appointment details
//       console.log('Step 2: Fetching appointment details for:', config.appointmentId);
//       const appointmentResponse = await fetch(`${config.serverUrl}/api/appointments/${config.appointmentId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
      
//       if (!appointmentResponse.ok) {
//         if (appointmentResponse.status === 404) {
//           throw new Error('Appointment not found. Please check the appointment ID.');
//         } else if (appointmentResponse.status === 500) {
//           throw new Error('Server error. Please try again later.');
//         } else {
//           throw new Error(`Failed to fetch appointment: ${appointmentResponse.status} ${appointmentResponse.statusText}`);
//         }
//       }
      
//       const appointment = await appointmentResponse.json();
//       console.log('Appointment data found:', appointment);
      
//       // Extract patient and doctor IDs from MongoDB ObjectId structure
//       const patientId = extractObjectId(appointment.patient);
//       const doctorId = extractObjectId(appointment.doctor);
      
//       // Step 3: Fetch patient details if patient ID exists
//       let patientData = null;
//       if (patientId) {
//         console.log('Step 3: Fetching patient details for:', patientId);
//         try {
//           const patientResponse = await fetch(`${config.serverUrl}/api/patients/${patientId}`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             }
//           });
//           if (patientResponse.ok) {
//             patientData = await patientResponse.json();
//             console.log('Patient data found:', patientData);
//           }
//         } catch (patientErr) {
//           console.warn('Could not fetch patient details:', patientErr.message);
//         }
//       }
      
//       // Step 4: Fetch doctor details if doctor ID exists
//       let doctorData = null;
//       if (doctorId) {
//         console.log('Step 4: Fetching doctor details for:', doctorId);
//         try {
//           const doctorResponse = await fetch(`${config.serverUrl}/api/doctors/${doctorId}`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             }
//           });
//           if (doctorResponse.ok) {
//             doctorData = await doctorResponse.json();
//             console.log('Doctor data found:', doctorData);
//           }
//         } catch (doctorErr) {
//           console.warn('Could not fetch doctor details:', doctorErr.message);
//         }
//       }
      
//       // Step 5: Determine payment status from multiple sources
//       const finalPaymentStatus = determinePaymentStatus(paymentData, appointment);
      
//       // Step 6: Transform the combined data to match your MongoDB structure
//       const transformedData = {
//         appointmentId: appointment._id?.$oid || appointment._id || config.appointmentId,
//         patientId: patientId,
//         doctorId: doctorId,
//         appointmentStatus: mapAppointmentStatus(appointment.status),
//         paymentStatus: finalPaymentStatus,
//         scheduledTime: appointment.appointmentDate?.$date || appointment.appointmentDate,
//         meetingUrl: appointment.meetingUrl || generateMeetingUrl(config.appointmentId),
//         userRole: config.userRole,
        
//         // Insurance information from appointment
//         insuranceStatus: appointment.insuranceCoverageStatus,
//         coverageCheckDate: appointment.coverageCheckDate?.$date || appointment.coverageCheckDate,
        
//         // Enhanced data from all sources
//         patientInfo: patientData ? {
//           id: patientData._id?.$oid || patientData._id,
//           name: patientData.name || (patientData.firstName && patientData.lastName ? 
//                 patientData.firstName + ' ' + patientData.lastName : 'Patient'),
//           email: patientData.email,
//           phone: patientData.phone,
//           firstName: patientData.firstName,
//           lastName: patientData.lastName
//         } : null,
        
//         doctorInfo: doctorData ? {
//           id: doctorData._id?.$oid || doctorData._id,
//           name: doctorData.name || (doctorData.firstName && doctorData.lastName ? 
//                 doctorData.firstName + ' ' + doctorData.lastName : 'Doctor'),
//           email: doctorData.email,
//           phone: doctorData.phone,
//           specialization: doctorData.specialization,
//           isAvailable: doctorData.isAvailable !== false,
//           firstName: doctorData.firstName,
//           lastName: doctorData.lastName
//         } : null,
        
//         paymentInfo: paymentData ? {
//           paymentId: paymentData._id?.$oid || paymentData._id,
//           amount: paymentData.amount,
//           currency: paymentData.currency,
//           paymentMethod: paymentData.paymentMethod,
//           razorpayOrderId: paymentData.razorpayOrderId,
//           razorpayPaymentId: paymentData.razorpayPaymentId,
//           razorpaySignature: paymentData.razorpaySignature,
//           createdAt: paymentData.createdAt?.$date || paymentData.createdAt,
//           processedAt: paymentData.processedAt?.$date || paymentData.processedAt
//         } : null,
        
//         doctorSchedule: {
//           isAvailable: doctorData?.isAvailable !== false,
//           bookedSlots: [appointment.appointmentDate?.$date || appointment.appointmentDate]
//         },
        
//         // Additional appointment fields
//         createdAt: appointment.createdAt?.$date || appointment.createdAt,
//         updatedAt: appointment.updatedAt?.$date || appointment.updatedAt
//       };
      
//       console.log('Final transformed data:', transformedData);
//       setAppointmentData(transformedData);
      
//     } catch (err) {
//       setError(err.message);
//       console.error('Error in fetchAppointmentData:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to extract ObjectId from MongoDB DBRef structure
//   const extractObjectId = (dbRef) => {
//     if (!dbRef) return null;
    
//     // Handle different MongoDB ObjectId formats
//     if (dbRef.$id && dbRef.$id.$oid) {
//       return dbRef.$id.$oid;
//     } else if (dbRef.$oid) {
//       return dbRef.$oid;
//     } else if (typeof dbRef === 'string') {
//       return dbRef;
//     } else if (dbRef._id) {
//       return dbRef._id.$oid || dbRef._id;
//     }
    
//     return null;
//   };

//   // Determine payment status from multiple sources
//   const determinePaymentStatus = (paymentData, appointmentData) => {
//     // Priority 1: Dedicated payment data
//     if (paymentData && paymentData.status) {
//       return mapPaymentStatus(paymentData.status);
//     }
    
//     // Priority 2: Payment status from appointment
//     if (appointmentData.paymentStatus) {
//       return mapPaymentStatus(appointmentData.paymentStatus);
//     }
    
//     // Priority 3: Infer from payment existence
//     if (paymentData && paymentData.paymentId) {
//       return 'completed';
//     }
    
//     // Default: pending
//     return 'pending';
//   };

//   // Map backend status values to component expected values
//   const mapAppointmentStatus = (status) => {
//     if (!status) return 'pending';
//     const statusLower = status.toLowerCase();
//     switch (statusLower) {
//       case 'accepted':
//       case 'confirmed':
//         return 'confirmed';
//       case 'rejected':
//       case 'cancelled':
//         return 'cancelled';
//       case 'pending':
//       case 'requested':
//         return 'pending';
//       default:
//         return statusLower;
//     }
//   };

//   const mapPaymentStatus = (status) => {
//     if (!status) return 'pending';
//     const statusLower = status.toLowerCase();
//     switch (statusLower) {
//       case 'paid':
//       case 'success':
//       case 'complete':
//         return 'completed';
//       case 'failed':
//       case 'declined':
//         return 'failed';
//       case 'pending':
//       case 'processing':
//         return 'pending';
//       default:
//         return statusLower;
//     }
//   };

//   // Generate a placeholder meeting URL if none exists
//   const generateMeetingUrl = (appointmentId) => {
//     return `https://zoom.us/j/placeholder?pwd=${appointmentId}`;
//   };

//   const checkAccess = () => {
//     if (!appointmentData) return;

//     const { 
//       appointmentStatus, 
//       paymentStatus, 
//       scheduledTime, 
//       userRole,
//       doctorSchedule 
//     } = appointmentData;

//     const scheduledDateTime = new Date(scheduledTime);
//     const timeDiff = scheduledDateTime.getTime() - currentTime.getTime();
//     const minutesUntilMeeting = Math.floor(timeDiff / (1000 * 60));

//     // Check basic requirements
//     if (appointmentStatus !== 'confirmed') {
//       setAccessGranted(false);
//       setAccessMessage(`Appointment must be confirmed to join the meeting. Current status: ${appointmentStatus}`);
//       return;
//     }

//     if (paymentStatus !== 'completed') {
//       setAccessGranted(false);
//       setAccessMessage(`Payment must be completed before joining the meeting. Current status: ${paymentStatus}`);
//       return;
//     }

//     // Role-specific checks
//     if (userRole === 'patient') {
//       // Patient can join 15 minutes before scheduled time
//       if (minutesUntilMeeting > 15) {
//         setAccessGranted(false);
//         setAccessMessage(`Meeting will be available 15 minutes before scheduled time. Please wait ${minutesUntilMeeting - 15} more minute${minutesUntilMeeting - 15 !== 1 ? 's' : ''}.`);
//         return;
//       }
      
//       // Meeting expires 1 hour after scheduled time
//       if (minutesUntilMeeting < -60) {
//         setAccessGranted(false);
//         setAccessMessage('This meeting has expired. Please contact support if you need assistance.');
//         return;
//       }
//     }

//     if (userRole === 'doctor') {
//       // Check if doctor is available
//       if (doctorSchedule && !doctorSchedule.isAvailable) {
//         setAccessGranted(false);
//         setAccessMessage('You are currently marked as unavailable. Please update your availability status.');
//         return;
//       }

//       // Doctor can join 30 minutes before scheduled time
//       if (minutesUntilMeeting > 30) {
//         setAccessGranted(false);
//         setAccessMessage(`You can join 30 minutes before the scheduled time. Please wait ${minutesUntilMeeting - 30} more minute${minutesUntilMeeting - 30 !== 1 ? 's' : ''}.`);
//         return;
//       }
      
//       // Meeting expires 2 hours after scheduled time for doctors
//       if (minutesUntilMeeting < -120) {
//         setAccessGranted(false);
//         setAccessMessage('This meeting has expired.');
//         return;
//       }
//     }

//     // All checks passed
//     setAccessGranted(true);
//     if (minutesUntilMeeting > 0) {
//       setAccessMessage(`Meeting starts in ${minutesUntilMeeting} minute${minutesUntilMeeting !== 1 ? 's' : ''}. You can join now.`);
//     } else if (minutesUntilMeeting >= -5) {
//       setAccessMessage('Meeting is starting now. You can join the meeting.');
//     } else {
//       setAccessMessage('Meeting is in progress. You can join the meeting.');
//     }
//   };

//   const joinMeeting = async () => {
//     if (accessGranted && appointmentData?.meetingUrl) {
//       try {
//         // Log the meeting join attempt
//         console.log('Joining Zoom meeting:', {
//           appointmentId: appointmentData.appointmentId,
//           userRole: config.userRole,
//           userId: config.userId,
//           timestamp: new Date().toISOString()
//         });

//         // Open meeting in new tab
//         window.open(appointmentData.meetingUrl, '_blank');
        
//         // Optional: Send analytics or logging to your backend
//         // await logMeetingJoin();
//       } catch (error) {
//         console.error('Error joining meeting:', error);
//         alert('There was an error joining the meeting. Please try again or contact support.');
//       }
//     }
//   };

//   // Optional: Log meeting join to backend
//   const logMeetingJoin = async () => {
//     try {
//       await fetch(`${config.serverUrl}/api/appointments/${appointmentData.appointmentId}/join`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: config.userId,
//           userRole: config.userRole,
//           joinTime: new Date().toISOString()
//         })
//       });
//     } catch (error) {
//       console.error('Failed to log meeting join:', error);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'confirmed':
//       case 'completed':
//         return <CheckCircle className="icon status-confirmed" />;
//       case 'pending':
//         return <Clock className="icon status-pending" />;
//       case 'cancelled':
//       case 'failed':
//         return <XCircle className="icon status-cancelled" />;
//       default:
//         return <Clock className="icon icon-gray" />;
//     }
//   };

//   const formatTime = (dateString) => {
//     if (!dateString) return 'Not scheduled';
//     try {
//       return new Date(dateString).toLocaleString('en-US', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         timeZoneName: 'short'
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   const handleConfigChange = (field, value) => {
//     setConfig(prev => ({ ...prev, [field]: value }));
//   };

//   const handleRefresh = () => {
//     fetchAppointmentData();
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="loading-container">
//           <RefreshCw className="loading-spinner" />
//           <span className="loading-text">Loading appointment data...</span>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="error-container">
//           <XCircle className="error-icon" />
//           <h3 className="error-title">Error Loading Appointment</h3>
//           <p className="error-message">{error}</p>
//           <button onClick={handleRefresh} className="error-retry-btn">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // No appointment found state
//   if (!appointmentData) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="no-appointment">
//           <Calendar className="no-appointment-icon" />
//           <h3 className="no-appointment-title">No Appointment Found</h3>
//           <p className="no-appointment-message">Please check the appointment ID and try again.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="zoom-meeting-container fade-in">
//       {/* Header */}
//       <div className="zoom-meeting-header">
//         <h2 className="zoom-meeting-title">Virtual Consultation</h2>
//         <p className="appointment-id">Appointment ID: {appointmentData.appointmentId}</p>
//       </div>

//       {/* Configuration Panel */}
//       <div className="config-panel">
//         <h3 className="config-title">Configuration</h3>
//         <div className="config-grid">
//           <div className="config-field">
//             <label className="config-label">Appointment ID (MongoDB ObjectId)</label>
//             <input
//               type="text"
//               value={config.appointmentId}
//               onChange={(e) => handleConfigChange('appointmentId', e.target.value)}
//               className="config-input"
//               placeholder="e.g., 688c60b450b4a13f311e818c"
//             />
//           </div>
//           <div className="config-field">
//             <label className="config-label">User Role</label>
//             <select
//               value={config.userRole}
//               onChange={(e) => handleConfigChange('userRole', e.target.value)}
//               className="config-select"
//             >
//               <option value="patient">Patient</option>
//               <option value="doctor">Doctor</option>
//             </select>
//           </div>
//         </div>
//         <button onClick={handleRefresh} className="config-refresh-btn">
//           Refresh Data
//         </button>
//       </div>

//       {/* Patient & Doctor Information */}
//       {(appointmentData.patientInfo || appointmentData.doctorInfo) && (
//         <div className="participants-section">
//           <h3 className="section-title">Consultation Participants</h3>
//           <div className="participants-grid">
//             {appointmentData.patientInfo && (
//               <div className="participant-card">
//                 <h4 className="participant-title">Patient</h4>
//                 <p className="participant-name">{appointmentData.patientInfo.name}</p>
//                 <p className="participant-contact">{appointmentData.patientInfo.email}</p>
//                 {appointmentData.patientInfo.phone && (
//                   <p className="participant-contact">{appointmentData.patientInfo.phone}</p>
//                 )}
//               </div>
//             )}
            
//             {appointmentData.doctorInfo && (
//               <div className="participant-card">
//                 <h4 className="participant-title">Doctor</h4>
//                 <p className="participant-name">{appointmentData.doctorInfo.name}</p>
//                 {appointmentData.doctorInfo.specialization && (
//                   <p className="participant-specialization">{appointmentData.doctorInfo.specialization}</p>
//                 )}
//                 <p className="participant-contact">{appointmentData.doctorInfo.email}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Payment Information */}
//       {appointmentData.paymentInfo && (
//         <div className="payment-section">
//           <h3 className="section-title">Payment Details</h3>
//           <div className="payment-grid">
//             <div className="payment-item">
//               <span className="payment-label">Payment ID:</span>
//               <span className="payment-value">{appointmentData.paymentInfo.paymentId}</span>
//             </div>
//             <div className="payment-item">
//               <span className="payment-label">Amount:</span>
//               <span className="payment-value">
//                 {appointmentData.paymentInfo.currency} {appointmentData.paymentInfo.amount}
//               </span>
//             </div>
//             <div className="payment-item">
//               <span className="payment-label">Method:</span>
//               <span className="payment-value">{appointmentData.paymentInfo.paymentMethod}</span>
//             </div>
//             {appointmentData.paymentInfo.razorpayPaymentId && (
//               <div className="payment-item">
//                 <span className="payment-label">Razorpay Payment ID:</span>
//                 <span className="payment-value">{appointmentData.paymentInfo.razorpayPaymentId}</span>
//               </div>
//             )}
//             {appointmentData.paymentInfo.razorpayOrderId && (
//               <div className="payment-item">
//                 <span className="payment-label">Order ID:</span>
//                 <span className="payment-value">{appointmentData.paymentInfo.razorpayOrderId}</span>
//               </div>
//             )}
//             {appointmentData.paymentInfo.processedAt && (
//               <div className="payment-item">
//                 <span className="payment-label">Processed At:</span>
//                 <span className="payment-value">{formatTime(appointmentData.paymentInfo.processedAt)}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Appointment Status */}
//       <div className="status-section">
//         <div className="status-item">
//           <div className="status-label">
//             <Calendar className="icon icon-blue" />
//             <span className="status-label-text">Appointment Status</span>
//           </div>
//           <div className="status-value">
//             {getStatusIcon(appointmentData.appointmentStatus)}
//             <span className="status-text">{appointmentData.appointmentStatus}</span>
//           </div>
//         </div>

//         <div className="status-item">
//           <div className="status-label">
//             <CreditCard className="icon icon-green" />
//             <span className="status-label-text">Payment Status</span>
//           </div>
//           <div className="status-value">
//             {getStatusIcon(appointmentData.paymentStatus)}
//             <span className="status-text">{appointmentData.paymentStatus}</span>
//             {appointmentData.paymentInfo && (
//               <span className="payment-verified">✓ Verified</span>
//             )}
//           </div>
//         </div>

//         {appointmentData.insuranceStatus && (
//           <div className="status-item">
//             <div className="status-label">
//               <Shield className="icon icon-blue" />
//               <span className="status-label-text">Insurance Status</span>
//             </div>
//             <div className="status-value">
//               {appointmentData.insuranceStatus === 'COVERED' && <CheckCircle className="icon status-confirmed" />}
//               {appointmentData.insuranceStatus === 'NOT_COVERED' && <XCircle className="icon status-cancelled" />}
//               <span className="status-text">{appointmentData.insuranceStatus.toLowerCase().replace('_', ' ')}</span>
//             </div>
//           </div>
//         )}

//         <div className="status-item">
//           <div className="status-label">
//             <Clock className="icon icon-purple" />
//             <span className="status-label-text">Scheduled Time</span>
//           </div>
//           <span className="scheduled-time">{formatTime(appointmentData.scheduledTime)}</span>
//         </div>

//         <div className="status-item">
//           <div className="status-label">
//             <User className="icon icon-indigo" />
//             <span className="status-label-text">Role</span>
//           </div>
//           <span className="status-text">{appointmentData.userRole}</span>
//         </div>
//       </div>

//       {/* Access Control Message */}
//       <div className={`access-message ${accessGranted ? 'access-granted' : 'access-denied'}`}>
//         <div className="access-message-content">
//           <Shield className={`icon ${accessGranted ? 'access-message-icon-granted' : 'access-message-icon-denied'}`} />
//           <p className={`access-message-text ${accessGranted ? 'access-message-granted' : 'access-message-denied'}`}>
//             {accessMessage}
//           </p>
//         </div>
//       </div>

//       {/* Join Meeting Button */}
//       <button
//         onClick={joinMeeting}
//         disabled={!accessGranted}
//         className={`join-button ${accessGranted ? 'join-button-enabled' : 'join-button-disabled'}`}
//         aria-label={accessGranted ? 'Join the virtual meeting' : 'Access denied - cannot join meeting'}
//       >
//         {accessGranted ? 'Join Meeting' : 'Access Denied'}
//       </button>

//       {/* Current Time Display */}
//       <div className="current-time">
//         Current Time: {currentTime.toLocaleString()}
//       </div>
//     </div>
//   );
// };

// export default ZoomMeetingComponent;

// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Shield, CheckCircle, XCircle, User, CreditCard, RefreshCw } from 'lucide-react';
// import './zoom.css';

// const ZoomMeetingComponent = () => {
//   const [appointmentData, setAppointmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [accessGranted, setAccessGranted] = useState(false);
//   const [accessMessage, setAccessMessage] = useState('');
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   // Configuration - you can modify these
//   const [config, setConfig] = useState({
//     appointmentId: '688ca94f7e8d40289b6710dc', // Default appointment ID from your sample
//     userId: 'USER123', // Current user ID
//     userRole: 'patient', // patient or doctor
//     serverUrl: 'http://localhost:9090'
//   });

//   // Update current time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Fetch appointment data when appointment ID changes
//   useEffect(() => {
//     fetchAppointmentData();
//   }, [config.appointmentId]);

//   // Check access whenever data or time changes
//   useEffect(() => {
//     if (appointmentData) {
//       checkAccess();
//     }
//   }, [appointmentData, currentTime, config.userRole]);

//   const fetchAppointmentData = async () => {
//     if (!config.appointmentId) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Step 1: Check payment confirmation first using your BookingPayment endpoint
//       console.log('Step 1: Checking payment confirmation for appointment:', config.appointmentId);
//       const paymentResponse = await fetch(`${config.serverUrl}/api/booking-payments/appointment/${config.appointmentId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
      
//       let paymentData = null;
//       if (paymentResponse.ok) {
//         paymentData = await paymentResponse.json();
//         console.log('Payment data found:', paymentData);
//       } else if (paymentResponse.status !== 404) {
//         console.warn('Payment API error:', paymentResponse.status);
//       }
      
//       // Step 2: Fetch appointment details
//       console.log('Step 2: Fetching appointment details for:', config.appointmentId);
//       const appointmentResponse = await fetch(`${config.serverUrl}/api/appointments/${config.appointmentId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
      
//       if (!appointmentResponse.ok) {
//         if (appointmentResponse.status === 404) {
//           throw new Error('Appointment not found. Please check the appointment ID.');
//         } else if (appointmentResponse.status === 500) {
//           throw new Error('Server error. Please try again later.');
//         } else {
//           throw new Error(`Failed to fetch appointment: ${appointmentResponse.status} ${appointmentResponse.statusText}`);
//         }
//       }
      
//       const appointment = await appointmentResponse.json();
//       console.log('Appointment data found:', appointment);
      
//       // Extract patient and doctor IDs from MongoDB ObjectId structure
//       const patientId = extractObjectId(appointment.patient);
//       const doctorId = extractObjectId(appointment.doctor);
      
//       // Step 3: Fetch patient details if patient ID exists
//       let patientData = null;
//       if (patientId) {
//         console.log('Step 3: Fetching patient details for:', patientId);
//         try {
//           const patientResponse = await fetch(`${config.serverUrl}/api/patients/${patientId}`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             }
//           });
//           if (patientResponse.ok) {
//             patientData = await patientResponse.json();
//             console.log('Patient data found:', patientData);
//           }
//         } catch (patientErr) {
//           console.warn('Could not fetch patient details:', patientErr.message);
//         }
//       }
      
//       // Step 4: Fetch doctor details if doctor ID exists
//       let doctorData = null;
//       if (doctorId) {
//         console.log('Step 4: Fetching doctor details for:', doctorId);
//         try {
//           const doctorResponse = await fetch(`${config.serverUrl}/api/doctors/${doctorId}`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             }
//           });
//           if (doctorResponse.ok) {
//             doctorData = await doctorResponse.json();
//             console.log('Doctor data found:', doctorData);
//           }
//         } catch (doctorErr) {
//           console.warn('Could not fetch doctor details:', doctorErr.message);
//         }
//       }
      
//       // Step 5: Determine payment status from multiple sources
//       const finalPaymentStatus = determinePaymentStatus(paymentData, appointment);
      
//       // Step 6: Transform the combined data to match your MongoDB structure
//       const transformedData = {
//         appointmentId: appointment._id?.$oid || appointment._id || config.appointmentId,
//         patientId: patientId,
//         doctorId: doctorId,
//         appointmentStatus: mapAppointmentStatus(appointment.status),
//         paymentStatus: finalPaymentStatus,
//         scheduledTime: appointment.appointmentDate?.$date || appointment.appointmentDate,
//         meetingUrl: appointment.meetingUrl || generateMeetingUrl(config.appointmentId),
//         userRole: config.userRole,
        
//         // Insurance information from appointment
//         insuranceStatus: appointment.insuranceCoverageStatus,
//         coverageCheckDate: appointment.coverageCheckDate?.$date || appointment.coverageCheckDate,
        
//         // Enhanced data from all sources
//         patientInfo: patientData ? {
//           id: patientData._id?.$oid || patientData._id,
//           name: patientData.name || (patientData.firstName && patientData.lastName ? 
//                 patientData.firstName + ' ' + patientData.lastName : 'Patient'),
//           email: patientData.email,
//           phone: patientData.phone,
//           firstName: patientData.firstName,
//           lastName: patientData.lastName
//         } : null,
        
//         doctorInfo: doctorData ? {
//           id: doctorData._id?.$oid || doctorData._id,
//           name: doctorData.name || (doctorData.firstName && doctorData.lastName ? 
//                 doctorData.firstName + ' ' + doctorData.lastName : 'Doctor'),
//           email: doctorData.email,
//           phone: doctorData.phone,
//           specialization: doctorData.specialization,
//           isAvailable: doctorData.isAvailable !== false,
//           firstName: doctorData.firstName,
//           lastName: doctorData.lastName
//         } : null,
        
//         paymentInfo: paymentData ? {
//           paymentId: paymentData._id?.$oid || paymentData._id,
//           amount: paymentData.amount,
//           currency: paymentData.currency,
//           paymentMethod: paymentData.paymentMethod,
//           razorpayOrderId: paymentData.razorpayOrderId,
//           razorpayPaymentId: paymentData.razorpayPaymentId,
//           razorpaySignature: paymentData.razorpaySignature,
//           createdAt: paymentData.createdAt?.$date || paymentData.createdAt,
//           processedAt: paymentData.processedAt?.$date || paymentData.processedAt
//         } : null,
        
//         doctorSchedule: {
//           isAvailable: doctorData?.isAvailable !== false,
//           bookedSlots: [appointment.appointmentDate?.$date || appointment.appointmentDate]
//         },
        
//         // Additional appointment fields
//         createdAt: appointment.createdAt?.$date || appointment.createdAt,
//         updatedAt: appointment.updatedAt?.$date || appointment.updatedAt
//       };
      
//       console.log('Final transformed data:', transformedData);
//       setAppointmentData(transformedData);
      
//     } catch (err) {
//       setError(err.message);
//       console.error('Error in fetchAppointmentData:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to extract ObjectId from MongoDB DBRef structure
//   const extractObjectId = (dbRef) => {
//     if (!dbRef) return null;
    
//     // Handle different MongoDB ObjectId formats
//     if (dbRef.$id && dbRef.$id.$oid) {
//       return dbRef.$id.$oid;
//     } else if (dbRef.$oid) {
//       return dbRef.$oid;
//     } else if (typeof dbRef === 'string') {
//       return dbRef;
//     } else if (dbRef._id) {
//       return dbRef._id.$oid || dbRef._id;
//     }
    
//     return null;
//   };

//   // Determine payment status from multiple sources
//   const determinePaymentStatus = (paymentData, appointmentData) => {
//     console.log('Determining payment status...');
//     console.log('Payment data:', paymentData);
//     console.log('Appointment data payment status:', appointmentData?.paymentStatus);
    
//     // Priority 1: Dedicated payment data
//     if (paymentData && paymentData.status) {
//       console.log('Using payment data status:', paymentData.status);
//       const mappedStatus = mapPaymentStatus(paymentData.status);
//       console.log('Mapped payment status:', mappedStatus);
//       return mappedStatus;
//     }
    
//     // Priority 2: Payment status from appointment
//     if (appointmentData && appointmentData.paymentStatus) {
//       console.log('Using appointment payment status:', appointmentData.paymentStatus);
//       return mapPaymentStatus(appointmentData.paymentStatus);
//     }
    
//     // Priority 3: Infer from payment existence and status
//     if (paymentData) {
//       if (paymentData.razorpayPaymentId && paymentData.processedAt) {
//         console.log('Payment has razorpayPaymentId and processedAt, assuming completed');
//         return 'completed';
//       }
//       if (paymentData._id || paymentData.paymentId) {
//         console.log('Payment exists but no clear status, assuming completed');
//         return 'completed';
//       }
//     }
    
//     // Default: pending
//     console.log('No payment data found, defaulting to pending');
//     return 'pending';
//   };

//   // Map backend status values to component expected values
//   const mapAppointmentStatus = (status) => {
//     if (!status) return 'pending';
//     const statusLower = status.toLowerCase();
//     switch (statusLower) {
//       case 'accepted':
//       case 'confirmed':
//         return 'confirmed';
//       case 'rejected':
//       case 'cancelled':
//         return 'cancelled';
//       case 'pending':
//       case 'requested':
//         return 'pending';
//       default:
//         return statusLower;
//     }
//   };

//   const mapPaymentStatus = (status) => {
//     if (!status) return 'pending';
//     const statusLower = status.toLowerCase();
//     console.log('Mapping payment status:', status, '-> statusLower:', statusLower);
    
//     switch (statusLower) {
//       case 'success':
//       case 'paid':
//       case 'complete':
//       case 'completed':
//         console.log('Payment status mapped to: completed');
//         return 'completed';
//       case 'failed':
//       case 'declined':
//       case 'failure':
//         console.log('Payment status mapped to: failed');
//         return 'failed';
//       case 'pending':
//       case 'processing':
//       case 'created':
//         console.log('Payment status mapped to: pending');
//         return 'pending';
//       default:
//         console.log('Payment status mapped to default:', statusLower);
//         return statusLower;
//     }
//   };

//   // Generate a placeholder meeting URL if none exists
//   const generateMeetingUrl = (appointmentId) => {
//     return `https://zoom.us/j/placeholder?pwd=${appointmentId}`;
//   };

//   const checkAccess = () => {
//     if (!appointmentData) return;

//     const { 
//       appointmentStatus, 
//       paymentStatus, 
//       scheduledTime, 
//       userRole,
//       doctorSchedule 
//     } = appointmentData;

//     const scheduledDateTime = new Date(scheduledTime);
//     const timeDiff = scheduledDateTime.getTime() - currentTime.getTime();
//     const minutesUntilMeeting = Math.floor(timeDiff / (1000 * 60));

//     // Check basic requirements
//     if (appointmentStatus !== 'confirmed') {
//       setAccessGranted(false);
//       setAccessMessage(`Appointment must be confirmed to join the meeting. Current status: ${appointmentStatus}`);
//       return;
//     }

//     if (paymentStatus !== 'completed') {
//       setAccessGranted(false);
//       setAccessMessage(`Payment must be completed before joining the meeting. Current status: ${paymentStatus}`);
//       return;
//     }

//     // Role-specific checks
//     if (userRole === 'patient') {
//       // Patient can join 15 minutes before scheduled time
//       if (minutesUntilMeeting > 15) {
//         setAccessGranted(false);
//         setAccessMessage(`Meeting will be available 15 minutes before scheduled time. Please wait ${minutesUntilMeeting - 15} more minute${minutesUntilMeeting - 15 !== 1 ? 's' : ''}.`);
//         return;
//       }
      
//       // Meeting expires 1 hour after scheduled time
//       if (minutesUntilMeeting < -60) {
//         setAccessGranted(false);
//         setAccessMessage('This meeting has expired. Please contact support if you need assistance.');
//         return;
//       }
//     }

//     if (userRole === 'doctor') {
//       // Check if doctor is available
//       if (doctorSchedule && !doctorSchedule.isAvailable) {
//         setAccessGranted(false);
//         setAccessMessage('You are currently marked as unavailable. Please update your availability status.');
//         return;
//       }

//       // Doctor can join 30 minutes before scheduled time
//       if (minutesUntilMeeting > 30) {
//         setAccessGranted(false);
//         setAccessMessage(`You can join 30 minutes before the scheduled time. Please wait ${minutesUntilMeeting - 30} more minute${minutesUntilMeeting - 30 !== 1 ? 's' : ''}.`);
//         return;
//       }
      
//       // Meeting expires 2 hours after scheduled time for doctors
//       if (minutesUntilMeeting < -120) {
//         setAccessGranted(false);
//         setAccessMessage('This meeting has expired.');
//         return;
//       }
//     }

//     // All checks passed
//     setAccessGranted(true);
//     if (minutesUntilMeeting > 0) {
//       setAccessMessage(`Meeting starts in ${minutesUntilMeeting} minute${minutesUntilMeeting !== 1 ? 's' : ''}. You can join now.`);
//     } else if (minutesUntilMeeting >= -5) {
//       setAccessMessage('Meeting is starting now. You can join the meeting.');
//     } else {
//       setAccessMessage('Meeting is in progress. You can join the meeting.');
//     }
//   };

//   const joinMeeting = async () => {
//     if (accessGranted && appointmentData?.meetingUrl) {
//       try {
//         // Log the meeting join attempt
//         console.log('Joining Zoom meeting:', {
//           appointmentId: appointmentData.appointmentId,
//           userRole: config.userRole,
//           userId: config.userId,
//           timestamp: new Date().toISOString()
//         });

//         // Open meeting in new tab
//         window.open(appointmentData.meetingUrl, '_blank');
        
//         // Optional: Send analytics or logging to your backend
//         // await logMeetingJoin();
//       } catch (error) {
//         console.error('Error joining meeting:', error);
//         alert('There was an error joining the meeting. Please try again or contact support.');
//       }
//     }
//   };

//   // Optional: Log meeting join to backend
//   const logMeetingJoin = async () => {
//     try {
//       await fetch(`${config.serverUrl}/api/appointments/${appointmentData.appointmentId}/join`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: config.userId,
//           userRole: config.userRole,
//           joinTime: new Date().toISOString()
//         })
//       });
//     } catch (error) {
//       console.error('Failed to log meeting join:', error);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'confirmed':
//       case 'completed':
//         return <CheckCircle className="icon status-confirmed" />;
//       case 'pending':
//         return <Clock className="icon status-pending" />;
//       case 'cancelled':
//       case 'failed':
//         return <XCircle className="icon status-cancelled" />;
//       default:
//         return <Clock className="icon icon-gray" />;
//     }
//   };

//   const formatTime = (dateString) => {
//     if (!dateString) return 'Not scheduled';
//     try {
//       return new Date(dateString).toLocaleString('en-US', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         timeZoneName: 'short'
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   const handleConfigChange = (field, value) => {
//     setConfig(prev => ({ ...prev, [field]: value }));
//   };

//   const handleRefresh = () => {
//     fetchAppointmentData();
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="loading-container">
//           <RefreshCw className="loading-spinner" />
//           <span className="loading-text">Loading appointment data...</span>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="error-container">
//           <XCircle className="error-icon" />
//           <h3 className="error-title">Error Loading Appointment</h3>
//           <p className="error-message">{error}</p>
//           <button onClick={handleRefresh} className="error-retry-btn">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // No appointment found state
//   if (!appointmentData) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="no-appointment">
//           <Calendar className="no-appointment-icon" />
//           <h3 className="no-appointment-title">No Appointment Found</h3>
//           <p className="no-appointment-message">Please check the appointment ID and try again.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="zoom-meeting-container fade-in">
//       {/* Header */}
//       <div className="zoom-meeting-header">
//         <h2 className="zoom-meeting-title">Virtual Consultation</h2>
//         <p className="appointment-id">Appointment ID: {appointmentData.appointmentId}</p>
//       </div>

//       {/* Configuration Panel */}
//       <div className="config-panel">
//         <h3 className="config-title">Configuration</h3>
//         <div className="config-grid">
//           <div className="config-field">
//             <label className="config-label">Appointment ID (MongoDB ObjectId)</label>
//             <input
//               type="text"
//               value={config.appointmentId}
//               onChange={(e) => handleConfigChange('appointmentId', e.target.value)}
//               className="config-input"
//               placeholder="e.g., 688c60b450b4a13f311e818c"
//             />
//           </div>
//           <div className="config-field">
//             <label className="config-label">User Role</label>
//             <select
//               value={config.userRole}
//               onChange={(e) => handleConfigChange('userRole', e.target.value)}
//               className="config-select"
//             >
//               <option value="patient">Patient</option>
//               <option value="doctor">Doctor</option>
//             </select>
//           </div>
//         </div>
//         <button onClick={handleRefresh} className="config-refresh-btn">
//           Refresh Data
//         </button>
//       </div>

//       {/* Patient & Doctor Information */}
//       {(appointmentData.patientInfo || appointmentData.doctorInfo) && (
//         <div className="participants-section">
//           <h3 className="section-title">Consultation Participants</h3>
//           <div className="participants-grid">
//             {appointmentData.patientInfo && (
//               <div className="participant-card">
//                 <h4 className="participant-title">Patient</h4>
//                 <p className="participant-name">{appointmentData.patientInfo.name}</p>
//                 <p className="participant-contact">{appointmentData.patientInfo.email}</p>
//                 {appointmentData.patientInfo.phone && (
//                   <p className="participant-contact">{appointmentData.patientInfo.phone}</p>
//                 )}
//               </div>
//             )}
            
//             {appointmentData.doctorInfo && (
//               <div className="participant-card">
//                 <h4 className="participant-title">Doctor</h4>
//                 <p className="participant-name">{appointmentData.doctorInfo.name}</p>
//                 {appointmentData.doctorInfo.specialization && (
//                   <p className="participant-specialization">{appointmentData.doctorInfo.specialization}</p>
//                 )}
//                 <p className="participant-contact">{appointmentData.doctorInfo.email}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Payment Information */}
//       {appointmentData.paymentInfo && (
//         <div className="payment-section">
//           <h3 className="section-title">Payment Details</h3>
//           <div className="payment-grid">
//             <div className="payment-item">
//               <span className="payment-label">Payment ID:</span>
//               <span className="payment-value">{appointmentData.paymentInfo.paymentId}</span>
//             </div>
//             <div className="payment-item">
//               <span className="payment-label">Amount:</span>
//               <span className="payment-value">
//                 {appointmentData.paymentInfo.currency} {appointmentData.paymentInfo.amount}
//               </span>
//             </div>
//             <div className="payment-item">
//               <span className="payment-label">Method:</span>
//               <span className="payment-value">{appointmentData.paymentInfo.paymentMethod}</span>
//             </div>
//             {appointmentData.paymentInfo.razorpayPaymentId && (
//               <div className="payment-item">
//                 <span className="payment-label">Razorpay Payment ID:</span>
//                 <span className="payment-value">{appointmentData.paymentInfo.razorpayPaymentId}</span>
//               </div>
//             )}
//             {appointmentData.paymentInfo.razorpayOrderId && (
//               <div className="payment-item">
//                 <span className="payment-label">Order ID:</span>
//                 <span className="payment-value">{appointmentData.paymentInfo.razorpayOrderId}</span>
//               </div>
//             )}
//             {appointmentData.paymentInfo.processedAt && (
//               <div className="payment-item">
//                 <span className="payment-label">Processed At:</span>
//                 <span className="payment-value">{formatTime(appointmentData.paymentInfo.processedAt)}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Appointment Status */}
//       <div className="status-section">
//         <div className="status-item">
//           <div className="status-label">
//             <Calendar className="icon icon-blue" />
//             <span className="status-label-text">Appointment Status</span>
//           </div>
//           <div className="status-value">
//             {getStatusIcon(appointmentData.appointmentStatus)}
//             <span className="status-text">{appointmentData.appointmentStatus}</span>
//           </div>
//         </div>

//         <div className="status-item">
//           <div className="status-label">
//             <CreditCard className="icon icon-green" />
//             <span className="status-label-text">Payment Status</span>
//           </div>
//           <div className="status-value">
//             {getStatusIcon(appointmentData.paymentStatus)}
//             <span className="status-text">{appointmentData.paymentStatus}</span>
//             {appointmentData.paymentInfo && (
//               <span className="payment-verified">✓ Verified</span>
//             )}
//           </div>
//         </div>

//         {appointmentData.insuranceStatus && (
//           <div className="status-item">
//             <div className="status-label">
//               <Shield className="icon icon-blue" />
//               <span className="status-label-text">Insurance Status</span>
//             </div>
//             <div className="status-value">
//               {appointmentData.insuranceStatus === 'COVERED' && <CheckCircle className="icon status-confirmed" />}
//               {appointmentData.insuranceStatus === 'NOT_COVERED' && <XCircle className="icon status-cancelled" />}
//               <span className="status-text">{appointmentData.insuranceStatus.toLowerCase().replace('_', ' ')}</span>
//             </div>
//           </div>
//         )}

//         <div className="status-item">
//           <div className="status-label">
//             <Clock className="icon icon-purple" />
//             <span className="status-label-text">Scheduled Time</span>
//           </div>
//           <span className="scheduled-time">{formatTime(appointmentData.scheduledTime)}</span>
//         </div>

//         <div className="status-item">
//           <div className="status-label">
//             <User className="icon icon-indigo" />
//             <span className="status-label-text">Role</span>
//           </div>
//           <span className="status-text">{appointmentData.userRole}</span>
//         </div>
//       </div>

//       {/* Access Control Message */}
//       <div className={`access-message ${accessGranted ? 'access-granted' : 'access-denied'}`}>
//         <div className="access-message-content">
//           <Shield className={`icon ${accessGranted ? 'access-message-icon-granted' : 'access-message-icon-denied'}`} />
//           <p className={`access-message-text ${accessGranted ? 'access-message-granted' : 'access-message-denied'}`}>
//             {accessMessage}
//           </p>
//         </div>
//       </div>

//       {/* Join Meeting Button */}
//       <button
//         onClick={joinMeeting}
//         disabled={!accessGranted}
//         className={`join-button ${accessGranted ? 'join-button-enabled' : 'join-button-disabled'}`}
//         aria-label={accessGranted ? 'Join the virtual meeting' : 'Access denied - cannot join meeting'}
//       >
//         {accessGranted ? 'Join Meeting' : 'Access Denied'}
//       </button>

//       {/* Current Time Display */}
//       <div className="current-time">
//         Current Time: {currentTime.toLocaleString()}
//       </div>
//     </div>
//   );
// };

// export default ZoomMeetingComponent;

// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Shield, CheckCircle, XCircle, User, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
// import './zoom.css';

// const ZoomMeetingComponent = () => {
//   const [appointmentData, setAppointmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [accessGranted, setAccessGranted] = useState(false);
//   const [accessMessage, setAccessMessage] = useState('');
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   // Configuration - you can modify these
//   const [config, setConfig] = useState({
//     appointmentId: '688ca94f7e8d40289b6710dc', // Default appointment ID from your sample
//     userId: 'USER123', // Current user ID
//     userRole: 'patient', // patient or doctor
//     serverUrl: 'http://localhost:9090'
//   });

//   // Update current time every second, displayed in IST
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Fetch appointment data when appointment ID changes
//   useEffect(() => {
//     fetchAppointmentData();
//   }, [config.appointmentId]);

//   // Check access whenever data or time or role changes
//   useEffect(() => {
//     if (appointmentData) {
//       checkAccess();
//     }
//   }, [appointmentData, currentTime, config.userRole]);

//   const fetchAppointmentData = async () => {
//     if (!config.appointmentId) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Using static data for testing - replace with your actual data
//       console.log('Using static data for appointment:', config.appointmentId);
      
//       // Static appointment data (your sample)
//       const appointment = {
//         "_id": {
//           "$oid": "688ca94f7e8d40289b6710dc"
//         },
//         "patient": {
//           "$ref": "patients",
//           "$id": {
//             "$oid": "68834a1b8c1b9df340ede7d7"
//           }
//         },
//         "doctor": {
//           "$ref": "doctors",
//           "$id": {
//             "$oid": "68876155a2051d108d3eeff1"
//           }
//         },
//         "appointmentDate": {
//           "$date": "2025-08-12T06:00:00.000Z"
//         },
//         "status": "CONFIRMED",
//         "insuranceCoverageStatus": "COVERED",
//         "coverageCheckDate": {
//           "$date": "2025-08-01T06:37:40.274Z"
//         },
//         "createdAt": {
//           "$date": "2025-08-01T06:37:40.274Z"
//         }
//       };
      
//       // Static payment data (your sample)
//       const paymentData = {
//         "_id": {
//           "$oid": "688ca95178e30b52831559ad"
//         },
//         "appointment": {
//           "$ref": "appointments",
//           "$id": {
//             "$oid": "688ca94f7e8d40289b6710dc"
//           }
//         },
//         "patient": {
//           "$ref": "patients",
//           "$id": {
//             "$oid": "68834a1b8c1b9df340ede7d7"
//           }
//         },
//         "amount": "500",
//         "currency": "INR",
//         "status": "SUCCESS",
//         "paymentMethod": "RAZORPAY",
//         "razorpayOrderId": "order_R03gPSuEfzKgVa",
//         "razorpayPaymentId": "pay_R03gVtp7sg1pxs",
//         "razorpaySignature": "8b88b5d6a61d4f8c3aaef5f7d84ee48c28dd32d106cc90dd805e4593b6ab0458",
//         "createdAt": {
//           "$date": "2025-08-01T11:47:29.744Z"
//         },
//         "updatedAt": {
//           "$date": "2025-08-01T11:47:51.657Z"
//         },
//         "processedAt": {
//           "$date": "2025-08-01T11:47:51.657Z"
//         }
//       };
      
//       // Static patient data
//       const patientData = {
//         "_id": {
//           "$oid": "68834a1b8c1b9df340ede7d7"
//         },
//         "firstName": "John",
//         "lastName": "Doe",
//         "email": "john.doe@example.com",
//         "phone": "+91-9876543210",
//         "dateOfBirth": "1990-05-15",
//         "gender": "MALE"
//       };
      
//       // Static doctor data
//       const doctorData = {
//         "_id": {
//           "$oid": "68876155a2051d108d3eeff1"
//         },
//         "firstName": "Dr. Sarah",
//         "lastName": "Wilson",
//         "email": "dr.sarah@hospital.com",
//         "phone": "+91-9876543211",
//         "specialization": "Cardiology",
//         "isAvailable": true,
//         "experience": "10 years"
//       };
      
//       console.log('Static appointment data:', appointment);
//       console.log('Static payment data:', paymentData);
//       console.log('Static patient data:', patientData);
//       console.log('Static doctor data:', doctorData);
      
//       // Extract patient and doctor IDs from MongoDB ObjectId structure
//       const patientId = extractObjectId(appointment.patient);
//       const doctorId = extractObjectId(appointment.doctor);
      
//       console.log('Extracted Patient ID:', patientId);
//       console.log('Extracted Doctor ID:', doctorId);
      
//       // Step 5: Determine payment status from multiple sources
//       const finalPaymentStatus = determinePaymentStatus(paymentData, appointment);
//       console.log('Final payment status determined:', finalPaymentStatus);
      
//       // Step 6: Transform the combined data to match your MongoDB structure
//       const transformedData = {
//         appointmentId: appointment._id?.$oid || appointment._id || config.appointmentId,
//         patientId: patientId,
//         doctorId: doctorId,
//         appointmentStatus: mapAppointmentStatus(appointment.status),
//         paymentStatus: finalPaymentStatus,
//         scheduledTime: appointment.appointmentDate?.$date || appointment.appointmentDate,
//         meetingUrl: appointment.meetingUrl || generateMeetingUrl(config.appointmentId),
//         userRole: config.userRole,
        
//         // Insurance information from appointment
//         insuranceStatus: appointment.insuranceCoverageStatus,
//         coverageCheckDate: appointment.coverageCheckDate?.$date || appointment.coverageCheckDate,
        
//         // Enhanced data from all sources
//         patientInfo: patientData ? {
//           id: patientData._id?.$oid || patientData._id,
//           name: patientData.name || (patientData.firstName && patientData.lastName ? 
//                 patientData.firstName + ' ' + patientData.lastName : 'Patient'),
//           email: patientData.email,
//           phone: patientData.phone,
//           firstName: patientData.firstName,
//           lastName: patientData.lastName,
//           gender: patientData.gender,
//           dateOfBirth: patientData.dateOfBirth
//         } : null,
        
//         doctorInfo: doctorData ? {
//           id: doctorData._id?.$oid || doctorData._id,
//           name: doctorData.name || (doctorData.firstName && doctorData.lastName ? 
//                 doctorData.firstName + ' ' + doctorData.lastName : 'Doctor'),
//           email: doctorData.email,
//           phone: doctorData.phone,
//           specialization: doctorData.specialization,
//           isAvailable: doctorData.isAvailable !== false,
//           firstName: doctorData.firstName,
//           lastName: doctorData.lastName,
//           experience: doctorData.experience
//         } : null,
        
//         paymentInfo: paymentData ? {
//           paymentId: paymentData._id?.$oid || paymentData._id,
//           amount: paymentData.amount,
//           currency: paymentData.currency,
//           paymentMethod: paymentData.paymentMethod,
//           razorpayOrderId: paymentData.razorpayOrderId,
//           razorpayPaymentId: paymentData.razorpayPaymentId,
//           razorpaySignature: paymentData.razorpaySignature,
//           createdAt: paymentData.createdAt?.$date || paymentData.createdAt,
//           processedAt: paymentData.processedAt?.$date || paymentData.processedAt,
//           updatedAt: paymentData.updatedAt?.$date || paymentData.updatedAt
//         } : null,
        
//         doctorSchedule: {
//           isAvailable: doctorData?.isAvailable !== false,
//           bookedSlots: [appointment.appointmentDate?.$date || appointment.appointmentDate]
//         },
        
//         // Additional appointment fields
//         createdAt: appointment.createdAt?.$date || appointment.createdAt,
//         updatedAt: appointment.updatedAt?.$date || appointment.updatedAt
//       };
      
//       console.log('Final transformed data:', transformedData);
//       setAppointmentData(transformedData);
      
//       // Simulate loading time
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//     } catch (err) {
//       setError(err.message);
//       console.error('Error in fetchAppointmentData:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to extract ObjectId from MongoDB DBRef structure
//   const extractObjectId = (dbRef) => {
//     if (!dbRef) return null;
    
//     // Handle different MongoDB ObjectId formats
//     if (dbRef.$id && dbRef.$id.$oid) {
//       return dbRef.$id.$oid;
//     } else if (dbRef.$oid) {
//       return dbRef.$oid;
//     } else if (typeof dbRef === 'string') {
//       return dbRef;
//     } else if (dbRef._id) {
//       return dbRef._id.$oid || dbRef._id;
//     }
    
//     return null;
//   };

//   // Determine payment status from multiple sources
//   const determinePaymentStatus = (paymentData, appointmentData) => {
//     if (paymentData && paymentData.status) {
//       return mapPaymentStatus(paymentData.status);
//     }
//     if (appointmentData && appointmentData.paymentStatus) {
//       return mapPaymentStatus(appointmentData.paymentStatus);
//     }
//     if (paymentData) {
//       if (paymentData.razorpayPaymentId && paymentData.processedAt) {
//         return 'completed';
//       }
//       if (paymentData._id || paymentData.paymentId) {
//         return 'completed';
//       }
//     }
//     return 'pending';
//   };

//   const mapAppointmentStatus = (status) => {
//     if (!status) return 'pending';
//     const statusLower = status.toLowerCase();
//     switch (statusLower) {
//       case 'accepted':
//       case 'confirmed':
//         return 'confirmed';
//       case 'rejected':
//       case 'cancelled':
//         return 'cancelled';
//       case 'pending':
//       case 'requested':
//         return 'pending';
//       default:
//         return statusLower;
//     }
//   };

//   const mapPaymentStatus = (status) => {
//     if (!status) return 'pending';
//     const statusLower = status.toLowerCase();
//     switch (statusLower) {
//       case 'success':
//       case 'paid':
//       case 'complete':
//       case 'completed':
//         return 'completed';
//       case 'failed':
//       case 'declined':
//       case 'failure':
//         return 'failed';
//       case 'pending':
//       case 'processing':
//       case 'created':
//         return 'pending';
//       default:
//         return statusLower;
//     }
//   };

//   // Generate placeholder meeting URL if none exists
//   const generateMeetingUrl = (appointmentId) => {
//     return `https://zoom.us/j/placeholder?pwd=${appointmentId}`;
//   };

//   // Check access permissions and timing logic
//   const checkAccess = () => {
//     if (!appointmentData) return;

//     const { 
//       appointmentStatus, 
//       paymentStatus, 
//       scheduledTime, 
//       userRole,
//       doctorSchedule 
//     } = appointmentData;

//     const scheduledDateTime = new Date(scheduledTime);
//     const timeDiff = scheduledDateTime.getTime() - currentTime.getTime();
//     const minutesUntilMeeting = Math.floor(timeDiff / (1000 * 60));

//     if (appointmentStatus !== 'confirmed') {
//       setAccessGranted(false);
//       setAccessMessage(`Appointment must be confirmed to join the meeting. Current status: ${appointmentStatus}`);
//       return;
//     }
//     if (paymentStatus !== 'completed') {
//       setAccessGranted(false);
//       setAccessMessage(`Payment must be completed before joining the meeting. Current status: ${paymentStatus}`);
//       return;
//     }

//     if (userRole === 'patient') {
//       if (minutesUntilMeeting > 15) {
//         setAccessGranted(false);
//         setAccessMessage(`Meeting will be available 15 minutes before scheduled time. Please wait ${minutesUntilMeeting - 15} more minute${minutesUntilMeeting - 15 !== 1 ? 's' : ''}.`);
//         return;
//       }
//       if (minutesUntilMeeting < -60) {
//         setAccessGranted(false);
//         setAccessMessage('This meeting has expired. Please contact support if you need assistance.');
//         return;
//       }
//     }

//     if (userRole === 'doctor') {
//       if (doctorSchedule && !doctorSchedule.isAvailable) {
//         setAccessGranted(false);
//         setAccessMessage('You are currently marked as unavailable. Please update your availability status.');
//         return;
//       }
//       if (minutesUntilMeeting > 30) {
//         setAccessGranted(false);
//         setAccessMessage(`You can join 30 minutes before the scheduled time. Please wait ${minutesUntilMeeting - 30} more minute${minutesUntilMeeting - 30 !== 1 ? 's' : ''}.`);
//         return;
//       }
//       if (minutesUntilMeeting < -120) {
//         setAccessGranted(false);
//         setAccessMessage('This meeting has expired.');
//         return;
//       }
//     }

//     setAccessGranted(true);
//     if (minutesUntilMeeting > 0) {
//       setAccessMessage(`Meeting starts in ${minutesUntilMeeting} minute${minutesUntilMeeting !== 1 ? 's' : ''}. You can join now.`);
//     } else if (minutesUntilMeeting >= -5) {
//       setAccessMessage('Meeting is starting now. You can join the meeting.');
//     } else {
//       setAccessMessage('Meeting is in progress. You can join the meeting.');
//     }
//   };

//   // Join meeting handler
//   const joinMeeting = () => {
//     if (accessGranted && appointmentData?.meetingUrl) {
//       try {
//         console.log('Joining Zoom meeting:', {
//           appointmentId: appointmentData.appointmentId,
//           userRole: config.userRole,
//           userId: config.userId,
//           timestamp: new Date().toISOString()
//         });
//         window.open(appointmentData.meetingUrl, '_blank');
//       } catch (error) {
//         console.error('Error joining meeting:', error);
//         alert('There was an error joining the meeting. Please try again or contact support.');
//       }
//     }
//   };

//   // Utility: Status icon components for appointment/payment statuses
//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'confirmed':
//       case 'completed':
//         return <CheckCircle className="icon status-confirmed" />;
//       case 'pending':
//         return <Clock className="icon status-pending" />;
//       case 'cancelled':
//       case 'failed':
//         return <XCircle className="icon status-cancelled" />;
//       default:
//         return <Clock className="icon icon-gray" />;
//     }
//   };

//   // Format date/time strings for display in IST
//   const formatTime = (dateString) => {
//     if (!dateString) return 'Not scheduled';
//     try {
//       return new Date(dateString).toLocaleString('en-IN', {
//         timeZone: 'Asia/Kolkata',
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//         timeZoneName: 'short'
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   // Handle config field changes
//   const handleConfigChange = (field, value) => {
//     setConfig(prev => ({ ...prev, [field]: value }));
//   };

//   // Refresh appointment data
//   const handleRefresh = () => {
//     fetchAppointmentData();
//   };

//   if (loading) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="loading-container">
//           <RefreshCw className="loading-spinner" />
//           <span className="loading-text">Loading appointment data...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="error-container">
//           <XCircle className="error-icon" />
//           <h3 className="error-title">Error Loading Appointment</h3>
//           <p className="error-message">{error}</p>
//           <button onClick={handleRefresh} className="error-retry-btn">
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!appointmentData) {
//     return (
//       <div className="zoom-meeting-container">
//         <div className="no-appointment">
//           <Calendar className="no-appointment-icon" />
//           <h3 className="no-appointment-title">No Appointment Found</h3>
//           <p className="no-appointment-message">Please check the appointment ID and try again.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="zoom-meeting-container fade-in">
//       {/* Header */}
//       <div className="zoom-meeting-header">
//         <h2 className="zoom-meeting-title">Virtual Consultation</h2>
//         <p className="appointment-id">Appointment ID: {appointmentData.appointmentId}</p>
//         <p className="current-time">Current Time (IST): {currentTime.toLocaleString('en-IN', {timeZone:'Asia/Kolkata'})}</p>
//       </div>

//       {/* Configuration Panel */}
//       <div className="config-panel">
//         <h3 className="config-title">Configuration (Using Static Data)</h3>
//         <div className="config-grid">
//           <div className="config-field">
//             <label className="config-label">Appointment ID (Static Data)</label>
//             <input
//               type="text"
//               value={config.appointmentId}
//               onChange={e => handleConfigChange('appointmentId', e.target.value)}
//               className="config-input"
//               placeholder="688ca94f7e8d40289b6710dc"
//               disabled
//             />
//             <small className="config-note">Using your sample MongoDB data</small>
//           </div>
//           <div className="config-field">
//             <label className="config-label">User Role</label>
//             <select
//               value={config.userRole}
//               onChange={e => handleConfigChange('userRole', e.target.value)}
//               className="config-select"
//             >
//               <option value="patient">Patient</option>
//               <option value="doctor">Doctor</option>
//             </select>
//           </div>
//         </div>
//         <button onClick={handleRefresh} className="config-refresh-btn">Refresh Static Data</button>
//       </div>

//       {/* Participants Section */}
//       {(appointmentData.patientInfo || appointmentData.doctorInfo) && (
//         <div className="participants-section">
//           <h3 className="section-title">Consultation Participants</h3>
//           <div className="participants-grid">
//             {appointmentData.patientInfo && (
//               <div className="participant-card">
//                 <h4 className="participant-title">Patient</h4>
//                 <p className="participant-name">{appointmentData.patientInfo.name}</p>
//                 <p className="participant-contact">{appointmentData.patientInfo.email}</p>
//                 {appointmentData.patientInfo.phone && (
//                   <p className="participant-contact">{appointmentData.patientInfo.phone}</p>
//                 )}
//               </div>
//             )}
//             {appointmentData.doctorInfo && (
//               <div className="participant-card">
//                 <h4 className="participant-title">Doctor</h4>
//                 <p className="participant-name">{appointmentData.doctorInfo.name}</p>
//                 {appointmentData.doctorInfo.specialization && (
//                   <p className="participant-specialization">{appointmentData.doctorInfo.specialization}</p>
//                 )}
//                 <p className="participant-contact">{appointmentData.doctorInfo.email}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Payment Details Section */}
//       {appointmentData.paymentInfo && (
//         <div className="payment-section">
//           <h3 className="section-title">Payment Details</h3>
//           <div className="payment-grid">
//             <div className="payment-item">
//               <span className="payment-label">Payment ID:</span>
//               <span className="payment-value">{appointmentData.paymentInfo.paymentId}</span>
//             </div>
//             <div className="payment-item">
//               <span className="payment-label">Amount:</span>
//               <span className="payment-value">
//                 {appointmentData.paymentInfo.currency} {appointmentData.paymentInfo.amount}
//               </span>
//             </div>
//             <div className="payment-item">
//               <span className="payment-label">Method:</span>
//               <span className="payment-value">{appointmentData.paymentInfo.paymentMethod}</span>
//             </div>
//             {appointmentData.paymentInfo.razorpayPaymentId && (
//               <div className="payment-item">
//                 <span className="payment-label">Razorpay Payment ID:</span>
//                 <span className="payment-value">{appointmentData.paymentInfo.razorpayPaymentId}</span>
//               </div>
//             )}
//             {appointmentData.paymentInfo.razorpayOrderId && (
//               <div className="payment-item">
//                 <span className="payment-label">Order ID:</span>
//                 <span className="payment-value">{appointmentData.paymentInfo.razorpayOrderId}</span>
//               </div>
//             )}
//             {appointmentData.paymentInfo.processedAt && (
//               <div className="payment-item">
//                 <span className="payment-label">Processed At:</span>
//                 <span className="payment-value">{formatTime(appointmentData.paymentInfo.processedAt)}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Status Section */}
//       <div className="status-section">
//         <div className="status-item">
//           <div className="status-label">
//             <Calendar className="icon icon-blue" />
//             <span className="status-label-text">Appointment Status</span>
//           </div>
//           <div className="status-value">
//             {getStatusIcon(appointmentData.appointmentStatus)}
//             <span className="status-text">{appointmentData.appointmentStatus}</span>
//           </div>
//         </div>
//         <div className="status-item">
//           <div className="status-label">
//             <CreditCard className="icon icon-green" />
//             <span className="status-label-text">Payment Status</span>
//           </div>
//           <div className="status-value">
//             {getStatusIcon(appointmentData.paymentStatus)}
//             <span className="status-text">{appointmentData.paymentStatus}</span>
//             {appointmentData.paymentInfo && (
//               <span className="payment-verified">✓ Verified</span>
//             )}
//           </div>
//         </div>
//         {appointmentData.insuranceStatus && (
//           <div className="status-item">
//             <div className="status-label">
//               <Shield className="icon icon-blue" />
//               <span className="status-label-text">Insurance Status</span>
//             </div>
//             <div className="status-value">
//               {appointmentData.insuranceStatus === 'COVERED' && <CheckCircle className="icon status-confirmed" />}
//               {appointmentData.insuranceStatus === 'NOT_COVERED' && <XCircle className="icon status-cancelled" />}
//               <span className="status-text">{appointmentData.insuranceStatus.toLowerCase().replace('_', ' ')}</span>
//             </div>
//           </div>
//         )}
//         <div className="status-item">
//           <div className="status-label">
//             <Clock className="icon icon-purple" />
//             <span className="status-label-text">Scheduled Time</span>
//           </div>
//           <span className="scheduled-time">{formatTime(appointmentData.scheduledTime)}</span>
//         </div>
//         <div className="status-item">
//           <div className="status-label">
//             <User className="icon icon-indigo" />
//             <span className="status-label-text">Role</span>
//           </div>
//           <span className="status-text">{appointmentData.userRole}</span>
//         </div>
//       </div>

//       {/* Access Control Message */}
//       <div className={`access-message ${accessGranted ? 'access-granted' : 'access-denied'}`}>
//         <div className="access-message-content">
//           <Shield className={`icon ${accessGranted ? 'access-message-icon-granted' : 'access-message-icon-denied'}`} />
//           <p className={`access-message-text ${accessGranted ? 'access-message-granted' : 'access-message-denied'}`}>
//             {accessMessage}
//           </p>
//         </div>
//       </div>

//       {/* Join Meeting Button */}
//       <button
//         onClick={joinMeeting}
//         disabled={!accessGranted}
//         className={`join-button ${accessGranted ? 'join-button-enabled' : 'join-button-disabled'}`}
//         aria-label={accessGranted ? 'Join the virtual meeting' : 'Access denied - cannot join meeting'}
//       >
//         {accessGranted ? 'Join Meeting' : 'Access Denied'}
//       </button>
//     </div>
//   );
// };

// export default ZoomMeetingComponent;
import React, { useState, useEffect } from "react";
import axios from "axios";
import './zoom.css'
export default function AppointmentJoiner() {
  const [patientId, setPatientId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [joinUrl, setJoinUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get patientId from localStorage or props
  useEffect(() => {
    const pid = localStorage.getItem("patientId");
    if (pid) setPatientId(pid);
  }, []);

  // Fetch appointments for given patientId
  const fetchAppointments = async () => {
    if (!patientId) {
      setError("Patient ID not set");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    setSelectedAppointment(null);
    setJoinUrl("");

    try {
      const response = await axios.get(
        `http://localhost:9090/api/appointments/patientId/${patientId}`
      );
      if (!Array.isArray(response.data)) {
        setError("Invalid response - expected appointment list");
        setLoading(false);
        return;
      }
      console.log(response.data);
      
      setAppointments(response.data);
      selectUpcomingConfirmed(response.data);
    } catch (err) {
      setError("Failed to fetch appointments: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // Select nearest upcoming confirmed appointment eligible to join
  const selectUpcomingConfirmed = (appts) => {
    const now = new Date();
    const validAppointments = appts
      .filter((a) => a.status.toLowerCase() === "confirmed" && a.appointmentDate)
      .map((a) => ({ ...a, dateObj: new Date(a.appointmentDate)}))
      // .filter((a) => a.dateObj.getTime() + 60 * 60 * 1000 >= now.getTime()); // up to 1 hour after start

    if (validAppointments.length === 0) {
      setMessage("No upcoming confirmed appointments available for join.");
      return;
    }

    validAppointments.sort((a, b) => a.dateObj - b.dateObj);
    const nearest = validAppointments[0];
    setSelectedAppointment(nearest);

    // Check if user can join based on timing
    const diffMinutes = Math.floor((nearest.dateObj - now) / 1000 / 60);

    if (diffMinutes > 15) {
      setMessage(
        `You can join 15 minutes before the appointment. Please wait ${diffMinutes - 15} minute${
          diffMinutes - 15 !== 1 ? "s" : ""
        }.`
      );
      setJoinUrl("");
    } else if (diffMinutes < -60) {
      setMessage("Appointment meeting has expired.");
      setJoinUrl("");
    } else {
      setMessage("You can join the appointment now.");
      setJoinUrl(nearest.zoomJoinUrl || nearest.meetingUrl || "");
    }
  };

  const joinMeeting = () => {
    if (joinUrl) window.open(joinUrl, "_blank");
    else alert("Join URL not available");
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h2>Join Your Appointment</h2>
      {/* <p>Patient ID: {patientId || <em>Not set</em>}</p> */}
      <button onClick={fetchAppointments} disabled={loading || !patientId}>
        {loading ? "Loading..." : "Fetch My Appointments"}
      </button>
      <button onClick={() => {
        setAppointments([]);
        setSelectedAppointment(null);
        setJoinUrl("");
        setMessage("");
        setError("");
      }} disabled={loading} style={{ marginLeft: 10 }}>
        Reset
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}

      {selectedAppointment && (
        <div style={{ marginTop: 20 }}>
          <h3>Upcoming Appointment</h3>
          <p>
            Topic: {selectedAppointment.topic || "Consultation"} <br/>
            Scheduled Time: {new Date(selectedAppointment.appointmentDate).toLocaleString("en-IN", {timeZone:"Asia/Kolkata"})} <br/>
            Status: {selectedAppointment.status}
          </p>
          <button disabled={!joinUrl} onClick={joinMeeting}>
            Join Meeting
          </button>
        </div>
      )}
    </div>
  );
}
