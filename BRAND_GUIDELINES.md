# RecoveryOn Directory — Brand Guidelines & Design System

This document outlines the official brand identity, color systems, typography rules, component specifications, and layout structures for the **RecoveryOn Directory** platform. All future page developments, subpages, digital assets, and social media creatives must adhere to these guidelines to maintain a premium, trustworthy, and minimal visual language.

---

## 1. Brand Essence & Voice

RecoveryOn is a nationwide US recovery resource directory designed to connect individuals with trusted local treatment centers, counseling, detox programs, support groups, and wellness services.

* **Trust & Integrity:** The design must feel clean, clinical, and professional. Avoid loud, cheap-looking gradients or flashy animations.
* **Clarity & Simplicity:** Information hierarchy should prioritize fast scanning. Spaces should feel open and calm.
* **Warm & Compassionate:** Accent colors (such as RecoveryOn Teal) should guide users softly to actions without feeling aggressive or overly corporate.

---

## 2. Color Palette & Usage Rules

The color system is divided into Primary Brand Colors, a Support/Secondary Palette, and Neutrals. Always maintain high contrast for WCAG AA compliance.

### A. Primary Brand Colors
These are the primary pillars of the interface. Use them for headings, buttons, primary accents, and active link states.

| Color | Hex Value | Primary Role |
| :--- | :--- | :--- |
| **RecoveryOn Navy** | `#012a4a` | Primary headings, dark section fills, brand signatures, and header text. |
| **RecoveryOn Teal** | `#028090` | Primary CTA backgrounds, key interactive accents, links, and important status badges. |

### B. Secondary Support Palette
These colors (derived from our support palette) are used **only** as secondary accents for backgrounds, muted borders, subtle hover tints, or tag variations. They must not compete with primary teal/navy CTAs.

| Color | Hex Value | Primary Role |
| :--- | :--- | :--- |
| **Support Navy** | `#3D52A0` | Secondary links, hover borders on primary Navy items. |
| **Support Blue** | `#7091E6` | Subtle decorative outlines, inactive progress steps. |
| **Support Muted Blue** | `#8697C4` | Inactive icons, tag borders, and helper text. |
| **Support Border** | `#ADBBDA` | Subtle card hover borders, divider lines in neutral sections. |
| **Support BG / Lavender Tint** | `#EDE8F5` | Alternate section backgrounds, icon wrapper fills, and button hover states. |

### C. Neutral Surfaces & Typography

| Color | Hex Value | Primary Role |
| :--- | :--- | :--- |
| **White Surface** | `#ffffff` | Primary card backgrounds, input backgrounds, and core body section fills. |
| **Light Blue-Gray** | `#f8fafc` | Default table rows, body container margins. |
| **Body Slate** | `#334155` | Core readable body text (Slate-700) for clean rendering. |
| **Secondary Slate** | `#475569` | Sub-captions, location text, and helper labels (Slate-600). |
| **Default Border** | `#e2e8f0` | Resting dividers, thin container borders (Slate-200). |

### D. Palette Usage Constraints
1. **CTA Rule:** All major action buttons (e.g. "Search", "Get Listed") must use **RecoveryOn Teal** (`#028090`). Do not use Support Navy (`#3D52A0`) or Support Blue (`#7091E6`) for CTAs.
2. **Text Rule:** Never use light teal or support blue on a light background for body text. All body copy must remain in **Body Slate** (`#334155`) or **Secondary Slate** (`#475569`).
3. **Contrast Integrity:** Avoid mixing too many strong blue and teal tones in the same component. Use `#EDE8F5` as a soft backdrop to separate colored icons or tags.

---

## 3. Typography & Hierarchy

The official typeface is **Plus Jakarta Sans**, a modern, geometric sans-serif that balances clean lines with high readability.

```css
font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

### Type Scale Specification

| Element | Font Size | Weight | Line Height | Color | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Hero Title)** | `2.75rem` (44px) | 800 (Extra Bold) | 1.15 | `#012a4a` | Primary hero headings only. |
| **H2 (Section Title)** | `2.00rem` (32px) | 800 (Extra Bold) | 1.20 | `#012a4a` | Main section headings. |
| **H3 (Card Title)** | `1.05rem` (17px) | 700 (Bold) | 1.35 | `#012a4a` | Listings, category cards. |
| **H4 (Sub-heading)** | `0.95rem` (15px) | 700 (Bold) | 1.40 | `#012a4a` | FAQs, details sub-headers. |
| **Body Text** | `0.90rem` (14.5px) | 500 (Medium) | 1.55 | `#334155` | Informational descriptions. |
| **Meta / Count Text** | `0.76rem` (12px) | 600 (Semi-Bold) | 1.40 | `#8697C4` | Location labels, rating reviews, pills. |

---

## 4. Layout & Grid Standards

To enforce a block-width content design across all subpages:
* **Max Width:** All content container blocks must be capped at `1200px` (`max-width: 1200px`) and centered using `margin: 0 auto`.
* **Horizontal Padding:** Add `24px` of padding on both left and right sides of the main containers to keep content away from the edges on smaller viewports.
* **Vertical Spacing:**
  * **Desktop:** Section padding must be exactly `80px 0` to create a standard, breathing layout.
  * **Mobile:** Section padding collapses to `56px 0`.

---

## 5. UI Component Specifications

### A. Featured Resource Cards
* **Dimensions:** Width is flexible based on grid columns, but image aspect ratio is locked using `object-fit: cover` with a height of `190px`.
* **Tag Overlay:** Positioned absolute on the top-left of the image. Must use a solid **RecoveryOn Teal** (`#028090`) background and white text.
* **Body Elements:** Location (Teal icon + uppercase state slug text), Name (Bold, H3, max 2 lines), Rating & Reviews (Yellow star + review count in parentheses), Status/Pricing info line.
* **Borders & Radii:** Rounded to `8px` (`--radius-md`), with a thin `1px solid #e2e8f0` border.
* **Hover Effect:** Translate up by `3px` (`translateY(-3.0px)`) with a transition speed of `0.4s` using `cubic-bezier(0.16, 1, 0.3, 1)`. The border shifts to `#ADBBDA`.

### B. Category Cards
* **Layout:** Column-aligned, height locked at `110px` on desktop and `100px` on mobile.
* **Elements:**
  * Icon inside a rounded square (`36px` wrapper) using background `#EDE8F5` and color `#028090`.
  * H3 Category title (`0.9rem`).
  * Sub-caption count tag showing provider totals (e.g. `124 centers`).
* **Hover State:** Shifts border to `#028090`, applies a `rgba(2, 128, 144, 0.02)` background tint, and slides in a small teal chevron (`\f054`) on the bottom-right.
* **A11y:** Every card must have `tabindex="0"`, `role="button"`, and Enter/Space keyboard listeners.

### C. State Discovery Buttons
* **Layout:** Multi-column layout (5 columns desktop, 3 columns tablet, 2 columns mobile).
* **Styling:** Soft white background, thin `#e2e8f0` border, `4px` padding inside, displaying state name on the left and counts on the right (e.g., `California (215)`).
* **Hover:** Transits border to `#ADBBDA` and shifts the button slightly to the right by `2px`.

---

## 6. Social Media & Creative Assets Guidelines

When creating social graphics (e.g., for Instagram, Facebook, or LinkedIn cards to promote directories):

### A. Visual Layout Rules
1. **The Grid:** Use 50/50 splits: one half for a high-quality landscape image (similar to the website listings), and the other half for clear text on a solid surface.
2. **Surface Fills:** Use `#EDE8F5` or white as the text surface color. Do not use dark fills for social text cards unless it's a major announcement, which should use **RecoveryOn Navy** (`#012a4a`).
3. **Logo Placement:** The RecoveryOn logo must always sit in the top-left or bottom-right corner, surrounded by clear negative space equal to the height of the logo text.

### B. Typography Pairings (Social Graphics)
* **Title/Headline:** Large **Plus Jakarta Sans** (Extra Bold, Navy).
* **Location/Sub-text:** RecoveryOn Teal (`#028090`) all-caps with light tracking (`0.05em`).

### C. Graphic Templates (Example Matrix)
* **Instagram (1080x1080):** High-contrast background overlay video loop or image frame. Use a `12px` rounded white box containing the state name and top categories overlaid on the bottom center.
* **LinkedIn/Facebook Link Previews (1200x630):** Title card with `#EDE8F5` on the left showing *"Browse verified recovery programs in [StateName]"*, and a nature/wellness landscape image on the right.

---

## 7. Code Implementation Matrix (CSS Standard)

Apply the following CSS block to all newly created subpages to guarantee alignment with this brand guideline:

```css
/* Core Variables */
:root {
    --primary-color: #028090;
    --secondary-color: #012a4a;
    --support-navy: #3D52A0;
    --support-blue: #7091E6;
    --support-muted-blue: #8697C4;
    --support-border: #ADBBDA;
    --support-bg: #EDE8F5;
    
    --bg-main: #f8fafc;
    --bg-light-blue: #EDE8F5;
    --bg-card: #ffffff;
    --text-primary: #012a4a;
    --text-body: #334155;
    --text-secondary: #475569;
    --text-muted: #8697C4;
    --border-color: #e2e8f0;
    
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.03);
    --shadow-md: 0 2px 8px rgba(15, 23, 42, 0.02);
    --shadow-hover: 0 4px 16px rgba(15, 23, 42, 0.06);
    
    --transition-fast: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    --transition-normal: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    --max-width: 1200px;
}

/* Global Focus Rings for AA Compliance */
*:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}
```
