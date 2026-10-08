"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let configured = false;

function configureGoogleMaps() {
  if (configured) return;

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
  if (!key) throw new Error("Google Maps is not configured");

  setOptions({
    key,
    v: "weekly",
    authReferrerPolicy: "origin",
  });
  configured = true;
}

export async function loadGoogleMapsLibrary(name: "maps"): Promise<google.maps.MapsLibrary>;
export async function loadGoogleMapsLibrary(name: "marker"): Promise<google.maps.MarkerLibrary>;
export async function loadGoogleMapsLibrary(name: "places"): Promise<google.maps.PlacesLibrary>;
export async function loadGoogleMapsLibrary(name: "maps" | "marker" | "places") {
  configureGoogleMaps();
  return importLibrary(name);
}
