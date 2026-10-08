"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, X } from "lucide-react";
import { useEffect, useState } from "react";
import { COMPARISON_EVENT, MAX_COMPARISON_ITEMS, readComparison, writeComparison, type ComparisonSelection } from "@/lib/comparison-storage";

export function ComparisonTray() {
  const pathname = usePathname();
  const [items, setItems] = useState<ComparisonSelection[]>([]);

  useEffect(() => {
    function sync() { setItems(readComparison()); }
    sync();
    window.addEventListener(COMPARISON_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(COMPARISON_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!items.length || pathname === "/compare") return null;
  const compareHref = `/compare?ids=${encodeURIComponent(items.map((item) => item.id).join(","))}`;

  return (
    <aside className="comparison-tray" aria-label="Listings selected for comparison">
      <div className="comparison-tray-copy"><Scale size={18} /><strong>{items.length} of {MAX_COMPARISON_ITEMS} selected</strong></div>
      <div className="comparison-tray-items">
        {items.map((item) => <span key={item.id}>{item.name}<button type="button" aria-label={`Remove ${item.name} from comparison`} onClick={() => setItems(writeComparison(items.filter((current) => current.id !== item.id)))}><X size={14} /></button></span>)}
      </div>
      <Link className="button button-small" href={compareHref}>Compare now</Link>
    </aside>
  );
}
