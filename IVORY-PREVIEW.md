# Ivory and champagne color preview

19 November 2026 — Beirut time.

## Summary
A brighter proposed palette for Dareqo Digital: warm ivory #F7F3EB, champagne #E8DCC8, charcoal #242320, warm gray #625D54 and retained cobalt actions #3E5CFF. Hero illustration, navigation, gallery chrome, workflow, pricing, FAQ, enquiry section, footer and three service pages share the light treatment. Photographic demo overlays remain dark for legibility.

## Changed files
- studio.css: palette, supporting-copy colors, light surfaces, shadows, borders and focus colors.
- index.html: browser theme-color metadata.
- DESIGN.md: updated design tokens and focus guidance.
- docs/dareqo-ivory-preview.jpg: screenshot of the local built preview.
- IVORY-PREVIEW.md: this review and release record.

## Testing performed
Local lint, TypeScript check, nine unit tests, production build and diff whitespace checks passed.
Final CI: https://github.com/yehd8/dareqodigital/actions/runs/44408756365
Result: 24 page/viewport checks, 18 workflow records, no reported browser failures or console errors, eight axe checks with zero violations.
Widths: 320, 375, 768, 1024, 1440, 1920px.
All seven demo links, mobile drawer focus/Escape, RTL overflow, filters, motion control, required-field validation and mocked submission failure/success were covered.
Screenshots/report artifact: https://github.com/yehd8/dareqodigital/actions/runs/44408756365/artifacts/14477285916 (seven-day retention).
Visual inspection: desktop homepage, gallery, quote panel and web-design service page. Homepage computed background rgb(247,243,235), text rgb(36,35,32), no desktop horizontal overflow.
Source and output checks found no matches for the limited private-credential patterns scanned; this is not an exhaustive secret/security audit. No environment-variable requirements were added; this remains the existing static build.
The existing robots.txt, sitemap.xml and custom 404 were inspected/preserved. Existing canonical/domain guidance remains unchanged; this color trial is not an SEO migration.

## Findings fixed before preview deployment
High — two small-label contrast failures in the first trial, on the homepage.
1. Business Manager sample sidebar initial at 375px: click/filter to Business systems and inspect .mini-sidebar > b. Expected 4.5:1 for small bold text; actual #3E5CFF on #E8DCC8 was 3.7:1. Changed to #3649A8 (5.79:1).
2. Quote eyebrow at 375/1440px: navigate to #request and inspect p[data-t="requestEyebrow"]. Expected 4.5:1; actual #776345 on #E8DCC8 was 4.24:1. Changed bronze labels to #6B573A (5.08:1).
Impact: small text was harder for low-vision visitors to read. Evidence: first CI run https://github.com/yehd8/dareqodigital/actions/runs/44408398492 . Final rerun above passed.
No unresolved Critical/High/Medium/Low violations were reported by the bounded final automated checks.

## Preview and production
Preview: https://dareqo-digital-93yjkeyhw-dareqo-digital.vercel.app
Deployment: dpl_9KTdmFTBh5Sk4NuhCRmxgZzqLLi6 — READY.
Tested application source: 9eb6a88c6b1c0bab22be122a6b2b9462a6b4574f.
The preview retains normal Vercel access protection and may require the owner's sign-in. No public bearer link was created.
Current production: https://dareqo-digital.vercel.app/
Production retains the previous navy palette at dpl_8FoTk8BbqyiTDLpfATd5HyPdSstw while this trial is reviewed.

## Remaining risks
Automated accessibility results do not establish full WCAG compliance. Image-backed contrast, screen-reader review and real-device checks remain manual follow-ups. The original sector demos were not recolored or fully audited. No real form submission, customer data, production credentials, field-performance measurement or load test was used. Existing backend/privacy/SEO review limits remain as recorded in REDESIGN-RELEASE.md.

## Deployment instructions and rollback
After the color direction is accepted, deploy the exact tested source to production through the existing Vercel project. If using the official CLI, run from that checkout:
```sh
vercel link --project dareqo-digital --scope dareqo-digital
vercel deploy --prod --scope dareqo-digital
```
These production commands have not been executed for this trial.
To discard this trial, keep using the existing production alias; no production rollback is necessary.
If the palette is later released and must be reverted:
```sh
vercel rollback dpl_8FoTk8BbqyiTDLpfATd5HyPdSstw --scope dareqo-digital
```
Dashboard alternative: Dareqo Digital → Deployments → dpl_8FoTk8BbqyiTDLpfATd5HyPdSstw → menu → Instant Rollback.
