import Link from "next/link";

export default function PlantingForPatriotsPage() {
  return <>
    <section className="inner-hero inner-hero-short"><div className="shell"><span className="eyebrow">Grow for a cause</span><h1>Planting for Patriots</h1><p className="lead">A cultivation-focused initiative that brings growers and veteran support together.</p></div></section>
    <section className="section"><div className="shell"><div className="section-heading"><span className="eyebrow">How to get involved</span><h2>Cultivating change together.</h2></div><div className="steps-grid"><article className="card"><span className="card-number">01</span><h3>Connect</h3><p>Contact Homegrown4Heroes to learn more about participating in Planting for Patriots.</p></article><article className="card"><span className="card-number">02</span><h3>Grow</h3><p>Participants support the initiative through cultivation and shared involvement.</p></article><article className="card"><span className="card-number">03</span><h3>Support veterans</h3><p>The program brings growers together around the Homegrown4Heroes mission and veteran community.</p></article></div></div></section>
    <section className="section section-soft"><div className="shell narrow"><div className="signup-panel"><span className="eyebrow">Planting for Patriots</span><h2>Interested in participating?</h2><p>Contact Homegrown4Heroes for program details and signup information.</p><div className="actions"><Link className="button" href="/contact">Contact to Sign Up</Link></div></div></div></section>
  </>;
}
