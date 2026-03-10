import { useState, type FormEvent } from 'react';

type NotificationRule = {
  id: string;
  moduleMenu: string;
  trigger: string;
  delivery: string;
  template: string;
  isEnabled: boolean;
};

const initialRules: NotificationRule[] = [
  { id: 'NOT-01', moduleMenu: 'Orgnization Structure', trigger: 'On new orgnization', delivery: 'Email + In-app', template: 'New orgnization is created', isEnabled: true },
  { id: 'NOT-02', moduleMenu: 'Modules List', trigger: 'On module update', delivery: 'In-app', template: 'Module priority changed', isEnabled: true },
  { id: 'NOT-03', moduleMenu: 'User Roles', trigger: 'On role permission change', delivery: 'Email', template: 'Role access updated', isEnabled: false }
];

export default function NotificationPage() {
  const [rules, setRules] = useState(initialRules);
  const [showModal, setShowModal] = useState(false);

  const onAddRule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setRules((prev) => [
      {
        id: `NOT-${Math.floor(Math.random() * 900 + 100)}`,
        moduleMenu: String(formData.get('moduleMenu')),
        trigger: String(formData.get('trigger')),
        delivery: String(formData.get('delivery')),
        template: String(formData.get('template')),
        isEnabled: true
      },
      ...prev
    ]);
    setShowModal(false);
  };

  return (
    <section className="menu-panel active clients-page">
      <div className="clients-page__card">
        <div className="clients-page__topbar">
          <div><h1>Notification</h1><p>Super admin configures what notification goes for each menu and what content should be delivered.</p></div>
          <button className="clients-page__add-btn" type="button" onClick={() => setShowModal(true)}>+ Configure Notification</button>
        </div>

        <div className="clients-table-wrap">
          <table className="data-table clients-table">
            <thead><tr><th>Module / Menu</th><th>Trigger</th><th>Delivery</th><th>Template Content</th><th>Status</th></tr></thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td>{rule.moduleMenu}</td>
                  <td>{rule.trigger}</td>
                  <td>{rule.delivery}</td>
                  <td>{rule.template}</td>
                  <td>
                    <button className={`badge ${rule.isEnabled ? 'badge--teal' : 'badge--gray'}`} type="button" onClick={() => setRules((prev) => prev.map((item) => (item.id === rule.id ? { ...item, isEnabled: !item.isEnabled } : item)))}>
                      {rule.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`modal ${showModal ? 'is-open' : ''}`}>
        <button className="modal__backdrop" type="button" onClick={() => setShowModal(false)} />
        <div className="modal__dialog"><button className="modal__close" type="button" onClick={() => setShowModal(false)}>×</button>
          <h3>Add Notification Rule</h3>
          <form className="modal__body" onSubmit={onAddRule}>
            <input name="moduleMenu" placeholder="Module / Menu Name" required />
            <input name="trigger" placeholder="Trigger Event" required />
            <input name="delivery" placeholder="Delivery Mode (Email/SMS/In-app)" required />
            <textarea name="template" placeholder="Notification Content" required />
            <div className="modal__actions"><button className="clients-page__add-btn" type="submit">Save Notification</button></div>
          </form>
        </div>
      </div>
    </section>
  );
}
