import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type StaffPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function StaffPage({ title, description, content }: StaffPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
