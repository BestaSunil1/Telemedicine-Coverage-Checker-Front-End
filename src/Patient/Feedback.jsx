import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Star, ThumbsUp, ThumbsDown, Clock, User } from 'lucide-react';
import './feedback.css';

const FeedbackComponent = () => {
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  const feedbackData = [
    {
      id: 1,
      title: "Excellent service and quick appointment",
      rating: 5,
      author: "Priya Sharma",
      date: "2 days ago",
      summary: "Great experience with Dr. Johnson...",
      fullContent: "I had an excellent experience with Dr. Johnson. The appointment was scheduled quickly through the platform, and the doctor was very professional and thorough. The clinic was clean and well-organized. I would definitely recommend this service to others. The online booking system made everything so convenient.",
      helpful: 12,
      category: "Positive"
    },
    {
      id: 2,
      title: "Booking system needs improvement",
      rating: 3,
      author: "Rajesh Kumar",
      date: "5 days ago",
      summary: "The booking process was confusing...",
      fullContent: "While the doctors are good, I found the booking system a bit confusing. It took me several attempts to successfully book an appointment. The time slots weren't very clear, and I had to call the clinic to confirm my appointment. The actual consultation was good, but the booking experience could be better.",
      helpful: 8,
      category: "Constructive"
    },
    {
      id: 3,
      title: "Great doctors, convenient location",
      rating: 4,
      author: "Anita Reddy",
      date: "1 week ago",
      summary: "Found exactly what I was looking for...",
      fullContent: "The platform helped me find a specialist near my location. Dr. Patel was very knowledgeable and took time to explain my condition. The clinic is easily accessible by metro. Only minor issue was the waiting time was slightly longer than expected, but overall a good experience.",
      helpful: 15,
      category: "Positive"
    },
    {
      id: 4,
      title: "Mobile app could be more user-friendly",
      rating: 3,
      author: "Vikram Singh",
      date: "1 week ago",
      summary: "Desktop version works well but mobile...",
      fullContent: "I primarily use my phone for booking appointments and found the mobile experience could be improved. Some buttons were hard to tap, and the layout felt cramped on smaller screens. However, the desktop version works perfectly fine. The doctors available through the platform are excellent.",
      helpful: 6,
      category: "Constructive"
    },
    {
      id: 5,
      title: "Outstanding care and follow-up",
      rating: 5,
      author: "Meera Nair",
      date: "2 weeks ago",
      summary: "Dr. Sharma provided exceptional care...",
      fullContent: "Dr. Sharma was absolutely wonderful. She provided exceptional care and even followed up with me after the consultation. The booking process was smooth, and I received timely reminders about my appointment. This platform has made healthcare so much more accessible. Highly recommend!",
      helpful: 20,
      category: "Positive"
    }
  ];

  const toggleFeedback = (feedbackId) => {
    setExpandedFeedback(expandedFeedback === feedbackId ? null : feedbackId);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < rating ? "#84a98c" : "none"}
        color={index < rating ? "#84a98c" : "#cad2c5"}
      />
    ));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Positive':
        return '#52796f';
      case 'Constructive':
        return '#84a98c';
      default:
        return '#354f52';
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1 className="feedback-title">Patient Feedback</h1>
        <p className="feedback-subtitle">See what our patients are saying about their experience</p>
      </div>

      <div className="feedback-stats">
        <div className="stat-item">
          <div className="stat-number">4.2</div>
          <div className="stat-label">Average Rating</div>
          <div className="stat-stars">
            {renderStars(4)}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-number">247</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">89%</div>
          <div className="stat-label">Positive Feedback</div>
        </div>
      </div>

      <div className="feedback-list">
        {feedbackData.map((feedback) => (
          <div key={feedback.id} className="feedback-item">
            <div className="feedback-header-row">
              <div className="feedback-main">
                <div className="feedback-top">
                  <h3 className="feedback-item-title">{feedback.title}</h3>
                  <div className="feedback-rating">
                    {renderStars(feedback.rating)}
                  </div>
                </div>
                <div className="feedback-meta">
                  <span className="feedback-author">
                    <User size={14} />
                    {feedback.author}
                  </span>
                  <span className="feedback-date">
                    <Clock size={14} />
                    {feedback.date}
                  </span>
                  <span 
                    className="feedback-category"
                    style={{ backgroundColor: getCategoryColor(feedback.category) }}
                  >
                    {feedback.category}
                  </span>
                </div>
                <p className="feedback-summary">
                  {expandedFeedback === feedback.id ? feedback.fullContent : feedback.summary}
                </p>
              </div>
              <button
                className="expand-button"
                onClick={() => toggleFeedback(feedback.id)}
                aria-label={expandedFeedback === feedback.id ? "Collapse feedback" : "Expand feedback"}
              >
                {expandedFeedback === feedback.id ? (
                  <>
                    <ChevronUp size={20} />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={20} />
                    <span>Read More</span>
                  </>
                )}
              </button>
            </div>

            {expandedFeedback === feedback.id && (
              <div className="feedback-actions">
                <div className="helpful-section">
                  <span className="helpful-text">Was this helpful?</span>
                  <div className="helpful-buttons">
                    <button className="helpful-btn">
                      <ThumbsUp size={16} />
                      Yes ({feedback.helpful})
                    </button>
                    <button className="helpful-btn">
                      <ThumbsDown size={16} />
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="feedback-cta">
        <div className="cta-content">
          <MessageSquare size={24} />
          <h3>Share Your Experience</h3>
          <p>Help others by sharing your feedback about our services</p>
          <button className="cta-button">Write a Review</button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackComponent;