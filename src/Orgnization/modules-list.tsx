import { Fragment, useMemo, useState, type FormEvent } from 'react';

type MenuType = 'Feature' | 'Report';

type Menu = { id: string; name: string; priority: number; type: MenuType; urlPath: string };
type ModuleRow = { id: string; icon: string; name: string; priority: number; about: string; menus: Menu[] };

const defaultRows: ModuleRow[] = [
  {
    id: 'MOD-01',
    icon: '👥',
    name: 'Participant & Support',
    priority: 1,
    about: 'Core participant and support workflows.',
    menus: [
      { id: 'MN-01', name: 'Clients', priority: 1, type: 'Feature', urlPath: '/participant-support/clients' },
      { id: 'MN-02', name: 'Funding', priority: 2, type: 'Report', urlPath: '/participant-support/funding' }
    ]
  },
  {
    id: 'MOD-02',
    icon: '🏢',
    name: 'People & Workforce',
    priority: 2,
    about: 'Workforce planning and staff lifecycle records.',
    menus: [
      { id: 'MN-03', name: 'Staff', priority: 1, type: 'Feature', urlPath: '/people-workforce/staff' },
      { id: 'MN-04', name: 'Rosters', priority: 2, type: 'Feature', urlPath: '/people-workforce/rosters' }
    ]
  },
  {
    id: 'MOD-03',
    icon: '💳',
    name: 'Finance & Billing',
    priority: 3,
    about: 'Billing, claims, and payment operations.',
    menus: [
      { id: 'MN-05', name: 'Invoices', priority: 1, type: 'Feature', urlPath: '/finance/invoices' },
      { id: 'MN-06', name: 'Payments', priority: 2, type: 'Report', urlPath: '/finance/payments' },
      { id: 'MN-07', name: 'Claims', priority: 3, type: 'Report', urlPath: '/finance/claims' }
    ]
  },
  {
    id: 'MOD-04',
    icon: '⚙️',
    name: 'Settings & Config',
    priority: 4,
    about: 'Platform setup and configurable settings.',
    menus: [
      { id: 'MN-08', name: 'Preferences', priority: 1, type: 'Feature', urlPath: '/settings/preferences' },
      { id: 'MN-09', name: 'Permissions', priority: 2, type: 'Feature', urlPath: '/settings/permissions' }
    ]
  },
  {
    id: 'MOD-05',
    icon: '📊',
    name: 'Reports & Analytics',
    priority: 5,
    about: 'Business intelligence and reporting outputs.',
    menus: [
      { id: 'MN-10', name: 'Dashboards', priority: 1, type: 'Feature', urlPath: '/reports/dashboard' },
      { id: 'MN-11', name: 'Exports', priority: 2, type: 'Report', urlPath: '/reports/exports' }
    ]
  },
  {
    id: 'MOD-06',
    icon: '💬',
    name: 'Communication',
    priority: 6,
    about: 'Messages, templates, and communication campaigns.',
    menus: [
      { id: 'MN-12', name: 'Messages', priority: 1, type: 'Feature', urlPath: '/communication/messages' },
      { id: 'MN-13', name: 'Templates', priority: 2, type: 'Feature', urlPath: '/communication/templates' },
      { id: 'MN-14', name: 'Broadcast', priority: 3, type: 'Report', urlPath: '/communication/broadcast' }
    ]
  }
];

export default function ModulesListPage() {
  const [rows, setRows] = useState(defaultRows);
  const [search, setSearch] = useState('');
  const [expandedModuleId, setExpandedModuleId] = useState(defaultRows[0].id);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [activeMenuModule, setActiveMenuModule] = useState<ModuleRow | null>(null);
  const [activeActionRowId, setActiveActionRowId] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [pendingRecordsPerPage, setPendingRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return rows;
    }

    return rows.filter((row) => [row.name, row.about, ...row.menus.map((menu) => menu.name)].join(' ').toLowerCase().includes(q));
  }, [rows, search]);

  const pageCount = Math.max(1, Math.ceil(visibleRows.length / recordsPerPage));
  const safePage = Math.min(page, pageCount);
  const pageStart = visibleRows.length === 0 ? 0 : (safePage - 1) * recordsPerPage;
  const pageRows = visibleRows.slice(pageStart, pageStart + recordsPerPage);
  const visibleStart = visibleRows.length === 0 ? 0 : pageStart + 1;
  const visibleEnd = Math.min(pageStart + recordsPerPage, visibleRows.length);

  const onAddModule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextId = `MOD-${Math.floor(Math.random() * 900 + 100)}`;
    setRows((prev) => [
      {
        id: nextId,
        name: String(formData.get('name')),
        about: String(formData.get('about')),
        icon: String(formData.get('icon')),
        priority: Number(formData.get('priority')),
        menus: []
      },
      ...prev
    ]);
    setExpandedModuleId(nextId);
    setShowModuleModal(false);
  };

  const onAddMenu = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeMenuModule) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const menuName = String(formData.get('menuName'));
    const priority = Number(formData.get('priority'));
    const type = String(formData.get('type')) as MenuType;
    const urlPath = String(formData.get('urlPath'));
    setRows((prev) =>
      prev.map((row) =>
        row.id === activeMenuModule.id
          ? {
              ...row,
              menus: [...row.menus, { id: `MN-${Math.floor(Math.random() * 900 + 100)}`, name: menuName, priority, type, urlPath }]
            }
          : row
      )
    );
    setExpandedModuleId(activeMenuModule.id);
    setShowMenuModal(false);
    setActiveMenuModule(null);
    setActiveActionRowId('');
  };

  const openAddMenu = (row: ModuleRow) => {
    setActiveMenuModule(row);
    setShowMenuModal(true);
  };

  return (
    <section className="menu-panel active clients-page modules-list-page">
      <div className="clients-page__header-row">
        <div className="clients-breadcrumb" aria-label="Breadcrumb">
          <span>Dashboard</span>
          <span className="clients-breadcrumb__divider">›</span>
          <span>Organization</span>
          <span className="clients-breadcrumb__divider">›</span>
          <strong>Modules List</strong>
        </div>

        <button className="btn clients-page__add-btn" type="button" onClick={() => setShowModuleModal(true)}>
          <span aria-hidden="true">＋</span> Add Module
        </button>
      </div>

      <div className="clients-page__card modules-card">
        <div className="clients-page__topbar modules-topbar">
          <div>
            <h1>Modules List</h1>
            <p>Manage modules and nested menus using the shared organization table style.</p>
          </div>
          <div className="modules-topbar__actions">
            <label className="clients-search modules-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 14h-.8l-.3-.3a6 6 0 10-.9.9l.3.3v.8l5 5 1.5-1.5-5-5zM10 15a5 5 0 110-10 5 5 0 010 10z" />
              </svg>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search module or menu" />
            </label>
            <button className="clients-filter modules-icon-btn" type="button" aria-label="Filter modules">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
              </svg>
            </button>
            <button className="clients-filter modules-icon-btn" type="button" aria-label="Export modules in excel">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zm0 2.5L18.5 9H14zM8 13h2.2l1.1 1.7L12.4 13h2.2l-2.2 3 2.2 3h-2.2l-1.1-1.7-1.1 1.7H8l2.2-3z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="table-wrap clients-table-wrap modules-table-wrap">
          <div className="clients-pagination-bar" aria-label="Modules table info">
            <p>
              Showing {visibleStart}-{visibleEnd} of {visibleRows.length} records
            </p>
            <div className="clients-pagination-controls">
              <label className="clients-records-per-page">
                Records per page
                <select value={pendingRecordsPerPage} onChange={(event) => setPendingRecordsPerPage(Number(event.target.value))}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>
              <button
                className="clients-pagination-apply"
                type="button"
                onClick={() => {
                  setRecordsPerPage(pendingRecordsPerPage);
                  setPage(1);
                }}
              >
                Apply
              </button>
              <button className="clients-page-btn" type="button" disabled={safePage === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                Prev
              </button>
              <button className="clients-page-btn clients-page-btn--number is-active" type="button">
                {safePage}
              </button>
              <button className="clients-page-btn" type="button" disabled={safePage === pageCount} onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}>
                Next
              </button>
            </div>
          </div>

          <table className="data-table clients-table modules-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Module Name</th>
                <th>Priority</th>
                <th>No. of Menus</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, moduleIndex) => {
                const isExpanded = expandedModuleId === row.id;
                const isActionsOpen = activeActionRowId === row.id;

                return (
                  <Fragment key={row.id}>
                    <tr>
                      <td>{pageStart + moduleIndex + 1}</td>
                      <td>
                        <div className="module-name-cell">
                          <span className="module-icon" aria-hidden="true">
                            {row.icon}
                          </span>
                          <strong>{row.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="priority-chip">{row.priority}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`menu-count-chip ${isExpanded ? 'is-open' : ''}`}
                          onClick={() => setExpandedModuleId((prev) => (prev === row.id ? '' : row.id))}
                        >
                          {row.menus.length} Menus {isExpanded ? '▲' : '▼'}
                        </button>
                      </td>
                      <td>
                        <button
                          className="row-menu-btn"
                          type="button"
                          aria-label={`Actions for ${row.name}`}
                          onClick={() => setActiveActionRowId((prev) => (prev === row.id ? '' : row.id))}
                        >
                          ⋮
                        </button>
                        {isActionsOpen && (
                          <div className="module-row-actions" role="menu" aria-label={`${row.name} actions`}>
                            <button
                              type="button"
                              onClick={() => {
                                openAddMenu(row);
                                setActiveActionRowId('');
                              }}
                            >
                              Add Menu
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${row.id}-expanded`}>
                        <td className="module-nested-cell" colSpan={5}>
                          <div className="module-nested-wrap">
                            <table className="data-table module-nested-table">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Menu Name</th>
                                  <th>Priority</th>
                                  <th>Type</th>
                                  <th>URL Path</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.menus.map((menu, menuIndex) => (
                                  <tr key={menu.id}>
                                    <td>{menuIndex + 1}</td>
                                    <td>
                                      <span className="menu-dot" /> {menu.name}
                                    </td>
                                    <td>
                                      <span className="priority-chip">{menu.priority}</span>
                                    </td>
                                    <td>
                                      <span className={`menu-type-chip ${menu.type === 'Feature' ? 'is-primary' : 'is-secondary'}`}>{menu.type}</span>
                                    </td>
                                    <td>{menu.urlPath}</td>
                                    <td>
                                      <button className="row-menu-btn" type="button" aria-label={`Actions for ${menu.name}`}>
                                        ⋮
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`modal ${showModuleModal ? 'is-open' : ''}`}>
        <button className="modal__backdrop" type="button" onClick={() => setShowModuleModal(false)} />
        <div className="modal__dialog">
          <button className="modal__close" onClick={() => setShowModuleModal(false)} type="button">
            ×
          </button>
          <h3>Add Module</h3>
          <form className="modal__body" onSubmit={onAddModule}>
            <input name="name" placeholder="Module Name" required />
            <input name="icon" placeholder="Module Icon" required />
            <input name="priority" type="number" min={1} placeholder="Priority" required />
            <textarea name="about" placeholder="About" rows={3} required />
            <div className="modal__actions">
              <button className="clients-page__add-btn" type="submit">
                Save Module
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`modal ${showMenuModal ? 'is-open' : ''}`}>
        <button className="modal__backdrop" type="button" onClick={() => {
          setShowMenuModal(false);
          setActiveMenuModule(null);
        }} />
        <div className="modal__dialog">
          <button className="modal__close" onClick={() => {
            setShowMenuModal(false);
            setActiveMenuModule(null);
          }} type="button">
            ×
          </button>
          <h3>Add Menu - {activeMenuModule?.name ?? 'Module'}</h3>
          <form className="modal__body" onSubmit={onAddMenu}>
            <input name="menuName" placeholder="Menu Name" required />
            <input name="priority" type="number" min={1} placeholder="Priority" required />
            <select name="type" required defaultValue="Feature">
              <option value="Feature">Feature</option>
              <option value="Report">Report</option>
            </select>
            <input name="urlPath" placeholder="Url Path" required />
            <div className="modal__actions">
              <button className="clients-page__add-btn" type="submit">
                Save Menu
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
