import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './zoom.css';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [joinUrl, setJoinUrl] = useState(null);
  const [loadingMeeting, setLoadingMeeting] = useState(false);
 
  const patientId = localStorage.getItem('patientId');

  useEffect(() => {
    async function fetchConfirmedAppointments() {
      if (!patientId) return;
      try {
        const res = await axios.get(`http://localhost:9090/api/appointments/patient/conform/${patientId}`);
        setAppointments(res.data);
      } catch (err) {
        console.error('Error fetching patient confirmed appointments:', err);
      }
    }
    fetchConfirmedAppointments();
  }, [patientId]);
  console.log(appointments);
  
  const canJoinMeeting = (scheduledAt) => {
    const appointmentTime = new Date(scheduledAt);
    const now = new Date();
    return now >= new Date(appointmentTime.getTime() - 15 * 60000) && now <= new Date(appointmentTime.getTime() + 60 * 60000);
  };

  const joinMeeting = async (appointment) => {
    setLoadingMeeting(true);
    try {
      const res = await axios.post('http://localhost:9090/api/zoom/meeting', {
        topic: `Appointment with Dr. ${appointment.doctor.user.username}`,
        type: 1,
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      setJoinUrl(data.join_url);
    } catch (err) {
      console.error('Error creating Zoom meeting:', err);
    } finally {
      setLoadingMeeting(false);
    }
  };

  if (joinUrl) {
    return (
      <div className="join-container">
        <h2>Join Your Appointment Meeting</h2>
        <a href={joinUrl} target="_blank" rel="noopener noreferrer">Click here to join meeting</a>
        <button onClick={() => setJoinUrl(null)}>Back to Appointments</button>
      </div>
    );
  }
console.log(joinUrl)
  return (
    <div className="appointments-container">
      <h2>Your Confirmed Appointments</h2>
      {appointments.length === 0 ? (
        <p>No confirmed appointments found.</p>
      ) : (
        appointments.map((apt) => (
          <div key={apt.id} className="appointment-card">
            <p><b>Doctor:</b> Dr. {apt.doctor.user.username}</p>
            <p><b>Scheduled At:</b> {new Date(apt.appointmentDate).toLocaleString()}</p>
            {canJoinMeeting(apt.appointmentDate) ? (
              <button className="button-primary" onClick={() => joinMeeting(apt)} disabled={loadingMeeting}>
                {loadingMeeting ? 'Joining...' : 'Join Video Meet'}
              </button>
            ) : (
              <button className="button-primary" disabled>Join Available 15 mins Before</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
