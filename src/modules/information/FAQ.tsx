import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type FAQPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function FAQPage({ title, description, content }: FAQPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
