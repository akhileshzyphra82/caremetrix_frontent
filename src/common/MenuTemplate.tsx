type MenuTemplateProps = {
  moduleName: string;
  menuName: string;
};

export function MenuTemplate({ moduleName, menuName }: MenuTemplateProps) {
  return (
    <section className="menu-panel active">
      <div className="hero hero--compact">
        <h1>{menuName}</h1>
        <p>{moduleName} module workspace with dedicated route and page view.</p>
      </div>
      <div className="card">
        <div className="card__header">
          <div>
            <h2>{menuName} Overview</h2>
            <p>Track actions, pending items, and updates for this menu.</p>
          </div>
        </div>
        <div className="info-grid">
          <div className="info-card">
            <p>Total Records</p>
            <h3>128</h3>
            <span className="muted">Last sync: 5 mins ago</span>
          </div>
          <div className="info-card">
            <p>Open Tasks</p>
            <h3>14</h3>
            <span className="muted">4 urgent today</span>
          </div>
          <div className="info-card">
            <p>Completion</p>
            <h3>89%</h3>
            <span className="muted">Weekly target</span>
          </div>
        </div>
      </div>
    </section>
  );
}
