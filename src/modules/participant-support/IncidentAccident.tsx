import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type IncidentAccidentPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function IncidentAccidentPage({ title, description, content }: IncidentAccidentPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
