import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type TrainingDevelopmentPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function TrainingDevelopmentPage({ title, description, content }: TrainingDevelopmentPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
