export default function DashboardPage() {
  return (
    <section className="menu-panel active dashboard-page">
      <div className="hero">
        <h1>Good Morning</h1>
        <p>Welcome back, Ava. Here is your live operational snapshot for CareMatrix today.</p>
      </div>

      <div className="stat-grid">
        <article className="stat-card stat-card--mint">
          <div className="stat-card__icon" />
          <div>
            <p>Active Participants</p>
            <h3>1,284</h3>
          </div>
        </article>
        <article className="stat-card stat-card--sky">
          <div className="stat-card__icon" />
          <div>
            <p>Open Incidents</p>
            <h3>6</h3>
          </div>
        </article>
        <article className="stat-card stat-card--lavender">
          <div className="stat-card__icon" />
          <div>
            <p>Pending Approvals</p>
            <h3>12</h3>
          </div>
        </article>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="card">
            <div className="card__header">
              <div>
                <h2>Operational Queue</h2>
                <p>Expanded operational snapshot for today.</p>
              </div>
            </div>
            <div className="info-grid info-grid--tight">
              <div className="info-card"><p>Shifts Today</p><h3>86</h3><span className="muted">18 sites</span></div>
              <div className="info-card"><p>Coverage Gaps</p><h3>3</h3><span className="muted">Immediate fill</span></div>
              <div className="info-card"><p>Late Clock-ins</p><h3>6</h3><span className="muted">Last 24 hrs</span></div>
              <div className="info-card"><p>Escalations</p><h3>2</h3><span className="muted">Clinical alerts</span></div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <div>
                <h2>Directory Snapshot</h2>
                <p>Latest operational records.</p>
              </div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>ID</th><th>Role</th><th>Status</th><th>Priority</th></tr>
                </thead>
                <tbody>
                  <tr><td>01</td><td>OP-1093</td><td>Clinical Supervisor</td><td><span className="badge badge--teal">Active</span></td><td>High</td></tr>
                  <tr><td>02</td><td>OP-1208</td><td>Roster Coordinator</td><td><span className="badge badge--blue">Investigating</span></td><td>Medium</td></tr>
                  <tr><td>03</td><td>OP-0876</td><td>Participant Liaison</td><td><span className="badge badge--teal">Resolved</span></td><td>Low</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="card compact-card">
            <div className="card__header">
              <div>
                <h2>Approvals & Tasks</h2>
                <p>Items awaiting superadmin review.</p>
              </div>
            </div>
            <ul className="status-list status-list--compact">
              <li><span className="badge badge--teal">High</span> 3 urgent plan renewals</li>
              <li><span className="badge badge--blue">Standard</span> 8 agreements awaiting signatures</li>
              <li><span className="badge badge--gray">Info</span> 3 audit exports requested</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
