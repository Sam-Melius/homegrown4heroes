"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const programLinks = [
  ["Healing Heroes", "/programs/healing-heroes"],
  ["Medical Card", "/programs/medical-card"],
  ["Planting for Patriots", "/programs/planting-for-patriots"],
  ["Coloring Pages", "/programs/coloring-pages"],
];

const involvedLinks = [
  ["Sponsorship", "/get-involved/sponsorship"],
  ["2026 Endorsements", "/get-involved/2026-endorsements"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<"programs" | "involved" | null>(null);
  const close = () => { setOpen(false); setDropdown(null); };

  return (
    <header className="site-header">
      <div className="shell nav-wrap">
        <Link href="/" className="brand" aria-label="Homegrown4Heroes home" onClick={close}>
          <Image src="/homegrown4heroes-logo.png" alt="" width={76} height={76} priority />
          <span className="brand-copy"><strong>Homegrown</strong><small>4 Heroes</small></span>
        </Link>

        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
          <span /><span /><span /><span className="sr-only">Toggle navigation</span>
        </button>

        <nav id="primary-navigation" className={open ? "nav-open" : ""} aria-label="Primary navigation">
          <Link href="/about" onClick={close}>About</Link>

          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-toggle" aria-expanded={dropdown === "programs"} onClick={() => setDropdown(dropdown === "programs" ? null : "programs")}>
              Programs <span aria-hidden="true">⌄</span>
            </button>
            <div className={dropdown === "programs" ? "nav-dropdown-menu nav-dropdown-menu-open" : "nav-dropdown-menu"}>
              <Link href="/programs" onClick={close}>All Programs</Link>
              {programLinks.map(([label, href]) => <Link key={href} href={href} onClick={close}>{label}</Link>)}
            </div>
          </div>

          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-toggle" aria-expanded={dropdown === "involved"} onClick={() => setDropdown(dropdown === "involved" ? null : "involved")}>
              Get Involved <span aria-hidden="true">⌄</span>
            </button>
            <div className={dropdown === "involved" ? "nav-dropdown-menu nav-dropdown-menu-open" : "nav-dropdown-menu"}>
              {involvedLinks.map(([label, href]) => <Link key={href} href={href} onClick={close}>{label}</Link>)}
            </div>
          </div>

          <Link href="/partners" onClick={close}>Partners</Link>
          <Link href="/the-happy-veteran" onClick={close}>The Happy Veteran</Link>
          <Link href="/shop" onClick={close}>Shop</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
