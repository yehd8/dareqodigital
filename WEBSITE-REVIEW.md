# Dareqo Digital website review — 18 November 2026

Historical pre-deployment review. See LAUNCH-RESULT.md for the current Vercel deployment record, successful six-width Playwright results and updated live-policy observations. This is a bounded review, not a certification of security or WCAG compliance.

## Audience, goals and direction

Working brief from existing project context: small businesses in Lebanon and remote prospects; sell websites, custom Business Manager setups and local SEO. Preserve the current navy, blue and cyan identity, floating development visuals, published prices with their plus signs, circular Instagram and WhatsApp contacts, and independent demo gallery. Primary action: request a quote; secondary action: WhatsApp. The public site does not need a framework migration for these fixes. Static delivery avoids a server rendering dependency and recurring compute for brochure pages; Supabase remains responsible for request storage and manager access.

| Page | Sections | Main action |
| --- | --- | --- |
| Home | Introduction, services, manager overview, pricing, demos, reviews, quote form, FAQ | Request a quote |
| Web design | Capabilities, audience, integration, starting prices | Request a website quote |
| Business management | Workflows, customization, integration, starting prices | Discuss a system |
| Local SEO | Setup scope, expectations, pricing | Discuss local SEO |
| Demo pages | Existing sector examples, clearly described as demos | Return to Dareqo to discuss customization |
| 404 | Missing-page explanation, home link | Return home |

Design foundations live in `quality.css`: existing navy #08111f, darker primary #405bdb, muted text #526177, focus #008394 with a lighter focus color on dark surfaces; system typography; 0.25rem spacing unit; 1rem radius; 44px minimum controls; 480px narrow-screen adjustments alongside existing 580/820/900px breakpoints. Shared rules preserve the existing layout. No new artwork or fonts were added. Existing third-party asset provenance remains unverified.

## Findings

URLs below refer to the current GitHub Pages production site. Source evidence was collected at commit cad32393d4cc41f5ccf510ba71de36a1c39fd49b. Fixes are in the branch only.

### High — quote submission can leave users stuck (confirmed source issue; fixed locally)
- URL: https://yehd8.github.io/dareqodigital/#request
- Reproduce: interrupt connectivity or let the submission promise reject after Send Request is pressed.
- Expected: accessible error, preserved details, usable submit button.
- Actual: original handler disables the button, awaits `client.rpc` without try/catch/finally, and does not restore the UI after a rejection.
- Fix: isolated request module, 15-second abort, try/catch/finally, duplicate-submit guard, preserved fields, clear delivery-uncertainty message. Removed the homepage SDK dependency; manager SDK usage is unchanged.
- Testing: six isolated unit tests cover success, rejected network request, HTTP error, invalid fields, whitespace, and duplicate submission. Timeout duration and live database delivery were not exercised.

### High — role-specific authorization needs backend verification (potential production risk)
- URL: https://yehd8.github.io/dareqodigital/manager.html
- Reproduce in staging only: compare owner, manager, staff and viewer access to protected read/write APIs.
- Expected: server-enforced role restrictions for every action.
- Evidence: repository `supabase/schema.sql` defines several authenticated policies using business membership without a role condition; the live database may have later migrations not present in this repository.
- Fix: export current policies to a controlled review environment, define the intended role matrix, and test RLS and privileged RPCs there. Do not apply this older schema to production.
- Testing needed: cross-business isolation, role boundaries, session expiry, recovery, upload authorization and abuse limits. No authenticated production data was accessed.

### Medium — mobile menu focus containment (confirmed source issue; fixed locally)
- URL: https://yehd8.github.io/dareqodigital/
- Reproduce: at a mobile width, open menu, tab to the last link, press Tab.
- Expected: focus stays in the drawer; Escape closes it and returns focus.
- Actual: `drawer.querySelector('a:last-of-type')` matches Home because each link is also the last anchor of its own type at that position; the trap uses the wrong endpoint. Background controls remain available to assistive technology.
- Fix: target `.mobileMenuLinks a:last-child`, mark the drawer as a modal dialog, and make background elements inert while open.
- Testing needed: mobile keyboard and screen-reader checks; not verified in the available fixed-width browser.

### Medium — partial language switching (confirmed, remains)
- URL: https://yehd8.github.io/dareqodigital/
- Reproduce: select Arabic; examine pricing, form labels, FAQs and service cards.
- Expected: complete translated interface and messages with appropriate language markup.
- Actual: only `[data-t]` content changes; substantial English content remains under `html lang="ar"`. New form feedback and privacy text are also English.
- Fix: translate all visible content and validation feedback as a bounded follow-up; use language metadata for remaining foreign-language phrases.
- Testing: Arabic RTL activation and no desktop overflow verified at 1363px; complete localization not verified.

### Medium — two service pages excluded from search (confirmed; review intent)
- URLs: https://yehd8.github.io/dareqodigital/web-design-lebanon.html and https://yehd8.github.io/dareqodigital/business-management-system-lebanon.html
- Reproduce: inspect their robots meta tags.
- Expected: if these are final public acquisition pages, `index,follow` and inclusion in the sitemap.
- Actual: `noindex,follow`; sitemap includes only home and local SEO. The sitemap omission is consistent with current noindex settings.
- Fix: confirm these pages are final, then enable indexing and add them to sitemap together. Preserve current directives until that decision is made.
- Testing needed: inspect deployed HTML and Search Console URL inspection after release.

### Medium — incomplete privacy and retention information (confirmed content gap)
- URL: https://yehd8.github.io/dareqodigital/#request
- Reproduce: inspect the quote form before submitting personal details.
- Expected: explain collection, recipients, retention and user requests.
- Actual: original has no explanation. Branch adds purpose, Supabase recipient, sensitive-data guidance and contact, but retention period, deletion process and applicable country requirements are not confirmed.
- Fix: owner supplies actual retention policy, authorized staff roles, service countries and deletion process; publish a complete privacy notice. Do not invent these operational facts.
- Testing needed: verify data minimization and the actual deletion/export process.

### Medium — launch verification incomplete (release blocker)
- URL: release preview, not public yet.
- Required widths: 320, 375, 768, 1024, 1440, 1920px.
- Actual: available browser inspected at 1363×936; its documented controls do not expose viewport resizing. The six-width Playwright matrix has not run. Production deployment is withheld.
- Still needed: complete viewport matrix, mobile touch targets and drawer behavior, reduced-motion observation, failed-network coverage, dialog tests, Lighthouse/field CWV baseline and authorized staging request delivery.

### Low — inconsistent focus, narrow-screen and image foundations (source issues; improved locally)
- URL: https://yehd8.github.io/dareqodigital/
- Reproduce: keyboard through page; inspect gallery image markup; inspect narrow header sizing.
- Expected: explicit visible focus, skip link/main landmark, stable image geometry and usable mobile controls.
- Actual: no shared focus style or main landmark; gallery images lack intrinsic dimensions.
- Fix: shared stylesheet, skip link/main, darker primary button/text colors, image dimensions and decoding hints, 44px controls, reduced-motion override. These changes require full contrast and responsive verification.
- Evidence: preview DOM has one main landmark, one h1, no missing fragment targets and no loaded broken images at inspection time.

### Low — no custom 404 and stale README contact (confirmed; fixed locally)
- URL: site missing route and repository README.
- Expected: helpful missing-page content and consistent current contact details.
- Actual: repository has no custom 404; README lists older email/phone.
- Fix: add noindex 404 page to the explicit build allowlist; update README contacts.
- Testing needed: verify deployed unknown routes return HTTP 404, rather than a 200 rewrite. The 404 home link currently uses the existing production domain and must be revised if migrated.

## Verification performed

- `npm run lint`: passed custom JavaScript syntax, local file-target and limited credential-pattern scan across 15 HTML files. This is a small project-specific check, not a comprehensive ESLint or HTML validation suite.
- `npm run typecheck`: passed TypeScript checkJs for the new request module; legacy scripts are not type checked.
- `npm test`: six passing isolated form tests; all fetches mocked with synthetic values, no production credentials or customer data.
- `npm run build`: passed; explicit allowlist excludes repository internals, SQL and source-only materials.
- `git diff --check`: passed.
- `npm audit --omit=dev`: reported zero vulnerabilities for production dependencies; the homepage has no npm runtime dependencies. External CDN dependencies on other pages were not audited by this command.
- Public page and local preview inspected using browser UI and Playwright APIs. At 1363×936: one h1/main, valid local fragment targets, no horizontal overflow in English/Arabic. Empty form submission focuses Name and retains an enabled submit button without sending data.
- Browser logs observed only extension-origin metadata errors, not application-origin errors, during the inspected window. This is not complete network-failure instrumentation.
- Current public Supabase URL and publishable key are browser configuration, not server secrets. No server credentials are required for this static build. Limited source pattern scan found no matching private credentials; it is not an exhaustive history/build secret audit.

## Launch checklist

| Item | Status |
| --- | --- |
| Existing repository and deployment workflow inspected | Verified |
| Synthetic form unit tests and static production build | Verified |
| Main landmark, required-field browser focus, desktop fragment targets | Verified |
| Six exact responsive widths and touch checks | Needs checking |
| Full WCAG contrast, screen-reader and reduced-motion tests | Needs checking |
| Complete Arabic/Arabizi interface | Needs checking |
| All external links/images and licensing | Needs checking |
| Canonicals, indexing decision, social preview image | Needs checking |
| Authorized staging RPC delivery, server validation/rate limits/RLS | Needs checking |
| Privacy retention, countries, access/export/deletion | Needs checking |
| Field traffic, limits, backups, recovery and alerts | Needs checking |
| Analytics/cookie vendor inventory | Needs checking |
| Payments on public brochure site | Not applicable |
| Vercel connection and preview/production deployments | Needs checking |

## Performance and capacity

Start with measurement: Lighthouse mobile baseline on staging and real-user LCP/INP/CLS if analytics consent and vendor choice permit. Existing static hosting/CDN handles brochure delivery; Supabase write traffic is the likely capacity concern during spikes. Do not claim an improved score from source changes alone.

High value: homepage SDK removal reduces a render-blocking third-party request; measure transferred bytes, request count and LCP before/after. Gallery image dimensions reduce an identified layout-shift risk; measure CLS while lazy images load. Next, resize gallery sources to rendered widths with srcset after confirming asset rights. Review backend rate limiting and RPC input validation before adding traffic. Hosting/database plan, expected peak visitors, busiest operations, measured traffic and backups remain unknown. Start any authorized load test in staging with low bounded traffic, never against production customer workflows.

## Deployment and rollback

1. Complete the outstanding launch checks and connect Vercel. Do not deploy production before they pass.
2. Import `yehd8/dareqodigital` into Vercel; use the reviewed branch for a preview, framework Other/static, output `dist`, and the checked-in `vercel.json` build command. No server secrets are needed by this brochure build.
3. Keep preview indexing disabled using Vercel preview protections. Before a production domain migration, update absolute canonical/OG/schema/sitemap/robots URLs and the 404 home destination consistently; define one primary host and test old-domain redirects. Do not point both domains at separate indexable copies.
4. Smoke-test preview, then promote the verified deployment. Record its deployment ID, URL and previous production deployment ID. Neither URL has been generated yet.
5. Rollback on Vercel: Project → Deployments → select the previously healthy production deployment → menu → Instant Rollback. Verify old forms, navigation and assets afterward. If no previous deployment exists, there is no prior Vercel release to roll back to; preserve existing GitHub Pages until the new release is verified.
6. If this change is later merged and shipped to GitHub Pages, revert that merge/commit on main and let the Pages workflow redeploy. Do not run a hard reset or force-push production history. Backend/database rollback is separate; this branch makes no database changes.
