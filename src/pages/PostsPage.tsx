import { useEffect, useMemo, useState } from 'react';
import type { Post, User } from '../types';
import './posts.css';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [userId, setUserId] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // search
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [psRes, usRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/users'),
        ]);
        if (!psRes.ok) throw new Error(`Posts: ${psRes.status} ${psRes.statusText}`);
        if (!usRes.ok) throw new Error(`Users: ${usRes.status} ${usRes.statusText}`);
        const [ps, us] = await Promise.all([psRes.json(), usRes.json()]);
        setPosts(ps);
        setUsers(us);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load posts/users';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () => posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())),
    [posts, q]
  );

  const userName = (uid: number) =>
    users.find((u) => u.id === uid)?.name ?? `User ${uid}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !userId) return;

    if (editingId) {
      // UPDATE (optimistic)
      try {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, title }),
        });
        setPosts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, userId, title } : p))
        );
        setEditingId(null);
        setTitle('');
        setUserId(1);
      } catch {
        alert('Failed to update post');
      }
      return;
    }

    // CREATE (optimistic)
    try {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title }),
      });
      const newId = Math.max(0, ...posts.map((p) => p.id)) + 1;
      setPosts((prev) => [{ id: newId, userId, title }, ...prev]);
      setTitle('');
      setUserId(1);
    } catch {
      alert('Failed to create post');
    }
  }

  function startEdit(p: Post) {
    setEditingId(p.id);
    setUserId(p.userId);
    setTitle(p.title);
  }

  async function onDelete(id: number) {
    if (!confirm('Delete this post?')) return;
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete');
    }
  }

  if (loading) return <div className="container"><p>Loading posts…</p></div>;
  if (error) return <div className="container"><p role="alert">{error}</p></div>;

  return (
    <div id="posts">
      <div className="container">
        <div className="section" aria-label="Posts">
          {/* Toolbar */}
          <div className="toolbar" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ margin: 0 }}>📝 Posts</h2>
              <span className="badge">Count: {filtered.length}</span>
            </div>
            <input
              className="input"
              placeholder="Search posts by title…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ minWidth: 260 }}
            />
          </div>

          {/* Create / Edit form */}
          <form
            onSubmit={onSubmit}
            style={{ display: 'grid', gap: 10, gridTemplateColumns: '240px 1fr auto' }}
          >
            <select
              className="select"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              aria-label="Select user"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} — {u.name}
                </option>
              ))}
            </select>

            <input
              className="input"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update' : 'Create'}
            </button>
          </form>

          {/* List */}
          <table className="table" style={{ marginTop: 14 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>User</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.userId} — {userName(p.userId)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary" onClick={() => startEdit(p)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => onDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="footer">
            <span>Note: JSONPlaceholder accepts writes but does not persist. UI updates are optimistic.</span>
          </div>
        </div>
      </div>
    </div>
  );
}