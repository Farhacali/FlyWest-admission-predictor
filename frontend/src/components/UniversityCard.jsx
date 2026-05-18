import React, { useState } from 'react';

const TIER_COLORS = {
  Reach: { bg: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', border: 'rgba(239, 68, 68, 0.3)' },
  Target: { bg: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D', border: 'rgba(245, 158, 11, 0.3)' },
  Safe: { bg: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' },
};

function UniversityCard({ university, compact = false, onShortlist, onContact }) {
  const [shortlisted, setShortlisted] = useState(false);
  const tierStyle = TIER_COLORS[university.tier] || TIER_COLORS.Target;
  const maxPrograms = compact ? 2 : 3;

  const handleShortlist = () => {
    setShortlisted(!shortlisted);
    onShortlist?.(university);
  };

  return (
    <div className="university-card glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          position: 'relative',
          height: compact ? '140px' : '180px',
          backgroundImage: university.imageUrl ? `url(${university.imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
        }}
      >
        {university.logoUrl && (
          <img
            src={university.logoUrl}
            alt=""
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '12px',
              width: '40px',
              height: '40px',
              objectFit: 'contain',
              background: 'white',
              borderRadius: '8px',
              padding: '4px',
            }}
          />
        )}
        {university.tier && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: tierStyle.bg,
              color: tierStyle.color,
              border: `1px solid ${tierStyle.border}`,
            }}
          >
            {university.tier}
          </span>
        )}
      </div>

      <div style={{ padding: compact ? '1rem' : '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: compact ? '1rem' : '1.15rem', marginBottom: '0.4rem', color: '#F8FAFC', lineHeight: 1.3 }}>
          {university.name}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          📍 {university.city}, {university.country}
        </p>

        <div className="uni-stats-grid">
          <div className="uni-stat">
            <div className="uni-stat-label">Global Rank</div>
            <div className="uni-stat-value">#{university.globalRank ?? 'N/A'}</div>
          </div>
          <div className="uni-stat">
            <div className="uni-stat-label">Acceptance</div>
            <div className="uni-stat-value">{university.acceptanceRate ?? 'N/A'}</div>
          </div>
          <div className="uni-stat">
            <div className="uni-stat-label">Tuition</div>
            <div className="uni-stat-value">{university.avgTuition ?? 'N/A'}</div>
          </div>
          {university.applicationDeadline && (
            <div className="uni-stat">
              <div className="uni-stat-label">Deadline</div>
              <div className="uni-stat-value">{university.applicationDeadline}</div>
            </div>
          )}
        </div>

        {university.programs?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {university.programs.slice(0, maxPrograms).map((p) => (
              <span key={p} className="uni-program-tag">{p}</span>
            ))}
            {university.programs.length > maxPrograms && (
              <span className="uni-program-tag">+{university.programs.length - maxPrograms}</span>
            )}
          </div>
        )}

        {!compact && university.description && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1, lineHeight: 1.5 }}>
            {university.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <button
            type="button"
            className={`btn ${shortlisted ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
            onClick={handleShortlist}
          >
            {shortlisted ? '✓ Shortlisted' : 'Shortlist'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
            onClick={() => onContact?.(university)}
          >
            Contact Counselor
          </button>
        </div>
      </div>
    </div>
  );
}

export default UniversityCard;
