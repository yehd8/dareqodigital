import { cpSync, mkdirSync, rmSync } from 'node:fs';
export const publicFiles = ['index.html', 'request-form.js', 'quality.css', '404.html', 'manager.html', 'reset-password.html', 'document.html', 'dareqo-digital-logo.svg', 'manager-core.js', 'manager-actions.js', 'manager-expenses.js', 'manager-customer-editor.js', 'web-design-lebanon.html', 'business-management-system-lebanon.html', 'local-seo-lebanon.html', 'robots.txt', 'sitemap.xml', '.nojekyll', 'barber-demo', 'fashion-demo', 'restaurant-demo', 'cafe-demo', 'business-manager-demo', 'perfume-demo', 'car-detailing-demo'];
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
for (const file of publicFiles) cpSync(file, `dist/${file}`, { recursive: true });
console.log('Built static site in dist/ using an explicit public-file allowlist.');
