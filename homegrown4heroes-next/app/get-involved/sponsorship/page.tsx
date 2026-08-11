import Image from "next/image";
import Link from "next/link";

export default function SponsorshipPage() {
  return <>
    <section className="inner-hero sponsor-hero"><div className="shell inner-hero-grid"><div><span className="eyebrow">Get involved</span><h1>Become a Homegrown4Heroes sponsor.</h1><p className="lead">Support the Homegrown4Heroes mission and help the organization continue serving veterans through education, programs, and community.</p><div className="actions"><Link className="button" href="/contact">Contact Us</Link></div></div><Image src="/media/untitled.webp" alt="Homegrown4Heroes sponsorship artwork" width={700} height={700} /></div></section>
    <section className="section"><div className="shell split"><div><span className="eyebrow">Why sponsor?</span><h2>Stand behind veterans and the Homegrown4Heroes mission.</h2></div><div className="mission-copy"><p>Sponsors help strengthen Homegrown4Heroes programs, education, outreach, and veteran-centered community.</p><p>Contact the organization to learn about sponsorship opportunities and current needs.</p></div></div></section>
    <section className="section section-dark sponsorship-contribute"><div className="shell"><div className="section-heading"><span className="eyebrow">Ways to contribute</span><h2>Support can take many forms.</h2></div><div className="card-grid sponsorship-card-grid"><article className="card"><h3>Program support</h3><p>Support Homegrown4Heroes programs and mission delivery.</p></article><article className="card"><h3>In-kind support</h3><p>Contribute products, professional services, venues, or useful resources.</p></article><article className="card"><h3>Community advocacy</h3><p>Share the mission and help connect Homegrown4Heroes with new supporters.</p></article></div></div></section>
    <section className="section"><div className="shell callout callout-earth"><div><span className="eyebrow">Start a conversation</span><h2>Interested in becoming a sponsor?</h2></div><Link className="button" href="/contact">Contact Homegrown4Heroes</Link></div></section>
  </>;
}
