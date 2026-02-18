import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type SuppliersPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function SuppliersPage({ title, description, content }: SuppliersPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
