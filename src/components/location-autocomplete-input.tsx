"use client";

import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { loadGoogleMapsLibrary } from "@/lib/google-maps-loader";

type LocationAutocompleteInputProps = {
  defaultValue?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
};

function locationQuery(place: google.maps.places.Place) {
  const components = place.addressComponents || [];
  const component = (type: string) => components.find((item) => item.types.includes(type));
  const postalCode = component("postal_code")?.longText;

  if (place.types?.includes("postal_code") && postalCode) return postalCode;

  const city = component("locality")?.longText
    || component("postal_town")?.longText
    || component("sublocality")?.longText
    || component("administrative_area_level_2")?.longText;
  const state = component("administrative_area_level_1")?.shortText;
  const cityState = [city, state].filter(Boolean).join(" ");

  return cityState || postalCode || place.formattedAddress || "";
}

export function LocationAutocompleteInput({
  defaultValue = "",
  name = "location",
  onValueChange,
  placeholder = "City, state, or ZIP",
}: LocationAutocompleteInputProps) {
  const listboxId = useId();
  const requestIdRef = useRef(0);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<google.maps.places.PlacePrediction[]>([]);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    function restoreValueFromUrl() {
      const nextValue = new URLSearchParams(window.location.search).get(name) || "";
      setValue(nextValue);
      onValueChange?.(nextValue);
    }
    function restorePersistedPage(event: PageTransitionEvent) {
      if (event.persisted) restoreValueFromUrl();
    }

    window.addEventListener("popstate", restoreValueFromUrl);
    window.addEventListener("pageshow", restorePersistedPage);
    return () => {
      window.removeEventListener("popstate", restoreValueFromUrl);
      window.removeEventListener("pageshow", restorePersistedPage);
    };
  }, [name, onValueChange]);

  useEffect(() => {
    const input = value.trim();
    if (!focused || input.length < 2) {
      requestIdRef.current += 1;
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const timer = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        try {
          const { AutocompleteSessionToken, AutocompleteSuggestion } = await loadGoogleMapsLibrary("places");
          if (!sessionTokenRef.current) sessionTokenRef.current = new AutocompleteSessionToken();
          const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input,
            includedRegionCodes: ["us"],
            language: "en",
            region: "us",
            sessionToken: sessionTokenRef.current,
          });
          if (requestIdRef.current !== requestId) return;
          setSuggestions(response.suggestions.flatMap((suggestion) => suggestion.placePrediction ? [suggestion.placePrediction] : []));
          setActiveIndex(-1);
        } catch {
          if (requestIdRef.current === requestId) setSuggestions([]);
        } finally {
          if (requestIdRef.current === requestId) setLoading(false);
        }
      })();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [focused, value]);

  async function selectSuggestion(prediction: google.maps.places.PlacePrediction) {
    const fallbackValue = prediction.mainText?.text || prediction.text.text;
    requestIdRef.current += 1;
    setFocused(false);
    setSuggestions([]);
    setActiveIndex(-1);
    setLoading(true);

    try {
      const place = prediction.toPlace();
      await place.fetchFields({ fields: ["addressComponents", "formattedAddress", "types"] });
      const nextValue = locationQuery(place) || fallbackValue;
      setValue(nextValue);
      onValueChange?.(nextValue);
    } catch {
      setValue(fallbackValue);
      onValueChange?.(fallbackValue);
    } finally {
      sessionTokenRef.current = null;
      setLoading(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) {
      if (event.key === "Escape") setSuggestions([]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      void selectSuggestion(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  }

  const expanded = focused && suggestions.length > 0;

  return (
    <div className="location-autocomplete">
      <input
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={expanded}
        aria-haspopup="listbox"
        autoComplete="postal-code"
        name={name}
        onBlur={() => {
          window.setTimeout(() => {
            setFocused(false);
            setSuggestions([]);
            setActiveIndex(-1);
            sessionTokenRef.current = null;
          }, 120);
        }}
        onChange={(event) => {
          const nextValue = event.target.value;
          setValue(nextValue);
          setFocused(true);
          if (nextValue.trim().length < 2) {
            setSuggestions([]);
            setLoading(false);
            sessionTokenRef.current = null;
          }
          onValueChange?.(nextValue);
        }}
        onFocus={() => setFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        value={value}
      />
      {expanded && (
        <div className="location-autocomplete-menu" id={listboxId} role="listbox">
          {suggestions.map((prediction, index) => (
            <div
              aria-selected={index === activeIndex}
              className="location-autocomplete-option"
              id={`${listboxId}-${index}`}
              key={prediction.placeId}
              onMouseDown={(event) => {
                event.preventDefault();
                void selectSuggestion(prediction);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
            >
              <strong>{prediction.mainText?.text || prediction.text.text}</strong>
              {prediction.secondaryText?.text && <span>{prediction.secondaryText.text}</span>}
            </div>
          ))}
          <div className="location-autocomplete-attribution" translate="no">Google Maps</div>
        </div>
      )}
      {loading && <span className="sr-only" role="status">Loading location suggestions</span>}
    </div>
  );
}
