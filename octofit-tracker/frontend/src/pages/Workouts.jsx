import { useEffect, useState } from 'react';
import api from '../services/api';

const LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ title: '', description: '', fitnessLevel: 'beginner', estimatedCalories: '', exercises: [{ name: '', sets: '', reps: '' }] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (level = filter) => {
    setLoading(true);
    const qs = level ? `?fitnessLevel=${level}` : '';
    api.get(`/workouts${qs}`).then(setWorkouts).catch(() => setError('Failed to load workouts')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        estimatedCalories: Number(form.estimatedCalories),
        exercises: form.exercises.filter(ex => ex.name).map(ex => ({
          name: ex.name,
          sets: ex.sets ? Number(ex.sets) : undefined,
          reps: ex.reps ? Number(ex.reps) : undefined,
        })),
      };
      await api.post('/workouts', payload);
      setForm({ title: '', description: '', fitnessLevel: 'beginner', estimatedCalories: '', exercises: [{ name: '', sets: '', reps: '' }] });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const addExercise = () => setForm(f => ({ ...f, exercises: [...f.exercises, { name: '', sets: '', reps: '' }] }));
  const updateExercise = (i, field, value) => setForm(f => {
    const ex = [...f.exercises];
    ex[i] = { ...ex[i], [field]: value };
    return { ...f, exercises: ex };
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this workout?')) return;
    await api.delete(`/workouts/${id}`);
    load();
  };

  const levelBadge = { beginner: 'success', intermediate: 'warning', advanced: 'danger' };

  return (
    <div className="container py-4">
      <h2 className="mb-4">💪 Workouts</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3 d-flex gap-2">
        <select className="form-select w-auto" value={filter} onChange={e => { setFilter(e.target.value); load(e.target.value); }}>
          <option value="">All levels</option>
          {LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="card mb-4">
        <div className="card-header">Add Workout</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-2 mb-2">
              <div className="col-md-4">
                <input className="form-control" placeholder="Title" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <select className="form-select" value={form.fitnessLevel} onChange={e => setForm({ ...form, fitnessLevel: e.target.value })}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <input className="form-control" placeholder="Est. calories" type="number" value={form.estimatedCalories}
                  onChange={e => setForm({ ...form, estimatedCalories: e.target.value })} />
              </div>
            </div>
            <div className="mb-2">
              <input className="form-control" placeholder="Description" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label fw-semibold">Exercises</label>
              {form.exercises.map((ex, i) => (
                <div key={i} className="row g-2 mb-1">
                  <div className="col-md-5">
                    <input className="form-control" placeholder="Exercise name" value={ex.name}
                      onChange={e => updateExercise(i, 'name', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <input className="form-control" placeholder="Sets" type="number" value={ex.sets}
                      onChange={e => updateExercise(i, 'sets', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <input className="form-control" placeholder="Reps" type="number" value={ex.reps}
                      onChange={e => updateExercise(i, 'reps', e.target.value)} />
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-outline-secondary mt-1" onClick={addExercise}>+ Exercise</button>
            </div>
            <button className="btn btn-primary" type="submit">Add Workout</button>
          </form>
        </div>
      </div>

      {loading ? <p>Loading…</p> : (
        <div className="row g-3">
          {workouts.map(w => (
            <div key={w._id} className="col-md-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>{w.title}</span>
                  <span className={`badge bg-${levelBadge[w.fitnessLevel]}`}>{w.fitnessLevel}</span>
                </div>
                <div className="card-body">
                  <p className="text-muted small">{w.description}</p>
                  <p className="mb-1"><strong>~{w.estimatedCalories} kcal</strong></p>
                  <ul className="list-unstyled mb-0">
                    {w.exercises?.map((ex, i) => (
                      <li key={i} className="small">• {ex.name}{ex.sets ? ` — ${ex.sets}×${ex.reps}` : ''}</li>
                    ))}
                  </ul>
                </div>
                <div className="card-footer text-end">
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(w._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
