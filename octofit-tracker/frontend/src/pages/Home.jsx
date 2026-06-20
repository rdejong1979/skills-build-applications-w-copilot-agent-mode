import logo from '../assets/octofitapp-small.png';

export default function Home() {
  return (
    <div className="container py-5 text-center">
      <img src={logo} alt="OctoFit Tracker" className="mb-4" style={{ height: 120 }} />
      <h1 className="display-4 fw-bold">Welcome to OctoFit Tracker</h1>
      <p className="lead text-muted">
        Track your fitness activities, compete with teammates, and get personalized workout
        suggestions — built for Mergington High School by Paul Octo & the IT team.
      </p>
      <div className="row g-3 justify-content-center mt-4">
        {[
          { emoji: '👤', title: 'User Profiles', desc: 'Manage student accounts and fitness profiles.' },
          { emoji: '🏆', title: 'Leaderboard', desc: 'See who is leading the fitness challenge.' },
          { emoji: '🏃', title: 'Activities', desc: 'Log runs, walks, cycling, and more.' },
          { emoji: '👥', title: 'Teams', desc: 'Create and manage fitness teams.' },
          { emoji: '💪', title: 'Workouts', desc: 'Get personalised workout plans.' },
        ].map(({ emoji, title, desc }) => (
          <div key={title} className="col-sm-6 col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="fs-1">{emoji}</div>
                <h5 className="card-title">{title}</h5>
                <p className="card-text text-muted small">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
