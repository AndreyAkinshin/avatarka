import type { Rng } from 'pragmastat';
import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomPick, wrapSvgWithShape, fitToCircle, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  foodType: {
    type: 'select',
    default: 'sushi',
    options: [
      'sushi', 'pizza', 'cupcake', 'ice-cream', 'donut',
      'burger', 'taco', 'ramen', 'cookie', 'watermelon',
    ],
  },
  primaryColor: {
    type: 'color',
    default: '#FF8A65',
  },
  secondaryColor: {
    type: 'color',
    default: '#FFCC80',
  },
  toppingColor: {
    type: 'color',
    default: '#E53935',
  },
  plateColor: {
    type: 'color',
    default: '#ECEFF1',
  },
  eyeColor: {
    type: 'color',
    default: '#1a1a1a',
  },
  backgroundColor: {
    type: 'color',
    default: '#FFF8E1',
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'yummy', 'surprised', 'sleepy'],
  },
  pattern: {
    type: 'select',
    default: 'none',
    options: ['none', 'sprinkles', 'sesame', 'drizzle'],
  },
} as const satisfies ParamSchema;

export type FoodParams = ParamsFromSchema<typeof schema>;

type Expression = FoodParams['expression'];

// --- Shared helpers ---

function generateFoodEyes(
  expression: Expression,
  eyeColor: string,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  size: number
): string {
  const s = size;
  const pupilS = s * 0.45;
  const highlightS = s * 0.25;

  switch (expression) {
    case 'happy':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx1 - 1}" cy="${cy1 - 1}" r="${highlightS}" fill="white"/>
        <circle cx="${cx2 - 1}" cy="${cy2 - 1}" r="${highlightS}" fill="white"/>
      `;
    case 'yummy':
      return `
        <path d="M${cx1 - s},${cy1} Q${cx1},${cy1 - s * 1.2} ${cx1 + s},${cy1}" stroke="${eyeColor}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M${cx2 - s},${cy2} Q${cx2},${cy2 - s * 1.2} ${cx2 + s},${cy2}" stroke="${eyeColor}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="${cx1 + s * 1.2}" cy="${cy1 + s * 0.4}" rx="${s * 0.6}" ry="${s * 0.3}" fill="#FFB6C1" opacity="0.4"/>
        <ellipse cx="${cx2 - s * 1.2}" cy="${cy2 + s * 0.4}" rx="${s * 0.6}" ry="${s * 0.3}" fill="#FFB6C1" opacity="0.4"/>
      `;
    case 'surprised':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s * 1.2}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s * 1.2}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1}" r="${pupilS * 0.7}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2}" r="${pupilS * 0.7}" fill="${eyeColor}"/>
        <circle cx="${cx1 - 1}" cy="${cy1 - 1}" r="${highlightS}" fill="white"/>
        <circle cx="${cx2 - 1}" cy="${cy2 - 1}" r="${highlightS}" fill="white"/>
      `;
    case 'sleepy':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <path d="M${cx1 - s},${cy1 - s * 0.3} Q${cx1},${cy1 - s * 0.8} ${cx1 + s},${cy1 - s * 0.3}" fill="white" stroke="none"/>
        <path d="M${cx2 - s},${cy2 - s * 0.3} Q${cx2},${cy2 - s * 0.8} ${cx2 + s},${cy2 - s * 0.3}" fill="white" stroke="none"/>
      `;
    default:
      return '';
  }
}

function generateFoodMouth(
  expression: Expression,
  cx: number,
  cy: number
): string {
  switch (expression) {
    case 'happy':
      return `
        <path d="M${cx - 3},${cy} Q${cx},${cy + 4} ${cx + 3},${cy}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;
    case 'yummy':
      return `
        <path d="M${cx - 3},${cy} Q${cx},${cy + 5} ${cx + 3},${cy}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <ellipse cx="${cx}" cy="${cy + 3}" rx="1.5" ry="2" fill="#E57373" opacity="0.7"/>
      `;
    case 'surprised':
      return `
        <ellipse cx="${cx}" cy="${cy + 2}" rx="2" ry="2.5" fill="#5D4037" opacity="0.7"/>
      `;
    case 'sleepy':
      return `
        <path d="M${cx - 2},${cy + 1} L${cx + 2},${cy + 1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;
    default:
      return '';
  }
}

function generateFoodPattern(
  primaryColor: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pattern: FoodParams['pattern']
): string {
  const dark = darkenColor(primaryColor, 30);

  switch (pattern) {
    case 'sprinkles':
      return `
        <g opacity="0.5">
          <rect x="${cx - rx * 0.4}" y="${cy - ry * 0.3}" width="2" height="4" rx="1" fill="#E91E63" transform="rotate(30, ${cx - rx * 0.4}, ${cy - ry * 0.3})"/>
          <rect x="${cx + rx * 0.3}" y="${cy - ry * 0.2}" width="2" height="4" rx="1" fill="#2196F3" transform="rotate(-20, ${cx + rx * 0.3}, ${cy - ry * 0.2})"/>
          <rect x="${cx - rx * 0.1}" y="${cy + ry * 0.2}" width="2" height="4" rx="1" fill="#4CAF50" transform="rotate(50, ${cx - rx * 0.1}, ${cy + ry * 0.2})"/>
          <rect x="${cx + rx * 0.35}" y="${cy + ry * 0.15}" width="2" height="4" rx="1" fill="#FF9800" transform="rotate(-40, ${cx + rx * 0.35}, ${cy + ry * 0.15})"/>
        </g>
      `;
    case 'sesame':
      return `
        <g opacity="0.4">
          <ellipse cx="${cx - rx * 0.3}" cy="${cy - ry * 0.2}" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(15, ${cx - rx * 0.3}, ${cy - ry * 0.2})"/>
          <ellipse cx="${cx + rx * 0.25}" cy="${cy - ry * 0.1}" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(-10, ${cx + rx * 0.25}, ${cy - ry * 0.1})"/>
          <ellipse cx="${cx}" cy="${cy + ry * 0.15}" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(25, ${cx}, ${cy + ry * 0.15})"/>
          <ellipse cx="${cx + rx * 0.4}" cy="${cy + ry * 0.2}" rx="1" ry="0.7" fill="#212121" transform="rotate(-5, ${cx + rx * 0.4}, ${cy + ry * 0.2})"/>
        </g>
      `;
    case 'drizzle':
      return `
        <g opacity="0.3">
          <path d="M${cx - rx * 0.5},${cy - ry * 0.2} Q${cx - rx * 0.25},${cy - ry * 0.35} ${cx},${cy - ry * 0.2} Q${cx + rx * 0.25},${cy - ry * 0.05} ${cx + rx * 0.5},${cy - ry * 0.2}" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M${cx - rx * 0.4},${cy + ry * 0.1} Q${cx - rx * 0.15},${cy - ry * 0.05} ${cx + rx * 0.1},${cy + ry * 0.1} Q${cx + rx * 0.3},${cy + ry * 0.25} ${cx + rx * 0.5},${cy + ry * 0.1}" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </g>
      `;
    default:
      return '';
  }
}

function generatePlate(
  plateColor: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number
): string {
  const dark = darkenColor(plateColor, 15);
  const light = lightenColor(plateColor, 8);
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx + 3}" ry="${ry + 1.5}" fill="${dark}" opacity="0.3"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${plateColor}"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx - 3}" ry="${ry - 1}" fill="${light}" opacity="0.2"/>
  `;
}

// --- Food generators ---

function generateSushi(params: FoodParams): string {
  const { primaryColor, secondaryColor, toppingColor, plateColor, eyeColor, expression, pattern } = params;

  // Plate
  const plate = generatePlate(plateColor, 50, 72, 24, 6);

  // Rice body (oval pillow)
  const rice = `
    <ellipse cx="50" cy="56" rx="16" ry="12" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.5"/>
    <ellipse cx="50" cy="54" rx="14" ry="10" fill="white" opacity="0.15"/>
  `;

  // Fish slice on top
  const fish = `
    <path d="M34,48 Q42,38 50,40 Q58,38 66,48 Q58,52 50,50 Q42,52 34,48 Z" fill="${toppingColor}" stroke="${darkenColor(toppingColor, 15)}" stroke-width="0.5"/>
    <path d="M38,46 Q50,40 62,46" stroke="${lightenColor(toppingColor, 15)}" stroke-width="0.8" fill="none" opacity="0.3" stroke-linecap="round"/>
  `;

  // Nori strip around base
  const nori = `
    <rect x="42" y="52" width="16" height="10" rx="1" fill="#2E3B2E" opacity="0.85"/>
    <rect x="44" y="54" width="12" height="6" rx="0.5" fill="#3E4F3E" opacity="0.2"/>
  `;

  const eyes = generateFoodEyes(expression, eyeColor, 45, 44, 55, 44, 2.5);
  const mouth = generateFoodMouth(expression, 50, 49);
  const pat = generateFoodPattern(primaryColor, 50, 48, 14, 10, pattern);

  return plate + rice + nori + fish + pat + eyes + mouth;
}

function generatePizza(params: FoodParams): string {
  const { primaryColor, secondaryColor, toppingColor, plateColor, eyeColor, expression, pattern } = params;
  const pizzaDark = darkenColor(primaryColor, 20);

  // Plate
  const plate = generatePlate(plateColor, 50, 78, 22, 5);

  // Triangle slice
  const crust = `
    <path d="M50,22 L26,76 L74,76 Z" fill="${primaryColor}" stroke="${pizzaDark}" stroke-width="0.6"/>
  `;

  // Cheese layer
  const cheese = `
    <path d="M50,26 L28,74 L72,74 Z" fill="${secondaryColor}"/>
    <path d="M72,74 Q68,68 74,76" fill="${secondaryColor}" stroke="${pizzaDark}" stroke-width="0.3" opacity="0.6"/>
    <path d="M28,74 Q32,68 26,76" fill="${secondaryColor}" stroke="${pizzaDark}" stroke-width="0.3" opacity="0.6"/>
  `;

  // Crust arc at bottom
  const crustArc = `
    <path d="M26,76 Q50,82 74,76" fill="${darkenColor(primaryColor, 10)}" stroke="${pizzaDark}" stroke-width="0.5"/>
  `;

  // Pepperoni circles
  const pepperoni = `
    <circle cx="44" cy="58" r="4" fill="${toppingColor}" opacity="0.8"/>
    <circle cx="56" cy="54" r="3.5" fill="${toppingColor}" opacity="0.8"/>
    <circle cx="50" cy="66" r="4" fill="${toppingColor}" opacity="0.8"/>
    <circle cx="38" cy="68" r="3" fill="${darkenColor(toppingColor, 10)}" opacity="0.7"/>
    <circle cx="60" cy="66" r="3" fill="${darkenColor(toppingColor, 10)}" opacity="0.7"/>
  `;

  const eyes = generateFoodEyes(expression, eyeColor, 44, 44, 56, 44, 3);
  const mouth = generateFoodMouth(expression, 50, 52);
  const pat = generateFoodPattern(primaryColor, 50, 50, 16, 20, pattern);

  return plate + crust + cheese + crustArc + pepperoni + pat + eyes + mouth;
}

function generateCupcake(params: FoodParams): string {
  const { primaryColor, secondaryColor, toppingColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Ruffled paper wrapper
  const wrapper = `
    <path d="M32,58 Q34,56 36,58 Q38,56 40,58 Q42,56 44,58 Q46,56 48,58 Q50,56 52,58 Q54,56 56,58 Q58,56 60,58 Q62,56 64,58 Q66,56 68,58 L66,82 Q50,86 34,82 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.5"/>
    <path d="M38,62 L36,78" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.5" opacity="0.3"/>
    <path d="M50,60 L50,80" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.5" opacity="0.3"/>
    <path d="M62,62 L64,78" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.5" opacity="0.3"/>
  `;

  // Swirl frosting dome
  const frosting = `
    <path d="M30,58 Q30,32 50,28 Q70,32 70,58 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M36,56 Q36,36 50,32 Q64,36 64,56" fill="${lightenColor(primaryColor, 10)}" opacity="0.2"/>
    <path d="M40,54 Q44,44 50,42 Q56,44 60,54" stroke="${lightenColor(primaryColor, 15)}" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/>
  `;

  // Cherry on top
  const cherry = `
    <circle cx="50" cy="26" r="5" fill="${toppingColor}"/>
    <circle cx="48" cy="24" r="1.5" fill="white" opacity="0.4"/>
    <path d="M50,22 Q52,18 54,16" stroke="#4E342E" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  `;

  const eyes = generateFoodEyes(expression, eyeColor, 44, 44, 56, 44, 3);
  const mouth = generateFoodMouth(expression, 50, 51);
  const pat = generateFoodPattern(primaryColor, 50, 44, 16, 14, pattern);

  return wrapper + frosting + pat + cherry + eyes + mouth;
}

function generateIceCream(params: FoodParams): string {
  const { primaryColor, secondaryColor, toppingColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Waffle cone
  const cone = `
    <path d="M36,52 L50,88 L64,52 Z" fill="#D4A056" stroke="${darkenColor('#D4A056', 15)}" stroke-width="0.5"/>
    <g opacity="0.3" stroke="#8D6E63" stroke-width="0.5">
      <line x1="38" y1="56" x2="62" y2="56"/>
      <line x1="40" y1="62" x2="60" y2="62"/>
      <line x1="42" y1="68" x2="58" y2="68"/>
      <line x1="40" y1="54" x2="54" y2="70"/>
      <line x1="60" y1="54" x2="46" y2="70"/>
    </g>
  `;

  // Bottom scoop
  const scoop1 = `
    <circle cx="50" cy="42" r="14" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.5"/>
  `;

  // Top scoop
  const scoop2 = `
    <circle cx="50" cy="28" r="12" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <circle cx="46" cy="24" r="3" fill="${lightenColor(primaryColor, 15)}" opacity="0.2"/>
  `;

  // Drips
  const drips = `
    <path d="M38,44 Q36,50 38,54" fill="${secondaryColor}" stroke="none"/>
    <path d="M62,42 Q64,48 62,52" fill="${primaryColor}" stroke="none"/>
  `;

  // Topping drizzle
  const topping = `
    <path d="M40,24 Q50,20 60,24" stroke="${toppingColor}" stroke-width="1.5" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M42,28 Q50,32 58,28" stroke="${toppingColor}" stroke-width="1" fill="none" opacity="0.4" stroke-linecap="round"/>
  `;

  const eyes = generateFoodEyes(expression, eyeColor, 45, 26, 55, 26, 2.5);
  const mouth = generateFoodMouth(expression, 50, 32);
  const pat = generateFoodPattern(primaryColor, 50, 28, 12, 12, pattern);

  return cone + scoop1 + scoop2 + drips + topping + pat + eyes + mouth;
}

function generateDonut(params: FoodParams): string {
  const { primaryColor, secondaryColor, toppingColor, plateColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Plate
  const plate = generatePlate(plateColor, 50, 74, 24, 5);

  // Donut body (torus)
  const body = `
    <ellipse cx="50" cy="50" rx="22" ry="20" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.6"/>
    <ellipse cx="50" cy="50" rx="8" ry="7" fill="${lightenColor(secondaryColor, 30)}"/>
  `;

  // Hole (cut-out effect)
  const hole = `
    <ellipse cx="50" cy="50" rx="8" ry="7" fill="${plateColor}"/>
  `;

  // Icing on top half
  const icing = `
    <path d="M28,48 Q30,36 38,30 Q50,24 62,30 Q70,36 72,48 Q68,52 62,50 Q56,54 50,50 Q44,54 38,50 Q32,52 28,48 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <ellipse cx="50" cy="40" rx="8" ry="6" fill="${primaryColor}"/>
  `;

  // Sprinkle-like toppings on icing
  const toppings = `
    <g opacity="0.7">
      <rect x="36" y="34" width="2" height="4" rx="1" fill="${toppingColor}" transform="rotate(20, 36, 34)"/>
      <rect x="48" y="30" width="2" height="4" rx="1" fill="${lightenColor(toppingColor, 20)}" transform="rotate(-15, 48, 30)"/>
      <rect x="60" y="36" width="2" height="4" rx="1" fill="${toppingColor}" transform="rotate(35, 60, 36)"/>
      <rect x="42" y="38" width="2" height="4" rx="1" fill="${lightenColor(toppingColor, 10)}" transform="rotate(-30, 42, 38)"/>
      <rect x="56" y="32" width="2" height="4" rx="1" fill="${toppingColor}" transform="rotate(10, 56, 32)"/>
    </g>
  `;

  const eyes = generateFoodEyes(expression, eyeColor, 42, 40, 58, 40, 2.5);
  const mouth = generateFoodMouth(expression, 50, 46);
  const pat = generateFoodPattern(primaryColor, 50, 38, 18, 12, pattern);

  return plate + body + hole + icing + toppings + pat + eyes + mouth;
}

function generateBurger(params: FoodParams): string {
  const { primaryColor, secondaryColor, toppingColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);
  const bunColor = primaryColor;
  const bunDark = dark;

  // Bottom bun
  const bottomBun = `
    <path d="M28,62 Q28,68 50,68 Q72,68 72,62 L28,62 Z" fill="${bunColor}" stroke="${bunDark}" stroke-width="0.5"/>
  `;

  // Patty
  const patty = `
    <rect x="26" y="54" width="48" height="8" rx="4" fill="#5D4037" stroke="${darkenColor('#5D4037', 15)}" stroke-width="0.4"/>
  `;

  // Cheese
  const cheese = `
    <path d="M26,54 L74,54 L72,50 Q68,52 60,50 Q50,48 40,50 Q32,52 28,50 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.3"/>
    <path d="M26,54 Q24,58 26,56" fill="${secondaryColor}" stroke="none"/>
    <path d="M74,54 Q76,58 74,56" fill="${secondaryColor}" stroke="none"/>
  `;

  // Lettuce
  const lettuce = `
    <path d="M26,50 Q32,46 38,50 Q44,46 50,50 Q56,46 62,50 Q68,46 74,50" fill="#66BB6A" stroke="${darkenColor('#66BB6A', 15)}" stroke-width="0.4"/>
  `;

  // Top bun
  const topBun = `
    <path d="M28,50 Q28,28 50,26 Q72,28 72,50 Z" fill="${bunColor}" stroke="${bunDark}" stroke-width="0.5"/>
    <ellipse cx="50" cy="36" rx="16" ry="8" fill="${lightenColor(bunColor, 10)}" opacity="0.15"/>
  `;

  // Sesame seeds on top bun
  const seeds = `
    <g opacity="0.5">
      <ellipse cx="42" cy="32" rx="1.5" ry="1" fill="#FFF9C4" transform="rotate(10, 42, 32)"/>
      <ellipse cx="52" cy="30" rx="1.5" ry="1" fill="#FFF9C4" transform="rotate(-15, 52, 30)"/>
      <ellipse cx="58" cy="34" rx="1.5" ry="1" fill="#FFF9C4" transform="rotate(20, 58, 34)"/>
      <ellipse cx="46" cy="36" rx="1.2" ry="0.8" fill="#FFF9C4" transform="rotate(-5, 46, 36)"/>
    </g>
  `;

  // Topping ketchup drip
  const ketchup = `
    <path d="M72,50 Q74,54 72,58" fill="${toppingColor}" stroke="none" opacity="0.7"/>
  `;

  const eyes = generateFoodEyes(expression, eyeColor, 43, 40, 57, 40, 3);
  const mouth = generateFoodMouth(expression, 50, 47);
  const pat = generateFoodPattern(bunColor, 50, 38, 20, 12, pattern);

  return bottomBun + patty + cheese + lettuce + ketchup + topBun + seeds + pat + eyes + mouth;
}

function generateTaco(params: FoodParams): string {
  const { primaryColor, secondaryColor, toppingColor, eyeColor, expression, pattern } = params;
  const tacoDark = darkenColor(primaryColor, 20);

  // U-shaped tortilla shell
  const shell = `
    <path d="M20,56 Q20,30 50,26 Q80,30 80,56" fill="${primaryColor}" stroke="${tacoDark}" stroke-width="0.6"/>
    <path d="M24,54 Q24,34 50,30 Q76,34 76,54" fill="${lightenColor(primaryColor, 8)}" opacity="0.15"/>
  `;

  // Filling - lettuce
  const lettuce = `
    <path d="M28,44 Q34,38 40,42 Q46,36 52,42 Q58,36 64,42 Q70,38 72,44" fill="#66BB6A" stroke="${darkenColor('#66BB6A', 10)}" stroke-width="0.4"/>
  `;

  // Filling - meat
  const meat = `
    <path d="M30,48 Q40,42 50,46 Q60,42 70,48" fill="#8D6E63" stroke="${darkenColor('#8D6E63', 15)}" stroke-width="0.4"/>
  `;

  // Filling - cheese shreds
  const cheese = `
    <g opacity="0.7">
      <path d="M34,44 L32,40" stroke="${secondaryColor}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M44,42 L42,38" stroke="${secondaryColor}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M56,42 L58,38" stroke="${secondaryColor}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M66,44 L68,40" stroke="${secondaryColor}" stroke-width="1.5" stroke-linecap="round"/>
    </g>
  `;

  // Topping - salsa dots
  const salsa = `
    <circle cx="38" cy="46" r="2" fill="${toppingColor}" opacity="0.6"/>
    <circle cx="50" cy="44" r="1.5" fill="${toppingColor}" opacity="0.6"/>
    <circle cx="62" cy="46" r="2" fill="${toppingColor}" opacity="0.6"/>
  `;

  const eyes = generateFoodEyes(expression, eyeColor, 42, 48, 58, 48, 3);
  const mouth = generateFoodMouth(expression, 50, 54);
  const pat = generateFoodPattern(primaryColor, 50, 44, 22, 14, pattern);

  return shell + meat + lettuce + cheese + salsa + pat + eyes + mouth;
}

function generateRamen(params: FoodParams): string {
  const { primaryColor, secondaryColor, toppingColor, plateColor, eyeColor, expression, pattern } = params;

  // Bowl
  const bowl = `
    <path d="M18,46 Q18,78 50,80 Q82,78 82,46 Z" fill="${plateColor}" stroke="${darkenColor(plateColor, 15)}" stroke-width="0.6"/>
    <path d="M22,48 Q22,74 50,76 Q78,74 78,48" fill="${lightenColor(plateColor, 8)}" opacity="0.15"/>
  `;

  // Bowl rim
  const rim = `
    <ellipse cx="50" cy="46" rx="32" ry="8" fill="${darkenColor(plateColor, 10)}" stroke="${darkenColor(plateColor, 20)}" stroke-width="0.5"/>
    <ellipse cx="50" cy="46" rx="30" ry="7" fill="${plateColor}"/>
  `;

  // Broth
  const broth = `
    <ellipse cx="50" cy="48" rx="28" ry="6" fill="${primaryColor}" opacity="0.4"/>
  `;

  // Noodle waves
  const noodles = `
    <g stroke="${secondaryColor}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.7">
      <path d="M30,56 Q38,52 46,56 Q54,60 62,56 Q68,52 72,56"/>
      <path d="M28,62 Q36,58 44,62 Q52,66 60,62 Q66,58 70,62"/>
      <path d="M32,68 Q40,64 48,68 Q56,72 64,68"/>
    </g>
  `;

  // Egg half
  const egg = `
    <ellipse cx="64" cy="50" rx="6" ry="5" fill="white" stroke="#E0E0E0" stroke-width="0.4"/>
    <ellipse cx="64" cy="50" rx="3" ry="2.5" fill="#FFC107"/>
  `;

  // Nori rectangle
  const nori = `
    <rect x="28" y="48" width="8" height="12" rx="1" fill="#2E3B2E" opacity="0.8"/>
    <rect x="29" y="50" width="6" height="8" rx="0.5" fill="#3E4F3E" opacity="0.15"/>
  `;

  // Topping (narutomaki or green onion)
  const topping = `
    <circle cx="50" cy="52" r="4" fill="white" stroke="#E0E0E0" stroke-width="0.3"/>
    <path d="M48,52 Q50,48 52,52 Q50,56 48,52" fill="${toppingColor}" opacity="0.6"/>
  `;

  const eyes = generateFoodEyes(expression, eyeColor, 42, 52, 54, 50, 2.5);
  const mouth = generateFoodMouth(expression, 48, 56);
  const pat = generateFoodPattern(primaryColor, 50, 56, 24, 12, pattern);

  return bowl + rim + broth + noodles + egg + nori + topping + pat + eyes + mouth;
}

function generateCookie(params: FoodParams): string {
  const { primaryColor, secondaryColor, toppingColor, plateColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Plate
  const plate = generatePlate(plateColor, 50, 72, 22, 5);

  // Cookie body (round with bumpy edge)
  const body = `
    <circle cx="50" cy="50" r="22" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
    <circle cx="50" cy="50" r="20" fill="${lightenColor(primaryColor, 5)}" opacity="0.15"/>
  `;

  // Crumbly texture around edge
  const crumble = `
    <g opacity="0.3">
      <circle cx="30" cy="44" r="2" fill="${dark}"/>
      <circle cx="70" cy="46" r="1.8" fill="${dark}"/>
      <circle cx="34" cy="66" r="1.5" fill="${dark}"/>
      <circle cx="66" cy="64" r="2" fill="${dark}"/>
      <circle cx="28" cy="54" r="1.2" fill="${dark}"/>
      <circle cx="72" cy="56" r="1.5" fill="${dark}"/>
    </g>
  `;

  // Chocolate chips
  const chips = `
    <g>
      <ellipse cx="40" cy="38" rx="3" ry="2.5" fill="${toppingColor}" opacity="0.8" transform="rotate(10, 40, 38)"/>
      <ellipse cx="58" cy="40" rx="2.5" ry="2" fill="${toppingColor}" opacity="0.8" transform="rotate(-15, 58, 40)"/>
      <ellipse cx="44" cy="58" rx="3" ry="2.5" fill="${toppingColor}" opacity="0.8" transform="rotate(25, 44, 58)"/>
      <ellipse cx="60" cy="56" rx="2.5" ry="2" fill="${darkenColor(toppingColor, 10)}" opacity="0.7" transform="rotate(-20, 60, 56)"/>
      <ellipse cx="36" cy="50" rx="2" ry="1.8" fill="${toppingColor}" opacity="0.7" transform="rotate(5, 36, 50)"/>
      <ellipse cx="54" cy="62" rx="2.5" ry="2" fill="${darkenColor(toppingColor, 10)}" opacity="0.7" transform="rotate(30, 54, 62)"/>
    </g>
  `;

  // Surface cracks
  const cracks = `
    <g stroke="${secondaryColor}" stroke-width="0.6" fill="none" opacity="0.2" stroke-linecap="round">
      <path d="M42,46 Q46,44 48,48"/>
      <path d="M54,48 Q56,52 60,50"/>
    </g>
  `;

  const eyes = generateFoodEyes(expression, eyeColor, 44, 46, 56, 46, 3);
  const mouth = generateFoodMouth(expression, 50, 54);
  const pat = generateFoodPattern(primaryColor, 50, 50, 20, 20, pattern);

  return plate + body + crumble + cracks + chips + pat + eyes + mouth;
}

function generateWatermelon(params: FoodParams): string {
  const { primaryColor, toppingColor, eyeColor, expression, pattern } = params;
  const rindColor = '#4CAF50';
  const rindDark = darkenColor(rindColor, 15);

  // Crescent slice shape
  // Green rind (outer arc)
  const rind = `
    <path d="M18,58 Q50,14 82,58 Q50,64 18,58 Z" fill="${rindColor}" stroke="${rindDark}" stroke-width="0.6"/>
  `;

  // White rind layer
  const whiteRind = `
    <path d="M22,56 Q50,20 78,56 Q50,60 22,56 Z" fill="${lightenColor(rindColor, 30)}"/>
  `;

  // Red flesh
  const flesh = `
    <path d="M24,54 Q50,22 76,54 Q50,58 24,54 Z" fill="${toppingColor}" stroke="${darkenColor(toppingColor, 10)}" stroke-width="0.3"/>
    <path d="M30,52 Q50,26 70,52" fill="${lightenColor(toppingColor, 10)}" opacity="0.15"/>
  `;

  // Black seeds
  const seeds = `
    <g fill="${primaryColor}">
      <ellipse cx="38" cy="46" rx="1.5" ry="2" transform="rotate(15, 38, 46)"/>
      <ellipse cx="50" cy="40" rx="1.5" ry="2" transform="rotate(0, 50, 40)"/>
      <ellipse cx="62" cy="46" rx="1.5" ry="2" transform="rotate(-15, 62, 46)"/>
      <ellipse cx="44" cy="50" rx="1.2" ry="1.8" transform="rotate(10, 44, 50)"/>
      <ellipse cx="56" cy="50" rx="1.2" ry="1.8" transform="rotate(-10, 56, 50)"/>
    </g>
  `;

  // Juice drip
  const juice = `
    <path d="M50,58 Q50,64 48,68" stroke="${lightenColor(toppingColor, 10)}" stroke-width="1" fill="none" opacity="0.3" stroke-linecap="round"/>
  `;

  const eyes = generateFoodEyes(expression, eyeColor, 44, 42, 56, 42, 2.5);
  const mouth = generateFoodMouth(expression, 50, 48);
  const pat = generateFoodPattern(toppingColor, 50, 44, 22, 14, pattern);

  return rind + whiteRind + flesh + seeds + juice + pat + eyes + mouth;
}

export function generate(params: FoodParams): string {
  const { backgroundShape, foodType, backgroundColor } = params;

  let creature: string;
  switch (foodType) {
    case 'sushi':
      creature = generateSushi(params);
      break;
    case 'pizza':
      creature = generatePizza(params);
      break;
    case 'cupcake':
      creature = generateCupcake(params);
      break;
    case 'ice-cream':
      creature = generateIceCream(params);
      break;
    case 'donut':
      creature = generateDonut(params);
      break;
    case 'burger':
      creature = generateBurger(params);
      break;
    case 'taco':
      creature = generateTaco(params);
      break;
    case 'ramen':
      creature = generateRamen(params);
      break;
    case 'cookie':
      creature = generateCookie(params);
      break;
    case 'watermelon':
      creature = generateWatermelon(params);
      break;
    default:
      creature = generateSushi(params);
  }

  const scaledCreature = fitToCircle(creature);

  return wrapSvgWithShape(scaledCreature, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: Rng): FoodParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const foodTypes = [
    'sushi', 'pizza', 'cupcake', 'ice-cream', 'donut',
    'burger', 'taco', 'ramen', 'cookie', 'watermelon',
  ] as const;
  const expressions = ['happy', 'yummy', 'surprised', 'sleepy'] as const;
  const patterns = ['none', 'sprinkles', 'sesame', 'drizzle'] as const;

  const primaryColors = [
    '#FF8A65', '#FF7043', '#E64A19', '#BF360C',
    '#FFAB91', '#D4A056', '#A1887F', '#8D6E63',
    '#FFB74D', '#FFA726', '#FB8C00', '#F57C00',
    '#FFCC80', '#D7CCC8', '#BCAAA4', '#795548',
  ];

  const secondaryColors = [
    '#FFCC80', '#FFE0B2', '#FFF8E1', '#FFFDE7',
    '#FFF9C4', '#FFF3E0', '#FFECB3', '#FAFAFA',
  ];

  const toppingColors = [
    '#E53935', '#D32F2F', '#C62828', '#FF6F00',
    '#F9A825', '#2E7D32', '#E91E63', '#FF5722',
  ];

  const plateColors = [
    '#ECEFF1', '#F5F5F5', '#FAFAFA', '#E0E0E0',
    '#D7CCC8', '#EFEBE9', '#CFD8DC', '#BDBDBD',
  ];

  const backgroundColors = [
    '#FFF8E1', '#FFF3E0', '#FFECB3', '#FFE0B2',
    '#E8F5E9', '#F3E5F5', '#E1F5FE', '#FCE4EC',
    '#FFFDE7', '#FBE9E7', '#EFEBE9', '#F1F8E9',
  ];

  const eyeColors = [
    '#1a1a1a', '#3E2723', '#212121', '#4E342E', '#263238',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    foodType: randomPick(foodTypes, rng),
    primaryColor: randomPick(primaryColors, rng),
    secondaryColor: randomPick(secondaryColors, rng),
    toppingColor: randomPick(toppingColors, rng),
    plateColor: randomPick(plateColors, rng),
    eyeColor: randomPick(eyeColors, rng),
    backgroundColor: randomPick(backgroundColors, rng),
    expression: randomPick(expressions, rng),
    pattern: randomPick(patterns, rng),
  };
}

export const food: Theme<typeof schema> = {
  name: 'Food',
  schema,
  shapeParam: 'foodType',
  generate,
  randomize,
};
