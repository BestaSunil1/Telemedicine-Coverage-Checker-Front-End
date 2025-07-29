
import React, { useState } from "react";
import '../Patient/patientheader.css';
import ZoomMeeting from "../ZoomMeeting";
import DoctorDashboard from "./DoctorDashBoard";
import AcceptAppointment from "./AcceptAppointment ";
import ManageSchedules from "./ManageSchedules";

const DoctorHeader = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);

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
        return <DoctorDashboard onNavigate={handleNavigate}/>;
      case 'accpetappointments':
        return <AcceptAppointment />;
      case 'manageshedules':
        return <ManageSchedules />
      case 'connectvideo':
        return <ZoomMeeting />;
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
          onClick={() => handleNavigate('accpetappointments')}
          className={`navBtn ${currentPage === 'accpetappointments' ? 'navBtnActive' : ''}`}
          type="button"
        >
           Appointment
        </button>
        <button
          onClick={() => handleNavigate('manageshedules')}
          className={`navBtn ${currentPage === 'prescription' ? 'navBtnActive' : ''}`}
          type="button"
        >
          Manage Shedules
        </button>
        <button
          onClick={() => handleNavigate('connectvideo')}
          className={`navBtn ${currentPage === 'connectvideo' ? 'navBtnActive' : ''}`}
          type="button"
        >
          Virtual Meeting
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

export default DoctorHeader;
