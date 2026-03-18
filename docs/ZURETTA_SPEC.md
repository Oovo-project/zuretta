# ZURETTA Implementation Spec

## Overview
- App name: `ズレッタ / zuretta`
- Format: one-smartphone party game passed around between players
- Goal: secret answers, prediction ordering, reveal, and conversation
- Stack: Next.js App Router, TypeScript, Tailwind CSS, local-only state

## Source Of Truth
- Design reference: [zuretta.pen](/c:/projects/zuretta/zuretta.pen)
- Important note:
  - `zuretta.pen` is partially broken JSON.
  - Some text nodes are mojibake.
  - Frame names, layout hierarchy, spacing patterns, and color tokens are still readable and used as the implementation reference.

## Implemented Screen Set
1. `Top`
2. `Play Settings`
3. `Player Registration`
4. `Question Display`
5. `Secret Answer`
6. `Handoff`
7. `Ranking Sort`
8. `Reveal Results`

## Mock Gaps / Ambiguities
- There is no dedicated final-session summary screen in the mock.
  - Implementation decision: the final-round version of `Reveal Results` includes the session summary and exit actions.
- There is no dedicated `How To Play` screen in the mock.
  - Implementation decision: `Top` opens a modal overlay instead of routing to another screen.
- The mock does not fully specify drag behavior details on touch devices.
  - Implementation decision: mobile-friendly drag-and-drop is implemented with `@dnd-kit`.
- The mock does not define timer behavior precisely.
  - Implementation decision: `Question Display` shows a real countdown per question using `timerSeconds` metadata.

## UX Principles Preserved From The Mock
- Cream-to-amber vertical background gradient
- Large rounded CTA buttons
- Soft card shadows
- Heavy display typography for main headings
- Compact single-task mobile layouts
- Warm orange/yellow gradient accents

## Directory Structure
```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  screens/
    handoff-screen.tsx
    play-settings-screen.tsx
    player-registration-screen.tsx
    question-display-screen.tsx
    ranking-sort-screen.tsx
    reveal-results-screen.tsx
    secret-answer-screen.tsx
    top-screen.tsx
  ui/
    answer-input.tsx
    primitives.tsx
    sortable-player-card.tsx
  zuretta-app.tsx
docs/
  ZURETTA_SPEC.md
lib/
  game-engine.ts
  question-bank.ts
types/
  game.ts
```

## Core Domain Model

### Settings
- `playerCount`
- `category`
- `mode`
- `rounds`

### Players
- Stable `id`
- `name`
- `color`
- `seat`
- `order`

### Questions
Each question contains:
- `id`
- `category`
- `text`
- `answerType`
- `min`
- `max`
- `step`
- `defaultValue`
- `unit`
- `minLabel`
- `maxLabel`
- `instructionText`
- `rankingHint`
- `sortOrder`
- `difficulty`
- `spicyLevel`
- `tags`
- `timerSeconds`
- `scaleLabels?`

### Session State
- current screen
- current round index
- selected round deck
- current player index
- answers by question id
- predicted player order by question id
- round results by question id
- cumulative score
- compatibility summary

## Question Bank Design
- Five categories:
  - `acquaintance`
  - `friends`
  - `romance`
  - `party`
  - `light`
- Minimum content target met:
  - 40 questions per category
  - 200 questions total
- Metadata-driven answer UI:
  - `number_slider`
  - `percentage_slider`
  - `scale_1_5`
  - `scale_1_10`
  - `stepper`
  - `custom_scale`

## Flow
1. `Top` opens the game or rules modal.
2. `Play Settings` stores player count, category, mode, and rounds.
3. `Player Registration` collects exact player count and lets the order shuffle.
4. `Question Display` shows the round intro, category, hint, and countdown.
5. `Secret Answer` changes input UI according to the question metadata.
6. `Handoff` confirms save and protects the pass-the-phone flow.
7. `Ranking Sort` gathers the group prediction order.
8. `Reveal Results` compares prediction vs actual order and advances the session.

## Scoring Rules

### Normal
- Full reveal experience
- Exact-match count shown as a light reference

### Scored
- Exact-match count per round
- Session cumulative total

### Compatibility
- Round reveal still works the same
- Session summary computes the closest pair from normalized answer distance

## Persistence
- Entire reducer state is saved to `localStorage`
- Refresh-safe during MVP play
- Client-side only, no database

## Handoff Notes For The Next Engineer
- The design reference is usable, but not lossless. When a detail is missing, preserve the existing visual language instead of inventing a new one.
- Do not weaken the question model into plain strings. The metadata layer is the core extension point.
- If adding categories later, follow the same authored-seed pattern in `lib/question-bank.ts`.
- If adding online multiplayer later, the current reducer state shape is a good candidate for serialization.
