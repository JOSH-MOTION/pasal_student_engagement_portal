---
name: Academic Distinction
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#454653'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757684'
  outline-variant: '#c5c5d5'
  surface-tint: '#4155bb'
  primary: '#001057'
  on-primary: '#ffffff'
  primary-container: '#001f8b'
  on-primary-container: '#7c8ff9'
  inverse-primary: '#bac3ff'
  secondary: '#745b00'
  on-secondary: '#ffffff'
  secondary-container: '#fdcc14'
  on-secondary-container: '#6e5700'
  tertiary: '#181a1b'
  on-tertiary: '#ffffff'
  tertiary-container: '#2d2f2f'
  on-tertiary-container: '#959697'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#00115a'
  on-primary-fixed-variant: '#263ca2'
  secondary-fixed: '#ffe08b'
  secondary-fixed-dim: '#f1c100'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 16px
  container-padding-desktop: 32px
  gutter: 24px
  section-gap: 48px
---

## Brand & Style

This design system establishes a premium, authoritative, and modern identity for public administration students. The aesthetic balances the heritage of the University of Ghana with forward-thinking digital interfaces. 

The style is characterized by **Refined Glassmorphism**. It utilizes soft backdrop blurs and subtle translucency to create depth without clutter. The user experience should evoke a sense of organized "intellectual calm," where high-density information is presented through a spacious, professional dashboard lens. The interface prioritizes clarity, accessibility, and a seamless transition between mobile utility and desktop productivity.

## Colors

The palette is anchored by the deep, institutional **Primary Blue**, representing stability and governance. **Gold** is used strategically as an accent for high-priority actions and achievement states, ensuring it provides a sophisticated pop without overwhelming the academic tone.

- **Primary Blue (#001F8B):** Used for headers, primary buttons, and active navigation states.
- **Gold (#F5C400):** Reserved for call-to-actions, badges, and progress indicators.
- **Surface White (#FFFFFF):** The base for glass containers and cards.
- **Neutral Slate:** Used for body text and secondary metadata to ensure high legibility.
- **Interactive States:** Use a 10% opacity overlay of the primary color for hover states on light surfaces.

## Typography

The typography system uses a tri-font approach to differentiate between branding, content, and utility.

1. **Hanken Grotesk (Headlines):** A sharp, contemporary sans-serif that provides a premium "tech-forward" academic feel.
2. **Inter (Body):** Selected for its exceptional readability in data-heavy dashboard environments.
3. **Geist (Labels/Mono):** Used for metadata, form labels, and small UI hints to give a precise, systematic feel to the student portal.

All headings should use a tight letter-spacing to maintain a professional, "editorial" appearance. Body text remains generous in line-height to reduce cognitive load during long reading sessions.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **single-column stack** for mobile. 

- **Desktop:** 1200px max-width container, centered. Large 32px margins to create a "portal" feel rather than a full-bleed site.
- **Mobile:** Prioritize thumb-zone interactions. Side margins are 16px.
- **Rhythm:** An 8px linear scale is used for all padding and margins. 
- **Transitions:** Layout changes should be accompanied by a 300ms "Slide-Up" entrance for new page content to reinforce the premium app feel.

## Elevation & Depth

This system rejects traditional heavy shadows in favor of **Tonal Layers and Glassmorphism**.

- **Level 1 (Base):** Subtle light-grey background (#F8FAFC).
- **Level 2 (Cards):** Pure white background with 80% opacity and a `20px` backdrop blur. A `1px` solid border (Primary Blue at 10% opacity) provides definition without weight.
- **Level 3 (Modals/Popovers):** Solid white with a very soft, diffused ambient shadow (Color: Primary Blue, Opacity: 5%, Blur: 40px).

The "Glass" effect is used exclusively for interactive containers like student grade cards, schedule modules, and navigation bars.

## Shapes

The design system uses a **Rounded** shape language to soften the institutional feel and make the portal more approachable for students.

- **Standard Elements:** Buttons, input fields, and small cards use a `0.5rem` (8px) radius.
- **Main Containers:** Dashboard widgets and sections use `1rem` (16px) for a distinct "app-like" container look.
- **Interactive Hints:** Buttons should have a subtle transition on hover, expanding the corner radius slightly to `12px` to signal interactivity.

## Components

### Buttons
- **Primary:** Solid Primary Blue, white text, 8px rounded corners.
- **Secondary:** Transparent with Primary Blue border and text.
- **Action:** Gold background with Primary Blue text for high-importance triggers like "Submit Assignment."

### Cards
- Always use the glassmorphism treatment (80% opacity + blur).
- Include a 1px border.
- Headers within cards should use the `label-md` Geist font for a technical look.

### Input Fields
- Soft grey background (#F1F5F9).
- Transition to a Primary Blue 2px border on focus.
- Labels always sit above the field in `label-sm` weight.

### Navigation
- **Desktop:** A sticky top bar with glassmorphism. Active links are marked by a Gold underbar.
- **Mobile:** A floating "Bottom Tab Bar" containing Home, Academics, Notifications, and Profile for easy thumb reach.

### Lists & Tables
- Clean rows with `1px` divider lines. 
- Alternating row highlights using a 2% opacity Primary Blue tint.
- List items should have a 150ms "Fade-In" stagger animation on load.