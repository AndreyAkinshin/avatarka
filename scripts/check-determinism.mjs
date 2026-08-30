import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Raw JSON bytes are part of recipe protocol v1. Avatarka v4 is still
// unreleased, so the canonical 50-style Folks, 50-role Adventurers,
// 50-species Critters, 50-body Oddlings, 50-topology Bots, 50-snack Snacks,
// 50-dwelling Nooks, and 50-symbol Orbs catalogs intentionally establish the
// cumulative preview-free baseline. The permanent friendly Bots mouth is part
// of that reviewed artwork change. Deepest-skin Folks and Adventurers facial
// marks use reviewed tonal pigments and raster-safe strokes. The audited Orbs
// authorship pass establishes clearer symbol silhouettes and protected negative
// spaces in the same unreleased baseline. The species-specific salamander,
// toad, whale, dolphin, manta-ray, and clownfish silhouettes establish the
// reviewed Critters semantic-clarity artwork bytes. Firehouse, moon-base, and
// stilt-house use reviewed dwelling-specific architectural silhouettes, while
// off-theme natural flag accents are curated out of the Nooks catalog. The
// authored Bots hardware pass replaces the blanket antenna motif with
// chassis-specific cues and gives the construction row distinct silhouettes;
// natural antennas are now sparse, semantic secondary traits rather than a
// gallery quota. Berry, pretzel, croissant, and bell-pepper use reviewed
// food-specific silhouettes, negative spaces, and sparse authored limbs. The
// authored surfboard/wave and supernatural-investigator cues establish the
// reviewed surfer and ghost-hunter role identities without changing the
// canonical Adventurers catalog. The bounded no-repeat gallery scheduler and
// its primary-only recipe traits likewise establish the reviewed v4 gallery
// protocol bytes. The reviewed polish pass redraws the Folks spiky crown, the
// Oddlings bridge and monolith faces, the Critters dolphin and chameleon
// silhouettes, and the Snacks croissant crescent without touching any catalog
// order, name, or schema. The second reviewed polish pass redraws the
// Adventurers gladiator and time-traveler gear, the Critters toucan, alpaca,
// and crab, the Bots pyramid and excavator chassis, the Oddlings sprout and
// zigzag, and the Nooks submarine-nook hull under the same reviewed-baseline
// terms. The third reviewed polish pass redraws the Adventurers exobiologist
// and mech-pilot gear, the Critters salamander body, the Oddlings zigzag bolt
// and monolith carving, the Bots crossframe girder, the Snacks tofu block, the
// Nooks tower turret, and the Orbs music-note and ampersand silhouettes under
// the same reviewed-baseline terms. The fourth reviewed polish pass redraws the
// Orbs rainbow, quote, and arrow silhouettes, the Oddlings wedge and saddle
// bodies, the Snacks baguette loaf and bell-pepper lobes, and the Nooks
// cloud-home, shell-house, and beehive-home dwellings under the same
// reviewed-baseline terms. The fifth reviewed polish pass redraws the
// Critters snake coil and crocodile head, the Oddlings caterpillar segments
// and elbow tube, the Snacks waffle pockets, chocolate bar, and citrus slice,
// the Orbs fold corner, the Folks high-top fade, and the Nooks
// tree-stump-home trunk under the same reviewed-baseline terms. The sixth
// reviewed pass fixes systemic frame issues: Folks hairstyles gain a shared
// scalp-coverage underlay so no style shows accidental bald patches, Critters
// coat tones are guarded against blending into each palette's canvas tone,
// and Bots and Snacks gain per-type presence scales so smaller identities
// fill the circular frame without touching its ceiling. A reviewed follow-up
// closes the center-part scalp strip on the thirteen two-panel Folks
// hairstyles with a shared center panel. A reviewed follow-up gives the
// Folks theme real geometric frame fitting like every other theme: garment
// hems follow the avatar circle arc instead of relying on a CSS clip that
// exports and image pipelines ignore. The seventh reviewed polish pass
// redraws the Critters toucan head and gecko body, the Oddlings glider
// delta, the Orbs keyhole and ticket silhouettes, the Bots gyroscope
// gimbal, the Snacks tofu block and donut ring, and the Adventurers
// kayaker gear under the same reviewed-baseline terms. The eighth reviewed
// pass rebuilds the weak Folks hairstyles: high-top, undercut, slick-back,
// and victory-rolls stop reading as bald or detached, cornrows gain raised
// rows, short styles gain temple sideburns, and the translucent buzzed scalp
// variant is removed in favor of dense coverage. A reviewed follow-up closes
// the remaining bald patches: mullet and shag fringe notches, the side-braid
// receding sweep, and skin wedges around every bun style.
// There is no released v4 corpus to preserve
// and no protocol bump is warranted.
const EXPECTED_DIGEST = '1be9c41cef876d46edbef2ff310774ae78fd7a78106662ace87ba16842011378';
const scriptPath = fileURLToPath(import.meta.url);

async function loadApi(format) {
  if (format === 'esm') {
    return import('../packages/avatarka/dist/index.js');
  }
  if (format === 'cjs') {
    return createRequire(import.meta.url)('../packages/avatarka/dist/index.cjs');
  }
  throw new Error(`Unknown module format: ${String(format)}`);
}

function sameBytes(left, right, label) {
  if (JSON.stringify(left) !== JSON.stringify(right)) {
    throw new Error(`Determinism mismatch: ${label}`);
  }
}

async function createCorpus(format) {
  const api = await loadApi(format);
  const rows = [];
  const seeds = [
    '',
    'identity-42',
    'idéntity-🦊',
    'quote"\nseed',
    0,
    -12,
    1.5,
    9007199254740991,
  ];
  const namespace = 'protocol-v1/сайт/東京';

  const remember = (label, avatar) => {
    const repeated = api.createAvatar(avatar.theme, avatar.recipe.seed, {
      namespace: avatar.recipe.namespace,
      ...(avatar.recipe.palette !== undefined
        ? { palette: avatar.recipe.palette }
        : {}),
      ...(avatar.recipe.backgroundShape !== undefined
        ? { backgroundShape: avatar.recipe.backgroundShape }
        : {}),
      ...(avatar.recipe.traits !== undefined
        ? { traits: avatar.recipe.traits }
        : {}),
    });
    const restored = api.createAvatar(api.parseRecipe(
      JSON.parse(JSON.stringify(avatar.recipe)),
    ));
    sameBytes(avatar, repeated, `${label} repeated call`);
    sameBytes(avatar, restored, `${label} recipe replay`);
    rows.push([label, avatar]);
  };

  for (const theme of api.themeNames) {
    for (const seed of seeds) {
      remember(
        `identity:${theme}:${typeof seed}:${String(seed)}`,
        api.createAvatar(theme, seed, { namespace }),
      );
    }

    for (const palette of api.paletteNames) {
      for (const backgroundShape of api.backgroundShapeNames) {
        remember(
          `presentation:${theme}:${palette}:${backgroundShape}`,
          api.createAvatar(theme, 'presentation-matrix', {
            namespace,
            palette,
            backgroundShape,
          }),
        );
      }
    }

    for (const [field, definition] of Object.entries(api.getTheme(theme).schema)) {
      if (
        definition.type !== 'select'
        || field === 'palette'
        || field === 'backgroundShape'
      ) {
        continue;
      }
      for (const option of definition.options) {
        remember(
          `trait:${theme}:${field}:${option}`,
          api.createAvatar(theme, `trait:${field}:${option}`, {
            namespace,
            traits: { [field]: option },
          }),
        );
      }
    }

    const gallery = api.generateGallery(11, `gallery:${theme}`, {
      themes: [theme],
      namespace,
      backgroundShape: 'circle',
    });
    sameBytes(gallery, api.generateGallery(11, `gallery:${theme}`, {
      themes: [theme],
      namespace,
      backgroundShape: 'circle',
    }), `gallery:${theme}`);
    for (const [index, avatar] of gallery.entries()) {
      sameBytes(
        avatar,
        api.createAvatar(avatar.recipe),
        `gallery:${theme}:${index} recipe replay`,
      );
    }
    rows.push([`gallery:${theme}`, gallery]);
  }

  const mixedGallery = api.generateGallery(19, 'mixed-gallery', {
    themes: [...api.themeNames].reverse(),
    namespace,
    backgroundShape: 'rounded',
  });
  sameBytes(mixedGallery, api.generateGallery(19, 'mixed-gallery', {
    themes: api.themeNames,
    namespace,
    backgroundShape: 'rounded',
  }), 'canonical mixed gallery theme set');
  rows.push(['gallery:mixed', mixedGallery]);

  const serialized = JSON.stringify(rows);
  return {
    bytes: Buffer.byteLength(serialized),
    cases: rows.length,
    digest: createHash('sha256').update(serialized).digest('hex'),
    format,
    node: process.versions.node,
  };
}

const childIndex = process.argv.indexOf('--child');
if (childIndex !== -1) {
  const result = await createCorpus(process.argv[childIndex + 1]);
  process.stdout.write(JSON.stringify(result));
} else {
  const results = ['esm', 'cjs'].map((format) => {
    const child = spawnSync(process.execPath, [scriptPath, '--child', format], {
      encoding: 'utf8',
    });
    if (child.status !== 0) {
      throw new Error(
        `${format.toUpperCase()} determinism child failed:\n${child.stderr || child.stdout}`,
      );
    }
    return JSON.parse(child.stdout);
  });

  const [esm, cjs] = results;
  if (esm.digest !== cjs.digest || esm.cases !== cjs.cases || esm.bytes !== cjs.bytes) {
    throw new Error(`ESM/CJS determinism mismatch: ${JSON.stringify(results)}`);
  }

  if (!process.argv.includes('--print') && esm.digest !== EXPECTED_DIGEST) {
    throw new Error(
      `Recipe protocol v1 digest changed: ${esm.digest} (expected ${EXPECTED_DIGEST})`,
    );
  }

  console.log(
    `Recipe protocol v1: ${esm.cases} cases, ${esm.bytes} bytes, sha256 ${esm.digest} (Node ${esm.node}, ESM/CJS)`,
  );
}
