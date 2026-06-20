import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/octofitapp-small.png';

export default function Navbar() {
  const { pathname } = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/users', label: 'Users' },
    { to: '/teams', label: 'Teams' },
    { to: '/activities', label: 'Activities' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/workouts', label: 'Workouts' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={logo} alt="OctoFit" height="32" />
          OctoFit Tracker
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav ms-auto">
            {links.map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <Link
                  className={`nav-link${pathname === to ? ' active' : ''}`}
                  to={to}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
