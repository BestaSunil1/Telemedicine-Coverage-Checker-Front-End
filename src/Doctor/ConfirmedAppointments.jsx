import React, { useState, useEffect } from 'react';
import { User, Calendar, Phone, Mail, FileText } from 'lucide-react';
import PrescriptionForm from './PrescriptionForm';
import './confirmed.css';

const API_BASE_URL = 'http://localhost:9090/api';

const ConfirmedAppointments = () => {
  const doctorId = localStorage.getItem('doctorId');
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [viewingPrescription, setViewingPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfirmedAppointments();
  }, []);

  const fetchConfirmedAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/appointments/confirmed/${doctorId}`);
      if (!res.ok) throw new Error('Failed to fetch confirmed appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

//   const fetchPrescription = async (patientId) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/prescriptions/patient/${patientId}`);
//       if (!res.ok) throw new Error('Failed to fetch prescription');
//       setViewingPrescription(await res.json());
//     } catch (e) {
//       console.error(e);
//     }
//   };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading confirmed appointments...</p>;
  }

  return (
    <div className="doctor-booking-container">
      <div className="booking-header">
        <h1 className="header-title">Provide Prescriptions</h1>
        <p className="header-subtitle">Add  prescriptions for confirmed patients</p>
      </div>

      {appointments.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No confirmed appointments found.</p>
      ) : (
        <div className="doctors-grid">
          {appointments.map((apt) => (
            <div key={apt.id} className="doctor-card">
              <div className="doctor-info">
                <div className="doctor-avatar"><User /></div>
                <div className="doctor-details">
                  <h3 className="doctor-name">{apt.patient?.user?.username}</h3>
                  <p>Gender: {apt.patient?.gender}</p>
                </div>
              </div>

              <p><Calendar /> {new Date(apt.appointmentDate).toLocaleString()}</p>
              <p><Phone /> {apt.patient?.contactNumber || 'N/A'}</p>
              <p><Mail /> {apt.patient?.user?.email || 'N/A'}</p>

              <button
                className="book-button"
                onClick={() => setSelectedAppointment(apt)}
              >
                Add Prescription
              </button>
              {/* <button
                className="consult-btn"
                style={{ marginTop: '8px' }}
                onClick={() => fetchPrescription(apt.patient?.id)}
              >
                View Prescription
              </button> */}
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding prescription */}
      {selectedAppointment && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setSelectedAppointment(null)}>
          <div className="modal-box">
            <h2>Add Prescription for {selectedAppointment.patient?.user?.username}</h2>
            <PrescriptionForm
              appointmentId={selectedAppointment.id}
              patientId={selectedAppointment.patient?.id}
              doctorName={selectedAppointment.doctor?.user?.username}
              onCompleted={() => {
                setSelectedAppointment(null);
                fetchConfirmedAppointments();
              }}
            />
            <button className="consult-btn" style={{ marginTop: '10px' }} onClick={() => setSelectedAppointment(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for viewing prescription */}
      {/* {viewingPrescription && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setViewingPrescription(null)}>
          <div className="modal-box">
            <h2>Prescription Details</h2>
            <pre>{JSON.stringify(viewingPrescription, null, 2)}</pre>
            <button className="consult-btn" onClick={() => setViewingPrescription(null)}>Close</button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ConfirmedAppointments;
