import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';
import UniversityCard from './UniversityCard';

function Dashboard() {
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);

  const currentPrediction = location.state?.prediction;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/history');
        setHistory(res.data);
      } catch {
        console.error('Failed to fetch history');
      }
    };
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all prediction history?')) {
      try {
        await api.delete('/api/history');
        setHistory([]);
      } catch {
        alert('Failed to clear history. Please try again.');
      }
    }
  };

  const handleShortlist = (uni) => {
    setShortlisted((prev) => {
      const exists = prev.find((u) => u._id === uni._id);
      return exists ? prev.filter((u) => u._id !== uni._id) : [...prev, uni];
    });
  };

  const handleContact = (uni) => {
    alert(`A FlyWest counselor will reach out about ${uni.name}. Call us at +1-800-FLYWEST or email counsel@flywest.edu`);
  };

  const getChartData = (chance) => [
    { name: 'Admit Chance', value: chance * 100 },
    { name: 'Risk', value: (1 - chance) * 100 },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Prediction Dashboard
      </h2>

      {currentPrediction ? (
        <div>
          <div className="glass-panel" style={{ padding: '3rem', display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ flex: '1', minWidth: '280px' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                Probability:{' '}
                <span className="text-gradient">
                  {(currentPrediction.chance_of_admit * 100).toFixed(1)}%
                </span>
              </h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentPrediction.recommendation}
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <Link to="/predict" className="btn btn-secondary">Analyze Another Profile</Link>
                <Link to="/universities" className="btn btn-primary" style={{ marginLeft: '0.75rem' }}>
                  Explore All Universities
                </Link>
              </div>
            </div>

            <div style={{ flex: '1', height: '280px', minWidth: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getChartData(currentPrediction.chance_of_admit)}
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {getChartData(currentPrediction.chance_of_admit).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '8px', color: 'white' }}
                    itemStyle={{ color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {currentPrediction.recommended_universities?.length > 0 ? (
            <div>
              <h3 className="text-gradient" style={{ marginBottom: '0.5rem' }}>
                Recommended Universities For You
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {currentPrediction.recommended_universities.length} universities matched your profile, country, and program.
              </p>
              <div className="uni-grid">
                {currentPrediction.recommended_universities.map((uni) => (
                  <UniversityCard
                    key={uni._id}
                    university={uni}
                    compact
                    onShortlist={handleShortlist}
                    onContact={handleContact}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                No universities matched your current profile and preferences. Try adjusting your scores or exploring all options.
              </p>
              <Link to="/universities" className="btn btn-primary">Browse University Database</Link>
            </div>
          )}

          {shortlisted.length > 0 && (
            <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', borderLeft: '4px solid var(--secondary-color)' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>Your Shortlist ({shortlisted.length})</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {shortlisted.map((u) => (
                  <span key={u._id} className="uni-program-tag">{u.name}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem', padding: '1rem 1.5rem', borderLeft: '4px solid var(--primary-color)', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '0 8px 8px 0' }}>
            <p style={{ margin: 0, fontWeight: 500 }}>
              Speak with a <span className="text-gradient">FlyWest Counselor</span> to start your application process!
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No current prediction to display.</h3>
          <Link to="/predict" className="btn btn-primary" style={{ marginTop: '1rem' }}>Get a Prediction</Link>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="text-gradient" style={{ margin: 0 }}>Recent Predictions History</h3>
            <button
              onClick={handleClearHistory}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
            >
              Clear History
            </button>
          </div>
          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Country</th>
                  <th style={{ padding: '1rem' }}>Course</th>
                  <th style={{ padding: '1rem' }}>CGPA</th>
                  <th style={{ padding: '1rem' }}>Probability</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>{record.country}</td>
                    <td style={{ padding: '1rem' }}>{record.course}</td>
                    <td style={{ padding: '1rem' }}>{record.cgpa}</td>
                    <td style={{ padding: '1rem', color: record.chance_of_admit > 0.6 ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                      {(record.chance_of_admit * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
