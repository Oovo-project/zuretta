"use client";

import { startTransition, useEffect, useMemo, useReducer, useState } from "react";
import { Info, Sparkles, X } from "lucide-react";

import {
  calculateCompatibilityPair,
  calculateRoundResult,
  createPlayer,
  defaultSettings,
  getCurrentQuestion,
  pickQuestions,
  shufflePlayers,
} from "@/lib/game-engine";
import { getQuestionsByCategory } from "@/lib/question-bank";
import type { GameSettings, GameState, Player, Question } from "@/types/game";

import { HandoffScreen } from "./screens/handoff-screen";
import { PlaySettingsScreen } from "./screens/play-settings-screen";
import { PlayerRegistrationScreen } from "./screens/player-registration-screen";
import { QuestionDisplayScreen } from "./screens/question-display-screen";
import { RankingSortScreen } from "./screens/ranking-sort-screen";
import { RevealResultsScreen } from "./screens/reveal-results-screen";
import { SecretAnswerScreen } from "./screens/secret-answer-screen";
import { TopScreen } from "./screens/top-screen";
import {
  AppShell,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  SectionCard,
} from "./ui/primitives";

type Action =
  | { type: "open-settings" }
  | { type: "toggle-how-to"; open?: boolean }
  | { type: "update-settings"; patch: Partial<GameSettings> }
  | { type: "go-registration" }
  | { type: "add-player"; name: string }
  | { type: "remove-player"; playerId: string }
  | { type: "shuffle-players" }
  | { type: "start-game"; deck: Question[] }
  | { type: "replace-current-question"; question: Question }
  | { type: "go-secret" }
  | { type: "submit-answer"; question: Question; value: number }
  | { type: "submit-prediction"; question: Question; playerIds: string[] }
  | { type: "advance-after-reveal" }
  | { type: "reset-session" }
  | { type: "hydrate"; state: GameState };

const initialState: GameState = {
  screen: "top",
  settings: defaultSettings,
  players: [],
  deck: [],
  currentRoundIndex: 0,
  currentPlayerIndex: 0,
  answersByQuestionId: {},
  predictedOrders: {},
  roundResults: {},
  cumulativeScore: 0,
  compatibilityPair: null,
  showHowTo: false,
};

function reseatPlayers(players: Player[]): Player[] {
  return players.map((player, index) => ({
    ...player,
    seat: index + 1,
    order: index + 1,
  }));
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "open-settings":
      return {
        ...state,
        screen: "settings",
      };
    case "toggle-how-to":
      return {
        ...state,
        showHowTo: action.open ?? !state.showHowTo,
      };
    case "update-settings":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.patch,
        },
      };
    case "go-registration":
      return {
        ...state,
        screen: "registration",
        players: state.players.slice(0, state.settings.playerCount),
      };
    case "add-player": {
      if (state.players.length >= state.settings.playerCount) {
        return state;
      }

      return {
        ...state,
        players: [
          ...state.players,
          createPlayer(action.name, state.players.length),
        ],
      };
    }
    case "remove-player":
      return {
        ...state,
        players: reseatPlayers(
          state.players.filter((player) => player.id !== action.playerId),
        ),
      };
    case "shuffle-players":
      return {
        ...state,
        players: shufflePlayers(state.players),
      };
    case "start-game":
      return {
        ...state,
        screen: "question",
        deck: action.deck,
        currentRoundIndex: 0,
        currentPlayerIndex: 0,
        answersByQuestionId: {},
        predictedOrders: {},
        roundResults: {},
        cumulativeScore: 0,
        compatibilityPair: null,
        showHowTo: false,
      };
    case "replace-current-question": {
      const nextDeck = [...state.deck];
      nextDeck[state.currentRoundIndex] = action.question;

      return {
        ...state,
        deck: nextDeck,
      };
    }
    case "go-secret":
      return {
        ...state,
        screen: "secret",
      };
    case "submit-answer": {
      const existingAnswers = state.answersByQuestionId[action.question.id] ?? [];
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (!currentPlayer) {
        return state;
      }

      const updatedAnswers = [
        ...existingAnswers.filter((entry) => entry.playerId !== currentPlayer.id),
        {
          playerId: currentPlayer.id,
          questionId: action.question.id,
          value: action.value,
          answeredAt: new Date().toISOString(),
        },
      ];

      const isLastPlayer = state.currentPlayerIndex >= state.players.length - 1;

      return {
        ...state,
        answersByQuestionId: {
          ...state.answersByQuestionId,
          [action.question.id]: updatedAnswers,
        },
        currentPlayerIndex: isLastPlayer
          ? state.currentPlayerIndex
          : state.currentPlayerIndex + 1,
        screen: isLastPlayer ? "ranking" : "handoff",
      };
    }
    case "submit-prediction": {
      const answers = state.answersByQuestionId[action.question.id] ?? [];
      const roundResult = calculateRoundResult(
        action.question,
        state.players,
        answers,
        action.playerIds,
      );
      const compatibilityPair = calculateCompatibilityPair(
        state.deck,
        state.answersByQuestionId,
        state.players,
      );

      return {
        ...state,
        screen: "reveal",
        predictedOrders: {
          ...state.predictedOrders,
          [action.question.id]: action.playerIds,
        },
        roundResults: {
          ...state.roundResults,
          [action.question.id]: roundResult,
        },
        cumulativeScore: state.cumulativeScore + roundResult.exactMatches,
        compatibilityPair,
      };
    }
    case "advance-after-reveal": {
      const isFinalRound = state.currentRoundIndex >= state.deck.length - 1;
      if (isFinalRound) {
        return initialState;
      }

      return {
        ...state,
        screen: "question",
        currentRoundIndex: state.currentRoundIndex + 1,
        currentPlayerIndex: 0,
      };
    }
    case "reset-session":
      return initialState;
    default:
      return state;
  }
}

const STORAGE_KEY = "zuretta-session";

export function ZurettaApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({
          type: "hydrate",
          state: JSON.parse(saved) as GameState,
        });
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [isHydrated, state]);

  const currentQuestion = useMemo(
    () => getCurrentQuestion(state.deck, state.currentRoundIndex),
    [state.deck, state.currentRoundIndex],
  );
  const canRerollQuestion = useMemo(() => {
    if (!currentQuestion) {
      return false;
    }

    const usedQuestionIds = new Set(state.deck.map((question) => question.id));
    return getQuestionsByCategory(state.settings.category).some(
      (question) => !usedQuestionIds.has(question.id),
    );
  }, [currentQuestion, state.deck, state.settings.category]);

  const answeredCount = currentQuestion
    ? (state.answersByQuestionId[currentQuestion.id] ?? []).length
    : 0;
  const nextPlayer = state.players[state.currentPlayerIndex];
  const currentPlayer = state.players[state.currentPlayerIndex];
  const currentResult = currentQuestion
    ? state.roundResults[currentQuestion.id]
    : undefined;

  if (!isHydrated) {
    return (
      <AppShell>
        <ScreenContainer className="items-center justify-center text-center">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-amberglow-700">読み込み中…</div>
            <div className="text-xs font-medium text-ink-500">
              セッション情報を復元しています
            </div>
          </div>
        </ScreenContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {state.screen === "top" ? (
        <TopScreen
          onStart={() => dispatch({ type: "open-settings" })}
          onShowHowTo={() => dispatch({ type: "toggle-how-to", open: true })}
        />
      ) : null}

      {state.screen === "settings" ? (
        <PlaySettingsScreen
          settings={state.settings}
          onChange={(patch) => dispatch({ type: "update-settings", patch })}
          onStart={() => dispatch({ type: "go-registration" })}
        />
      ) : null}

      {state.screen === "registration" ? (
        <PlayerRegistrationScreen
          players={state.players}
          playerCount={state.settings.playerCount}
          onAddPlayer={(name) => {
            if (state.players.length >= state.settings.playerCount) {
              return false;
            }
            dispatch({ type: "add-player", name });
            return true;
          }}
          onRemovePlayer={(playerId) => dispatch({ type: "remove-player", playerId })}
          onShuffle={() => dispatch({ type: "shuffle-players" })}
          onStart={() => {
            const deck = pickQuestions(
              getQuestionsByCategory(state.settings.category),
              state.settings.rounds,
            );
            dispatch({ type: "start-game", deck });
          }}
        />
      ) : null}

      {state.screen === "question" && currentQuestion ? (
        <QuestionDisplayScreen
          question={currentQuestion}
          roundIndex={state.currentRoundIndex}
          totalRounds={state.deck.length}
          canChangeQuestion={canRerollQuestion}
          onChangeQuestion={() => {
            const usedQuestionIds = new Set(state.deck.map((question) => question.id));
            const availableQuestions = getQuestionsByCategory(
              state.settings.category,
            ).filter((question) => !usedQuestionIds.has(question.id));

            if (availableQuestions.length === 0) {
              return;
            }

            const nextQuestion =
              availableQuestions[
                Math.floor(Math.random() * availableQuestions.length)
              ];

            dispatch({
              type: "replace-current-question",
              question: nextQuestion,
            });
          }}
          onAnswer={() => dispatch({ type: "go-secret" })}
        />
      ) : null}

      {state.screen === "secret" && currentQuestion && currentPlayer ? (
        <SecretAnswerScreen
          key={`${currentQuestion.id}-${currentPlayer.id}`}
          player={currentPlayer}
          question={currentQuestion}
          onConfirm={(value) =>
            dispatch({ type: "submit-answer", question: currentQuestion, value })
          }
        />
      ) : null}

      {state.screen === "handoff" && nextPlayer ? (
        <HandoffScreen
          answeredCount={answeredCount}
          totalPlayers={state.players.length}
          nextPlayer={nextPlayer}
          onNext={() => dispatch({ type: "go-secret" })}
        />
      ) : null}

      {state.screen === "ranking" && currentQuestion ? (
        <RankingSortScreen
          key={currentQuestion.id}
          players={state.players}
          question={currentQuestion}
          onConfirm={(playerIds) =>
            dispatch({
              type: "submit-prediction",
              question: currentQuestion,
              playerIds,
            })
          }
        />
      ) : null}

      {state.screen === "reveal" && currentQuestion && currentResult ? (
        <RevealResultsScreen
          question={currentQuestion}
          result={currentResult}
          roundIndex={state.currentRoundIndex}
          totalRounds={state.deck.length}
          mode={state.settings.mode}
          totalScore={state.cumulativeScore}
          players={state.players}
          compatibilityPair={state.compatibilityPair}
          onNext={() =>
            startTransition(() => {
              dispatch({ type: "advance-after-reveal" });
            })
          }
          onReset={() => dispatch({ type: "reset-session" })}
        />
      ) : null}

      {state.showHowTo ? (
        <div className="absolute inset-0 z-20 flex items-end bg-black/25 p-4">
          <div className="w-full rounded-[32px] border border-cream-300 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-amberglow-700">
                <Info className="h-4 w-4" />
                遊び方
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: "toggle-how-to", open: false })}
                className="rounded-full border border-cream-300 p-2 text-ink-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm font-medium leading-6 text-ink-700">
              <p>1. ジャンルと人数を決めて、順番どおりにスマホを回します。</p>
              <p>2. お題を見たら、1人ずつ他の人に見せずに秘密回答します。</p>
              <p>3. 全員の回答が終わったら、みんなで小さい順・高い順を予想して並べます。</p>
              <p>4. 公開して、ズレや意外性から会話を広げるゲームです。</p>
            </div>
            <SectionCard className="mt-5 space-y-2 bg-cream-50">
              <div className="flex items-center gap-2 text-sm font-bold text-amberglow-700">
                <Sparkles className="h-4 w-4" />
                コツ
              </div>
              <p className="text-sm font-medium leading-6 text-ink-600">
                迷ったら直感で答えるとズレが出やすく、公開後の会話が広がります。
              </p>
            </SectionCard>
            <div className="mt-5 space-y-2">
              <PrimaryButton
                onClick={() => dispatch({ type: "toggle-how-to", open: false })}
              >
                閉じる
              </PrimaryButton>
              {state.screen !== "top" ? (
                <SecondaryButton onClick={() => dispatch({ type: "reset-session" })}>
                  最初からやり直す
                </SecondaryButton>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
