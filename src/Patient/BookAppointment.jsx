
import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, MapPin, Star, User } from 'lucide-react';
import './appointment.css';
import InsuranceEligibilityChecker from './InsuranceEligibilityChecker';

// Updated API endpoints
const AVAILABILITIES_API = 'http://localhost:9092/api/doctors/availabilities';
const AVAILABILITIES_BY_DAY_API = 'http://localhost:9092/api/doctors/availabilities/day/';

// Define how many availabilities to show per page
const AVAILABILITIES_PER_PAGE = 3;

const BookAppointment = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [filteredAvailabilities, setFilteredAvailabilities] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeSlots, setTimeSlots] = useState([]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch all available doctor availabilities
  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = () => {
    setLoading(true);
    fetch(AVAILABILITIES_API)
      .then(res => res.json())
      .then(data => {
        setAvailabilities(data);
        setFilteredAvailabilities(data);
        setCurrentPage(1);
      })
      .catch(err => {
        console.error('Failed to fetch availabilities', err);
        setAvailabilities([]);
        setFilteredAvailabilities([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch availabilities by specific day
  const fetchAvailabilitiesByDay = (dayOfWeek) => {
    if (!dayOfWeek) {
      fetchAvailabilities();
      return;
    }

    setLoading(true);
    fetch(`${AVAILABILITIES_BY_DAY_API}${dayOfWeek}`)
      .then(res => res.json())
      .then(data => {
        setAvailabilities(data);
        setFilteredAvailabilities(data);
        setCurrentPage(1);
      })
      .catch(err => {
        console.error('Failed to fetch availabilities by day', err);
        setAvailabilities([]);
        setFilteredAvailabilities([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle day filter change
  const handleDayFilterChange = (day) => {
    setSelectedDayFilter(day);
    fetchAvailabilitiesByDay(day);
  };

  // Generate time slots when an availability is selected
  useEffect(() => {
    if (selectedAvailability) {
      const slots = generateTimeSlots(selectedAvailability);
      setTimeSlots(slots);
    } else {
      setTimeSlots([]);
    }
  }, [selectedAvailability]);

  const generateTimeSlots = (availability) => {
    const start = new Date(availability.startTime);
    const end = new Date(availability.endTime);
    const duration = availability.appointmentDuration;

    const slots = [];
    let current = new Date(start);

    while (current < end) {
      slots.push(formatTime12Hour(current));
      current = new Date(current.getTime() + duration * 60000);
    }
    return slots;
  };

  const formatTime12Hour = (date) => {
    let h = date.getHours();
    let m = date.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m} ${ampm}`;
  };

  // Search and filter availabilities
  useEffect(() => {
    const filtered = availabilities.filter((availability) => {
      const doctorName = availability.doctorName?.toLowerCase() || '';
      const specializations = (availability.doctorSpecializations || []).map(s => s.toLowerCase());
      const dayOfWeek = availability.dayOfWeek?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();

      return (
        doctorName.includes(query) ||
        specializations.some(s => s.includes(query)) ||
        dayOfWeek.includes(query)
      );
    });

    setFilteredAvailabilities(filtered);
    setCurrentPage(1);
  }, [searchQuery, availabilities]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAvailabilities.length / AVAILABILITIES_PER_PAGE);
  const startIndex = (currentPage - 1) * AVAILABILITIES_PER_PAGE;
  const currentAvailabilities = filteredAvailabilities.slice(startIndex, startIndex + AVAILABILITIES_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSelectAvailability = (availability) => {
    setSelectedAvailability(availability);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleBook = () => {
    if (!selectedAvailability || !selectedDate || !selectedTime) {
      alert('Please select doctor availability, date, and time');
      return;
    }

    alert(`Booking appointment with Dr. ${selectedAvailability.doctorName} on ${selectedDate} at ${selectedTime} for ${selectedAvailability.appointmentDuration} minutes`);

    // Reset selections
    setSelectedAvailability(null);
    setSelectedDate('');
    setSelectedTime('');
    setTimeSlots([]);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="doctor-booking-container">
      <div className="booking-header">
        <h1 className="header-title">Book Your Appointment</h1>
        <p className="header-subtitle">Find and book appointments with available doctors in Bengaluru</p>
      </div>
        <div>
          <InsuranceEligibilityChecker />
        </div>
      {/* Search and Filter Section */}
      <div className="search-section">
        <h2 className="section-title">Search Available Doctor Slots</h2>
        
        <div className="search-container">
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or day"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Day Filter */}
        <div className="day-filter-container" style={{ marginTop: '20px' }}>
          <label className="form-label">Filter by Day of Week:</label>
          <select
            value={selectedDayFilter}
            onChange={e => handleDayFilterChange(e.target.value)}
            className="day-filter-select"
            style={{ padding: '8px', marginLeft: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">All Days</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Availabilities Grid */}
      <div className="availabilities-section">
        <h2 className="section-title">Available Doctor Slots</h2>
        
        {loading && <p>Loading available slots...</p>}
        
        {!loading && filteredAvailabilities.length === 0 && (
          <p>No available slots found. Try adjusting your search or day filter.</p>
        )}

        <div className="availabilities-grid">
          {!loading && currentAvailabilities.map(availability => (
            <div key={availability.id} className="availability-card">
              <div className="doctor-info">
                <div className="doctor-avatar">
                  <User size={40} />
                </div>
                <div className="doctor-details">
                  <h3 className="doctor-name">Dr. {availability.doctorName}</h3>
                  <p className="doctor-specialty">
                    {availability.doctorSpecializations.join(', ')}
                  </p>
                  <p className="doctor-email">{availability.doctorEmail}</p>
                </div>
              </div>
              
              <div className="availability-info">
                <div className="availability-day">
                  <Calendar size={16} />
                  <span>{availability.dayOfWeek}</span>
                </div>
                <div className="availability-time">
                  <Clock size={16} />
                  <span>
                    {formatDateTime(availability.startTime)} - {formatDateTime(availability.endTime)}
                  </span>
                </div>
                <div className="appointment-duration">
                  <span>{availability.appointmentDuration} min slots</span>
                </div>
              </div>

              <button
                onClick={() => handleSelectAvailability(availability)}
                className={`book-button ${selectedAvailability?.id === availability.id ? 'book-button-selected' : ''}`}
              >
                {selectedAvailability?.id === availability.id ? 'Selected' : 'Select Slot'}
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-controls" style={{ 
            textAlign: 'center', 
            marginTop: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <span style={{ fontWeight: 'bold' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Booking Section */}
      {selectedAvailability && (
        <div className="booking-section">
          <h2 className="section-title">
            Book Appointment with Dr. {selectedAvailability.doctorName}
          </h2>
          <div className="selected-availability-info" style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <p><strong>Specialty:</strong> {selectedAvailability.doctorSpecializations.join(', ')}</p>
            <p><strong>Available Day:</strong> {selectedAvailability.dayOfWeek}</p>
            <p><strong>Time Range:</strong> {formatDateTime(selectedAvailability.startTime)} - {formatDateTime(selectedAvailability.endTime)}</p>
            <p><strong>Appointment Duration:</strong> {selectedAvailability.appointmentDuration} minutes</p>
          </div>

          <div className="booking-form">
            <div className="date-time-container">
              <div className="date-container">
                <label className="form-label">
                  <Calendar size={18} className="label-icon" />
                  Select Date
                </label>
                <input
                  type="date"
                  className="date-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="time-container">
                <label className="form-label">
                  <Clock size={18} className="label-icon" />
                  Available Time Slots
                </label>
                {timeSlots.length === 0 && <p>No time slots available.</p>}
                <div className="time-slots">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`time-slot ${selectedTime === time ? 'time-slot-selected' : ''}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleBook}
              className="confirm-button"
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;