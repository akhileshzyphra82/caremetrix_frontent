import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type RostersPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function RostersPage({ title, description, content }: RostersPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
