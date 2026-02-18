import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type PropertiesPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function PropertiesPage({ title, description, content }: PropertiesPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
