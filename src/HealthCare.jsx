import React from 'react';
import { ArrowRight, Shield, Clock, Users, CheckCircle, Phone, Video, Calendar, Search } from 'lucide-react';
import './Doctor/ManageSchedules.css'

const TelemedicineLanding = () => {
  const handleSignUp = () => {
    // Navigate to login page
    window.location.href = '/login';
  };

  return (
    <div className="doctor-booking-container">
      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'linear-gradient(135deg, #233067ff 0%, #4b4e86ff 100%)',
        borderRadius: '15px',
        marginBottom: '2rem'
      }}>
        <button className="logo-btn">
          <Shield size={24} style={{ marginRight: '0.5rem', display: 'inline' }} />
          MediCoverage
        </button>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button className="nav-btn">Features</button>
          <button className="nav-btn">About</button>
          <button className="nav-btn">Contact</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="booking-header">
        <h1 className="header-title">
          Check Your Telemedicine Coverage in Seconds 
        </h1>
        <p className="header-subtitle">
          Instantly verify if your insurance covers virtual consultations. 
          Save time, money, and get the care you need from anywhere.
        </p>
        <button className="consult-btn" onClick={handleSignUp} style={{ marginTop: '2rem' }}>
          Get Started 
          <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>

      {/* Features Grid */}
      <div className="quick-actions-grid">
        <div className="quick-action-card">
          <Clock className="quick-action-icon" size={48} style={{ color: '#10b981', margin: '0 auto 16px', display: 'block' }} />
          <h3 className="quick-action-title">Instant Results</h3>
          <p className="quick-action-subtitle">Get coverage info in under 30 seconds</p>
        </div>
        <div className="quick-action-card">
          <Shield className="quick-action-icon" size={48} style={{ color: '#10b981', margin: '0 auto 16px', display: 'block' }} />
          <h3 className="quick-action-title">Secure & Private</h3>
          <p className="quick-action-subtitle">Your data is encrypted and protected</p>
        </div>
        <div className="quick-action-card">
          <Users className="quick-action-icon" size={48} style={{ color: '#10b981', margin: '0 auto 16px', display: 'block' }} />
          <h3 className="quick-action-title">All Insurers</h3>
          <p className="quick-action-subtitle">Works with 500+ insurance providers</p>
        </div>
      </div>

      {/* Search Section styled as telemedicine benefits */}
      <div className="search-section">
        <h2 className="section-title">Why Choose Telemedicine?</h2>
        <div className="main-grid">
          <div className="left-column">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Coverage Benefits</h3>
                <Video size={24} style={{ color: '#10b981' }} />
              </div>
              <div className="stats-grid">
                <div className="stat-card green">
                  <div className="stat-number green">95%</div>
                  <div className="stat-label green">Coverage Rate</div>
                </div>
                <div className="stat-card blue">
                  <div className="stat-number blue">$0</div>
                  <div className="stat-label blue">Copay Average</div>
                </div>
                <div className="stat-card orange">
                  <div className="stat-number orange">24/7</div>
                  <div className="stat-label orange">Availability</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-number purple">15min</div>
                  <div className="stat-label purple">Avg Wait Time</div>
                </div>
              </div>
            </div>
          </div>
          <div className="right-column">
            <div className="health-tips-card">
              <h3 className="health-tips-title">Telemedicine Advantages</h3>
              <div className="health-tips-text">
                • No travel time or transportation costs<br/>
                • Access to specialists regardless of location<br/>
                • Reduced exposure to illness in waiting rooms<br/>
                • Convenient scheduling around your life<br/>
                • Quick prescription refills and follow-ups
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="booking-section">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          How It Works
        </h2>
        <div className="doctors-grid">
          <div className="doctor-card">
            <div className="doctor-info">
              <div className="doctor-avatar">1</div>
              <div className="doctor-details">
                <h3 className="doctor-name">Enter Your Insurance Info</h3>
                <p className="doctor-specialty">Quick & Secure Verification</p>
                <div className="doctor-meta">
                  <span className="rating">
                    <CheckCircle size={16} />
                    HIPAA Compliant
                  </span>
                </div>
                <p className="text-muted">Simply input your insurance details and we'll instantly check your telemedicine coverage benefits.</p>
              </div>
            </div>
          </div>
          
          <div className="doctor-card">
            <div className="doctor-info">
              <div className="doctor-avatar">2</div>
              <div className="doctor-details">
                <h3 className="doctor-name">Get Instant Results</h3>
                <p className="doctor-specialty">Coverage Details & Costs</p>
                <div className="doctor-meta">
                  <span className="rating">
                    <Clock size={16} />
                    Under 30 Seconds
                  </span>
                </div>
                <p className="text-muted">Receive detailed information about your coverage, copays, and which telemedicine services are included.</p>
              </div>
            </div>
          </div>
          
          <div className="doctor-card">
            <div className="doctor-info">
              <div className="doctor-avatar">3</div>
              <div className="doctor-details">
                <h3 className="doctor-name">Book Your Consultation</h3>
                <p className="doctor-specialty">Connect with Providers</p>
                <div className="doctor-meta">
                  <span className="rating">
                    <Video size={16} />
                    Same Day Available
                  </span>
                </div>
                <p className="text-muted">Use our platform to connect with qualified healthcare providers who accept your insurance.</p>
              </div>
            </div>
          </div>
        </div>
        
        <button className="confirm-button" onClick={handleSignUp}>
          Check My Coverage Now
        </button>
      </div>

      {/* Stats Section */}
      <div className="card" style={{ marginTop: '3rem' }}>
        <div className="stats-container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: '600' }}>
            Trusted by Thousands
          </h2>
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-number blue">50K+</div>
              <div className="stat-label blue">Coverage Checks</div>
            </div>
            <div className="stat-card green">
              <div className="stat-number green">500+</div>
              <div className="stat-label green">Insurance Plans</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-number orange">98%</div>
              <div className="stat-label orange">Accuracy Rate</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-number purple">24/7</div>
              <div className="stat-label purple">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Information */}
      <div style={{ marginTop: '3rem' }}>
        <div className="main-grid">
          <div className="left-column">
            <div className="emergency-card">
              <h3 className="emergency-title">When to Use Telemedicine</h3>
              <div className="emergency-list">
                <div className="emergency-item">
                  <CheckCircle className="emergency-icon" />
                  <span className="emergency-text">Routine check-ups and follow-ups</span>
                </div>
                <div className="emergency-item">
                  <CheckCircle className="emergency-icon" />
                  <span className="emergency-text">Prescription refills and medication management</span>
                </div>
                <div className="emergency-item">
                  <CheckCircle className="emergency-icon" />
                  <span className="emergency-text">Mental health consultations</span>
                </div>
                <div className="emergency-item">
                  <CheckCircle className="emergency-icon" />
                  <span className="emergency-text">Minor illness symptoms</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right-column">
            <div className="card">
              <h3 className="card-title">Ready to Get Started?</h3>
              <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
                Join thousands of satisfied users who have simplified their healthcare with our telemedicine coverage checker.
              </p>
              <button className="book-button" onClick={handleSignUp}>
                Check Coverage Now
                <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemedicineLanding;