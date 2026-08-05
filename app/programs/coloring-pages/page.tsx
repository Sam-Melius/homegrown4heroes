import Image from "next/image";

const coloringPages = [
  { title: "Veterans Day", preview: "/coloring-pages/veterans-day.webp", download: "/downloads/coloring-pages/veterans-day.jpg" },
  { title: "Veterans Day, Memorial Day & Homecoming", preview: "/coloring-pages/veterans-day-memorial-day-homecoming.webp", download: "/downloads/coloring-pages/veterans-day-memorial-day-homecoming.jpg" },
  { title: "Military Appreciation", preview: "/coloring-pages/military-appreciation.webp", download: "/downloads/coloring-pages/military-appreciation.jpg" },
  { title: "You Are Our Hero", preview: "/coloring-pages/you-are-our-hero.webp", download: "/downloads/coloring-pages/you-are-our-hero.jpg" }
];

export default function ColoringPagesPage() {
  return (
    <>
      <section className="inner-hero inner-hero-short">
        <div className="shell">
          <span className="eyebrow">Free downloads</span>
          <h1>Coloring Pages</h1>
          <p className="lead">Download veteran-themed coloring activities from Homegrown4Heroes.</p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="coloring-download-grid">
            {coloringPages.map((page) => (
              <article className="coloring-download-card" key={page.download}>
                <div className="coloring-preview">
                  <Image src={page.preview} alt={page.title} width={900} height={1200} />
                </div>
                <div className="coloring-download-content">
                  <h2>{page.title}</h2>
                  <a className="button button-full" href={page.download} download>Download Coloring Page</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
