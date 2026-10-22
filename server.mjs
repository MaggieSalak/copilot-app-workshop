import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ConfigError, loadConfig } from './config.mjs';
import { seedIssues } from './public/board.mjs';

const publicRoot = join(import.meta.dirname, 'public');
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.mjs', ['app.mjs', 'text/javascript; charset=utf-8']],
  ['/board.mjs', ['board.mjs', 'text/javascript; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']]
]);

export async function startWorkshop(root = process.cwd()) {
  const config = await loadConfig(root);
  // Read every asset before listening: missing assets must fail startup.
  const content = new Map(await Promise.all([...assets].map(async ([url, [file, type]]) =>
    [url, { body: await readFile(join(publicRoot, file)), type }]
  )));
  const branch = execFileSync('git', ['branch', '--show-current'], {
    cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
  }).trim() || 'detached HEAD';
  const workspace = { name: basename(root), branch, instance: randomUUID().slice(0, 8) };
  const server = createServer((request, response) => {
    const headers = {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      'Referrer-Policy': 'no-referrer'
    };
    const send = (code, type, body, extra = {}) => {
      response.writeHead(code, { ...headers, 'Content-Type': type, ...extra });
      response.end(request.method === 'HEAD' ? undefined : body);
    };
    if (!['GET', 'HEAD'].includes(request.method)) {
      send(405, 'text/plain; charset=utf-8', 'Method not allowed', { Allow: 'GET, HEAD' });
      return;
    }
    if (request.url === '/api/board') {
      send(200, 'application/json; charset=utf-8', JSON.stringify({
        config, workspace: { ...workspace, port: server.address().port }, issues: seedIssues
      }));
      return;
    }
    const asset = content.get(request.url);
    if (!asset) {
      send(404, 'text/plain; charset=utf-8', 'Not found');
      return;
    }
    send(200, asset.type, asset.body);
  });
  await new Promise((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.removeListener('error', reject);
      resolveListen();
    });
  });
  return { server, url: `http://127.0.0.1:${server.address().port}`, workspace };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { server, url, workspace } = await startWorkshop();
    console.log(`Workspace: ${workspace.name} | branch: ${workspace.branch} | instance: ${workspace.instance}`);
    console.log(`Local: ${url}`);
    const stop = () => {
      server.close();
      server.closeIdleConnections();
    };
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error(`error: ${error.message}`);
      process.exitCode = 1;
    } else {
      throw error;
    }
  }
}
