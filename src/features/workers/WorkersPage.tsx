import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { getStoredAuth } from '../auth/authStorage';
import { getTeams } from '../teams/teamsApi';
import {
  createWorker,
  deleteWorker,
  getWorkers,
  updateWorker,
  Worker
} from './workersApi';

type Form = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  teamIds: string[];
  status: 'Active' | 'Inactive';
};

const emptyForm: Form = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  teamIds: [],
  status: 'Active'
};

export function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [form, setForm] = useState<Form>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function load() {
    const auth = getStoredAuth();
    if (!auth) return;

    try {
      const [workersData, teamsData] = await Promise.all([
        getWorkers(auth.token),
        getTeams(auth.token)
      ]);

      setWorkers(workersData);
      setTeams(teamsData);
    } catch (err) {
      setError('Failed to load data');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    const auth = getStoredAuth();
    if (!auth) return;

    try {
      if (editingId) {
        await updateWorker(auth.token, editingId, {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          status: form.status
        });
      } else {
        await createWorker(auth.token, {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          teamIds: form.teamIds
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  function edit(worker: Worker) {
    setEditingId(worker.id);
    setForm({
      fullName: worker.fullName,
      email: worker.email,
      phone: worker.phone,
      address: worker.address,
      teamIds: worker.teams.map(t => t.id),
      status: worker.status
    });
  }

  async function remove(id: string) {
    const auth = getStoredAuth();
    if (!auth) return;

    if (!confirm('Delete worker?')) return;

    await deleteWorker(auth.token, id);
    await load();
  }

  function toggleTeam(teamId: string) {
    setForm(f => ({
      ...f,
      teamIds: f.teamIds.includes(teamId)
        ? f.teamIds.filter(id => id !== teamId)
        : [...f.teamIds, teamId]
    }));
  }

  return (
    <>
      <h1 className="page-title">Workers</h1>

      {error && <div className="form-error">{error}</div>}

      <Card title={editingId ? 'Edit Worker' : 'Create Worker'}>
        <div className="form-grid">

          <input placeholder="Full Name"
            value={form.fullName}
            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
          />

          <input placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />

          <input placeholder="Phone"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          />

          <input placeholder="Address"
            value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          />

          <div>
            <strong>Teams</strong>
            {teams.map(t => (
              <div key={t.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={form.teamIds.includes(t.id)}
                    onChange={() => toggleTeam(t.id)}
                  />
                  {t.name}
                </label>
              </div>
            ))}
          </div>

          {editingId && (
            <select
              value={form.status}
              onChange={e => setForm(f => ({
                ...f,
                status: e.target.value as any
              }))}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          )}

        </div>

        <button className="primary-btn" onClick={save}>
          {editingId ? 'Save' : 'Create'}
        </button>
      </Card>

      <Card title="Workers">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Teams</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {workers.map(w => (
              <tr key={w.id}>
                <td>{w.fullName}</td>
                <td>{w.email}</td>
                <td>{w.teams.map(t => t.name).join(', ')}</td>
                <td>{w.status}</td>
                <td>
                  <button onClick={() => edit(w)}>Edit</button>
                  <button onClick={() => remove(w.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}