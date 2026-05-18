import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1.2 }}>
        FlyWest <span className="text-gradient">Admissions Predictor</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '2rem auto', lineHeight: 1.6 }}>
        Empowering FlyWest counselors and students. Use our advanced Machine Learning engine to accurately predict your chances of admission to top universities worldwide based on your academic profile.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
        <Link to="/predict" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
          Check Your Chances Now
        </Link>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '5rem', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ padding: '2rem', flex: '1', minWidth: '250px' }}>
          <h3 className="text-gradient">Data-Driven</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Our ML model is trained on thousands of global admission records to give you accurate probability scores.</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', flex: '1', minWidth: '250px' }}>
          <h3 className="text-gradient">Personalized</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Get tailored recommendations based on your preferred country and course of study.</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', flex: '1', minWidth: '250px' }}>
          <h3 className="text-gradient">Strategic</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Identify safety, target, and reach schools to optimize your study abroad applications.</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
