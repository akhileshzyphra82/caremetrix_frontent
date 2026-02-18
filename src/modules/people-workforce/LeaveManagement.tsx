import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type LeaveManagementPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function LeaveManagementPage({ title, description, content }: LeaveManagementPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
