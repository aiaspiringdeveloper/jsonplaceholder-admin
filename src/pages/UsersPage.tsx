import { useEffect, useMemo, useState } from 'react';
import type { User } from '../types';
import './users.css';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // create form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // search
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data: User[] = await res.json();
        setUsers(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load users';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(q.toLowerCase()) ||
          u.username.toLowerCase().includes(q.toLowerCase()) ||
          u.email.toLowerCase().includes(q.toLowerCase())
      ),
    [users, q]
  );

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !username || !email) return;

    try {
      await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email }),
      });
      const newId = Math.max(0, ...users.map((u) => u.id)) + 1;
      setUsers((prev) => [{ id: newId, name, username, email }, ...prev]);
      setName(''); setUsername(''); setEmail('');
    } catch {
      alert('Failed to create user');
    }
  }

  function onDelete(id: number) {
    if (!confirm('Delete this user?')) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  function onEdit(id: number) {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const newName = prompt('Enter new name', user.name);
    const newUsername = prompt('Enter new username', user.username);
    const newEmail = prompt('Enter new email', user.email);
    if (!newName || !newUsername || !newEmail) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, name: newName, username: newUsername, email: newEmail } : u
      )
    );
  }

  if (loading) return <div className="container"><p>Loading users…</p></div>;
  if (error) return <div className="container"><p role="alert">{error}</p></div>;

  return (
    <div id="users">
      <div className="container">
        <div className="section" aria-label="Users">
          {/* Toolbar */}
          <div className="toolbar">
            <div className="title">
              <h2 style={{ margin: 0 }}>👤 Users</h2>
              <span className="badge">Count: {filtered.length}</span>
            </div>
            <div className="search">
              <input
                type="text"
                className="input search"
                placeholder="Search users by name, username, or email…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          {/* Create form */}
          <form onSubmit={onCreate} className="form">
            <input
              className="input"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">Create</button>
          </form>

          {/* List */}
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th style={{ width: 180 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-secondary" onClick={() => onEdit(u.id)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => onDelete(u.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="footer">
            <span>Note: JSONPlaceholder accepts writes but does not persist. UI updates are optimistic.</span>
          </div>
        </div>
      </div>
    </div>
  );
}