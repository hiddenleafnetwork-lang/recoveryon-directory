"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { loadGoogleMapsLibrary } from "@/lib/google-maps-loader";

type ProviderLocationMapProps = {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
};

export function ProviderLocationMap({ name, address, latitude, longitude }: ProviderLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let marker: google.maps.marker.AdvancedMarkerElement | null = null;

    async function initialize() {
      try {
        const [{ Map: GoogleMap, InfoWindow }, { AdvancedMarkerElement, PinElement }] = await Promise.all([
          loadGoogleMapsLibrary("maps"), loadGoogleMapsLibrary("marker"),
        ]);
        if (cancelled || !mapRef.current) return;

        let position: google.maps.LatLng | google.maps.LatLngLiteral;
        if (latitude !== null && longitude !== null) {
          position = { lat: latitude, lng: longitude };
        } else {
          const geocoder = new google.maps.Geocoder();
          const response = await geocoder.geocode({ address });
          if (!response.results[0]) throw new Error("Address could not be mapped");
          position = response.results[0].geometry.location;
        }

        const map = new GoogleMap(mapRef.current, {
          center: position, zoom: 15, mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
          mapTypeControl: false, streetViewControl: true, fullscreenControl: true,
          gestureHandling: "cooperative",
        });
        const pin = new PinElement({ background: "#247f86", borderColor: "#17666d", glyphColor: "#ffffff", scale: 1.12 });
        marker = new AdvancedMarkerElement({ map, position, title: `${name}, ${address}`, content: pin, gmpClickable: true });
        const info = document.createElement("div");
        info.className = "map-info-window";
        const label = document.createElement("span");
        label.textContent = "Treatment center location";
        const heading = document.createElement("strong");
        heading.textContent = name;
        const location = document.createElement("small");
        location.textContent = address;
        info.append(label, heading, location);
        const infoWindow = new InfoWindow({ content: info });
        marker.addEventListener("gmp-click", () => infoWindow.open({ map, anchor: marker || undefined }));
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void initialize();
    return () => {
      cancelled = true;
      if (marker) marker.map = null;
    };
  }, [address, latitude, longitude, name]);

  return <div className="provider-map-frame">
    <div ref={mapRef} className="provider-map-canvas" aria-label={`Google Map showing ${name}`} />
    {status === "loading" && <div className="provider-map-status" role="status">Loading Google Map...</div>}
    {status === "error" && <div className="provider-map-status provider-map-error" role="alert"><MapPin size={23} /><span>The map could not load. Use the directions link below to open this location in Google Maps.</span></div>}
  </div>;
}
