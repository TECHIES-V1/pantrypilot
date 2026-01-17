import { THEMES } from "../constants";

/**
 * Get theme colors by theme name
 */
export const getTheme = (themeName: App.ThemeName) => {
  return THEMES[themeName];
};

/**
 * Generate a UUID v4
 */
export const generateId = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Debounce function for input handling
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Format timestamp to readable date
 */
export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Calculate Levenshtein distance for ingredient deduplication
 */
export const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

/**
 * Calculate similarity percentage between two strings
 */
export const stringSimilarity = (a: string, b: string): number => {
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 100;
  return Math.round(((maxLength - distance) / maxLength) * 100);
};

/**
 * Convert unit abbreviations to standard form
 */
export const normalizeUnit = (unit: string): string => {
  const unitMap: Record<string, string> = {
    tbsp: "tablespoon",
    tsp: "teaspoon",
    oz: "ounce",
    lb: "pound",
    lbs: "pound",
    g: "gram",
    kg: "kilogram",
    ml: "milliliter",
    l: "liter",
    c: "cup",
    pt: "pint",
    qt: "quart",
    gal: "gallon",
  };

  const normalized = unit.toLowerCase().trim();
  return unitMap[normalized] || normalized;
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
