

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, Phone, Mail,
  MapPin, FileText, Check, X, AlertCircle,
  Video, MessageSquare, Star, ChevronRight
} from 'lucide-react';
import '../Patient/patientdashboard.css';

const AcceptAppointment = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Replace this with the actual doctor ID from your authentication context
  // const doctorId = "68876155a2051d108d3eeff1"; // You should get this from your auth context/localStorage
  const doctorId = localStorage.getItem('doctorId');

  const API_BASE_URL = 'http://localhost:9090/api/appointments';

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/pending/${doctorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const appointments = await response.json();
      setPendingAppointments(appointments);
    } catch (error) {
      console.error('Error fetching pending appointments:', error);
      setError('Failed to load pending appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      setProcessing(true);
      
      const response = await fetch(`${API_BASE_URL}/${appointmentId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctorId,
          status: 'CONFIRMED' // or whatever status your backend expects
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Close modal and refresh appointments
      setShowModal(false);
      setSelectedAppointment(null);
      setResponseMessage('');
      
      // Refresh the pending appointments list
      await fetchPendingAppointments();
      
      alert('Appointment accepted successfully!');
    } catch (error) {
      console.error('Error accepting appointment:', error);
      alert('Failed to accept appointment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    try {
      setProcessing(true);
      
      const response = await fetch(`${API_BASE_URL}/${appointmentId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctorId,
          reason: responseMessage || 'No reason provided',
          status: 'REJECTED'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Close modal and refresh appointments
      setShowModal(false);
      setSelectedAppointment(null);
      setResponseMessage('');
      
      // Refresh the pending appointments list
      await fetchPendingAppointments();
      
      alert('Appointment declined successfully!');
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      alert('Failed to decline appointment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return { bg: '#FFF7ED', text: '#EA580C', border: '#FDBA74' };
      case 'BOOKED': return { bg: '#EFF6FF', text: '#2563EB', border: '#93C5FD' };
      case 'CONFIRMED': return { bg: '#F0FDF4', text: '#16A34A', border: '#86EFAC' };
      case 'REJECTED': return { bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5' };
      default: return { bg: '#F9FAFB', text: '#374151', border: '#D1D5DB' };
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return dateTimeString;
    }
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateTimeString;
    }
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const time = new Date(dateTimeString);
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return dateTimeString;
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="doctor-booking-container">
        <div className="booking-header">
          <h1 className="header-title">Appointment Requests</h1>
          <p className="header-subtitle">Loading pending appointments...</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-booking-container">
        <div className="booking-header">
          <h1 className="header-title">Appointment Requests</h1>
          <p className="header-subtitle">Error loading appointments</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px', gap: '15px' }}>
          <div style={{ color: '#DC2626', textAlign: 'center' }}>{error}</div>
          <button className="book-button" onClick={fetchPendingAppointments}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-booking-container">
      <div className="booking-header">
        <h1 className="header-title">Appointment Requests</h1>
        <p className="header-subtitle">Review and manage incoming patient appointment requests</p>
      </div>

      <div className="search-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="section-title">Pending Requests ({pendingAppointments.length})</h2>
          <button className="consult-btn" onClick={fetchPendingAppointments} disabled={loading}>
            Refresh
          </button>
        </div>
        
        {pendingAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Calendar style={{ width: '48px', height: '48px', margin: '0 auto 20px', color: '#9CA3AF' }} />
            <h3 style={{ color: '#6B7280', marginBottom: '10px' }}>No Pending Appointments</h3>
            <p style={{ color: '#9CA3AF' }}>You have no pending appointment requests at the moment.</p>
          </div>
        ) : (
          <div className="doctors-grid">
            {pendingAppointments.map((appointment) => {
              const statusStyle = getStatusColor(appointment.status);
              const patientAge = calculateAge(appointment.patient?.dateOfBirth);
              
              return (
                <div key={appointment.id} className="doctor-card">
                  <div className="doctor-info">
                    <div className="doctor-avatar">
                      <User />
                    </div>
                    <div className="doctor-details">
                      <h3 className="doctor-name">Patient Name: {appointment.patient?.user?.username || 'N/A'}</h3>
                      <p className="doctor-specialty"><b>Age: </b>
                        {patientAge !== 'N/A' ? `${patientAge} years` : 'Age N/A'} &nbsp;&nbsp;
                        Gender: {appointment.patient?.gender || 'Gender N/A'}
                      </p>
                      <div className="doctor-meta">
                        <div className="rating">
                          <Phone className="w-4 h-4" />
                          <span>Phone Number: {appointment.patient?.contactNumber || 'N/A'}</span>
                        </div>
                        <span className="experience"><b>Email: </b>
                          {appointment.patient?.user?.email || 'No email'}
                        </span>
                      </div>
                    </div>
                    <div 
                      style={{ 
                        backgroundColor: statusStyle.bg, 
                        color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {appointment.status || 'PENDING'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <div className="location" style={{ marginBottom: '8px' }}>
                      <Calendar className="location-icon" />
                      <span>
                        {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}
                      </span>
                    </div>
                    <div className="location" style={{ marginBottom: '8px' }}>
                      <Video className="location-icon" />
                      <span>Virtual Consultation</span>
                    </div>
                    <div className="location">
                      <Clock className="location-icon" />
                      <span>Requested {formatDateTime(appointment.createdAt)}</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <p style={{ fontSize: '14px', color: '#374151', margin: '0', fontWeight: '500' }}>
                      Insurance: {appointment.insuranceCoverageStatus || 'Not checked'}
                    </p>
                  </div>

                  <button 
                    className="book-button"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    View Details & Respond
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for appointment details */}
      {showModal && selectedAppointment && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <div className="booking-header" style={{ margin: 0, borderRadius: '15px 15px 0 0', position: 'relative' }}>
              <h2 className="header-title" style={{ fontSize: '1.8rem', margin: 0, paddingRight: '60px' }}>Appointment Request Details</h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setSelectedAppointment(null);
                  setResponseMessage('');
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '20px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.3)',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ padding: '30px' }}>
              {/* Patient Information */}
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#161a46' }}>Patient Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <div className="location">
                      <User className="location-icon" />
                      <span><strong>Name: {selectedAppointment.patient?.user?.username || 'N/A'}</strong></span>
                    </div>
                  </div>
                  <div>
                    <div className="location">
                      <Phone className="location-icon" />
                      <span>Phone Number{selectedAppointment.patient?.contactNumber || 'N/A'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="location">
                      <Mail className="location-icon" />
                      <span>{selectedAppointment.patient?.user?.email || 'N/A'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="location">
                      <Calendar className="location-icon" />
                      <span>
                        Age: {calculateAge(selectedAppointment.patient?.dateOfBirth)} years
                        ({selectedAppointment.patient?.gender || 'N/A'})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#161a46' }}>Appointment Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <div className="location">
                      <Calendar className="location-icon" />
                      <span>
                        <strong>Date & Time:</strong> {formatDateTime(selectedAppointment.appointmentDate)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="location">
                      <AlertCircle className="location-icon" />
                      <span>Status: <span style={{ 
                        ...getStatusColor(selectedAppointment.status),
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>{selectedAppointment.status || 'PENDING'}</span></span>
                    </div>
                  </div>
                  <div>
                    <div className="location">
                      <Video className="location-icon" />
                      <span>Virtual Consultation</span>
                    </div>
                  </div>
                  <div>
                    <div className="location">
                      <Clock className="location-icon" />
                      <span>Requested: {formatDateTime(selectedAppointment.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#161a46' }}>Insurance Information</h3>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Coverage Status:</strong>
                  <p style={{ margin: '5px 0 0 0', padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                    {selectedAppointment.insuranceCoverageStatus || 'Not checked'}
                  </p>
                </div>
                <div>
                  <strong>Coverage Check Date:</strong>
                  <p style={{ margin: '5px 0 0 0', padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                    {selectedAppointment.coverageCheckDate ? formatDateTime(selectedAppointment.coverageCheckDate) : 'Not checked'}
                  </p>
                </div>
              </div>

              {/* Doctor Information */}
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#161a46' }}>Doctor Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <div className="location">
                      <User className="location-icon" />
                      <span><strong>Dr. {selectedAppointment.doctor?.user?.username || 'N/A'}</strong></span>
                    </div>
                  </div>
                  <div>
                    <div className="location">
                      <Star className="location-icon" />
                      <span>
                        Specializations: {selectedAppointment.doctor?.specializations?.join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="location">
                      <AlertCircle className="location-icon" />
                      <span>Status: {selectedAppointment.doctor?.active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Only show if status is BOOKED or PENDING */}
              {(selectedAppointment.status === 'BOOKED' || selectedAppointment.status === 'PENDING') && (
                <div className="card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#161a46' }}>Actions</h3>
                  
                  {/* Accept Option */}
                  <div style={{ marginBottom: '20px' }}>
                    <button 
                      className="book-button"
                      style={{ 
                        width: '100%', 
                        opacity: processing ? 0.6 : 1,
                        marginBottom: '10px'
                      }}
                      onClick={() => handleAcceptAppointment(selectedAppointment.id)}
                      disabled={processing}
                    >
                      <Check className="w-4 h-4" style={{ marginRight: '8px', display: 'inline' }} />
                      {processing ? 'Processing...' : 'Accept Appointment'}
                    </button>
                  </div>

                  {/* Reject Option */}
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '10px', color: '#374151' }}>Or Decline with Message:</h4>
                    <textarea
                      className="search-input"
                      style={{ 
                        width: '100%', 
                        minHeight: '80px', 
                        paddingLeft: '12px',
                        marginBottom: '10px',
                        resize: 'vertical'
                      }}
                      placeholder="Provide reason for declining (optional)"
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      disabled={processing}
                    />
                    <button 
                      className="consult-btn"
                      style={{ backgroundColor: '#DC2626', opacity: processing ? 0.6 : 1 }}
                      onClick={() => handleRejectAppointment(selectedAppointment.id)}
                      disabled={processing}
                    >
                      <X className="w-4 h-4" style={{ marginRight: '8px', display: 'inline' }} />
                      {processing ? 'Processing...' : 'Decline Appointment'}
                    </button>
                  </div>
                </div>
              )}

              {/* Show message if appointment is already processed */}
              {selectedAppointment.status !== 'BOOKED' && selectedAppointment.status !== 'PENDING' && (
                <div className="card">
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    color: '#6B7280'
                  }}>
                    <AlertCircle style={{ width: '24px', height: '24px', margin: '0 auto 10px' }} />
                    <p>This appointment has already been {selectedAppointment.status?.toLowerCase() || 'processed'}.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptAppointment;