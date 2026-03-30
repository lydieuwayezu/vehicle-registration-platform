import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getVehicles, deleteVehicle } from '../services/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [confirmId, setConfirmId] = useState(null);

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle deleted.');
      setConfirmId(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Failed to delete vehicle.'),
  });

  const vehicles = Array.isArray(data) ? data : [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/vehicle/new" className="btn-primary">+ Register Vehicle</Link>
      </div>

      {isError && (
        <div className="error-banner" style={{ marginBottom: '1rem' }}>
          <strong>Failed to load vehicles.</strong> {error?.message}
        </div>
      )}

      {isLoading ? <div className="center-msg">Loading...</div> : (
        <>
          <div className="stats-row">
            <div className="stat-card"><span>{vehicles.length}</span><p>Total</p></div>
            <div className="stat-card"><span>{vehicles.filter(v => v.vehicleStatus === 'NEW').length}</span><p>New</p></div>
            <div className="stat-card"><span>{vehicles.filter(v => v.vehicleStatus === 'USED').length}</span><p>Used</p></div>
            <div className="stat-card"><span>{vehicles.filter(v => v.vehicleStatus === 'REBUILT').length}</span><p>Rebuilt</p></div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Manufacturer</th><th>Model</th><th>Year</th>
                  <th>Type</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length === 0
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No vehicles registered yet.</td></tr>
                  : vehicles.map(v => (
                    <tr key={v.id}>
                      <td>{v.manufacture}</td>
                      <td>{v.model}</td>
                      <td>{v.year}</td>
                      <td>{v.vehicleType}</td>
                      <td><span className={`badge badge-${v.vehicleStatus?.toLowerCase()}`}>{v.vehicleStatus}</span></td>
                      <td className="action-btns">
                        <button onClick={() => navigate(`/vehicle/${v.id}`)} className="btn-sm">View</button>
                        <button onClick={() => navigate(`/vehicle/${v.id}/edit`)} className="btn-sm btn-edit">Edit</button>
                        <button onClick={() => setConfirmId(v.id)} className="btn-sm btn-danger">Delete</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </>
      )}

      {confirmId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this vehicle? This cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => deleteMutation.mutate(confirmId)} className="btn-danger" disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
