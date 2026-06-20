import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/users').then(setUsers).catch(() => setError('Failed to load users')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      setForm({ username: '', email: '', password: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Users</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-header">Add User</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-4">
              <input className="form-control" placeholder="Username" value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Email" type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Password" type="password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary w-100" type="submit">Add</button>
            </div>
          </form>
        </div>
      </div>
      {loading ? <p>Loading…</p> : (
        <table className="table table-hover">
          <thead className="table-light">
            <tr><th>Username</th><th>Email</th><th>Fitness Level</th><th></th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td><span className="badge bg-secondary">{u.profile?.fitnessLevel || 'beginner'}</span></td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
