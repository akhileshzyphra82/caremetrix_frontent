import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type FeedbackComplaintsPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function FeedbackComplaintsPage({ title, description, content }: FeedbackComplaintsPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
