import { HeartHandshake, Sparkles, Trophy } from "lucide-react";

import { formatAnswer } from "@/lib/game-engine";
import type {
  CompatibilityPair,
  GameMode,
  Player,
  Question,
  RoundResult,
} from "@/types/game";

import {
  PrimaryButton,
  ScreenContainer,
  ScreenHeading,
  SecondaryButton,
  SectionCard,
} from "../ui/primitives";

export function RevealResultsScreen({
  question,
  result,
  roundIndex,
  totalRounds,
  mode,
  totalScore,
  players,
  compatibilityPair,
  onNext,
  onReset,
}: {
  question: Question;
  result: RoundResult;
  roundIndex: number;
  totalRounds: number;
  mode: GameMode;
  totalScore: number;
  players: Player[];
  compatibilityPair: CompatibilityPair | null;
  onNext: () => void;
  onReset: () => void;
}) {
  const isFinalRound = roundIndex === totalRounds - 1;
  const pairNames = compatibilityPair
    ? compatibilityPair.pair
        .map((playerId) => players.find((player) => player.id === playerId)?.name ?? "")
        .join(" × ")
    : "";

  return (
    <ScreenContainer>
      <div className="space-y-5">
        <ScreenHeading title="結果発表！" subtitle={question.text} center />

        <div className="space-y-2">
          <div className="flex items-center justify-between px-4 text-xs font-semibold text-amberglow-700">
            <span>予想順</span>
            <span>実際の回答</span>
          </div>
          {result.rows.map((row) => (
            <div
              key={row.playerId}
              className="flex items-center justify-between rounded-[20px] border border-cream-300 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBEB_100%)] px-4 py-3 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-bold text-ink-400">{row.predictedRank}</div>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold text-white"
                  style={{ background: row.playerColor }}
                >
                  {row.actualRank}
                </div>
                <div>
                  <div className="font-semibold text-ink-900">{row.playerName}</div>
                  <div className="text-xs font-medium text-ink-500">
                    {row.isExactMatch ? "位置ぴったり" : `正解位置 ${row.actualRank} 位`}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amberglow-600 to-amberglow-400 bg-clip-text font-display text-2xl font-extrabold text-transparent">
                {formatAnswer(question, row.value)}
              </div>
            </div>
          ))}
        </div>

        <SectionCard className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-amberglow-700">
            <Trophy className="h-4 w-4" />
            {mode === "scored" ? "累計スコア" : "このラウンドの一致数"}
          </div>
          <div className="font-display text-2xl font-extrabold text-amberglow-600">
            {mode === "scored"
              ? `${totalScore} 点`
              : `${result.exactMatches} / ${result.rows.length}`}
          </div>
        </SectionCard>

        {isFinalRound && mode === "compatibility" && compatibilityPair ? (
          <SectionCard className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amberglow-700">
              <HeartHandshake className="h-4 w-4" />
              今回いちばん近かったペア
            </div>
            <div className="font-display text-2xl font-extrabold text-ink-900">
              {pairNames}
            </div>
            <div className="text-sm font-medium text-ink-500">
              回答の近さ {compatibilityPair.score}%
            </div>
          </SectionCard>
        ) : null}

        {isFinalRound && mode === "scored" ? (
          <SectionCard className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amberglow-700">
              <Sparkles className="h-4 w-4" />
              セッション結果
            </div>
            <div className="font-display text-2xl font-extrabold text-ink-900">
              合計 {totalScore} 点
            </div>
            <div className="text-sm font-medium text-ink-500">
              予想が当たった位置の数をそのまま加算しています。
            </div>
          </SectionCard>
        ) : null}
      </div>

      <div className="space-y-3">
        <PrimaryButton onClick={onNext}>
          {isFinalRound
            ? "トップへ戻る"
            : `次のラウンドへ (${roundIndex + 2}/${totalRounds})`}
        </PrimaryButton>
        <SecondaryButton onClick={onReset}>最初の画面に戻る</SecondaryButton>
      </div>
    </ScreenContainer>
  );
}
