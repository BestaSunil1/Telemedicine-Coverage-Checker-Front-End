// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, Pill, Clock, User, Calendar, MapPin, RotateCcw } from 'lucide-react';
// import './Prescription.css'; // Import the CSS file

// const PrescriptionFeed = () => {
//   const [expandedCard, setExpandedCard] = useState(null);

//   const prescriptions = [
//     {
//       id: 1,
//       medication: "Amoxicillin 500mg",
//       dosage: "Take 2 tablets twice daily",
//       doctor: "Dr. Sarah Johnson",
//       date: "July 20, 2025",
//       duration: "7 days",
//       instructions: "Take with food. Complete the full course even if you feel better. Do not skip doses as this may lead to antibiotic resistance.",
//       refills: 2,
//       pharmacy: "MedPlus Pharmacy"
//     },
//     {
//       id: 2,
//       medication: "Lisinopril 10mg",
//       dosage: "Take 1 tablet once daily",
//       doctor: "Dr. Michael Chen",
//       date: "July 18, 2025",
//       duration: "30 days",
//       instructions: "Take at the same time each day, preferably in the morning. Monitor blood pressure regularly and report any dizziness or persistent cough.",
//       refills: 5,
//       pharmacy: "HealthCare Pharmacy"
//     },
//     {
//       id: 3,
//       medication: "Metformin 850mg",
//       dosage: "Take 1 tablet with breakfast and dinner",
//       doctor: "Dr. Emily Rodriguez",
//       date: "July 15, 2025",
//       duration: "90 days",
//       instructions: "Take with meals to reduce stomach upset. Monitor blood sugar levels regularly. Contact your doctor if you experience persistent nausea or unusual fatigue.",
//       refills: 3,
//       pharmacy: "Community Pharmacy"
//     },
//     {
//       id: 4,
//       medication: "Atorvastatin 20mg",
//       dosage: "Take 1 tablet at bedtime",
//       doctor: "Dr. James Wilson",
//       date: "July 12, 2025",
//       duration: "30 days",
//       instructions: "Take at the same time each evening. Avoid grapefruit juice. Report any muscle pain or weakness immediately.",
//       refills: 6,
//       pharmacy: "Wellness Pharmacy"
//     }
//   ];

//   const toggleCard = (cardId) => {
//     setExpandedCard(expandedCard === cardId ? null : cardId);
//   };

//   return (
//     <div className="prescription-feed">
   

//       {prescriptions.map((prescription) => (
//           <div 
//             key={prescription.id} 
//             className={`prescription-card ${expandedCard === prescription.id ? 'expanded' : ''}`}
//           >
//             <div 
//               className="card-header" 
//               onClick={() => toggleCard(prescription.id)}
//             >
//               <div className="medication-name">
//                 <Pill className="pill-icon" size={20} />
//                 {prescription.medication}
//               </div>
              
//               <div className="dosage-info">
//                 {prescription.dosage}
//               </div>
              
//               <div className="card-meta">
//                 <div className="meta-item">
//                   <User className="meta-icon" />
//                   {prescription.doctor}
//                 </div>
//                 <div className="meta-item">
//                   <Calendar className="meta-icon" />
//                   {prescription.date}
//                 </div>
//                 <div className="meta-item">
//                   <Clock className="meta-icon" />
//                   <span className="duration-badge">{prescription.duration}</span>
//                 </div>
//               </div>
              
//               <div className={`expand-icon ${expandedCard === prescription.id ? 'rotated' : ''}`}>
//                 {expandedCard === prescription.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//               </div>
//             </div>

//             {expandedCard === prescription.id && (
//               <div className="card-details">
//                 <div className="details-grid">
//                   <div className="detail-section">
//                     <div className="detail-title">Pharmacy</div>
//                     <div className="detail-content">
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                         <MapPin size={14} />
//                         {prescription.pharmacy}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="detail-section">
//                     <div className="detail-title">Refills Remaining</div>
//                     <div className="detail-content">
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                         <RotateCcw size={14} />
//                         <span className="refill-badge">{prescription.refills} left</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="detail-section instructions-section">
//                     <div className="detail-title">Special Instructions</div>
//                     <div className="detail-content">
//                       {prescription.instructions}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//     </div>
//   );
// };

// export default PrescriptionFeed;

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Pill, Clock, User, Calendar, MapPin, RotateCcw } from 'lucide-react';
import './Prescription.css';

const API_BASE_URL = 'http://localhost:9090/api';

const PrescriptionFeed = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get patientId from localStorage
  const patientId = localStorage.getItem('patientId');

  useEffect(() => {
    if (patientId) {
      fetchPrescriptions();
    } else {
      console.error('No patientId found in localStorage');
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/prescriptions/patient/${patientId}`);
      if (!res.ok) throw new Error('Failed to fetch prescriptions');
      const data = await res.json();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading prescriptions...</p>;
  }

  if (prescriptions.length === 0) {
    return <p style={{ textAlign: 'center' }}>No prescriptions found.</p>;
  }

  return (
    <div className="prescription-feed">
      {prescriptions.map((prescription) => (
        <div
          key={prescription.id}
          className={`prescription-card ${expandedCard === prescription.id ? 'expanded' : ''}`}
        >
          <div className="card-header" onClick={() => toggleCard(prescription.id)}>
            <div className="medication-name">
              <Pill className="pill-icon" size={20} />
              {prescription.medication}
            </div>

            <div className="dosage-info">
              {prescription.dosage}
            </div>

            <div className="card-meta">
              <div className="meta-item">
                <User className="meta-icon" />
                {prescription.doctor}
              </div>
              <div className="meta-item">
                <Calendar className="meta-icon" />
                {prescription.date}
              </div>
              <div className="meta-item">
                <Clock className="meta-icon" />
                <span className="duration-badge">{prescription.duration}</span>
              </div>
            </div>

            <div className={`expand-icon ${expandedCard === prescription.id ? 'rotated' : ''}`}>
              {expandedCard === prescription.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>

          {expandedCard === prescription.id && (
            <div className="card-details">
              <div className="details-grid">
                <div className="detail-section">
                  <div className="detail-title">Pharmacy</div>
                  <div className="detail-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} />
                      {prescription.pharmacy}
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <div className="detail-title">Refills Remaining</div>
                  <div className="detail-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RotateCcw size={14} />
                      <span className="refill-badge">{prescription.refills} left</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section instructions-section">
                  <div className="detail-title">Special Instructions</div>
                  <div className="detail-content">
                    {prescription.instructions}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PrescriptionFeed;
