import { ArrowRight, Check, EyeOff } from "lucide-react";

import type { Player } from "@/types/game";

import {
  PrimaryButton,
  ProgressDots,
  ScreenContainer,
  SectionCard,
} from "../ui/primitives";

export function HandoffScreen({
  answeredCount,
  totalPlayers,
  nextPlayer,
  onNext,
}: {
  answeredCount: number;
  totalPlayers: number;
  nextPlayer: Player;
  onNext: () => void;
}) {
  return (
    <ScreenContainer className="justify-center">
      <div className="flex flex-1 flex-col justify-center gap-10 text-center">
        <div className="space-y-6">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[radial-gradient(circle,#DCFCE7_0%,#BBF7D0_100%)] shadow-[0_12px_28px_rgba(22,163,74,0.2)]">
            <Check className="h-11 w-11 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-[30px] font-extrabold text-ink-900">
              回答を保存しました
            </h2>
            <div className="flex justify-center">
              <ProgressDots current={answeredCount} total={totalPlayers} />
            </div>
            <p className="text-sm font-semibold text-amberglow-700">
              {answeredCount} / {totalPlayers} 人が回答済み
            </p>
          </div>
        </div>

        <SectionCard className="space-y-3 text-center">
          <div className="text-sm font-semibold text-amberglow-700">
            次は {nextPlayer.name} さん
          </div>
          <p className="text-sm font-medium text-ink-500">
            画面を隠してから渡してください
          </p>
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-cream-50 px-4 py-2 text-xs font-bold text-amberglow-700">
            <EyeOff className="h-4 w-4" />
            周りに見せないで回そう
          </div>
        </SectionCard>

        <PrimaryButton onClick={onNext}>
          次の人へ渡す
          <ArrowRight className="ml-2 h-5 w-5" />
        </PrimaryButton>
      </div>
    </ScreenContainer>
  );
}
