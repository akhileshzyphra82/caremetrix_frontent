import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type CostCategoryPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function CostCategoryPage({ title, description, content }: CostCategoryPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
