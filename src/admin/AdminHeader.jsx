
import React, { useState } from "react";
import '../Patient/patientheader.css';
import DoctorManagement from "./ManageDoctors";
import PatientManagement from "./PatientManagement";


const AdminHeader = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setShowProfile(false);  
  };

  const handleLogoClick = () => {
    setCurrentPage('home');
    setShowProfile(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
     
      case 'managedoctors':
        return  <DoctorManagement />;
      case 'managepatients':
        return <PatientManagement />
      default:
        return <PatientManagement />;
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
          onClick={() => handleNavigate('managepatients')}
          className={`navBtn ${currentPage === 'managepatients' ? 'navBtnActive' : ''}`}
          type="button"
        >
           Manage Patients
        </button>
        <button
          onClick={() => handleNavigate('managedoctors')}
          className={`navBtn ${currentPage === 'managedoctors' ? 'navBtnActive' : ''}`}
          type="button"
        >
          Manage Doctors
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

export default AdminHeader;
