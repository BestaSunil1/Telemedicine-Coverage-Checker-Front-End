import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Search, Filter, X, Save, UserPlus, User, Calendar, Clock, Video } from 'lucide-react';
import './doctor.css'; // Import your CSS file

const API_BASE_URL = 'http://localhost:9090/api/admin';
const PAGE_SIZE = 10;

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'DOCTOR',
    profilePictureBase64: '',
    active: true,
    specializations: [],
    availabilities: []
  });

  const [newSpecialization, setNewSpecialization] = useState('');
  const [newAvailability, setNewAvailability] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '',
    endTime: ''
  });

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  // Fetch doctors from backend
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Apply search and filter
  useEffect(() => {
    filterDoctors();
    setCurrentPage(1);
  }, [searchTerm, filterStatus, doctors]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error('Failed to fetch doctors');
      const data = await res.json();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error(error);
      alert('Error fetching doctors');
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];
    const term = searchTerm.toLowerCase();

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        (doc.username && doc.username.toLowerCase().includes(term)) ||
        (doc.email && doc.email.toLowerCase().includes(term)) ||
        (doc.specializations && doc.specializations.some(spec => spec.toLowerCase().includes(term)))
      );
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(doc => filterStatus === 'active' ? doc.active : !doc.active);
    }
    setFilteredDoctors(filtered);
  };

  const totalPageCount = Math.ceil(filteredDoctors.length / PAGE_SIZE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'DOCTOR',
      profilePictureBase64: '',
      active: true,
      specializations: [],
      availabilities: []
    });
    setNewSpecialization('');
    setNewAvailability({ dayOfWeek: 'MONDAY', startTime: '', endTime: '' });
  };

  const openModal = (mode, doctor = null) => {
    setModalMode(mode);
    setCurrentDoctor(doctor);

    if (mode === 'add') {
      resetForm();
    } else if (doctor) {
      setFormData({
        username: doctor.user.username || '',
        email: doctor.user.email || '',
        password: '', // Never pre-fill passwords
        role: doctor.role || 'DOCTOR',
        profilePictureBase64: doctor.profilePictureBase64 || '',
        active: doctor.active ?? true,
        specializations: [...(doctor.specializations || [])],
        availabilities: [...(doctor.availabilities || [])]
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentDoctor(null);
    resetForm();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let res;
      // Prepare payload to backend, exclude password on update if empty
      const payload = { ...formData };
      if (modalMode === 'edit' && !payload.password) {
        delete payload.password;
      }

      if (modalMode === 'add') {
        res = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else if (modalMode === 'edit') {
        res = await fetch(`${API_BASE_URL}/${currentDoctor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to save doctor');
      }

      const updatedDoctor = await res.json();

      if (modalMode === 'add') {
        setDoctors(prev => [...prev, updatedDoctor]);
      } else {
        setDoctors(prev => prev.map(doc => doc.id === updatedDoctor.id ? updatedDoctor : doc));
      }
      closeModal();
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error saving doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/${doctorId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete doctor');
        setDoctors(prev => prev.filter(doc => doc.id !== doctorId));
      } catch (error) {
        console.error(error);
        alert(error.message || 'Error deleting doctor');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleDoctorStatus = async (doctorId) => {
    setLoading(true);
    try {
      const doctor = doctors.find(doc => doc.id === doctorId);
      if (!doctor) throw new Error('Doctor not found');

      const updatedData = { ...doctor, active: !doctor.active };

      const res = await fetch(`${API_BASE_URL}/${doctorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Failed to update doctor status');

      const updatedDoctor = await res.json();
      setDoctors(prev => prev.map(doc => doc.id === updatedDoctor.id ? updatedDoctor : doc));
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error updating status');
    } finally {
      setLoading(false);
    }
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization.trim())) {
      setFormData({ ...formData, specializations: [...formData.specializations, newSpecialization.trim()] });
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (index) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.filter((_, i) => i !== index)
    });
  };

  const addAvailability = () => {
    if (newAvailability.startTime && newAvailability.endTime) {
      const exists = formData.availabilities.some(av => av.dayOfWeek === newAvailability.dayOfWeek);
      if (!exists) {
        setFormData({
          ...formData,
          availabilities: [...formData.availabilities, { ...newAvailability }]
        });
        setNewAvailability({ dayOfWeek: 'MONDAY', startTime: '', endTime: '' });
      }
    }
  };

  const removeAvailability = (index) => {
    setFormData({
      ...formData,
      availabilities: formData.availabilities.filter((_, i) => i !== index)
    });
  };

  const calculateStats = () => {
    const totalDoctors = doctors.length;
    const activeDoctors = doctors.filter(doc => doc.active).length;
    const totalSpecializations = [...new Set(doctors.flatMap(doc => doc.specializations))].length;
    const totalAvailableSlots = doctors.reduce((sum, doc) => sum + doc.availabilities.length, 0);
    return { totalDoctors, activeDoctors, totalSpecializations, totalAvailableSlots };
  };

  const stats = calculateStats();

  if (loading && doctors.length === 0) {
    return (
      <div className="doctor-booking-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="doctor-booking-container">
      <div className="booking-header">
        <h1 className="header-title">Doctor Management</h1>
        <p className="header-subtitle">Manage doctor profiles, specializations, and availability schedules</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
          <button className="consult-btn" onClick={() => openModal('add')}>
            <UserPlus className="w-4 h-4" />
            Add New Doctor
          </button>
        </div>
      </div>

      {/* Quick summary stats */}
      <div className="doctors-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <User className="w-8 h-8" style={{ color: '#10b981', margin: '0 auto 10px' }} />
          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#1a1a1a' }}>{stats.totalDoctors}</h3>
          <p style={{ margin: 0, color: '#6b7280' }}>Total Doctors</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Calendar className="w-8 h-8" style={{ color: '#3b82f6', margin: '0 auto 10px' }} />
          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#1a1a1a' }}>{stats.activeDoctors}</h3>
          <p style={{ margin: 0, color: '#6b7280' }}>Active Doctors</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Clock className="w-8 h-8" style={{ color: '#f59e0b', margin: '0 auto 10px' }} />
          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#1a1a1a' }}>{stats.totalSpecializations}</h3>
          <p style={{ margin: 0, color: '#6b7280' }}>Specializations</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Video className="w-8 h-8" style={{ color: '#8b5cf6', margin: '0 auto 10px' }} />
          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#1a1a1a' }}>{stats.totalAvailableSlots}</h3>
          <p style={{ margin: 0, color: '#6b7280' }}>Available Time Slots</p>
        </div>
      </div>

      {/* Search & filter */}
      <div className="search-section">
        <h2 className="section-title">Doctors List</h2>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
            <Search className="w-4 h-4" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Search doctors by name, email, or specialization..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter className="w-4 h-4" style={{ color: '#6b7280' }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Doctors</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Doctors table */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Specializations</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDoctors.length > 0 ? paginatedDoctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>{doctor.user.username}</td>
                  <td>{doctor.user.email}</td>
                  <td>
                    <button
                      onClick={() => toggleDoctorStatus(doctor.id)}
                      className={doctor.active ? 'status-badge status-active' : 'status-badge status-inactive'}
                    >
                      {doctor.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>{doctor.specializations.join(', ')}</td>
                  <td>{doctor.availabilities.length} day(s)</td>
                  <td>
                    <button onClick={() => openModal('view', doctor)} className="action-btn view-btn"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openModal('edit', doctor)} className="action-btn edit-btn"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(doctor.id)} className="action-btn delete-btn"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#999' }}>No doctors found.</td>
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
            >
              Prev
            </button>
            <span style={{ fontSize: '14px' }}>Page {currentPage} of {totalPageCount}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPageCount))}
              disabled={currentPage === totalPageCount}
              className="secondary-btn"
            >
              Next
            </button>
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
                {modalMode === 'add' ? 'Add New Doctor' : modalMode === 'edit' ? 'Edit Doctor' : 'View Doctor Details'}
              </h2>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Username & Email */}
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

              {/* Password (only add mode) */}
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

              {/* Active checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={e => setFormData({ ...formData, active: e.target.checked })}
                  disabled={modalMode === 'view'}
                />
                <label htmlFor="active" className="form-label" style={{ margin: 0 }}>
                  Active Status
                </label>
              </div>

              {/* Specializations */}
              <div>
                <label className="form-label">Specializations</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {formData.specializations.map((spec, idx) => (
                    <span key={idx} className="specialty-tag" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {spec}
                      {modalMode !== 'view' && (
                        <button
                          type="button"
                          onClick={() => removeSpecialization(idx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#dc2626' }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {modalMode !== 'view' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={newSpecialization}
                      onChange={e => setNewSpecialization(e.target.value)}
                      placeholder="Add specialization"
                      className="form-input"
                      style={{ flex: '1' }}
                      onKeyPress={e => e.key === 'Enter' && addSpecialization()}
                    />
                    <button type="button" onClick={addSpecialization} className="consult-btn">Add</button>
                  </div>
                )}
              </div>

              {/* Availabilities */}
              <div>
                <label className="form-label">Availability Schedule</label>
                <div style={{ display: 'grid', gap: '8px', marginBottom: '15px' }}>
                  {formData.availabilities.map((av, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      backgroundColor: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb'
                    }}>
                      <span style={{ fontSize: '14px' }}>
                        {av.dayOfWeek}: {av.startTime} - {av.endTime}
                      </span>
                      {modalMode !== 'view' && (
                        <button
                          type="button"
                          onClick={() => removeAvailability(idx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#dc2626' }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {modalMode !== 'view' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                    <select
                      value={newAvailability.dayOfWeek}
                      onChange={e => setNewAvailability({ ...newAvailability, dayOfWeek: e.target.value })}
                      className="form-input"
                    >
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={newAvailability.startTime}
                      onChange={e => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="time"
                      value={newAvailability.endTime}
                      onChange={e => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={addAvailability}
                      className="consult-btn"
                      style={{ backgroundColor: '#10b981' }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Modal actions */}
              {modalMode !== 'view' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                  <button type="button" onClick={closeModal} className="secondary-btn">Cancel</button>
                  <button type="button" onClick={handleSubmit} disabled={loading} className="consult-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {loading ? (
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {modalMode === 'add' ? 'Add Doctor' : 'Update Doctor'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && doctors.length === 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999
        }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '3px solid #3b82f6',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Loading doctors...</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorManagement;
