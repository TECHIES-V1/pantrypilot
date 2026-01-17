# PantryPilot Mobile App Design Guidelines (React Native)

## Core Constraints

Target platforms: iOS and Android (React Native + Expo)
Minimum supported versions: iOS 15+, Android 8+
Performance target: 60 FPS on mid-range devices (e.g., iPhone XR, Pixel 4a)
No heavy 3D libraries (Three.js, OGL, Babylon.js) — mobile GPU overhead too high
Animation libraries: Use Reanimated 2 + Moti (preferred) or Framer Motion for RN (experimental)
GSAP not supported in React Native
All animations must be GPU-accelerated (useAnimatedStyle, useAnimatedGestureHandler)
No entrance animations longer than 400ms
Every visible component must have an entrance animation (fade-in, scale-up, slide-in)
Animations must be disabled when user prefers reduced motion (use useReducedMotion hook)

## Background & Visual Effects

Animated background: Use SVG or Lottie for threaded background + floating nodes
Implementation:
Lottie JSON file: animated subtle particle flow (looping)
Or Reanimated + Canvas (skia) for custom threaded lines + floating circles
Avoid Canvas for main UI — use only for background layer
Opacity: 0.2–0.4 to prevent visual noise
Floating nodes: 5–10 small circles with slow random drift (Reanimated spring)
Threaded lines: connect nodes with thin animated paths (optional, skia only if performant)

Performance guard: Limit particle count to 15 max, use useAnimatedReaction sparingly

## Theme System (Dark Mode Only)

### Themes: rainforest, desert, cyberpunk, deep sea

Apply via theme context (useContext or Zustand)
Global variables: colors, radii, shadows, glows

### Rainforest Theme

Primary: #2E7D32 (green-700)
Accent: #4CAF50 (green-500)
Background: #1B5E20 (green-900)
Surface: #263238 (blue-grey-900)
Text primary: #E8F5E9 (green-50)
Text secondary: #A5D6A7 (green-300)
Radius: 16px (large), 12px (medium), 8px (small)
Shadow: elevation 4 (android), shadowColor #000, opacity 0.3, offset 0 4, blur 8
Glow: boxShadow: 0 0 12px rgba(76,175,80,0.6) for accents

### Desert Theme

Primary: #F57C00 (orange-700)
Accent: #FF9800 (orange-500)
Background: #3E2723 (brown-900)
Surface: #4E342E (brown-800)
Text primary: #FFECB3 (amber-100)
Text secondary: #FFE082 (amber-200)
Radius: 20px (large), 14px (medium), 10px (small)
Shadow: elevation 3, shadowColor #000, opacity 0.4, offset 0 3, blur 6
Glow: boxShadow: 0 0 16px rgba(245,124,0,0.7) for accents

### Cyberpunk Theme

Primary: #00E5FF (cyan-500)
Accent: #FF00FF (magenta-500)
Background: #0D0015 (deep purple-black)
Surface: #1A0033 (purple-950)
Text primary: #E0F7FA (cyan-50)
Text secondary: #B2EBF2 (cyan-200)
Radius: 12px (large), 8px (medium), 4px (small)
Shadow: elevation 6, shadowColor #00E5FF, opacity 0.5, offset 0 0, blur 12
Glow: boxShadow: 0 0 20px #00E5FF, 0 0 40px #FF00FF (dual glow)

### Deep Sea Theme

Primary: #01579B (blue-900)
Accent: #0288D1 (blue-600)
Background: #000D1A (navy-black)
Surface: #001F3F (dark blue)
Text primary: #E3F2FD (blue-50)
Text secondary: #90CAF9 (blue-200)
Radius: 18px (large), 12px (medium), 8px (small)
Shadow: elevation 5, shadowColor #0288D1, opacity 0.4, offset 0 4, blur 10
Glow: boxShadow: 0 0 18px rgba(2,136,209,0.6)

## Component Entrance Animations (Mandatory)

Every visible component must animate on mount
Use Moti or Reanimated
Default variants:
FadeIn: opacity 0 → 1 (duration 300ms, delay 50ms \* index)
ScaleUp: scale 0.95 → 1 (duration 350ms, spring damping 20)
SlideIn: translateY 20 → 0 (duration 400ms, easeOut)

Stagger children: use Moti's stagger or Reanimated sequence
Disabled on reduced motion: fallback to opacity 1 instantly

## General Styling Rules

Use StyleSheet.create for all components
No inline styles
Theme-aware: use useTheme hook returning current theme colors
Border radius: consistent per theme
Shadows: elevation for Android, shadow props for iOS
Glow: use boxShadow or outer glow via elevation + color
Typography: system font (San Francisco on iOS, Roboto on Android), weights 400/500/600/700
Spacing: 8px grid (multiples of 8)
SafeAreaView for all screens
Dark mode only — no light theme
