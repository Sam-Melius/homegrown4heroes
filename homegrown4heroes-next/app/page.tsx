import Image from "next/image";
import Link from "next/link";

const programs = [
  { title: "Healing Heroes", text: "Plant-based wellness education, practical resources, and trusted support created for veterans.", href: "/programs/healing-heroes" },
  { title: "Planting for Patriots", text: "Hands-on growing initiatives that nurture confidence, purpose, awareness, and connection.", href: "/programs/planting-for-patriots" },
  { title: "The Happy Veteran", text: "A private, verified member space for daily updates, ordering, and community conversation.", href: "/the-happy-veteran" },
];

export default function HomePage() {
  return (
    <>
      <section className="photo-hero">
        <Image className="photo-hero-image" src="/media/main.webp" alt="Hands holding an orange heart outdoors" fill priority sizes="100vw" />
        <div className="photo-hero-overlay" />
        <div className="shell photo-hero-content">
          <span className="eyebrow">Veterans helping veterans</span>
          <h1>Rooted in healing.<br />Built for heroes.</h1>
          <p className="lead">Homegrown4Heroes supports veterans through plant-based wellness, education, cultivation, and a trusted community.</p>
          <div className="actions">
            <Link className="button" href="/programs">Explore Programs</Link>
            <a className="button button-light" href="https://calendly.com/homegrown4heroes/new-member-consult" target="_blank" rel="noreferrer">New Member Consult</a>
          </div>
        </div>
      </section>

      <section className="section mission-section">
        <div className="shell split">
          <div><span className="eyebrow">Our mission</span><h2>Accessible wellness, practical education, and real belonging.</h2></div>
          <div className="mission-copy">
            <p>We empower veterans through holistic approaches to healing, including herbalism, aromatherapy, gardening, and useful resources that can become part of everyday life.</p>
            <Link className="text-link" href="/about">Our story and mission <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell">
          <div className="section-heading"><span className="eyebrow">What we do</span><h2>Programs with purpose</h2></div>
          <div className="card-grid">
            {programs.map((program, index) => (
              <article className="card program-card" key={program.title}>
                <span className="card-number">0{index + 1}</span>
                <h3>{program.title}</h3><p>{program.text}</p>
                <Link href={program.href}>Learn more <span>→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section story-media-section">
        <div className="shell story-media-grid">
          <div className="story-video-wrap">
            <video controls playsInline preload="metadata" poster="/media/untitled.webp">
              <source src="/media/homegrown-story.mp4" type="video/mp4" />
            </video>
          </div>
          <div>
            <span className="eyebrow">The work in motion</span>
            <h2>Community is something we grow together.</h2>
            <p className="lead">Homegrown4Heroes brings veterans, supporters, growers, partners, and advocates together around education, healing, and shared purpose.</p>
            <div className="actions"><Link className="button" href="/get-involved/sponsorship">Become a Sponsor</Link><Link className="button button-ghost" href="/get-involved/2026-endorsements">View Endorsers</Link></div>
          </div>
        </div>
      </section>

      <section className="section community-preview">
        <div className="shell preview-grid">
          <div className="preview-panel">
            <span className="preview-tag">Private member space</span>
            <div className="channel-row"><span>#</span><div><strong>shares</strong><small>See today’s available shares</small></div></div>
            <div className="channel-row"><span>#</span><div><strong>community</strong><small>Connect with verified members</small></div></div>
            <div className="channel-row"><span>#</span><div><strong>announcements</strong><small>Updates from Homegrown4Heroes</small></div></div>
          </div>
          <div><span className="eyebrow">The Happy Veteran</span><h2>A smaller, safer community built around trust.</h2><p>Members create an account and provide their membership details. The Happy Veteran team compares that information with the membership application before granting access.</p><Link className="button" href="/the-happy-veteran">Explore The Happy Veteran</Link></div>
        </div>
      </section>

      <section className="section image-story-section">
        <div className="shell image-story-grid">
          <Image src="/media/img-4086.webp" alt="Homegrown4Heroes community imagery" width={1672} height={941} />
          <div><span className="eyebrow">Stand with our mission</span><h2>Help cultivate lasting change for veterans.</h2><p>Sponsors and endorsers help Homegrown4Heroes expand access to education, programs, supplies, and meaningful veteran-centered community.</p><Link className="text-link" href="/get-involved/sponsorship">Explore sponsorship →</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="shell callout"><div><span className="eyebrow">Get connected</span><h2>Interested in becoming a member?</h2><p>Schedule a new-member consultation and learn more about the community.</p></div><a className="button button-light" href="https://calendly.com/homegrown4heroes/new-member-consult" target="_blank" rel="noreferrer">Schedule a Consult</a></div>
      </section>
    </>
  );
}
