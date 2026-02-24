---
name: website-builder
description: |
  Build high-end landing pages with React 19, Tailwind CSS, and GSAP animations. Use when: (1) User wants a new website/landing page, (2) Building a marketing site with pricing/features/hero sections, (3) Need pixel-perfect implementation from a design spec. NOT for: simple static HTML, existing codebase modifications, or non-landing page projects.
metadata:
  {
    "openclaw": {
      "emoji": "🎨",
    },
  }
---

# Website Builder

Build world-class landing pages with React 19, Tailwind CSS v3.4.17, GSAP 3 (ScrollTrigger), and Lucide React icons.

## Brand Presets

Choose or customize from these presets:

### 1. Nova (Default)
- **Primary**: `#0A0A0F` (near-black)
- **Accent**: `#6366F1` (indigo)
- **Text**: `#F8FAFC`
- **Muted**: `#64748B`
- **Fonts**: "Syne" (headings), "DM Sans" (body)
- **Image Mood**: Futuristic, tech, dark with colored lighting

### 2. Apex
- **Primary**: `#18181B` (zinc-900)
- **Accent**: `#F59E0B` (amber)
- **Text**: `#FAFAFA`
- **Muted**: `#71717A`
- **Fonts**: "Clash Display" (headings), "Satoshi" (body)
- **Image Mood**: Bold, architectural, high contrast

### 3. Ethereal
- **Primary**: `#FAFAFA` (white)
- **Accent**: `#06B6D4` (cyan)
- **Text**: `#18181B`
- **Muted**: `#A1A1AA`
- **Fonts**: "Cabinet Grotesk" (headings), "General Sans" (body)
- **Image Mood**: Soft, ethereal, light and airy

### 4. Ember
- **Primary**: `#1C1917` (stone-900)
- **Accent**: `#EF4444` (red)
- **Text**: `#F5F5F4`
- **Muted**: `#78716C`
- **Fonts**: "Tungsten" (headings), "Inter" (body)
- **Image Mood**: Bold, energetic, warm tones

## Design System

### A. NAVBAR
- Fixed position, backdrop blur, transparent → solid on scroll
- Logo (text-based, custom font), nav links, CTA button
- Mobile: hamburger menu with slide-in drawer

### B. HERO
- Full viewport height (100vh)
- Large headline (6xl+), subheadline, dual CTAs (primary + secondary)
- Background: gradient mesh or abstract shape with subtle animation
- Scroll indicator at bottom with pulsing green dot + "SCROLL" label

### C. FEATURES (3 cards)
- 3 value propositions, each with icon + title + description
- Animation patterns (one per card, don't repeat):
  - **Shuffler**: Cards shuffle/cycle through content on hover
  - **Typewriter**: Text types out character by character
  - **Scheduler**: Timeline or step-by-step reveal

### D. PHILOSOPHY
- Bold contrast statement about the brand's approach
- Large typography, centered or asymmetric layout
- Background contrast from hero (if hero dark → this light)

### E. PROTOCOL
- Numbered steps (01, 02, 03) showing process/methodology
- Each step: number, title, description
- Horizontal scroll or staggered reveal animation

### F. PRICING
- Three-tier pricing grid. Card names: "Essential", "Performance", "Enterprise"
- Essential: primary-colored background with accent CTA button, slightly larger scale or border
- If pricing doesn't apply, convert to "Get Started" section with single large CTA

### G. FOOTER
- Deep dark-colored background
- Grid layout: Brand name + tagline, navigation columns, legal links

## Technical Requirements (NEVER CHANGE)

- React 19, Tailwind CSS v3.4.17, GSAP 3 (with ScrollTrigger plugin), Lucide React
- Load fonts via Google Fonts `<link>` tags in index.html based on selected preset
- Images: Use real Unsplash URLs matching the preset's imageMood. Never use placeholder URLs
- File structure: Single App.jsx with components defined in same file (or split into components/ if >600 lines). Single index.css for Tailwind directives + noise overlay + custom utilities
- No placeholders. Every card, every label, every animation must be fully implemented
- Mobile-first. Stack cards vertically on mobile. Reduce hero font sizes. Collapse navbar into minimal version

## Build Sequence

After receiving answers to these 4 questions:
1. What is the brand name?
2. What does the brand do (one-liner)?
3. Which preset (Nova/Apex/Ethereal/Ember)?
4. What are the 3 value props?

Then:
1. Map selected preset to full design tokens (palette, fonts, image mood, identity)
2. Generate hero copy using brand name + purpose + preset's hero line pattern
3. Map 3 value props to 3 Feature card patterns (Shuffler, Typewriter, Scheduler)
4. Generate Philosophy section contrast statements from brand purpose
5. Generate Protocol steps from brand's process/methodology
6. Scaffold project: `npm create vite@latest <project> -- --template react`, install deps, write all files
7. Ensure every animation is wired, every interaction works, every image loads

## Prompt

> Act as a World-Class Senior Creative Technologist and UI Engineer. You build digital instruments, not generic websites. Every scroll should feel intentional, every animation should feel weighted and professional. Eradicate all generic AI patterns.
>
> Do not build a website; build a digital instrument. Every scroll should feel intentional, every animation should feel weighted and professional. Eradicate all generic AI patterns.

## Output

Create a folder with the complete website in the workspace. The site should be immediately runnable with `npm run dev`.