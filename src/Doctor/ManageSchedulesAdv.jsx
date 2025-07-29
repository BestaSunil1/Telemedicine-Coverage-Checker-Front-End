
// import React, { useState, useEffect } from 'react';
// import {
//   Calendar, Clock, Plus, Trash2,
//   X, AlertCircle, ChevronLeft, ChevronRight, User, Video
// } from 'lucide-react';
// import './manageschedules.css';

// const ManageSchedules = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showAddSlotModal, setShowAddSlotModal] = useState(false);
//   const [activeView, setActiveView] = useState('weekly'); // 'weekly' or 'monthly'
//   const [loading, setLoading] = useState(true);
//   const [appointments, setAppointments] = useState([]);
  
//   const [newSlot, setNewSlot] = useState({
//     startTime: '',
//     endTime: '',
//     slotDuration: 30,
//     consultationType: 'both',
//     maxPatients: 1,
//     isRecurring: false,
//     recurringDays: []
//   });

//   // Sample available slots data (you can replace this with API call later)
//   const [availableSlots, setAvailableSlots] = useState({
//     // '2025-07-30': [
//     //   { id: 8, startTime: '10:00', endTime: '11:00', type: 'Video Consultation', patient: null, status: 'available' },
//     // ]
//   });

//   // const doctorId = "688761c1a2051d108d3eeff5";
//   //  // You can make this dynamic
//     const doctorId = "68876155a2051d108d3eeff1"

//   const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//   const consultationTypes = [
//     { value: 'video', label: 'Video Only' },
    
//   ];

//   // Fetch appointments on component mount
//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:9093/api/appointments/doctorId/${doctorId}`);
//       const data = await response.json();
//       setAppointments(data);
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (date) => {
//     return date.toISOString().split('T')[0];
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: false 
//     });
//   };

//   // Convert API appointments to schedule format
//   const getScheduleData = () => {
//     const scheduleData = {};
    
//     // Add booked appointments from API
//     appointments.forEach(appointment => {
//       const appointmentDate = new Date(appointment.appointmentDate);
//       const dateKey = formatDate(appointmentDate);
//       const startTime = formatTime(appointment.appointmentDate);
//       // Assuming 1 hour duration, you can modify this based on your needs
//       const endTime = formatTime(new Date(appointmentDate.getTime() + 60 * 60 * 1000));
      
//       if (!scheduleData[dateKey]) {
//         scheduleData[dateKey] = [];
//       }
      
//       scheduleData[dateKey].push({
//         id: appointment.id,
//         startTime: startTime,
//         endTime: endTime,
//         type: 'Consultation', // You can determine this based on your data
//         patient: appointment.patient.user.username,
//         status: 'booked',
//         appointmentData: appointment
//       });
//     });

//     // Add available slots
//     Object.keys(availableSlots).forEach(dateKey => {
//       if (!scheduleData[dateKey]) {
//         scheduleData[dateKey] = [];
//       }
//       scheduleData[dateKey] = [...scheduleData[dateKey], ...availableSlots[dateKey]];
//     });

//     return scheduleData;
//   };

//   const getWeekDates = (date) => {
//     const week = [];
//     const startOfWeek = new Date(date);
//     const day = startOfWeek.getDay();
//     const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
//     startOfWeek.setDate(diff);

//     for (let i = 0; i < 7; i++) {
//       const weekDate = new Date(startOfWeek);
//       weekDate.setDate(startOfWeek.getDate() + i);
//       week.push(weekDate);
//     }
//     return week;
//   };

//   // const handleAddSlot = () => {
//   //   if (!selectedDate || !newSlot.startTime || !newSlot.endTime) {
//   //     alert('Please fill all required fields');
//   //     return;
//   //   }

//   //   const dateKey = formatDate(selectedDate);
//   //   const newSlotData = {
//   //     id: Date.now(),
//   //     startTime: newSlot.startTime,
//   //     endTime: newSlot.endTime,
//   //     type: newSlot.consultationType === 'video' ? 'Video Consultation' : 
//   //           newSlot.consultationType === 'inperson' ? 'In-person' : 'Both',
//   //     patient: null,
//   //     status: 'available'
//   //   };

//   //   setAvailableSlots(prev => ({
//   //     ...prev,
//   //     [dateKey]: [...(prev[dateKey] || []), newSlotData]
//   //   }));

//   //   // Reset form
//   //   setNewSlot({
//   //     startTime: '',
//   //     endTime: '',
//   //     slotDuration: 30,
//   //     consultationType: 'both',
//   //     maxPatients: 1,
//   //     isRecurring: false,
//   //     recurringDays: []
//   //   });
//   //   setShowAddSlotModal(false);
//   // };

//   // const handleDeleteSlot = (dateKey, slotId) => {
//   //   setAvailableSlots(prev => ({
//   //     ...prev,
//   //     [dateKey]: prev[dateKey] ? prev[dateKey].filter(slot => slot.id !== slotId) : []
//   //   }));
//   // };

//   const renderWeekView = () => {
//     const weekDates = getWeekDates(currentDate);
//     const scheduleData = getScheduleData();
    
//     return (
//       <div className="search-section">
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//           <h2 className="section-title">Weekly Schedule</h2>
//           <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//             <button 
//               className="consult-btn"
//               onClick={() => {
//                 const prevWeek = new Date(currentDate);
//                 prevWeek.setDate(currentDate.getDate() - 7);
//                 setCurrentDate(prevWeek);
//               }}
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//             <span style={{ fontSize: '16px', fontWeight: '600', minWidth: '200px', textAlign: 'center' }}>
//               {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
//             </span>
//             <button 
//               className="consult-btn"
//               onClick={() => {
//                 const nextWeek = new Date(currentDate);
//                 nextWeek.setDate(currentDate.getDate() + 7);
//                 setCurrentDate(nextWeek);
//               }}
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         <div className="doctors-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
//           {weekDates.map((date, index) => {
//             const dateKey = formatDate(date);
//             const daySchedule = scheduleData[dateKey] || [];
//             const isToday = formatDate(date) === formatDate(new Date());

//             return (
//               <div key={index} className="doctor-card" style={{ 
//                 minHeight: '300px',
//                 border: isToday ? '2px solid #10b981' : '2px solid #F3F4F6'
//               }}>
//                 <div style={{ textAlign: 'center', marginBottom: '15px' }}>
//                   <h3 style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>{weekDays[index]}</h3>
//                   <h2 style={{ margin: '5px 0', fontSize: '18px', color: '#1a1a1a' }}>{date.getDate()}</h2>
//                   {isToday && <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>Today</span>}
//                 </div>

//                 <div style={{ marginBottom: '15px' }}>
//                   {daySchedule.length === 0 ? (
//                     <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', margin: '20px 0' }}>
//                       No appointments
//                     </p>
//                   ) : (
//                     daySchedule.map(slot => (
//                       <div 
//                         key={slot.id}
//                         style={{
//                           padding: '8px',
//                           marginBottom: '8px',
//                           borderRadius: '6px',
//                           fontSize: '12px',
//                           backgroundColor: slot.status === 'booked' ? '#EFF6FF' : '#F0FDF4',
//                           border: `1px solid ${slot.status === 'booked' ? '#DBEAFE' : '#DCFCE7'}`
//                         }}
//                       >
//                         <div style={{ fontWeight: '600', marginBottom: '2px' }}>
//                           {slot.startTime} - {slot.endTime}
//                         </div>
//                         <div style={{ color: '#6b7280', marginBottom: '2px' }}>
//                           {slot.type}
//                         </div>
//                         {slot.patient && (
//                           <div style={{ color: '#059669', fontWeight: '500' }}>
//                             {slot.patient}
//                           </div>
//                         )}
//                         <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
//                           {slot.status === 'available' && (
//                             <button
//                               onClick={() => handleDeleteSlot(dateKey, slot.id)}
//                               style={{ 
//                                 background: 'none', 
//                                 border: 'none', 
//                                 cursor: 'pointer',
//                                 padding: '2px',
//                                 color: '#dc2626'
//                               }}
//                             >
//                               <Trash2 className="w-3 h-3" />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 {/* <button 
//                   className="book-button"
//                   style={{ fontSize: '12px', padding: '8px' }}
//                   onClick={() => {
//                     setSelectedDate(date);
//                     setShowAddSlotModal(true);
//                   }}
//                 >
//                   <Plus className="w-3 h-3" style={{ marginRight: '4px' }} />
//                   Add Slot
//                 </button> */}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   // const renderAddSlotModal = () => (
//   //   <div 
//   //     style={{
//   //       position: 'fixed',
//   //       top: 0,
//   //       left: 0,
//   //       right: 0,
//   //       bottom: 0,
//   //       backgroundColor: 'rgba(0,0,0,0.5)',
//   //       display: 'flex',
//   //       alignItems: 'center',
//   //       justifyContent: 'center',
//   //       zIndex: 1000,
//   //       padding: '20px'
//   //     }}
//   //     onClick={(e) => {
//   //       if (e.target === e.currentTarget) {
//   //         setShowAddSlotModal(false);
//   //       }
//   //     }}
//   //   >
//   //     <div style={{
//   //       backgroundColor: 'white',
//   //       borderRadius: '15px',
//   //       maxWidth: '500px',
//   //       width: '100%',
//   //       maxHeight: '90vh',
//   //       overflow: 'auto'
//   //     }}>
//   //       <div className="booking-header" style={{ margin: 0, borderRadius: '15px 15px 0 0', position: 'relative' }}>
//   //         <h2 className="header-title" style={{ fontSize: '1.5rem', margin: 0, paddingRight: '60px' }}>
//   //           Add Time Slot
//   //         </h2>
//   //         <p className="header-subtitle" style={{ margin: '5px 0 0 0' }}>
//   //           {selectedDate && selectedDate.toLocaleDateString()}
//   //         </p>
//   //         <button 
//   //           onClick={() => setShowAddSlotModal(false)}
//   //           style={{
//   //             position: 'absolute',
//   //             top: '50%',
//   //             right: '20px',
//   //             transform: 'translateY(-50%)',
//   //             background: 'rgba(255,255,255,0.3)',
//   //             border: '2px solid rgba(255,255,255,0.5)',
//   //             borderRadius: '50%',
//   //             width: '40px',
//   //             height: '40px',
//   //             display: 'flex',
//   //             alignItems: 'center',
//   //             justifyContent: 'center',
//   //             cursor: 'pointer',
//   //             color: 'white'
//   //           }}
//   //         >
//   //           <X className="w-5 h-5" />
//   //         </button>
//   //       </div>

//   //       <div className="booking-form">
//   //         <div className="date-time-container">
//   //           <div className="date-container">
//   //             <label className="form-label">
//   //               <Clock className="label-icon" />
//   //               Start Time
//   //             </label>
//   //             <input
//   //               type="time"
//   //               className="date-input"
//   //               value={newSlot.startTime}
//   //               onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
//   //             />
//   //           </div>
//   //           <div className="date-container">
//   //             <label className="form-label">
//   //               <Clock className="label-icon" />
//   //               End Time
//   //             </label>
//   //             <input
//   //               type="time"
//   //               className="date-input"
//   //               value={newSlot.endTime}
//   //               onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
//   //             />
//   //           </div>
//   //         </div>

//   //         <div style={{ marginBottom: '20px' }}>
//   //           <label className="form-label">
//   //             <Video className="label-icon" />
//   //             Consultation Type
//   //           </label>
//   //           <select
//   //             className="specialty-select"
//   //             value={newSlot.consultationType}
//   //             onChange={(e) => setNewSlot(prev => ({ ...prev, consultationType: e.target.value }))}
//   //           >
//   //             {consultationTypes.map(type => (
//   //               <option key={type.value} value={type.value}>{type.label}</option>
//   //             ))}
//   //           </select>
//   //         </div>

//   //         <div style={{ marginBottom: '20px' }}>
//   //           <label className="form-label">
//   //             <User className="label-icon" />
//   //             Max Patients per Slot
//   //           </label>
//   //           <input
//   //             type="number"
//   //             className="date-input"
//   //             min="1"
//   //             max="5"
//   //             value={newSlot.maxPatients}
//   //             onChange={(e) => setNewSlot(prev => ({ ...prev, maxPatients: parseInt(e.target.value) }))}
//   //           />
//   //         </div>

//   //         <div style={{ display: 'flex', gap: '10px' }}>
//   //           <button 
//   //             className="book-button"
//   //             onClick={handleAddSlot}
//   //             style={{ flex: 1 }}
//   //           >
//   //             <Plus className="w-4 h-4" style={{ marginRight: '8px' }} />
//   //             Add Time Slot
//   //           </button>
//   //           <button 
//   //             className="consult-btn"
//   //             onClick={() => setShowAddSlotModal(false)}
//   //             style={{ flex: 1, backgroundColor: '#6b7280' }}
//   //           >
//   //             Cancel
//   //           </button>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );

//   const renderMonthView = () => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();
//     const scheduleData = getScheduleData();
    
//     // Get first day of month and how many days in month
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();
    
//     // Create array of all dates to display (including previous/next month dates)
//     const calendarDates = [];
    
//     // Add dates from previous month to fill the first week
//     const prevMonth = new Date(year, month - 1, 0);
//     const prevMonthDays = prevMonth.getDate();
//     for (let i = startingDayOfWeek - 1; i >= 0; i--) {
//       const date = new Date(year, month - 1, prevMonthDays - i);
//       calendarDates.push({ date, isCurrentMonth: false });
//     }
    
//     // Add all dates from current month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       calendarDates.push({ date, isCurrentMonth: true });
//     }
    
//     // Add dates from next month to fill the last week
//     const remainingSlots = 42 - calendarDates.length; // 6 weeks * 7 days = 42
//     for (let day = 1; day <= remainingSlots; day++) {
//       const date = new Date(year, month + 1, day);
//       calendarDates.push({ date, isCurrentMonth: false });
//     }

//     return (
//       <div className="search-section">
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//           <h2 className="section-title">Monthly Schedule</h2>
//           <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//             <button 
//               className="consult-btn"
//               onClick={() => {
//                 const prevMonth = new Date(currentDate);
//                 prevMonth.setMonth(currentDate.getMonth() - 1);
//                 setCurrentDate(prevMonth);
//               }}
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//             <span style={{ fontSize: '16px', fontWeight: '600', minWidth: '200px', textAlign: 'center' }}>
//               {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//             </span>
//             <button 
//               className="consult-btn"
//               onClick={() => {
//                 const nextMonth = new Date(currentDate);
//                 nextMonth.setMonth(currentDate.getMonth() + 1);
//                 setCurrentDate(nextMonth);
//               }}
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Calendar Header */}
//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(7, 1fr)', 
//           gap: '2px', 
//           marginBottom: '10px' 
//         }}>
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <div key={day} style={{
//               padding: '10px',
//               backgroundColor: '#f8f9fa',
//               textAlign: 'center',
//               fontWeight: '600',
//               fontSize: '14px',
//               color: '#6b7280'
//             }}>
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Calendar Grid */}
//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(7, 1fr)', 
//           gap: '2px',
//           backgroundColor: '#e5e7eb'
//         }}>
//           {calendarDates.map((dateObj, index) => {
//             const { date, isCurrentMonth } = dateObj;
//             const dateKey = formatDate(date);
//             const daySchedule = scheduleData[dateKey] || [];
//             const isToday = formatDate(date) === formatDate(new Date());
//             const totalSlots = daySchedule.length;
//             const bookedSlots = daySchedule.filter(slot => slot.status === 'booked').length;

//             return (
//               <div 
//                 key={index} 
//                 style={{
//                   backgroundColor: 'white',
//                   minHeight: '120px',
//                   padding: '8px',
//                   opacity: isCurrentMonth ? 1 : 0.3,
//                   border: isToday ? '2px solid #10b981' : 'none',
//                   cursor: 'pointer'
//                 }}
//                 onClick={() => {
//                   if (isCurrentMonth) {
//                     setSelectedDate(date);
//                     // setShowAddSlotModal(true);
//                   }
//                 }}
//               >
//                 <div style={{ 
//                   textAlign: 'center', 
//                   marginBottom: '8px',
//                   fontSize: '14px',
//                   fontWeight: isToday ? '700' : '500',
//                   color: isToday ? '#10b981' : isCurrentMonth ? '#1a1a1a' : '#9ca3af'
//                 }}>
//                   {date.getDate()}
//                 </div>

//                 {isCurrentMonth && totalSlots > 0 && (
//                   <div style={{ fontSize: '10px', textAlign: 'center' }}>
//                     <div style={{ 
//                       backgroundColor: '#dbeafe', 
//                       borderRadius: '4px', 
//                       padding: '2px 4px', 
//                       marginBottom: '2px',
//                       color: '#1e40af'
//                     }}>
//                       {totalSlots} slot{totalSlots !== 1 ? 's' : ''}
//                     </div>
//                     {bookedSlots > 0 && (
//                       <div style={{ 
//                         backgroundColor: '#dcfce7', 
//                         borderRadius: '4px', 
//                         padding: '2px 4px',
//                         color: '#166534'
//                       }}>
//                         {bookedSlots} booked
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {isCurrentMonth && totalSlots === 0 && (
//                   <div style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: '60px',
//                     opacity: 0.5
//                   }}>
//                     {/* <Plus className="w-4 h-4" style={{ color: '#9ca3af' }} /> */}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   // Calculate stats from real data
//   const calculateStats = () => {
//     const scheduleData = getScheduleData();
//     const currentWeekDates = getWeekDates(currentDate);
    
//     let weeklyAvailable = 0;
//     let weeklyBooked = 0;
//     let totalHours = 0;
//     let videoConsultations = 0;

//     currentWeekDates.forEach(date => {
//       const dateKey = formatDate(date);
//       const daySchedule = scheduleData[dateKey] || [];
      
//       daySchedule.forEach(slot => {
//         if (slot.status === 'available') {
//           weeklyAvailable++;
//         } else if (slot.status === 'booked') {
//           weeklyBooked++;
//           if (slot.type.toLowerCase().includes('video')) {
//             videoConsultations++;
//           }
//         }
        
//         // Calculate hours (assuming 1 hour slots, you can modify this)
//         totalHours += 1;
//       });
//     });

//     return {
//       weeklyAvailable,
//       weeklyBooked,
//       totalHours,
//       videoConsultations
//     };
//   };

//   const stats = calculateStats();

//   if (loading) {
//     return (
//       <div className="doctor-booking-container" style={{ textAlign: 'center', padding: '50px' }}>
//         <div>Loading appointments...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="doctor-booking-container">
//       <div className="booking-header">
//         <h1 className="header-title">Manage Schedules</h1>
//         <p className="header-subtitle">Set your availability and manage appointment time slots</p>
        
//         <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
//           <button 
//             className={activeView === 'weekly' ? 'nav-btn nav-btn-active' : 'nav-btn'}
//             onClick={() => setActiveView('weekly')}
//           >
//             Weekly View
//           </button>
//           <button 
//             className={activeView === 'monthly' ? 'nav-btn nav-btn-active' : 'nav-btn'}
//             onClick={() => setActiveView('monthly')}
//           >
//             Monthly View
//           </button>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="doctors-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '30px' }}>
//         <div className="card" style={{ textAlign: 'center' }}>
//           <Calendar className="w-8 h-8" style={{ color: '#10b981', margin: '0 auto 10px' }} />
//           <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#1a1a1a' }}>{stats.weeklyAvailable}</h3>
//           <p style={{ margin: 0, color: '#6b7280' }}>Available Slots This Week</p>
//         </div>
//         <div className="card" style={{ textAlign: 'center' }}>
//           <User className="w-8 h-8" style={{ color: '#3b82f6', margin: '0 auto 10px' }} />
//           <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#1a1a1a' }}>{stats.weeklyBooked}</h3>
//           <p style={{ margin: 0, color: '#6b7280' }}>Booked Appointments</p>
//         </div>
//         <div className="card" style={{ textAlign: 'center' }}>
//           <Clock className="w-8 h-8" style={{ color: '#f59e0b', margin: '0 auto 10px' }} />
//           <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#1a1a1a' }}>{stats.totalHours}</h3>
//           <p style={{ margin: 0, color: '#6b7280' }}>Hours This Week</p>
//         </div>
//         <div className="card" style={{ textAlign: 'center' }}>
//           <Video className="w-8 h-8" style={{ color: '#8b5cf6', margin: '0 auto 10px' }} />
//           <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#1a1a1a' }}>{stats.videoConsultations}</h3>
//           <p style={{ margin: 0, color: '#6b7280' }}>Virtual Consultations</p>
//         </div>
//       </div>

//       {activeView === 'weekly' && renderWeekView()}
//       {activeView === 'monthly' && renderMonthView()}

//       {showAddSlotModal && renderAddSlotModal()}
//     </div>
//   );
// };

// export default ManageSchedules;