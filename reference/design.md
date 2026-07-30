# FIND Real Estate

## Mission
Create implementation-ready, token-driven UI guidance for FIND Real Estate that is optimized for consistency, accessibility, and fast delivery across marketing site.

## Brand
- Product/brand: FIND Real Estate
- URL: https://findrealestate.com/
- Audience: readers and knowledge seekers
- Product surface: marketing site

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: `font.family.primary=Instrument Sans`, `font.family.stack=Instrument Sans, Instrument Sans Fallback`, `font.size.base=9.65625px`, `font.weight.base=400`, `font.lineHeight.base=11.1047px`
- Typography scale: `font.size.xs=9.66px`, `font.size.sm=13.52px`, `font.size.md=15.45px`, `font.size.lg=17.38px`, `font.size.xl=19.31px`, `font.size.2xl=23.18px`, `font.size.3xl=25.11px`, `font.size.4xl=30.9px`
- Color palette: `color.text.primary=#ffffff`, `color.surface.base=#000000`, `color.focus.ring=#151717`, `color.text.inverse=#0496ff`, `color.surface.strong=#f1f1f1`
- Spacing scale: `space.1=1px`, `space.2=6px`, `space.3=9.66px`, `space.4=14.87px`, `space.5=19.31px`, `space.6=28.97px`, `space.7=38.63px`, `space.8=144.84px`
- Radius/shadow/motion tokens: `radius.xs=1.93px`, `radius.sm=100px` | `motion.duration.instant=200ms`, `motion.duration.fast=300ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: buttons (67), links (37), navigation (3), inputs (2).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
