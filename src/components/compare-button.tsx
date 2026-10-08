"use client";

import { Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { COMPARISON_EVENT, MAX_COMPARISON_ITEMS, readComparison, toggleComparison, type ComparisonSelection } from "@/lib/comparison-storage";

export function CompareButton({ provider, compact = false }: { provider: ComparisonSelection; compact?: boolean }) {
  const [selected, setSelected] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function sync() {
      setSelected(readComparison().some((item) => item.id === provider.id));
    }
    sync();
    window.addEventListener(COMPARISON_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(COMPARISON_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [provider.id]);

  function toggle() {
    const result = toggleComparison(provider);
    setSelected(result.items.some((item) => item.id === provider.id));
    setMessage(result.limitReached ? `You can compare up to ${MAX_COMPARISON_ITEMS} listings.` : "");
  }

  return (
    <span className={`compare-control${compact ? " is-compact" : ""}`}>
      <button className={compact ? "card-action" : "button button-secondary"} type="button" aria-pressed={selected} onClick={toggle}>
        <Scale size={compact ? 15 : 17} /> {selected ? "Added to compare" : "Compare"}
      </button>
      {message && <span className="compare-message" role="status">{message}</span>}
    </span>
  );
}
