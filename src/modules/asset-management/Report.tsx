import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type ReportPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function ReportPage({ title, description, content }: ReportPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
