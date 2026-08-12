import Link from "next/link";

export default function HappyVeteranPage() {
  return (
    <div className="thv-theme">
      <section className="happy-hero">
        <div className="shell happy-hero-grid">
          <div>
            <span className="eyebrow thv-tagline">Lynchburg’s favorite living room</span>
            <h1>The Happy Veteran</h1>
            <p className="lead">
              A welcoming social club where veterans and their supporters can connect, unwind, participate, and access community resources.
            </p>
            <div className="actions">
              <Link className="button" href="/the-happy-veteran/login">Member Login</Link>
              <Link className="button button-membership" href="/the-happy-veteran/signup">Request Membership</Link>
            </div>
          </div>
          <div className="happy-mark botanical-badge">
            <span>THV</span>
            <small>Lynchburg’s favorite living room</small>
          </div>
        </div>
      </section>

      <div className="thv-tagline-strip">THV — Lynchburg&apos;s favorite living room</div>

      <section className="section thv-lounge-section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">The member lounge</span>
            <h2>A comfortable place to connect, unwind, and belong.</h2>
            <p className="lead">
              Approved members receive access to the lounge, community updates, and
              member-only resources.
            </p>
          </div>

          <div className="card-grid">
            <article className="card">
              <span className="card-number">01</span>
              <h3>Connect</h3>
              <p>Participate in a welcoming space with approved members and supporters.</p>
            </article>
            <article className="card">
              <span className="card-number">02</span>
              <h3>Stay informed</h3>
              <p>View member-only information and updates inside the lounge.</p>
            </article>
            <article className="card">
              <span className="card-number">03</span>
              <h3>Access resources</h3>
              <p>Use the private tools and resources available to approved members.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-dark thv-approval-section">
        <div className="shell split">
          <div>
            <span className="eyebrow">Membership approval</span>
            <h2>Access is reviewed personally.</h2>
            <p className="lead">
              The Happy Veteran team compares the information provided during signup
              with your membership application before granting access to the member lounge.
            </p>
          </div>
          <div className="approval-flow">
            <div><strong>1</strong><span>Create an account</span></div>
            <div><strong>2</strong><span>Provide membership details</span></div>
            <div><strong>3</strong><span>Application review</span></div>
            <div><strong>4</strong><span>Enter the lounge</span></div>
          </div>
        </div>
      </section>

      <section className="section thv-consult-section">
        <div className="shell callout callout-earth">
          <div>
            <span className="eyebrow">New to The Happy Veteran?</span>
            <h2>Schedule a new-member consultation.</h2>
          </div>
          <a
            className="button"
            href="https://calendly.com/homegrown4heroes/new-member-consult"
            target="_blank"
            rel="noreferrer"
          >
            Schedule Consult
          </a>
        </div>
      </section>
    </div>
  );
}
