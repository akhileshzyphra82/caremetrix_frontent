import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type TimesheetManagementPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function TimesheetManagementPage({ title, description, content }: TimesheetManagementPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
