import { useEffect, useState } from 'react';
import api from '../services/api';

const TYPES = ['running', 'walking', 'cycling', 'swimming', 'strength', 'yoga', 'other'];

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ user: '', type: 'running', duration: '', distance: '', calories: '', notes: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/activities'), api.get('/users')])
      .then(([a, u]) => { setActivities(a); setUsers(u); })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/activities', { ...form, duration: Number(form.duration), distance: form.distance ? Number(form.distance) : undefined, calories: form.calories ? Number(form.calories) : undefined });
      setForm({ user: '', type: 'running', duration: '', distance: '', calories: '', notes: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this activity?')) return;
    await api.delete(`/activities/${id}`);
    load();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Activities</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-header">Log Activity</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-3">
              <select className="form-select" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} required>
                <option value="">Select user…</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Duration (min)" type="number" min="1" value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Distance (km)" type="number" step="0.1" value={form.distance}
                onChange={e => setForm({ ...form, distance: e.target.value })} />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Calories" type="number" value={form.calories}
                onChange={e => setForm({ ...form, calories: e.target.value })} />
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary w-100" type="submit">Log</button>
            </div>
          </form>
        </div>
      </div>
      {loading ? <p>Loading…</p> : (
        <table className="table table-hover">
          <thead className="table-light">
            <tr><th>User</th><th>Type</th><th>Duration</th><th>Distance</th><th>Calories</th><th>Date</th><th></th></tr>
          </thead>
          <tbody>
            {activities.map(a => (
              <tr key={a._id}>
                <td>{a.user?.username || '—'}</td>
                <td><span className="badge bg-info text-dark">{a.type}</span></td>
                <td>{a.duration} min</td>
                <td>{a.distance ? `${a.distance} km` : '—'}</td>
                <td>{a.calories || '—'}</td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(a._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
