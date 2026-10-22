import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { startWorkshop } from '../server.mjs';

async function workspace(t, title) {
  const root = await mkdtemp(join(tmpdir(), 'workshop-server-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  execFileSync('git', ['init', '--quiet', '--initial-branch=training'], { cwd: root });
  await writeFile(join(root, '.env'), `WORKSHOP_TITLE="${title}"\nWORKSHOP_ACCENT=blue\nWORKSHOP_BANNER="Synthetic fixture"\nPRIVATE_TRAINING_SENTINEL=never-expose-this\n`);
  return root;
}

async function start(t, root) {
  const app = await startWorkshop(root);
  t.after(() => new Promise((resolve, reject) => {
    app.server.close((error) => error ? reject(error) : resolve());
    app.server.closeAllConnections();
  }));
  return app;
}

test('concurrent workspaces have distinct ports, instances, identity and config', async (t) => {
  const roots = await Promise.all([workspace(t, 'Training Alpha'), workspace(t, 'Training Beta')]);
  const apps = await Promise.all(roots.map((root) => start(t, root)));
  const boards = await Promise.all(apps.map(async ({ url }) => (await fetch(`${url}/api/board`)).json()));
  assert.notEqual(apps[0].url, apps[1].url);
  assert.notEqual(boards[0].workspace.instance, boards[1].workspace.instance);
  assert.deepEqual(boards.map((board) => board.config.title), ['Training Alpha', 'Training Beta']);
  for (const [index, board] of boards.entries()) {
    assert.equal(apps[index].server.address().address, '127.0.0.1');
    assert.equal(board.workspace.name, basename(roots[index]));
    assert.equal(board.workspace.branch, 'training');
    assert.equal(board.workspace.port, apps[index].server.address().port);
    assert.equal(board.issues.length, 6);
    assert.deepEqual(Object.keys(board.config).sort(), ['accent', 'banner', 'title']);
    assert.ok(!JSON.stringify(board).includes('never-expose-this'));
    assert.ok(!JSON.stringify(board).includes(roots[index]));
  }
});

test('serves only named public assets, with no environment or filesystem endpoint', async (t) => {
  const { url } = await start(t, await workspace(t, 'HTTP training'));
  for (const [path, type] of [['/', 'text/html'], ['/app.mjs', 'text/javascript'], ['/board.mjs', 'text/javascript'], ['/styles.css', 'text/css']]) {
    const response = await fetch(`${url}${path}`);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').startsWith(type));
    assert.ok((await response.text()).length > 0);
    assert.match(response.headers.get('content-security-policy'), /script-src 'self'/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  for (const path of ['/.env', '/.env.example', '/config.mjs', '/package.json', '/.git/config', '/%2e%2e/.env', '/missing']) {
    const response = await fetch(`${url}${path}`);
    assert.equal(response.status, 404, path);
    assert.equal(await response.text(), 'Not found');
  }
  const head = await fetch(url, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  const post = await fetch(`${url}/api/board`, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
});

test('CLI exits clearly for missing config before starting a server', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'workshop-missing-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [join(import.meta.dirname, '..', 'server.mjs')], {
    cwd: root, encoding: 'utf8', timeout: 5000
  });
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /^error: Missing \.env/);
  assert.ok(!result.stderr.includes('at loadConfig'));
  assert.equal(result.stdout, '');
});
