import { useEffect, useMemo, useState } from 'react';
import { fetchDummyApiResponse, type DashboardDetail, type DummyApiResponse } from '../dummyApiResponse';

const fallbackBadgeClass = 'badge--gray';

const defaultStatIcon = {
  className: 'stat-card__icon--operations',
  path: 'M4 5h16v3H4V5zm0 5h10v3H4v-3zm0 5h16v3H4v-3zm12-5h4v3h-4v-3z'
} as const;

function getStatIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes('shift') || normalized.includes('roster')) {
    return {
      className: 'stat-card__icon--schedule',
      path: 'M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm11 8H6v10h12V10zm-9 2h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2z'
    };
  }

  if (normalized.includes('gap') || normalized.includes('incident') || normalized.includes('alert') || normalized.includes('escalation')) {
    return {
      className: 'stat-card__icon--alerts',
      path: 'M12 3l9 16H3L12 3zm0 5.5a1 1 0 00-1 1V13a1 1 0 002 0V9.5a1 1 0 00-1-1zm0 8a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z'
    };
  }

  if (normalized.includes('clock')) {
    return {
      className: 'stat-card__icon--operations',
      path: 'M12 3a9 9 0 100 18 9 9 0 000-18zm1 4h-2v5.6l4.6 2.7 1-1.7-3.6-2.1V7z'
    };
  }

  return defaultStatIcon;
}

function getStatusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes('active') || normalized.includes('resolved')) return 'badge--teal';
  if (normalized.includes('investigating') || normalized.includes('pending')) return 'badge--blue';
  return fallbackBadgeClass;
}

function DetailCard({ detail }: { detail: DashboardDetail }) {
  return (
    <div className="card compact-card">
      <div className="card__header">
        <div>
          <h2>{detail.title}</h2>
          <p>{detail.subtitle}</p>
        </div>
      </div>
      <ul className="status-list status-list--compact">
        {detail.list.map((item) => (
          <li key={`${item.badge ?? 'item'}-${item.text}`}>
            {item.badge && <span className={`badge ${item.badgeClass ?? fallbackBadgeClass}`}>{item.badge}</span>} {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DashboardPage() {
  const [apiData, setApiData] = useState<DummyApiResponse | null>(null);

  useEffect(() => {
    fetchDummyApiResponse().then(setApiData);
  }, []);

  const operationalData = useMemo(() => apiData?.dashboardDetails.operations, [apiData]);
  const approvalsData = useMemo(() => apiData?.dashboardDetails.approvals, [apiData]);
  const complianceData = useMemo(() => apiData?.dashboardDetails.compliance, [apiData]);
  const qualityData = useMemo(() => apiData?.dashboardDetails.quality, [apiData]);

  if (!apiData || !operationalData || !approvalsData || !complianceData || !qualityData) {
    return (
      <section className="menu-panel active dashboard-page">
        <div className="card">
          <p>Loading dashboard data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="menu-panel active dashboard-page">
      <div className="hero">
        <h1>Good Morning</h1>
        <p>
          Welcome back, {apiData.userProfile.name.split(' ')[0]}. Here is your live operational snapshot for CareMatrix today.
        </p>
      </div>

      <div className="stat-grid">
        {operationalData.metrics.slice(0, 3).map((metric, index) => {
          const icon = getStatIcon(metric.label);

          return (
            <article
              key={metric.label}
              className={`stat-card ${index === 0 ? 'stat-card--mint' : index === 1 ? 'stat-card--sky' : 'stat-card--lavender'}`}
            >
              <div className={`stat-card__icon ${icon.className}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={icon.path} />
                </svg>
              </div>
              <div>
                <p>{metric.label}</p>
                <h3>{metric.value}</h3>
              </div>
            </article>
          );
        })}
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="card">
            <div className="card__header">
              <div>
                <h2>{operationalData.title}</h2>
                <p>{operationalData.subtitle}</p>
              </div>
            </div>
            <div className="info-grid info-grid--tight">
              {operationalData.metrics.map((metric) => (
                <div className="info-card" key={metric.label}>
                  <p>{metric.label}</p>
                  <h3>{metric.value}</h3>
                  {metric.note && <span className="muted">{metric.note}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <div>
                <h2>Directory Snapshot</h2>
                <p>Latest operational records from dummy API response data.</p>
              </div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Role</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {apiData.directoryRecords.map((record, index) => (
                    <tr key={record.id}>
                      <td>{String(index + 1).padStart(2, '0')}</td>
                      <td>{record.id}</td>
                      <td>{record.title}</td>
                      <td>{record.type}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(record.status)}`}>{record.status}</span>
                      </td>
                      <td>{record.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="dashboard-side">
          <DetailCard detail={approvalsData} />
          <DetailCard detail={complianceData} />
          <DetailCard detail={qualityData} />
        </aside>
      </div>
    </section>
  );
}
