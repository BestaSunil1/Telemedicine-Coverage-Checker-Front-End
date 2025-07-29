// // import React, { useState } from "react";
// // import axios from "axios";

// // export default function ZoomMeeting() {
// //   const [joinUrl, setJoinUrl] = useState("");
// //   const [topic, setTopic] = useState("Virtual Care Meeting");

// //   const scheduleMeeting = async () => {
// //     try {
// //       const res = await axios.post(
// //         "http://localhost:8081/api/zoom/meeting",
// //         {
// //           topic,
// //           type: 1   
// //         },
// //         {
// //           headers: {
// //             "Content-Type": "application/json"
// //           }
// //         }
// //       );
// //       const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
// //       setJoinUrl(data.join_url);
// //     } catch (err) {
// //       console.error("Error creating meeting:", err);
// //     }
// //   };

// //   return (
// //     <div>
// //       {!joinUrl ? (
// //         <div>
// //           <input
// //             value={topic}
// //             onChange={(e) => setTopic(e.target.value)}
// //             placeholder="Enter meeting topic"
// //           />
// //           <button onClick={scheduleMeeting}>Create Zoom Meeting</button>
// //         </div>
// //       ) : (
// //         <div>
// //           <p>Your meeting is ready!</p>
// //           <a href={joinUrl} target="_blank" rel="noopener noreferrer">
// //             Click here to join
// //           </a>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import React, { useState } from "react";
// import axios from "axios";
// import './zoom.css'; 

// export default function ZoomMeeting() {
//   const [joinUrl, setJoinUrl] = useState("");
//   const [topic, setTopic] = useState("Virtual Care Meeting");

//   const scheduleMeeting = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:8081/api/zoom/meeting",
//         {
//           topic,
//           type: 1, // instant meeting
//         },
//         {
//           headers: {
//             "Content-Type": "application/json"
//           }
//         }
//       );
//       const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
//       setJoinUrl(data.join_url);
//     } catch (err) {
//       console.error("Error creating meeting:", err);
//     }
//   };

//   return (
//     <div className="zoomMeetingContainer">
//       {!joinUrl ? (
//         <div>
//           <input
//             type="text"
//             className="zoomInput"
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//             placeholder="Enter meeting topic"
//           />
//           <button className="zoomButton" onClick={scheduleMeeting}>
//             Join Meet
//           </button>
//         </div>
//       ) : (
//         <div>
//           <p className="meetingReady">Your meeting is ready!</p>
//           <a className="joinLink" href={joinUrl} target="_blank" rel="noopener noreferrer">
//             Click here to join
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "axios";
import './zoom.css'; // Assume the CSS included previously or your own styling

export default function DoctorZoomMeeting() {
  const [joinUrl, setJoinUrl] = useState("");
  const [topic, setTopic] = useState("Doctor Consultation");

  // Call backend API to create Zoom meeting
  const scheduleMeeting = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8081/api/zoom/meeting",
        { topic, type: 1 }, // type 1 for instant meeting
        { headers: { "Content-Type": "application/json" } }
      );
      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      setJoinUrl(data.join_url);
    } catch (err) {
      console.error("Error creating meeting:", err);
    }
  };

  // Reset form to create another meeting
  const handleClear = () => {
    setTopic("Doctor Consultation");
    setJoinUrl("");
  };

  return (
    <div className="zoom-outer-box">
      <h1 className="zoom-title">Join Your Virtual Doctor Appointment</h1>
      <h4 className="zoom-subtitle">
        Enter your appointment details and click "Join Meet" to connect with your doctor instantly.
      </h4>
      <div className="zoom-meeting-content">
        {!joinUrl ? (
          <div className="zoom-form-row">
            <div className="zoom-form-field">
              <label className="zoom-label" htmlFor="topic-input">Appointment Topic</label>
              <input
                id="topic-input"
                type="text"
                className="zoom-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter appointment topic"
              />
            </div>
            <button className="zoom-action-btn" onClick={scheduleMeeting}>
              Join Meet
            </button>
          </div>
        ) : (
          <div className="zoom-meeting-ready">
            <p className="zoom-success-msg">Your appointment is ready!</p>
            <a
              className="zoom-join-link"
              href={joinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here to join your doctor
            </a>
            <button className="zoom-clear-btn" onClick={handleClear}>
              Schedule Another Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
