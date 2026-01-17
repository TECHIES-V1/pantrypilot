// Theme definitions per design.md
export const THEMES = {
  rainforest: {
    primary: "#2E7D32",
    accent: "#4CAF50",
    background: "#1B5E20",
    surface: "#263238",
    textPrimary: "#E8F5E9",
    textSecondary: "#A5D6A7",
    radius: { large: 16, medium: 12, small: 8 },
    shadow: {
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
    },
    glow: "rgba(76,175,80,0.6)",
  },
  desert: {
    primary: "#F57C00",
    accent: "#FF9800",
    background: "#3E2723",
    surface: "#4E342E",
    textPrimary: "#FFECB3",
    textSecondary: "#FFE082",
    radius: { large: 20, medium: 14, small: 10 },
    shadow: {
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 6,
    },
    glow: "rgba(245,124,0,0.7)",
  },
  cyberpunk: {
    primary: "#00E5FF",
    accent: "#FF00FF",
    background: "#0D0015",
    surface: "#1A0033",
    textPrimary: "#E0F7FA",
    textSecondary: "#B2EBF2",
    radius: { large: 12, medium: 8, small: 4 },
    shadow: {
      elevation: 6,
      shadowColor: "#00E5FF",
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 12,
    },
    glow: "#00E5FF",
    glowSecondary: "#FF00FF",
  },
  deepSea: {
    primary: "#01579B",
    accent: "#0288D1",
    background: "#000D1A",
    surface: "#001F3F",
    textPrimary: "#E3F2FD",
    textSecondary: "#90CAF9",
    radius: { large: 18, medium: 12, small: 8 },
    shadow: {
      elevation: 5,
      shadowColor: "#0288D1",
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
    },
    glow: "rgba(2,136,209,0.6)",
  },
} as const;

// Animation constants per design.md
export const ANIMATIONS = {
  fadeIn: { duration: 300, delay: 50 },
  scaleUp: { duration: 350, damping: 20 },
  slideIn: { duration: 400, easing: "easeOut" },
  maxEntranceDuration: 400,
  staggerDelay: 50,
} as const;

// Spacing grid (8px base)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Typography
export const TYPOGRAPHY = {
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
} as const;

// Tier limits from PRD
export const TIER_LIMITS = {
  free: {
    recipesPerMonth: 5,
    multiRecipeMerge: false,
    substitutions: false,
    nutritionalAnalysis: false,
    weeklyAiPlans: false,
  },
  plus: {
    recipesPerMonth: Infinity,
    multiRecipeMerge: true,
    substitutions: true,
    nutritionalAnalysis: false,
    weeklyAiPlans: false,
  },
  pro: {
    recipesPerMonth: Infinity,
    multiRecipeMerge: true,
    substitutions: true,
    nutritionalAnalysis: true,
    weeklyAiPlans: true,
  },
} as const;

// API endpoints
export const API = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
} as const;
