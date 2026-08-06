export default function ContactPage() {
  return (
    <>
      <section className="inner-hero inner-hero-short">
        <div className="shell">
          <span className="eyebrow">Contact</span>
          <h1>Let&apos;s connect.</h1>
          <p className="lead">
            Questions about programs, partnerships, volunteering, sponsorship, or membership?
            Reach out to Homegrown4Heroes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell contact-grid">
          <div className="contact-details">
            <h2>Start with a conversation.</h2>
            <p>Prospective members can schedule a new-member consultation directly through Calendly.</p>
            <a
              className="button"
              href="https://calendly.com/homegrown4heroes/new-member-consult"
              target="_blank"
              rel="noreferrer"
            >
              New Member Consult
            </a>
          </div>

          <div className="contact-form contact-email-card">
            <span className="eyebrow">General inquiries</span>
            <h2>Email Homegrown4Heroes</h2>
            <p>Send questions, partnership inquiries, or other website messages to:</p>
            <a className="contact-email-link" href="mailto:hello@homegrown4heroes.org">
              hello@homegrown4heroes.org
            </a>
            <a className="button button-full" href="mailto:hello@homegrown4heroes.org">
              Send an Email
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
