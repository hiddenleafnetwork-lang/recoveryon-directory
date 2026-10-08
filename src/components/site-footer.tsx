import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Link href="/" aria-label="TreatmentLane home"><BrandMark light /></Link>
          <p>A transparent directory for finding and comparing addiction treatment and recovery resources.</p>
          <p className="footer-note">TreatmentLane is an informational directory, not a treatment provider or emergency service.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/directory">Find care</Link>
          <Link href="/find-options">Guided finder</Link>
          <Link href="/care">Types of care</Link>
          <Link href="/locations">Browse locations</Link>
          <Link href="/insurance">Insurance and payment</Link>
          <Link href="/guides">Guides</Link>
        </div>
        <div>
          <h2>Trust</h2>
          <Link href="/how-we-verify">How we verify</Link>
          <Link href="/corrections">Request a correction</Link>
          <Link href="/about">About us</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <h2>Important</h2>
          <Link href="/emergency-help">Emergency help</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/providers/apply">List your organization</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} TreatmentLane</span>
        <span>Information should be confirmed directly with providers.</span>
      </div>
    </footer>
  );
}
