import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Search, Filter, X, Save, UserPlus } from 'lucide-react';
import './doctor.css'; // Reuse your doctor styles for consistency

const API_BASE_URL = 'http://localhost:9090/api/admin';
const PAGE_SIZE = 10;

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [currentPatient, setCurrentPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    role: 'PATIENT',
    active: true // If your backend has an 'active' flag; else remove everywhere.
  });

  // Fetch patients from API
  useEffect(() => { fetchPatients(); }, []);
  useEffect(() => {
    filterPatients();
    setCurrentPage(1);
  }, [searchTerm, filterStatus, patients]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/patient`);
      if (!res.ok) throw new Error('Failed to fetch patients');
      const data = await res.json();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      alert('Error fetching patients');
      setPatients([]); setFilteredPatients([]);
    } finally { setLoading(false); }
  };

  const filterPatients = () => {
    let filtered = [...patients];
    const term = searchTerm.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(pt =>
        (pt.user?.username && pt.user.username.toLowerCase().includes(term)) ||
        (pt.user?.email && pt.user.email.toLowerCase().includes(term)) ||
        (pt.contactNumber && pt.contactNumber.includes(term)) ||
        (pt.gender && pt.gender.toLowerCase().includes(term))
      );
    }
    // If you implement active/inactive, otherwise remove this block everywhere
    if (filterStatus !== 'all') {
      filtered = filtered.filter(pt => filterStatus === 'active' ? pt.active : !pt.active);
    }
    setFilteredPatients(filtered);
  };

  const totalPageCount = Math.ceil(filteredPatients.length / PAGE_SIZE);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE
  );

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      dateOfBirth: '',
      gender: '',
      contactNumber: '',
      role: 'PATIENT',
      active: true
    });
  };

  const openModal = (mode, patient = null) => {
    setModalMode(mode);
    setCurrentPatient(patient);
    if (mode === 'add') {
      resetForm();
    } else if (patient) {
      setFormData({
        username: patient.user?.username || '',
        email: patient.user?.email || '',
        password: '', // Never pre-fill password
        dateOfBirth: patient.dateOfBirth || '',
        gender: patient.gender || '',
        contactNumber: patient.contactNumber || '',
        role: patient.user?.role || 'PATIENT',
        active: patient.active !== undefined ? patient.active : true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setCurrentPatient(null); resetForm(); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let res;
      // Prepare registration DTO
      let payload = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'PATIENT',
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactNumber: formData.contactNumber
      };

      if (modalMode === 'add') {
        res = await fetch(`${API_BASE_URL}/register/patient`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else if (modalMode === 'edit') {
        // Your backend expects the full updated Patient object structure for update
        const updatedPayload = {
          id: currentPatient.id,
          ...payload,
          user: {
            ...payload.user,
            id: currentPatient.user?.id
          }
        };
        // Remove password if not changed
        if (!formData.password) delete updatedPayload.user.password;

        res = await fetch(`${API_BASE_URL}/patient/${currentPatient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPayload),
        });
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to save patient');
      }

      const updatedPatient = await res.json();

      if (modalMode === 'add') {
        setPatients(prev => [...prev, updatedPatient]);
      } else {
        setPatients(prev => prev.map(pt => pt.id === updatedPatient.id ? updatedPatient : pt));
      }
      closeModal();
    } catch (error) {
      alert(error.message || 'Error saving patient');
    } finally { setLoading(false); }
  };

  const handleDelete = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/patient/${patientId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete patient');
        setPatients(prev => prev.filter(pt => pt.id !== patientId));
      } catch (error) {
        alert(error.message || 'Error deleting patient');
      } finally { setLoading(false); }
    }
  };

  // If you want to support an 'active' toggle, you'd implement a togglePatientStatus
  // function similar to DoctorManagement, otherwise omit.

  if (loading && patients.length === 0) {
    return (
      <div className="doctor-booking-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading patients...</div>
      </div>
    );
  }

  return (
    <div className="doctor-booking-container">
      <div className="booking-header">
        <h1 className="header-title">Patient Management</h1>
        <p className="header-subtitle">Manage patient profiles and personal information</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
          <button className="consult-btn" onClick={() => openModal('add')}>
            <UserPlus className="w-4 h-4" />
            Add New Patient
          </button>
        </div>
      </div>

      {/* Search & filter */}
      <div className="search-section">
        <h2 className="section-title">Patients List</h2>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
            <Search className="w-4 h-4"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Search patients by name, email, or info..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          {/* Remove filterStatus drop-down if not using active/inactive */}
        </div>

        {/* Patients table */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.length > 0 ? paginatedPatients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.user?.username}</td>
                  <td>{patient.user?.email}</td>
                  <td>{patient.dateOfBirth}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.contactNumber}</td>
                  <td>
                    <button onClick={() => openModal('view', patient)} className="action-btn view-btn"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openModal('edit', patient)} className="action-btn edit-btn"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(patient.id)} className="action-btn delete-btn"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#999' }}>No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPageCount > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="secondary-btn"
            >Prev</button>
            <span style={{ fontSize: '14px' }}>Page {currentPage} of {totalPageCount}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPageCount))}
              disabled={currentPage === totalPageCount}
              className="secondary-btn"
            >Next</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                {modalMode === 'add' ? 'Add New Patient' : modalMode === 'edit' ? 'Edit Patient' : 'View Patient Details'}
              </h2>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="form-input"
                    required
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    required
                    disabled={modalMode === 'view'}
                  />
                </div>
              </div>
              {/* Only show password input on add */}
              {modalMode === 'add' && (
                <div>
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="form-input"
                    required
                    disabled={modalMode === 'view'}
                  />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="form-input"
                    required
                    disabled={modalMode === 'view'}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="form-input"
                  required
                  disabled={modalMode === 'view'}
                />
              </div>
              {modalMode !== 'view' && (
                <div style={{
                  display: 'flex', justifyContent: 'flex-end', gap: '10px',
                  paddingTop: '20px', borderTop: '1px solid #e5e7eb'
                }}>
                  <button type="button" onClick={closeModal} className="secondary-btn">Cancel</button>
                  <button type="button" onClick={handleSubmit} disabled={loading} className="consult-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {loading ? (
                      <div style={{
                        width: '16px', height: '16px', border: '2px solid #fff',
                        borderTop: '2px solid transparent', borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    ) : (<Save className="w-4 h-4" />)}
                    {modalMode === 'add' ? 'Add Patient' : 'Update Patient'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {loading && patients.length === 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999
        }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '24px', height: '24px', border: '3px solid #3b82f6',
              borderTop: '3px solid transparent', borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Loading patients...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
