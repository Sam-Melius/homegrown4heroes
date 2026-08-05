import Image from "next/image";

const partnerLogos = [
  "/partners/11-senses-rv-2-1-01-edited.webp",
  "/partners/bounds-and-bounds.webp",
  "/partners/budtrainer.webp",
  "/partners/joint-4ces.webp",
  "/partners/lost-coast-plant-therapy-logo-white.webp",
  "/partners/questionpro-logo-nw.svg"
];

export default function PartnersPage() {
  return (
    <>
      <section className="inner-hero inner-hero-short"><div className="shell"><span className="eyebrow">Partners</span><h1>Organizations growing alongside us.</h1><p className="lead">These partners contribute resources, expertise, products, research, and support that help Homegrown4Heroes serve the veteran community.</p></div></section>
      <section className="section logo-showcase-section"><div className="shell">
        <div className="section-heading"><span className="eyebrow">Community partners</span><h2>Stronger through collaboration.</h2></div>
        <div className="real-logo-grid">{partnerLogos.map((src, index) => <article className="real-logo-card" key={src}><Image src={src} alt={`Homegrown4Heroes partner logo ${index + 1}`} width={460} height={260} /></article>)}</div>
      </div></section>
      <section className="section section-soft"><div className="shell callout callout-earth"><div><span className="eyebrow">Partner with us</span><h2>Interested in supporting the mission?</h2></div><a className="button" href="/get-involved/sponsorship">Sponsorship Information</a></div></section>
    </>
  );
}
