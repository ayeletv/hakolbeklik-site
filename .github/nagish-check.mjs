// בדיקת נגישות שבועית לפי ת"י 5568 (WCAG 2.0 AA), וגם המלצות WCAG 2.1/2.2.
// רץ ב-GitHub Actions. לא שולח מייל: הדוח נשמר בלשונית Actions. את רוב מה שחסר כפתור הנגישות (nagish.js) מתקן לבד באתר.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const axeSrc = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const urls = (process.env.NAGISH_URLS || '').split(/\s+/).filter(Boolean);
const browser = await chromium.launch();
let mustFix = 0, lines = ['# דוח נגישות', '', 'תאריך: ' + new Date().toISOString().slice(0, 10), ''];
for (const url of urls) {
  for (const [name, vp] of [['טלפון', { width: 390, height: 844 }], ['מחשב', { width: 1280, height: 900 }]]) {
    const page = await browser.newPage({ viewport: vp });
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(5000);
      await page.addScriptTag({ content: axeSrc });
      const v = await page.evaluate(async () => (await axe.run(document, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'], exclude: [['#nagish-host']]
      })).violations.map(x => ({ id: x.id, help: x.help, law: x.tags.includes('wcag2a') || x.tags.includes('wcag2aa'),
        n: x.nodes.length, where: x.nodes.slice(0, 3).map(n => n.target.join(' ')) })));
      lines.push(`## ${url} (${name})`, '');
      if (!v.length) lines.push('אין בעיות אוטומטיות.', '');
      for (const x of v) {
        if (x.law) mustFix++;
        lines.push(`- ${x.law ? '**חובה לפי התקן**' : 'המלצה'} · ${x.id} (${x.n}): ${x.help}`, ...x.where.map(w => `  - \`${w}\``));
      }
      lines.push('');
    } catch (e) { lines.push(`## ${url} (${name})`, '', 'הדף לא נטען: ' + e.message, ''); mustFix++; }
    await page.close();
  }
}
await browser.close();
const report = lines.join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) (await import('node:fs')).appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
if (mustFix) console.log(`נמצאו ${mustFix} בעיות שחובה לתקן לפי ת"י 5568. כדאי לבקש מ-Claude לתקן אותן בקוד.`);
