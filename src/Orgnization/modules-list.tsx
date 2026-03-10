import { useMemo, useState, type FormEvent } from 'react';

type Menu = { id: string; name: string; priority: number };
type ModuleRow = { id: string; name: string; priority: number; menus: Menu[] };

const defaultRows: ModuleRow[] = [
  { id: 'MOD-01', name: 'Participant & Support', priority: 1, menus: [{ id: 'MN-01', name: 'Clients', priority: 1 }, { id: 'MN-02', name: 'Funding', priority: 2 }] },
  { id: 'MOD-02', name: 'People & Workforce', priority: 2, menus: [{ id: 'MN-03', name: 'Staff', priority: 1 }, { id: 'MN-04', name: 'Rosters', priority: 2 }] }
];

export default function ModulesListPage() {
  const [rows, setRows] = useState(defaultRows);
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((row) => selectedModule === 'All' || row.id === selectedModule)
      .filter((row) => !q || [row.name, ...row.menus.map((menu) => menu.name)].join(' ').toLowerCase().includes(q));
  }, [rows, selectedModule, search]);

  const onAddModule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setRows((prev) => [{ id: `MOD-${Math.floor(Math.random() * 900 + 100)}`, name: String(formData.get('name')), priority: Number(formData.get('priority')), menus: [] }, ...prev]);
    setShowModuleModal(false);
  };

  const onAddMenu = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const moduleId = String(formData.get('moduleId'));
    const menuName = String(formData.get('menuName'));
    const priority = Number(formData.get('priority'));
    setRows((prev) => prev.map((row) => (row.id === moduleId ? { ...row, menus: [...row.menus, { id: `MN-${Math.floor(Math.random() * 900 + 100)}`, name: menuName, priority }] } : row)));
    setShowMenuModal(false);
  };

  return (
    <section className="menu-panel active clients-page">
      <div className="clients-page__card">
        <div className="clients-page__topbar">
          <div><h1>Modules List</h1><p>Super admin can add, edit, delete and view modules with nested menus and priority.</p></div>
          <div className="org-action-row">
            <button className="clients-page__add-btn" type="button" onClick={() => setShowModuleModal(true)}>+ Add Module</button>
            <button className="clients-page__add-btn" type="button" onClick={() => setShowMenuModal(true)}>+ Add Menu</button>
          </div>
        </div>

        <div className="clients-toolbar">
          <label className="clients-search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.8l-.3-.3a6 6 0 10-.9.9l.3.3v.8l5 5 1.5-1.5-5-5zM10 15a5 5 0 110-10 5 5 0 010 10z" /></svg>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search module or menu" />
          </label>
          <select className="org-select" value={selectedModule} onChange={(event) => setSelectedModule(event.target.value)}>
            <option value="All">All Modules</option>
            {rows.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}
          </select>
        </div>

        <div className="clients-table-wrap">
          <table className="data-table clients-table">
            <thead><tr><th>Module</th><th>Module Priority</th><th>Menus</th><th>Menu Priority</th><th>Actions</th></tr></thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.priority}</td>
                  <td>{row.menus.map((menu) => <span key={menu.id} className="badge badge--teal">{menu.name}</span>)}</td>
                  <td>{row.menus.map((menu) => <span key={`${menu.id}-priority`} className="badge badge--gray">{menu.priority}</span>)}</td>
                  <td>
                    <div className="org-action-row">
                      <button className="clients-filter" type="button">View</button>
                      <button className="clients-filter" type="button">Edit</button>
                      <button className="clients-filter" type="button" onClick={() => setRows((prev) => prev.filter((item) => item.id !== row.id))}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
