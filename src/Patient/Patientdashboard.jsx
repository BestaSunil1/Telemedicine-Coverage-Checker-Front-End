
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Calendar, User, Activity, Clock,
  FileText, Heart, Phone,
  Video, ChevronRight, TrendingUp, Bell
} from 'lucide-react';
import './patientdashboard.css';

const PatientDashboard = ({ onNavigate }) => {
  const [activeTab] = useState('dashboard');
  const navigate = useNavigate();


  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Ref for detecting outside clicks
  const notifPanelRef = useRef(null);

  const userId = "customUserId123"; // Replace with dynamic user id

  // Fetch notifications
  useEffect(() => {
    fetch(`http://localhost:9093/api/appointments/getNotifications/${userId}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(Array.isArray(data) ? data : []);
        setLoadingNotifications(false);
      })
      .catch(() => {
        setNotifications([]);
        setLoadingNotifications(false);
      });
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

  // --- Render notifications dropdown panel ---
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
      <h3 style={{ margin: '0 0 12px 0', fontWeight: '600', fontSize: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>
        Notifications
      </h3>

      {loadingNotifications ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : notifications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No notifications</p>
      ) : (
        notifications.map(notif => (
          <div
            key={notif.id}
            style={{
              borderLeft: notif.read ? '4px solid #94a3b8' : '4px solid #22c55e',
              backgroundColor: notif.read ? '#F9FAFB' : '#ECFFEF',
              padding: '10px 12px',
              borderRadius: '6px',
              marginBottom: '10px',
              cursor: 'default',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Bell size={16} color={notif.read ? '#64748B' : '#16A34A'} />
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#111' }}>
                {(notif.notificationType || '').replace(/_/g, ' ').toUpperCase()}
              </div>
              {!notif.read && (
                <span style={{
                  marginLeft: 'auto',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                }}>
                  New
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#333' }}>
              {notif.message || '(No message provided)'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
              {notif.sentAt ? new Date(notif.sentAt).toLocaleString() : ''}
            </div>
          </div>
        ))
      )}
    </div>
  );

  // ---- Chart rendering utility ----
  const renderConsultationChart = () => (
    <div className="chart-container">
      <svg className="w-full h-full" viewBox="0 0 400 128" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0,80 Q50,60 100,65 T200,70 T300,55 T400,60 L400,128 L0,128 Z"
          fill="url(#chartGradient)"
        />
        <path
          d="M0,80 Q50,60 100,65 T200,70 T300,55 T400,60"
          stroke="#4CAF50"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </div>
  );

  // ---- Sample dummy stats ----
  const consultationStats = {
    total: 0,
    thisMonth: 0,
    completed: 0,
    upcoming: 0,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'consultation',
      title: 'Video Consultation',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-07-20',
      status: 'completed',
    },
  ];

  const upcomingAppointments = [];

  // ---- Main dashboard UI ----
  const renderDashboard = () => (
    <>
      <div className="booking-header" style={{ position: 'relative' }}>
        <h1 className="header-title">Welcome to Sunil Health Care</h1>
        <p className="header-subtitle">Your health, our priority. Connect with certified doctors anytime.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'white',
            padding: '8px 16px', borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(255, 255, 255, 0.1)'
          }}>
            {/* You can add notification icon or other quick info here */}
          </div>

          <div style={{ position: 'relative' }}>
            <Bell
              className="w-6 h-6"
              style={{ color: '#6B7280', cursor: 'pointer' }}
              onClick={() => setShowNotifications(prev => !prev)}
            />
            {notifications.filter(notif => !notif.read).length > 0 && (
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
                {notifications.filter(notif => !notif.read).length}
              </span>
            )}
            {showNotifications && renderNotifications()}
          </div>
        </div>
      </div>

      <div className="quick-actions-grid">
 
        <div
          className="quick-action-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigate('connectvideo')}
        >
          <Video className="video" />
          <h3 className="quick-action-title">Start Consultation</h3>
          <p className="quick-action-subtitle">Connect with doctor now</p>
        </div>

        <div
          className="quick-action-card"
          style={{ cursor: 'pointer'}}
          onClick={() => onNavigate('bookappointment')}
        >
          <Calendar className="calender" />
          <h3 className="quick-action-title">Book Appointment</h3>
          <p className="quick-action-subtitle">Schedule new consultation</p>
        </div>
        <div 
          className="quick-action-card"
          style={{cursor: 'pointer'}}
          onClick={() => onNavigate('prescription')}
        >
          <FileText className="document" />
          <h3 className="quick-action-title">Medical Records</h3>
          <p className="quick-action-subtitle">View your health data</p>
        </div>
        <div className="quick-action-card">
          <Heart className="heart" />
          <h3 className="quick-action-title">Health Tracker</h3>
          <p className="quick-action-subtitle">Monitor vital signs</p>
        </div>
      </div>

      <div className="main-grid">
        <div className="left-column">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Consultation Overview</h2>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-number blue">{consultationStats.total}</div>
                <div className="stat-label blue">Total</div>
              </div>
              <div className="stat-card green">
                <div className="stat-number green">{consultationStats.completed}</div>
                <div className="stat-label green">Completed</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-number orange">{consultationStats.upcoming}</div>
                <div className="stat-label orange">Upcoming</div>
              </div>
              <div className="stat-card purple">
                <div className="stat-number purple">{consultationStats.thisMonth}</div>
                <div className="stat-label purple">This Month</div>
              </div>
            </div>
            {renderConsultationChart()}
          </div>

          <div className="card">
            <h2 className="card-title">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <div className="empty-state">
                <Activity className="empty-state-icon" />
                <p className="empty-state-title">No recent activity</p>
                <p className="empty-state-subtitle">Your consultation history will appear here</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon-container">
                      <Video className="activity-icon" />
                    </div>
                    <div className="activity-content">
                      <h3 className="activity-title">{activity.title}</h3>
                      <p className="activity-doctor">with {activity.doctor}</p>
                      <p className="activity-date">{activity.date}</p>
                    </div>
                    <ChevronRight className="activity-chevron" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="right-column">
          <div className="card">
            <h2 className="card-title">Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <div className="empty-state">
                <Calendar className="w-12 h-12 mx-auto mb-3" />
                <p className="empty-state-title">No upcoming appointments</p>
                <button className="btn-secondary" onClick={() => onNavigate('bookappointment')}>Book Appointment</button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-content">
                      <Clock className="appointment-icon" />
                      <div>
                        <p className="appointment-doctor">{appointment.doctor}</p>
                        <p className="appointment-date">{appointment.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* The notifications panel is now toggled by bell icon, so no need to render here. */}

          <div className="emergency-card">
            <h3 className="emergency-title">Emergency Contact</h3>
            <div className="emergency-list">
              <div className="emergency-item">
                <Phone className="emergency-icon" />
                <span className="emergency-text">108 - Emergency</span>
              </div>
              <div className="emergency-item">
                <Phone className="emergency-icon" />
                <span className="emergency-text">102 - Medical Helpline</span>
              </div>
            </div>
          </div>

          <div className="health-tips-card">
            <h3 className="health-tips-title">Today's Health Tip</h3>
            <p className="health-tips-text">
              Stay hydrated! Drink at least 8 glasses of water daily to maintain optimal health and support your immune system.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  // ---- Past Consultations ----
  const renderPastConsultations = () => (
    <div className="past-consultations-container">
      <h2 className="past-consultations-title">Past Consultations</h2>
      <div className="past-consultations-empty">
        <div className="past-consultations-icon-wrapper">
          <div className="past-consultations-icon-inner">
            <User className="past-consultations-icon" />
          </div>
        </div>
        <p className="past-consultations-empty-title">No consultations found!</p>
        <p className="past-consultations-empty-subtitle">Your consultation history will appear here once you start using our services.</p>
        <button className="past-consultations-btn">Book Your First Consultation</button>
      </div>
    </div>
  );

  // ---- Main Return ----
  return (
    <div className="doctor-booking-container">
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'past-consultations' && renderPastConsultations()}
    </div>
  );
};

export default PatientDashboard;
