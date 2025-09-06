import { Link } from 'react-router-dom';
import './home.css';

export default function Home() {
  return (
    <div id="home">
      {/* Top nav */}
      <nav className="nav" aria-label="Primary">
        <div className="logo" aria-hidden />
        <div className="brand">Assignment by Maiwand Kakar</div>
      </nav>

      <div className="container">
        {/* Hero */}
        <section className="hero" aria-label="Hero">
          <div>
            <h1 className="gradient">Clean, Minimal Admin</h1>
            <p>
              A modern React + TypeScript admin panel powered by the JSONPlaceholder API.  
              Quickly explore <strong>Users</strong> and <strong>Posts</strong> with clean UI and relations.
            </p>
          </div>

          <div className="visual" aria-hidden>
            <div className="blob" />
          </div>
        </section>

        {/* Quick links */}
        <section className="grid" aria-label="Quick links">
          <Link to="/users" className="card" aria-label="Go to Users">
            <h3>👤 Users</h3>
            <p>Inspect user records including id, name, username, and email.</p>
            <span className="badge">Open Users →</span>
          </Link>

          <Link to="/posts" className="card" aria-label="Go to Posts">
            <h3>📝 Posts</h3>
            <p>Browse posts and their relation to users via <code>userId</code>.</p>
            <span className="badge">Open Posts →</span>
          </Link>
        </section>

        {/* Footer */}
<footer className="footer" aria-label="Footer">
  <p>
    © {new Date().getFullYear()} Assignment by Maiwand Kakar · Built with React, Vite & TypeScript ·{' '}
    Data from <a href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noreferrer">JSONPlaceholder</a>
  </p>
</footer>
      </div>
    </div>
  );
}