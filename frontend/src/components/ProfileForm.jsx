import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

function ProfileForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gre: 320,
    toefl: 110,
    cgpa: 8.5,
    work_exp: 24,
    country: 'USA',
    course: 'Computer Science'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/predict', formData);
      setLoading(false);
      navigate('/dashboard', { state: { prediction: response.data } });
    } catch (error) {
      console.error(error);
      alert('Failed to get prediction. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '600px' }}>
        <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Enter Your Profile</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">GRE Score (out of 340)</label>
              <input type="number" name="gre" value={formData.gre} onChange={handleChange} className="form-control" required min="260" max="340" />
            </div>
            
            <div className="form-group">
              <label className="form-label">TOEFL Score (out of 120)</label>
              <input type="number" name="toefl" value={formData.toefl} onChange={handleChange} className="form-control" required min="0" max="120" />
            </div>
            
            <div className="form-group">
              <label className="form-label">CGPA (out of 10)</label>
              <input type="number" step="0.1" name="cgpa" value={formData.cgpa} onChange={handleChange} className="form-control" required min="0" max="10" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Work Experience (months)</label>
              <input type="number" name="work_exp" value={formData.work_exp} onChange={handleChange} className="form-control" required min="0" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Preferred Country</label>
              <select name="country" value={formData.country} onChange={handleChange} className="form-control">
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Preferred Course</label>
              <select name="course" value={formData.course} onChange={handleChange} className="form-control">
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science">Data Science</option>
                <option value="Business Analytics">Business Analytics</option>
                <option value="Engineering">Engineering</option>
                <option value="MBA">MBA</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }} disabled={loading}>
            {loading ? 'Analyzing Profile...' : 'Predict Admission Chances'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileForm;
