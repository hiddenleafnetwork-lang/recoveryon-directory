import Link from "next/link";

export default function NotFound() {
  return <section className="page-hero not-found"><div className="shell"><span className="kicker plain">404</span><h1>We couldn’t find that page.</h1><p>The link may have changed, or the listing may not be published.</p><div className="inline-actions"><Link className="button" href="/">Return home</Link><Link className="button button-secondary" href="/directory">Search the directory</Link></div></div></section>;
}
