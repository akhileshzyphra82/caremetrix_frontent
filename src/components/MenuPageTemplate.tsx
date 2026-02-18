import type { PageContent } from '../dummyApiResponse';

type MenuPageTemplateProps = {
  title: string;
  description: string;
  content?: PageContent;
};

export function MenuPageTemplate({ title, description, content }: MenuPageTemplateProps) {
  return (
    <section className="page-card">
      <header>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {content && (
        <>
          <div className="stats-grid">
            {content.stats.map((stat) => (
              <article key={stat.label} className="stat-item">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>

          <div className="activity-card">
            <h2>Latest updates</h2>
            <ul>
              {content.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
