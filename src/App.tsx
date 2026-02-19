import { type ComponentType, useEffect, useMemo, useState } from 'react';
import { getPathForMenu, sidebarModules } from './shared';
import DashboardPage from './dashboard/dashboard';
import ClientsPage from './participant-support/clients';
import ProfilePage from './participant-support/profile';
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
  '/participant-support/profile': ProfilePage,
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

function renderModuleIcon(moduleKey: string) {
  switch (moduleKey) {
    case 'dashboard':
      return <path d="M4 11h7V4H4v7zm0 9h7v-7H4v7zm9 0h7v-7h-7v7zm0-16v7h7V4h-7z" />;
    case 'participant-support':
      return <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zM8 11c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.7 0-5 1.3-5 3v2h10v-2c0-1.7-2.3-3-5-3zm8 0c-.6 0-1.2.1-1.7.2 1.2.7 2 1.7 2 2.8v2h6v-2c0-1.7-2.3-3-4.3-3z" />;
    case 'people-workforce':
      return <path d="M7 4h10v2H7V4zm-2 4h14v12H5V8zm2 2v8h10v-8H7zm2 2h2v4H9v-4zm4 0h2v4h-2v-4z" />;
    case 'operations':
      return <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" />;
    case 'whs-policies':
      return <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4zm-1 14l6-6-1.4-1.4-4.6 4.6-2.6-2.6L7 12l4 4z" />;
    case 'asset-management':
      return <path d="M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2zm0 2.2L6 6.9l6 2.9 6-2.9-6-2.7zm-7 5.1v6.9l6 3v-6.9l-6-3zm8 9.9l6-3V9.3l-6 3v6.9z" />;
    case 'media-library':
      return <path d="M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm0 2v8h16V8H4zm3 1h4v4H7V9zm6 0h4v1.6h-4V9zm0 3h4v1.6h-4V12z" />;
    case 'information':
      return <path d="M11 7h2V5h-2v2zm0 12h2V9h-2v10zm1-17C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />;
    default:
      return <path d="M4 4h16v16H4z" />;
  }
}

function App() {
  const [path, setPath] = useState(getCurrentPath());
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const onChange = () => setPath(getCurrentPath());
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest('.profile-menu')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', onOutsideClick);
    return () => document.removeEventListener('click', onOutsideClick);
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
          <button className="header-toggle" type="button" aria-label="Toggle sidebar" onClick={() => setSidebarExpanded((state) => !state)}>
            <svg className="hamburger-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="header-brand" aria-label="CareMatrix">
            <img className="header-logo" src="https://pub-c61fbd9fa813427186a41ed133f48034.r2.dev/asset/website-banner/bg-logo.png" alt="CareMatrix logo" />
          </div>
        </div>

        <div className="topbar__center">
          <div className="topbar-search" role="search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.5 14h-.8l-.3-.3a6 6 0 10-.9.9l.3.3v.8l5 5 1.5-1.5-5-5zM10 15a5 5 0 110-10 5 5 0 010 10z" />
            </svg>
            <input type="search" placeholder="Search participants, staff, shifts, invoices..." aria-label="Search" />
          </div>
        </div>

        <div className="topbar__actions">
          <button className="icon-btn icon-btn--gradient-outline icon-btn--notify" type="button" aria-label="Notifications">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <linearGradient id="notifGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFB84D" />
                  <stop offset="40%" stopColor="#F080C0" />
                  <stop offset="75%" stopColor="#A57FCF" />
                  <stop offset="100%" stopColor="#6F7FDF" />
                </linearGradient>
              </defs>
              <path d="M12 22a2 2 0 002-2h-4a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z" fill="url(#notifGradient)" />
            </svg>
            <span className="notify-dot" aria-hidden="true"></span>
          </button>

          <div className={`profile-menu ${profileMenuOpen ? 'is-open' : ''}`}>
            <button
              className="profile-trigger"
              type="button"
              aria-haspopup="true"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen((state) => !state)}
            >
              <img className="profile-trigger__avatar" src="https://i.pravatar.cc/80?img=32" alt="User avatar" />
              <span className="profile-trigger__name">Ava Collins</span>
            </button>
            <div className="profile-dropdown" role="menu" aria-label="Profile menu">
              <div className="profile-dropdown__header">
                <img className="profile-dropdown__avatar" src="https://i.pravatar.cc/80?img=32" alt="User avatar" />
                <p className="profile-dropdown__name">Ava Collins</p>
                <p className="profile-dropdown__role">Superadmin</p>
              </div>
              <button className="profile-dropdown__item" role="menuitem" type="button">
                Profile
              </button>
              <button className="profile-dropdown__item" role="menuitem" type="button">
                Settings
              </button>
              <button className="profile-dropdown__item profile-dropdown__item--danger" role="menuitem" type="button">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="app" data-sidebar={sidebarExpanded ? 'expanded' : 'collapsed'}>
        <aside className="sidebar" aria-label="Primary">
          <nav className="sidebar-menu">
            {sidebarModules.map((module) => {
              const hasChildren = module.children.length > 0;
              const isDashboard = module.key === 'dashboard';
              const moduleOpen = openModules[module.key] || activeModule?.key === module.key;

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
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {renderModuleIcon(module.key)}
                      </svg>
                      <span className="sidebar-parent__text">{module.label}</span>
                    </span>
                    {!isDashboard && (
                      <svg className="sidebar-parent__chevron" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
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
