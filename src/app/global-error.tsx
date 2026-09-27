"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><main style={{ maxWidth: 720, margin: "80px auto", padding: 24, fontFamily: "system-ui" }}><h1>Something went wrong.</h1><p>Please try again. If the problem continues, email hello@treatmentlane.com.</p><button onClick={() => reset()} style={{ padding: "12px 18px", border: 0, borderRadius: 8, background: "#247f86", color: "white", fontWeight: 700 }}>Try again</button></main></body></html>;
}
