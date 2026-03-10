import { useState, type FormEvent } from 'react';

type Permission = { add: boolean; edit: boolean; delete: boolean; view: boolean };
type RoleRow = { id: string; roleName: string; isDefault: 'Yes' | 'No'; permissions: Record<string, Permission> };

const moduleMenus = ['Orgnization Structure', 'Modules List', 'User Roles', 'Notification'];

const createPermission = (): Permission => ({ add: false, edit: false, delete: false, view: true });

const initialRoles: RoleRow[] = [
  {
    id: 'ROLE-01',
    roleName: 'Super Admin',
    isDefault: 'Yes',
    permissions: Object.fromEntries(moduleMenus.map((menu) => [menu, { add: true, edit: true, delete: true, view: true }]))
  },
  {
    id: 'ROLE-02',
    roleName: 'Operations Manager',
    isDefault: 'No',
    permissions: Object.fromEntries(moduleMenus.map((menu) => [menu, createPermission()]))
  }
];

export default function UserRolesPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const onPermissionChange = (roleId: string, menu: string, key: keyof Permission) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? { ...role, permissions: { ...role.permissions, [menu]: { ...role.permissions[menu], [key]: !role.permissions[menu][key] } } }
          : role
      )
    );
  };

  const onCreateRole = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const roleName = String(formData.get('roleName') || '').trim();
    const isDefault = String(formData.get('isDefault') || 'No') as 'Yes' | 'No';
    if (!roleName) return;

    setRoles((prev) => [
      {
        id: `ROLE-${Math.floor(Math.random() * 900 + 100)}`,
        roleName,
        isDefault,
        permissions: Object.fromEntries(moduleMenus.map((menu) => [menu, createPermission()]))
      },
      ...prev
    ]);
    setShowRoleModal(false);
  };

  return (
    <section className="menu-panel active clients-page">
      <div className="clients-page__card">
        <div className="clients-page__topbar">
          <div><h1>User Roles</h1><p>Create user roles and configure module/menu access with ADD, EDIT, DELETE and VIEW permissions.</p></div>
          <button className="clients-page__add-btn" type="button" onClick={() => setShowRoleModal(true)}>+ Create Role</button>
        </div>

        <div className="clients-table-wrap">
          <table className="data-table clients-table">
            <thead><tr><th>Role Name</th><th>Default</th>{moduleMenus.map((menu) => <th key={menu}>{menu}</th>)}</tr></thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td><strong>{role.roleName}</strong><br /><small>{role.id}</small></td>
                  <td><span className={`badge ${role.isDefault === 'Yes' ? 'badge--teal' : 'badge--gray'}`}>{role.isDefault}</span></td>
                  {moduleMenus.map((menu) => {
                    const permission = role.permissions[menu];
                    return (
                      <td key={`${role.id}-${menu}`}>
                        <div className="permission-grid">
                          {(['add', 'edit', 'delete', 'view'] as Array<keyof Permission>).map((key) => (
                            <label key={key}>
                              <input type="checkbox" checked={permission[key]} onChange={() => onPermissionChange(role.id, menu, key)} />
                              {key.toUpperCase()}
                            </label>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`modal ${showRoleModal ? 'is-open' : ''}`}>
        <button className="modal__backdrop" type="button" onClick={() => setShowRoleModal(false)} />
        <div className="modal__dialog"><button className="modal__close" type="button" onClick={() => setShowRoleModal(false)}>×</button>
          <h3>Create User Role</h3>
          <form className="modal__body" onSubmit={onCreateRole}>
            <input name="roleName" placeholder="Role Name" required />
            <select name="isDefault" defaultValue="No"><option value="No">Default: No</option><option value="Yes">Default: Yes</option></select>
            <div className="modal__actions"><button className="clients-page__add-btn" type="submit">Create Role</button></div>
          </form>
        </div>
      </div>
    </section>
  );
}
