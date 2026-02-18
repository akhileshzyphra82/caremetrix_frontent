import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type NoticeBoardPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function NoticeBoardPage({ title, description, content }: NoticeBoardPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
