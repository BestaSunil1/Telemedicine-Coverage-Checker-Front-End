
import React, { useState, useEffect } from "react";
import '../Patient/patientheader.css';
// import ZoomMeeting from "../ZoomMeeting";
import DoctorDashboard from "./DoctorDashBoard";
import AcceptAppointment from "./AcceptAppointment "
import ManageSchedules from "./ManageSchedules";
import DoctorProfile from "../DoctorProfile"
import DoctorZoom from ".//DoctorZoom"
import ConfirmedAppointments from "./ConfirmedAppointments";
const DoctorHeader = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);
const [profilePhoto, setProfilePhoto] = useState(null);
  const userId=localStorage.getItem('userId');
  console.log(userId);
// Fetch patient data including profilePhoto
useEffect(() => {
  if (!userId) return;
  const fetchPatientData = async () => {
    try {
      const response = await fetch(`http://localhost:9090/api/doctors/user/${userId}`);
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
  setShowProfile(false);  // Close profile dropdown on navigation
};

const handleLogoClick = () => {
  setCurrentPage('home');
  setShowProfile(false);
};

const renderCurrentPage = () => {
  switch (currentPage) {
    case 'home':
      return <DoctorDashboard onNavigate={handleNavigate} />;
    case 'accpetappointments':
      return <AcceptAppointment onNavigate={handleNavigate} />;
    case 'manageshedules':
      return <ManageSchedules />
    case 'connectvideo':
      return <DoctorZoom />;
    case 'profile':
    // return <Profile />;
    case 'pres':
      return <ConfirmedAppointments />
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
        className={`navBtn ${currentPage === 'manageshedules' ? 'navBtnActive' : ''}`}
        type="button"
      >
        Manage Shedules
      </button>
          <button
        onClick={() => handleNavigate('pres')}
        className={`navBtn ${currentPage === 'pres' ? 'navBtnActive' : ''}`}
        type="button"
      >
       Provide Prescription
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
            <DoctorProfile />
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



// const DoctorHeader = () => {
//   const [showProfile, setShowProfile] = useState(false);
//   const [currentPage, setCurrentPage] = useState('home');
//   const [hoveredLogo, setHoveredLogo] = useState(false);
//   const [hoveredProfile, setHoveredProfile] = useState(false);
//   const [profilePhoto, setProfilePhoto] = useState(null);

//   const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     if (!userId) return;
//     const fetchDoctorProfile = async () => {
//       try {
//         const response = await fetch(`http://localhost:9090/api/doctors/${userId}`);
//         if (!response.ok) {
//           console.error('Failed to fetch doctor profile');
//           return;
//         }
//         const doctor = await response.json();
//         if (doctor && doctor.profilePhoto) {
//           setProfilePhoto(doctor.profilePhoto);
//         }
//       } catch (error) {
//         console.error('Error fetching doctor profile:', error);
//       }
//     };
//     fetchDoctorProfile();
//   }, [userId]);

//   const handleNavigate = (page) => {
//     setCurrentPage(page);
//     setShowProfile(false); // Close profile dropdown on navigation
//   };

//   const handleLogoClick = () => {
//     setCurrentPage('home');
//     setShowProfile(false);
//   };

//   const renderCurrentPage = () => {
//     switch (currentPage) {
//       case 'home':
//         return <DoctorDashboard onNavigate={handleNavigate} />;
//       case 'accpetappointments':
//         return <AcceptAppointment onNavigate={handleNavigate} />;
//       case 'manageshedules':
//         return <ManageSchedules />;
//       case 'connectvideo':
//         return <ZoomMeeting />;
//       case 'profile':
//         return <DoctorProfile onNavigate={handleNavigate} />;
//       default:
//         return <DoctorDashboard onNavigate={handleNavigate} />;
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
//           onClick={() => handleNavigate('accpetappointments')}
//           className={`navBtn ${currentPage === 'accpetappointments' ? 'navBtnActive' : ''}`}
//           type="button"
//         >
//           Appointment
//         </button>
//         <button
//           onClick={() => handleNavigate('manageshedules')}
//           className={`navBtn ${currentPage === 'manageshedules' ? 'navBtnActive' : ''}`}
//           type="button"
//         >
//           Manage Schedules
//         </button>
//         <button
//           onClick={() => handleNavigate('connectvideo')}
//           className={`navBtn ${currentPage === 'connectvideo' ? 'navBtnActive' : ''}`}
//           type="button"
//         >
//           Virtual Meeting
//         </button>

//         <div style={{ marginLeft: 'auto', position: 'relative' }}>
//           <button
//             className={`profileBtn ${hoveredProfile ? 'profileBtnHover' : ''}`}
//             type="button"
//             onMouseEnter={() => setHoveredProfile(true)}
//             onMouseLeave={() => setHoveredProfile(false)}
//             onClick={() => setShowProfile(!showProfile)}
//             style={{ padding: 0, overflow: 'hidden' }}
//           >
//             {profilePhoto ? (
//               <img
//                 src={profilePhoto}
//                 alt="Profile"
//                 style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
//               />
//             ) : (
//               <div style={{
//                 width: '60px',
//                 height: '60px',
//                 borderRadius: '50%',
//                 backgroundColor: '#FF9800',
//                 color: '#fff',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 fontWeight: '600',
//                 fontSize: '1.4rem',
//               }}>
//                 ?
//               </div>
//             )}
//           </button>
//           {showProfile && (
//             <div style={{
//               position: 'absolute',
//               top: '100%',
//               right: 0,
//               backgroundColor: 'white',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//               borderRadius: 8,
//               marginTop: 8,
//               zIndex: 1000,
//               minWidth: 250,
//             }}>
//               <DoctorProfile onNavigate={handleNavigate} />
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="mainContent">
//         {renderCurrentPage()}
//       </main>
//     </>
//   );
// };

// export default DoctorHeader;
