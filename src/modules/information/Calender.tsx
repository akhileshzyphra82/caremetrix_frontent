import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type CalenderPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function CalenderPage({ title, description, content }: CalenderPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
