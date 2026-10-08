"use client";

import { useEffect, useRef, useState } from "react";
import { Map, MapPin, X } from "lucide-react";
import { loadGoogleMapsLibrary } from "@/lib/google-maps-loader";

export type DirectoryMapProvider = {
  id: string;
  name: string;
  city: string;
  state: string;
  href: string;
  latitude: number;
  longitude: number;
};

function infoWindowContent(provider: DirectoryMapProvider) {
  const content = document.createElement("div");
  content.className = "map-info-window";

  const location = document.createElement("span");
  location.textContent = `${provider.city}, ${provider.state}`;
  content.append(location);

  const name = document.createElement("strong");
  name.textContent = provider.name;
  content.append(name);

  const link = document.createElement("a");
  link.href = provider.href;
  link.textContent = "View listing";
  content.append(link);

  return content;
}

export function DirectoryMap({ providers, resultCount }: { providers: DirectoryMapProvider[]; resultCount: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    if (!open || !mapRef.current) return;

    let cancelled = false;
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    setStatus("loading");

    async function initialize() {
      try {
        const [{ Map: GoogleMap, InfoWindow }, { AdvancedMarkerElement, PinElement }] = await Promise.all([
          loadGoogleMapsLibrary("maps"),
          loadGoogleMapsLibrary("marker"),
        ]);
        if (cancelled || !mapRef.current) return;

        const map = new GoogleMap(mapRef.current, {
          center: { lat: 39.5, lng: -98.35 },
          zoom: 4,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "cooperative",
        });
        const bounds = new google.maps.LatLngBounds();
        const infoWindow = new InfoWindow();

        providers.forEach((provider) => {
          const position = { lat: provider.latitude, lng: provider.longitude };
          const pin = new PinElement({
            background: "#247f86",
            borderColor: "#17666d",
            glyphColor: "#ffffff",
          });
          const marker = new AdvancedMarkerElement({
            map,
            position,
            title: `${provider.name}, ${provider.city}, ${provider.state}`,
            content: pin,
            gmpClickable: true,
          });
          marker.addEventListener("gmp-click", () => {
            infoWindow.setContent(infoWindowContent(provider));
            infoWindow.open({ map, anchor: marker });
          });
          markers.push(marker);
          bounds.extend(position);
        });

        if (providers.length === 1) {
          map.setCenter({ lat: providers[0].latitude, lng: providers[0].longitude });
          map.setZoom(11);
        } else if (providers.length > 1) {
          map.fitBounds(bounds, 42);
          google.maps.event.addListenerOnce(map, "idle", () => {
            if ((map.getZoom() || 0) > 11) map.setZoom(11);
          });
        }

        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void initialize();
    return () => {
      cancelled = true;
      markers.forEach((marker) => { marker.map = null; });
    };
  }, [open, providers]);

  if (!providers.length) return null;

  return (
    <section className={`directory-map-card${open ? " is-open" : ""}`} aria-label="Map of directory results">
      <div className="directory-map-summary">
        <div>
          <span className="eyebrow"><MapPin size={15} /> Map view</span>
          <h2>See these listings by location</h2>
          <p>{providers.length.toLocaleString()} of {resultCount.toLocaleString()} results on this page have map coordinates.</p>
        </div>
        <button className="button button-secondary button-small" type="button" onClick={() => setOpen((current) => !current)}>
          {open ? <><X size={17} /> Hide map</> : <><Map size={17} /> Show map</>}
        </button>
      </div>
      {open && (
        <div className="directory-map-wrap">
          <div ref={mapRef} className="directory-map-canvas" aria-label="Google Map showing directory results" />
          {status === "loading" && <div className="directory-map-status" role="status">Loading map...</div>}
          {status === "error" && <div className="directory-map-status directory-map-error" role="alert">The map could not load. You can still use the listing results below.</div>}
        </div>
      )}
    </section>
  );
}
