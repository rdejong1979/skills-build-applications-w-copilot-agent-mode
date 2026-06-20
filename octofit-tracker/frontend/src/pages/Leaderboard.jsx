import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ user: '', score: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/leaderboard'), api.get('/users')])
      .then(([l, u]) => { setEntries(l); setUsers(u); })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaderboard', { user: form.user, score: Number(form.score) });
      setForm({ user: '', score: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="container py-4">
      <h2 className="mb-4">🏆 Leaderboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-header">Add / Update Score</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-5">
              <select className="form-select" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} required>
                <option value="">Select user…</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Score" type="number" min="0" value={form.score}
                onChange={e => setForm({ ...form, score: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <button className="btn btn-success w-100" type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
      {loading ? <p>Loading…</p> : (
        <table className="table table-hover align-middle">
          <thead className="table-warning">
            <tr><th>Rank</th><th>User</th><th>Score</th><th>Period</th></tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={e._id} className={i === 0 ? 'table-success fw-bold' : ''}>
                <td>{medals[i] || `#${i + 1}`}</td>
                <td>{e.user?.username || '—'}</td>
                <td>{e.score}</td>
                <td>{e.period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
