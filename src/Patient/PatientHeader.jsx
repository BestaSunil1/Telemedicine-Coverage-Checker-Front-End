
// import React, { useState } from "react";
// import './PatientHeader.css';  // your CSS styles for header and mainContent

// // Import your page components — make sure these exist!
// import BookAppointment from "./BookAppointment";

// import Prescription from "./Prescription";
// import DoctorSearch from "./DoctorSearch";

// // import Feedback from "./Feedback";
// import ZoomMeeting from "../ZoomMeeting";
// import PatientDashboard from "./Patientdashboard";
// import ProfileComponent from "../Profile";
// // import Profile from "./Profile";
// // import Photo from './path-to-photo.jpg'; // Replace with actual profile photo path

// const PatientHeader = () => {
//   const [showProfile, setShowProfile] = useState(false);
//   const [currentPage, setCurrentPage] = useState('home');
//   const [hoveredLogo, setHoveredLogo] = useState(false);
//   const [hoveredProfile, setHoveredProfile] = useState(false);
//   const userId=localStorage.getItem('userId');
//   console.log(userId);
  

//   const handleNavigate = (page) => {
//     setCurrentPage(page);
//     setShowProfile(false);  // Close profile dropdown on navigation
//   };

//   const handleLogoClick = () => {
//     setCurrentPage('home');
//     setShowProfile(false);
//   };

//   const renderCurrentPage = () => {
//     switch (currentPage) {
//       case 'home':
//         return <PatientDashboard userId={userId} onNavigate={handleNavigate}/>;
//       case 'bookappointment':
//         return <BookAppointment userId={userId} onNavigate={handleNavigate}/>;
//       case 'prescription':
//         return <Prescription userId={userId} />
//       case 'connectvideo':
//         return <ZoomMeeting userId={userId} />;
//       case 'profile':
//         // return <Profile />;
//       default:
//         // return <PatientDashBoard />;
//     }
//   };

//   return (
//     <>
//       <header className="header">
//         <div
//           className={`logoBtn ${hoveredLogo ? 'logoBtnHover' : ''}`}
//           onMouseEnter={() => setHoveredLogo(true)}
//           onMouseLeave={() => setHoveredLogo(false)}
//           onClick={handleLogoClick}
//           title="Logo"
//           style={{ cursor: 'pointer' }}
//         >
//           Logo{/* Replace with <img src="..." alt="Logo" /> if available */}
//         </div>

//         <button
//           onClick={() => handleNavigate('home')}
//           className={`navBtn ${currentPage === 'home' ? 'navBtnActive' : ''}`}
//           type="button"
//         >
//           Home
//         </button>
//         <button
//           onClick={() => handleNavigate('bookappointment')}
//           className={`navBtn ${currentPage === 'bookappointment' ? 'navBtnActive' : ''}`}
//           type="button"
//         >
//           Book Appointment
//         </button>
//         <button
//           onClick={() => handleNavigate('prescription')}
//           className={`navBtn ${currentPage === 'prescription' ? 'navBtnActive' : ''}`}
//           type="button"
//         >
//           Prescription
//         </button>
//         <button
//           onClick={() => handleNavigate('connectvideo')}
//           className={`navBtn ${currentPage === 'connectvideo' ? 'navBtnActive' : ''}`}
//           type="button"
//         >
//           Consult Now
//         </button>

//         <div style={{ marginLeft: 'auto', position: 'relative' }}>
//           <button
//             className={`profileBtn ${hoveredProfile ? 'profileBtnHover' : ''}`}
//             type="button"
//             onMouseEnter={() => setHoveredProfile(true)}
//             onMouseLeave={() => setHoveredProfile(false)}
//             onClick={() => setShowProfile(!showProfile)}
//           >
//             <img src="" alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
//           </button>
//           {showProfile && (
//             <div style={{
//               position: 'absolute', top: '100%', right: 0,
//               backgroundColor: 'white',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//               borderRadius: 8,
//               marginTop: 8,
//               zIndex: 1000,
//               minWidth: 250,
//             }}>
//               <ProfileComponent />
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="mainContent" >
//         {renderCurrentPage()}
//       </main>
//     </>
//   );
// };

// export default PatientHeader;
import React, { useState, useEffect } from "react";
import './PatientHeader.css';
import BookAppointment from "./BookAppointment";
import Prescription from "./Prescription";
import DoctorSearch from "./DoctorSearch";
// import ZoomMeeting from "../ZoomMeeting";

import PatientZoom from '../Patient/PatientZoom'
import PatientDashboard from "./Patientdashboard";
import ProfileComponent from "../Profile";

const PatientHeader = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const userId = localStorage.getItem('userId');

  // Fetch patient data including profilePhoto
  useEffect(() => {
    if (!userId) return;
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:9090/api/patients/user/${userId}`);
        if (!response.ok) {
          console.error('Failed to fetch patient data');
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
      case 'home':
        return <PatientDashboard userId={userId} onNavigate={handleNavigate} />;
      case 'bookappointment':
        return <BookAppointment userId={userId} onNavigate={handleNavigate} />;
      case 'prescription':
        return <Prescription userId={userId} />;
      case 'connectvideo':
        return <PatientZoom userId={userId} />;
      case 'profile':
        return <ProfileComponent />;
      default:
        return <PatientDashboard userId={userId} onNavigate={handleNavigate} />;
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
          Logo
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
              <ProfileComponent />
            </div>
          )}
        </div>
      </header>

      <main className="mainContent">
        {renderCurrentPage()}
      </main>
    </>
  );
};

export default PatientHeader;
