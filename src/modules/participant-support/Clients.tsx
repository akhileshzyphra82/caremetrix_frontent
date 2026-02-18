import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type ClientsPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function ClientsPage({ title, description, content }: ClientsPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
