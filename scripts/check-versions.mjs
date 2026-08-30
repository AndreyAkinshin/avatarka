import { readFile } from 'node:fs/promises';

const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

function assertSemver(version, source) {
  if (!SEMVER_PATTERN.test(version)) {
    throw new Error(`${source} must contain a valid SemVer version (got: ${version})`);
  }
}

async function readPackageVersion(path) {
  const packageJson = JSON.parse(await readFile(path, 'utf8'));
  return packageJson.version;
}

const candidateIndex = process.argv.indexOf('--candidate');
if (candidateIndex !== -1) {
  const candidate = process.argv[candidateIndex + 1];
  if (candidate === undefined) throw new Error('Missing version after --candidate');
  assertSemver(candidate, 'Requested version');
  process.exit(0);
}

const expected = (await readFile(new URL('../VERSION', import.meta.url), 'utf8')).trim();
assertSemver(expected, 'VERSION');

const packagePaths = [
  new URL('../packages/avatarka/package.json', import.meta.url),
  new URL('../packages/avatarka-react/package.json', import.meta.url),
];

for (const path of packagePaths) {
  const actual = await readPackageVersion(path);
  if (actual !== expected) {
    throw new Error(
      `${path.pathname} has version ${String(actual)}; expected ${expected}`,
    );
  }
}

console.log(`Package versions are aligned at ${expected}`);
