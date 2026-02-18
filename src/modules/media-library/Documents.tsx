import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type DocumentsPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function DocumentsPage({ title, description, content }: DocumentsPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
