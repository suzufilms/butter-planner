export function getRgbFromHex(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getDynamicColorStyles(hexColor: string | undefined, isButter: boolean = false) {
  let cleanHex = hexColor || (isButter ? '#7A6031' : '#007AFF');
  
  // If it's a legacy preset name, map it to elegant high-end colors
  const presetMap: Record<string, string> = {
    blue: '#A3C8FF',  // Pastel Blue
    red: '#FFADAD',   // Pastel Red
    yellow: '#FFE699',// Pastel Yellow
    green: '#B2F0D0', // Pastel Green
    orange: '#FFD1A9',// Pastel Orange
    gray: '#CBD5E1',  // Pastel Gray
    purple: '#E3C1FF',// Pastel Purple
    pink: '#FFC6FF',  // Pastel Pink
    teal: '#B8F4F2',  // Pastel Teal
    indigo: '#C7D2FE',// Pastel Indigo
    cocoa: '#EAD1C3', // Pastel Cocoa
    sage: '#D6EFA6'   // Pastel Sage
  };

  if (cleanHex && !cleanHex.startsWith('#')) {
    cleanHex = presetMap[cleanHex] || '#CBD5E1';
  }

  const rgb = getRgbFromHex(cleanHex) || { r: 203, g: 213, b: 225 };
  
  // Darken the RGB values to ensure excellent legibility as text
  const darkenFactor = 0.55; 
  const dr = Math.floor(rgb.r * darkenFactor);
  const dg = Math.floor(rgb.g * darkenFactor);
  const db = Math.floor(rgb.b * darkenFactor);

  return {
    bg: isButter ? '#F5F1E7' : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
    bgHover: isButter ? '#EBE6D8' : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.23)`,
    border: isButter ? '#E5DCBE' : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.32)`,
    text: isButter ? '#61533F' : `rgb(${dr}, ${dg}, ${db})`,
    badgeBg: isButter ? '#E6E1D4' : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`,
    dot: cleanHex,
    solid: cleanHex
  };
}

export const colorsPresetList = [
  '#CBD5E1', // Pastel Gray
  '#A3C8FF', // Pastel Blue
  '#FFADAD', // Pastel Red
  '#FFE699', // Pastel Yellow
  '#B2F0D0', // Pastel Green
  '#FFD1A9', // Pastel Orange
  '#E3C1FF', // Pastel Purple
  '#FFC6FF', // Pastel Pink
  '#B8F4F2', // Pastel Teal
  '#C7D2FE', // Pastel Indigo
  '#EAD1C3', // Pastel Cocoa
  '#D6EFA6'  // Pastel Sage
];
