import { useEffect, useMemo, useState } from 'react';
import sidebarConfig from './data/sidebarMenu.json';
import { pageRegistry } from './pages';
import type { SidebarModule } from './types/navigation';

const modules = sidebarConfig.modules as SidebarModule[];
const defaultRoute = '/dashboard';

function getRouteFromHash() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || defaultRoute;
}

function App() {
  const [activeRoute, setActiveRoute] = useState(getRouteFromHash());
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [openModule, setOpenModule] = useState<string | null>('participant-support');

  useEffect(() => {
    const onHashChange = () => setActiveRoute(getRouteFromHash());
    window.addEventListener('hashchange', onHashChange);

    if (!window.location.hash) {
      window.location.hash = defaultRoute;
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const activePage = pageRegistry[activeRoute] ?? pageRegistry[defaultRoute];

  const activeModuleKey = useMemo(() => {
    const activeModule = modules.find((module) =>
      module.menus.some((menu) => menu.route === activeRoute)
    );
    return activeModule?.moduleKey ?? 'dashboard';
  }, [activeRoute]);

  const handleMenuClick = (route: string) => {
    window.location.hash = route;
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <button
            className="header-toggle"
            type="button"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarExpanded((prev) => !prev)}
          >
            <svg className="hamburger-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="header-brand" aria-label="CareMatrix">
            <img
              className="header-logo"
              src="https://pub-c61fbd9fa813427186a41ed133f48034.r2.dev/asset/website-banner/bg-logo.png"
              alt="CareMatrix logo"
            />
          </div>
        </div>
      </header>

      <div className="app" data-sidebar={sidebarExpanded ? 'expanded' : 'collapsed'}>
        <aside className="sidebar" aria-label="Primary">
          <nav className="sidebar-menu">
            {modules.map((module) => {
              const hasChildren = module.menus.length > 1 || module.moduleKey !== 'dashboard';
              const isModuleActive = activeModuleKey === module.moduleKey;
              const shouldOpen = openModule === module.moduleKey || isModuleActive;

              if (!hasChildren && module.menus[0]) {
                const menu = module.menus[0];
                return (
                  <button
                    key={module.moduleKey}
                    className={`sidebar-parent sidebar-parent--single ${activeRoute === menu.route ? 'active' : ''}`}
                    type="button"
                    onClick={() => handleMenuClick(menu.route)}
                  >
                    <span className="sidebar-parent__label">
                      <span className="sidebar-parent__text">{module.moduleLabel}</span>
                    </span>
                  </button>
                );
              }

              return (
                <div key={module.moduleKey}>
                  <button
                    className={`sidebar-parent ${shouldOpen ? 'is-open' : ''} ${isModuleActive ? 'active' : ''}`}
                    type="button"
                    aria-expanded={shouldOpen}
                    onClick={() => setOpenModule((prev) => (prev === module.moduleKey ? null : module.moduleKey))}
                  >
                    <span className="sidebar-parent__label">
                      <span className="sidebar-parent__text">{module.moduleLabel}</span>
                    </span>
                    <svg className="sidebar-parent__chevron" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M6 9l6 6 6-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div className={`sidebar-submenu ${shouldOpen ? 'is-open' : ''}`} aria-hidden={!shouldOpen}>
                    {module.menus.map((menu) => (
                      <button
                        key={menu.route}
                        className={`sidebar-item sidebar-subitem ${activeRoute === menu.route ? 'active' : ''}`}
                        type="button"
                        onClick={() => handleMenuClick(menu.route)}
                      >
                        <span className="sidebar-item__text">{menu.menuLabel}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="content">
          <div className="menu-panels">
            <section className="menu-panel active">
              <section className="hero hero--compact">
                <h1>{activePage.title}</h1>
                <p>{activePage.subtitle}</p>
              </section>

              <section className="stat-grid stat-grid--compact">
                {activePage.stats.map((stat) => (
                  <article key={stat.label} className="stat-card">
                    <div>
                      <h3>{stat.value}</h3>
                      <p>{stat.label}</p>
                    </div>
                  </article>
                ))}
              </section>

              <section className="panel table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePage.table.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td>{row.type}</td>
                        <td>{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
