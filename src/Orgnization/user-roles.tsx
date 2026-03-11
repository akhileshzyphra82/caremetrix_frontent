import { Fragment, useMemo, useState } from 'react';

type Permission = { add: boolean; edit: boolean; delete: boolean; view: boolean };

type PermissionMenu = { id: string; label: string; permission: Permission };
type PermissionSection = { id: string; title: string; menus: PermissionMenu[] };
type RolePermissionMenu = PermissionMenu & { enabled: boolean };
type RolePermissionSection = Omit<PermissionSection, 'menus'> & { enabled: boolean; menus: RolePermissionMenu[] };
type RoleFor = 'SuperAdmin' | 'Admin' | 'Staff';

type RoleRow = {
  id: string;
  icon: string;
  roleName: string;
  hierarchy: number;
  roleFor: RoleFor;
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [roleForm, setRoleForm] = useState<{ roleName: string; roleFor: RoleFor; hierarchy: string; description: string }>({
    roleName: '',
    roleFor: 'SuperAdmin',
    hierarchy: '',
    description: ''
  });
  const [permissionSections, setPermissionSections] = useState<RolePermissionSection[]>(() =>
    defaultSections.map((section) => ({
      ...section,
      enabled: section.menus.some((menu) => Object.values(menu.permission).some(Boolean)),
      menus: section.menus.map((menu) => ({ ...menu, enabled: Object.values(menu.permission).some(Boolean) }))
    }))
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return roleRows;
    return roleRows.filter((role) => role.roleName.toLowerCase().includes(query) || role.roleFor.toLowerCase().includes(query));
  }, [search]);

  const resetAddForm = () => {
    setRoleForm({ roleName: '', roleFor: 'SuperAdmin', hierarchy: '', description: '' });
    setPermissionSections(
      defaultSections.map((section) => ({
        ...section,
        enabled: false,
        menus: section.menus.map((menu) => ({
          ...menu,
          enabled: false,
          permission: { add: false, edit: false, delete: false, view: false }
        }))
      }))
    );
  };

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    setPermissionSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              enabled: checked,
              menus: section.menus.map((menu) => ({
                ...menu,
                enabled: checked,
                permission: { add: checked, edit: checked, delete: checked, view: checked }
              }))
            }
          : section
      )
    );
  };

  const handleMenuToggle = (sectionId: string, menuId: string, checked: boolean) => {
    setPermissionSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        const menus = section.menus.map((menu) =>
          menu.id === menuId ? { ...menu, enabled: checked, permission: { add: checked, edit: checked, delete: checked, view: checked } } : menu
        );
        return { ...section, menus, enabled: menus.some((menu) => menu.enabled) };
      })
    );
  };

  const handleModulePermissionToggle = (sectionId: string, key: keyof Permission, checked: boolean) => {
    setPermissionSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        const menus = section.menus.map((menu) => {
          const permission = { ...menu.permission, [key]: checked };
          return { ...menu, permission, enabled: Object.values(permission).some(Boolean) };
        });
        return { ...section, menus, enabled: menus.some((menu) => menu.enabled) };
      })
    );
  };

  const handleMenuPermissionToggle = (sectionId: string, menuId: string, key: keyof Permission, checked: boolean) => {
    setPermissionSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        const menus = section.menus.map((menu) => {
          if (menu.id !== menuId) return menu;
          const permission = { ...menu.permission, [key]: checked };
          return { ...menu, permission, enabled: Object.values(permission).some(Boolean) };
        });
        return { ...section, menus, enabled: menus.some((menu) => menu.enabled) };
      })
    );
  };

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

        <button className="btn clients-page__add-btn" type="button" onClick={() => setIsAddModalOpen(true)}>
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

      {isAddModalOpen && (
        <div className="org-add-modal" role="dialog" aria-modal="true" aria-labelledby="role-add-modal-title">
          <div className="org-add-modal__backdrop" onClick={() => setIsAddModalOpen(false)} />
          <div className="org-add-modal__dialog role-add-modal__dialog">
            <button className="org-add-modal__close" type="button" aria-label="Close" onClick={() => setIsAddModalOpen(false)}>
              ×
            </button>
            <h2 id="role-add-modal-title">Add New Role</h2>
            <p>Create role details and assign module/menu permissions with quick toggles.</p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setIsAddModalOpen(false);
                resetAddForm();
              }}
            >
              <div className="role-form-section">
                <h3>Role Information</h3>
                <div className="org-add-form__grid role-add-form__grid">
                  <label className="org-add-form__field">
                    <span className="org-add-form__label is-required">Role</span>
                    <span className="org-add-form__control-wrap">
                      <input value={roleForm.roleName} onChange={(event) => setRoleForm((prev) => ({ ...prev, roleName: event.target.value }))} placeholder="Enter role name" required />
                    </span>
                  </label>

                  <label className="org-add-form__field">
                    <span className="org-add-form__label is-required">Role For</span>
                    <span className="org-add-form__control-wrap">
                      <select value={roleForm.roleFor} onChange={(event) => setRoleForm((prev) => ({ ...prev, roleFor: event.target.value as RoleFor }))}>
                        <option value="SuperAdmin">SuperAdmin</option>
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </span>
                  </label>

                  <label className="org-add-form__field">
                    <span className="org-add-form__label is-required">Hierarchy</span>
                    <span className="org-add-form__control-wrap">
                      <input type="number" min={1} value={roleForm.hierarchy} onChange={(event) => setRoleForm((prev) => ({ ...prev, hierarchy: event.target.value }))} placeholder="Hierarchy level" required />
                    </span>
                  </label>

                  <label className="org-add-form__field role-add-form__field--full">
                    <span className="org-add-form__label">Description</span>
                    <span className="org-add-form__control-wrap">
                      <textarea value={roleForm.description} onChange={(event) => setRoleForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Brief role description" />
                    </span>
                  </label>
                </div>
              </div>

              <div className="role-form-section">
                <h3>Module &amp; Menu Permissions</h3>
                <div className="table-wrap role-permission-builder-wrap">
                  <table className="data-table role-permission-builder">
                    <thead>
                      <tr>
                        <th>Module / Menu</th>
                        <th>Enable</th>
                        <th>Add</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissionSections.map((section) => (
                        <Fragment key={section.id}>
                          <tr className="role-module-row">
                            <td>{section.title}</td>
                            <td>
                              <input type="checkbox" checked={section.enabled} onChange={(event) => handleSectionToggle(section.id, event.target.checked)} />
                            </td>
                            {(['add', 'edit', 'delete', 'view'] as (keyof Permission)[]).map((key) => (
                              <td key={key}>
                                <input
                                  type="checkbox"
                                  checked={section.menus.length > 0 && section.menus.every((menu) => menu.permission[key])}
                                  onChange={(event) => handleModulePermissionToggle(section.id, key, event.target.checked)}
                                />
                              </td>
                            ))}
                          </tr>
                          {section.menus.map((menu) => (
                            <tr key={menu.id}>
                              <td className="role-menu-cell">{menu.label}</td>
                              <td>
                                <input type="checkbox" checked={menu.enabled} onChange={(event) => handleMenuToggle(section.id, menu.id, event.target.checked)} />
                              </td>
                              {(['add', 'edit', 'delete', 'view'] as (keyof Permission)[]).map((key) => (
                                <td key={key}>
                                  <input
                                    type="checkbox"
                                    checked={menu.permission[key]}
                                    onChange={(event) => handleMenuPermissionToggle(section.id, menu.id, key, event.target.checked)}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="org-add-form__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetAddForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
