export const QUESTION_CATEGORIES = [
  "acquaintance",
  "friends",
  "romance",
  "party",
  "light",
] as const;

export const GAME_MODES = ["normal", "scored", "compatibility"] as const;

export const ANSWER_TYPES = [
  "number_slider",
  "percentage_slider",
  "scale_1_5",
  "scale_1_10",
  "stepper",
  "custom_scale",
] as const;

export const SCREEN_IDS = [
  "top",
  "settings",
  "registration",
  "question",
  "secret",
  "handoff",
  "ranking",
  "reveal",
] as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];
export type GameMode = (typeof GAME_MODES)[number];
export type AnswerType = (typeof ANSWER_TYPES)[number];
export type ScreenId = (typeof SCREEN_IDS)[number];
export type SortOrder = "asc" | "desc";
export type Difficulty = 1 | 2 | 3;
export type SpicyLevel = 1 | 2 | 3;

export interface Question {
  id: string;
  category: QuestionCategory;
  text: string;
  answerType: AnswerType;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  minLabel: string;
  maxLabel: string;
  instructionText: string;
  rankingHint: string;
  sortOrder: SortOrder;
  difficulty: Difficulty;
  spicyLevel: SpicyLevel;
  tags: string[];
  timerSeconds: number;
  scaleLabels?: string[];
}

export interface GameSettings {
  playerCount: number;
  category: QuestionCategory;
  mode: GameMode;
  rounds: number;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  seat: number;
  order: number;
}

export interface PlayerAnswer {
  playerId: string;
  questionId: string;
  value: number;
  answeredAt: string;
}

export interface ResultRow {
  playerId: string;
  playerName: string;
  playerColor: string;
  value: number;
  predictedRank: number;
  actualRank: number;
  isExactMatch: boolean;
}

export interface RoundResult {
  questionId: string;
  predictedOrder: string[];
  actualOrder: string[];
  exactMatches: number;
  rows: ResultRow[];
}

export interface CompatibilityPair {
  pair: [string, string];
  score: number;
}

export interface GameState {
  screen: ScreenId;
  settings: GameSettings;
  players: Player[];
  deck: Question[];
  currentRoundIndex: number;
  currentPlayerIndex: number;
  answersByQuestionId: Record<string, PlayerAnswer[]>;
  predictedOrders: Record<string, string[]>;
  roundResults: Record<string, RoundResult>;
  cumulativeScore: number;
  compatibilityPair: CompatibilityPair | null;
  showHowTo: boolean;
}
