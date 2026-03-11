import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

type LocationItem = {
  id: string;
  name: string;
  manager: string;
  staffCount: number;
  clientCount: number;
};

type Organization = {
  id: string;
  name: string;
  logo: string;
  owner: string;
  location: string;
  status: 'Active' | 'Inactive';
  locations: LocationItem[];
};

const organizationsSeed: Organization[] = [
  {
    id: 'ORG-001',
    name: 'Caremetrix Sydney',
    logo: 'https://placehold.co/96x96/e9ecff/4f46b6?text=CM',
    owner: 'Mia Collins',
    location: 'Sydney',
    status: 'Active',
    locations: [
      { id: 'LOC-11', name: 'Parramatta', manager: 'Ava Ray', staffCount: 32, clientCount: 88 },
      { id: 'LOC-12', name: 'Liverpool', manager: 'Liam Knox', staffCount: 24, clientCount: 74 }
    ]
  },
  {
    id: 'ORG-002',
    name: 'Caremetrix Melbourne',
    logo: 'https://placehold.co/96x96/e7f6ff/1769aa?text=CM',
    owner: 'Oliver Hayes',
    location: 'Melbourne',
    status: 'Active',
    locations: [
      { id: 'LOC-21', name: 'Dandenong', manager: 'Noah Green', staffCount: 18, clientCount: 57 },
      { id: 'LOC-22', name: 'Footscray', manager: 'Ella Hart', staffCount: 28, clientCount: 79 }
    ]
  },
  {
    id: 'ORG-003',
    name: 'Caremetrix Brisbane',
    logo: 'https://placehold.co/96x96/eaf9f1/127a50?text=CM',
    owner: 'Charlotte Ford',
    location: 'Brisbane',
    status: 'Inactive',
    locations: [{ id: 'LOC-31', name: 'South Brisbane', manager: 'Lucas Dale', staffCount: 14, clientCount: 42 }]
  }
];

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export default function OrgnizationStructurePage() {
  const [organizations] = useState(organizationsSeed);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [locationFilter, setLocationFilter] = useState<'All' | string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [recordsPerPageDraft, setRecordsPerPageDraft] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const filterRef = useRef<HTMLDivElement | null>(null);
  const addOrganizationFormRef = useRef<HTMLFormElement | null>(null);

  const requiredFields = [
    'organizationLogo',
    'organizationSmallLogo',
    'organizationName',
    'organizationCode',
    'about',
    'ownerName',
    'organizationEmail',
    'organizationContactNumber',
    'country',
    'state',
    'district',
    'address',
    'postalCode'
  ];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const locationOptions = useMemo(() => ['All', ...Array.from(new Set(organizations.map((organization) => organization.location)))], [organizations]);

  const filteredOrganizations = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return organizations.filter((organization) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [organization.id, organization.name, organization.owner, organization.location].join(' ').toLowerCase().includes(normalizedSearch);

      const matchesStatus = statusFilter === 'All' || organization.status === statusFilter;
      const matchesLocation = locationFilter === 'All' || organization.location === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [locationFilter, organizations, searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [locationFilter, searchTerm, statusFilter]);

  const totals = useMemo(() => {
    const locationCount = organizations.reduce((sum, organization) => sum + organization.locations.length, 0);
    const staffCount = organizations.reduce(
      (sum, organization) => sum + organization.locations.reduce((locationSum, location) => locationSum + location.staffCount, 0),
      0
    );
    const clientCount = organizations.reduce(
      (sum, organization) => sum + organization.locations.reduce((locationSum, location) => locationSum + location.clientCount, 0),
      0
    );

    return { organizationCount: organizations.length, locationCount, staffCount, clientCount };
  }, [organizations]);

  const totalPages = Math.max(1, Math.ceil(filteredOrganizations.length / recordsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedOrganizations = filteredOrganizations.slice((safeCurrentPage - 1) * recordsPerPage, safeCurrentPage * recordsPerPage);
  const startRecord = filteredOrganizations.length === 0 ? 0 : (safeCurrentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(safeCurrentPage * recordsPerPage, filteredOrganizations.length);

  return (
    <section className="menu-panel active clients-page">
      <div className="clients-page__header-row">
        <div className="clients-breadcrumb" aria-label="Breadcrumb">
          <span>Dashboard</span>
          <span className="clients-breadcrumb__divider">›</span>
          <span>Organization</span>
          <span className="clients-breadcrumb__divider">›</span>
          <strong>Organization Structure</strong>
        </div>

        <button className="btn clients-page__add-btn" type="button" onClick={() => setIsAddModalOpen(true)}>
          <span aria-hidden="true">＋</span> Add Organization
        </button>
      </div>

      <div className="clients-page__card org-structure-page">
        <div className="clients-page__topbar">
          <div>
            <h1>Organization List</h1>
            <p>Manage organizations, locations, staff, and clients from one place.</p>
          </div>

          <div className="clients-toolbar org-toolbar">
            <label className="clients-search" aria-label="Search organization">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 14h-.8l-.3-.3a6 6 0 10-.9.9l.3.3v.8l5 5 1.5-1.5-5-5zM10 15a5 5 0 110-10 5 5 0 010 10z" />
              </svg>
              <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search Organization" />
            </label>

            <div className="org-filter-wrap" ref={filterRef}>
              <button className="clients-filter org-filter-icon-btn" type="button" onClick={() => setIsFilterOpen((prev) => !prev)} aria-label="Open filters">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm3 6h4v2h-4v-2z" />
                </svg>
              </button>

              {isFilterOpen ? (
                <div className="clients-filter-panel org-filter-panel" role="dialog" aria-label="Filter organization list">
                  <div className="clients-filter-group">
                    <p>Status</p>
                    {(['All', 'Active', 'Inactive'] as Array<'All' | 'Active' | 'Inactive'>).map((status) => (
                      <label key={status}>
                        <input type="radio" name="org-status" checked={statusFilter === status} onChange={() => setStatusFilter(status)} />
                        <span>{status}</span>
                      </label>
                    ))}
                  </div>

                  <div className="clients-filter-group">
                    <p>Location</p>
                    <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
                      {locationOptions.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              className="clients-view-toggle is-active"
              type="button"
              onClick={() => setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'))}
              aria-label={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
            >
              {viewMode === 'list' ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                </svg>
              )}
            </button>

            <button className="clients-export" type="button" aria-label="Export data">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 20h14v-2H5v2zM12 2l-5 5h3v6h4V7h3l-5-5z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="org-stat-grid" aria-label="Organization summary metrics">
          <div className="org-stat-card stat-card--mint">
            <span className="org-stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4v-7H9v7H5a1 1 0 01-1-1v-9.5z" /></svg>
            </span>
            <div className="org-stat-metric"><h3>{totals.organizationCount}</h3><p>Organizations</p></div>
          </div>
          <div className="org-stat-card stat-card--sky">
            <span className="org-stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 00-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" /></svg>
            </span>
            <div className="org-stat-metric"><h3>{totals.locationCount}</h3><p>Locations</p></div>
          </div>
          <div className="org-stat-card stat-card--lavender">
            <span className="org-stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M16 11a4 4 0 10-4-4 4 4 0 004 4zm-8 0a3 3 0 10-3-3 3 3 0 003 3zm0 2c-2.67 0-8 1.34-8 4v3h10v-3c0-.89.36-1.72 1-2.39A13.7 13.7 0 008 13zm8 0c-.29 0-.62.02-.97.05A5.45 5.45 0 0118 17v3h6v-3c0-2.66-5.33-4-8-4z" /></svg>
            </span>
            <div className="org-stat-metric"><h3>{totals.staffCount}</h3><p>Staff Members</p></div>
          </div>
          <div className="org-stat-card">
            <span className="org-stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z" /></svg>
            </span>
            <div className="org-stat-metric"><h3>{totals.clientCount}</h3><p>Total Clients</p></div>
          </div>
        </div>

        <div className="clients-pagination-bar">
          <p>
            Showing {startRecord}-{endRecord} of {filteredOrganizations.length} records
          </p>

          <div className="clients-pagination-controls">
            <label className="clients-records-per-page" htmlFor="org-records-per-page">
              <span>Records per page</span>
              <select
                id="org-records-per-page"
                value={recordsPerPageDraft}
                onChange={(event) => setRecordsPerPageDraft(Number(event.target.value))}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="clients-pagination-apply"
              type="button"
              onClick={() => {
                setRecordsPerPage(recordsPerPageDraft);
                setCurrentPage(1);
              }}
            >
              Apply
            </button>
            <button className="clients-page-btn" type="button" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={safeCurrentPage === 1}>
              Prev
            </button>
            <button className="clients-page-btn clients-page-btn--number is-active" type="button">
              {safeCurrentPage}
            </button>
            <button className="clients-page-btn" type="button" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={safeCurrentPage === totalPages}>
              Next
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="clients-table-wrap">
            <table className="data-table clients-table">
              <thead>
                <tr>
                  <th className="org-col-compact">S.No.</th>
                  <th>Organization</th>
                  <th className="org-col-compact">Locations</th>
                  <th className="org-col-compact">Staff</th>
                  <th className="org-col-compact">Client</th>
                  <th className="org-col-compact">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrganizations.map((organization, index) => {
                  const staffCount = organization.locations.reduce((sum, location) => sum + location.staffCount, 0);
                  const clientCount = organization.locations.reduce((sum, location) => sum + location.clientCount, 0);
                  const isExpanded = Boolean(expandedRows[organization.id]);
                  return (
                    <Fragment key={organization.id}>
                      <tr>
                        <td className="org-col-compact">{(safeCurrentPage - 1) * recordsPerPage + index + 1}</td>
                        <td>
                          <div className="org-name-cell">
                            <img src={organization.logo} alt={organization.name} />
                            <div>
                              <strong>{organization.name}</strong>
                              <small>{organization.id} · Owner: {organization.owner}</small>
                            </div>
                          </div>
                        </td>
                        <td className="org-col-compact">
                          <button
                            className={`org-location-chip ${isExpanded ? 'is-open' : ''}`}
                            type="button"
                            onClick={() => setExpandedRows((prev) => ({ ...prev, [organization.id]: !isExpanded }))}
                            aria-label={`${isExpanded ? 'Hide' : 'Show'} locations for ${organization.name}`}
                          >
                            {organization.locations.length} Locations <span aria-hidden="true">{isExpanded ? '▴' : '▾'}</span>
                          </button>
                        </td>
                        <td className="org-col-compact">{staffCount}</td>
                        <td className="org-col-compact">{clientCount}</td>
                        <td className="org-col-compact">
                          <details className="org-kebab-menu">
                            <summary aria-label="Row actions"><span /><span /><span /></summary>
                            <div>
                              <button type="button">Edit</button>
                              <button type="button">Delete</button>
                              <button type="button">Add new location</button>
                            </div>
                          </details>
                        </td>
                      </tr>

                      {isExpanded ? (
                        <tr>
                          <td colSpan={6}>
                            <div className="org-location-box">
                              <table className="data-table org-subtable">
                                <thead>
                                  <tr>
                                    <th>S.No.</th>
                                    <th>Location name</th>
                                    <th>Manager</th>
                                    <th>Staff</th>
                                    <th>Client</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {organization.locations.map((location, locationIndex) => (
                                    <tr key={location.id}>
                                      <td>{locationIndex + 1}</td>
                                      <td>{location.name}</td>
                                      <td>{location.manager}</td>
                                      <td>{location.staffCount}</td>
                                      <td>{location.clientCount}</td>
                                      <td>
                                        <details className="org-kebab-menu">
                                          <summary aria-label="Location actions"><span /><span /><span /></summary>
                                          <div>
                                            <button type="button">Edit</button>
                                            <button type="button">Delete</button>
                                          </div>
                                        </details>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
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
        ) : (
          <div className="clients-grid org-grid-view">
            {pagedOrganizations.map((organization) => {
              const staffCount = organization.locations.reduce((sum, location) => sum + location.staffCount, 0);
              const clientCount = organization.locations.reduce((sum, location) => sum + location.clientCount, 0);
              return (
                <article key={organization.id} className="clients-user-card org-grid-card">
                  <div className="org-name-cell">
                    <img src={organization.logo} alt={organization.name} />
                    <div>
                      <strong>{organization.name}</strong>
                      <small>{organization.location} · Owner: {organization.owner}</small>
                    </div>
                  </div>
                  <p>Staff: <strong>{staffCount}</strong></p>
                  <p>Client: <strong>{clientCount}</strong></p>
                  <p>Locations: <strong>{organization.locations.length}</strong></p>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {isAddModalOpen ? (
        <div className="org-add-modal" role="dialog" aria-modal="true" aria-labelledby="org-add-modal-title">
          <div className="org-add-modal__backdrop" onClick={() => setIsAddModalOpen(false)} />
          <div className="org-add-modal__dialog">
            <button className="org-add-modal__close" type="button" aria-label="Close" onClick={() => setIsAddModalOpen(false)}>
              ×
            </button>
            <h2 id="org-add-modal-title">Add Organization</h2>
            <p>Create a new organization profile with complete contact and location details.</p>

            <form
              ref={addOrganizationFormRef}
              className="org-add-form"
              onSubmit={(event) => {
                event.preventDefault();
                const form = addOrganizationFormRef.current;
                if (!form) return;
                const formData = new FormData(form);
                const nextErrors: Record<string, string> = {};

                requiredFields.forEach((fieldName) => {
                  const value = String(formData.get(fieldName) ?? '').trim();
                  if (!value) {
                    nextErrors[fieldName] = 'This field is required';
                  }
                });

                setFormErrors(nextErrors);

                if (Object.keys(nextErrors).length > 0) {
                  return;
                }

                form.reset();
                setIsAddModalOpen(false);
              }}
              onReset={() => setFormErrors({})}
            >
              <div className="org-add-form__grid">
                {[
                  ['organizationLogo', 'Organization Logo', 'text'],
                  ['organizationSmallLogo', 'Organization Small Logo', 'text'],
                  ['organizationName', 'Organization Name', 'text'],
                  ['organizationCode', 'Organization Code', 'text'],
                  ['about', 'About', 'textarea'],
                  ['ownerName', 'Owner Name', 'text'],
                  ['organizationEmail', 'Organization Email', 'email'],
                  ['organizationContactNumber', 'Organization Contact Number', 'tel'],
                  ['country', 'Country', 'text'],
                  ['state', 'State', 'text'],
                  ['district', 'District', 'text'],
                  ['address', 'Address', 'textarea'],
                  ['postalCode', 'Postal Code', 'text']
                ].map(([name, label, fieldType]) => {
                  const fieldId = `organization-${name}`;
                  const hasError = Boolean(formErrors[name]);
                  return (
                    <label key={name} htmlFor={fieldId} className={`org-add-form__field ${hasError ? 'has-error' : ''}`}>
                      <span className="org-add-form__label is-required">{label}</span>
                      {fieldType === 'textarea' ? (
                        <textarea id={fieldId} name={name} required rows={3} />
                      ) : (
                        <input id={fieldId} type={fieldType} name={name} required />
                      )}
                      {hasError ? <small>{formErrors[name]}</small> : null}
                    </label>
                  );
                })}
              </div>

              <div className="org-add-form__actions">
                <button className="btn clients-page__add-btn" type="submit">Submit</button>
                <button className="btn clients-page-btn" type="reset">Reset</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
