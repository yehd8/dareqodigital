# Demo link visibility update — 18 November 2026

## Summary
All seven demo previews display a prominent “View live demo” action. Each preview image remains clickable, with a larger blue button beneath it. Navigation now labels the section “Demos”. English, Arabic and Arabizi text is supported.

## Changed files
- index.html: visible demo actions, instructions and navigation label.
- studio.css: contrasting actions, 48px caption buttons and keyboard focus.
- studio.js: translated labels and instructions.
- scripts/browser-qa.mjs: verifies all seven buttons open their correct demo.
- docs/dareqo-demo-buttons.jpg: production screenshot.

## Testing performed
Local lint, type checking, nine unit tests, production build and git diff checks passed.
GitHub Actions: https://github.com/yehd8/dareqodigital/actions/runs/44405634689
Browser report: 24 page/viewport checks and 18 workflow checks; no recorded failures or console errors. Eight accessibility checks reported no violations. Widths: 320, 375, 768, 1024, 1440 and 1920px.
All seven demo buttons were clicked and verified in Playwright. Live production gallery was also inspected visually.
Form tests used mocked requests, without production customer data.

## Deployment
Source commit: 4296a7ab908bd08435279ba79b85e7c37576ad23
Preview (Vercel protection may require sign-in): https://dareqo-digital-5bqiis20m-dareqo-digital.vercel.app
Production: https://dareqo-digital.vercel.app/#demos
Production deployment: dpl_8FoTk8BbqyiTDLpfATd5HyPdSstw — READY.
Deployment is complete; use the production alias. Older immutable preview URLs will continue showing their older version.

## Remaining risks
Existing demo content and backend integrations were not changed. Automated accessibility checks do not establish full WCAG compliance. Real backend submissions and field performance were not measured for this presentation update.

## Rollback
Restore the preceding production design:
```sh
vercel rollback dpl_82uqwwGMyw7XC4GPXUAw8NxNsEmy --scope dareqo-digital
```
Alternatively, in Vercel → dareqo-digital → Deployments, open dpl_82uqwwGMyw7XC4GPXUAw8NxNsEmy and select the production rollback action.
