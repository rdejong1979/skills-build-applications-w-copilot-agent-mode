import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', members: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/teams'), api.get('/users')])
      .then(([t, u]) => { setTeams(t); setUsers(u); })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teams', form);
      setForm({ name: '', description: '', members: [] });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this team?')) return;
    await api.delete(`/teams/${id}`);
    load();
  };

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      members: f.members.includes(id) ? f.members.filter(m => m !== id) : [...f.members, id],
    }));
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Teams</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-header">Create Team</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input className="form-control" placeholder="Team name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-2">
              <input className="form-control" placeholder="Description (optional)" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label fw-semibold">Members</label>
              <div className="d-flex flex-wrap gap-2">
                {users.map(u => (
                  <div key={u._id} className="form-check">
                    <input className="form-check-input" type="checkbox" id={`m-${u._id}`}
                      checked={form.members.includes(u._id)} onChange={() => toggleMember(u._id)} />
                    <label className="form-check-label" htmlFor={`m-${u._id}`}>{u.username}</label>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" type="submit">Create</button>
          </form>
        </div>
      </div>
      {loading ? <p>Loading…</p> : (
        <div className="row g-3">
          {teams.map(t => (
            <div key={t._id} className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{t.name}</h5>
                  <p className="card-text text-muted small">{t.description}</p>
                  <p className="mb-1"><strong>Members:</strong> {t.members?.map(m => m.username).join(', ') || 'None'}</p>
                </div>
                <div className="card-footer text-end">
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
