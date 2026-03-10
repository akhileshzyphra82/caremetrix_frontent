import { Fragment, useMemo, useState, type FormEvent } from 'react';

type LocationItem = { id: string; name: string; staffCount: number; clientCount: number };
type Organization = { id: string; name: string; manager: string; phone: string; email: string; locations: LocationItem[] };

const initialOrganizations: Organization[] = [
  {
    id: 'ORG-1001',
    name: 'CareMatrix Sydney',
    manager: 'Mia Collins',
    phone: '02 9000 1201',
    email: 'sydney@carematrix.com',
    locations: [
      { id: 'LOC-01', name: 'Parramatta', staffCount: 32, clientCount: 88 },
      { id: 'LOC-02', name: 'Liverpool', staffCount: 25, clientCount: 70 }
    ]
  },
  {
    id: 'ORG-1002',
    name: 'CareMatrix Melbourne',
    manager: 'Liam Turner',
    phone: '03 9000 3402',
    email: 'melbourne@carematrix.com',
    locations: [
      { id: 'LOC-03', name: 'Footscray', staffCount: 24, clientCount: 62 },
      { id: 'LOC-04', name: 'Dandenong', staffCount: 19, clientCount: 55 }
    ]
  }
];

export default function OrgnizationStructurePage() {
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showLocationModalFor, setShowLocationModalFor] = useState<string | null>(null);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);

  const filteredOrganizations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return organizations;
    return organizations.filter((org) => [org.id, org.name, org.manager, org.phone, org.email].join(' ').toLowerCase().includes(q));
  }, [organizations, search]);

  const totals = useMemo(() => {
    const locationCount = organizations.reduce((acc, org) => acc + org.locations.length, 0);
    const staffCount = organizations.reduce((acc, org) => acc + org.locations.reduce((a, l) => a + l.staffCount, 0), 0);
    const clientCount = organizations.reduce((acc, org) => acc + org.locations.reduce((a, l) => a + l.clientCount, 0), 0);
    return { organizationCount: organizations.length, locationCount, staffCount, clientCount };
  }, [organizations]);

  const orgToEdit = editingOrgId ? organizations.find((org) => org.id === editingOrgId) : null;

  const onOrgSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newOrg: Organization = {
      id: String(formData.get('id') || '').trim(),
      name: String(formData.get('name') || '').trim(),
      manager: String(formData.get('manager') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      locations: orgToEdit?.locations ?? []
    };
    if (!newOrg.id || !newOrg.name) return;
    setOrganizations((prev) => (orgToEdit ? prev.map((org) => (org.id === orgToEdit.id ? { ...org, ...newOrg } : org)) : [newOrg, ...prev]));
    setShowOrgModal(false);
    setEditingOrgId(null);
  };

  const onLocationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!showLocationModalFor) return;
    const formData = new FormData(event.currentTarget);
    const newLocation: LocationItem = {
      id: `LOC-${Math.floor(Math.random() * 900 + 100)}`,
      name: String(formData.get('name') || '').trim(),
      staffCount: Number(formData.get('staffCount') || 0),
      clientCount: Number(formData.get('clientCount') || 0)
    };
    if (!newLocation.name) return;
    setOrganizations((prev) => prev.map((org) => (org.id === showLocationModalFor ? { ...org, locations: [...org.locations, newLocation] } : org)));
    setExpandedRows((prev) => ({ ...prev, [showLocationModalFor]: true }));
    setShowLocationModalFor(null);
  };

  return (
    <section className="menu-panel active clients-page">
      <div className="clients-page__card">
        <div className="clients-page__topbar">
          <div>
            <h1>Orgnization Structure</h1>
            <p>Manage organizations, branches, and operational counts.</p>
          </div>
          <button className="clients-page__add-btn" type="button" onClick={() => setShowOrgModal(true)}>+ Add Orgnization</button>
        </div>

        <div className="org-stat-grid">
          <div className="stat-card stat-card--mint"><p>Orgnization Count</p><h3>{totals.organizationCount}</h3></div>
          <div className="stat-card stat-card--sky"><p>Location Count</p><h3>{totals.locationCount}</h3></div>
          <div className="stat-card stat-card--lavender"><p>Staff Count</p><h3>{totals.staffCount}</h3></div>
          <div className="stat-card"><p>Client Count</p><h3>{totals.clientCount}</h3></div>
        </div>

        <div className="clients-toolbar">
          <label className="clients-search" aria-label="Search organization">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.8l-.3-.3a6 6 0 10-.9.9l.3.3v.8l5 5 1.5-1.5-5-5zM10 15a5 5 0 110-10 5 5 0 010 10z" /></svg>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Orgnization" />
          </label>
        </div>

        <div className="clients-table-wrap">
          <table className="data-table clients-table">
            <thead><tr><th>Toggle</th><th>Orgnization</th><th>Manager</th><th>Location Count</th><th>Staff Count</th><th>Client Count</th><th>Action</th></tr></thead>
            <tbody>
              {filteredOrganizations.map((org) => {
                const staffCount = org.locations.reduce((acc, location) => acc + location.staffCount, 0);
                const clientCount = org.locations.reduce((acc, location) => acc + location.clientCount, 0);
                const isExpanded = Boolean(expandedRows[org.id]);
                return (
                  <Fragment key={org.id}>
                    <tr key={org.id}>
                      <td><button className="icon-btn" type="button" onClick={() => setExpandedRows((prev) => ({ ...prev, [org.id]: !isExpanded }))}>{isExpanded ? '▾' : '▸'}</button></td>
                      <td><strong>{org.name}</strong><br /><small>{org.id}</small></td>
                      <td>{org.manager}</td><td>{org.locations.length}</td><td>{staffCount}</td><td>{clientCount}</td>
                      <td>
                        <div className="org-action-row">
                          <button className="clients-filter" type="button" onClick={() => { setEditingOrgId(org.id); setShowOrgModal(true); }}>Edit</button>
                          <button className="clients-filter" type="button" onClick={() => setShowLocationModalFor(org.id)}>New Location</button>
                          <button className="clients-filter" type="button" onClick={() => setOrganizations((prev) => prev.filter((item) => item.id !== org.id))}>Delete</button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr key={`${org.id}-locations`}>
                        <td colSpan={7}>
                          <div className="org-location-box">
                            <h4>Location Details</h4>
                            {org.locations.map((location) => (
                              <div key={location.id} className="org-location-item">
                                <strong>{location.name}</strong>
                                <span>Staff Count: {location.staffCount}</span>
                                <span>Client Count: {location.clientCount}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`modal ${showOrgModal ? 'is-open' : ''}`}>
        <button className="modal__backdrop" type="button" onClick={() => { setShowOrgModal(false); setEditingOrgId(null); }} />
        <div className="modal__dialog">
          <button className="modal__close" type="button" onClick={() => { setShowOrgModal(false); setEditingOrgId(null); }}>×</button>
          <h3>{orgToEdit ? 'Edit Orgnization' : 'Add Orgnization'}</h3>
          <form className="modal__body" onSubmit={onOrgSubmit}>
            <input name="id" placeholder="Orgnization ID" defaultValue={orgToEdit?.id} required disabled={Boolean(orgToEdit)} />
            <input name="name" placeholder="Orgnization Name" defaultValue={orgToEdit?.name} required />
            <input name="manager" placeholder="Manager Name" defaultValue={orgToEdit?.manager} required />
            <input name="phone" placeholder="Phone" defaultValue={orgToEdit?.phone} required />
            <input name="email" type="email" placeholder="Email" defaultValue={orgToEdit?.email} required />
            <div className="modal__actions"><button className="clients-page__add-btn" type="submit">Save</button></div>
          </form>
        </div>
      </div>

      <div className={`modal ${showLocationModalFor ? 'is-open' : ''}`}>
        <button className="modal__backdrop" type="button" onClick={() => setShowLocationModalFor(null)} />
        <div className="modal__dialog">
          <button className="modal__close" type="button" onClick={() => setShowLocationModalFor(null)}>×</button>
          <h3>Add New Location</h3>
          <form className="modal__body" onSubmit={onLocationSubmit}>
            <input name="name" placeholder="Location Name" required />
            <input name="staffCount" type="number" min={0} placeholder="Staff Count" required />
            <input name="clientCount" type="number" min={0} placeholder="Client Count" required />
            <div className="modal__actions"><button className="clients-page__add-btn" type="submit">Add Location</button></div>
          </form>
        </div>
      </div>
    </section>
  );
}
