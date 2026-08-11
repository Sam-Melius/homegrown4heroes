import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <section className="about-photo-hero">
        <Image
          className="about-photo-hero-image"
          src="/media/soldier-pic.webp"
          alt="Veteran seated in a sunlit garden"
          fill
          priority
          sizes="100vw"
        />
        <div className="about-photo-hero-overlay" />
        <div className="shell about-photo-hero-content">
          <span className="eyebrow">About Homegrown4Heroes</span>
          <h1>Healing heroes. Cultivating change.</h1>
          <p className="lead">Homegrown4Heroes is a 501(c)(3) nonprofit supporting veterans through accessible plant-based wellness, education, practical resources, and community.</p>
        </div>
      </section>

      <section className="section">
        <div className="shell prose-grid">
          <article><span className="number-stamp">01</span><h2>Our mission</h2><p>Homegrown4Heroes is dedicated to supporting veterans through accessible plant-based therapy and education. The organization helps veterans explore holistic approaches including herbalism, aromatherapy, gardening, and practical resources that can be incorporated into daily life.</p><p>The goal is to make these resources available to eligible veterans regardless of financial limitations while creating a community where veterans can heal, learn, and grow.</p></article>
          <article><span className="number-stamp">02</span><h2>Our vision</h2><p>To create a future where veterans can thrive through plant-based wellness, resilience, education, and community support—giving those who served more tools to cultivate personal growth and fulfilling lives after service.</p></article>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <div className="section-heading"><span className="eyebrow">Organization</span><h2>Built to serve veterans.</h2></div>
          <div className="info-strip">
            <div><strong>501(c)(3)</strong><span>Nonprofit organization</span></div>
            <div><strong>99-0783233</strong><span>Federal EIN</span></div>
            <div><strong>Richmond, VA</strong><span>Founded in Richmond · Serving veterans nationwide</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell callout callout-earth">
          <div><span className="eyebrow">Connect with us</span><h2>Want to learn more about Homegrown4Heroes?</h2><p>Explore the programs or schedule a new-member consultation.</p></div>
          <div className="actions"><a className="button" href="/programs">Explore Programs</a><a className="button button-ghost" href="https://calendly.com/homegrown4heroes/new-member-consult" target="_blank" rel="noreferrer">Schedule a Consult</a></div>
        </div>
      </section>
    </>
  );
}
