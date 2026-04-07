# ズレッタ / Zuretta

**Pass your phone. Answer in secret. Guess who said what.**

スマホ1台で、その場にいる全員が楽しめるパーティーゲーム。  
各自が「こっそり回答」して、全員の回答後にみんなで予想する。ズレや意外性がそのまま盛り上がりになる。

> One phone. No app install. Just pass and play.

---

## Screenshot

<!-- Add screenshots here -->
| Top Screen | Secret Answer | Reveal Results |
|:-----------:|:-------------:|:--------------:|
| ![top](docs/screenshots/top.png) | ![answer](docs/screenshots/answer.png) | ![reveal](docs/screenshots/reveal.png) |

---

## Features

- **No backend, no signup** — runs entirely in the browser with `localStorage`
- **Pass-and-play** — one phone rotates around the group; no extra devices needed
- **200 built-in questions** across 5 categories (icebreaker / friends / romance / party / casual)
- **Rich answer types** — sliders, percentage bars, star ratings, steppers, and custom scales
- **Drag-to-rank prediction** — players reorder cards to guess who answered what before the reveal
- **Instant setup** — name your players, pick a category, and you're playing in under a minute

---

## How to Play

### English

1. **One player opens the app** and sets up the game (number of players, category)
2. **Register player names** in order
3. **Read the question aloud** — everyone listens, but only one person answers at a time
4. **Pass the phone secretly** — each player answers without showing others
5. **Predict the order** — after all answers are in, drag the cards to guess who ranked how
6. **Reveal!** — see how close (or far off) the predictions were

### 日本語

1. **1人がアプリを開いて** ゲームの設定をする（人数、カテゴリ）
2. **プレイヤー名を登録**する
3. **お題を声に出して読む** — 全員が聞く
4. **こっそりスマホを渡す** — 1人ずつ、他の人に見せずに回答
5. **予想する** — 全員が回答したら、カードを並び替えて「誰がどう答えたか」を予想
6. **結果発表!** — 予想と実際のズレを楽しむ

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 (App Router) | Fast routing, zero-config deploy on Vercel |
| Language | TypeScript 5 | Strict typing for game state and question metadata |
| Styling | Tailwind CSS 3 | Rapid mobile-first UI iteration |
| State | React `useReducer` | Predictable game state machine without external deps |
| Storage | `localStorage` | Serverless, privacy-friendly, instant persistence |
| Drag & Drop | `@dnd-kit` | Accessible, touch-friendly sortable for prediction phase |
| Icons | `lucide-react` | Consistent lightweight icon set |

**No backend. No database. No authentication.** Deliberately minimal.

---

## Architecture

```
app/
  layout.tsx              # Root layout
  page.tsx                # Entry point → mounts ZurettaApp
components/
  zuretta-app.tsx         # Top-level state machine (useReducer)
  screens/
    top-screen.tsx
    play-settings-screen.tsx
    player-registration-screen.tsx
    question-display-screen.tsx
    secret-answer-screen.tsx    # Dynamic UI based on question metadata
    handoff-screen.tsx
    ranking-sort-screen.tsx     # Drag-to-rank with @dnd-kit
    reveal-results-screen.tsx
  ui/
    answer-input.tsx            # Polymorphic input (slider / rating / stepper)
    sortable-player-card.tsx
    primitives.tsx
lib/
  game-engine.ts          # Pure game logic, no side effects
  question-bank.ts        # 200 questions with rich metadata
  utils.ts
types/
  game.ts                 # All shared TypeScript types
```

---

## Getting Started

```bash
# Clone
git clone https://github.com/Oovo-project/zuretta.git
cd zuretta

# Install
npm install

# Dev server
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm start
```

**Requirements:** Node.js 18+

**Deploy to Vercel** (recommended):

```bash
npx vercel
```

No environment variables required. Zero configuration.

---

## Author

**koki** — [@Oovo-project](https://github.com/Oovo-project)

Building tools that make real-world interactions more fun.

---

<sub>MIT License</sub>
