import { ImageResponse } from "next/og";

export const alt = "TreatmentLane: Find a clearer path to care";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 84, background: "linear-gradient(145deg, #f8fbfc, #e5f6f1)", color: "#102a43" }}><div style={{ display: "flex", color: "#247f86", fontSize: 34, fontWeight: 800, marginBottom: 45 }}>TreatmentLane</div><div style={{ display: "flex", maxWidth: 950, fontSize: 72, lineHeight: 1.05, fontWeight: 800, letterSpacing: -3 }}>A clearer path to treatment information.</div><div style={{ display: "flex", marginTop: 28, fontSize: 26, color: "#486581" }}>Transparent listings. Practical guidance. No paid verification.</div></div>, size);
}
