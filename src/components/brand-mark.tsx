import { Waypoints } from "lucide-react";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand-mark${light ? " brand-mark-light" : ""}`}>
      <span className="brand-icon" aria-hidden="true"><Waypoints size={22} strokeWidth={2.4} /></span>
      <span>Treatment<span>Lane</span></span>
    </span>
  );
}
