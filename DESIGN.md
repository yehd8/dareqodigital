# Dareqo Digital — Studio design system

Original composition informed by MotionSites' agency library and accessible prompts Neural Pathway, Modern Agency and Creative Studio. The premium Vexa prompt/template was not accessed or reproduced. No MotionSites media or ready-made HTML was imported.

## Direction and conversion

Position Dareqo as an independent development studio: distinctive customer-facing websites plus practical business systems and local SEO. Lead with one clear headline and an original code/browser illustration. Show sector concepts before explaining services; label them as demos. Keep prices and quote/WhatsApp actions easy to find. Do not add unverified clients, testimonials, awards, revenue or results.

Page order: hero → filterable demos → services → Business Manager workflow → prices → FAQ → quote → footer/review link. The service detail pages share the same visual identity. Existing demo destinations and private manager implementation are retained.

## Tokens

- Proposed light palette: ivory canvas #f7f3eb; champagne panels #e8dcc8; secondary paper #efe8dc.
- Primary cobalt #3e5cff; primary charcoal ink #242320; secondary warm gray #625d54; editorial accent #3649a8.
- System sans serif for interface and headings; Georgia italic for editorial emphasis; system monospace for secondary labels/code. No downloaded fonts or font-CDN request.
- Headings use responsive clamp sizing; body defaults to 16px. Form labels are 14px, form inputs 16px on mobile, supporting metadata 12px where practical. Hero illustration miniature content is decorative and hidden from assistive technology.
- 1280px maximum content width. Page gutters 48px desktop, 32px tablet, 20px mobile. Major section spacing 104/80/60px; local gaps 12/18/24/32px.
- Focus: cobalt #304bea on light surfaces; photographic demos retain their dark overlays and white copy.
- Borders: restrained 1px rules; panels 7–12px radii. Shadows reserved for stacked hero visuals, quote panel and interface depth.
- Breakpoints 540, 820, 1100, 1600px. At 820px and below, native button opens the modal navigation. Mobile work cards and quote inputs use one column.

## Components and behavior

- Buttons: primary cobalt and transparent secondary, at least 44px touch height; explicit focus outline. Links retain clear underlining in textual contexts.
- Hero: decorative CSS code pane, browser composition and connected-workspace card. Slow transform-only movement, no video/WebGL/animation library. Entry sequence under one second.
- Demos: two featured concepts and a denser secondary grid; filters use native buttons with aria-pressed, hidden cards leave keyboard order, status announcement reports visible count. Imagery is conceptual sector imagery, not screenshots of client work. Existing image URLs are reused with responsive source candidates.
- Manager section: labelled illustrative workflow, without invented financial/client metrics.
- Quote form: retains existing field/RPC contract, timeout and safe network recovery. Text is assigned with textContent; no user content is injected as HTML.
- FAQ: native details/summary preserves keyboard behavior.
- Navigation: inert background while modal drawer is open, focus cycle, Escape close and trigger focus restoration. Restore prior inert state when closing.
- Language: EN/Arabic RTL/Arabizi; new homepage data-t strings have translations for both non-English selections. New form feedback follows selected language. Decorative sample browser labels remain illustrative English.
- Motion: reduced-motion preference disables all animation/reveal transitions; reveal enhancement never hides content unless JavaScript successfully initializes it.

## Boundaries

No framework migration, runtime dependency, new analytics, backend migration, private manager redesign or price change. Complete legal privacy details, actual asset-license provenance, live staging delivery and full accessibility/performance certification remain separate from this design pass. Keep credentials out of tests and use intercepted Supabase requests with synthetic data.
