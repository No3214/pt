#!/usr/bin/env node
/**
 * ARENA Verify — Playwright otomatik live-site doğrulama
 * Kullanım: node scripts/arena-verify.mjs
 * AUTOPILOT.bat son adımından çağrılır.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const TARGETS = [
  'https://arena.kozbeylikonagi.com.tr',
  'https://pt.kozbeylikonagi.com.tr',
];

const ROUTES = [
  { path: '/',          name: 'home',       critical: true  },
  { path: '/programlar',name: 'programs',   critical: true  },
  { path: '/galeri',    name: 'gallery',    critical: true  },
  { path: '/iletisim',  name: 'contact',    critical: true  },
  { path: '/giris',     name: 'login',      critical: false },
  { path: '/portal',    name: 'portal',     critical: false },
];

const VIEWPORTS = [
  { label: 'desktop', w: 1440, h: 900  },
  { label: 'mobile',  w: 375,  h: 667  },
];

const ROOT        = path.resolve(process.cwd());
const REPORT_DIR  = path.join(ROOT, 'reports');
const SHOT_DIR    = path.join(REPORT_DIR, 'shots');
const TIMESTAMP   = new Date().toISOString().replace(/[:.]/g, '-');
const REPORT_PATH = path.join(REPORT_DIR, `verify-${TIMESTAMP}.json`);
const LATEST_PATH = path.join(REPORT_DIR, 'verify-latest.json');

const IGNORE_CONSOLE_PATTERNS = [
  /Download the React DevTools/i,
  /Service Worker registered/i,
  /\[vite\]/i,
  /Google Tag/i,
];

const IGNORE_NETWORK_PATTERNS = [
  /fonts\.googleapis\.com/i,
  /google-analytics\.com/i,
  /gtag\/js/i,
];

async function ensurePlaywright() {
  try {
    // Chromium kurulu mu?
    execSync('npx playwright --version', { stdio: 'ignore' });
  } catch {
    console.log('[setup] Playwright kuruluyor...');
    execSync('npm i -D playwright@^1.47.0', { stdio: 'inherit' });
    execSync('npx playwright install chromium', { stdio: 'inherit' });
  }
  // Chromium binary var mi kontrol
  try {
    execSync('npx playwright install chromium --with-deps', { stdio: 'ignore' });
  } catch {
    execSync('npx playwright install chromium', { stdio: 'inherit' });
  }
}

async function checkRoute(page, target, route, viewport) {
  const url = target + route.path;
  const consoleErrors = [];
  const consoleWarnings = [];
  const pageErrors = [];
  const networkFailures = [];

  const onConsole = (msg) => {
    const text = msg.text();
    if (IGNORE_CONSOLE_PATTERNS.some(p => p.test(text))) return;
    if (msg.type() === 'error') consoleErrors.push(text);
    else if (msg.type() === 'warning') consoleWarnings.push(text);
  };
  const onPageError = (err) => pageErrors.push(err.message || String(err));
  const onResponse = (resp) => {
    const rurl = resp.url();
    const status = resp.status();
    if (status >= 400 && status < 600) {
      if (IGNORE_NETWORK_PATTERNS.some(p => p.test(rurl))) return;
      networkFailures.push({ url: rurl, status });
    }
  };

  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('response', onResponse);

  let status = 0;
  let bodyTextLength = 0;
  let screenshot = null;
  let title = '';
  let error = null;

  try {
    await page.setViewportSize({ width: viewport.w, height: viewport.h });
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    status = resp?.status() ?? 0;
    await page.waitForTimeout(1200); // anim settle

    title = await page.title();
    bodyTextLength = await page.evaluate(() => (document.body?.innerText || '').length);

    const shotFile = `${target.includes('arena') ? 'arena' : 'pt'}-${route.name}-${viewport.label}.png`;
    const shotPath = path.join(SHOT_DIR, shotFile);
    await page.screenshot({ path: shotPath, fullPage: false });
    screenshot = path.relative(ROOT, shotPath).replace(/\\/g, '/');
  } catch (e) {
    error = e.message || String(e);
  } finally {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
    page.off('response', onResponse);
  }

  const blank = bodyTextLength < 80;
  const verdict = error || status >= 400 || blank || pageErrors.length || networkFailures.some(n => n.status >= 500)
    ? 'FAIL'
    : (consoleErrors.length || networkFailures.length) ? 'WARN' : 'PASS';

  return {
    target, path: route.path, name: route.name, viewport: viewport.label,
    url, status, title, bodyTextLength, blank,
    consoleErrors, consoleWarnings, pageErrors, networkFailures,
    screenshot, error, verdict, critical: route.critical,
  };
}

async function main() {
  console.log('[verify] ARENA otomatik doğrulama başlıyor...');
  await ensurePlaywright();

  if (!existsSync(REPORT_DIR)) await mkdir(REPORT_DIR, { recursive: true });
  if (!existsSync(SHOT_DIR))   await mkdir(SHOT_DIR,   { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 ArenaVerify/1.0 Playwright',
    locale: 'tr-TR',
  });
  const page = await context.newPage();

  const results = [];
  for (const target of TARGETS) {
    console.log(`\n[verify] Target: ${target}`);
    for (const route of ROUTES) {
      for (const vp of VIEWPORTS) {
        process.stdout.write(`  ${route.path} (${vp.label})... `);
        const r = await checkRoute(page, target, route, vp);
        results.push(r);
        console.log(`${r.verdict} (${r.status}, ${r.bodyTextLength}b)`);
      }
    }
  }

  await browser.close();

  const fails = results.filter(r => r.verdict === 'FAIL');
  const warns = results.filter(r => r.verdict === 'WARN');
  const report = {
    timestamp: TIMESTAMP,
    targets: TARGETS,
    routeCount: ROUTES.length,
    viewportCount: VIEWPORTS.length,
    totalChecks: results.length,
    results,
    failCount: fails.length,
    warnCount: warns.length,
    verdict: fails.length ? 'FAIL' : warns.length ? 'WARN' : 'PASS',
  };

  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');
  await writeFile(LATEST_PATH, JSON.stringify(report, null, 2), 'utf8');

  console.log('\n════════════════════════════════════════');
  console.log(`  VERDICT: ${report.verdict}`);
  console.log(`  Total: ${report.totalChecks} | FAIL: ${fails.length} | WARN: ${warns.length}`);
  console.log(`  Report: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log(`  Shots:  ${path.relative(ROOT, SHOT_DIR)}/`);
  console.log('════════════════════════════════════════');

  if (fails.length) {
    console.log('\nKRİTİK HATALAR:');
    for (const f of fails) {
      console.log(`  ✘ ${f.url} (${f.viewport})`);
      if (f.error) console.log(`     error: ${f.error}`);
      if (f.status >= 400) console.log(`     HTTP ${f.status}`);
      if (f.blank) console.log(`     BLANK (body ${f.bodyTextLength}b)`);
      for (const e of f.pageErrors.slice(0, 3)) console.log(`     pageerror: ${e}`);
      for (const n of f.networkFailures.slice(0, 3)) console.log(`     net ${n.status}: ${n.url}`);
    }
    process.exit(1);
  }

  if (warns.length) {
    console.log('\nUYARILAR:');
    for (const w of warns.slice(0, 5)) {
      console.log(`  ⚠ ${w.url} (${w.viewport}) — ${w.consoleErrors.length} console, ${w.networkFailures.length} net`);
    }
  }

  process.exit(0);
}

main().catch((e) => {
  console.error('[verify] FATAL:', e);
  process.exit(2);
});
