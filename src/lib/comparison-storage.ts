import "client-only";

export type ComparisonSelection = {
  id: string;
  name: string;
  href: string;
};

export const COMPARISON_EVENT = "treatmentlane:comparison-change";
const COMPARISON_KEY = "treatmentlane-comparison";
const MAX_COMPARISON_ITEMS = 3;

export function readComparison() {
  try {
    const value = JSON.parse(window.localStorage.getItem(COMPARISON_KEY) || "[]") as unknown;
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is ComparisonSelection => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      return typeof candidate.id === "string" && typeof candidate.name === "string" && typeof candidate.href === "string";
    }).slice(0, MAX_COMPARISON_ITEMS);
  } catch { return []; }
}

export function writeComparison(items: ComparisonSelection[]) {
  const nextItems = items.slice(0, MAX_COMPARISON_ITEMS);
  window.localStorage.setItem(COMPARISON_KEY, JSON.stringify(nextItems));
  window.dispatchEvent(new CustomEvent(COMPARISON_EVENT, { detail: nextItems }));
  return nextItems;
}

export function toggleComparison(selection: ComparisonSelection) {
  const current = readComparison();
  const exists = current.some((item) => item.id === selection.id);
  if (exists) return { items: writeComparison(current.filter((item) => item.id !== selection.id)), limitReached: false };
  if (current.length >= MAX_COMPARISON_ITEMS) return { items: current, limitReached: true };
  return { items: writeComparison([...current, selection]), limitReached: false };
}
