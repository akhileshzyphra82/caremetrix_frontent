import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type EventPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function EventPage({ title, description, content }: EventPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
