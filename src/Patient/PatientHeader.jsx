
import React, { useState } from "react";
import './PatientHeader.css';  // your CSS styles for header and mainContent

// Import your page components — make sure these exist!
import BookAppointment from "./BookAppointment";

import Prescription from "./Prescription";
import DoctorSearch from "./DoctorSearch";

// import Feedback from "./Feedback";
import ZoomMeeting from "../ZoomMeeting";
import PatientDashboard from "./Patientdashboard";
// import Profile from "./Profile";
// import Photo from './path-to-photo.jpg'; // Replace with actual profile photo path

const PatientHeader = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const userId=localStorage.getItem('userId');
  console.log(userId);
  

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setShowProfile(false);  // Close profile dropdown on navigation
  };

  const handleLogoClick = () => {
    setCurrentPage('home');
    setShowProfile(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <PatientDashboard userId={userId} onNavigate={handleNavigate}/>;
      case 'bookappointment':
        return <BookAppointment userId={userId} onNavigate={handleNavigate}/>;
      case 'prescription':
        return <Prescription userId={userId} />
      case 'connectvideo':
        return <ZoomMeeting userId={userId} />;
      case 'profile':
        // return <Profile />;
      default:
        // return <PatientDashBoard />;
    }
  };

  return (
    <>
      <header className="header">
        <div
          className={`logoBtn ${hoveredLogo ? 'logoBtnHover' : ''}`}
          onMouseEnter={() => setHoveredLogo(true)}
          onMouseLeave={() => setHoveredLogo(false)}
          onClick={handleLogoClick}
          title="Logo"
          style={{ cursor: 'pointer' }}
        >
          Logo{/* Replace with <img src="..." alt="Logo" /> if available */}
        </div>

        <button
          onClick={() => handleNavigate('home')}
          className={`navBtn ${currentPage === 'home' ? 'navBtnActive' : ''}`}
          type="button"
        >
          Home
        </button>
        <button
          onClick={() => handleNavigate('bookappointment')}
          className={`navBtn ${currentPage === 'bookappointment' ? 'navBtnActive' : ''}`}
          type="button"
        >
          Book Appointment
        </button>
        <button
          onClick={() => handleNavigate('prescription')}
          className={`navBtn ${currentPage === 'prescription' ? 'navBtnActive' : ''}`}
          type="button"
        >
          Prescription
        </button>
        <button
          onClick={() => handleNavigate('connectvideo')}
          className={`navBtn ${currentPage === 'connectvideo' ? 'navBtnActive' : ''}`}
          type="button"
        >
          Consult Now
        </button>

        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <button
            className={`profileBtn ${hoveredProfile ? 'profileBtnHover' : ''}`}
            type="button"
            onMouseEnter={() => setHoveredProfile(true)}
            onMouseLeave={() => setHoveredProfile(false)}
            onClick={() => setShowProfile(!showProfile)}
          >
            <img  alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          </button>
          {showProfile && (
            <div style={{
              position: 'absolute', top: '100%', right: 0,
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: 8,
              marginTop: 8,
              zIndex: 1000,
              minWidth: 250,
            }}>
              <Profile />
            </div>
          )}
        </div>
      </header>

      <main className="mainContent" >
        {renderCurrentPage()}
      </main>
    </>
  );
};

export default PatientHeader;
