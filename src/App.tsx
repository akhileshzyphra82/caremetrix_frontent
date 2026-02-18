import { useEffect, useMemo, useState } from 'react';
import {
  fetchDummyApiResponse,
  type DummyApiResponse,
  type MenuItem
} from './dummyApiResponse';
import { DashboardPage } from './modules/dashboard/Dashboard';
import { ClientsPage } from './modules/participant-support/Clients';
import { FundingPage } from './modules/participant-support/Funding';
import { IrregularSupportPage } from './modules/participant-support/IrregularSupport';
import { IncidentAccidentPage } from './modules/participant-support/IncidentAccident';
import { FeedbackComplaintsPage } from './modules/participant-support/FeedbackComplaints';
import { StaffPage } from './modules/people-workforce/Staff';
import { RostersPage } from './modules/people-workforce/Rosters';
import { TrainingDevelopmentPage } from './modules/people-workforce/TrainingDevelopment';
import { TimesheetManagementPage } from './modules/people-workforce/TimesheetManagement';
import { CostCategoryPage } from './modules/people-workforce/CostCategory';
import { LeaveManagementPage } from './modules/people-workforce/LeaveManagement';
import { PolicyPage as OperationsPolicyPage } from './modules/operations/Policy';
import { SuppliersPage } from './modules/operations/Suppliers';
import { PropertiesPage } from './modules/operations/Properties';
import { WorkHealthSafetyPage } from './modules/whs-policies/WorkHealthSafety';
import { PolicyPage as WhsPolicyPage } from './modules/whs-policies/Policy';
import { AssetRegisterPage } from './modules/asset-management/AssetRegister';
import { ReportPage } from './modules/asset-management/Report';
import { DrivePage } from './modules/media-library/Drive';
import { DocumentsPage } from './modules/media-library/Documents';
import { NoticeBoardPage } from './modules/information/NoticeBoard';
import { CalenderPage } from './modules/information/Calender';
import { EventPage } from './modules/information/Event';
import { FAQPage } from './modules/information/FAQ';

const pageComponents = {
  'dashboard/Dashboard': DashboardPage,
  'participant-support/Clients': ClientsPage,
  'participant-support/Funding': FundingPage,
  'participant-support/IrregularSupport': IrregularSupportPage,
  'participant-support/IncidentAccident': IncidentAccidentPage,
  'participant-support/FeedbackComplaints': FeedbackComplaintsPage,
  'people-workforce/Staff': StaffPage,
  'people-workforce/Rosters': RostersPage,
  'people-workforce/TrainingDevelopment': TrainingDevelopmentPage,
  'people-workforce/TimesheetManagement': TimesheetManagementPage,
  'people-workforce/CostCategory': CostCategoryPage,
  'people-workforce/LeaveManagement': LeaveManagementPage,
  'operations/Policy': OperationsPolicyPage,
  'operations/Suppliers': SuppliersPage,
  'operations/Properties': PropertiesPage,
  'whs-policies/WorkHealthSafety': WorkHealthSafetyPage,
  'whs-policies/Policy': WhsPolicyPage,
  'asset-management/AssetRegister': AssetRegisterPage,
  'asset-management/Report': ReportPage,
  'media-library/Drive': DrivePage,
  'media-library/Documents': DocumentsPage,
  'information/NoticeBoard': NoticeBoardPage,
  'information/Calender': CalenderPage,
  'information/Event': EventPage,
  'information/FAQ': FAQPage
} as const;

type LoadedState = {
  data: DummyApiResponse;
  activePath: string;
};

function normalizePath(pathname: string, validPaths: string[], defaultPath: string) {
  if (pathname === '/') {
    return defaultPath;
  }

  return validPaths.includes(pathname) ? pathname : '';
}

function App() {
  const [loadedState, setLoadedState] = useState<LoadedState | null>(null);

  useEffect(() => {
    fetchDummyApiResponse().then((data) => {
      const allPaths = data.sidebarModules.flatMap((module) => module.menus.map((menu) => menu.path));
      const defaultPath = '/dashboard';
      const normalizedPath = normalizePath(window.location.pathname, allPaths, defaultPath);

      if (normalizedPath && window.location.pathname !== normalizedPath) {
        window.history.replaceState({}, '', normalizedPath);
      }

      setLoadedState({ data, activePath: normalizedPath || window.location.pathname });
    });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setLoadedState((prev) => {
        if (!prev) {
          return prev;
        }

        const allPaths = prev.data.sidebarModules.flatMap((module) => module.menus.map((menu) => menu.path));
        const normalizedPath = normalizePath(window.location.pathname, allPaths, '/dashboard');
        return {
          ...prev,
          activePath: normalizedPath || window.location.pathname
        };
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const activeMenu = useMemo<MenuItem | undefined>(() => {
    if (!loadedState) {
      return undefined;
    }

    return loadedState.data.sidebarModules
      .flatMap((module) => module.menus)
      .find((menu) => menu.path === loadedState.activePath);
  }, [loadedState]);

  const openMenu = (path: string) => {
    setLoadedState((prev) => {
      if (!prev || prev.activePath === path) {
        return prev;
      }

      window.history.pushState({}, '', path);
      return { ...prev, activePath: path };
    });
  };

  if (!loadedState) {
    return <div className="loading-shell">Loading menu configuration...</div>;
  }

  const CurrentPage = activeMenu ? pageComponents[activeMenu.componentKey as keyof typeof pageComponents] : undefined;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Caremetrix</h2>
        {loadedState.data.sidebarModules.map((module) => (
          <div key={module.id} className="sidebar-module">
            <h3>{module.label}</h3>
            <ul>
              {module.menus.map((menu) => (
                <li key={menu.id}>
                  <a
                    className={menu.path === loadedState.activePath ? 'active' : ''}
                    href={menu.path}
                    onClick={(event) => {
                      event.preventDefault();
                      openMenu(menu.path);
                    }}
                  >
                    {menu.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <main className="main-content">
        {CurrentPage && activeMenu ? (
          <CurrentPage
            title={activeMenu.label}
            description={activeMenu.description}
            content={loadedState.data.pageContentByPath[activeMenu.path]}
          />
        ) : (
          <div className="page-card">
            <h1>Page not found</h1>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
