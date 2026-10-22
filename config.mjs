import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseEnv } from 'node:util';

export class ConfigError extends Error {}

export async function loadConfig(root) {
  let source;
  try {
    source = await readFile(join(root, '.env'), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new ConfigError('Missing .env in this workspace. Follow the README pre-work or explicit manual fallback.');
    }
    if (['EACCES', 'EPERM', 'EISDIR'].includes(error.code)) {
      throw new ConfigError('Cannot read .env in this workspace. Check its file type and permissions.');
    }
    throw error;
  }

  const env = parseEnv(source);
  const text = (key, limit) => {
    const value = env[key]?.trim();
    if (!value || value.length > limit || /[\u0000-\u001f\u007f]/u.test(value)) {
      throw new ConfigError(`${key} must contain 1-${limit} characters on a single line.`);
    }
    return value;
  };
  const title = text('WORKSHOP_TITLE', 64);
  const banner = text('WORKSHOP_BANNER', 140);
  const accent = text('WORKSHOP_ACCENT', 16);
  if (!['teal', 'blue', 'violet'].includes(accent)) {
    throw new ConfigError('WORKSHOP_ACCENT must be teal, blue, or violet.');
  }
  return Object.freeze({ title, banner, accent });
}
