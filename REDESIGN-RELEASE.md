# Dareqo Digital — original studio redesign

Release date: 18 November 2026, Beirut time. This record describes the visual redesign following the earlier technical improvements.

## What changed

The homepage now uses an original navy/cobalt studio identity: editorial typography, an illustrated code-to-browser hero, slow composited movement with a user-controlled reduction option, filterable sector demos, a concise service presentation, an illustrative Business Manager workflow, contrasting pricing, native FAQ and a focused quote section. Three existing service detail pages share the visual identity.

MotionSites' full catalog was reviewed. The available Neural Pathway, Modern Agency and Creative Studio prompts informed composition and motion. No locked Vexa Studio prompt, premium template, ready-made HTML or MotionSites media was copied. Existing sector imagery is reused with responsive sizes. Gallery compositions are illustrative design concepts, not screenshots or finished client work.

The static architecture is retained. No runtime dependency, framework migration, tracking service, database migration, price change or private Business Manager redesign was introduced. Published prices and contact destinations remain intact. The public manager links lead to the sample demo.

## Changed files

- `index.html`: new page structure, demo filter controls, preserved quote fields, image source candidates, strict homepage CSP and safe non-JavaScript form fallback.
- `studio.css`: responsive design tokens and components, original CSS hero, focus and motion behavior, service detail-page styling.
- `studio.js`: homepage translations, modal navigation, demo filters, motion control and progressive reveal.
- `request-form.js`: localized status feedback and safe initialization of the submit button; existing RPC contract and timeout/error preservation remain.
- `web-design-lebanon.html`, `business-management-system-lebanon.html`, `local-seo-lebanon.html`: shared visual identity.
- `scripts/build.mjs`: explicitly includes the new public stylesheet/script in the static output.
- `scripts/browser-qa.mjs`: extends the six-width suite with filter, console-error and motion-control checks.
- `scripts/accessibility-qa.mjs`: axe WCAG-tagged checks at phone and desktop widths.
- `tests/request-form.test.mjs`, `tests/studio.test.mjs`: nine focused tests including Arabic failure feedback, translation coverage and private-manager-link isolation.
- `.github/workflows/website-qa.yml`, `package.json`, `package-lock.json`: CI execution and pinned development-only accessibility test tooling.
- `DESIGN.md`: reusable tokens, typography, spacing, component guidance and accessibility notes.

## Checks and scope

Static syntax/local-target/limited credential-pattern checks, request-module TypeScript checking, nine unit tests and production builds passed locally. Browser tests execute on GitHub Actions because local Chromium socket creation is restricted in this workspace.

The browser suite covers home plus three service detail pages at 320, 375, 768, 1024, 1440 and 1920px. It checks document status, heading count, description, loaded-image failures, page exceptions/console errors and overflow. Interactions include mobile menu focus cycling, Escape, navigation, RTL, category filters, motion reduction and synthetic form success/error behavior. Requests to production Supabase are intercepted in the tests.

The accessibility suite evaluates those four pages at 375 and 1440px with WCAG 2 A/AA, 2.1 AA and 2.2 AA rule tags. Automated results do not establish full WCAG conformance; incomplete image/contrast checks and real assistive-technology use require manual review.

## Finding fixed before release

High (automated accessibility severity: serious): the workspace label used #607497 on #f1f4fa, giving 4.29:1 contrast instead of the required 4.5:1 for small text. URL: homepage, Business Manager concept. Reproduce: inspect the `data-t="workspace"` label at 375 or 1440px with axe. Expected: at least 4.5:1; actual before fix: 4.29:1. Remediation: darken to #52637f and rerun the audit. The failed pre-fix run is 44401964841; its logs contain exact DOM/contrast evidence.

## Remaining risks

- Confirm retention period, data deletion/export process and countries served for a complete privacy notice. The quote explanation is not a legal-compliance claim.
- Automated accessibility testing is bounded. Screen-reader testing, image-backed text contrast, zoom and real touch/device review remain useful follow-ups.
- No live customer submission, login, payment or destructive database test was performed. Backend authorization and real staging-delivery verification remain separate.
- The original demo pages are retained, not redesigned or fully audited by this pass. Their external resources and existing asset provenance remain separate review items.
- Existing canonical URLs/sitemap still point to GitHub Pages. This release is not an SEO/domain migration. Two service pages retain their previous noindex directives pending a content/indexing decision.
- Core Web Vitals field data and a Lighthouse baseline are not available. No performance score or measured speed improvement is claimed. The hero uses CSS rather than video/WebGL; no new font CDN is added.
- Vercel Git integration is still unlinked because the Vercel account lacks its GitHub Login Connection. Source is saved on the design branch; this release uses authenticated direct source upload.

## Deployment and rollback

Target team: `team_SER3W1UkHk0clWdqRqlYD0UK`; project: `prj_BhPUgRIr9l7PME9BER1J3ZygpQ3z` (dareqo-digital). Framework Other/static, Node 24, install `npm ci --ignore-scripts`, build command from `vercel.json`, output `dist`. No private project environment variables are required.

Keep the exact tested source for preview and production. Verify the preview renders the new hero, filters, form module and security headers before promotion. Leave the project's deployment protection in place. GitHub Pages and main are unchanged by this design branch.

Previous production rollback anchor: `dpl_4EXFXHVzKawVY3zx2URdefe3GGeW`.

```bash
vercel rollback dpl_4EXFXHVzKawVY3zx2URdefe3GGeW --scope dareqo-digital
```

Dashboard alternative: Dareqo Digital → Deployments → select `dpl_4EXFXHVzKawVY3zx2URdefe3GGeW` → menu → Instant Rollback. Verify homepage, pricing, navigation and quote-module availability after recovery. This command is a recovery instruction; it was not executed. No database rollback is needed because this pass makes no database changes.


## Verified release result

- Tested application source: `5f3a6d6270b6dc6ffeb23fe22585abc5c2c6e41f`.
- Successful CI: https://github.com/yehd8/dareqodigital/actions/runs/44402354598 . Result: 24 responsive page-width checks, 17 workflow records, nine unit tests and eight automated accessibility checks; zero reported browser failures/errors and zero axe violations. The accessibility tool still has incomplete checks requiring manual review.
- Test/screenshots artifact: https://github.com/yehd8/dareqodigital/actions/runs/44402354598/artifacts/14474406284 . Retained seven days by CI.
- Preview: READY, `dpl_FHkXx53qCu8k7qVYSz4AyNEnTme6`, https://dareqo-digital-7acq2d0ic-dareqo-digital.vercel.app/ . Homepage, stylesheet, script, three detail pages and sitemap returned HTTP 200; missing route returned HTTP 404. Preview responses included noindex.
- Production: READY, `dpl_82uqwwGMyw7XC4GPXUAw8NxNsEmy`, https://dareqo-digital.vercel.app/ . Unique deployment URL: https://dareqo-digital-834mtc905-dareqo-digital.vercel.app/ . Vercel's production build completed successfully. Live browser inspection verified the new heading/style module and no desktop horizontal overflow. The screenshot at `docs/dareqo-studio-redesign.jpg` was captured from this production URL.
- Vercel's preview promotion endpoint returned 422. Production was then built from the same tested source/files with an explicit production target; no private environment variables are configured. No deployment protection was disabled.
- Automatic approval review rejected the temporary public preview share-link action because a bearer link could expose protected manager routes to anyone holding it. No workaround was used. The preview remains accessible through normal authorized Vercel sign-in. The production alias rendered directly in the browser without a new share link.
- Source review: https://github.com/yehd8/dareqodigital/pull/6 . This PR targets the existing technical-improvements branch, keeping the visual design changes reviewable. Existing GitHub Pages/main remain unchanged.
