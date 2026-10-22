import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ConfigError, loadConfig } from '../config.mjs';

const valid = 'WORKSHOP_TITLE="Field Lab"\nWORKSHOP_ACCENT=teal\nWORKSHOP_BANNER="Synthetic data only"\n';

async function fixture(t, source) {
  const root = await mkdtemp(join(tmpdir(), 'workshop-config-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  if (source !== undefined) await writeFile(join(root, '.env'), source);
  return root;
}

test('loads only the three public fields from LF and CRLF dotenv files', async (t) => {
  for (const newline of ['\n', '\r\n']) {
    const root = await fixture(t, `${valid}PRIVATE_TRAINING_SENTINEL=not-for-the-browser\n`.replaceAll('\n', newline));
    const config = await loadConfig(root);
    assert.deepEqual(config, { title: 'Field Lab', accent: 'teal', banner: 'Synthetic data only' });
    assert.ok(Object.isFrozen(config));
  }
});

test('missing configuration fails rather than silently using defaults', async (t) => {
  const root = await fixture(t);
  await assert.rejects(loadConfig(root), { name: 'Error', message: /Missing \.env/ });
});

test('invalid required fields fail with bounded errors that omit their values', async (t) => {
  const cases = [
    ['', /WORKSHOP_TITLE/],
    [valid.replace('"Field Lab"', '""'), /WORKSHOP_TITLE/],
    [valid.replace('"Field Lab"', `"${'x'.repeat(65)}"`), /WORKSHOP_TITLE/],
    [valid.replace('"Synthetic data only"', `"${'x'.repeat(141)}"`), /WORKSHOP_BANNER/],
    [valid.replace('"Field Lab"', '"Field\nLab"'), /WORKSHOP_TITLE/],
    [valid.replace('teal', 'not-a-palette'), /WORKSHOP_ACCENT/],
    [valid.replace('WORKSHOP_BANNER=', 'UNRECOGNIZED='), /WORKSHOP_BANNER/]
  ];
  for (const [source, message] of cases) {
    const root = await fixture(t, source);
    await assert.rejects(loadConfig(root), (error) => {
      assert.ok(error instanceof ConfigError);
      assert.match(error.message, message);
      assert.ok(!error.message.includes('not-a-palette'));
      return true;
    });
  }
});

test('all supported accent names load; markup stays data', async (t) => {
  for (const accent of ['teal', 'blue', 'violet']) {
    const root = await fixture(t, valid.replace('teal', accent).replace('Field Lab', '<b>Training</b>'));
    assert.deepEqual(await loadConfig(root), {
      title: '<b>Training</b>', banner: 'Synthetic data only', accent
    });
  }
});
