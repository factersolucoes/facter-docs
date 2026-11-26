// Renders the thumbnails of a mockup flow canvas: one PNG per frame of flow.json, plus thumbs.json with each frame's size.
// Usage (dev server running): NODE_PATH=<a node_modules with playwright> node scripts/mockup-flow-thumbs.mjs truck/preventiva-agenda [http://localhost:3010]
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {chromium} = require('playwright');

const [mockup, base = 'http://localhost:3010'] = process.argv.slice(2);
if (!mockup) {
  console.error('usage: node scripts/mockup-flow-thumbs.mjs <product>/<mockup> [baseUrl]');
  process.exit(1);
}
const folder = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'static', 'mockups', mockup);
const flow = JSON.parse(fs.readFileSync(path.join(folder, 'flow.json'), 'utf8'));
const outDir = path.join(folder, 'flow');
fs.mkdirSync(outDir, {recursive: true});

// Half resolution keeps the folder small; the canvas swaps to the live page when zoomed in.
const THUMB_SCALE = 0.5;

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1700, height: 1400}, deviceScaleFactor: THUMB_SCALE});
const sizes = {};
for (const frame of flow.frames) {
  const params = new URLSearchParams({frame: frame.frame});
  if (frame.state) params.set('state', frame.state);
  if (frame.theme) params.set('theme', frame.theme);
  await page.goto(`${base}/mockups/${mockup}/${flow.mockup ?? 'index.html'}?${params}`);
  await page.waitForSelector('html.fx-frame-ready', {timeout: 15000});
  await page.waitForTimeout(250);
  const device = page.locator('.fx-fm-target .fx-device').first();
  const box = await device.boundingBox();
  if (!box) {
    console.warn(`skip ${frame.id}: frame ${frame.frame} not found`);
    continue;
  }
  await device.screenshot({path: path.join(outDir, `${frame.id}.png`), omitBackground: true});
  sizes[frame.id] = {width: Math.ceil(box.width), height: Math.ceil(box.height)};
  console.log(`${frame.id} ${sizes[frame.id].width}x${sizes[frame.id].height}`);
}
await browser.close();
fs.writeFileSync(path.join(outDir, 'thumbs.json'), `${JSON.stringify({generatedAt: new Date().toISOString(), frames: sizes}, null, 2)}\n`);
