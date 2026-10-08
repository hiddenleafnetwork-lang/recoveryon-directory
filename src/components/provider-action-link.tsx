"use client";

import type { ReactNode } from "react";

type EventType = "call" | "email" | "website" | "directions" | "google-maps";

export function ProviderActionLink({ providerId, eventType, href, className, children, external = false }: {
  providerId: string; eventType: EventType; href: string; className?: string; children: ReactNode; external?: boolean;
}) {
  function track() {
    const body = JSON.stringify({ providerId, eventType });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/provider-interactions", new Blob([body], { type: "application/json" }));
    else void fetch("/api/provider-interactions", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
  }
  return <a className={className} href={href} onClick={track} rel={external ? "noopener noreferrer nofollow" : undefined} target={external ? "_blank" : undefined}>{children}</a>;
}
