import Link from "next/link";

export default function MedicalCardPage() {
  return <>
    <section className="inner-hero inner-hero-short"><div className="shell"><span className="eyebrow">Veteran resource</span><h1>Medical Card</h1><p className="lead">Information and support for veterans interested in learning about the medical cannabis card process.</p></div></section>
    <section className="section"><div className="shell split"><article><span className="eyebrow">Community resource</span><h2>Connect with Homegrown4Heroes.</h2><p>Homegrown4Heroes can provide current information about its medical-card resources and available next steps.</p><p>Contact the organization directly with questions about this program.</p></article><aside className="card"><span className="eyebrow">Learn more</span><h3>Have questions?</h3><p>Reach out to Homegrown4Heroes for current program information.</p><Link className="button button-full" href="/contact">Contact Us</Link></aside></div></section>
  </>;
}
