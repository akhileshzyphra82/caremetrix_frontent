import { useEffect, useMemo, useRef, useState } from 'react';

type ClientStatus = 'Active' | 'Inactive' | 'Archive';

type Client = {
  uid: string;
  name: string;
  gender: 'Female' | 'Male' | 'Other';
  dateOfBirth: string;
  decisionMaker: string;
  culturalIdentity: string;
  ndisNo: string;
  status: ClientStatus;
  avatar: string;
};

const clientsData: Client[] = [
  {
    uid: '222',
    name: 'Sallianne Tucker',
    gender: 'Female',
    dateOfBirth: '26/05/1975',
    decisionMaker: 'Alison - Mother',
    culturalIdentity: 'Australia',
    ndisNo: '431760856',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/80?img=68'
  },
  {
    uid: '5555',
    name: 'Emma Kane',
    gender: 'Female',
    dateOfBirth: '20/01/1989',
    decisionMaker: 'Wayne Kane',
    culturalIdentity: 'Australia',
    ndisNo: '431760741',
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/80?img=47'
  },
  {
    uid: '342',
    name: 'Michael Smith',
    gender: 'Male',
    dateOfBirth: '12/08/1990',
    decisionMaker: 'Linda Smith',
    culturalIdentity: 'USA',
    ndisNo: '431760123',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/80?img=14'
  },
  {
    uid: '789',
    name: 'Ava Johnson',
    gender: 'Female',
    dateOfBirth: '05/11/1985',
    decisionMaker: 'Mark Johnson',
    culturalIdentity: 'Canada',
    ndisNo: '431760456',
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/80?img=33'
  },
  {
    uid: '101',
    name: 'Liam Brown',
    gender: 'Male',
    dateOfBirth: '15/03/1988',
    decisionMaker: 'Sarah Brown',
    culturalIdentity: 'UK',
    ndisNo: '431760789',
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/80?img=12'
  },
  {
    uid: '202',
    name: 'Olivia Davis',
    gender: 'Female',
    dateOfBirth: '22/07/1992',
    decisionMaker: 'James Davis',
    culturalIdentity: 'New Zealand',
    ndisNo: '431760654',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/80?img=5'
  },
  {
    uid: '303',
    name: 'Noah Wilson',
    gender: 'Male',
    dateOfBirth: '30/04/1980',
    decisionMaker: 'Emily Wilson',
    culturalIdentity: 'Australia',
    ndisNo: '431760321',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/80?img=3'
  },
  {
    uid: '404',
    name: 'Sophia Martinez',
    gender: 'Female',
    dateOfBirth: '11/12/1995',
    decisionMaker: 'Carlos Martinez',
    culturalIdentity: 'USA',
    ndisNo: '431760987',
    status: 'Archive',
    avatar: 'https://i.pravatar.cc/80?img=25'
  },
  {
    uid: '505',
    name: 'Jackson Garcia',
    gender: 'Male',
    dateOfBirth: '01/06/1982',
    decisionMaker: 'Mia Garcia',
    culturalIdentity: 'Mexico',
    ndisNo: '431761234',
    status: 'Archive',
    avatar: 'https://i.pravatar.cc/80?img=15'
  },
  {
    uid: '606',
    name: 'Isabella Rodriguez',
    gender: 'Female',
    dateOfBirth: '29/09/1993',
    decisionMaker: 'Luis Rodriguez',
    culturalIdentity: 'Spain',
    ndisNo: '431761345',
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/80?img=9'
  }
];

function getStatusClass(status: ClientStatus) {
  if (status === 'Active') return 'badge--teal';
  if (status === 'Archive') return 'badge--archive';
  return 'badge--gray';
}

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isActionMenuOpenFor, setIsActionMenuOpenFor] = useState<string | null>(null);
  const [statusFilters, setStatusFilters] = useState<Array<'All' | ClientStatus>>(['All']);
  const [genderFilters, setGenderFilters] = useState<Array<'All' | Client['gender']>>(['All']);
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [recordsPerPageDraft, setRecordsPerPageDraft] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }

      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpenFor(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleStatusFilterChange = (value: 'All' | ClientStatus) => {
    if (value === 'All') {
      setStatusFilters(['All']);
      return;
    }

    setStatusFilters((current) => {
      const withoutAll = current.filter((item) => item !== 'All');
      const next = withoutAll.includes(value) ? withoutAll.filter((item) => item !== value) : [...withoutAll, value];

      return next.length === 0 ? ['All'] : next;
    });
  };

  const handleGenderFilterChange = (value: 'All' | Client['gender']) => {
    if (value === 'All') {
      setGenderFilters(['All']);
      return;
    }

    setGenderFilters((current) => {
      const withoutAll = current.filter((item) => item !== 'All');
      const next = withoutAll.includes(value) ? withoutAll.filter((item) => item !== value) : [...withoutAll, value];

      return next.length === 0 ? ['All'] : next;
    });
  };

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return clientsData.filter((client) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [client.uid, client.name, client.ndisNo, client.culturalIdentity, client.decisionMaker]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus = statusFilters.includes('All') || statusFilters.includes(client.status);
      const matchesGender = genderFilters.includes('All') || genderFilters.includes(client.gender);
      const matchesLocation = locationFilter === 'All Locations' || client.culturalIdentity === locationFilter;

      return matchesSearch && matchesStatus && matchesGender && matchesLocation;
    });
  }, [searchTerm, statusFilters, genderFilters, locationFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilters, genderFilters, locationFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / recordsPerPage));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredClients.slice(startIndex, startIndex + recordsPerPage);
  }, [currentPage, filteredClients, recordsPerPage]);

  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, 3];
    }

    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, totalPages]);

  const startRecord = filteredClients.length === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, filteredClients.length);

  const openClientProfile = (client: Client) => {
    const profilePath = `/participant-support/profile?uid=${encodeURIComponent(client.uid)}&name=${encodeURIComponent(client.name)}&ndis=${encodeURIComponent(client.ndisNo)}`;
    window.history.pushState({}, '', profilePath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <section className="menu-panel active clients-page">
      <div className="clients-page__header-row">
        <div className="clients-breadcrumb" aria-label="Breadcrumb">
          <span>Dashboard</span>
          <span className="clients-breadcrumb__divider">›</span>
          <span>Participant &amp; Support</span>
          <span className="clients-breadcrumb__divider">›</span>
          <strong>Clients</strong>
        </div>

        <button className="btn clients-page__add-btn" type="button">
          <span aria-hidden="true">＋</span> Participant
        </button>
      </div>

      <div className="clients-page__card">
        <div className="clients-page__topbar">
          <div>
            <h1>Participant List</h1>
            <p>Personal, contact, and support coordination details.</p>
          </div>

          <div className="clients-toolbar">
            <label className="clients-search" aria-label="Search Clients">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 14h-.8l-.3-.3a6 6 0 10-.9.9l.3.3v.8l5 5 1.5-1.5-5-5zM10 15a5 5 0 110-10 5 5 0 010 10z" />
              </svg>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search Clients"
              />
            </label>

            <div className="clients-toolbar__actions" ref={filterRef}>
              <button className="clients-filter" type="button" onClick={() => setIsFilterOpen((current) => !current)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
                </svg>
                <span>Filter</span>
              </button>

              {isFilterOpen && (
                <div className="clients-filter-panel" role="dialog" aria-label="Filter participants">
                  <div className="clients-filter-group">
                    <p>Status</p>
                    {(['All', 'Active', 'Inactive', 'Archive'] as Array<'All' | ClientStatus>).map((item) => (
                      <label key={item}>
                        <input type="checkbox" checked={statusFilters.includes(item)} onChange={() => handleStatusFilterChange(item)} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>

                  <div className="clients-filter-group">
                    <p>Gender</p>
                    {(['All', 'Female', 'Male', 'Other'] as Array<'All' | Client['gender']>).map((item) => (
                      <label key={item}>
                        <input type="checkbox" checked={genderFilters.includes(item)} onChange={() => handleGenderFilterChange(item)} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>

                  <div className="clients-filter-group">
                    <p>Location</p>
                    <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
                      <option>All Locations</option>
                      {Array.from(new Set(clientsData.map((client) => client.culturalIdentity))).map((location) => (
                        <option key={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button className="clients-export" type="button" aria-label="Export list">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 2h12l4 4v16H4V2zm2 2v16h12V8h-4V4H6zm2 8h8v2H8v-2zm0 4h8v2H8v-2zm0-8h4v2H8V8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="table-wrap clients-table-wrap">
          <div className="clients-pagination-bar" aria-label="Clients table pagination">
            <p>
              Showing {startRecord}-{endRecord} of {filteredClients.length} records
            </p>

            <div className="clients-pagination-controls">
              <label className="clients-records-per-page" htmlFor="clients-records-per-page">
                <span>Records per page</span>
                <select
                  id="clients-records-per-page"
                  value={recordsPerPageDraft}
                  onChange={(event) => setRecordsPerPageDraft(Number(event.target.value))}
                >
                  {[10, 20, 50].map((size) => (
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

              <button className="clients-page-btn" type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
                Prev
              </button>

              {visiblePageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`clients-page-btn clients-page-btn--number ${pageNumber === currentPage ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                className="clients-page-btn"
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <table className="data-table clients-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Participant Name</th>
              <th className="show-on-compact">Personal Info</th>
              <th>Informal Decision Maker</th>
              <th>Cultural Identity</th>
              <th className="hide-on-compact">NDIS No</th>
              <th className="show-on-compact">Support Info</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.map((client, index) => {
              const serialNumber = startRecord + index;

              return (
              <tr key={client.uid}>
                <td>{serialNumber}</td>
                <td>
                  <button className="participant-cell participant-cell--link" type="button" onClick={() => openClientProfile(client)}>
                    <img src={client.avatar} alt={client.name} />
                    <span className="participant-cell__details">
                      <strong>{client.name}</strong>
                       <small> <span>DOB: {client.dateOfBirth}</span></small>
                      <small>
                      UID : {client.uid} &nbsp;|&nbsp; Gender: {client.gender}
                     
                      </small>
                      
                    </span>
                  </button>
                </td>
               

                <td className="show-on-compact">
                  <div className="compact-info">
                    <strong>{client.gender}</strong>
                    <span>DOB: {client.dateOfBirth}</span>
                  </div>
                </td>
                <td>{client.decisionMaker}</td>
                <td>{client.culturalIdentity}</td>
                <td className="hide-on-compact">{client.ndisNo}</td>
                <td className="show-on-compact">
                  <div className="compact-info">
                    <strong>{client.culturalIdentity}</strong>
                    <span>NDIS: {client.ndisNo}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${getStatusClass(client.status)}`}>{client.status}</span>
                </td>
                <td>
                  <div className="clients-row-action-wrap" ref={isActionMenuOpenFor === client.uid ? actionMenuRef : undefined}>
                    <button
                      className="clients-row-action"
                      type="button"
                      aria-label={`Actions for ${client.name}`}
                      onClick={() => setIsActionMenuOpenFor((current) => (current === client.uid ? null : client.uid))}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </button>

                    {isActionMenuOpenFor === client.uid && (
                      <div className="clients-row-action-menu">
                        <button type="button">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 17.3V21h3.8L18 9.8l-3.8-3.8L3 17.3zm18.7-11.1a1 1 0 000-1.4L19.1 2.3a1 1 0 00-1.4 0l-2 2 3.8 3.8 2.2-2.2z" />
                          </svg>
                          Edit
                        </button>
                        <button type="button">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 7h12l-1 14H7L6 7zm3-4h6l1 2h4v2H4V5h4l1-2z" />
                          </svg>
                          Delete
                        </button>
                        <button type="button">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 9V3h12v6H6zm12 2h2v8H4v-8h2v6h12v-6zm-3 2H9v2h6v-2z" />
                          </svg>
                          Print
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={11} className="clients-empty-state">
                  No clients found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
