import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type AssetRegisterPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function AssetRegisterPage({ title, description, content }: AssetRegisterPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
