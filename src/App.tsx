import { type ComponentType, useEffect, useMemo, useState } from 'react';
import { getPathForMenu, sidebarModules } from './shared';
import DashboardPage from './dashboard/dashboard';
import ClientsPage from './participant-support/clients';
import FundingPage from './participant-support/funding';
import IrregularSupportPage from './participant-support/irregular-support';
import IncidentAccidentPage from './participant-support/incident-accident';
import FeedbackComplaintsPage from './participant-support/feedback-complaints';
import StaffPage from './people-workforce/staff';
import RostersPage from './people-workforce/rosters';
import TrainingDevelopmentPage from './people-workforce/training-development';
import TimesheetManagementPage from './people-workforce/timesheet-management';
import CostCategoryPage from './people-workforce/cost-category';
import LeaveManagementPage from './people-workforce/leave-management';
import PolicyPage from './operations/policy';
import SuppliersPage from './operations/suppliers';
import PropertiesPage from './operations/properties';
import WorkHealthSafetyPage from './whs-policies/work-health-safety';
import WhsPolicyPage from './whs-policies/whs-policy';
import AssetRegisterPage from './asset-management/asset-register';
import AssetReportPage from './asset-management/asset-report';
import DrivePage from './media-library/drive';
import DocumentsPage from './media-library/documents';
import NoticeBoardPage from './information/notice-board';
import CalendarPage from './information/calendar';
import EventPage from './information/event';
import FaqPage from './information/faq';

const routeComponents: Record<string, ComponentType> = {
  '/': DashboardPage,
  '/dashboard': DashboardPage,
  '/participant-support/clients': ClientsPage,
  '/participant-support/funding': FundingPage,
  '/participant-support/irregular-support': IrregularSupportPage,
  '/participant-support/incident-accident': IncidentAccidentPage,
  '/participant-support/feedback-complaints': FeedbackComplaintsPage,
  '/people-workforce/staff': StaffPage,
  '/people-workforce/rosters': RostersPage,
  '/people-workforce/training-development': TrainingDevelopmentPage,
  '/people-workforce/timesheet-management': TimesheetManagementPage,
  '/people-workforce/cost-category': CostCategoryPage,
  '/people-workforce/leave-management': LeaveManagementPage,
  '/operations/policy': PolicyPage,
  '/operations/suppliers': SuppliersPage,
  '/operations/properties': PropertiesPage,
  '/whs-policies/work-health-safety': WorkHealthSafetyPage,
  '/whs-policies/whs-policy': WhsPolicyPage,
  '/asset-management/asset-register': AssetRegisterPage,
  '/asset-management/asset-report': AssetReportPage,
  '/media-library/drive': DrivePage,
  '/media-library/documents': DocumentsPage,
  '/information/notice-board': NoticeBoardPage,
  '/information/calendar': CalendarPage,
  '/information/event': EventPage,
  '/information/faq': FaqPage
};

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function getCurrentPath() {
  return window.location.pathname;
}

function App() {
  const [path, setPath] = useState(getCurrentPath());
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const onChange = () => setPath(getCurrentPath());
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  const CurrentPage = routeComponents[path] || DashboardPage;

  const activeModule = useMemo(
    () => sidebarModules.find((module) => module.children.some((child) => getPathForMenu(module.key, child.menuId) === path)),
    [path]
  );

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <button className="header-toggle" type="button" onClick={() => setSidebarExpanded((state) => !state)}>
            ☰
          </button>
          <div className="header-brand">
            <img className="header-logo" src="https://pub-c61fbd9fa813427186a41ed133f48034.r2.dev/asset/website-banner/bg-logo.png" alt="CareMatrix logo" />
          </div>
        </div>
      </header>

      <div className="app" data-sidebar={sidebarExpanded ? 'expanded' : 'collapsed'}>
        <aside className="sidebar" aria-label="Primary">
          <nav className="sidebar-menu">
            {sidebarModules.map((module) => {
              const hasChildren = module.children.length > 0;
              const isDashboard = module.key === 'dashboard';
              const moduleOpen = openModules[module.key] || (activeModule?.key === module.key);

              return (
                <div key={module.key}>
                  <button
                    className={`sidebar-parent ${isDashboard ? 'sidebar-parent--single' : ''} ${
                      path === '/dashboard' && isDashboard ? 'active' : moduleOpen ? 'is-open' : ''
                    }`}
                    type="button"
                    onClick={() => {
                      if (isDashboard) {
                        navigate('/dashboard');
                        return;
                      }
                      setOpenModules((current) => ({ ...current, [module.key]: !moduleOpen }));
                    }}
                  >
                    <span className="sidebar-parent__label">
                      <span className="sidebar-parent__text">{module.label}</span>
                    </span>
                    {!isDashboard && <span className="sidebar-parent__chevron">⌄</span>}
                  </button>

                  {hasChildren && (
                    <div className={`sidebar-submenu ${moduleOpen ? 'is-open' : ''}`}>
                      {module.children.map((child) => {
                        const childPath = getPathForMenu(module.key, child.menuId);
                        return (
                          <button
                            key={child.menuId}
                            className={`sidebar-item sidebar-subitem ${path === childPath ? 'active' : ''}`}
                            type="button"
                            onClick={() => navigate(childPath)}
                          >
                            <span className="sidebar-item__text">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="main">
          <section className="content">
            <div className="menu-panels">
              <CurrentPage />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default App;
