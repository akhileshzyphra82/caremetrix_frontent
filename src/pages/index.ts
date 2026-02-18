import type { PageData } from '../types/navigation';
import p0 from './dashboard/dashboard';
import p1 from './participant-support/clients';
import p2 from './participant-support/funding';
import p3 from './participant-support/irregular-support';
import p4 from './participant-support/incident-accident';
import p5 from './participant-support/feedback-complaints';
import p6 from './people-workforce/staff';
import p7 from './people-workforce/rosters';
import p8 from './people-workforce/training-development';
import p9 from './people-workforce/timesheet-management';
import p10 from './people-workforce/cost-category';
import p11 from './people-workforce/leave-management';
import p12 from './operations/policy';
import p13 from './operations/suppliers';
import p14 from './operations/properties';
import p15 from './whs-policies/work-health-safety';
import p16 from './whs-policies/policy';
import p17 from './asset-management/asset-register';
import p18 from './asset-management/report';
import p19 from './media-library/drive';
import p20 from './media-library/documents';
import p21 from './information/notice-board';
import p22 from './information/calendar';
import p23 from './information/event';
import p24 from './information/faq';

export const pageRegistry: Record<string, PageData> = {
  '/dashboard': p0,
  '/participant-support/clients': p1,
  '/participant-support/funding': p2,
  '/participant-support/irregular-support': p3,
  '/participant-support/incident-accident': p4,
  '/participant-support/feedback-complaints': p5,
  '/people-workforce/staff': p6,
  '/people-workforce/rosters': p7,
  '/people-workforce/training-development': p8,
  '/people-workforce/timesheet-management': p9,
  '/people-workforce/cost-category': p10,
  '/people-workforce/leave-management': p11,
  '/operations/policy': p12,
  '/operations/suppliers': p13,
  '/operations/properties': p14,
  '/whs-policies/work-health-safety': p15,
  '/whs-policies/policy': p16,
  '/asset-management/asset-register': p17,
  '/asset-management/report': p18,
  '/media-library/drive': p19,
  '/media-library/documents': p20,
  '/information/notice-board': p21,
  '/information/calendar': p22,
  '/information/event': p23,
  '/information/faq': p24,
};
