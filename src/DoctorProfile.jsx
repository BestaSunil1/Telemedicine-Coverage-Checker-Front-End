


// import React, { useState, useEffect, useRef } from 'react';
// import { Camera, Edit3, Save, X, User, Phone, Mail, Loader } from 'lucide-react';
// import './profile.css';
// import { useNavigate } from 'react-router-dom';

// const ProfileComponent = () => {
//   const [profile, setProfile] = useState({
//     id: '',
//     username: '',
//     email: '',
//     dateOfBirth: '',
//     gender: '',
//     contactNumber: '',
//     profilePhoto: '',
//     role: ''
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [tempProfile, setTempProfile] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const fileInputRef = useRef(null);

//   // Get user ID from localStorage or your auth context
//   const customUserId = localStorage.getItem('userId');
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Perform any logout logic here (e.g. clearing auth tokens), then navigate:
//     navigate('/login');
//   };

//   // Fetch patient data from API
//   const fetchPatientData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(`http://localhost:9090/api/doctors/user/${customUserId}`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch patient data: ${response.status}`);
//       }
//       const data = await response.json();
//       const transformedProfile = {
//         id: data.id,
//         username: data.user.username,
//         email: data.user.email,
//         dateOfBirth: data.dateOfBirth,
//         gender: data.gender,
//         contactNumber: data.contactNumber,
//         role: data.user.role,
//         active: data.active,
//         specializations: data.specializations || [],
//         profilePhoto: data.profilePhoto || ''
//       };
//       setProfile(transformedProfile);
//       localStorage.setItem('patientProfile', JSON.stringify(transformedProfile));
//     } catch (err) {
//       setError(err.message);
//       const storedProfile = localStorage.getItem('patientProfile');
//       if (storedProfile) setProfile(JSON.parse(storedProfile));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update patient data via API (POST)
//   const updatePatientData = async (updatedData) => {
//     try {
//       setSaving(true);
//       const apiData = {
//         id: profile.id,
//         dateOfBirth: updatedData.dateOfBirth,
//         gender: updatedData.gender,
//         contactNumber: updatedData.contactNumber,
//         profilePhoto: updatedData.profilePhoto || profile.profilePhoto,
//         user: {
//           username: updatedData.username,
//           email: updatedData.email
//         }
//       };
//       const response = await fetch(`http://localhost:9090/api/doctors/${profile.id}/update`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(apiData)
//       });
//       if (!response.ok) throw new Error(`Failed to update patient data: ${response.status}`);
//       const updatedPatient = await response.json();
//       const transformedProfile = {
//         id: updatedPatient.id,
//         username: updatedPatient.user.username,
//         email: updatedPatient.user.email,
//         dateOfBirth: updatedPatient.dateOfBirth,
//         gender: updatedPatient.gender,
//         contactNumber: updatedPatient.contactNumber,
//         role: updatedPatient.user.role,
//         profilePhoto: updatedPatient.profilePhoto || profile.profilePhoto
//       };
//       setProfile(transformedProfile);
//       localStorage.setItem('patientProfile', JSON.stringify(transformedProfile));
//       return true;
//     } catch (err) {
//       setError(`Failed to update profile: ${err.message}`);
//       return false;
//     } finally {
//       setSaving(false);
//     }
//   };

//   useEffect(() => {
//     fetchPatientData();
//     // eslint-disable-next-line
//   }, []);

//   // Profile photo upload
//   const handlePhotoUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (isEditing) {
//           setTempProfile(prev => ({ ...prev, profilePhoto: e.target.result }));
//         } else {
//           const newProfile = { ...profile, profilePhoto: e.target.result };
//           setProfile(newProfile);
//           localStorage.setItem('patientProfile', JSON.stringify(newProfile));
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleEdit = () => {
//     setTempProfile({ ...profile });
//     setIsEditing(true);
//     setError(null);
//   };

//   const handleSave = async () => {
//     const success = await updatePatientData(tempProfile);
//     if (success) {
//       setIsEditing(false);
//       setTempProfile({});
//     }
//   };

//   const handleCancel = () => {
//     setTempProfile({});
//     setIsEditing(false);
//     setError(null);
//   };

//   const handleInputChange = (field, value) => {
//     setTempProfile(prev => ({ ...prev, [field]: value }));
//   };

//   const formatGender = (gender) =>
//     gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not specified';

//   if (loading) {
//     return (
//       <div className="profile-container">
//         <div className="loading-container">
//           <div className="loading-content">
//             <Loader className="loading-spinner" size={40} />
//             <p className="loading-text">Loading profile...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-container">
//       {/* Header */}
//       <div className="profile-header">
//         <div className="profile-header-content">
//           <div>
//             <h2 className="profile-title">Patient Profile</h2>
//             <p className="profile-subtitle">Sunil Health Care</p>
//           </div>
//           {!isEditing ? (
//             <button onClick={handleEdit} className="edit-button">
//               <Edit3 size={16} />
//               Edit Profile
//             </button>
//           ) : (
//             <div style={{ display: 'flex' }}>
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="save-button"
//               >
//                 {saving ? <Loader size={16} className="loading-spinner" /> : <Save size={16} />}
//                 {saving ? 'Saving...' : 'Save'}
//               </button>
//               <button
//                 onClick={handleCancel}
//                 disabled={saving}
//                 className="cancel-button"
//               >
//                 <X size={16} />
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div className="error-message">
//           <p className="error-text">{error}</p>
//         </div>
//       )}

//       {/* Profile Content */}
//       <div className="profile-content">
//         {/* Profile Photo and Basic Info */}
//         <div className="profile-main-section">
//           <div className="profile-photo-container">
//             <div className="profile-photo">
//               {(isEditing ? tempProfile.profilePhoto : profile.profilePhoto) ? (
//                 <img
//                   src={isEditing ? tempProfile.profilePhoto : profile.profilePhoto}
//                   alt="Profile"
//                 />
//               ) : (
//                 <div className="profile-photo-placeholder">
//                   <User size={48} />
//                 </div>
//               )}
//             </div>

//             {/* Camera button */}
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="camera-button"
//             >
//               <Camera size={16} />
//             </button>

//             {/* Hidden file input */}
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handlePhotoUpload}
//               className="file-input-hidden"
//             />
//           </div>

//           {/* Basic Info */}
//           <div className="profile-basic-info">
//             <h3 className="profile-name">{profile.username}</h3>
//             <p className="profile-id">Patient ID: {profile.id}</p>
//             <p className="profile-role">Role: {profile.role}</p>
//             <div className="profile-contact-info">
//               <div className="contact-item">
//                 <Phone size={16} />
//                 {profile.contactNumber}
//               </div>
//               <div className="contact-item">
//                 <Mail size={16} />
//                 {profile.email}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Detailed Info */}
//         <div className="profile-details-grid">
//           {/* Personal Information */}
//           <div className="profile-section">
//             <h4 className="section-title">Personal Information</h4>
//             <div className="field-container">
//               <label className="field-label">Username</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={tempProfile.username || ''}
//                   onChange={(e) => handleInputChange('username', e.target.value)}
//                   className="field-input"
//                 />
//               ) : (
//                 <div className="field-display">{profile.username || 'Not provided'}</div>
//               )}
//             </div>

//             <div className="field-container">
//               <label className="field-label">Date of Birth</label>
//               {isEditing ? (
//                 <input
//                   type="date"
//                   value={tempProfile.dateOfBirth || ''}
//                   onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
//                   className="field-input"
//                 />
//               ) : (
//                 <div className="field-display">{profile.dateOfBirth || 'Not provided'}</div>
//               )}
//             </div>

//             <div className="field-container">
//               <label className="field-label">Gender</label>
//               {isEditing ? (
//                 <select
//                   value={tempProfile.gender || ''}
//                   onChange={(e) => handleInputChange('gender', e.target.value)}
//                   className="field-select"
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               ) : (
//                 <div className="field-display">{formatGender(profile.gender)}</div>
//               )}
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="profile-section">
//             <h4 className="section-title">Contact Information</h4>
//             <div className="field-container">
//               <label className="field-label">Contact Number</label>
//               {isEditing ? (
//                 <input
//                   type="tel"
//                   value={tempProfile.contactNumber || ''}
//                   onChange={(e) => handleInputChange('contactNumber', e.target.value)}
//                   className="field-input"
//                 />
//               ) : (
//                 <div className="field-display">{profile.contactNumber || 'Not provided'}</div>
//               )}
//             </div>
//             <div className="field-container">
//               <label className="field-label">Email Address</label>
//               {isEditing ? (
//                 <input
//                   type="email"
//                   value={tempProfile.email || ''}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   className="field-input"
//                 />
//               ) : (
//                 <div className="field-display">{profile.email || 'Not provided'}</div>
//               )}
//             </div>
//             <div className="field-container">
//               <label className="field-label">Account Type</label>
//               <div className="field-display">{profile.role || 'Not specified'}</div>
//             </div>
//           </div>
//         </div>

//         {isEditing && (
//           <div className="mobile-actions">
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="mobile-save-button"
//             >
//               {saving ? <Loader size={16} className="loading-spinner" /> : <Save size={16} />}
//               {saving ? 'Saving...' : 'Save Changes'}
//             </button>
//             <button
//               onClick={handleCancel}
//               disabled={saving}
//               className="mobile-cancel-button"
//             >
//               <X size={16} />
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="profile-footer">
//         <div className="footer-content">
//           {/* <p className="footer-text">Last updated: {new Date().toLocaleDateString()}</p> */}
//            <button type="button" onClick={handleLogout}>Logout</button>
//           <p className="footer-text">Sunil Health Care - Patient Portal</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileComponent;
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Edit3, Save, X, User, Phone, Mail, Loader } from 'lucide-react';
import './profile.css';
import { useNavigate } from 'react-router-dom';

const ProfileComponent = () => {
  const [profile, setProfile] = useState({
    id: '',
    username: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    profilePhoto: '',
    role: '',
    specializations: [],
    active: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const customUserId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Fetch doctor data from API
  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:9090/api/doctors/user/${customUserId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      const data = await response.json();

      // Handle both "user"-nested and top-level APIs for maximal flexibility:
      const user = data.user || {};

      const transformedProfile = {
        id: data.id || '',
        username: user.username || data.username || '',
        email: user.email || data.email || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || '',
        contactNumber: data.contactNumber || '',
        role: user.role || data.role || '',
        active: data.active !== undefined ? data.active : false,
        specializations: data.specializations || [],
        profilePhoto: data.profilePhoto || ''
      };

      setProfile(transformedProfile);
      localStorage.setItem('profile', JSON.stringify(transformedProfile));
    } catch (err) {
      setError(err.message);
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) setProfile(JSON.parse(storedProfile));
    } finally {
      setLoading(false);
    }
  };

  // Update doctor data
  const updateDoctorData = async updatedData => {
    try {
      setSaving(true);

      // Flexible for both possible backends
      const apiData = {
        id: profile.id,
        dateOfBirth: updatedData.dateOfBirth,
        gender: updatedData.gender,
        contactNumber: updatedData.contactNumber,
        specializations: profile.specializations || [],
        profilePhoto: updatedData.profilePhoto || profile.profilePhoto,
        user: {
          username: updatedData.username,
          email: updatedData.email
        }
      };
      const response = await fetch(`http://localhost:9090/api/doctors/${profile.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });
      if (!response.ok) throw new Error(`Failed to update profile: ${response.status}`);
      const updated = await response.json();

      const user = updated.user || {};
      const transformedProfile = {
        id: updated.id || '',
        username: user.username || updated.username || '',
        email: user.email || updated.email || '',
        dateOfBirth: updated.dateOfBirth || '',
        gender: updated.gender || '',
        contactNumber: updated.contactNumber || '',
        role: user.role || updated.role || '',
        active: updated.active !== undefined ? updated.active : false,
        specializations: updated.specializations || [],
        profilePhoto: updated.profilePhoto || profile.profilePhoto
      };

      setProfile(transformedProfile);
      localStorage.setItem('profile', JSON.stringify(transformedProfile));
      return true;
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
    // eslint-disable-next-line
  }, []);

  // Profile photo upload
  const handlePhotoUpload = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEditing) {
          setTempProfile(prev => ({ ...prev, profilePhoto: e.target.result }));
        } else {
          const newProfile = { ...profile, profilePhoto: e.target.result };
          setProfile(newProfile);
          localStorage.setItem('profile', JSON.stringify(newProfile));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
    setError(null);
  };

  const handleSave = async () => {
    const success = await updateDoctorData(tempProfile);
    if (success) {
      setIsEditing(false);
      setTempProfile({});
    }
  };

  const handleCancel = () => {
    setTempProfile({});
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const formatGender = gender =>
    gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not specified';

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="loading-content">
            <Loader className="loading-spinner" size={40} />
            <p className="loading-text">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div>
            <h2 className="profile-title">Doctor Profile</h2>
            <p className="profile-subtitle">Sunil Health Care</p>
          </div>
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-button">
              <Edit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="save-button"
              >
                {saving ? <Loader size={16} className="loading-spinner" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="cancel-button"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p className="error-text">{error}</p>
        </div>
      )}

      {/* Profile Content */}
      <div className="profile-content">
        {/* Profile Photo and Basic Info */}
        <div className="profile-main-section">
          <div className="profile-photo-container">
            <div className="profile-photo">
              {(isEditing ? tempProfile.profilePhoto : profile.profilePhoto) ? (
                <img
                  src={isEditing ? tempProfile.profilePhoto : profile.profilePhoto}
                  alt="Profile"
                />
              ) : (
                <div className="profile-photo-placeholder">
                  <User size={48} />
                </div>
              )}
            </div>

            {/* Camera button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="camera-button"
            >
              <Camera size={16} />
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="file-input-hidden"
            />
          </div>

          {/* Basic Info */}
          <div className="profile-basic-info">
            <h3 className="profile-name">{profile.username || 'Not Provided'}</h3>
            <p className="profile-id">Doctor ID: {profile.id}</p>
            <p className="profile-role">Role: {profile.role}</p>
            <div className="profile-contact-info">
              <div className="contact-item">
                <Phone size={16} />
                {profile.contactNumber || 'Not Provided'}
              </div>
              <div className="contact-item">
                <Mail size={16} />
                {profile.email || 'Not Provided'}
              </div>
            </div>
            {/* If you want to show specializations */}
            {profile.specializations && profile.specializations.length > 0 && (
              <div className="profile-specializations">
                <strong>Specializations:</strong>&nbsp;
                {profile.specializations.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Info */}
        <div className="profile-details-grid">
          {/* Personal Information */}
          <div className="profile-section">
            <h4 className="section-title">Personal Information</h4>
            <div className="field-container">
              <label className="field-label">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.username || ''}
                  onChange={e => handleInputChange('username', e.target.value)}
                  className="field-input"
                />
              ) : (
                <div className="field-display">{profile.username || 'Not provided'}</div>
              )}
            </div>

            <div className="field-container">
              <label className="field-label">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={tempProfile.dateOfBirth || ''}
                  onChange={e => handleInputChange('dateOfBirth', e.target.value)}
                  className="field-input"
                />
              ) : (
                <div className="field-display">{profile.dateOfBirth || 'Not provided'}</div>
              )}
            </div>

            <div className="field-container">
              <label className="field-label">Gender</label>
              {isEditing ? (
                <select
                  value={tempProfile.gender || ''}
                  onChange={e => handleInputChange('gender', e.target.value)}
                  className="field-select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div className="field-display">{formatGender(profile.gender)}</div>
              )}
            </div>
          </div>
          {/* Contact Information */}
          <div className="profile-section">
            <h4 className="section-title">Contact Information</h4>
            <div className="field-container">
              <label className="field-label">Contact Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempProfile.contactNumber || ''}
                  onChange={e => handleInputChange('contactNumber', e.target.value)}
                  className="field-input"
                />
              ) : (
                <div className="field-display">{profile.contactNumber || 'Not provided'}</div>
              )}
            </div>
            <div className="field-container">
              <label className="field-label">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={tempProfile.email || ''}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="field-input"
                />
              ) : (
                <div className="field-display">{profile.email || 'Not provided'}</div>
              )}
            </div>
            <div className="field-container">
              <label className="field-label">Account Type</label>
              <div className="field-display">{profile.role || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mobile-actions">
            <button
              onClick={handleSave}
              disabled={saving}
              className="mobile-save-button"
            >
              {saving ? <Loader size={16} className="loading-spinner" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="mobile-cancel-button"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="profile-footer">
        <div className="footer-content">
          <button type="button" onClick={handleLogout}>Logout</button>
          <p className="footer-text">Sunil Health Care - Doctor Portal</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
