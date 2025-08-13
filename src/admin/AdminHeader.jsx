
import React, { useState, useEffect } from "react";
import '../Patient/patientheader.css';
import DoctorManagement from "./ManageDoctors";
import PatientManagement from "./PatientManagement";
import AdminProfile from "./AdminProfile";


const AdminHeader = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const userId = localStorage.getItem('userId');
  useEffect(() => {
      if (!userId) return;
      const fetchPatientData = async () => {
        try {
          const response = await fetch(`http://localhost:9090/api/admin/data/${userId}`);
          if (!response.ok) {
            console.error('Failed to fetch amdin data');
            return;
          }
          const patient = await response.json();
          if (patient && patient.profilePhoto) {
            setProfilePhoto(patient.profilePhoto);
          } else {
            setProfilePhoto(null);
          }
        } catch (error) {
          console.error('Error fetching patient data:', error);
        }
      };
      fetchPatientData();
    }, [userId]);

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
        
        {/* <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <button
            className={`profileBtn ${hoveredProfile ? 'profileBtnHover' : ''}`}
            type="button"
            onMouseEnter={() => setHoveredProfile(true)}
            onMouseLeave={() => setHoveredProfile(false)}
            onClick={() => setShowProfile(!showProfile)}
          >
            <img
                src={profilePhoto}
                alt="Profile"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
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
              <AdminProfile />
            </div>
          )}
        </div> */}
         <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <button
            className={`profileBtn ${hoveredProfile ? 'profileBtnHover' : ''}`}
            type="button"
            onMouseEnter={() => setHoveredProfile(true)}
            onMouseLeave={() => setHoveredProfile(false)}
            onClick={() => setShowProfile(!showProfile)}
            style={{ padding: 0, overflow: 'hidden' }}
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              // fallback if no profilePhoto
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                backgroundColor: '#FF9800', color: '#fff',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontWeight: '600', fontSize: '1.4rem',
              }}>
                {/* Could show initials or icon */}
                ?
              </div>
            )}
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
              <AdminProfile />
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
