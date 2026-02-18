import { MenuPageTemplate } from '../../components/MenuPageTemplate';
import type { PageContent } from '../../dummyApiResponse';

type IrregularSupportPageProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function IrregularSupportPage({ title, description, content }: IrregularSupportPageProps) {
  return <MenuPageTemplate title={title} description={description} content={content} />;
}
