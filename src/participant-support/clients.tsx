import { useMemo, useState } from 'react';

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
  const [statusFilter, setStatusFilter] = useState<'All' | ClientStatus>('All');

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return clientsData.filter((client) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [client.uid, client.name, client.ndisNo, client.culturalIdentity, client.decisionMaker]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus = statusFilter === 'All' || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <section className="menu-panel active clients-page">
      <div className="clients-breadcrumb" aria-label="Breadcrumb">
        <span>Dashboard</span>
        <span className="clients-breadcrumb__divider">›</span>
        <span>Participant &amp; Support</span>
        <span className="clients-breadcrumb__divider">›</span>
        <strong>Clients</strong>
      </div>

      <div className="clients-page__topbar">
        <div>
          <h1>Participant List</h1>
          <p>Personal, contact, and support coordination details.</p>
        </div>

        <button className="btn clients-page__add-btn" type="button">
          <span aria-hidden="true">＋</span> Participant
        </button>
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

        <div className="clients-toolbar__actions">
          <label className="clients-filter">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            <span>Filter</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'All' | ClientStatus)}>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archive">Archive</option>
            </select>
          </label>

          <button className="clients-export" type="button" aria-label="Export list">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 20h14v-2H5v2zM12 2l-5.5 5.5 1.4 1.4L11 5.8V16h2V5.8l3.1 3.1 1.4-1.4L12 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="table-wrap clients-table-wrap">
        <table className="data-table clients-table">
          <thead>
            <tr>
              <th>UID</th>
              <th>Participant Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Informal Decision Maker</th>
              <th>Cultural Identity</th>
              <th>NDIS No</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.uid}>
                <td>{client.uid}</td>
                <td>
                  <div className="participant-cell">
                    <img src={client.avatar} alt={client.name} />
                    <span>{client.name}</span>
                  </div>
                </td>
                <td>{client.gender}</td>
                <td>{client.dateOfBirth}</td>
                <td>{client.decisionMaker}</td>
                <td>{client.culturalIdentity}</td>
                <td>{client.ndisNo}</td>
                <td>
                  <span className={`badge ${getStatusClass(client.status)}`}>{client.status}</span>
                </td>
                <td>
                  <button className="clients-row-action" type="button" aria-label={`Actions for ${client.name}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={9} className="clients-empty-state">
                  No clients found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
