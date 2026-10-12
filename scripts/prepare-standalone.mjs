// Copies the static assets a standalone Next.js build needs next to its
// server.js, so `.next/standalone` can be uploaded and run on its own:
//   node .next/standalone/server.js
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const out = join(root, '.next', 'standalone');

if (!existsSync(join(out, 'server.js'))) {
  console.error('No standalone build found. Run `next build` with output: "standalone" first.');
  process.exit(1);
}

cpSync(join(root, 'public'), join(out, 'public'), { recursive: true });
cpSync(join(root, '.next', 'static'), join(out, '.next', 'static'), { recursive: true });

// Passenger (cPanel "Setup Node.js App") restarts the app when this file changes.
mkdirSync(join(out, 'tmp'), { recursive: true });
writeFileSync(join(out, 'tmp', 'restart.txt'), new Date().toISOString());

console.log('Standalone build ready in .next/standalone');
