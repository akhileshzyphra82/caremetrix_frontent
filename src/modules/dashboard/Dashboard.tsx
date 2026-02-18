import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type DashboardPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function DashboardPage({ title, description, content }: DashboardPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
