


// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Calendar, Users, Activity, Clock,
//   FileText, Stethoscope, Star, Phone,
//   Video, ChevronRight, TrendingUp, Bell,
//   MessageSquare, DollarSign, Award,
//   User, AlertCircle, CheckCircle
// } from 'lucide-react';
// import '../Patient/patientdashboard.css';

// const DoctorDashboard = ({ onNavigate }) => {
//   const [activeTab] = useState('dashboard');
//   const navigate = useNavigate();

//   // Doctor statistics (you can replace these with real data as needed)
//   const doctorStats = {
//     totalPatients: 247,
//     todayAppointments: 8,
//     completedToday: 5,
//     pendingConsultations: 3,
//     monthlyEarnings: 24500,
//     rating: 4.8,
//     totalReviews: 156,
//   };

//   const [doctor, setDoctor] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [loadingNotifications, setLoadingNotifications] = useState(true);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const notifPanelRef = useRef(null);

//   const userId = localStorage.getItem('userId');
//   useEffect(() => {
//   if (doctor && doctor.id) {
//     localStorage.setItem("doctorId", doctor.id);
//   }
// }, [doctor]);

//   // Fetch doctor data by userId
//   async function fetchDoctorByUserId(userId) {
//     if (!userId) return;
//     try {
//       const response = await fetch(`http://localhost:9090/api/doctors/user/${userId}`);
//       if (!response.ok) throw new Error('Doctor not found');
//       const doctorData = await response.json();
//       setDoctor(doctorData);
//       console.log('Doctor data:', doctorData);
//     } catch (error) {
//       console.error('Failed to fetch doctor:', error);
//       setDoctor(null);
//     }
//   }

//   // Fetch notifications by userId
//   async function fetchNotifications(userId) {
//     if (!userId) return;
//     try {
//       const response = await fetch(`http://localhost:9090/api/appointments/getNotifications/${userId}`);
//       if (!response.ok) throw new Error('Failed to fetch notifications');
//       const data = await response.json();
//       setNotifications(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Failed to fetch notifications:', error);
//       setNotifications([]);
//     } finally {
//       setLoadingNotifications(false);
//     }
//   }

//   // Fetch doctor info and notifications on mount or when userId changes
//   useEffect(() => {
//     fetchDoctorByUserId(userId);
//     fetchNotifications(userId);
//   }, [userId]);

//   // Close notification panel on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notifPanelRef.current && !notifPanelRef.current.contains(event.target)) {
//         setShowNotifications(false);
//       }
//     };
//     if (showNotifications) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showNotifications]);

//   // Render notifications panel
//   const renderNotifications = () => (
//     <div
//       ref={notifPanelRef}
//       style={{
//         position: 'absolute',
//         top: '36px',
//         left: '50%',
//         width: '320px',
//         maxHeight: '400px',
//         overflowY: 'auto',
//         backgroundColor: 'white',
//         boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//         borderRadius: '8px',
//         zIndex: 1000,
//         padding: '12px',
//         transform: 'translateX(-10%)',
//       }}
//     >
//       <h3
//         style={{
//           margin: '0 0 12px 0',
//           fontWeight: '600',
//           fontSize: '1.1rem',
//           borderBottom: '1px solid #eee',
//           paddingBottom: '6px',
//         }}
//       >
//         Notifications
//       </h3>

//       {loadingNotifications ? (
//         <p style={{ textAlign: 'center' }}>Loading...</p>
//       ) : notifications.length === 0 ? (
//         <p style={{ textAlign: 'center', color: '#888' }}>No notifications</p>
//       ) : (
//         notifications.map((notif) => (
//           <div
//             key={notif.id}
//             style={{
//               borderLeft: notif.read ? '4px solid #94a3b8' : '4px solid #22c55e',
//               backgroundColor: notif.read ? '#F9FAFB' : '#ECFFEF',
//               padding: '10px 12px',
//               borderRadius: '6px',
//               marginBottom: '10px',
//               cursor: 'default',
//               userSelect: 'none',
//             }}
//           >
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
//               <Bell size={16} color={notif.read ? '#64748B' : '#16A34A'} />
//               <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#111' }}>
//                 {(notif.notificationType || '').replace(/_/g, ' ').toUpperCase()}
//               </div>
//               {!notif.read && (
//                 <span
//                   style={{
//                     marginLeft: 'auto',
//                     backgroundColor: '#22c55e',
//                     color: 'white',
//                     borderRadius: '12px',
//                     padding: '2px 8px',
//                     fontSize: '0.75rem',
//                     fontWeight: '700',
//                   }}
//                 >
//                   New
//                 </span>
//               )}
//             </div>
//             <div style={{ fontSize: '0.9rem', color: '#333' }}>{notif.message || '(No message provided)'}</div>
//             <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
//               {notif.sentAt ? new Date(notif.sentAt).toLocaleString() : ''}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );

//   // Earnings chart render as per your layout
//   const renderEarningsChart = () => (
//     <div className="chart-container">
//       <svg className="w-full h-full" viewBox="0 0 400 128" preserveAspectRatio="none">
//         <defs>
//           <linearGradient id="doctorChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
//             <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
//             <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
//           </linearGradient>
//         </defs>
//         <path
//           d="M0,90 Q50,70 100,65 T200,60 T300,45 T400,50 L400,128 L0,128 Z"
//           fill="url(#doctorChartGradient)"
//         />
//         <path d="M0,90 Q50,70 100,65 T200,60 T300,45 T400,50" stroke="#3B82F6" strokeWidth="3" fill="none" />
//       </svg>
//     </div>
//   );

//   // Main dashboard render function
//   const renderDashboard = () => (
//     <div>
//       <div className="booking-header">
//         <h1 className="header-title">Welcome, Dr. {doctor?.user?.username || 'Loading...'}</h1>
//         <p className="header-subtitle">
//           Your medical practice dashboard. Manage patients and consultations efficiently.
//         </p>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
//           <div
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//               background: 'white',
//               padding: '8px 16px',
//               borderRadius: '8px',
//               boxShadow: '0 1px 3px rgba(255, 255, 255, 0.1)',
//             }}
//           >
//             {/* You can add quick info or buttons here */}
//           </div>
//           <div style={{ position: 'relative' }}>
//             <Bell
//               className="w-6 h-6"
//               style={{ color: '#6B7280', cursor: 'pointer' }}
//               onClick={() => setShowNotifications((prev) => !prev)}
//             />
//             {notifications.filter((notif) => !notif.read).length > 0 && (
//               <span
//                 style={{
//                   position: 'absolute',
//                   top: '-8px',
//                   right: '-8px',
//                   background: '#EF4444',
//                   color: 'white',
//                   fontSize: '12px',
//                   borderRadius: '50%',
//                   width: '20px',
//                   height: '20px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontWeight: '700',
//                 }}
//               >
//                 {notifications.filter((notif) => !notif.read).length}
//               </span>
//             )}
//             {showNotifications && renderNotifications()}
//           </div>
//         </div>
//       </div>

//       <div className="quick-actions-grid">
//         <div className="quick-action-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('connectvideo')}>
//           <Stethoscope className="video" />
//           <h3 className="quick-action-title">Start Consultation</h3>
//           <p className="quick-action-subtitle">Begin patient consultation</p>
//         </div>
//         <div className="quick-action-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('manageshedules')}>
//           <Calendar className="calender" />
//           <h3 className="quick-action-title">View Schedule</h3>
//           <p className="quick-action-subtitle">Manage your appointments</p>
//         </div>
//         <div className="quick-action-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('accpetappointments')}>
//           <Users className="document" />
//           <h3 className="quick-action-title">Appointments</h3>
//           <p className="quick-action-subtitle">Access medical histories</p>
//         </div>
//         <div className="quick-action-card">
//           <MessageSquare className="heart" />
//           <h3 className="quick-action-title">Messages</h3>
//           <p className="quick-action-subtitle">Patient communications</p>
//         </div>
//       </div>

//       <div className="main-grid">
//         <div className="left-column">
//           <div className="card">
//             <div className="card-header">
//               <h2 className="card-title">Practice Overview</h2>
//               <TrendingUp className="w-5 h-5" />
//             </div>
//             <div className="stats-grid">
//               <div className="stat-card blue">
//                 <div className="stat-number blue">{doctorStats.todayAppointments}</div>
//                 <div className="stat-label blue">Today's Apps</div>
//               </div>
//               <div className="stat-card green">
//                 <div className="stat-number green">{doctorStats.completedToday}</div>
//                 <div className="stat-label green">Completed</div>
//               </div>
//               <div className="stat-card orange">
//                 <div className="stat-number orange">{doctorStats.pendingConsultations}</div>
//                 <div className="stat-label orange">Pending</div>
//               </div>
//               <div className="stat-card purple">
//                 <div className="stat-number purple">{doctorStats.totalPatients}</div>
//                 <div className="stat-label purple">Total Patients</div>
//               </div>
//             </div>
//             {renderEarningsChart()}
//           </div>

   
//         </div>

//         <div className="right-column">
 
//           <div className="health-tips-card">
//             <h3 className="health-tips-title">Practice Insights</h3>
//             <p className="health-tips-text">
//               You've maintained a 95% patient satisfaction rate this month. Your average consultation time is 18
//               minutes, which is optimal for thorough care.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Patient list rendering (optional; called if you add tabs)
//   const renderPatientList = () => (
//     <div className="past-consultations-container">
//       <h2 className="past-consultations-title">Patient Management</h2>
//       <div className="past-consultations-empty">
//         <div className="past-consultations-icon-wrapper">
//           <div className="past-consultations-icon-inner">
//             <Users className="past-consultations-icon" />
//           </div>
//         </div>
//         <p className="past-consultations-empty-title">Patient records will appear here</p>
//         <p className="past-consultations-empty-subtitle">
//           View and manage all your patient consultations and medical histories.
//         </p>
//         <button className="past-consultations-btn">View All Patients</button>
//       </div>
//     </div>
//   );

//   // Main component render
//   return (
//     <div className="doctor-booking-container">
//       {activeTab === 'dashboard' && renderDashboard()}
//       {activeTab === 'patients' && renderPatientList()}
//     </div>
//   );
// };

// export default DoctorDashboard;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, Activity, Clock,
  FileText, Stethoscope, Star, Phone,
  Video, ChevronRight, TrendingUp, Bell,
  MessageSquare, DollarSign, Award,
  User, AlertCircle, CheckCircle
} from 'lucide-react';
import '../Patient/patientdashboard.css';

const DoctorDashboard = ({ onNavigate }) => {
  const [activeTab] = useState('dashboard');
  const navigate = useNavigate();

  // Doctor statistics (you can replace these with real data as needed)
  const doctorStats = {
    totalPatients: 8,
    todayAppointments: 8,
    completedToday: 0,
    pendingConsultations: 3,
    monthlyEarnings: 0,
    rating: 4.8,
    totalReviews: 8,
  };

  const [doctor, setDoctor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifPanelRef = useRef(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (doctor && doctor.id) {
      localStorage.setItem("doctorId", doctor.id);
    }
  }, [doctor]);

  // Fetch doctor data by userId
  async function fetchDoctorByUserId(userId) {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:9090/api/doctors/user/${userId}`);
      if (!response.ok) throw new Error('Doctor not found');
      const doctorData = await response.json();
      setDoctor(doctorData);
      console.log('Doctor data:', doctorData);
    } catch (error) {
      console.error('Failed to fetch doctor:', error);
      setDoctor(null);
    }
  }

  // Fetch notifications by userId
  async function fetchNotifications(userId) {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:9090/api/appointments/getNotifications/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }

  // Fetch doctor info and notifications on mount or when userId changes
  useEffect(() => {
    fetchDoctorByUserId(userId);
    fetchNotifications(userId);
  }, [userId]);

  // Close notification panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Function to mark notification as read when clicked
  const handleNotificationClick = async (notifId, isRead) => {
    if (isRead) {
      // Already read, no need to update
      return;
    }
    try {
      const response = await fetch(`http://localhost:9090/api/appointments/${notifId}/read?read=true`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Failed to update notification.');
      }

      // Update local notifications state to mark this notification as read
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === notifId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error updating notification read status:', error);
    }
  };

  // Render notifications panel
  const renderNotifications = () => (
    <div
      ref={notifPanelRef}
      style={{
        position: 'absolute',
        top: '36px',
        left: '50%',
        width: '320px',
        maxHeight: '400px',
        overflowY: 'auto',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        zIndex: 1000,
        padding: '12px',
        transform: 'translateX(-10%)',
      }}
    >
      <h3
        style={{
          margin: '0 0 12px 0',
          fontWeight: '600',
          fontSize: '1.1rem',
          borderBottom: '1px solid #eee',
          paddingBottom: '6px',
        }}
      >
        Notifications
      </h3>

      {loadingNotifications ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : notifications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No notifications</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            style={{
              borderLeft: notif.read ? '4px solid #94a3b8' : '4px solid #22c55e',
              backgroundColor: notif.read ? '#F9FAFB' : '#ECFFEF',
              padding: '10px 12px',
              borderRadius: '6px',
              marginBottom: '10px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => handleNotificationClick(notif.id, notif.read)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Bell size={16} color={notif.read ? '#64748B' : '#16A34A'} />
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#111' }}>
                {(notif.notificationType || '').replace(/_/g, ' ').toUpperCase()}
              </div>
              {!notif.read && (
                <span
                  style={{
                    marginLeft: 'auto',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                  }}
                >
                  New
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#333' }}>{notif.message || '(No message provided)'}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
              {notif.sentAt ? new Date(notif.sentAt).toLocaleString() : ''}
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Earnings chart render as per your layout
  const renderEarningsChart = () => (
    <div className="chart-container">
      <svg className="w-full h-full" viewBox="0 0 400 128" preserveAspectRatio="none">
        <defs>
          <linearGradient id="doctorChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0,90 Q50,70 100,65 T200,60 T300,45 T400,50 L400,128 L0,128 Z"
          fill="url(#doctorChartGradient)"
        />
        <path d="M0,90 Q50,70 100,65 T200,60 T300,45 T400,50" stroke="#3B82F6" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );

  // Main dashboard render function
  const renderDashboard = () => (
    <div>
      <div className="booking-header">
        <h1 className="header-title">Welcome, Dr. {doctor?.user?.username || 'Loading...'}</h1>
        <p className="header-subtitle">
          Your medical practice dashboard. Manage patients and consultations efficiently.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* You can add quick info or buttons here */}
          </div>
          <div style={{ position: 'relative' }}>
            <Bell
              className="w-6 h-6"
              style={{ color: '#6B7280', cursor: 'pointer' }}
              onClick={() => setShowNotifications((prev) => !prev)}
            />
            {notifications.filter((notif) => !notif.read).length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#EF4444',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                }}
              >
                {notifications.filter((notif) => !notif.read).length}
              </span>
            )}
            {showNotifications && renderNotifications()}
          </div>
        </div>
      </div>

      <div className="quick-actions-grid">
        <div className="quick-action-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('connectvideo')}>
          <Stethoscope className="video" />
          <h3 className="quick-action-title">Start Consultation</h3>
          <p className="quick-action-subtitle">Begin patient consultation</p>
        </div>
        <div className="quick-action-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('manageshedules')}>
          <Calendar className="calender" />
          <h3 className="quick-action-title">View Schedule</h3>
          <p className="quick-action-subtitle">Manage your appointments</p>
        </div>
        <div className="quick-action-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('accpetappointments')}>
          <Users className="document" />
          <h3 className="quick-action-title">Appointments</h3>
          <p className="quick-action-subtitle">Access medical histories</p>
        </div>
        {/* <div className="quick-action-card">
          <MessageSquare className="heart" />
          <h3 className="quick-action-title">Messages</h3>
          <p className="quick-action-subtitle">Patient communications</p>
        </div> */}
      </div>

      <div className="main-grid">
        <div className="left-column">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Practice Overview</h2>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-number blue">{doctorStats.todayAppointments}</div>
                <div className="stat-label blue">Today's Apps</div>
              </div>
              <div className="stat-card green">
                <div className="stat-number green">{doctorStats.completedToday}</div>
                <div className="stat-label green">Completed</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-number orange">{doctorStats.pendingConsultations}</div>
                <div className="stat-label orange">Pending</div>
              </div>
              <div className="stat-card purple">
                <div className="stat-number purple">{doctorStats.totalPatients}</div>
                <div className="stat-label purple">Total Patients</div>
              </div>
            </div>
            {renderEarningsChart()}
          </div>
        </div>

        <div className="right-column">
          <div className="health-tips-card">
            <h3 className="health-tips-title">Practice Insights</h3>
            <p className="health-tips-text">
              You've maintained a 95% patient satisfaction rate this month. Your average consultation time is 18
              minutes, which is optimal for thorough care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Patient list rendering (optional; called if you add tabs)
  const renderPatientList = () => (
    <div className="past-consultations-container">
      <h2 className="past-consultations-title">Patient Management</h2>
      <div className="past-consultations-empty">
        <div className="past-consultations-icon-wrapper">
          <div className="past-consultations-icon-inner">
            <Users className="past-consultations-icon" />
          </div>
        </div>
        <p className="past-consultations-empty-title">Patient records will appear here</p>
        <p className="past-consultations-empty-subtitle">
          View and manage all your patient consultations and medical histories.
        </p>
        <button className="past-consultations-btn">View All Patients</button>
      </div>
    </div>
  );

  // Main component render
  return (
    <div className="doctor-booking-container">
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'patients' && renderPatientList()}
    </div>
  );
};

export default DoctorDashboard;
