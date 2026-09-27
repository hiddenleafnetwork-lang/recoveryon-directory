"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";

const links = [
  { href: "/directory", label: "Find care" },
  { href: "/care", label: "Types of care" },
  { href: "/locations", label: "Locations" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" aria-label="TreatmentLane home" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>
        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={`main-nav${open ? " is-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link className="button button-small" href="/providers/apply" onClick={() => setOpen(false)}>List your organization</Link>
        </nav>
      </div>
    </header>
  );
}
