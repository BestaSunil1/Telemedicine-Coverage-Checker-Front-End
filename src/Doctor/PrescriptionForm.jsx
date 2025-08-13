import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:9090/api';

const PrescriptionForm = ({ appointmentId, patientId, doctorName, onCompleted }) => {
  const [form, setForm] = useState({
    medication: '',
    dosage: '',
    duration: '',
    instructions: '',
    refills: 0,
    pharmacy: ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.medication || !form.dosage) {
      alert("Please fill in medication and dosage");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE_URL}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          doctor: `Dr. ${doctorName}`,
          date: new Date().toISOString(),
          appointmentId,
          patientId
        })
      });
      if (!res.ok) throw new Error('Failed to save prescription');
      alert("Prescription saved successfully");
      onCompleted();
    } catch (e) {
      console.error(e);
      alert("Error saving prescription");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <input type="text" name="medication" placeholder="Medication" value={form.medication} onChange={handleChange} className="search-input" style={{ marginBottom: '8px' }} />
      <input type="text" name="dosage" placeholder="Dosage" value={form.dosage} onChange={handleChange} className="search-input" style={{ marginBottom: '8px' }} />
      <input type="text" name="duration" placeholder="Duration" value={form.duration} onChange={handleChange} className="search-input" style={{ marginBottom: '8px' }} />
      <textarea name="instructions" placeholder="Instructions" value={form.instructions} onChange={handleChange} className="search-input" style={{ marginBottom: '8px' }} />
      <input type="number" name="refills" placeholder="Refills" value={form.refills} onChange={handleChange} className="search-input" style={{ marginBottom: '8px' }} />
      <input type="text" name="pharmacy" placeholder="Pharmacy" value={form.pharmacy} onChange={handleChange} className="search-input" style={{ marginBottom: '8px' }} />

      <button className="consult-btn" style={{ width: '100%' }} onClick={handleSubmit} disabled={saving}>
        {saving ? 'Saving...' : 'Save Prescription'}
      </button>
    </div>
  );
};

export default PrescriptionForm;
