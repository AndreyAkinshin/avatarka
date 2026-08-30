import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const forbiddenContent = [
  'AVATARKA_DEV_CATALOG_REVIEW_ONLY',
  'Gallery 25',
  'Catalog 50',
  'catalog-review-switch',
  'app--catalog-review',
  'catalog-review:balanced-palette-schedule:v1',
];

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  }));
  return files.flat();
}

const files = await filesBelow(distDirectory);
for (const file of files) {
  const name = relative(distDirectory, file);
  if (name.toLowerCase().includes('catalogreview')) {
    throw new Error(`Development catalog review chunk leaked into production: ${name}`);
  }
  if (!['.html', '.js', '.css'].includes(extname(file))) continue;
  const content = await readFile(file, 'utf8');
  for (const forbidden of forbiddenContent) {
    if (content.includes(forbidden)) {
      throw new Error(`Development catalog review sentinel leaked into production ${name}: ${forbidden}`);
    }
  }
}

console.log(`Production demo is free of development catalog review artifacts (${files.length} files checked)`);
