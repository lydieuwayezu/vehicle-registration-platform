import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVehicleInfo, getVehicleOwner, getVehicleRegistration, getVehicleInsurance } from '../services/api';

const TABS = ['info', 'owner', 'registration', 'insurance'];

function DetailGrid({ id, queryKey, queryFn }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['vehicle', id, queryKey],
    queryFn: () => queryFn(id),
  });

  if (isLoading) return <div className="center-msg">Loading...</div>;
  if (isError) return (
    <div className="error-banner">
      Failed to load {queryKey} data. {error?.message}
    </div>
  );

  const entries = Object.entries(data ?? {}).filter(([k]) => k !== 'id');

  return (
    <div className="detail-grid">
      {entries.length === 0
        ? <p style={{ color: '#888' }}>No data available.</p>
        : entries.map(([k, v]) => (
          <div key={k} className="detail-item">
            <strong>{k.replace(/([A-Z])/g, ' $1').trim()}</strong>
            <span>{v === null || v === undefined ? '—' : String(v)}</span>
          </div>
        ))
      }
    </div>
  );
}

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');

  const tabConfig = {
    info: getVehicleInfo,
    owner: getVehicleOwner,
    registration: getVehicleRegistration,
    insurance: getVehicleInsurance,
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Vehicle Details</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate(`/vehicle/${id}/edit`)} className="btn-primary">Edit</button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">← Back</button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <DetailGrid id={id} queryKey={activeTab} queryFn={tabConfig[activeTab]} />
      </div>
    </div>
  );
}
