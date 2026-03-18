import type {
  CompatibilityPair,
  GameSettings,
  Player,
  PlayerAnswer,
  Question,
  ResultRow,
  RoundResult,
} from "@/types/game";

const PLAYER_COLORS = [
  "#FFCE3A",
  "#14B8A6",
  "#F472B6",
  "#FF8C00",
  "#6366F1",
  "#22C55E",
  "#EC4899",
  "#0EA5E9",
];

export const defaultSettings: GameSettings = {
  playerCount: 5,
  category: "light",
  mode: "normal",
  rounds: 5,
};

export function createPlayer(name: string, index: number): Player {
  return {
    id: `player-${crypto.randomUUID()}`,
    name,
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
    seat: index + 1,
    order: index + 1,
  };
}

export function shufflePlayers(players: Player[]): Player[] {
  const shuffled = [...players];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.map((player, index) => ({
    ...player,
    order: index + 1,
  }));
}

export function pickQuestions(deck: Question[], rounds: number): Question[] {
  const shuffled = [...deck];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, rounds);
}

export function getCurrentQuestion(
  deck: Question[],
  currentRoundIndex: number,
): Question | null {
  return deck[currentRoundIndex] ?? null;
}

export function getSortedAnswers(
  question: Question,
  players: Player[],
  answers: PlayerAnswer[],
): PlayerAnswer[] {
  const seatOrder = new Map(players.map((player) => [player.id, player.order]));
  const direction = question.sortOrder === "asc" ? 1 : -1;

  return [...answers].sort((left, right) => {
    const valueCompare = (left.value - right.value) * direction;
    if (valueCompare !== 0) {
      return valueCompare;
    }

    return (seatOrder.get(left.playerId) ?? 0) - (seatOrder.get(right.playerId) ?? 0);
  });
}

export function calculateRoundResult(
  question: Question,
  players: Player[],
  answers: PlayerAnswer[],
  predictedOrder: string[],
): RoundResult {
  const actualOrder = getSortedAnswers(question, players, answers).map(
    (answer) => answer.playerId,
  );
  const playerMap = new Map(players.map((player) => [player.id, player]));
  const answerMap = new Map(answers.map((answer) => [answer.playerId, answer]));
  const exactMatches = predictedOrder.reduce((count, playerId, index) => {
    return count + (actualOrder[index] === playerId ? 1 : 0);
  }, 0);

  const rows: ResultRow[] = predictedOrder.map((playerId, index) => {
    const player = playerMap.get(playerId);
    const answer = answerMap.get(playerId);
    const actualRank = actualOrder.indexOf(playerId) + 1;

    if (!player || !answer) {
      throw new Error("Missing player or answer while building result rows.");
    }

    return {
      playerId,
      playerName: player.name,
      playerColor: player.color,
      value: answer.value,
      predictedRank: index + 1,
      actualRank,
      isExactMatch: actualRank === index + 1,
    };
  });

  return {
    questionId: question.id,
    predictedOrder,
    actualOrder,
    exactMatches,
    rows,
  };
}

function normalizeValue(question: Question, value: number): number {
  if (question.max === question.min) {
    return 0;
  }

  return (value - question.min) / (question.max - question.min);
}

export function calculateCompatibilityPair(
  deck: Question[],
  answersByQuestionId: Record<string, PlayerAnswer[]>,
  players: Player[],
): CompatibilityPair | null {
  if (players.length < 2) {
    return null;
  }

  const pairs = players.flatMap((left, index) =>
    players.slice(index + 1).map((right) => [left.id, right.id] as [string, string]),
  );

  let bestPair: CompatibilityPair | null = null;

  for (const pair of pairs) {
    let totalDistance = 0;
    let samples = 0;

    for (const question of deck) {
      const answers = answersByQuestionId[question.id] ?? [];
      const left = answers.find((answer) => answer.playerId === pair[0]);
      const right = answers.find((answer) => answer.playerId === pair[1]);

      if (!left || !right) {
        continue;
      }

      totalDistance += Math.abs(
        normalizeValue(question, left.value) - normalizeValue(question, right.value),
      );
      samples += 1;
    }

    if (samples === 0) {
      continue;
    }

    const closeness = Math.max(0, 100 - Math.round((totalDistance / samples) * 100));
    if (!bestPair || closeness > bestPair.score) {
      bestPair = {
        pair,
        score: closeness,
      };
    }
  }

  return bestPair;
}

export function formatAnswer(question: Question, value: number): string {
  const suffix = question.unit ? ` ${question.unit}` : "";
  return `${value}${suffix}`.trim();
}
