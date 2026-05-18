import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../api';
import UniversityCard from './UniversityCard';

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany'];
const TIERS = ['Reach', 'Target', 'Safe'];
const TUITION_BANDS = [
  { label: 'All Budgets', value: '' },
  { label: 'Under $25k', value: '25000' },
  { label: 'Under $40k', value: '40000' },
  { label: 'Under $55k', value: '55000' },
];
const PROGRAMS = ['Computer Science', 'Data Science', 'Business Analytics', 'Engineering', 'MBA'];

function UniversityExplorer() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [tuitionFilter, setTuitionFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await api.get('/api/universities');
        setUniversities(response.data);
      } catch (error) {
        console.error('Failed to fetch universities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = countryFilter ? u.country === countryFilter : true;
      const matchesTier = tierFilter ? u.tier === tierFilter : true;
      const matchesTuition = tuitionFilter ? (u.tuitionFeeUSD ?? 999999) <= Number(tuitionFilter) : true;
      const matchesProgram = programFilter ? u.programs?.includes(programFilter) : true;
      return matchesSearch && matchesCountry && matchesTier && matchesTuition && matchesProgram;
    });
  }, [universities, searchTerm, countryFilter, tierFilter, tuitionFilter, programFilter]);

  const handleContact = (uni) => {
    alert(`Interested in ${uni.name}? A FlyWest counselor will contact you. Email: counsel@flywest.edu`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCountryFilter('');
    setTierFilter('');
    setTuitionFilter('');
    setProgramFilter('');
  };

  const hasActiveFilters = searchTerm || countryFilter || tierFilter || tuitionFilter || programFilter;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2.5rem' }}>
        University Explorer
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Browse {universities.length} top global universities — filter by country, tier, budget, and program.
      </p>

      <div className="glass-panel filter-bar">
        <input
          type="text"
          placeholder="Search by name..."
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 2, minWidth: '200px' }}
        />
        <select className="form-control" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
          <option value="">All Countries</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="form-control" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
          <option value="">All Tiers</option>
          {TIERS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select className="form-control" value={tuitionFilter} onChange={(e) => setTuitionFilter(e.target.value)}>
          {TUITION_BANDS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
        <select className="form-control" value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}>
          <option value="">All Programs</option>
          {PROGRAMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {hasActiveFilters && (
          <button type="button" className="btn btn-secondary" onClick={clearFilters} style={{ whiteSpace: 'nowrap' }}>
            Clear Filters
          </button>
        )}
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Showing {filteredUniversities.length} of {universities.length} universities
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          Loading university database...
        </div>
      ) : (
        <div className="uni-grid">
          {filteredUniversities.map((uni) => (
            <UniversityCard key={uni._id} university={uni} onContact={handleContact} />
          ))}
          {filteredUniversities.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }} className="glass-panel">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                No universities match your filters.
              </p>
              <button type="button" className="btn btn-primary" onClick={clearFilters}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UniversityExplorer;
