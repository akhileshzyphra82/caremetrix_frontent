import { Fragment, useMemo, useState, type FormEvent } from 'react';

type MenuType = 'Primary' | 'Secondary';

type Menu = { id: string; name: string; priority: number; type: MenuType };
type ModuleRow = { id: string; icon: string; name: string; priority: number; menus: Menu[] };

const defaultRows: ModuleRow[] = [
  {
    id: 'MOD-01',
    icon: '👥',
    name: 'Participant & Support',
    priority: 1,
    menus: [
      { id: 'MN-01', name: 'Clients', priority: 1, type: 'Primary' },
      { id: 'MN-02', name: 'Funding', priority: 2, type: 'Secondary' }
    ]
  },
  {
    id: 'MOD-02',
    icon: '🏢',
    name: 'People & Workforce',
    priority: 2,
    menus: [
      { id: 'MN-03', name: 'Staff', priority: 1, type: 'Primary' },
      { id: 'MN-04', name: 'Rosters', priority: 2, type: 'Secondary' }
    ]
  },
  {
    id: 'MOD-03',
    icon: '💳',
    name: 'Finance & Billing',
    priority: 3,
    menus: [
      { id: 'MN-05', name: 'Invoices', priority: 1, type: 'Primary' },
      { id: 'MN-06', name: 'Payments', priority: 2, type: 'Secondary' },
      { id: 'MN-07', name: 'Claims', priority: 3, type: 'Secondary' }
    ]
  },
  {
    id: 'MOD-04',
    icon: '⚙️',
    name: 'Settings & Config',
    priority: 4,
    menus: [
      { id: 'MN-08', name: 'Preferences', priority: 1, type: 'Primary' },
      { id: 'MN-09', name: 'Permissions', priority: 2, type: 'Secondary' }
    ]
  },
  {
    id: 'MOD-05',
    icon: '📊',
    name: 'Reports & Analytics',
    priority: 5,
    menus: [
      { id: 'MN-10', name: 'Dashboards', priority: 1, type: 'Primary' },
      { id: 'MN-11', name: 'Exports', priority: 2, type: 'Secondary' }
    ]
  },
  {
    id: 'MOD-06',
    icon: '💬',
    name: 'Communication',
    priority: 6,
    menus: [
      { id: 'MN-12', name: 'Messages', priority: 1, type: 'Primary' },
      { id: 'MN-13', name: 'Templates', priority: 2, type: 'Secondary' },
      { id: 'MN-14', name: 'Broadcast', priority: 3, type: 'Secondary' }
    ]
  }
];

export default function ModulesListPage() {
  const [rows, setRows] = useState(defaultRows);
  const [search, setSearch] = useState('');
  const [expandedModuleId, setExpandedModuleId] = useState(defaultRows[0].id);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return rows;
    }

    return rows.filter((row) => [row.name, ...row.menus.map((menu) => menu.name)].join(' ').toLowerCase().includes(q));
  }, [rows, search]);

  const onAddModule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextId = `MOD-${Math.floor(Math.random() * 900 + 100)}`;
    setRows((prev) => [
      {
        id: nextId,
        icon: '🧩',
        name: String(formData.get('name')),
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
    const formData = new FormData(event.currentTarget);
    const moduleId = String(formData.get('moduleId'));
    const menuName = String(formData.get('menuName'));
    const priority = Number(formData.get('priority'));
    setRows((prev) =>
      prev.map((row) =>
        row.id === moduleId
          ? {
              ...row,
              menus: [...row.menus, { id: `MN-${Math.floor(Math.random() * 900 + 100)}`, name: menuName, priority, type: 'Secondary' }]
            }
          : row
      )
    );
    setExpandedModuleId(moduleId);
    setShowMenuModal(false);
  };

  return (
    <section className="menu-panel active clients-page modules-list-page">
      <div className="clients-page__card modules-card">
        <div className="clients-page__topbar modules-topbar">
          <div>
            <h1>Modules List</h1>
            <p>Super admin can add, edit, delete and view modules with nested menus and priority.</p>
          </div>
          <div className="modules-topbar__actions">
            <label className="clients-search modules-search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.8l-.3-.3a6 6 0 10-.9.9l.3.3v.8l5 5 1.5-1.5-5-5zM10 15a5 5 0 110-10 5 5 0 010 10z" /></svg>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search module or menu" />
            </label>
            <button className="clients-page__add-btn modules-add-btn" type="button" onClick={() => setShowModuleModal(true)}>+ Add Module</button>
          </div>
        </div>

        <div className="modules-table-wrap">
          <div className="modules-table-head">
            <p>Showing 1–{visibleRows.length} of {visibleRows.length} records</p>
            <div className="modules-table-head__controls">
              <span>Records per page</span>
              <select className="org-select" defaultValue="10" aria-label="Records per page"><option value="10">10</option></select>
              <button type="button" className="modules-page-btn" disabled>Prev</button>
              <span className="modules-page-current">1</span>
              <button type="button" className="modules-page-btn" disabled>Next</button>
            </div>
          </div>

          <table className="modules-table">
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
              {visibleRows.map((row, moduleIndex) => {
                const isExpanded = expandedModuleId === row.id;

                return (
                  <Fragment key={row.id}>
                    <tr>
                      <td>{moduleIndex + 1}</td>
                      <td>
                        <div className="module-name-cell">
                          <span className="module-icon" aria-hidden="true">{row.icon}</span>
                          <strong>{row.name}</strong>
                        </div>
                      </td>
                      <td><span className="priority-chip">{row.priority}</span></td>
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
                        <button className="row-menu-btn" type="button" aria-label={`Actions for ${row.name}`}>⋮</button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${row.id}-expanded`}>
                        <td className="module-nested-cell" colSpan={5}>
                          <div className="module-nested-wrap">
                            <table className="module-nested-table">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Menu Name</th>
                                  <th>Priority</th>
                                  <th>Type</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.menus.map((menu, menuIndex) => (
                                  <tr key={menu.id}>
                                    <td>{menuIndex + 1}</td>
                                    <td><span className="menu-dot" /> {menu.name}</td>
                                    <td><span className="priority-chip">{menu.priority}</span></td>
                                    <td><span className={`menu-type-chip ${menu.type === 'Primary' ? 'is-primary' : 'is-secondary'}`}>{menu.type}</span></td>
                                    <td><button className="row-menu-btn" type="button" aria-label={`Actions for ${menu.name}`}>⋮</button></td>
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

        <div className="modules-bottom-actions">
          <button className="clients-page__add-btn" type="button" onClick={() => setShowMenuModal(true)}>+ Add Menu</button>
        </div>
      </div>

      <div className={`modal ${showModuleModal ? 'is-open' : ''}`}>
        <button className="modal__backdrop" type="button" onClick={() => setShowModuleModal(false)} />
        <div className="modal__dialog"><button className="modal__close" onClick={() => setShowModuleModal(false)} type="button">×</button>
          <h3>Add Module</h3>
          <form className="modal__body" onSubmit={onAddModule}>
            <input name="name" placeholder="Module Name" required />
            <input name="priority" type="number" min={1} placeholder="Priority" required />
            <div className="modal__actions"><button className="clients-page__add-btn" type="submit">Save Module</button></div>
          </form>
        </div>
      </div>

      <div className={`modal ${showMenuModal ? 'is-open' : ''}`}>
        <button className="modal__backdrop" type="button" onClick={() => setShowMenuModal(false)} />
        <div className="modal__dialog"><button className="modal__close" onClick={() => setShowMenuModal(false)} type="button">×</button>
          <h3>Add Menu Under Module</h3>
          <form className="modal__body" onSubmit={onAddMenu}>
            <select name="moduleId" required>{rows.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select>
            <input name="menuName" placeholder="Menu Name" required />
            <input name="priority" type="number" min={1} placeholder="Priority" required />
            <div className="modal__actions"><button className="clients-page__add-btn" type="submit">Save Menu</button></div>
          </form>
        </div>
      </div>
    </section>
  );
}
