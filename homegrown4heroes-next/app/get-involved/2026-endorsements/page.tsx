import Image from "next/image";
import Link from "next/link";

const logos = [
  "/endorsers/0003-blazysusan.webp",
  "/endorsers/cmz5sgpv8nymkuq1lzpg.webp",
  "/endorsers/cultigen-seed-co-high-resolution-logo-black-transparent.webp",
  "/endorsers/dime-industries-logo-2-0.webp",
  "/endorsers/emerald-1200x1200.webp",
  "/endorsers/emerald-cup.webp",
  "/endorsers/footer-logo.svg",
  "/endorsers/growdepot.webp",
  "/endorsers/growers-choice.webp",
  "/endorsers/hydrodynamics-international.webp",
  "/endorsers/images.webp",
  "/endorsers/imagesrx.webp",
  "/endorsers/king-palm-logo-with-trademark-gold.webp",
  "/endorsers/logo-yellow-on-transparent-4.webp",
  "/endorsers/logo.webp",
  "/endorsers/lost-coast.webp",
  "/endorsers/mvb.webp",
  "/endorsers/psilly-rabbit-1.webp",
  "/endorsers/royalgold-rootedlogo-222.webp",
  "/endorsers/seed-exchange.webp",
  "/endorsers/vof-logo-rgb-stacked.webp"
];

export default function EndorsementsPage() {
  return <>
    <section className="inner-hero inner-hero-short"><div className="shell"><span className="eyebrow">Get involved</span><h1>2026 Endorsements</h1><p className="lead">Organizations and brands standing behind the work of Homegrown4Heroes and its mission to support veterans.</p></div></section>
    <section className="section logo-showcase-section"><div className="shell"><div className="section-heading"><span className="eyebrow">Our endorsers</span><h2>Backed by a broad community of support.</h2></div><div className="endorser-grid">{logos.map((src, index) => <article className="endorser-card" key={src}><Image src={src} alt={`2026 endorser logo ${index + 1}`} width={420} height={240} /></article>)}</div></div></section>
    <section className="section section-soft"><div className="shell callout callout-earth"><div><span className="eyebrow">Add your support</span><h2>Interested in becoming a sponsor or endorser?</h2></div><Link className="button" href="/get-involved/sponsorship">Get Involved</Link></div></section>
  </>;
}
