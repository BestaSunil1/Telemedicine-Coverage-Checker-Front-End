import React, { useState } from 'react';
import { Search, MapPin, Clock, Award, Calendar, User, Star, Phone, Mail } from 'lucide-react';
import './DoctorSearch.css'; // Import the CSS file

const DoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const sampleDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      location: "Heart Care Center, Bangalore",
      rating: 4.8,
      reviews: 247,
      experience: "15 years",
      availability: "Available Today",
      phone: "+91 98765 43210",
      email: "sarah.johnson@heartcare.com",
      consultationFee: "₹800"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      location: "Brain & Spine Clinic, Bangalore",
      rating: 4.9,
      reviews: 189,
      experience: "12 years",
      availability: "Next Available: Tomorrow",
      phone: "+91 98765 43211",
      email: "michael.chen@brainspine.com",
      consultationFee: "₹1200"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Endocrinologist",
      location: "Diabetes Care Hospital, Bangalore",
      rating: 4.7,
      reviews: 156,
      experience: "10 years",
      availability: "Available Today",
      phone: "+91 98765 43212",
      email: "emily.rodriguez@diabetescare.com",
      consultationFee: "₹700"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      location: "Bone & Joint Center, Bangalore",
      rating: 4.6,
      reviews: 203,
      experience: "18 years",
      availability: "Next Available: Day after tomorrow",
      phone: "+91 98765 43213",
      email: "james.wilson@bonejoint.com",
      consultationFee: "₹1000"
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Filter doctors based on search query
      const filtered = sampleDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Sort results
      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'experience':
            return parseInt(b.experience) - parseInt(a.experience);
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
      
      setSearchResults(sorted);
    } else {
      setSearchResults([]);
    }
    setIsSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="rating-stars">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
      </div>
    );
  };

  return (
    <div className="doctor-search-container">
      <div className="search-header">
        <h1 className="search-title">Search for the doctor</h1>
        <div className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="with the name or with the specification"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>
            Search btn
          </button>
        </div>
      </div>

      {isSearched && (
        <div className="search-results">
          <div className="results-header">
            <div className="results-count">
              {searchResults.length} doctors found
            </div>
            <div className="sort-options">
              <span className="sort-label">Sort by:</span>
              <select 
                className="sort-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Rating</option>
                <option value="experience">Experience</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {searchResults.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <div className="no-results-text">No doctors found</div>
              <div className="no-results-subtext">
                Try searching with a different name or specialty
              </div>
            </div>
          ) : (
            searchResults.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-header">
                  <div className="doctor-info">
                    <div className="doctor-name">{doctor.name}</div>
                    <div className="doctor-specialty">{doctor.specialty}</div>
                    <div className="doctor-location">
                      <MapPin size={16} />
                      {doctor.location}
                    </div>
                  </div>
                  <div className="rating-section">
                    {renderStars(doctor.rating)}
                    <div className="rating-text">
                      {doctor.rating} ({doctor.reviews} reviews)
                    </div>
                  </div>
                </div>

                <div className="doctor-details">
                  <div className="detail-item">
                    <Award className="detail-icon" size={16} />
                    <span>{doctor.experience} experience</span>
                  </div>
                  <div className="detail-item">
                    <Clock className="detail-icon" size={16} />
                    <span>{doctor.availability}</span>
                  </div>
                  <div className="detail-item">
                    <Phone className="detail-icon" size={16} />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="detail-item">
                    <Mail className="detail-icon" size={16} />
                    <span>{doctor.email}</span>
                  </div>
                </div>

                <div className="doctor-actions">
                  <button className="action-button view-profile">
                    View Profile
                  </button>
                  <button className="action-button book-appointment">
                    Book Appointment - {doctor.consultationFee}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;