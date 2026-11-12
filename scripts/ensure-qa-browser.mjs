import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';
try {
  const browser = await chromium.launch();
  await browser.close();
} catch (error) {
  if (!error.message.includes("Executable doesn't exist")) throw error;
  console.log('[QA] Installing Playwright Chromium headless shell (first run only)');
  const result = spawnSync(process.execPath, ['node_modules/playwright/cli.js', 'install', '--only-shell', 'chromium'], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
