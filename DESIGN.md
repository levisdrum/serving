---
name: Servin Design System
version: 0.1.0
product: Servin
register: product
tokens:
  colors:
    primary: "#3D9BE9"
    primaryStrong: "#2F84CB"
    pageBackground: "#F8FAFC"
    cardBackground: "#FFFFFF"
    pageText: "#1A2433"
    textSoft: "#667085"
    sidebarBackground: "#05070B"
    sidebarText: "#CBD5E1"
    danger: "#C24B4B"
    success: "#137A48"
    warning: "#B54708"
  typography:
    brand: "wfont_285ce0_d5da3aa88c1d45da80475ee426145923, wf_d5da3aa88c1d45da80475ee42, orig_druk_text_medium, sans-serif"
    body: "system-ui, sans-serif"
    scale: "2xs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl"
  spacing:
    base: "4px"
    controlHeight: "44px"
    cardRadius: "12px"
    controlRadius: "6px"
    pillRadius: "999px"
  elevation:
    card: "0 20px 60px rgba(15, 23, 42, 0.12)"
    floating: "0 18px 45px rgba(15, 23, 42, 0.18)"
---

## 1. Overview

Servin is a local-first scheduling tool for Estacao 337 ministry teams. The interface should feel like an internal church operations product: direct, calm, legible, and fast to use during weekly planning.

The product is not a public SaaS, a marketing site, or a complex analytics dashboard. Prioritize clear forms, readable tables, simple cards, and obvious navigation. Admins need fast control over members, teams, roles, and schedules. Members need quick access to invitations, schedule details, profile data, and playlist links.

Use the design system tokens in `src/design-system/tokens` as the source of truth. Do not hardcode colors, spacing, shadows, or radii inside feature CSS when a token exists.

## 2. Colors

Primary blue is used for the main action, active navigation state, focus affordance, and important positive emphasis. Keep it restrained so screens do not become noisy.

Black and near-black define the app shell, especially the sidebar. The sidebar should stay quiet, high contrast, and operational. Do not place the logo inside a white card on the dark sidebar.

White cards sit on the light page background. Use borders and subtle shadows for separation instead of heavy color blocks.

Status colors are semantic only:

- Success for accepted invitations and completed actions.
- Warning for pending states and attention notes.
- Danger for removal, rejection, or destructive feedback.
- Muted text for secondary metadata, never for critical labels.

## 3. Typography

Use the brand font token for high-impact product labels and main headings where it improves identity. Use the body font token for forms, tables, navigation, and dense content.

Headings should be short and task-oriented. Avoid corporate filler. Good examples are "Painel Admin", "Membros cadastrados", "Criar escala", and "Minha escala".

Labels must be explicit. Placeholders help but do not replace labels. Password fields must support reveal and hide controls with accessible labels.

Use consistent hierarchy:

- Page title: largest practical heading for the current screen.
- Section title: medium heading above a card or table.
- Field label: compact and readable.
- Helper text: muted and short.

## 4. Elevation

Cards use rounded corners and subtle elevation. Controls do not use rounded card-like shapes. Inputs, selects, date pickers, and buttons use the control radius token.

Use elevation only for real layers: cards, topbar menu, dropdowns, and toast feedback. Do not stack shadows on nested elements unless the element is floating above the page.

The login card may use stronger depth because it sits above a video background. Interior form controls should remain flat and precise.

## 5. Components

All shared UI must live under `src/design-system/components/<component>/` with this shape:

- `<component>.tsx`
- `styles.css`
- `types.ts`
- `<component>.vitest.tsx`

Feature-specific composition belongs in `src/features/<feature>/components/` or the feature root. Shared primitives belong in the design system.

Use React Aria components for interactive controls where available: Select, DatePicker, Table, FileTrigger, Dialog, Menu, TagGroup, and TextField patterns. Preserve keyboard navigation, labels, focus rings, disabled states, and screen reader semantics.

Buttons use the design system button component. Icons inside buttons must be sized as supporting elements, not as the visual center of the button.

Tables must be responsive. On small screens, avoid horizontal overflow from rigid columns. Prefer wrapping, compact metadata, or card-like row treatment when needed.

## 6. Do's and Don'ts

Do:

- Use tokens for color, spacing, radius, typography, and elevation.
- Keep admin navigation close to the TailAdmin reference: dark sidebar, clean active state, compact topbar profile menu.
- Keep member screens simpler than admin screens.
- Preserve local-first behavior and localStorage persistence.
- Keep empty states clear and operational.
- Maintain WCAG AA contrast and React Aria semantics.

Don't:

- Add backend, billing, public signup complexity, or multi-tenant behavior.
- Expose seed credentials or operational secrets in public docs.
- Hardcode visual values in feature CSS when tokens exist.
- Use decorative icon art from random sources.
- Add rounded card styling to every input or button.
- Show admin-only routes or actions to regular members.
- Let refresh reset the current route or force the user back to login.
