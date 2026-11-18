# Dareqo Digital deployment result — 18 November 2026

This is the current deployment record. It supersedes the earlier pre-deployment status and incomplete responsive-test notes in WEBSITE-REVIEW.md.

## Result

- Vercel team: dareqo-digital (`team_SER3W1UkHk0clWdqRqlYD0UK`).
- Project: dareqo-digital (`prj_BhPUgRIr9l7PME9BER1J3ZygpQ3z`).
- Deployed application source: `548b08ac1b705f254c1b63bc48ec805eae1ec324`.
- Framework: existing static HTML/CSS/JavaScript, Node 24 build.
- Production target: READY, https://dareqo-digital.vercel.app/ . Deployment `dpl_4EXFXHVzKawVY3zx2URdefe3GGeW`; unique URL https://dareqo-digital-o8ng0mnj4-dareqo-digital.vercel.app/ .
- Preview target: READY, https://dareqo-digital-roizyqip9-dareqo-digital.vercel.app/ . Deployment `dpl_3X8JhCmm7y77kJtqm5MyvgPvzQxX`.
- Vercel assigned the first deployment to production automatically despite the omitted target. A separate subsequent preview was created and verified.
- Vercel's default deployment protection was preserved. The protected preview can require a Vercel sign-in or temporary share link; share tokens are not committed here.
- Existing GitHub Pages production and its main branch remain unchanged. Canonicals and sitemap still identify GitHub Pages as the primary search host. This is a Vercel deployment, not a completed SEO/domain migration.

## Changed files and behavior

The PR contains homepage/service-page adjustments, `quality.css`, `request-form.js`, `404.html`, build/static-check scripts, form unit tests, package files, `vercel.json`, GitHub Pages workflow updates, README fixes and review documents. This follow-up adds `scripts/browser-qa.mjs` and `.github/workflows/website-qa.yml`, pins Playwright, and fixes phone-pattern escaping for modern browser regex rules.

Improvements include recoverable network errors, request timeout, duplicate-submit suppression, preserved details on uncertain delivery, explicit focus, skip link/main landmark, mobile modal focus cycling, image dimensions, narrow-screen adjustments and shared reduced-motion behavior. Branding, contact links, prices and demos are retained.

## Test evidence

GitHub Actions run: https://github.com/yehd8/dareqodigital/actions/runs/44393300402 . Artifact `dareqo-browser-qa` includes JSON results and six full-page homepage screenshots, retained for seven days by the workflow.

| Check | Result |
| --- | --- |
| Custom syntax/local-file-target/credential-pattern scan | Passed |
| TypeScript checkJs, new request module | Passed |
| Six isolated form unit tests | Passed |
| Static production build | Passed locally, in CI and on Vercel |
| Home and three service pages at 320, 375, 768, 1024, 1440, 1920px | 24 page-width checks passed |
| Mobile focus cycle, Shift+Tab, Escape, restored trigger focus and section links | Passed at 320, 375, 768px |
| Arabic direction and horizontal overflow | Passed at all six widths |
| Native required-name validation | Passed at all six widths |
| Mocked HTTP failure preserving input, then mocked success clearing input | Passed |
| Workflow summary | 24 pages, 10 workflow records, zero reported failures/errors |
| Hosted homepage | HTTP 200; updated form module present |
| Hosted missing route | Genuine HTTP 404 with custom page |
| Hosted security headers | nosniff, DENY framing, referrer policy, permissions policy and HSTS observed |
| Preview search protection | X-Robots-Tag: noindex observed |
| Vercel environment configuration | No configured project environment variables; no server secrets required by static build |
| Hosted preview browser rendering | Main landmark and form module present; no overflow at inspected desktop width |

Local Chromium was blocked by the workspace's socket permissions. The six-width suite therefore ran successfully on GitHub Actions, with all Supabase requests intercepted before any synthetic form data could reach production. No customer records or production login credentials were used in tests.

The automated suite inspects page exceptions, HTTP document status, heading count, description, loaded broken images and document overflow. Failed network requests are recorded in JSON but are not all release assertions; it does not prove every external link, deferred image, console message or third-party resource is healthy. Layouts were checked with reduced motion enabled; complete motion, contrast, screen-reader and touch interaction testing remains a separate review.

## Backend inspection update

Read-only catalog queries confirmed the deployed RPC exists and inspected current policy/function definitions without reading customer rows. Unlike the older repository schema, current manager data policies include an owner-profile restriction. The public request RPC validates input, restricts request type, assigns pending status, sets an empty search_path, and includes a contact-based 60-second repeat guard plus a 100-requests/5-minutes flood guard.

These observations resolve the earlier assumption that the live policies necessarily match the older broad membership policies. They do not prove complete server authorization or effective rate limiting across every writable endpoint. No production database mutations or role tests were performed.

## Remaining risks and decisions

- Medium, confirmed: Arabic/Arabizi translation is incomplete; form feedback and portions of the page remain English. Full translation and screen-reader language markup need completion.
- Medium, confirmed: retention period, deletion/export operations and countries served have not been supplied for a complete privacy notice. The quote form has a purpose/recipient/contact explanation, not a legal compliance claim.
- Medium, decision needed: two service pages still have intentional-looking noindex directives. Confirm final content before enabling indexing and adding them to the sitemap.
- Needs checking: complete manager role/session/recovery integration testing in an isolated environment; direct-write grants and all abuse-prevention paths; real staging request delivery; external asset rights; external link inventory; Core Web Vitals/Lighthouse baseline, backups and monitoring.
- GitHub auto-deployment is not linked: Vercel rejected Git linking because the Vercel account lacks a GitHub Login Connection. This release used authenticated direct source upload. Future GitHub changes do not automatically deploy to this Vercel project until Git integration is connected.
- No domain migration or permanent redirects were applied. Before making Vercel the primary public/search host, update all canonical, OG, schema, sitemap, robots and 404 destinations together and verify the old-host redirect strategy.

## Repeat deployment and rollback

For future releases, run the checks and six-width workflow on the exact release source first. Connect Vercel's GitHub Login Connection to link this repository, or continue deploying reviewed source directly. Use Node 24, framework Other, install `npm ci --ignore-scripts`, output `dist`, and the checked-in build command. No private environment variables are needed by this static website.

Rollback anchor for a later Vercel release:

```bash
vercel rollback dpl_4EXFXHVzKawVY3zx2URdefe3GGeW --scope dareqo-digital
```

Equivalent dashboard action: open Dareqo Digital project → Deployments → find `dpl_4EXFXHVzKawVY3zx2URdefe3GGeW` → menu → Instant Rollback. The CLI command is documented for recovery and was not executed. Rollback disables production auto-assignment until a subsequent explicit promotion.

This is the first production deployment in the new Vercel project, so it has no older Vercel release to restore. For this initial rollout, the unchanged GitHub Pages website remains the fallback. Do not redirect existing customer traffic until the remaining migration decisions are resolved. No database rollback is needed: no database changes were made.
