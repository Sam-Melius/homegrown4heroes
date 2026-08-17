import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/homegrown4heroes-logo.png" alt="Homegrown 4 Heroes" width={150} height={150} />
          <p>Helping veterans heal, grow, and build community through accessible plant-based wellness education.</p>
        </div>
        <div className="footer-candid">
          <Image
            src="/2026_candid.png"
            alt="Candid Platinum Transparency 2026"
            width={190}
            height={190}
          />
        </div>
        <div><h3>Explore</h3><Link href="/about">About</Link><Link href="/programs">Programs</Link><Link href="/partners">Partners</Link><Link href="/the-happy-veteran">The Happy Veteran</Link></div>
        <div><h3>Get Involved</h3><Link href="/get-involved/sponsorship">Sponsorship</Link><Link href="/get-involved/2026-endorsements">2026 Endorsements</Link><a href="https://calendly.com/homegrown4heroes/new-member-consult" target="_blank" rel="noreferrer">Schedule a consult</a><a href="mailto:hello@homegrown4heroes.org">hello@homegrown4heroes.org</a>
        <a
          href="https://www.safeaccessnow.org/states#gsc.tab=0"
          target="_blank"
          rel="noopener noreferrer"
        >
          Laws In My State
        </a></div>
      </div>
      <div className="shell footer-bottom">© 2026 Homegrown4Heroes · 501(c)(3)</div>
    </footer>
  );
}
