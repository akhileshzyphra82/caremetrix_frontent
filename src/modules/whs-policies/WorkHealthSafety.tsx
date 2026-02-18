import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type WorkHealthSafetyPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function WorkHealthSafetyPage({ title, description, content }: WorkHealthSafetyPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
