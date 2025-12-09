import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomColor, randomPick, wrapSvgWithShape, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  animalType: {
    type: 'select',
    default: 'cat',
    options: ['cat', 'dog', 'bear', 'bunny', 'fox', 'panda', 'owl', 'koala', 'penguin', 'lion'],
  },
  primaryColor: {
    type: 'color',
    default: '#e67e22',
  },
  secondaryColor: {
    type: 'color',
    default: '#ffffff',
  },
  eyeColor: {
    type: 'color',
    default: '#2ecc71',
  },
  backgroundColor: {
    type: 'color',
    default: '#ecf0f1',
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'sleepy', 'surprised', 'grumpy'],
  },
} as const satisfies ParamSchema;

export type AnimalParams = ParamsFromSchema<typeof schema>;

function generateCat(params: AnimalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression } = params;
  const darkPrimary = darkenColor(primaryColor, 30);

  // Cat ears
  const ears = `
    <polygon points="15,35 25,5 40,30" fill="${primaryColor}"/>
    <polygon points="20,32 27,12 37,30" fill="${lightenColor(primaryColor, 40)}"/>
    <polygon points="85,35 75,5 60,30" fill="${primaryColor}"/>
    <polygon points="80,32 73,12 63,30" fill="${lightenColor(primaryColor, 40)}"/>
  `;

  // Cat face
  const face = `
    <ellipse cx="50" cy="55" rx="38" ry="35" fill="${primaryColor}"/>
    <ellipse cx="50" cy="60" rx="25" ry="22" fill="${secondaryColor}"/>
  `;

  // Eyes based on expression
  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <ellipse cx="35" cy="50" rx="8" ry="9" fill="${eyeColor}"/>
        <ellipse cx="65" cy="50" rx="8" ry="9" fill="${eyeColor}"/>
        <ellipse cx="35" cy="51" rx="4" ry="6" fill="#2c3e50"/>
        <ellipse cx="65" cy="51" rx="4" ry="6" fill="#2c3e50"/>
        <circle cx="33" cy="48" r="2" fill="white"/>
        <circle cx="63" cy="48" r="2" fill="white"/>
      `;
      break;
    case 'sleepy':
      eyes = `
        <path d="M27,50 Q35,45 43,50" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M57,50 Q65,45 73,50" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <circle cx="35" cy="48" r="10" fill="${eyeColor}"/>
        <circle cx="65" cy="48" r="10" fill="${eyeColor}"/>
        <circle cx="35" cy="48" r="6" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="6" fill="#2c3e50"/>
        <circle cx="33" cy="46" r="2" fill="white"/>
        <circle cx="63" cy="46" r="2" fill="white"/>
      `;
      break;
    case 'grumpy':
      eyes = `
        <ellipse cx="35" cy="50" rx="7" ry="8" fill="${eyeColor}"/>
        <ellipse cx="65" cy="50" rx="7" ry="8" fill="${eyeColor}"/>
        <ellipse cx="35" cy="51" rx="3" ry="5" fill="#2c3e50"/>
        <ellipse cx="65" cy="51" rx="3" ry="5" fill="#2c3e50"/>
        <line x1="27" y1="43" x2="43" y2="46" stroke="#2c3e50" stroke-width="2"/>
        <line x1="73" y1="43" x2="57" y2="46" stroke="#2c3e50" stroke-width="2"/>
      `;
      break;
  }

  // Nose and mouth
  const nose = `
    <ellipse cx="50" cy="65" rx="5" ry="4" fill="${darkPrimary}"/>
    <path d="M50,69 L50,74" stroke="${darkPrimary}" stroke-width="2"/>
    <path d="M45,76 Q50,80 55,76" stroke="${darkPrimary}" stroke-width="2" fill="none"/>
  `;

  // Whiskers
  const whiskers = `
    <line x1="10" y1="60" x2="30" y2="65" stroke="${darkPrimary}" stroke-width="1.5"/>
    <line x1="10" y1="70" x2="30" y2="70" stroke="${darkPrimary}" stroke-width="1.5"/>
    <line x1="10" y1="80" x2="30" y2="75" stroke="${darkPrimary}" stroke-width="1.5"/>
    <line x1="90" y1="60" x2="70" y2="65" stroke="${darkPrimary}" stroke-width="1.5"/>
    <line x1="90" y1="70" x2="70" y2="70" stroke="${darkPrimary}" stroke-width="1.5"/>
    <line x1="90" y1="80" x2="70" y2="75" stroke="${darkPrimary}" stroke-width="1.5"/>
  `;

  return ears + face + eyes + nose + whiskers;
}

function generateDog(params: AnimalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression } = params;
  const darkPrimary = darkenColor(primaryColor, 30);

  // Dog ears (floppy)
  const ears = `
    <ellipse cx="20" cy="45" rx="15" ry="25" fill="${darkPrimary}"/>
    <ellipse cx="80" cy="45" rx="15" ry="25" fill="${darkPrimary}"/>
  `;

  // Dog face
  const face = `
    <circle cx="50" cy="50" r="35" fill="${primaryColor}"/>
    <ellipse cx="50" cy="65" rx="20" ry="18" fill="${secondaryColor}"/>
  `;

  // Eyes
  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <circle cx="35" cy="45" r="8" fill="white"/>
        <circle cx="65" cy="45" r="8" fill="white"/>
        <circle cx="36" cy="46" r="5" fill="${eyeColor}"/>
        <circle cx="66" cy="46" r="5" fill="${eyeColor}"/>
        <circle cx="36" cy="46" r="2" fill="#2c3e50"/>
        <circle cx="66" cy="46" r="2" fill="#2c3e50"/>
      `;
      break;
    case 'sleepy':
      eyes = `
        <path d="M27,45 Q35,40 43,45" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M57,45 Q65,40 73,45" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <circle cx="35" cy="43" r="10" fill="white"/>
        <circle cx="65" cy="43" r="10" fill="white"/>
        <circle cx="35" cy="43" r="5" fill="#2c3e50"/>
        <circle cx="65" cy="43" r="5" fill="#2c3e50"/>
      `;
      break;
    case 'grumpy':
      eyes = `
        <circle cx="35" cy="45" r="7" fill="white"/>
        <circle cx="65" cy="45" r="7" fill="white"/>
        <circle cx="35" cy="46" r="4" fill="#2c3e50"/>
        <circle cx="65" cy="46" r="4" fill="#2c3e50"/>
        <line x1="27" y1="38" x2="43" y2="41" stroke="#2c3e50" stroke-width="2"/>
        <line x1="73" y1="38" x2="57" y2="41" stroke="#2c3e50" stroke-width="2"/>
      `;
      break;
  }

  // Nose and mouth
  const nose = `
    <ellipse cx="50" cy="62" rx="8" ry="6" fill="#2c3e50"/>
    <ellipse cx="48" cy="60" rx="2" ry="1.5" fill="#555"/>
    <path d="M50,68 L50,72" stroke="#2c3e50" stroke-width="2"/>
    <path d="M40,75 Q50,82 60,75" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `;

  // Tongue for happy expression
  const tongue = expression === 'happy'
    ? `<ellipse cx="50" cy="82" rx="6" ry="8" fill="#e74c3c"/>`
    : '';

  return ears + face + eyes + nose + tongue;
}

function generateBear(params: AnimalParams): string {
  const { primaryColor, secondaryColor, expression } = params;
  const darkPrimary = darkenColor(primaryColor, 30);

  // Bear ears
  const ears = `
    <circle cx="20" cy="25" r="15" fill="${primaryColor}"/>
    <circle cx="20" cy="25" r="8" fill="${darkPrimary}"/>
    <circle cx="80" cy="25" r="15" fill="${primaryColor}"/>
    <circle cx="80" cy="25" r="8" fill="${darkPrimary}"/>
  `;

  // Bear face
  const face = `
    <circle cx="50" cy="55" r="40" fill="${primaryColor}"/>
    <ellipse cx="50" cy="70" rx="18" ry="15" fill="${secondaryColor}"/>
  `;

  // Eyes
  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <circle cx="35" cy="48" r="6" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="6" fill="#2c3e50"/>
        <circle cx="33" cy="46" r="2" fill="white"/>
        <circle cx="63" cy="46" r="2" fill="white"/>
      `;
      break;
    case 'sleepy':
      eyes = `
        <path d="M29,48 Q35,43 41,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M59,48 Q65,43 71,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <circle cx="35" cy="46" r="8" fill="white"/>
        <circle cx="65" cy="46" r="8" fill="white"/>
        <circle cx="35" cy="46" r="4" fill="#2c3e50"/>
        <circle cx="65" cy="46" r="4" fill="#2c3e50"/>
      `;
      break;
    case 'grumpy':
      eyes = `
        <circle cx="35" cy="48" r="5" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="5" fill="#2c3e50"/>
        <line x1="27" y1="42" x2="43" y2="45" stroke="#2c3e50" stroke-width="2"/>
        <line x1="73" y1="42" x2="57" y2="45" stroke="#2c3e50" stroke-width="2"/>
      `;
      break;
  }

  // Nose and mouth
  const nose = `
    <ellipse cx="50" cy="68" rx="7" ry="5" fill="#2c3e50"/>
    <path d="M50,73 L50,77" stroke="#2c3e50" stroke-width="2"/>
    <path d="M42,80 Q50,85 58,80" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `;

  return ears + face + eyes + nose;
}

function generateBunny(params: AnimalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression } = params;
  const lightPrimary = lightenColor(primaryColor, 40);

  // Bunny ears (long)
  const ears = `
    <ellipse cx="30" cy="20" rx="10" ry="25" fill="${primaryColor}"/>
    <ellipse cx="30" cy="20" rx="5" ry="18" fill="${lightPrimary}"/>
    <ellipse cx="70" cy="20" rx="10" ry="25" fill="${primaryColor}"/>
    <ellipse cx="70" cy="20" rx="5" ry="18" fill="${lightPrimary}"/>
  `;

  // Bunny face
  const face = `
    <circle cx="50" cy="60" r="35" fill="${primaryColor}"/>
    <ellipse cx="50" cy="70" rx="15" ry="12" fill="${secondaryColor}"/>
  `;

  // Eyes
  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <circle cx="35" cy="52" r="8" fill="${eyeColor}"/>
        <circle cx="65" cy="52" r="8" fill="${eyeColor}"/>
        <circle cx="36" cy="53" r="4" fill="#2c3e50"/>
        <circle cx="66" cy="53" r="4" fill="#2c3e50"/>
        <circle cx="34" cy="51" r="2" fill="white"/>
        <circle cx="64" cy="51" r="2" fill="white"/>
      `;
      break;
    case 'sleepy':
      eyes = `
        <path d="M27,52 Q35,47 43,52" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M57,52 Q65,47 73,52" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <circle cx="35" cy="50" r="10" fill="${eyeColor}"/>
        <circle cx="65" cy="50" r="10" fill="${eyeColor}"/>
        <circle cx="35" cy="50" r="5" fill="#2c3e50"/>
        <circle cx="65" cy="50" r="5" fill="#2c3e50"/>
      `;
      break;
    case 'grumpy':
      eyes = `
        <circle cx="35" cy="52" r="7" fill="${eyeColor}"/>
        <circle cx="65" cy="52" r="7" fill="${eyeColor}"/>
        <circle cx="35" cy="53" r="3" fill="#2c3e50"/>
        <circle cx="65" cy="53" r="3" fill="#2c3e50"/>
        <line x1="27" y1="46" x2="43" y2="49" stroke="#2c3e50" stroke-width="2"/>
        <line x1="73" y1="46" x2="57" y2="49" stroke="#2c3e50" stroke-width="2"/>
      `;
      break;
  }

  // Nose and mouth
  const nose = `
    <ellipse cx="50" cy="68" rx="5" ry="4" fill="#ffb6c1"/>
    <path d="M50,72 L45,78 M50,72 L55,78" stroke="#2c3e50" stroke-width="2" stroke-linecap="round"/>
  `;

  // Cheeks
  const cheeks = `
    <circle cx="25" cy="65" r="6" fill="#ffb6c1" opacity="0.5"/>
    <circle cx="75" cy="65" r="6" fill="#ffb6c1" opacity="0.5"/>
  `;

  return ears + face + eyes + nose + cheeks;
}

function generateFox(params: AnimalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression } = params;

  // Fox ears (pointed)
  const ears = `
    <polygon points="15,45 25,5 40,40" fill="${primaryColor}"/>
    <polygon points="20,42 27,15 37,40" fill="${secondaryColor}"/>
    <polygon points="85,45 75,5 60,40" fill="${primaryColor}"/>
    <polygon points="80,42 73,15 63,40" fill="${secondaryColor}"/>
  `;

  // Fox face
  const face = `
    <ellipse cx="50" cy="55" rx="38" ry="35" fill="${primaryColor}"/>
    <polygon points="50,95 25,60 75,60" fill="${secondaryColor}"/>
    <ellipse cx="50" cy="60" rx="20" ry="15" fill="${secondaryColor}"/>
  `;

  // Eyes
  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <ellipse cx="35" cy="50" rx="7" ry="8" fill="${eyeColor}"/>
        <ellipse cx="65" cy="50" rx="7" ry="8" fill="${eyeColor}"/>
        <ellipse cx="36" cy="51" rx="3" ry="5" fill="#2c3e50"/>
        <ellipse cx="66" cy="51" rx="3" ry="5" fill="#2c3e50"/>
        <circle cx="34" cy="49" r="1.5" fill="white"/>
        <circle cx="64" cy="49" r="1.5" fill="white"/>
      `;
      break;
    case 'sleepy':
      eyes = `
        <path d="M28,50 Q35,45 42,50" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M58,50 Q65,45 72,50" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <circle cx="35" cy="48" r="9" fill="${eyeColor}"/>
        <circle cx="65" cy="48" r="9" fill="${eyeColor}"/>
        <circle cx="35" cy="48" r="5" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="5" fill="#2c3e50"/>
      `;
      break;
    case 'grumpy':
      eyes = `
        <ellipse cx="35" cy="50" rx="6" ry="7" fill="${eyeColor}"/>
        <ellipse cx="65" cy="50" rx="6" ry="7" fill="${eyeColor}"/>
        <ellipse cx="35" cy="51" rx="2" ry="4" fill="#2c3e50"/>
        <ellipse cx="65" cy="51" rx="2" ry="4" fill="#2c3e50"/>
        <line x1="28" y1="44" x2="42" y2="47" stroke="#2c3e50" stroke-width="2"/>
        <line x1="72" y1="44" x2="58" y2="47" stroke="#2c3e50" stroke-width="2"/>
      `;
      break;
  }

  // Nose
  const nose = `
    <ellipse cx="50" cy="68" rx="5" ry="4" fill="#2c3e50"/>
    <path d="M50,72 L50,76" stroke="#2c3e50" stroke-width="2"/>
    <path d="M44,79 Q50,83 56,79" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `;

  return ears + face + eyes + nose;
}

function generatePanda(params: AnimalParams): string {
  const { expression } = params;
  const primaryColor = '#ffffff';
  const blackColor = '#1a1a2e';

  // Panda ears
  const ears = `
    <circle cx="20" cy="25" r="15" fill="${blackColor}"/>
    <circle cx="80" cy="25" r="15" fill="${blackColor}"/>
  `;

  // Panda face
  const face = `
    <circle cx="50" cy="55" r="40" fill="${primaryColor}"/>
  `;

  // Eye patches and eyes
  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${blackColor}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${blackColor}"/>
        <circle cx="32" cy="50" r="6" fill="white"/>
        <circle cx="68" cy="50" r="6" fill="white"/>
        <circle cx="33" cy="51" r="3" fill="#2c3e50"/>
        <circle cx="69" cy="51" r="3" fill="#2c3e50"/>
      `;
      break;
    case 'sleepy':
      eyes = `
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${blackColor}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${blackColor}"/>
        <path d="M24,50 Q32,45 40,50" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M60,50 Q68,45 76,50" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${blackColor}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${blackColor}"/>
        <circle cx="32" cy="48" r="8" fill="white"/>
        <circle cx="68" cy="48" r="8" fill="white"/>
        <circle cx="32" cy="48" r="4" fill="#2c3e50"/>
        <circle cx="68" cy="48" r="4" fill="#2c3e50"/>
      `;
      break;
    case 'grumpy':
      eyes = `
        <ellipse cx="32" cy="48" rx="14" ry="16" fill="${blackColor}"/>
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="${blackColor}"/>
        <circle cx="32" cy="50" r="5" fill="white"/>
        <circle cx="68" cy="50" r="5" fill="white"/>
        <circle cx="32" cy="51" r="2" fill="#2c3e50"/>
        <circle cx="68" cy="51" r="2" fill="#2c3e50"/>
        <line x1="22" y1="38" x2="42" y2="42" stroke="${blackColor}" stroke-width="3"/>
        <line x1="78" y1="38" x2="58" y2="42" stroke="${blackColor}" stroke-width="3"/>
      `;
      break;
  }

  // Nose and mouth
  const nose = `
    <ellipse cx="50" cy="70" rx="8" ry="5" fill="${blackColor}"/>
    <path d="M50,75 L50,80" stroke="${blackColor}" stroke-width="2"/>
    <path d="M42,83 Q50,88 58,83" stroke="${blackColor}" stroke-width="2" fill="none"/>
  `;

  return ears + face + eyes + nose;
}

function generateOwl(params: AnimalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression } = params;
  const darkPrimary = darkenColor(primaryColor, 30);

  // Owl ear tufts
  const ears = `
    <polygon points="20,35 30,10 40,35" fill="${primaryColor}"/>
    <polygon points="25,35 30,18 35,35" fill="${darkPrimary}"/>
    <polygon points="80,35 70,10 60,35" fill="${primaryColor}"/>
    <polygon points="75,35 70,18 65,35" fill="${darkPrimary}"/>
  `;

  // Owl face
  const face = `
    <ellipse cx="50" cy="55" rx="38" ry="40" fill="${primaryColor}"/>
    <ellipse cx="50" cy="60" rx="30" ry="32" fill="${secondaryColor}"/>
  `;

  // Large owl eyes
  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <circle cx="35" cy="48" r="15" fill="${eyeColor}"/>
        <circle cx="65" cy="48" r="15" fill="${eyeColor}"/>
        <circle cx="35" cy="48" r="8" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="8" fill="#2c3e50"/>
        <circle cx="32" cy="45" r="4" fill="white"/>
        <circle cx="62" cy="45" r="4" fill="white"/>
      `;
      break;
    case 'sleepy':
      eyes = `
        <circle cx="35" cy="48" r="15" fill="${eyeColor}"/>
        <circle cx="65" cy="48" r="15" fill="${eyeColor}"/>
        <path d="M25,48 Q35,42 45,48" stroke="#2c3e50" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M55,48 Q65,42 75,48" stroke="#2c3e50" stroke-width="4" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <circle cx="35" cy="48" r="17" fill="${eyeColor}"/>
        <circle cx="65" cy="48" r="17" fill="${eyeColor}"/>
        <circle cx="35" cy="48" r="10" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="10" fill="#2c3e50"/>
        <circle cx="32" cy="45" r="5" fill="white"/>
        <circle cx="62" cy="45" r="5" fill="white"/>
      `;
      break;
    case 'grumpy':
      eyes = `
        <circle cx="35" cy="48" r="14" fill="${eyeColor}"/>
        <circle cx="65" cy="48" r="14" fill="${eyeColor}"/>
        <circle cx="35" cy="50" r="7" fill="#2c3e50"/>
        <circle cx="65" cy="50" r="7" fill="#2c3e50"/>
        <line x1="22" y1="35" x2="48" y2="40" stroke="${darkPrimary}" stroke-width="3"/>
        <line x1="78" y1="35" x2="52" y2="40" stroke="${darkPrimary}" stroke-width="3"/>
      `;
      break;
  }

  // Beak
  const beak = `
    <polygon points="50,60 42,72 50,82 58,72" fill="#f39c12"/>
  `;

  return ears + face + eyes + beak;
}

function generateKoala(params: AnimalParams): string {
  const { primaryColor, secondaryColor, expression } = params;

  // Koala ears (big and fluffy)
  const ears = `
    <circle cx="15" cy="35" r="20" fill="${primaryColor}"/>
    <circle cx="15" cy="35" r="12" fill="${secondaryColor}"/>
    <circle cx="85" cy="35" r="20" fill="${primaryColor}"/>
    <circle cx="85" cy="35" r="12" fill="${secondaryColor}"/>
  `;

  // Koala face
  const face = `
    <ellipse cx="50" cy="55" rx="35" ry="38" fill="${primaryColor}"/>
    <ellipse cx="50" cy="65" rx="20" ry="18" fill="${secondaryColor}"/>
  `;

  // Eyes
  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <circle cx="35" cy="48" r="6" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="6" fill="#2c3e50"/>
        <circle cx="33" cy="46" r="2" fill="white"/>
        <circle cx="63" cy="46" r="2" fill="white"/>
      `;
      break;
    case 'sleepy':
      eyes = `
        <path d="M29,48 Q35,43 41,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M59,48 Q65,43 71,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <circle cx="35" cy="46" r="8" fill="white"/>
        <circle cx="65" cy="46" r="8" fill="white"/>
        <circle cx="35" cy="46" r="4" fill="#2c3e50"/>
        <circle cx="65" cy="46" r="4" fill="#2c3e50"/>
      `;
      break;
    case 'grumpy':
      eyes = `
        <circle cx="35" cy="48" r="5" fill="#2c3e50"/>
        <circle cx="65" cy="48" r="5" fill="#2c3e50"/>
        <line x1="28" y1="42" x2="42" y2="45" stroke="#2c3e50" stroke-width="2"/>
        <line x1="72" y1="42" x2="58" y2="45" stroke="#2c3e50" stroke-width="2"/>
      `;
      break;
  }

  // Big nose
  const nose = `
    <ellipse cx="50" cy="65" rx="12" ry="10" fill="#2c3e50"/>
    <ellipse cx="48" cy="63" rx="3" ry="2" fill="#555"/>
    <path d="M50,75 L50,80" stroke="#2c3e50" stroke-width="2"/>
    <path d="M42,82 Q50,87 58,82" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `;

  return ears + face + eyes + nose;
}

function generatePenguin(params: AnimalParams): string {
  const { secondaryColor, eyeColor, expression } = params;
  const primaryColor = '#1a1a2e';

  // Penguin body/head
  const body = `
    <ellipse cx="50" cy="55" rx="38" ry="42" fill="${primaryColor}"/>
    <ellipse cx="50" cy="60" rx="25" ry="32" fill="${secondaryColor}"/>
  `;

  // Eyes
  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <circle cx="35" cy="45" r="8" fill="white"/>
        <circle cx="65" cy="45" r="8" fill="white"/>
        <circle cx="36" cy="46" r="4" fill="${eyeColor}"/>
        <circle cx="66" cy="46" r="4" fill="${eyeColor}"/>
        <circle cx="36" cy="46" r="2" fill="#2c3e50"/>
        <circle cx="66" cy="46" r="2" fill="#2c3e50"/>
      `;
      break;
    case 'sleepy':
      eyes = `
        <circle cx="35" cy="45" r="8" fill="white"/>
        <circle cx="65" cy="45" r="8" fill="white"/>
        <path d="M28,45 Q35,40 42,45" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M58,45 Q65,40 72,45" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <circle cx="35" cy="43" r="10" fill="white"/>
        <circle cx="65" cy="43" r="10" fill="white"/>
        <circle cx="35" cy="43" r="5" fill="#2c3e50"/>
        <circle cx="65" cy="43" r="5" fill="#2c3e50"/>
      `;
      break;
    case 'grumpy':
      eyes = `
        <circle cx="35" cy="45" r="7" fill="white"/>
        <circle cx="65" cy="45" r="7" fill="white"/>
        <circle cx="35" cy="46" r="3" fill="#2c3e50"/>
        <circle cx="65" cy="46" r="3" fill="#2c3e50"/>
        <line x1="27" y1="38" x2="43" y2="41" stroke="${primaryColor}" stroke-width="2"/>
        <line x1="73" y1="38" x2="57" y2="41" stroke="${primaryColor}" stroke-width="2"/>
      `;
      break;
  }

  // Beak
  const beak = `
    <polygon points="50,55 40,65 50,72 60,65" fill="#f39c12"/>
  `;

  // Cheeks
  const cheeks = `
    <circle cx="25" cy="55" r="5" fill="#ffb6c1" opacity="0.6"/>
    <circle cx="75" cy="55" r="5" fill="#ffb6c1" opacity="0.6"/>
  `;

  return body + eyes + beak + cheeks;
}

function generateLion(params: AnimalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression } = params;
  const darkPrimary = darkenColor(primaryColor, 30);
  const maneColor = darkenColor(primaryColor, 15);

  // Lion mane
  const mane = `
    <circle cx="50" cy="50" r="45" fill="${maneColor}"/>
    <circle cx="25" cy="30" r="15" fill="${maneColor}"/>
    <circle cx="75" cy="30" r="15" fill="${maneColor}"/>
    <circle cx="15" cy="50" r="15" fill="${maneColor}"/>
    <circle cx="85" cy="50" r="15" fill="${maneColor}"/>
    <circle cx="25" cy="70" r="15" fill="${maneColor}"/>
    <circle cx="75" cy="70" r="15" fill="${maneColor}"/>
  `;

  // Lion face
  const face = `
    <circle cx="50" cy="55" r="32" fill="${primaryColor}"/>
    <ellipse cx="50" cy="68" rx="18" ry="14" fill="${secondaryColor}"/>
  `;

  // Eyes
  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <ellipse cx="38" cy="48" rx="7" ry="8" fill="${eyeColor}"/>
        <ellipse cx="62" cy="48" rx="7" ry="8" fill="${eyeColor}"/>
        <ellipse cx="38" cy="49" rx="3" ry="5" fill="#2c3e50"/>
        <ellipse cx="62" cy="49" rx="3" ry="5" fill="#2c3e50"/>
        <circle cx="36" cy="47" r="2" fill="white"/>
        <circle cx="60" cy="47" r="2" fill="white"/>
      `;
      break;
    case 'sleepy':
      eyes = `
        <path d="M31,48 Q38,43 45,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M55,48 Q62,43 69,48" stroke="#2c3e50" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <circle cx="38" cy="46" r="9" fill="${eyeColor}"/>
        <circle cx="62" cy="46" r="9" fill="${eyeColor}"/>
        <circle cx="38" cy="46" r="5" fill="#2c3e50"/>
        <circle cx="62" cy="46" r="5" fill="#2c3e50"/>
      `;
      break;
    case 'grumpy':
      eyes = `
        <ellipse cx="38" cy="48" rx="6" ry="7" fill="${eyeColor}"/>
        <ellipse cx="62" cy="48" rx="6" ry="7" fill="${eyeColor}"/>
        <ellipse cx="38" cy="49" rx="2" ry="4" fill="#2c3e50"/>
        <ellipse cx="62" cy="49" rx="2" ry="4" fill="#2c3e50"/>
        <line x1="30" y1="42" x2="46" y2="45" stroke="${darkPrimary}" stroke-width="2"/>
        <line x1="70" y1="42" x2="54" y2="45" stroke="${darkPrimary}" stroke-width="2"/>
      `;
      break;
  }

  // Nose
  const nose = `
    <ellipse cx="50" cy="65" rx="6" ry="5" fill="#2c3e50"/>
    <path d="M50,70 L50,74" stroke="#2c3e50" stroke-width="2"/>
    <path d="M42,77 Q50,82 58,77" stroke="#2c3e50" stroke-width="2" fill="none"/>
  `;

  return mane + face + eyes + nose;
}

// Scale factors to ensure each animal fits within the circular background
const animalScaleFactors: Record<string, number> = {
  bunny: 0.80,   // Ears extend upward
  koala: 0.78,   // Ears extend beyond viewBox
  bear: 0.82,    // Ears at corners
  panda: 0.82,   // Same ear structure as bear
  lion: 0.80,    // Mane circles at edges
  cat: 0.85,     // Ears and whiskers
  fox: 0.85,     // Similar to cat
  owl: 0.85,     // Ear tufts
  dog: 0.85,     // Floppy ears
  penguin: 0.88, // Mostly contained
};

export function generate(params: AnimalParams): string {
  const { backgroundShape, animalType, backgroundColor } = params;

  let animal: string;
  switch (animalType) {
    case 'cat':
      animal = generateCat(params);
      break;
    case 'dog':
      animal = generateDog(params);
      break;
    case 'bear':
      animal = generateBear(params);
      break;
    case 'bunny':
      animal = generateBunny(params);
      break;
    case 'fox':
      animal = generateFox(params);
      break;
    case 'panda':
      animal = generatePanda(params);
      break;
    case 'owl':
      animal = generateOwl(params);
      break;
    case 'koala':
      animal = generateKoala(params);
      break;
    case 'penguin':
      animal = generatePenguin(params);
      break;
    case 'lion':
      animal = generateLion(params);
      break;
    default:
      animal = generateCat(params);
  }

  // Apply scale transform centered at (50, 50) to fit within circle
  const scale = animalScaleFactors[animalType] ?? 0.85;
  const scaledAnimal = `<g transform="translate(50, 50) scale(${scale}) translate(-50, -50)">${animal}</g>`;

  return wrapSvgWithShape(scaledAnimal, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: () => number): AnimalParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const animalTypes = ['cat', 'dog', 'bear', 'bunny', 'fox', 'panda', 'owl', 'koala', 'penguin', 'lion'] as const;
  const expressions = ['happy', 'sleepy', 'surprised', 'grumpy'] as const;

  return {
    backgroundShape: randomPick(bgShapes, rng),
    animalType: randomPick(animalTypes, rng),
    primaryColor: randomColor(rng),
    secondaryColor: '#ffffff',
    eyeColor: randomColor(rng),
    backgroundColor: randomColor(rng),
    expression: randomPick(expressions, rng),
  };
}

export const animals: Theme<typeof schema> = {
  name: 'Animals',
  schema,
  generate,
  randomize,
};
