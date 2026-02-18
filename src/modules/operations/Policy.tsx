import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type PolicyPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function PolicyPage({ title, description, content }: PolicyPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
