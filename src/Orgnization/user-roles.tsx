import { Fragment, useMemo, useState } from 'react';

type Permission = { add: boolean; edit: boolean; delete: boolean; view: boolean };

type PermissionMenu = { id: string; label: string; permission: Permission };
type PermissionSection = { id: string; title: string; menus: PermissionMenu[] };

type RoleRow = {
  id: string;
  icon: string;
  roleName: string;
  hierarchy: number;
  roleFor: 'SuperAdmin' | 'Admin' | 'Staff';
  totalUsers: number;
  avatars: string[];
  modulesCount: number;
  sections: PermissionSection[];
};

const defaultSections: PermissionSection[] = [
  {
    id: 'participant-support',
    title: 'Participant & Support',
    menus: [
      { id: 'clients', label: 'Clients', permission: { add: true, edit: true, delete: true, view: true } },
      { id: 'funding', label: 'Funding', permission: { add: true, edit: true, delete: false, view: true } },
      { id: 'goals', label: 'Goals', permission: { add: true, edit: false, delete: false, view: true } }
    ]
  },
  {
    id: 'people-workforce',
    title: 'People & Workforce',
    menus: [
      { id: 'staff', label: 'Staff', permission: { add: true, edit: true, delete: false, view: true } },
      { id: 'rosters', label: 'Rosters', permission: { add: true, edit: true, delete: true, view: true } }
    ]
  },
  {
    id: 'finance-billing',
    title: 'Finance & Billing',
    menus: [
      { id: 'invoices', label: 'Invoices', permission: { add: true, edit: true, delete: true, view: true } },
      { id: 'expenses', label: 'Expenses', permission: { add: true, edit: true, delete: false, view: true } },
      { id: 'reports', label: 'Reports', permission: { add: false, edit: false, delete: false, view: true } }
    ]
  },
  {
    id: 'reports-analytics',
    title: 'Reports & Analytics',
    menus: [{ id: 'dashboard', label: 'Dashboard', permission: { add: false, edit: false, delete: false, view: true } }]
  }
];

const roleRows: RoleRow[] = [
  {
    id: 'ROLE-1',
    icon: '👑',
    roleName: 'Super Admin',
    hierarchy: 1,
    roleFor: 'SuperAdmin',
    totalUsers: 2,
    avatars: ['A', 'B'],
    modulesCount: 6,
    sections: defaultSections
  },
  {
    id: 'ROLE-2',
    icon: '🛡️',
    roleName: 'Admin',
    hierarchy: 2,
    roleFor: 'Admin',
    totalUsers: 5,
    avatars: ['A', 'B', 'C'],
    modulesCount: 5,
    sections: defaultSections
  },
  { id: 'ROLE-3', icon: '🤝', roleName: 'Support Coordinator', hierarchy: 3, roleFor: 'Staff', totalUsers: 12, avatars: ['A', 'B', 'C'], modulesCount: 3, sections: defaultSections },
  { id: 'ROLE-4', icon: '💰', roleName: 'Finance Manager', hierarchy: 4, roleFor: 'Staff', totalUsers: 4, avatars: ['A', 'B', 'C'], modulesCount: 2, sections: defaultSections },
  { id: 'ROLE-5', icon: '👤', roleName: 'HR Manager', hierarchy: 5, roleFor: 'Admin', totalUsers: 3, avatars: ['A', 'B', 'C'], modulesCount: 3, sections: defaultSections }
];

export default function UserRolesPage() {
  const [search, setSearch] = useState('');
  const [expandedRoleId, setExpandedRoleId] = useState<string>('ROLE-2');

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return roleRows;
    return roleRows.filter((role) => role.roleName.toLowerCase().includes(query) || role.roleFor.toLowerCase().includes(query));
  }, [search]);

  return (
    <section className="menu-panel active clients-page user-roles-page">
      <div className="clients-page__header-row">
        <div className="clients-breadcrumb" aria-label="Breadcrumb">
          <span>Dashboard</span>
          <span className="clients-breadcrumb__divider">›</span>
          <span>Settings &amp; Config</span>
          <span className="clients-breadcrumb__divider">›</span>
          <strong>User Roles</strong>
        </div>

        <button className="btn clients-page__add-btn" type="button">
          <span aria-hidden="true">＋</span> Role
        </button>
      </div>

      <div className="clients-page__card roles-card">
        <div className="clients-page__topbar roles-topbar">
          <div>
            <h1>User Roles</h1>
            <p>Manage roles, hierarchy, permissions and module access for all users.</p>
          </div>

          <div className="roles-toolbar-actions">
            <label className="clients-search roles-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 14h-.8l-.3-.3a6 6 0 10-.9.9l.3.3v.8l5 5 1.5-1.5-5-5zM10 15a5 5 0 110-10 5 5 0 010 10z" />
              </svg>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Roles" />
            </label>

            <button className="clients-filter" type="button">
              ⚙ Filter
            </button>

            <button className="roles-view-toggle" type="button" aria-label="Grid view">
              ▦
            </button>
            <button className="roles-view-toggle" type="button" aria-label="List view">
              ☰
            </button>
          </div>
        </div>

        <div className="table-wrap clients-table-wrap">
          <div className="clients-pagination-bar">
            <p>
              Showing 1-{filteredRows.length} of {filteredRows.length} records
            </p>
          </div>

          <table className="data-table clients-table roles-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Role</th>
                <th>Hierarchy</th>
                <th>For</th>
                <th>Total Users</th>
                <th>Modules</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((role, index) => {
                const isExpanded = expandedRoleId === role.id;
                return (
                  <Fragment key={role.id}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <div className="module-name-cell roles-name-cell">
                          <span className="module-icon" aria-hidden="true">
                            {role.icon}
                          </span>
                          <strong>{role.roleName}</strong>
                        </div>
                      </td>
                      <td>{role.hierarchy}</td>
                      <td>
                        <span className={`role-type-chip role-type-chip--${role.roleFor.toLowerCase()}`}>{role.roleFor}</span>
                      </td>
                      <td>
                        <div className="roles-users-cell">
                          <div className="roles-avatars">
                            {role.avatars.map((letter, i) => (
                              <span key={`${role.id}-${letter}-${i}`}>{letter}</span>
                            ))}
                          </div>
                          <span>{role.totalUsers} Users</span>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`menu-count-chip roles-module-btn ${isExpanded ? 'is-open' : ''}`}
                          onClick={() => setExpandedRoleId((prev) => (prev === role.id ? '' : role.id))}
                        >
                          {role.modulesCount} Modules {isExpanded ? '▲' : '▼'}
                        </button>
                      </td>
                      <td>
                        <button className="row-menu-btn" type="button" aria-label={`Actions for ${role.roleName}`}>
                          ⋮
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="module-nested-cell">
                          <div className="module-nested-wrap roles-nested-wrap">
                            <table className="data-table module-nested-table roles-permission-table">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Menu Name</th>
                                  <th>Add</th>
                                  <th>Edit</th>
                                  <th>Delete</th>
                                  <th>View</th>
                                </tr>
                              </thead>
                              <tbody>
                                {role.sections.map((section) => (
                                  <Fragment key={section.id}>
                                    <tr className="roles-section-row">
                                      <td colSpan={6}>
                                        <span>{section.title}</span>
                                      </td>
                                    </tr>
                                    {section.menus.map((menu, menuIndex) => (
                                      <tr key={menu.id}>
                                        <td>{menuIndex + 1}</td>
                                        <td>
                                          <span className="menu-dot" /> {menu.label}
                                        </td>
                                        <td>{menu.permission.add ? <span className="perm-check">✓</span> : <span className="perm-cross">✕</span>}</td>
                                        <td>{menu.permission.edit ? <span className="perm-check">✓</span> : <span className="perm-cross">✕</span>}</td>
                                        <td>{menu.permission.delete ? <span className="perm-check">✓</span> : <span className="perm-cross">✕</span>}</td>
                                        <td>{menu.permission.view ? <span className="perm-check">✓</span> : <span className="perm-cross">✕</span>}</td>
                                      </tr>
                                    ))}
                                  </Fragment>
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
    </section>
  );
}
