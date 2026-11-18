# Original URL publication — 19 November 2026

## Summary
Publish the approved ivory/champagne Dareqo Digital design at the existing address https://yehd8.github.io/dareqodigital/ . This is a GitHub Pages deployment of the tested website, without redirecting visitors to Vercel.

## Source and changed files
Application source matches the approved Vercel release (9eb6a88c6b1c0bab22be122a6b2b9462a6b4574f), plus documentation. The homepage, studio.css, studio.js, request-form.js, three service pages, shared foundations and build/test tooling are the existing reviewed changes recorded in IVORY-PREVIEW.md and REDESIGN-RELEASE.md.
GitHub Pages uses the updated .github/workflows/pages.yml: install pinned dependencies, run lint/type checking/unit tests/build, publish only dist/ through the existing GitHub Pages environment.
Previous main: cad32393d4cc41f5ccf510ba71de36a1c39fd49b.
Approved branch head before this publication: 3aa3e1bc56c8426192f8ba596e047ae315dbf0d3.
No new application feature or environment-variable requirement is added by this publication.

## Testing
Successful full browser/accessibility CI: https://github.com/yehd8/dareqodigital/actions/runs/44408756365 .
24 page-width checks at 320/375/768/1024/1440/1920px, 18 workflow records, eight axe checks, nine unit tests; no final reported failures/errors/violations. Form requests were intercepted with synthetic data.
Relative asset and demo URLs were reviewed for the /dareqodigital/ project prefix. Custom 404 links to the original site. Robots and canonical/sitemap already use the original URL.
The Pages publication runs its own static checks, type checking, unit tests and production build before upload.

## Remaining risks
Automated accessibility checks do not establish full compliance. Existing image-backed contrast, privacy/backend and field-performance limitations remain documented in IVORY-PREVIEW.md.
GitHub Pages serves static files; Vercel-specific response headers are not applied there. Existing HTML CSPs remain in the pages. No live customer data or production credentials are used for tests.
Vercel remains a separate deployment; future releases need to update the intended hosting destination.

## Deployment and recovery
The publication commit is merged to main with the previous main as its first parent, preserving history. The existing Pages push workflow publishes the static artifact.
Final workflow, live verification and exact rollback command are recorded below after completion.

## Verified publication result
GitHub Pages deployment succeeded: https://github.com/yehd8/dareqodigital/actions/runs/44410517075 .
Publication merge commit: fb728fc960e5049a171c6aac56951b13ecb1ec96.
Live production URL: https://yehd8.github.io/dareqodigital/ .
The live browser loaded the new layout directly at that address, with ivory background rgb(247,243,235), charcoal text rgb(36,35,32), both local stylesheets under /dareqodigital/, seven demo destinations resolving under that project prefix, and no desktop horizontal overflow.
Evidence: docs/dareqo-original-url-live.jpg. No further runtime files changed after the successful build.
Vercel preview remains available at https://dareqo-digital-93yjkeyhw-dareqo-digital.vercel.app (normal Vercel protection may require sign-in).

For future publication, push the reviewed source to main; the existing pages.yml workflow runs its build checks and deploys dist/. No environment secrets were added or changed.

Exact rollback from a clean, up-to-date main checkout:
```sh
git switch main
git pull --ff-only origin main
git revert -m 1 fb728fc960e5049a171c6aac56951b13ecb1ec96
git push origin main
```
This creates a normal history-preserving revert of the publication merge and triggers the Pages workflow. The rollback commands have not been executed. Verify the old URL after recovery. This rollback affects GitHub Pages; Vercel remains independently deployed.
