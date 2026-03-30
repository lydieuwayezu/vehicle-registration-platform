import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getVehicles } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
    retry: 1,
  });

  if (isLoading) return <div className="center-msg">Loading vehicles...</div>;

  if (isError) return (
    <div className="page">
      <h1>Registered Vehicles</h1>
      <div className="error-banner">
        <strong>Failed to load vehicles.</strong> {error?.message}
      </div>
    </div>
  );

  const vehicles = Array.isArray(data) ? data : [];

  return (
    <div className="page">
      <h1>Registered Vehicles</h1>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Manufacturer</th><th>Model</th><th>Year</th>
              <th>Type</th><th>Status</th><th>Plate</th><th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0
              ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No vehicles found.</td></tr>
              : vehicles.map(v => (
                <tr key={v.id}>
                  <td>{v.manufacture}</td>
                  <td>{v.model}</td>
                  <td>{v.year}</td>
                  <td>{v.vehicleType}</td>
                  <td><span className={`badge badge-${v.vehicleStatus?.toLowerCase()}`}>{v.vehicleStatus}</span></td>
                  <td>{v.plateNumber ?? '—'}</td>
                  <td>
                    <button onClick={() => navigate(`/vehicle/${v.id}`)} className="btn-sm">View</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
