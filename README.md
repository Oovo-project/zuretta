# ズレッタ / zuretta

スマホ1台を参加者同士で回しながら遊ぶ、秘密回答型のパーティーゲーム Web アプリです。  
各プレイヤーが他の人に見られないように回答し、全員回答後に「みんなで回答順を予想」して、公開時のズレや意外性を楽しむ構成です。

## 概要

- アプリ名: `ズレッタ / zuretta`
- 形式: スマホ1台を回して遊ぶローカルパーティーゲーム
- 技術構成: Next.js App Router / TypeScript / Tailwind CSS
- 状態管理: React の `useReducer`
- データ保存: `localStorage`
- バックエンド / DB: なし

## 現在の実装内容

以下の 8 画面を実装済みです。

1. Top
2. Play Settings
3. Player Registration
4. Question Display
5. Secret Answer
6. Handoff
7. Ranking Sort
8. Reveal Results

ゲームとしては、設定 → プレイヤー登録 → お題表示 → 秘密回答 → 受け渡し → 予想並び替え → 結果発表、まで一通り遊べる状態です。

## お題設計

このアプリのコアは question bank です。  
現在は以下の 5 カテゴリに対応しています。

- 初対面向け
- 友達向け
- 恋愛寄り
- 飲み会向け
- ライト

各カテゴリ 40 問、合計 200 問を収録しています。

各お題は単なる文字列ではなく、以下のような metadata を持っています。

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
- `scaleLabels`

この metadata により、Secret Answer 画面で回答 UI が切り替わります。

- スライダー
- パーセンテージスライダー
- 1〜5 評価
- 1〜10 評価
- ステッパー
- カスタム段階スケール

## デザイン参照

元デザインは [zuretta.pen](/c:/projects/zuretta/zuretta.pen) を参照しています。  
ただしこのファイルは一部文字化けと JSON 崩れがあるため、実装時は以下を優先しています。

- フレーム構造
- 余白感
- 暖色グラデーション
- 角丸カード
- 大きい CTA ボタン
- モバイル前提の 1 画面 1 操作

## ディレクトリ構成

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
  utils.ts
types/
  game.ts
```

## 重要ファイル

- エントリ: [page.tsx](/c:/projects/zuretta/app/page.tsx)
- アプリ本体: [zuretta-app.tsx](/c:/projects/zuretta/components/zuretta-app.tsx)
- お題データ: [question-bank.ts](/c:/projects/zuretta/lib/question-bank.ts)
- ゲームロジック: [game-engine.ts](/c:/projects/zuretta/lib/game-engine.ts)
- 型定義: [game.ts](/c:/projects/zuretta/types/game.ts)
- 引き継ぎ仕様書: [ZURETTA_SPEC.md](/c:/projects/zuretta/docs/ZURETTA_SPEC.md)

## ローカル起動

```bash
npm install
npm run dev
```

本番ビルド確認:

```bash
npm run build
```

## 仕様上の補足

- `How To Play` 専用画面はなく、Top のモーダルで説明しています。
- 最終結果専用の独立画面はなく、最終ラウンドの結果発表画面を拡張して対応しています。
- 結果発表画面には、ラウンドに関係なく最初の画面へ戻るボタンがあります。
- お題表示画面には、回答前であれば同カテゴリ内の未使用お題へ差し替える「お題を変える」ボタンがあります。

## 引き継ぎ時に最初に読むべきもの

全体像を把握したい場合は、まず [ZURETTA_SPEC.md](/c:/projects/zuretta/docs/ZURETTA_SPEC.md) を読んでください。  
README は概要用、`ZURETTA_SPEC.md` は引き継ぎ用の詳細資料です。
